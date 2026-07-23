import { getSectionStyle } from '../../../utils/sectionStyle.js';

const DEFAULT_GROOM_AVATAR = 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/groom-avatar.jpg';
const DEFAULT_BRIDE_AVATAR = 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/bride-avatar.jpg';

export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const bismillahQuote = data.bismillah_quote || 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari meksudmu sendiri, supaya kamu merasa tenteram kepadanya.';
    
    const groomName = data.groom_name || 'Fajar Pratama, S.Kom.';
    const groomNickname = data.groom_nickname || 'Fajar';
    const groomParents = data.groom_parents || 'Putra Kedua dari Bpk. Irwan & Ibu Ratna';
    const groomIg = data.groom_instagram || 'fajar_pratama';
    const groomPhoto = data.groom_photo || data.groom_image || DEFAULT_GROOM_AVATAR;

    const brideName = data.bride_name || 'Nadia Anindya, M.Psi.';
    const brideNickname = data.bride_nickname || 'Nadia';
    const brideParents = data.bride_parents || 'Putri Pertama dari Bpk. Wahyu & Ibu Anita';
    const brideIg = data.bride_instagram || 'nadia_anindya';
    const bridePhoto = data.bride_photo || data.bride_image || DEFAULT_BRIDE_AVATAR;

    const bgStyle = data.bg_style || 'rose';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-couple-rose-styles-${Math.random().toString(36).substr(2, 9)}`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Parisienne&family=Montserrat:ital,wght@0,300..900;1,300..900&display=swap');
            .wedding-font-serif { font-family: 'Montserrat', sans-serif; font-weight: 700; }
            .wedding-font-cursive { font-family: 'Parisienne', cursive; }
        </style>

        <section id="wedding_couple" class="py-20 md:py-28 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-5xl mx-auto text-center relative z-10">
                <!-- Bismillah & Opening Quote -->
                <div class="mb-14 max-w-2xl mx-auto">
                    <span class="wedding-font-cursive text-4xl font-bold text-rose-300 block mb-2">Moments of Love</span>
                    <p class="${theme.subtitle} text-xs md:text-sm leading-relaxed italic">
                        "${bismillahQuote}"
                    </p>
                </div>

                <!-- Couple Cards with Soft Curved Borders -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
                    <!-- Groom Profile -->
                    <div class="bg-rose-950/60 border border-rose-500/30 rounded-3xl p-8 text-center flex flex-col items-center shadow-2xl transition-all hover:-translate-y-1">
                        <div class="mb-6 relative">
                            <img src="${groomPhoto}" alt="${groomName}" class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-rose-400/50 shadow-xl mx-auto ring-4 ring-rose-500/20" />
                        </div>
                        <h3 class="wedding-font-serif text-xl md:text-2xl font-bold text-rose-100 mb-1 tracking-tight">${groomName}</h3>
                        <span class="text-xs font-bold text-rose-300 uppercase tracking-wider mb-3">Mempelai Pria (${groomNickname})</span>
                        <p class="text-rose-200/80 text-xs md:text-sm leading-relaxed max-w-xs mb-4">${groomParents}</p>
                        ${groomIg ? `
                            <a href="https://instagram.com/${groomIg.replace('@', '')}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/30 transition-all">
                                <span>💖 @${groomIg.replace('@', '')}</span>
                            </a>
                        ` : ''}
                    </div>

                    <!-- Bride Profile -->
                    <div class="bg-rose-950/60 border border-rose-500/30 rounded-3xl p-8 text-center flex flex-col items-center shadow-2xl transition-all hover:-translate-y-1">
                        <div class="mb-6 relative">
                            <img src="${bridePhoto}" alt="${brideName}" class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-rose-400/50 shadow-xl mx-auto ring-4 ring-rose-500/20" />
                        </div>
                        <h3 class="wedding-font-serif text-xl md:text-2xl font-bold text-rose-100 mb-1 tracking-tight">${brideName}</h3>
                        <span class="text-xs font-bold text-rose-300 uppercase tracking-wider mb-3">Mempelai Wanita (${brideNickname})</span>
                        <p class="text-rose-200/80 text-xs md:text-sm leading-relaxed max-w-xs mb-4">${brideParents}</p>
                        ${brideIg ? `
                            <a href="https://instagram.com/${brideIg.replace('@', '')}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/30 transition-all">
                                <span>💖 @${brideIg.replace('@', '')}</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        </section>
    `;
}
