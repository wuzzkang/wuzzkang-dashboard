import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: Wedding Hero - Botanical Sage Green Variant (V2)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const groomNickname = data.groom_nickname || 'Adrian';
    const brideNickname = data.bride_nickname || 'Clarissa';
    const headline = data.headline || `${groomNickname} & ${brideNickname}`;
    const subheadline = data.subheadline || 'Dengan mengucap syukur kepada Tuhan YME, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia pernikahan outdoor kami.';
    const ctaText = data.cta_text || '🌿 BUKA UNDANGAN';
    const ctaUrl = data.cta_url || '#wedding_couple';
    const bgImage = data.image_url || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80';
    const recipientName = data.recipient_name || 'Tamu Undangan';

    const bgStyle = data.bg_style || 'emerald';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-hero-sage-styles-${Math.random().toString(36).substr(2, 9)}`;

    // Botanical Eucalyptus Leaf SVGs
    const eucalyptusTL = `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <path d="M10 10 C40 30 70 80 110 110" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>
        <path d="M25 20 C45 10 55 25 45 40 C35 50 20 40 25 20 Z" fill="#10b981" opacity="0.6"/>
        <path d="M45 45 C70 35 80 50 65 65 C50 75 40 65 45 45 Z" fill="#059669" opacity="0.65"/>
        <path d="M70 70 C90 60 100 75 85 90 C70 100 65 90 70 70 Z" fill="#34d399" opacity="0.5"/>
    </svg>`;

    const eucalyptusTR = `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" style="transform:scaleX(-1)">
        <path d="M10 10 C40 30 70 80 110 110" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>
        <path d="M25 20 C45 10 55 25 45 40 C35 50 20 40 25 20 Z" fill="#10b981" opacity="0.6"/>
        <path d="M45 45 C70 35 80 50 65 65 C50 75 40 65 45 45 Z" fill="#059669" opacity="0.65"/>
        <path d="M70 70 C90 60 100 75 85 90 C70 100 65 90 70 70 Z" fill="#34d399" opacity="0.5"/>
    </svg>`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,400..700;1,400..700&display=swap');
            .wedding-font-serif { font-family: 'Cormorant Garamond', serif; }
            .wedding-font-cursive { font-family: 'Alex Brush', cursive; }
        </style>

        <section id="wedding_hero" class="min-h-screen py-20 md:py-28 px-6 ${sectionBgClass} relative flex flex-col items-center justify-center text-center overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}

            <!-- Background Overlay with prewedding photo -->
            <div class="absolute inset-0 z-0 bg-cover bg-center opacity-30" style="background-image: linear-gradient(rgba(6, 78, 59, 0.75), rgba(4, 47, 38, 0.9)), url('${bgImage}');"></div>

            <!-- Botanical Leaf Ornaments -->
            <div class="absolute top-2 left-2 w-32 h-32 pointer-events-none z-10 opacity-80">${eucalyptusTL}</div>
            <div class="absolute top-2 right-2 w-32 h-32 pointer-events-none z-10 opacity-80">${eucalyptusTR}</div>

            <div class="max-w-3xl mx-auto relative z-20 flex flex-col items-center">
                <!-- Sub-badge -->
                <span class="wedding-font-serif uppercase tracking-[0.3em] text-xs font-bold text-emerald-300 mb-3 block px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
                    🌿 Botanical Garden • Undangan Pernikahan
                </span>

                <!-- Cursive Bride & Groom Name -->
                <h1 class="wedding-font-cursive text-6xl md:text-8xl text-white my-3 drop-shadow-lg tracking-wide">
                    ${headline}
                </h1>

                <div class="w-16 h-0.5 bg-emerald-400/60 my-5"></div>

                <!-- Subheadline -->
                <p class="${theme.subtitle} text-xs md:text-sm max-w-lg leading-relaxed mb-8">
                    ${subheadline}
                </p>

                <!-- Recipient Guest Card -->
                <div class="bg-emerald-950/40 backdrop-blur-md border border-emerald-500/30 rounded-3xl p-5 md:p-6 mb-8 max-w-sm w-full shadow-2xl">
                    <span class="text-[10px] font-bold text-emerald-300 uppercase tracking-widest block mb-1">Kepada Yth. Bapak/Ibu/Saudara/i:</span>
                    <h3 class="wedding-font-serif text-2xl font-bold text-white tracking-wide">${recipientName}</h3>
                </div>

                <!-- Open Invitation Button -->
                <a href="${ctaUrl}" class="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer">
                    <span>${ctaText}</span>
                </a>
            </div>
        </section>
    `;
}
