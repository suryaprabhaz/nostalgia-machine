/**
 * ------------------------------------------------------------------
 * PAYMENT LOGIC (UPI Professional)
 * ------------------------------------------------------------------
 */
const Payment = (() => {
    const initiate = () => {
        // Generate Dynamic UPI QR (Using API)
        const amount = "2.00";
        const upiUrl = `upi://pay?pa=${CONFIG.UPI_ID}&pn=Smile%20Machine&am=${amount}&cu=INR`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;

        document.getElementById('upi-qr').src = qrUrl;

        // Reset Fields
        const input = document.getElementById('utr-input');
        const error = document.getElementById('utr-error');
        input.value = "";
        input.style.border = "1px solid rgba(255,255,255,0.2)";
        error.style.display = 'none';

        // Show Overlay
        gsap.to("#payment-trigger", {
            opacity: 0, duration: 0.3, onComplete: () => {
                document.getElementById('payment-trigger').style.display = 'none';
                const ol = document.getElementById('qr-overlay');
                ol.style.display = 'flex';
                gsap.fromTo(ol, { opacity: 0 }, { opacity: 1, duration: 0.5 });
            }
        });
    };

    const verify = () => {
        const input = document.getElementById('utr-input');
        const error = document.getElementById('utr-error');
        const val = input.value.trim();

        // Strict 12-digit Validation
        if (!/^\d{12}$/.test(val)) {
            error.style.display = 'block';
            input.style.border = '1px solid #ff5555';
            gsap.to(input, { x: 5, yoyo: true, repeat: 3, duration: 0.1 });
            return;
        }

        // Valid
        error.style.display = 'none';
        input.style.border = '1px solid #4CAF50';

        const btn = document.getElementById('verify-btn');
        const text = document.getElementById('verifying-text');

        btn.style.display = 'none';
        text.style.display = 'block';

        // Professional Verification Delay (3s)
        setTimeout(() => {
            onSuccess();
        }, 3000);
    };

    const onSuccess = () => {
        gsap.to("#qr-overlay", {
            opacity: 0, duration: 0.5, onComplete: () => {
                document.getElementById('qr-overlay').style.display = 'none';
                // Reset clean state for next time
                document.getElementById('verify-btn').style.display = 'block';
                document.getElementById('verifying-text').style.display = 'none';

                App.processTicket();
            }
        });
    };

    const cancel = () => {
        gsap.to("#qr-overlay", {
            opacity: 0, duration: 0.3, onComplete: () => {
                document.getElementById('qr-overlay').style.display = 'none';
                document.getElementById('payment-trigger').style.display = 'flex';
                gsap.to("#payment-trigger", { opacity: 1 });

                document.getElementById('verify-btn').style.display = 'block';
                document.getElementById('verifying-text').style.display = 'none';
            }
        });
    };

    return { initiate, verify, cancel };
})();
