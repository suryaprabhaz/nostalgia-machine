/**
 * ------------------------------------------------------------------
 * CONFIGURATION
 * ------------------------------------------------------------------
 */
const CONFIG = {
    IS_MOBILE: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 800,
    REDUCED_MOTION: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    COLORS: {
        brass: 0xcda434,
        copper: 0xb87333,
        iron: 0x2b2b2b,
        gold: 0xffd700
    },
    // Demo UPI ID — replace with your own before production
    UPI_ID: "rizzzuu@ybl"
};
