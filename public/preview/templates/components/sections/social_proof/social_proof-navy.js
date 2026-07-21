import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: Social Proof Navy (V2 Preview)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Dipercaya Oleh Ratusan Pebisnis Digital';
    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';

    const stats = Array.isArray(data.stats) ? data.stats : [
        { value: '500+', label: 'Landing Page Terpublikasi' },
        { value: '98%', label: 'Klien Puas & Repeat Order' },
        { value: '3.5x', label: 'Rata-rata Kenaikan Omset' }
    ];

    const { theme, sectionBgClass, patternHtml } = getSectionStyle(bgStyle, bgShade);

    const statsHtml = stats.map((stat) => `
        <div class="${theme.cardBg} border rounded-3xl p-6 md:p-8 text-center transition-all shadow-xl hover:-translate-y-1 relative z-10">
            <div class="text-3xl md:text-5xl font-black ${theme.heading} mb-2 tracking-tight">
                ${stat.value || '0'}
            </div>
            <div class="${theme.subtitle} text-xs md:text-sm font-semibold uppercase tracking-wider">
                ${stat.label || 'Keterangan Statistik'}
            </div>
        </div>
    `).join('');

    return `
        <section id="social_proof" class="py-16 md:py-24 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            <div class="max-w-6xl mx-auto text-center relative z-10">
                <div class="w-12 h-1 ${theme.topLine} rounded-full mx-auto mb-4"></div>
                <h2 class="text-xl md:text-3xl font-extrabold ${theme.heading} tracking-tight mb-12 max-w-2xl mx-auto leading-snug">
                    ${title}
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${statsHtml}
                </div>
            </div>
        </section>
    `;
}
