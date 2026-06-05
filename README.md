# TinnitusTuner 🎧

AI-powered tinnitus sound masking platform that generates personalized sound therapy profiles using Google's Gemini AI.

## 🚀 Live Demo

* Frontend: https://tinnitustuner.vercel.app
* Backend API: https://tinnitustuner.onrender.com

## 📌 Features

* User Registration & Login
* JWT Authentication
* AI-powered tinnitus analysis using Gemini API
* Personalized sound masking profile generation
* Save and manage generated profiles
* MongoDB Atlas cloud database
* Responsive React frontend

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication

### AI Integration

* Google Gemini API

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

## 📂 Project Structure

```bash
tinnitustuner/
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   └── server.js
│
└── README.md
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Shaad20052027/tinnitustuner.git
cd tinnitustuner
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

## 🔑 Environment Variables

### Server (.env)

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

### Client (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 📸 Screenshots

Add screenshots of:

* Login Page
* Register Page
* Dashboard
* Generated Sound Profile

## 👨‍💻 Author

Mohd Shaad Siddiqui

GitHub: https://github.com/Shaad20052027
