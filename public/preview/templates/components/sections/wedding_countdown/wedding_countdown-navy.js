import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: Wedding Countdown (V2)
 * Live 4-box ticking countdown timer
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Menuju Hari Bahagia';
    const subtitle = data.subtitle || 'Hitung mundur momen istimewa pernikahan kami';
    const targetDate = data.target_date || '2026-12-12T08:00:00';

    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const scriptId = `countdown-script-${Math.random().toString(36).substr(2, 9)}`;

    return `
        <section id="wedding_countdown" class="py-16 md:py-24 px-6 ${sectionBgClass} relative overflow-hidden text-center">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-4xl mx-auto relative z-10">
                <div class="mb-10">
                    <span class="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-2">⏳ COUNTDOWN TIMER</span>
                    <h2 class="text-2xl md:text-4xl font-extrabold ${theme.title} mb-3 tracking-tight">${title}</h2>
                    <p class="${theme.subtitle} text-xs md:text-sm max-w-md mx-auto">${subtitle}</p>
                </div>

                <!-- 4 Flip Countdown Boxes -->
                <div class="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto" id="v2-wedding-countdown-timer">
                    <div class="${theme.cardBg} border rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl backdrop-blur-md">
                        <span id="v2-count-days" class="block text-2xl md:text-5xl font-black text-orange-400 mb-1">00</span>
                        <span class="text-[10px] md:text-xs font-bold ${theme.cardDesc} uppercase tracking-wider">Hari</span>
                    </div>
                    <div class="${theme.cardBg} border rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl backdrop-blur-md">
                        <span id="v2-count-hours" class="block text-2xl md:text-5xl font-black text-orange-400 mb-1">00</span>
                        <span class="text-[10px] md:text-xs font-bold ${theme.cardDesc} uppercase tracking-wider">Jam</span>
                    </div>
                    <div class="${theme.cardBg} border rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl backdrop-blur-md">
                        <span id="v2-count-minutes" class="block text-2xl md:text-5xl font-black text-orange-400 mb-1">00</span>
                        <span class="text-[10px] md:text-xs font-bold ${theme.cardDesc} uppercase tracking-wider">Menit</span>
                    </div>
                    <div class="${theme.cardBg} border rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl backdrop-blur-md">
                        <span id="v2-count-seconds" class="block text-2xl md:text-5xl font-black text-orange-400 mb-1">00</span>
                        <span class="text-[10px] md:text-xs font-bold ${theme.cardDesc} uppercase tracking-wider">Detik</span>
                    </div>
                </div>
            </div>

            <script id="${scriptId}">
                (function() {
                    const target = new Date("${targetDate}").getTime();
                    function updateTimer() {
                        const now = new Date().getTime();
                        const diff = target - now;
                        if (diff <= 0) {
                            document.getElementById('v2-count-days') && (document.getElementById('v2-count-days').innerText = '00');
                            document.getElementById('v2-count-hours') && (document.getElementById('v2-count-hours').innerText = '00');
                            document.getElementById('v2-count-minutes') && (document.getElementById('v2-count-minutes').innerText = '00');
                            document.getElementById('v2-count-seconds') && (document.getElementById('v2-count-seconds').innerText = '00');
                            return;
                        }
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
