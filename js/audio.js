/**
 * ------------------------------------------------------------------
 * AUDIO CONTROLLER (Singleton, Safe)
 * ------------------------------------------------------------------
 */
const AudioController = (() => {
    let ctx = null;

    const init = () => {
        if (ctx) return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        ctx = new AudioCtx();
    };

    const resume = () => {
        if (ctx && ctx.state === 'suspended') {
            ctx.resume();
        }
    };

    const playTone = (freq, type, duration, vol = 0.1) => {
        if (STATE.isMuted || !ctx) return;
        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(vol, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) { console.warn('Audio error', e); }
    };

    return {
        init,
        resume,
        tick: () => playTone(400, 'triangle', 0.1, 0.1),
        chime: () => playTone(800, 'sine', 1.5, 0.2),
        toggleMute: () => {
            STATE.isMuted = !STATE.isMuted;
            document.getElementById('mute-toggle').innerText = STATE.isMuted ? "🔇" : "🔊";
        }
    };
})();
