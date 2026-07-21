import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: Pricing Grid Navy (V2 Preview)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Pilihan Paket Investasi Terbaik';
    const subtitle = data.subtitle || 'Pilih paket yang sesuai dengan kebutuhan skala bisnis Anda tanpa biaya tersembunyi.';
    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';
    const isCtaOnly = data.cta_only === true || data.cta_only === 'true' || data.mode === 'cta';

    const { theme, sectionBgClass, patternHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default');

    if (isCtaOnly) {
        const ctaText = data.cta_text || 'Konsultasi Sekarang';
        const ctaUrl = data.cta_url || '#contact';

        return `
            <section id="pricing" class="py-20 md:py-28 px-6 ${sectionBgClass} relative overflow-hidden">
                ${patternHtml}
                <div class="max-w-4xl mx-auto text-center relative z-10">
                    <div class="w-12 h-1 ${theme.topLine} rounded-full mx-auto mb-4"></div>
                    <h2 class="text-2xl md:text-4xl font-extrabold ${theme.heading} tracking-tight mb-4 max-w-3xl mx-auto leading-snug">
                        ${title}
                    </h2>
                    <p class="${theme.subtitle} text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
                        ${subtitle}
                    </p>

                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="${ctaUrl}" class="px-8 py-4 text-base font-extrabold rounded-2xl ${theme.btnPrimary} transition-all active:scale-95 flex items-center gap-3">
                            <span>${ctaText}</span>
                            <svg class="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </section>
        `;
    }

    const rawPlans = Array.isArray(data.plans) && data.plans.length > 0 ? data.plans : data.packages;
    const packages = Array.isArray(rawPlans) && rawPlans.length > 0 ? rawPlans : [
        { name: 'Starter', price: 'Rp 499.000', period: '/sekali bayar', popular: false, features: ['1 Landing Page Custom', 'Domain & Hosting 1 Tahun', 'Integrasi WhatsApp Direct', 'Revisi 2x'], ctaText: 'Pilih Starter', ctaUrl: '#contact' },
        { name: 'Professional', price: 'Rp 999.000', period: '/sekali bayar', popular: true, features: ['1 Landing Page High-Convert', 'Domain .COM & Speed Boost', 'Form Pemesanan & Pixel Facebook', 'Garansi Garansi Garansi', 'Revisi Tanpa Batas'], ctaText: 'Pilih Professional', ctaUrl: '#contact' },
        { name: 'Enterprise', price: 'Rp 1.999.000', period: '/sekali bayar', popular: false, features: ['Multi-Page / Funnel System', 'Integrasi Payment Gateway', 'Kustom Desain Lanjutan', 'Support Prioritas 24/7'], ctaText: 'Hubungi Kami', ctaUrl: '#contact' }
    ];

    const packagesHtml = packages.map((pkg) => {
        const isPopular = pkg.popular === true || pkg.popular === 'true';
        const featuresList = Array.isArray(pkg.features) ? pkg.features : [];

        const featuresHtml = featuresList.map(feat => `
            <li class="flex items-center gap-2.5 text-xs md:text-sm ${theme.subtitle}">
                <span class="${theme.heading} font-bold text-base">✓</span>
                <span>${feat}</span>
            </li>
        `).join('');

        return `
            <div class="${theme.cardBg} border rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-all shadow-xl hover:-translate-y-1 relative z-10 ${
                isPopular ? 'ring-2 ring-orange-500 scale-105 shadow-2xl' : ''
            }">
                <div>
                    ${isPopular ? `
                        <div class="inline-block px-3 py-1 ${theme.badge} border text-[10px] font-extrabold rounded-full uppercase tracking-wider mb-4">
                            🔥 Paling Populer
                        </div>
                    ` : ''}

                    <h3 class="text-xl font-bold ${theme.cardTitle} mb-2 tracking-tight">${pkg.name || 'Nama Paket'}</h3>
                    <div class="flex items-baseline gap-1 mb-6">
                        <span class="text-2xl md:text-3xl font-black ${theme.heading}">${pkg.price || pkg.sale_price || 'Rp 0'}</span>
                        <span class="${theme.subtitle} text-xs font-semibold">${pkg.period || ''}</span>
                    </div>

                    <ul class="space-y-3 mb-8 text-left border-t border-white/10 pt-6">
                        ${featuresHtml}
                    </ul>
                </div>

                <a href="${pkg.ctaUrl || pkg.cta_text || '#contact'}" class="w-full py-3.5 text-center text-xs md:text-sm font-extrabold rounded-2xl ${
                    isPopular ? theme.btnPrimary : theme.btnSecondary
                } transition-all active:scale-95">
                    ${pkg.ctaText || pkg.cta_text || 'Pilih Paket'}
                </a>
            </div>
        `;
    }).join('');

    return `
        <section id="pricing" class="py-20 md:py-28 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            <div class="max-w-6xl mx-auto text-center relative z-10">
                <div class="w-12 h-1 ${theme.topLine} rounded-full mx-auto mb-4"></div>
                <h2 class="text-2xl md:text-4xl font-extrabold ${theme.heading} tracking-tight mb-4 max-w-3xl mx-auto leading-snug">
                    ${title}
                </h2>
                <p class="${theme.subtitle} text-sm md:text-base max-w-2xl mx-auto mb-16 leading-relaxed">
                    ${subtitle}
                </p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    ${packagesHtml}
                </div>
            </div>
        </section>
    `;
}
