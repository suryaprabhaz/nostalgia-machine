/**
 * ------------------------------------------------------------------
 * MAIN APP CONTROLLER
 * ------------------------------------------------------------------
 */
const App = (() => {
    const start = () => {
        AudioController.init();
        AudioController.resume();
        UI.hideHome();
        Engine.zoomToSlot();
        UI.setStatus("INSERT COIN");
    };

    const processTicket = () => {
        STATE.isProcessing = true;
        Engine.processAnimation(() => {
            Ticket.generate();
            UI.showResult();
            STATE.isProcessing = false;
        });
    };

    const reset = () => {
        location.reload();
    };

    // Interaction listeners for audio unlock
    document.body.addEventListener('click', AudioController.resume, { once: true });
    document.body.addEventListener('touchstart', AudioController.resume, { once: true });

    document.getElementById('mute-toggle').addEventListener('click', AudioController.toggleMute);

    return { start, reset, processTicket };
})();

// BOOTSTRAP
window.onload = Engine.init;
