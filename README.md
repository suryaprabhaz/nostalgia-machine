# ₹2 Smile Machine — A 3D Interactive Nostalgia Experience

A creative, emotion-driven web experience inspired by old coin-operated machines at Indian railway stations.

## Features
• **Interactive 3D Machine**: High-fidelity steampunk machine built with Three.js.
• **Emotion-Focused UX**: Designed to evoke nostalgia and warmth.
• **UPI Payment Integration**: Professional QR code flow with UTR verification (Client-side simulation).
• **Canvas-Based Ticket Generation**: Dynamically generated keepsake tickets with unique quotes.
• **Mobile Optimizations**: Performance guards for smooth playback on all devices.
• **Privacy First**: No login, no tracking, no data collection.

## Tech Stack
• HTML5 / CSS3
• JavaScript (ES6+ Modules)
• Three.js (3D Rendering)
• GSAP (Animations)
• Canvas API (Ticket Generation)

## How to Run
1. Clone this repository.
2. Open `index.html` in any modern web browser.
3. No build tools (Webpack/Vite) required — it runs natively.

## Project Structure
```
nostalgia-smile-machine/
│
├── index.html       # Entry point
├── css/
│   └── styles.css   # Single CSS file for all styles
│
└── js/
    ├── config.js    # Configuration & Constants
    ├── state.js     # Global state management
    ├── audio.js     # Audio context & sound generation
    ├── engine.js    # Three.js scene & animation loop
    ├── ticket.js    # Canvas ticket generation logic
    ├── payment.js   # UPI QR & UTR verification logic
    ├── ui.js        # DOM manipulation & screen transitions
    └── app.js       # Main application bootstrap
```

> [!NOTE]
> **Payment Logic**: The payment system uses a real UPI ID (`rizzzuu@ybl`) but the verification is currently a client-side simulation for demonstration purposes. This is an experimental creative engineering project.

## License
Experimental Digital Art. Built for learning and demonstration.
