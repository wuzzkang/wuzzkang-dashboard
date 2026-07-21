import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: Services Grid Navy (V2 Preview)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Layanan Unggulan Kami';
    const subtitle = data.subtitle || 'Solusi terlengkap yang dirancang khusus untuk pertumbuhan bisnis Anda.';
    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';

    const items = Array.isArray(data.items) ? data.items : [
        { title: 'Desain Landing Page Custom', description: 'Tampilan eksklusif yang menyesuaikan identitas brand Anda.' },
        { title: 'Optimasi Kecepatan & SEO', description: 'Loading super cepat dan siap bersaing di halaman utama Google.' },
        { title: 'Integrasi WhatsApp & Form', description: 'Calon pembeli langsung terhubung ke WhatsApp bisnis Anda.' }
    ];

    const { theme, sectionBgClass, patternHtml } = getSectionStyle(bgStyle, bgShade);

    const itemsHtml = items.map((item, idx) => `
        <div class="${theme.cardBg} border rounded-3xl p-6 md:p-8 flex flex-col transition-all shadow-xl hover:-translate-y-1 relative z-10">
            <div class="w-10 h-10 rounded-2xl ${theme.cardNum} font-extrabold text-sm flex items-center justify-center mb-6 shadow-md">
                ${idx + 1}
            </div>
            <h3 class="text-lg font-bold ${theme.cardTitle} mb-3 tracking-tight">${item.title || 'Nama Layanan'}</h3>
            <p class="${theme.cardDesc} text-xs md:text-sm leading-relaxed">${item.description || 'Deskripsi singkat layanan'}</p>
        </div>
    `).join('');

    return `
        <section id="services" class="py-20 md:py-28 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            <div class="max-w-6xl mx-auto text-center relative z-10">
                <div class="w-12 h-1 ${theme.topLine} rounded-full mx-auto mb-4"></div>
                <h2 class="text-2xl md:text-4xl font-extrabold ${theme.heading} tracking-tight mb-4 max-w-3xl mx-auto leading-snug">
                    ${title}
                </h2>
                <p class="${theme.subtitle} text-sm md:text-base max-w-2xl mx-auto mb-14 leading-relaxed">
                    ${subtitle}
                </p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    ${itemsHtml}
                </div>
            </div>
        </section>
    `;
}
