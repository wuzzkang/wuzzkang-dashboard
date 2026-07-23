import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: Wedding Hero - Adat Jawa Tradisional Variant (V2)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const groomNickname = data.groom_nickname || 'Raden';
    const brideNickname = data.bride_nickname || 'Dewi';
    const headline = data.headline || `${groomNickname} & ${brideNickname}`;
    const subheadline = data.subheadline || 'Nyuwun doa pangestu Bpk/Ibu/Saudara/i ing Pahargyan Ageng Pernikahan Adat Jawa kawula.';
    const ctaText = data.cta_text || '🪷 BUKA UNDANGAN ADAT';
    const ctaUrl = data.cta_url || '#wedding_couple';
    const bgImage = data.image_url || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80';
    const recipientName = data.recipient_name || 'Tamu Undangan';

    const bgStyle = data.bg_style || 'amber';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-hero-javanese-styles-${Math.random().toString(36).substr(2, 9)}`;

    // Gunungan Wayang Jawa SVG Ornament
    const gununganSvg = `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <path d="M50 5 L95 110 H5 Z" fill="#d97706" opacity="0.15" stroke="#f59e0b" stroke-width="1.5"/>
        <path d="M50 15 L85 105 H15 Z" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3 2"/>
        <circle cx="50" cy="55" r="18" fill="#b45309" opacity="0.3" stroke="#f59e0b" stroke-width="1"/>
        <path d="M50 25 V85 M35 55 H65" stroke="#fbbf24" stroke-width="1.5"/>
        <path d="M50 35 L60 55 L50 75 L40 55 Z" fill="#f59e0b" opacity="0.4"/>
    </svg>`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Pinyon+Script&display=swap');
            .wedding-font-serif { font-family: 'Cinzel', serif; }
            .wedding-font-cursive { font-family: 'Pinyon Script', cursive; }
        </style>

        <section id="wedding_hero" class="min-h-screen py-20 md:py-28 px-6 ${sectionBgClass} relative flex flex-col items-center justify-center text-center overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}

            <!-- Background Overlay with prewedding photo - Enhanced Opacity & Soft Gradient -->
            <div class="absolute inset-0 z-0 bg-cover bg-center opacity-65" style="background-image: linear-gradient(to bottom, rgba(69, 26, 3, 0.45), rgba(30, 10, 2, 0.75)), url('${bgImage}');"></div>

            <!-- Gunungan Wayang Ornaments -->
            <div class="absolute -top-6 left-1/2 -translate-x-1/2 w-40 h-48 pointer-events-none z-10 opacity-70">${gununganSvg}</div>

            <div class="max-w-3xl mx-auto relative z-20 flex flex-col items-center mt-12">
                <!-- Sub-badge Jawa -->
                <span class="wedding-font-serif uppercase tracking-[0.35em] text-xs font-bold text-amber-200 mb-3 block px-5 py-1.5 rounded-full bg-amber-950/70 border border-amber-400/30 backdrop-blur-md shadow-lg">
                    🪷 Pawiwahan Adat Jawa • Ulem Pernikahan
                </span>

                <!-- Cursive Bride & Groom Name -->
                <h1 class="wedding-font-cursive text-7xl md:text-9xl text-amber-100 my-2 tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
                    ${headline}
                </h1>

                <div class="flex items-center gap-3 my-4">
                    <div class="w-12 h-0.5 bg-amber-400/70"></div>
                    <span class="text-amber-400 text-sm">✦</span>
                    <div class="w-12 h-0.5 bg-amber-400/70"></div>
                </div>

                <!-- Subheadline -->
                <p class="${theme.subtitle} text-xs md:text-sm max-w-lg leading-relaxed mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium">
                    ${subheadline}
                </p>

                <!-- Recipient Guest Card with Double Line Gapura Border -->
                <div class="bg-amber-950/70 backdrop-blur-md border-2 border-amber-500/40 rounded-3xl p-5 md:p-6 mb-8 max-w-sm w-full shadow-2xl relative">
                    <div class="absolute inset-1 border border-amber-500/20 rounded-2xl pointer-events-none"></div>
                    <span class="text-[10px] font-bold text-amber-300 uppercase tracking-widest block mb-1">Serat Ulem Katur Bpk/Ibu/Saudara/i:</span>
                    <h3 class="wedding-font-serif text-2xl font-bold text-amber-100 tracking-wide">${recipientName}</h3>
                </div>

                <!-- Open Invitation Button -->
                <a href="${ctaUrl}" class="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-extrabold text-xs shadow-xl shadow-amber-950/50 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer">
                    <span>${ctaText}</span>
                </a>
            </div>
        </section>
    `;
}
