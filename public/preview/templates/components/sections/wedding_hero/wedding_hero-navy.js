import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: Wedding Hero / Cover Utama (V2)
 * Based on V1 Sage Green / Classic Love wedding cover design
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const groomNickname = data.groom_nickname || 'Romeo';
    const brideNickname = data.bride_nickname || 'Juliet';
    const headline = data.headline || `${groomNickname} & ${brideNickname}`;
    const subheadline = data.subheadline || 'Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di momen bahagia pernikahan kami.';
    const ctaText = data.cta_text || '💌 BUKA UNDANGAN';
    const ctaUrl = data.cta_url || '#wedding_couple';
    const bgImage = data.image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';
    const recipientName = data.recipient_name || 'Tamu Undangan';

    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-hero-styles-${Math.random().toString(36).substr(2, 9)}`;

    // Corner leaf SVG ornaments from V1
    const leafSvgTL = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <path d="M0 0 C30 30 70 70 100 100" stroke="#f97316" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M20 15 C35 10 45 20 40 30 C35 40 25 35 20 15 Z" fill="#f97316" opacity="0.4"/>
        <path d="M40 35 C55 30 65 40 60 50 C55 60 45 55 40 35 Z" fill="#fb923c" opacity="0.4"/>
        <path d="M60 55 C75 50 85 60 80 70 C75 80 65 75 60 55 Z" fill="#f97316" opacity="0.35"/>
    </svg>`;

    const leafSvgTR = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" style="transform:scaleX(-1)">
        <path d="M0 0 C30 30 70 70 100 100" stroke="#f97316" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M20 15 C35 10 45 20 40 30 C35 40 25 35 20 15 Z" fill="#f97316" opacity="0.4"/>
        <path d="M40 35 C55 30 65 40 60 50 C55 60 45 55 40 35 Z" fill="#fb923c" opacity="0.4"/>
        <path d="M60 55 C75 50 85 60 80 70 C75 80 65 75 60 55 Z" fill="#f97316" opacity="0.35"/>
    </svg>`;

    const leafSvgBL = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" style="transform:scaleY(-1)">
        <path d="M0 0 C30 30 70 70 100 100" stroke="#f97316" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M20 15 C35 10 45 20 40 30 C35 40 25 35 20 15 Z" fill="#f97316" opacity="0.4"/>
        <path d="M40 35 C55 30 65 40 60 50 C55 60 45 55 40 35 Z" fill="#fb923c" opacity="0.4"/>
        <path d="M60 55 C75 50 85 60 80 70 C75 80 65 75 60 55 Z" fill="#f97316" opacity="0.35"/>
    </svg>`;

    const leafSvgBR = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" style="transform:scale(-1)">
        <path d="M0 0 C30 30 70 70 100 100" stroke="#f97316" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M20 15 C35 10 45 20 40 30 C35 40 25 35 20 15 Z" fill="#f97316" opacity="0.4"/>
        <path d="M40 35 C55 30 65 40 60 50 C55 60 45 55 40 35 Z" fill="#fb923c" opacity="0.4"/>
        <path d="M60 55 C75 50 85 60 80 70 C75 80 65 75 60 55 Z" fill="#f97316" opacity="0.35"/>
    </svg>`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
            .wedding-font-serif { font-family: 'Playfair Display', serif; }
            .wedding-font-cursive { font-family: 'Great Vibes', cursive; }
        </style>

        <section id="wedding_hero" class="min-h-screen py-20 md:py-28 px-6 ${sectionBgClass} relative flex flex-col items-center justify-center text-center overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}

            <!-- Background Overlay with prewedding photo -->
            <div class="absolute inset-0 z-0 bg-cover bg-center opacity-25" style="background-image: linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url('${bgImage}');"></div>

            <!-- Leaf Corner Ornaments -->
            <div class="absolute top-2 left-2 w-28 h-28 pointer-events-none z-10 opacity-70">${leafSvgTL}</div>
            <div class="absolute top-2 right-2 w-28 h-28 pointer-events-none z-10 opacity-70">${leafSvgTR}</div>
            <div class="absolute bottom-2 left-2 w-28 h-28 pointer-events-none z-10 opacity-70">${leafSvgBL}</div>
            <div class="absolute bottom-2 right-2 w-28 h-28 pointer-events-none z-10 opacity-70">${leafSvgBR}</div>

            <div class="max-w-3xl mx-auto relative z-20 flex flex-col items-center">
                <!-- Sub-badge -->
                <span class="wedding-font-serif uppercase tracking-[0.3em] text-xs font-bold text-orange-400 mb-3 block">
                    Walimatul 'Ursy • Undangan Pernikahan
                </span>

                <!-- Cursive Bride & Groom Name -->
                <h1 class="wedding-font-cursive text-6xl md:text-8xl text-white my-3 drop-shadow-lg tracking-wide">
                    ${headline}
                </h1>

                <div class="w-16 h-0.5 bg-orange-400/50 my-6"></div>

                <!-- Subheadline -->
                <p class="${theme.subtitle} text-xs md:text-sm max-w-lg leading-relaxed mb-8">
                    ${subheadline}
                </p>

                <!-- Recipient Guest Card -->
                <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 md:p-6 mb-8 max-w-sm w-full shadow-2xl">
                    <span class="text-[10px] font-bold text-orange-300 uppercase tracking-widest block mb-1">Kepada Yth. Bapak/Ibu/Saudara/i:</span>
                    <h3 class="wedding-font-serif text-xl md:text-2xl font-bold text-white tracking-wide">${recipientName}</h3>
                </div>

                <!-- Open Invitation Button -->
                <a href="${ctaUrl}" class="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-xl hover:shadow-orange-500/20 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer">
                    <span>${ctaText}</span>
                </a>
            </div>
        </section>
    `;
}
