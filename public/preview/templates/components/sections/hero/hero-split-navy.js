/**
 * Modular Section: Hero Split Navy (V2)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const headline = data.headline || 'Solusi Layanan Profesional & Terpercaya';
    const subheadline = data.subheadline || 'Kami membantu mengembangkan bisnis Anda dengan solusi digital modern dan tim berpengalaman.';
    const ctaText = data.cta_text || 'Hubungi Kami';
    const ctaUrl = data.cta_url || '#contact';
    const ctaSecondaryText = data.cta_secondary_text !== undefined ? data.cta_secondary_text : 'Pelajari Lebih Lanjut';
    const ctaSecondaryUrl = data.cta_secondary_url || '#services';
    const imageUrl = data.image_url || '';

    const defaultHeroSvg = `
        <svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px;border-radius:1.2rem;border:3px solid rgba(249,115,22,0.3);box-shadow:0 32px 80px rgba(0,0,0,0.45);">
            <rect width="480" height="360" rx="16" fill="#163654"/>
            <rect x="30" y="30" width="420" height="300" rx="10" fill="#0a1f35"/>
            <rect x="30" y="30" width="420" height="36" rx="10" fill="#0f2e4c"/>
            <circle cx="58" cy="48" r="6" fill="#f97316" opacity="0.7"/>
            <circle cx="78" cy="48" r="6" fill="#f59e0b" opacity="0.6"/>
            <circle cx="98" cy="48" r="6" fill="#22c55e" opacity="0.6"/>
            <rect x="30" y="66" width="90" height="264" fill="#112840"/>
            <rect x="42" y="84" width="66" height="10" rx="4" fill="rgba(255,255,255,0.15)"/>
            <rect x="42" y="104" width="52" height="8" rx="3" fill="rgba(249,115,22,0.6)"/>
            <rect x="42" y="122" width="58" height="8" rx="3" fill="rgba(255,255,255,0.1)"/>
            <rect x="42" y="140" width="46" height="8" rx="3" fill="rgba(255,255,255,0.1)"/>
            <rect x="135" y="76" width="140" height="80" rx="8" fill="#163654"/>
            <rect x="145" y="88" width="90" height="8" rx="3" fill="rgba(255,255,255,0.5)"/>
            <rect x="145" y="104" width="70" height="6" rx="3" fill="rgba(255,255,255,0.25)"/>
            <rect x="145" y="116" width="60" height="24" rx="5" fill="#f97316"/>
            <rect x="285" y="76" width="150" height="80" rx="8" fill="#163654"/>
            <rect x="135" y="168" width="300" height="60" rx="8" fill="#163654"/>
            <rect x="135" y="240" width="300" height="80" rx="8" fill="#163654"/>
            <polyline points="155,300 185,275 220,285 260,255 300,265 340,245 415,260" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;

    return `
        <section class="relative jasa-navy-dark min-h-screen flex items-center py-16 md:py-24 px-6 overflow-hidden text-white">
            <div class="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <div class="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                        ✨ Layanan Unggulan
                    </div>
                    <h1 class="text-3xl md:text-5xl font-extrabold leading-tight text-white mb-4">
                        ${headline}
                    </h1>
                    <p class="text-slate-300 text-base md:text-lg leading-relaxed mb-8">
                        ${subheadline}
                    </p>
                    <div class="flex flex-wrap gap-4">
                        <a
                            href="${ctaUrl}"
                            target="${ctaUrl.startsWith('http') ? '_blank' : '_self'}"
                            rel="noopener noreferrer"
                            class="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-7 py-3.5 rounded-lg shadow-lg shadow-orange-500/30 transition-all duration-200"
                        >
                            ${ctaText}
                        </a>
                        ${ctaSecondaryText ? `
                            <a
                                href="${ctaSecondaryUrl}"
                                target="${ctaSecondaryUrl.startsWith('http') ? '_blank' : '_self'}"
                                rel="noopener noreferrer"
                                class="inline-block border border-slate-400 hover:border-white text-slate-200 hover:text-white font-bold px-7 py-3.5 rounded-lg transition-all duration-200"
                            >
                                ${ctaSecondaryText}
                            </a>
                        ` : ''}
                    </div>
                </div>
                <div class="flex justify-center md:justify-end">
                    ${imageUrl ? `
                        <img src="${imageUrl}" alt="${headline}" class="w-full max-w-md rounded-2xl border-2 border-orange-500/30 shadow-2xl object-cover aspect-4/3" />
                    ` : defaultHeroSvg}
                </div>
            </div>
        </section>
    `;
}
