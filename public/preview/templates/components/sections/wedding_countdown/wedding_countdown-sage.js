import { getSectionStyle } from '../../../utils/sectionStyle.js';

export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Menuju Momen Pesta Garden';
    const subtitle = data.subtitle || 'Hitung mundur perayaan pernikahan outdoor kami di tengah suasana asri';
    const targetDate = data.target_date || '2026-11-20T10:00:00';

    const bgStyle = data.bg_style || 'emerald';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-countdown-sage-styles-${Math.random().toString(36).substr(2, 9)}`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,400..700;1,400..700&display=swap');
            .wedding-font-serif { font-family: 'Cormorant Garamond', serif; }
            .wedding-font-cursive { font-family: 'Alex Brush', cursive; }
        </style>

        <section id="wedding_countdown" class="py-16 md:py-24 px-6 ${sectionBgClass} relative overflow-hidden text-center">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-4xl mx-auto relative z-10">
                <div class="mb-10">
                    <span class="text-xs font-bold text-emerald-300 uppercase tracking-widest block mb-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-max mx-auto">🌿 COUNTDOWN TIMER</span>
                    <h2 class="wedding-font-serif text-3xl md:text-5xl font-extrabold ${theme.heading} mb-3 tracking-tight">${title}</h2>
                    <p class="${theme.subtitle} text-xs md:text-sm max-w-md mx-auto">${subtitle}</p>
                </div>

                <!-- 4 Flip Countdown Boxes -->
                <div class="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto" id="v2-wedding-countdown-timer">
                    <div class="${theme.cardBg} border border-emerald-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl backdrop-blur-md">
                        <span id="v2-count-days" class="block text-2xl md:text-5xl font-black text-emerald-300 mb-1">00</span>
                        <span class="text-[10px] md:text-xs font-bold ${theme.cardDesc} uppercase tracking-wider">Hari</span>
                    </div>
                    <div class="${theme.cardBg} border border-emerald-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl backdrop-blur-md">
                        <span id="v2-count-hours" class="block text-2xl md:text-5xl font-black text-emerald-300 mb-1">00</span>
                        <span class="text-[10px] md:text-xs font-bold ${theme.cardDesc} uppercase tracking-wider">Jam</span>
                    </div>
                    <div class="${theme.cardBg} border border-emerald-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl backdrop-blur-md">
                        <span id="v2-count-minutes" class="block text-2xl md:text-5xl font-black text-emerald-300 mb-1">00</span>
                        <span class="text-[10px] md:text-xs font-bold ${theme.cardDesc} uppercase tracking-wider">Menit</span>
                    </div>
                    <div class="${theme.cardBg} border border-emerald-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl backdrop-blur-md">
                        <span id="v2-count-seconds" class="block text-2xl md:text-5xl font-black text-emerald-300 mb-1">00</span>
                        <span class="text-[10px] md:text-xs font-bold ${theme.cardDesc} uppercase tracking-wider">Detik</span>
                    </div>
                </div>
            </div>

            <script>
                (function() {
                    const target = new Date("${targetDate}").getTime();
                    function updateTimer() {
                        const now = new Date().getTime();
                        const diff = target - now;
                        if (diff <= 0) return;
                        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                        const dEl = document.getElementById('v2-count-days');
                        if (dEl) dEl.innerText = String(days).padStart(2, '0');
                        const hEl = document.getElementById('v2-count-hours');
                        if (hEl) hEl.innerText = String(hours).padStart(2, '0');
                        const mEl = document.getElementById('v2-count-minutes');
                        if (mEl) mEl.innerText = String(minutes).padStart(2, '0');
                        const sEl = document.getElementById('v2-count-seconds');
                        if (sEl) sEl.innerText = String(seconds).padStart(2, '0');
                    }
                    updateTimer();
                    setInterval(updateTimer, 1000);
                })();
            </script>
        </section>
    `;
}
