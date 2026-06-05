const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function analyzeTinnitus(description) {
  const prompt = `You are an expert in audiology and tinnitus sound therapy.
A patient describes their tinnitus as follows: "${description}"

Based on this description, generate a personalised sound masking profile to help relieve their symptoms.
Return ONLY a valid JSON object — no markdown, no explanation outside the JSON, no code fences.
Use exactly this schema:
{
  "frequency": <integer between 20 and 18000, the best masking centre frequency in Hz>,
  "noiseType": <exactly one of: "white", "pink", or "brown">,
  "notchDepth": <integer between -30 and -5, the recommended notch filter depth in dB>,
  "binauralBeat": <integer between 0 and 40, the binaural beat offset in Hz; use 0 if not recommended>,
  "volume": <float between 0.1 and 0.8, the suggested starting volume>,
  "aiSummary": <string, 2 to 3 sentences explaining why this profile suits the patient's description>
}`;

  const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${err}`);
  }

  const data = await response.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!raw) throw new Error('No content returned from Gemini');

  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}
