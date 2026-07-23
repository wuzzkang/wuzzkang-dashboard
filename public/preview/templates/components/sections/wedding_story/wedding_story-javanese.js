import { getSectionStyle } from '../../../utils/sectionStyle.js';

export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Linimasa Katresnan';
    const subtitle = data.subtitle || 'Lelampahan katresnan kawula saking awal tepangan nganti dadi garwa';
    const stories = data.stories || [
        { date: 'Tahun 2020', title: 'Tepangan Kapisan', desc: 'Kawula kapisan tepangan ing pentas seni budaya Keraton Yogyakarta.' },
        { date: 'Tahun 2024', title: 'Lamaran Adat Jawa', desc: 'Kanthi pangestu tiyang sepuh, kawula ngaturaken niyat suci lamaran.' },
        { date: 'Tahun 2026', title: 'Pawiwahan Ageng', desc: 'Dina bahagia ngikat janji suci minangka pasangan ingkang sakinah.' }
    ];

    const bgStyle = data.bg_style || 'amber';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-story-javanese-styles-${Math.random().toString(36).substr(2, 9)}`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Pinyon+Script&display=swap');
            .wedding-font-serif { font-family: 'Cinzel', serif; }
            .wedding-font-cursive { font-family: 'Pinyon Script', cursive; }
        </style>

        <section id="wedding_story" class="py-16 md:py-24 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-4xl mx-auto text-center relative z-10">
                <div class="mb-12">
                    <span class="text-xs font-bold text-amber-300 uppercase tracking-widest block mb-2 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 w-max mx-auto">🪷 KATRESNAN KAWULA</span>
                    <h2 class="wedding-font-serif text-3xl md:text-5xl font-extrabold text-amber-100 mb-3 tracking-tight">${title}</h2>
                    <p class="${theme.subtitle} text-xs md:text-sm max-w-md mx-auto">${subtitle}</p>
                </div>

                <!-- Story Timeline Grid with Javanese Gapura Border -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    ${stories.map((st, idx) => `
                        <div class="bg-amber-950/70 border-2 border-amber-500/40 rounded-3xl p-6 text-left relative flex flex-col justify-between shadow-2xl transition-transform hover:-translate-y-1.5">
                            <div class="absolute inset-1 border border-amber-500/20 rounded-2xl pointer-events-none"></div>
                            <div>
                                <span class="inline-block px-3.5 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                                    ${st.date || `Momen #${idx + 1}`}
                                </span>
                                <h3 class="wedding-font-serif text-xl font-extrabold text-amber-100 mb-2">${st.title}</h3>
                                <p class="text-amber-200/80 text-xs leading-relaxed">${st.desc}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}
