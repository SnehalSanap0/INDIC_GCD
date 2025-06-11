# 🧠 INDIC Backend – Intelligent Language Learning Engine

> The backend powers the brain of INDIC: enabling AI-driven personalization, real-time analytics, gamification logic, and secure access — all built for scale and inclusion.

---

## 💡 Overview

The backend is a *Node.js + Express* server connected to *MongoDB* and integrated with cutting-edge AI (Gemini), ML modules (speech, object detection), and real-time gamified logic. It handles all authentication, data processing, and learning flows.

---

## ⚙ Tech Stack

- *Node.js* – Lightweight backend runtime
- *Express.js* – API routing and middleware
- *MongoDB + Mongoose* – Flexible document DB
- *JWT* – Secure authentication
- *Gemini API* – AI for avatar guidance and storytelling
- *Speech & Object Detection Modules* – Input enhancement
- *Blender Assets* – For AR learning modules

---

## 🚀 Setup Instructions

bash
# Navigate to backend
cd INDIC_CTC/backend

# Install dependencies
npm install

# Create `.env` file
touch .env


#### 🔐 .env Format:
env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/indic
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key


bash
# Start the development server
npm run dev


Server runs at: http://localhost:5000

---

## 📡 Core API Endpoints

| Endpoint              | Function                          |
|----------------------|-----------------------------------|
| POST /api/auth     | User registration/login           |
| GET /api/profile   | Get user progress & stats         |
| POST /api/lesson   | Submit lesson data                |
| GET /api/rewards   | Fetch gamified reward data        |

---

## 🗂 Directory Structure


backend/
├── controllers/     # Business logic
├── models/          # Mongoose schemas
├── routes/          # API endpoints
├── middleware/      # Auth, logging, error handling
└── app.js           # App entry point


---

## 🧠 Intelligence Modules

- 🎤 *Speech-to-text* for voice commands
- 🧍‍♂ *AI Avatars (Gemini)* for real-time interaction
- 👁 *Object detection* for AR-based word spotting
- 🧮 *Gamification engine* with real-time streak and level tracking

---

## 🔒 Security

- Role-based JWT authentication
- Secure data access with middleware
- Environment variable support via .env

---

## 📜 License

This backend is licensed under the *MIT License*.  
See the [LICENSE](../LICENSE) file for more information.

---

## 🚀 Hackathon Edge

- ✅ Modular and scalable architecture
- 💬 AI-powered interaction using real Indian stories
- 🔁 Live feedback loop for learners
- 🧏 Designed with inclusion, diversity, and impact at its core
