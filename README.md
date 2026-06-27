# OpenSelfHealNet 📡🔄

An open-source interactive digital twin that visualizes how communication networks operate, fail, recover, and evolve.

[![MIT License](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)

> **"I finally understand how a communication network works."**
> OpenSelfHealNet is designed to turn complex telecom and networking concepts into an interactive, visually stunning documentary-style experience. Think of it as a fusion of Apple product storytelling, FlightRadar24, and Cisco Packet Tracer.

---

## 📌 The Problem

Most people use communication networks daily without understanding:
1. How a message travels across the world in milliseconds.
2. What a cell tower actually does under its blueprint.
3. Why one damaged tower can trigger a cascading failure affecting thousands.
4. How modern network routing protocols self-heal around disasters.
5. Where open-source projects like `Open5GS`, `srsRAN`, or `Meshtastic` fit in the telecom ecosystem.

Existing educational resources are often static diagrams, dense academic papers, or vendor-locked proprietary software. OpenSelfHealNet fills this gap.

---

## 🏗️ Architecture

OpenSelfHealNet is split into a modern interactive frontend and a high-fidelity graph algorithm simulator.

```
OpenSelfHealNet/
├── frontend/             # Next.js 15 App (React 19, TypeScript, TailwindCSS v4)
│   ├── src/
│   │   ├── app/          # App Router & Styles
│   │   ├── components/   # UI elements & Story chapters
│   │   ├── hooks/        # Client-side simulator states
│   │   └── lib/          # Graph routing and animation configs
├── backend/              # FastAPI Server (Python 3.10+)
│   ├── simulator/        # NetworkX graph representation
│   ├── main.py           # REST endpoints & WebSockets
```

---

## 🚀 Installation & Local Setup

### Prerequisites
- [Node.js 18+](https://nodejs.org)
- [Python 3.10+](https://python.org)

### 1. Frontend Setup
Navigate to the frontend folder, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

### 2. Backend Setup (Optional)
Run the high-performance Python simulation engine (with NetworkX pathfinding):
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
The FastAPI server will start on `http://localhost:8000`.

---

## 🗺️ Roadmap & Phase Plan

- **Phase 1 (v1.0 - Foundations):** Interactive topology visualizer, basic cell tower blueprints, single-node failure triggers, client-side mesh recovery pathfinding, and narrative scroll chapters. *(Completed)*
- **Phase 2 (v2.0 - Digital Twin):** Python FastAPI + NetworkX simulator integration via WebSockets, real-time telemetry dashboard. *(Scaffolded / Completed)*
- **Phase 3 (v3.0 - AI Routing):** Explainable decision-support engine showing drone base-station routing and capacity redistribution.
- **Phase 4 (v4.0 - Telecom Integration):** SDR frequency spectrum visualizers, Open RAN disaggregation mapping, and Open5GS core mockups.

---

## 🤝 Contributing

We welcome contributions from the community! Feel free to:
- Open issues for bugs or feature requests.
- Submit Pull Requests to implement new failure modes (e.g. Cyber Attacks, Congestion delays).
- Help translate or improve the educational text.

License: [MIT](LICENSE)
