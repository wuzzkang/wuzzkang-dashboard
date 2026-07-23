import { getSectionStyle } from '../../../utils/sectionStyle.js';

export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Ngenteni Dina Pawiwahan';
    const subtitle = data.subtitle || 'Hitung mundur pelaksanaan Upacara Panggih & Resepsi Adat Jawa';
    const targetDate = data.target_date || '2026-10-18T08:00:00';

    const bgStyle = data.bg_style || 'amber';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-countdown-javanese-styles-${Math.random().toString(36).substr(2, 9)}`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Pinyon+Script&display=swap');
            .wedding-font-serif { font-family: 'Cinzel', serif; }
            .wedding-font-cursive { font-family: 'Pinyon Script', cursive; }
        </style>

        <section id="wedding_countdown" class="py-16 md:py-24 px-6 ${sectionBgClass} relative overflow-hidden text-center">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-4xl mx-auto relative z-10">
                <div class="mb-10">
                    <span class="text-xs font-bold text-amber-300 uppercase tracking-widest block mb-2 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 w-max mx-auto">🪷 PITUNG DINA PAWIWAHAN</span>
                    <h2 class="wedding-font-serif text-3xl md:text-5xl font-extrabold text-amber-100 mb-3 tracking-tight">${title}</h2>
                    <p class="${theme.subtitle} text-xs md:text-sm max-w-md mx-auto">${subtitle}</p>
                </div>

                <!-- 4 Flip Countdown Boxes with Javanese Gapura Border -->
                <div class="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto" id="v2-wedding-countdown-timer">
                    <div class="bg-amber-950/70 border-2 border-amber-500/40 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl relative">
                        <div class="absolute inset-1 border border-amber-500/20 rounded-xl pointer-events-none"></div>
                        <span id="v2-count-days" class="block text-2xl md:text-5xl font-black text-amber-300 mb-1">00</span>
                        <span class="text-[10px] md:text-xs font-bold text-amber-200/80 uppercase tracking-wider">Dina</span>
                    </div>
                    <div class="bg-amber-950/70 border-2 border-amber-500/40 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl relative">
                        <div class="absolute inset-1 border border-amber-500/20 rounded-xl pointer-events-none"></div>
                        <span id="v2-count-hours" class="block text-2xl md:text-5xl font-black text-amber-300 mb-1">00</span>
                        <span class="text-[10px] md:text-xs font-bold text-amber-200/80 uppercase tracking-wider">Jam</span>
                    </div>
                    <div class="bg-amber-950/70 border-2 border-amber-500/40 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl relative">
                        <div class="absolute inset-1 border border-amber-500/20 rounded-xl pointer-events-none"></div>
                        <span id="v2-count-minutes" class="block text-2xl md:text-5xl font-black text-amber-300 mb-1">00</span>
                        <span class="text-[10px] md:text-xs font-bold text-amber-200/80 uppercase tracking-wider">Menit</span>
                    </div>
                    <div class="bg-amber-950/70 border-2 border-amber-500/40 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl relative">
                        <div class="absolute inset-1 border border-amber-500/20 rounded-xl pointer-events-none"></div>
                        <span id="v2-count-seconds" class="block text-2xl md:text-5xl font-black text-amber-300 mb-1">00</span>
                        <span class="text-[10px] md:text-xs font-bold text-amber-200/80 uppercase tracking-wider">Detik</span>
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
