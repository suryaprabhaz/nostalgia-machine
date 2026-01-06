/**
 * ------------------------------------------------------------------
 * TICKET LOGIC
 * ------------------------------------------------------------------
 */
const Ticket = (() => {
    const quotes = [
        "The smell of rain on dry earth was our first internet.",
        "Happiness was a 2 rupee coin and a pocket full of dreams.",
        "Paper boats don't sail in the rain anymore, but they still float in memory.",
        "We spent childhood trying to grow up, only to realize the best part was the paper planes.",
        "Old railway stations hold more honest kisses than wedding halls.",
        "Somewhere in the race for a better life, we left the 'life' part behind."
    ];

    const generate = () => {
        const canvas = document.getElementById('hidden-ticket-canvas');
        const ctx = canvas.getContext('2d');
        const quote = quotes[Math.floor(Math.random() * quotes.length)];

        // Ticket Background
        ctx.fillStyle = '#e9dcc9';
        ctx.fillRect(0, 0, 800, 1100);

        // Noise
        for (let i = 0; i < 5000; i++) {
            ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
            ctx.fillRect(Math.random() * 800, Math.random() * 1100, 2, 2);
        }

        ctx.strokeStyle = '#3d3c3a'; ctx.lineWidth = 5;
        ctx.strokeRect(40, 40, 720, 1020);

        ctx.fillStyle = '#2b2b2b';
        ctx.font = '36px "Special Elite"';
        ctx.textAlign = 'center';
        ctx.fillText("CENTRAL MEMORY CORP", 400, 150);

        ctx.font = 'italic 48px "Special Elite"';
        wrapText(ctx, `"${quote}"`, 400, 450, 600, 70);

        // Footer
        ctx.font = '24px "Inter"'; ctx.textAlign = 'center'; ctx.fillStyle = '#555';
        const date = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        ctx.fillText(date, 400, 950);
        ctx.fillText("rizzzuu@ybl | NOSTALGIA MACHINE", 400, 990);

        const dataUrl = canvas.toDataURL('image/png');
        document.getElementById('generated-ticket').src = dataUrl;
    };

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = context.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else { line = testLine; }
        }
        context.fillText(line, x, y);
    }

    const download = () => {
        const link = document.createElement('a');
        link.download = `smile-ticket-${Date.now()}.png`;
        link.href = document.getElementById('generated-ticket').src;
        link.click();
    };

    return { generate, download };
})();
