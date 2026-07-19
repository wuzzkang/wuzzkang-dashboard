/**
 * Pricing Component
 * Reusable multi-card Pricing Plans grid component.
 */
export function initPricing(containerEl, plans, options = {}) {
    if (!containerEl) return;

    const theme = options.theme || 'clean-trust';
    const ctaHref = options.ctaHref || '#';
    const ctaOnly = !!options.ctaOnly;
    const ctaText = options.ctaText || 'Konsultasi Sekarang';

    if (ctaOnly) {
        let blockHtml = '';
        if (theme === 'professional-navy') {
            blockHtml = `
                <div style="text-align:center;padding:1.5rem;max-width:32rem;margin:0 auto;">
                    <a href="${ctaHref}" target="_blank" rel="noopener noreferrer" class="btn-orange" style="font-size:1rem;padding:0.85rem 2.2rem;display:inline-block;border-radius:99px;box-shadow:0 10px 30px rgba(249,115,22,0.3);text-decoration:none;">
                        ${ctaText}
                    </a>
                </div>
            `;
        } else {
            blockHtml = `
                <div class="text-center py-6 max-w-lg mx-auto px-4">
                    <a href="${ctaHref}" target="_blank" rel="noopener noreferrer" class="inline-block px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/35 transition-all text-base">
                        ${ctaText}
                    </a>
                </div>
            `;
        }
        containerEl.innerHTML = blockHtml;
        return;
    }

    if (!Array.isArray(plans) || plans.length === 0) {
        containerEl.innerHTML = '';
        return;
    }

    let gridClass = 'grid grid-cols-1 gap-6';
    if (plans.length === 2) {
        gridClass = 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto';
    } else if (plans.length >= 3) {
        gridClass = 'grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto';
    }

    let cardClass = '';
    let highlightCardClass = '';
    let badgeClass = '';
    let nameClass = '';
    let priceContainerClass = '';
    let priceClass = '';
    let originalPriceClass = '';
    let featuresClass = '';
    let featureItemClass = '';
    let checkIconClass = '';
    let buttonClass = '';
    let highlightButtonClass = '';

    if (theme === 'professional-navy') {
        // Uses Jasa vanilla CSS classes
        cardClass = 'jasa-plan-card';
        highlightCardClass = 'highlighted';
        badgeClass = 'jasa-plan-badge';
        nameClass = 'jasa-plan-name';
        priceContainerClass = ''; // styled in style.css or parent style tag
        priceClass = 'jasa-plan-price';
        originalPriceClass = 'jasa-plan-original';
        featuresClass = 'jasa-plan-features';
        featureItemClass = '';
        checkIconClass = 'jasa-check-icon';
        buttonClass = 'btn-outline-navy';
        highlightButtonClass = 'btn-orange';
    } else {
        // Tailwind default (clean-trust, etc.)
        cardClass = 'bg-white border border-slate-200 rounded-3xl p-8 flex flex-col relative transition-all duration-300 hover:shadow-xl';
        highlightCardClass = 'border-2 border-teal-500 shadow-lg md:scale-105';
        badgeClass = 'absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider';
        nameClass = 'text-xs font-bold text-slate-400 uppercase tracking-widest mb-3';
        priceContainerClass = 'flex items-baseline gap-1.5 mb-6';
        priceClass = 'text-3xl font-black text-slate-900';
        originalPriceClass = 'text-sm text-slate-400 line-through';
        featuresClass = 'space-y-3 mb-8 flex-grow';
        featureItemClass = 'flex items-start gap-2.5 text-slate-600 text-sm';
        checkIconClass = 'text-teal-500 font-bold flex-shrink-0';
        buttonClass = 'block w-full py-3.5 text-center text-sm font-bold text-teal-600 border border-teal-600 rounded-2xl hover:bg-teal-50/50 transition-all';
        highlightButtonClass = 'block w-full py-3.5 text-center text-sm font-bold text-white bg-teal-600 border border-teal-600 rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/35';
    }

    const plansHtml = plans.map(plan => {
        const isHighlighted = !!plan.highlighted;
        const currentCardClass = isHighlighted ? `${cardClass} ${highlightCardClass}` : cardClass;
        const currentBtnClass = isHighlighted ? highlightButtonClass : buttonClass;

        const hasSalePrice = plan.sale_price && (typeof plan.sale_price === 'string' ? plan.sale_price.trim() : true);
        const hasOriginalPrice = plan.original_price && (typeof plan.original_price === 'string' ? plan.original_price.trim() : true);
        const showPrice = !!(hasSalePrice || hasOriginalPrice);
        let priceHtml = '';

        if (showPrice) {
            if (theme === 'professional-navy') {
                priceHtml = `
                    <div style="display:flex;align-items:baseline;flex-wrap:wrap;gap:0.35rem;margin:0.5rem 0 1rem;">
                        <span class="${priceClass}">${plan.sale_price || plan.original_price || ''}</span>
                        ${plan.original_price && plan.sale_price && plan.original_price !== plan.sale_price
                            ? `<span class="${originalPriceClass}">${plan.original_price}</span>`
                            : ''}
                    </div>
                `;
            } else {
                priceHtml = `
                    <div class="${priceContainerClass}">
                        <span class="${priceClass}">${plan.sale_price || plan.original_price || ''}</span>
                        ${plan.original_price && plan.sale_price && plan.original_price !== plan.sale_price
                            ? `<span class="${originalPriceClass}">${plan.original_price}</span>`
                            : ''}
                    </div>
                `;
            }
        }

        const featuresListHtml = Array.isArray(plan.features) && plan.features.length > 0
            ? plan.features.map(f => {
                if (theme === 'professional-navy') {
                    return `
                        <li>
                            <span class="${checkIconClass}">✔</span>
                            <span>${f}</span>
                        </li>
                    `;
                } else {
                    return `
                        <li class="${featureItemClass}">
                            <span class="${checkIconClass}">✔</span>
                            <span>${f}</span>
                        </li>
                    `;
                }
            }).join('')
            : '';

        const pricingFeaturesBlock = featuresListHtml
            ? `<ul class="${featuresClass}">${featuresListHtml}</ul>`
            : '';

        const planCtaText = plan.cta_text || 'Pesan Paket Ini';
        
        let buttonStyle = '';
        if (theme === 'professional-navy') {
            buttonStyle = 'style="display:block;text-align:center;width:100%;box-sizing:border-box;"';
        }

        return `
            <div class="${currentCardClass}">
                ${plan.badge ? `<div class="${badgeClass}">${plan.badge}</div>` : ''}
                <div class="${nameClass}">${plan.name || ''}</div>
                ${priceHtml}
                ${pricingFeaturesBlock}
                <a href="${ctaHref}" target="_blank" rel="noopener noreferrer" class="${currentBtnClass}" ${buttonStyle}>
                    ${planCtaText}
                </a>
            </div>
        `;
    }).join('');

    containerEl.innerHTML = `
        <div class="${gridClass}">
            ${plansHtml}
        </div>
    `;
}
