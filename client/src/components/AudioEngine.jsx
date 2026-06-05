import { useRef, useCallback, useEffect } from 'react';

export function useAudioEngine() {
  const ctxRef     = useRef(null);
  const nodesRef   = useRef([]);
  const masterGain = useRef(null);

  // FIX 1: Only create AudioContext inside a user-gesture handler (play button click).
  // Never call getCtx() on mount — browsers will suspend it immediately.
  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    // FIX 2: Always resume — some browsers auto-suspend even after creation.
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  };

  const stop = useCallback(() => {
    nodesRef.current.forEach((node) => {
      try { node.stop?.(); } catch (_) {}
      try { node.disconnect?.(); } catch (_) {}
    });
    nodesRef.current = [];
    masterGain.current = null;
  }, []);

  // FIX 3: Expose setVolume so callers can update live audio without restarting.
  const setVolume = useCallback((v) => {
    if (masterGain.current) {
      masterGain.current.gain.setTargetAtTime(
        Math.min(Math.max(v, 0), 1),
        ctxRef.current.currentTime,
        0.05  // 50ms smooth ramp — prevents clicks
      );
    }
  }, []);

  const generateNoise = (ctx, noiseType) => {
    const sampleRate  = ctx.sampleRate;
    const bufferSize  = sampleRate * 3; // 3 seconds looped — enough to sound continuous
    const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data        = noiseBuffer.getChannelData(0);

    if (noiseType === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (noiseType === 'pink') {
      let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
      for (let i = 0; i < bufferSize; i++) {
        const w = Math.random() * 2 - 1;
        b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
        b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
        b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
        data[i] = (b0+b1+b2+b3+b4+b5+b6+w*0.5362) * 0.11;
        b6 = w * 0.115926;
      }
    } else {
      // Brown noise
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const w = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * w) / 1.02;
        lastOut  = data[i];
        data[i] *= 3.5;
      }
    }

    return noiseBuffer;
  };

  const play = useCallback(
    ({ frequency, noiseType, notchDepth, binauralBeat, volume }) => {
      stop();
      const ctx = getCtx(); // called inside click handler — safe

      // --- Noise source ---
      const source = ctx.createBufferSource();
      source.buffer = generateNoise(ctx, noiseType);
      source.loop   = true;

      // --- Notch filter (cuts the tinnitus frequency from the noise) ---
      const notch = ctx.createBiquadFilter();
      notch.type            = 'notch';
      notch.frequency.value = frequency;
      notch.gain.value      = notchDepth; // negative dB
      notch.Q.value         = 10;         // narrow notch

      // --- Master gain (FIX 3: stored in ref so setVolume can update it live) ---
      const gain = ctx.createGain();
      gain.gain.value = Math.min(Math.max(volume, 0), 1);
      masterGain.current = gain;

      source.connect(notch);
      notch.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      nodesRef.current.push(source, notch, gain);

      // --- Binaural beat (FIX 1: proper stereo via ChannelSplitter/Merger) ---
      // Two oscillators at slightly different frequencies — one per ear.
      // Requires headphones to perceive the beat effect.
      if (binauralBeat > 0) {
        const splitter = ctx.createChannelSplitter(2);
        const merger   = ctx.createChannelMerger(2);

        const oscL = ctx.createOscillator();
        oscL.type            = 'sine';
        oscL.frequency.value = 200;               // left ear base freq

        const oscR = ctx.createOscillator();
        oscR.type            = 'sine';
        oscR.frequency.value = 200 + binauralBeat; // right ear offset

        const binGain = ctx.createGain();
        binGain.gain.value = volume * 0.2; // quieter than noise

        // Route left osc → merger input 0 (left channel)
        // Route right osc → merger input 1 (right channel)
        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);
        merger.connect(binGain);
        binGain.connect(ctx.destination);

        oscL.start();
        oscR.start();
        nodesRef.current.push(oscL, oscR, merger, binGain);
      }
    },
    [stop]
  );

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stop();
      ctxRef.current?.close();
    };
  }, [stop]);

  return { play, stop, setVolume };
}
