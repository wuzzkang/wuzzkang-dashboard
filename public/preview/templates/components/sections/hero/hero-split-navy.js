import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: Hero Split Navy (V2 Preview)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const headline = data.headline || 'Tingkatkan Penjualan Anda dengan Landing Page Berkonversi Tinggi';
    const subheadline = data.subheadline || 'Solusi digital profesional yang dirancang khusus untuk memikat calon pembeli dan melejitkan omset bisnis Anda.';
    const ctaText = data.cta_text || 'Konsultasi Gratis';
    const ctaUrl = data.cta_url || '#contact';
    const ctaSecondaryText = data.cta_secondary_text || 'Pelajari Lebih Lanjut';
    const ctaSecondaryUrl = data.cta_secondary_url || '#services';
    const imageUrl = data.image_url || '';
    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';

    const { theme, sectionBgClass, patternHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default');

    const defaultHeroSvg = `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:1.2rem;border:3px solid rgba(249,115,22,0.2);box-shadow:0 24px 60px rgba(15,46,76,0.14);">
            <rect width="400" height="300" rx="16" fill="#0f2e4c"/>
            <circle cx="200" cy="150" r="100" fill="url(#hero-grad)" opacity="0.6"/>
            <defs>
                <radialGradient id="hero-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#f97316"/>
                    <stop offset="100%" stop-color="#0f2e4c" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <rect x="40" y="40" width="320" height="180" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
            <path d="M60 170 L130 110 L190 140 L260 80 L340 150" fill="none" stroke="#f97316" stroke-width="4" stroke-linecap="round"/>
            <circle cx="260" cy="80" r="6" fill="#f97316"/>
            <rect x="60" y="240" width="120" height="12" rx="6" fill="#f97316"/>
            <rect x="190" y="240" width="150" height="12" rx="6" fill="rgba(255,255,255,0.2)"/>
        </svg>
    `;

    return `
        <section id="hero" class="py-20 md:py-28 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                    <div class="w-12 h-1 ${theme.topLine} rounded-full mb-6"></div>
                    <h1 class="text-3xl md:text-5xl font-black ${theme.heading} tracking-tight leading-tight mb-6">
                        ${headline}
                    </h1>
                    <p class="${theme.subtitle} text-base md:text-lg leading-relaxed mb-8">
                        ${subheadline}
                    </p>
                    <div class="flex flex-wrap gap-4">
                        ${ctaText ? `
                            <a href="${ctaUrl}" class="px-6 py-3.5 text-sm font-extrabold rounded-2xl ${theme.btnPrimary} transition-all active:scale-95">
                                ${ctaText}
                            </a>
                        ` : ''}
                        ${ctaSecondaryText ? `
                            <a href="${ctaSecondaryUrl}" class="px-6 py-3.5 text-sm font-bold rounded-2xl ${theme.btnSecondary} transition-all active:scale-95">
                                ${ctaSecondaryText}
                            </a>
                        ` : ''}
                    </div>
                </div>

                <div class="relative">
                    ${imageUrl ? `
                        <img src="${imageUrl}" alt="${headline}" class="w-full rounded-2xl border-2 ${theme.imgBorder} object-cover aspect-4/3" />
                    ` : defaultHeroSvg}
                </div>
            </div>
        </section>
    `;
}
