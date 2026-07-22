import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: Wedding Gallery (V2)
 * Prewedding photo album grid
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Galeri Album Prewedding';
    const subtitle = data.subtitle || 'Momen kebersamaan dan kenangan indah mempelai';
    const images = data.images || [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80'
    ];

    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    return `
        <section id="wedding_gallery" class="py-16 md:py-24 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-5xl mx-auto text-center relative z-10">
                <div class="mb-12">
                    <span class="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-2">📸 PREWEDDING GALLERY</span>
                    <h2 class="text-2xl md:text-4xl font-extrabold ${theme.title} mb-3 tracking-tight">${title}</h2>
                    <p class="${theme.subtitle} text-xs md:text-sm max-w-md mx-auto">${subtitle}</p>
                </div>

                <!-- Gallery Photo Grid -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${images.map((img, idx) => `
                        <div class="group relative overflow-hidden rounded-2xl md:rounded-3xl border border-orange-500/20 aspect-square shadow-xl cursor-pointer">
                            <img src="${img}" alt="Prewedding Photo #${idx + 1}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                <span class="text-white text-xs font-bold">Momen #${idx + 1}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}
