import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: Wedding Story Timeline (V2)
 * Love story milestones card
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Kisah Kasih Kami';
    const subtitle = data.subtitle || 'Perjalanan cinta kami dari pertama bertemu hingga ikatan suci pernikahan';
    const stories = data.stories || [
        { date: 'Tahun 2021', title: 'Awal Pertemuan Pertama', desc: 'Kami pertama kali bertemu dalam suatu acara kampus dan berlanjut menjalin persahabatan hangat.' },
        { date: 'Tahun 2024', title: 'Momen Lamaran Kebahagiaan', desc: 'Dengan restu kedua orang tua, kami mengikat janji suci lamaran untuk melangkah ke jenjang yang lebih serius.' },
        { date: 'Tahun 2026', title: 'Menuju Hari Pernikahan', desc: 'Insya Allah kami akan mengikat janji suci pernikahan dan mengarungi bahtera rumah tangga yang sakinah.' }
    ];

    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    return `
        <section id="wedding_story" class="py-16 md:py-24 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-4xl mx-auto text-center relative z-10">
                <div class="mb-12">
                    <span class="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-2">💕 OUR LOVE STORY</span>
                    <h2 class="text-2xl md:text-4xl font-extrabold ${theme.title} mb-3 tracking-tight">${title}</h2>
                    <p class="${theme.subtitle} text-xs md:text-sm max-w-md mx-auto">${subtitle}</p>
                </div>

                <!-- Story Timeline Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    ${stories.map((st, idx) => `
                        <div class="${theme.cardBg} border rounded-3xl p-6 text-left relative flex flex-col justify-between shadow-xl backdrop-blur-md hover:-translate-y-1.5 transition-transform">
                            <div>
                                <span class="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                                    ${st.date || `Momen #${idx + 1}`}
                                </span>
                                <h3 class="text-base font-extrabold ${theme.cardTitle} mb-2">${st.title}</h3>
                                <p class="${theme.cardDesc} text-xs leading-relaxed">${st.desc}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}
