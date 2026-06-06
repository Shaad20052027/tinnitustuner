# TinnitusTuner 🎵

> AI-powered personalised sound masking therapy for tinnitus relief

**Live App:** [tinnitustuner.vercel.app](https://tinnitustuner.vercel.app) &nbsp;|&nbsp; **API:** [tinnitustuner.onrender.com](https://tinnitustuner.onrender.com)

---

## What is TinnitusTuner?

Tinnitus affects over 750 million people worldwide — a constant ringing, buzzing, or hissing sound with no external source. Most people have no tools to help manage it.

TinnitusTuner lets you **describe your tinnitus in plain language** and instantly generates a personalised sound masking profile using Google Gemini AI. The app then synthesises that sound live in your browser using the Web Audio API — no downloads, no plugins.

---

## Features

- **AI sound profile generation** — describe your tinnitus, Gemini returns a structured audio profile (frequency, noise type, notch depth, binaural beat)
- **Real-time audio synthesis** — Web Audio API generates white, pink, or brown noise with a notch filter cut at your tinnitus frequency
- **Binaural beat therapy** — optional binaural beat overlay for deeper relaxation
- **Live volume control** — adjust volume without restarting the audio
- **Save & reload profiles** — save your best-relief profiles and replay them anytime
- **User authentication** — each user has their own private profiles (JWT + bcrypt)

---

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Axios
- Web Audio API (native browser — no library)

### Backend
- Node.js + Express
- MongoDB Atlas + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Google Gemini 2.0 Flash API

### Deployment
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## How It Works

```
User describes tinnitus in natural language
        ↓
Express backend sends description to Gemini API
        ↓
Gemini returns structured JSON audio profile:
  { frequency, noiseType, notchDepth, binauralBeat, volume, aiSummary }
        ↓
React frontend passes profile to Web Audio API engine
        ↓
AudioContext synthesises noise → BiquadFilter notches tinnitus frequency
        ↓
User hears personalised masking sound in real time
```

---

## Getting Started Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- Google AI Studio API key (free)

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/tinnitustuner.git
cd tinnitustuner
```

### 2. Backend setup
```bash
cd server
cp .env.example .env
npm install
```

Fill in `server/.env`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
PORT=5001
```

```bash
npm run dev
# Server running on port 5001
# MongoDB connected
```

### 3. Frontend setup
```bash
cd client
cp .env.example .env
npm install
npm run dev
# App running at http://localhost:5173
```

Fill in `client/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/analyze` | Generate AI sound profile | ✅ |
| GET | `/api/profiles` | Get all saved profiles | ✅ |
| POST | `/api/profiles` | Save a profile | ✅ |
| PUT | `/api/profiles/:id` | Update a profile | ✅ |
| DELETE | `/api/profiles/:id` | Delete a profile | ✅ |

---

## Audio Engine

The Web Audio API engine (`AudioEngine.jsx`) builds this signal chain:

```
BufferSource (noise) → BiquadFilter (notch) → GainNode → destination
                                                    ↑
                          OscillatorL + OscillatorR (binaural, optional)
```

- **White noise** — equal energy at all frequencies
- **Pink noise** — -3dB per octave, more natural sounding
- **Brown noise** — -6dB per octave, deep rumble
- **Notch filter** — cuts a narrow band at the tinnitus frequency to reduce perceived intensity over time (evidence-based notched sound therapy)
- **Binaural beat** — two oscillators at slightly different frequencies, one per ear, requires headphones

---

## Project Structure

```
tinnitustuner/
├── client/                   
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── components/
│   │   │   ├── AudioEngine.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── services/
│   │       └── api.js
│   └── package.json
│
└── server/                   
    ├── models/
    │   ├── User.js
    │   └── Profile.js
    ├── routes/
    │   ├── auth.js
    │   ├── analyze.js
    │   └── profiles.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── services/
    │   └── geminiService.js
    └── server.js
```

---

## Disclaimer

TinnitusTuner is not a medical device and is not intended to diagnose, treat, or cure tinnitus. It is a personal project built to explore sound therapy techniques. Always consult a qualified audiologist or medical professional for tinnitus treatment.

---

## Author

**Mohd Shaad Siddiqui**

---

## License

MIT
