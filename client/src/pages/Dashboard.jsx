import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { analyzeSound, getProfiles, saveProfile, deleteProfile } from '../services/api.js';
import { useAudioEngine } from '../components/AudioEngine.jsx';

const NOISE_LABELS = { white: 'White noise', pink: 'Pink noise', brown: 'Brown noise' };

export default function Dashboard() {
  const { user, logout }    = useAuth();
  const [description, setDescription] = useState('');
  const [profile, setProfile]         = useState(null);
  const [profiles, setProfiles]       = useState([]);
  const [playing, setPlaying]         = useState(false);
  const [loading, setLoading]         = useState(false);
  const [saving, setSaving]           = useState(false);
  const [profileName, setProfileName] = useState('');
  const [error, setError]             = useState('');
  const [saveMsg, setSaveMsg]         = useState('');
  const [volume, setVolumeState] = useState(0.5);
  const { play, stop, setVolume } = useAudioEngine();

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolumeState(v);
    setVolume(v);
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const { data } = await getProfiles();
      setProfiles(data);
    } catch (_) {}
  };

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setError('');
    setLoading(true);
    stopAudio();
    try {
      const { data } = await analyzeSound(description);
      setProfile(data);
      setProfileName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stopAudio = () => {
    stop();
    setPlaying(false);
  };

  const handlePlayToggle = () => {
    if (!profile) return;
    if (playing) {
      stopAudio();
    } else {
      play(profile);
      setPlaying(true);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSaveMsg('');
    try {
      await saveProfile({
        ...profile,
        name: profileName.trim() || 'My sound profile',
        description,
      });
      setSaveMsg('Profile saved!');
      setProfileName('');
      loadProfiles();
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (_) {
      setSaveMsg('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleLoadProfile = (p) => {
    stopAudio();
    setProfile({
      frequency:    p.frequency,
      noiseType:    p.noiseType,
      notchDepth:   p.notchDepth,
      binauralBeat: p.binauralBeat,
      volume:       p.volume,
      aiSummary:    p.aiSummary,
    });
    setDescription(p.description || '');
    setProfileName(p.name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this profile?')) return;
    try {
      await deleteProfile(id);
      loadProfiles();
      setSaveMsg('Profile deleted.');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg font-medium text-gray-900">TinnitusTuner</h1>
            <p className="text-xs text-gray-400">AI-powered sound masking</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Hi, {user}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-5">

        {/* Step 1 — Describe tinnitus */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Step 1</p>
          <h2 className="text-base font-medium text-gray-900 mb-4">Describe your tinnitus</h2>
          <textarea
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400"
            rows={4}
            placeholder="Describe what you hear — e.g. 'High-pitched constant ringing in my right ear, like a tea kettle. Worse at night and in quiet rooms. Sometimes pulses with my heartbeat.'"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
          <button
            onClick={handleAnalyze}
            disabled={loading || description.trim().length < 10}
            className="mt-3 bg-teal-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generating profile…' : 'Generate sound profile'}
          </button>
        </section>

        {/* Step 2 — AI profile result */}
        {profile && (
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Step 2</p>
            <h2 className="text-base font-medium text-gray-900 mb-3">Your AI sound profile</h2>

            {profile.aiSummary && (
              <p className="text-sm text-gray-600 leading-relaxed mb-5 bg-teal-50 border border-teal-100 rounded-lg px-4 py-3">
                {profile.aiSummary}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                ['Frequency', `${profile.frequency} Hz`],
                ['Noise type', NOISE_LABELS[profile.noiseType] || profile.noiseType],
                ['Notch depth', `${profile.notchDepth} dB`],
                ['Binaural beat', profile.binauralBeat > 0 ? `${profile.binauralBeat} Hz` : 'Off'],
              ].map(([label, value]) => (
                <div key={label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-gray-800">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={handlePlayToggle}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  playing
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                {playing ? '⏹ Stop' : '▶ Play'}
              </button>

              {playing && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Vol</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24 accent-teal-600"
                  />
                  <span className="text-xs text-gray-400 w-8">{Math.round(volume * 100)}%</span>
                </div>
              )}

              <input
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-32 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Name this profile…"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />

              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900 disabled:opacity-40 transition-colors"
              >
                {saving ? 'Saving…' : 'Save profile'}
              </button>
            </div>

            {saveMsg && (
              <p className={`text-sm mt-3 ${saveMsg.includes('Failed') ? 'text-red-500' : 'text-teal-600'}`}>
                {saveMsg}
              </p>
            )}
          </section>
        )}

        {/* Saved profiles */}
        {profiles.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-medium text-gray-900 mb-4">
              Saved profiles
              <span className="ml-2 text-xs font-normal text-gray-400">{profiles.length}</span>
            </h2>
            <div className="space-y-3">
              {profiles.map((p) => (
                <div
                  key={p._id}
                  className="flex items-start justify-between gap-4 border border-gray-100 rounded-lg px-4 py-3 hover:border-gray-200 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {p.frequency} Hz · {NOISE_LABELS[p.noiseType]} · {p.notchDepth} dB notch
                      {p.binauralBeat > 0 ? ` · ${p.binauralBeat} Hz binaural` : ''}
                    </p>
                    {p.description && (
                      <p className="text-xs text-gray-400 mt-1 truncate">{p.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleLoadProfile(p)}
                      className="text-xs text-teal-600 hover:text-teal-800 font-medium"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {profiles.length === 0 && !profile && (
          <div className="text-center py-12 text-gray-400 text-sm">
            Describe your tinnitus above to generate your first sound profile
          </div>
        )}

      </main>
    </div>
  );
}
