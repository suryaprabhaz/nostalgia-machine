/**
 * ------------------------------------------------------------------
 * UI CONTROLLER
 * ------------------------------------------------------------------
 */
const UI = (() => {
    const setStatus = (msg) => {
        const el = document.getElementById('status-display');
        el.innerText = msg;
        gsap.to(el, { opacity: 1, duration: 0.5 });
    };

    const hideHome = () => {
        gsap.to("#home-ui", {
            opacity: 0, y: 50, duration: 0.8, onComplete: () => {
                document.getElementById('home-ui').style.display = 'none';
                document.getElementById('payment-trigger').style.display = 'flex';
                gsap.to("#payment-trigger", { opacity: 1 });
            }
        });
    };

    const showResult = () => {
        gsap.to("#status-display", { opacity: 0 });
        const view = document.getElementById('result-view');
        view.style.display = 'flex';
        gsap.from(view, { opacity: 0, duration: 1 });
        gsap.from("#generated-ticket", { y: 200, rotationX: 20, duration: 1.2, ease: "power3.out" });
    };

    const showFallback = () => {
        document.getElementById('loading-overlay').style.display = 'none';
        document.getElementById('fallback-ui').style.display = 'flex';
    };

    const showResultFallback = () => {
        Ticket.generate();
        const view = document.getElementById('result-view');
        view.style.display = 'flex';
        document.getElementById('fallback-ui').style.display = 'none';
    };

    return { setStatus, hideHome, showResult, showFallback, showResultFallback };
})();
