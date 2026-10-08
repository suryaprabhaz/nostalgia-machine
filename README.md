# ₹2 Smile Machine

A 3D interactive nostalgia experience inspired by the old coin-operated machines found around Indian railway stations.

## Experience

- Three.js procedural machine
- GSAP-driven interactions
- Canvas-generated keepsake ticket
- Procedural audio
- Mobile performance safeguards
- Reduced-motion support
- No login or analytics requirement

## Payment mode

The UPI screen is a **demo simulation**. Entering a syntactically valid UTR does not contact a bank and does not prove that a payment happened.

This distinction is deliberate: the project is an interactive-art experience, not a payment gateway.

## Stack

HTML5 · CSS3 · JavaScript ES modules · Three.js · GSAP · Canvas API

## Run locally

```bash
git clone https://github.com/suryaprabhaz/nostalgia-machine.git
cd nostalgia-machine
```

Open `index.html` through a static server for the best browser-module behavior.

## Performance and accessibility

The experience accounts for mobile devices and `prefers-reduced-motion`. Future production iterations should continue to measure frame rate, memory usage and asset-loading cost.

## License

Experimental digital art — built for learning and demonstration.
