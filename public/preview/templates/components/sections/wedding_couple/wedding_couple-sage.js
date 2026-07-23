import { getSectionStyle } from '../../../utils/sectionStyle.js';

const DEFAULT_GROOM_AVATAR = 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/groom-avatar.jpg';
const DEFAULT_BRIDE_AVATAR = 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/bride-avatar.jpg';

export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const bismillahQuote = data.bismillah_quote || 'Cinta tidak pernah memandang perbedaan. Bersama dalam kasih yang suci, kami melangkah menuju lembaran baru kebahagiaan.';
    
    const groomName = data.groom_name || 'Adrian Pratama, S.T.';
    const groomNickname = data.groom_nickname || 'Adrian';
    const groomParents = data.groom_parents || 'Putra Pertama dari Bpk. Hendra & Ibu Liliana';
    const groomIg = data.groom_instagram || 'adrian_pratama';
    const groomPhoto = data.groom_photo || data.groom_image || DEFAULT_GROOM_AVATAR;

    const brideName = data.bride_name || 'Clarissa Maharani, S.Ds.';
    const brideNickname = data.bride_nickname || 'Clarissa';
    const brideParents = data.bride_parents || 'Putri Kedua dari Bpk. Supriyadi & Ibu Maya';
    const brideIg = data.bride_instagram || 'clarissa_maharani';
    const bridePhoto = data.bride_photo || data.bride_image || DEFAULT_BRIDE_AVATAR;

    const bgStyle = data.bg_style || 'emerald';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-couple-sage-styles-${Math.random().toString(36).substr(2, 9)}`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,400..700;1,400..700&display=swap');
            .wedding-font-serif { font-family: 'Cormorant Garamond', serif; }
            .wedding-font-cursive { font-family: 'Alex Brush', cursive; }
        </style>

        <section id="wedding_couple" class="py-20 md:py-28 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-5xl mx-auto text-center relative z-10">
                <!-- Bismillah & Opening Quote -->
                <div class="mb-14 max-w-2xl mx-auto">
                    <span class="wedding-font-serif text-2xl font-bold text-emerald-300 block mb-3">🌿 Walimatul 'Ursy</span>
                    <p class="${theme.subtitle} text-xs md:text-sm leading-relaxed italic wedding-font-serif text-base md:text-lg">
                        "${bismillahQuote}"
                    </p>
                </div>

                <!-- Couple Cards (Groom & Bride) -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
                    <!-- Groom Profile -->
                    <div class="${theme.cardBg} border border-emerald-500/30 rounded-3xl p-8 text-center flex flex-col items-center shadow-xl transition-all hover:-translate-y-1">
                        <div class="mb-6 relative">
                            <img src="${groomPhoto}" alt="${groomName}" class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-emerald-400/40 shadow-xl mx-auto ring-4 ring-emerald-500/20" />
                        </div>
                        <h3 class="wedding-font-serif text-2xl md:text-3xl font-extrabold ${theme.cardTitle} mb-1 tracking-tight">${groomName}</h3>
                        <span class="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-3">Mempelai Pria (${groomNickname})</span>
                        <p class="${theme.cardDesc} text-xs md:text-sm leading-relaxed max-w-xs mb-4">${groomParents}</p>
                        ${groomIg ? `
                            <a href="https://instagram.com/${groomIg.replace('@', '')}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition-all">
                                <span>📸 @${groomIg.replace('@', '')}</span>
                            </a>
                        ` : ''}
                    </div>

                    <!-- Bride Profile -->
                    <div class="${theme.cardBg} border border-emerald-500/30 rounded-3xl p-8 text-center flex flex-col items-center shadow-xl transition-all hover:-translate-y-1">
                        <div class="mb-6 relative">
                            <img src="${bridePhoto}" alt="${brideName}" class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-emerald-400/40 shadow-xl mx-auto ring-4 ring-emerald-500/20" />
                        </div>
                        <h3 class="wedding-font-serif text-2xl md:text-3xl font-extrabold ${theme.cardTitle} mb-1 tracking-tight">${brideName}</h3>
                        <span class="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-3">Mempelai Wanita (${brideNickname})</span>
                        <p class="${theme.cardDesc} text-xs md:text-sm leading-relaxed max-w-xs mb-4">${brideParents}</p>
                        ${brideIg ? `
                            <a href="https://instagram.com/${brideIg.replace('@', '')}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition-all">
                                <span>📸 @${brideIg.replace('@', '')}</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        </section>
    `;
}
