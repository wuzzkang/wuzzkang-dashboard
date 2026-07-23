import { getSectionStyle } from '../../../utils/sectionStyle.js';

export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Perjalanan Cerita Kasih';
    const subtitle = data.subtitle || 'Manisnya momen perkenalan hingga sepakat mengikat ikatan suci';
    const stories = data.stories || [
        { date: 'Tahun 2022', title: 'Perkenalan Di Komunitas Botanical', desc: 'Kesamaan hobi membawa kami pada obrolan hangat yang tak terlupakan.' },
        { date: 'Tahun 2025', title: 'Lamaran Romantis Outdoor', desc: 'Di bawah pepohonan pinus rindang, janji komitmen suci diucapkan.' },
        { date: 'Tahun 2026', title: 'Pesta Pernikahan Botanical', desc: 'Merayakan hari bahagia bersama keluarga dan sahabat terdekat.' }
    ];

    const bgStyle = data.bg_style || 'emerald';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-story-sage-styles-${Math.random().toString(36).substr(2, 9)}`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,400..700;1,400..700&display=swap');
            .wedding-font-serif { font-family: 'Cormorant Garamond', serif; }
            .wedding-font-cursive { font-family: 'Alex Brush', cursive; }
        </style>

        <section id="wedding_story" class="py-16 md:py-24 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-4xl mx-auto text-center relative z-10">
                <div class="mb-12">
                    <span class="text-xs font-bold text-emerald-300 uppercase tracking-widest block mb-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-max mx-auto">🌿 OUR LOVE STORY</span>
                    <h2 class="wedding-font-serif text-3xl md:text-5xl font-extrabold ${theme.heading} mb-3 tracking-tight">${title}</h2>
                    <p class="${theme.subtitle} text-xs md:text-sm max-w-md mx-auto">${subtitle}</p>
                </div>

                <!-- Story Timeline Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    ${stories.map((st, idx) => `
                        <div class="${theme.cardBg} border border-emerald-500/30 rounded-3xl p-6 text-left relative flex flex-col justify-between shadow-xl backdrop-blur-md hover:-translate-y-1.5 transition-transform">
                            <div>
                                <span class="inline-block px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                                    ${st.date || `Momen #${idx + 1}`}
                                </span>
                                <h3 class="wedding-font-serif text-xl font-extrabold ${theme.cardTitle} mb-2">${st.title}</h3>
                                <p class="${theme.cardDesc} text-xs leading-relaxed">${st.desc}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}
