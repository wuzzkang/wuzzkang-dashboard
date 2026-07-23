import { getSectionStyle } from '../../../utils/sectionStyle.js';

export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Kisah Percintaan Kami';
    const subtitle = data.subtitle || 'Momen-momen indah yang membentuk perjalanan takdir cinta kami';
    const stories = data.stories || [
        { date: 'Tahun 2022', title: 'Awal Manis Perkenalan', desc: 'Berawal dari pertemuan rekan kerja di suatu proyek kreatif.' },
        { date: 'Tahun 2025', title: 'Kejutan Kejadian Lamaran', desc: 'Momen manis lamaran di pantai berpasir putih saat sunset.' },
        { date: 'Tahun 2026', title: 'Ikatan Suci Pernikahan', desc: 'Memulai petualangan masa depan bersama dalam mahligai rumah tangga.' }
    ];

    const bgStyle = data.bg_style || 'rose';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-story-rose-styles-${Math.random().toString(36).substr(2, 9)}`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Parisienne&family=Montserrat:ital,wght@0,300..900;1,300..900&display=swap');
            .wedding-font-serif { font-family: 'Montserrat', sans-serif; font-weight: 700; }
            .wedding-font-cursive { font-family: 'Parisienne', cursive; }
        </style>

        <section id="wedding_story" class="py-16 md:py-24 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-4xl mx-auto text-center relative z-10">
                <div class="mb-12">
                    <span class="text-xs font-bold text-rose-300 uppercase tracking-widest block mb-2 px-4 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 w-max mx-auto">🌸 OUR LOVE STORY</span>
                    <h2 class="wedding-font-serif text-2xl md:text-4xl font-extrabold text-rose-100 mb-3 tracking-tight">${title}</h2>
                    <p class="${theme.subtitle} text-xs md:text-sm max-w-md mx-auto">${subtitle}</p>
                </div>

                <!-- Story Timeline Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    ${stories.map((st, idx) => `
                        <div class="bg-rose-950/60 border border-rose-500/30 rounded-3xl p-6 text-left relative flex flex-col justify-between shadow-2xl backdrop-blur-md hover:-translate-y-1.5 transition-transform">
                            <div>
                                <span class="inline-block px-3 py-1 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                                    ${st.date || `Momen #${idx + 1}`}
                                </span>
                                <h3 class="wedding-font-serif text-lg font-bold text-rose-100 mb-2">${st.title}</h3>
                                <p class="text-rose-200/80 text-xs leading-relaxed">${st.desc}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}
