import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: Wedding Hero - Romantic Floral Rose Variant (V2)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const groomNickname = data.groom_nickname || 'Fajar';
    const brideNickname = data.bride_nickname || 'Nadia';
    const headline = data.headline || `${groomNickname} & ${brideNickname}`;
    const subheadline = data.subheadline || 'Dengan penuh rasa syukur dan kebahagiaan, kami mengundang Bapak/Ibu/Saudara/i untuk merayakan hari pernikahan kami.';
    const ctaText = data.cta_text || '💖 BUKA UNDANGAN ROMANTIS';
    const ctaUrl = data.cta_url || '#wedding_couple';
    const bgImage = data.image_url || 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80';
    let recipientName = data.recipient_name || 'Bapak/Ibu/Saudara/i';
    if (typeof window !== 'undefined' && window.location) {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const guestFromUrl = urlParams.get('to') || urlParams.get('recipient');
            if (guestFromUrl && guestFromUrl.trim()) {
                recipientName = guestFromUrl.trim();
            }
        } catch (e) {}
    }

    const bgStyle = data.bg_style || 'rose';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-hero-rose-styles-${Math.random().toString(36).substr(2, 9)}`;

    // Blooming Sakura & Rose Petals SVG Ornaments
    const sakuraTL = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <circle cx="20" cy="20" r="10" fill="#fb7185" opacity="0.5"/>
        <circle cx="35" cy="15" r="8" fill="#f43f5e" opacity="0.4"/>
        <circle cx="15" cy="35" r="9" fill="#fda4af" opacity="0.6"/>
        <path d="M10 10 Q40 50 90 90" stroke="#f43f5e" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="50" cy="50" r="12" fill="#fb7185" opacity="0.4"/>
    </svg>`;

    const sakuraTR = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" style="transform:scaleX(-1)">
        <circle cx="20" cy="20" r="10" fill="#fb7185" opacity="0.5"/>
        <circle cx="35" cy="15" r="8" fill="#f43f5e" opacity="0.4"/>
        <circle cx="15" cy="35" r="9" fill="#fda4af" opacity="0.6"/>
        <path d="M10 10 Q40 50 90 90" stroke="#f43f5e" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="50" cy="50" r="12" fill="#fb7185" opacity="0.4"/>
    </svg>`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Parisienne&family=Montserrat:ital,wght@0,300..900;1,300..900&display=swap');
            .wedding-font-serif { font-family: 'Montserrat', sans-serif; font-weight: 700; }
            .wedding-font-cursive { font-family: 'Parisienne', cursive; }
        </style>

        <section id="wedding_hero" class="min-h-screen py-20 md:py-28 px-6 ${sectionBgClass} relative flex flex-col items-center justify-center text-center overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}

            <!-- Background Overlay with prewedding photo - Enhanced Opacity & Soft Gradient -->
            <div class="absolute inset-0 z-0 bg-cover bg-center opacity-65" style="background-image: linear-gradient(to bottom, rgba(76, 5, 25, 0.45), rgba(40, 3, 14, 0.75)), url('${bgImage}');"></div>

            <!-- Sakura Ornaments -->
            <div class="absolute top-2 left-2 w-32 h-32 pointer-events-none z-10 opacity-80">${sakuraTL}</div>
            <div class="absolute top-2 right-2 w-32 h-32 pointer-events-none z-10 opacity-80">${sakuraTR}</div>

            <div class="max-w-3xl mx-auto relative z-20 flex flex-col items-center">
                <!-- Sub-badge Pink -->
                <span class="wedding-font-serif uppercase tracking-[0.3em] text-xs font-bold text-rose-200 mb-3 block px-4 py-1.5 rounded-full bg-rose-950/70 border border-rose-400/30 backdrop-blur-md shadow-lg">
                    🌸 Romantic Rose • Undangan Pernikahan
                </span>

                <!-- Cursive Bride & Groom Name -->
                <h1 class="wedding-font-cursive text-7xl md:text-9xl text-rose-100 my-3 tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
                    ${headline}
                </h1>

                <div class="w-20 h-0.5 bg-rose-400/80 rounded-full my-5 shadow-sm"></div>

                <!-- Subheadline -->
                <p class="${theme.subtitle} text-xs md:text-sm max-w-lg leading-relaxed mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium">
                    ${subheadline}
                </p>

                <!-- Recipient Guest Card with Soft Curved Border -->
                <div class="bg-rose-950/70 backdrop-blur-md border border-rose-400/40 rounded-3xl p-5 md:p-6 mb-8 max-w-sm w-full shadow-2xl">
                    <span class="text-[10px] font-bold text-rose-300 uppercase tracking-widest block mb-1">Kepada Yth. Bapak/Ibu/Saudara/i:</span>
                    <h3 class="wedding-font-serif text-xl md:text-2xl font-bold text-white tracking-wide">${recipientName}</h3>
                </div>

                <!-- Open Invitation Button -->
                <a href="${ctaUrl}" class="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-xs shadow-xl shadow-rose-900/50 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer">
                    <span>${ctaText}</span>
                </a>
            </div>
        </section>
    `;
}
