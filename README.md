# 🥀 OOPS: The World's Most Honest Dating App

**"It's a match! ...but don't get your hopes up."**

OOPS is a full-stack, AI-powered dating application designed with a "hostile" UI/UX. Unlike traditional dating apps that try to make you feel good, OOPS is built on cynicism, sarcasm, and the brutal reality of digital dating. 

---

## 🚩 Why OOPS?
In a world of perfect profiles and fake positivity, OOPS brings you:
- **Hostile UI**: Buttons that run away from you if you aren't "cool" enough.
- **Cursed Validation**: Passwords that must be exactly 13 characters and mention the weather.
- **Cynical AI**: A match that is programmed to be unimpressed by your opening line.
- **Real Stats**: Failure probabilities, ghosting timers, and "Oxygen Consumption Taxes."
- **Cinematic Hindi Meme Audio Integration**: Uses actual dialogues from famous movies (e.g. *3 Idiots*, *Hera Pheri*) to judge and talk to the user in real-time, such as:
  - `"Arey kehna kya chahte ho"` on quiz option clicks.
  - `"Ye koi tareeka hai bheek maangne ka"` on desperation entry clicks.
  - `"System phadd denge"` on system crash reboots.

---

## 🛠️ Tech Stack

### Frontend
- **React + Vite**: High-performance, modern UI.
- **Framer Motion**: For smooth (and sometimes annoying) animations.
- **Pixi.js**: Hardware-accelerated WebGL rendering for high-fidelity GIFs.
- **Socket.io-client**: Real-time "toxic" chat interactions.
- **Vitest**: Blazing fast frontend unit testing.
- **Lucide React**: Premium iconography.

### Backend
- **Node.js + Express (v5)**: Robust API and monolithic static serving.
- **Socket.io**: Real-time communication and typing indicators.
- **Mongoose + MongoDB**: Persistence for the "cursed" profiles.
- **Jest**: Comprehensive API and socket event unit testing.

### AI Engine
- **LangChain & LangGraph**: Orchestrating complex, state-aware AI personalities.
- **Mistral AI**: Powering the sarcastic and witty responses.
- **Bengali/Hindi/English Support**: Multi-lingual toxicity.

---

## 🥚 Cursed Features & Easter Eggs
We've hidden dozens of "features" intended to annoy and amuse. Check the **[Official Easter Egg Manual](./easter_eggs.md)** for a full list, including:
- The Fleeing Login Button.
- The "No-e" Name Rule.
- The "Dave from Accounting" Fee.
- AI "Panic Mode" (`k`).
- Homie Interruption ("You folding over this?!").
- Friend Group Spectator Mode (Twitch-style live judging).
- Bullet-hell chat mini-games and Tornado message leaks.
- Legendary Cinematic Dialogue Soundbytes.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Mistral AI API Key

### Installation

1. **Clone the repo**:
   ```bash
   git clone https://github.com/Soumipal56/OOPS.git
   cd OOPS
   ```

2. **Setup Backend**:
   ```bash
   cd oops-app/server
   npm install
   # Create a .env file with:
   # MONGO_URI=your_mongodb_uri
   # MISTRAL_API_KEY=your_mistral_key
   npm run dev
   ```

3. **Setup Frontend**:
   ```bash
   cd oops-app/client
   npm install
   npm run dev
   ```

---

## 🌐 Deployment
This project is configured for a **Monolithic Deployment** on Render. 
- The backend serves the built frontend from the `public/` directory.
- Supports SPA routing with Express v5 `/*path` catch-all logic.

---

## 📜 License
ISC. Use it at your own risk. We are not responsible for any actual heartbreak caused by this application.

**Happy judging!** 🥀🔥
