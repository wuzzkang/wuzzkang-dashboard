import { getSectionStyle } from '../../../utils/sectionStyle.js';

export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Album Prewedding Busana Adat';
    const subtitle = data.subtitle || 'Foto kenangan indah nggunakake busana ageng & kebayakan adat Jawa';
    const images = data.images || [
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80'
    ];

    const bgStyle = data.bg_style || 'amber';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-gallery-javanese-styles-${Math.random().toString(36).substr(2, 9)}`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Pinyon+Script&display=swap');
            .wedding-font-serif { font-family: 'Cinzel', serif; }
            .wedding-font-cursive { font-family: 'Pinyon Script', cursive; }
        </style>

        <section id="wedding_gallery" class="py-16 md:py-24 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-5xl mx-auto text-center relative z-10">
                <div class="mb-12">
                    <span class="text-xs font-bold text-amber-300 uppercase tracking-widest block mb-2 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 w-max mx-auto">🪷 GALERI BUSANA ADAT</span>
                    <h2 class="wedding-font-serif text-3xl md:text-5xl font-extrabold text-amber-100 mb-3 tracking-tight">${title}</h2>
                    <p class="${theme.subtitle} text-xs md:text-sm max-w-md mx-auto">${subtitle}</p>
                </div>

                <!-- Gallery Photo Grid with Gapura Border -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${images.map((img, idx) => `
                        <div class="group relative overflow-hidden rounded-2xl md:rounded-3xl border-2 border-amber-500/40 aspect-square shadow-2xl cursor-pointer">
                            <div class="absolute inset-1 border border-amber-500/20 rounded-xl z-10 pointer-events-none"></div>
                            <img src="${img}" alt="Prewedding Photo #${idx + 1}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div class="absolute inset-0 bg-gradient-to-t from-amber-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 z-20">
                                <span class="text-amber-200 text-xs font-bold">Momen #${idx + 1}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}
