/**
 * Modular Section: Pricing Grid Navy (V2)
 * Supports two modes:
 *   1. Normal: grid of pricing plan cards
 *   2. CTA-Only (data.cta_only = true): single prominent CTA button
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title !== undefined ? data.title : 'Pilihan Paket Hemat';
    const subtitle = data.subtitle !== undefined ? data.subtitle : 'Pilih paket yang paling sesuai dengan skala kebutuhan bisnis Anda.';

    // ── CTA-Only Mode ──────────────────────────────────────────────────────
    if (data.cta_only) {
        const ctaText = data.cta_text || 'Konsultasi Sekarang';
        const ctaUrl  = data.cta_url  || '#contact';

        return `
            <section id="pricing" class="py-16 px-6 bg-slate-50 text-slate-800">
                <div class="max-w-6xl mx-auto text-center mb-10">
                    <div class="w-12 h-1 bg-orange-500 rounded-full mx-auto mb-4"></div>
                    <h2 class="text-2xl md:text-4xl font-extrabold text-slate-900 mb-3">${title}</h2>
                    <p class="text-slate-500 text-sm md:text-base max-w-xl mx-auto mb-8">${subtitle}</p>
                    <a
                        href="${ctaUrl}"
                        target="${ctaUrl.startsWith('http') ? '_blank' : '_self'}"
                        rel="noopener noreferrer"
                        class="inline-block px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-200 hover:-translate-y-0.5"
                    >
                        ${ctaText}
                    </a>
                </div>
            </section>
        `;
    }

    // ── Normal Pricing Cards Mode ──────────────────────────────────────────
    const plans = Array.isArray(data.plans) && data.plans.length > 0 ? data.plans : [
        {
            name: 'Basic',
            badge: 'Standard',
            original_price: 'Rp 1.500.000',
            sale_price: 'Rp 990.000',
            cta_text: 'Pilih Paket Basic',
            features: ['Fitur Utama Lintas Platform', 'Dukungan Email 24/7', 'Garansi 30 Hari'],
            highlighted: false,
        },
        {
            name: 'Pro',
            badge: 'Paling Populer',
            original_price: 'Rp 3.000.000',
            sale_price: 'Rp 1.990.000',
            cta_text: 'Pilih Paket Pro',
            features: ['Semua Fitur Basic', 'Prioritas Pengoperasian', 'Konsultasi Strategis', 'Garansi 60 Hari'],
            highlighted: true,
        },
    ];

    const plansHtml = plans.map(p => `
        <div class="relative bg-white border-2 ${p.highlighted ? 'border-orange-500 shadow-xl scale-105 z-10' : 'border-slate-200 shadow-sm'} rounded-2xl p-6 flex flex-col justify-between">
            ${p.badge ? `
                <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    ${p.badge}
                </div>
            ` : ''}
            <div>
                <div class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">${p.name || ''}</div>
                <div class="flex items-baseline gap-2 mb-4">
                    <span class="text-3xl font-black text-slate-900">${p.sale_price || p.price || ''}</span>
                    ${p.original_price && p.sale_price && p.original_price !== p.sale_price ? `<span class="text-sm text-slate-400 line-through">${p.original_price}</span>` : ''}
                </div>
                ${Array.isArray(p.features) && p.features.length > 0 ? `
                    <ul class="space-y-2 py-4 border-t border-slate-100 mb-6 text-xs text-slate-700">
                        ${p.features.map(f => `
                            <li class="flex items-center gap-2">
                                <span class="text-orange-500 font-bold">✓</span> ${f}
                            </li>
                        `).join('')}
                    </ul>
                ` : ''}
            </div>
            <a href="#contact" class="w-full text-center ${p.highlighted ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'} font-bold py-3 rounded-lg text-sm transition-all duration-200">
                ${p.cta_text || 'Pilih Paket'}
            </a>
        </div>
    `).join('');

    return `
        <section id="pricing" class="py-16 px-6 bg-slate-50 text-slate-800">
            <div class="max-w-6xl mx-auto text-center mb-12">
                <div class="w-12 h-1 bg-orange-500 rounded-full mx-auto mb-4"></div>
                <h2 class="text-2xl md:text-4xl font-extrabold text-slate-900 mb-3">${title}</h2>
                <p class="text-slate-500 text-sm md:text-base max-w-xl mx-auto">${subtitle}</p>
            </div>
            <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-${Math.min(plans.length, 3)} gap-8 items-stretch">
                ${plansHtml}
            </div>
        </section>
    `;
}
