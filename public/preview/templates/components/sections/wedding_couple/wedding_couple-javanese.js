import { getSectionStyle } from '../../../utils/sectionStyle.js';

const DEFAULT_GROOM_AVATAR = 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/groom-avatar.jpg';
const DEFAULT_BRIDE_AVATAR = 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/bride-avatar.jpg';

export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const bismillahQuote = data.bismillah_quote || 'Maha Suci Allah SWT ingkang sampun nyiptakaken makhluk-Nya kanthi berpasang-pasangan. Semoga Allah memberkahi ikatan suci pernikahan kawula.';
    
    const groomName = data.groom_name || 'Raden Mas Haryo, S.T.';
    const groomNickname = data.groom_nickname || 'Raden';
    const groomParents = data.groom_parents || 'Putra Kapisan saking Bpk. KRT Sosrodiningrat & Ibu Raden Ajeng Wulandari';
    const groomIg = data.groom_instagram || 'raden_haryo';
    const groomPhoto = data.groom_photo || data.groom_image || DEFAULT_GROOM_AVATAR;

    const brideName = data.bride_name || 'Dewi Sekartaji, S.E.';
    const brideNickname = data.bride_nickname || 'Dewi';
    const brideParents = data.bride_parents || 'Putri Kapindho saking Bpk. Dr. Sutrisno & Ibu Endang Rahayu';
    const brideIg = data.bride_instagram || 'dewi_sekartaji';
    const bridePhoto = data.bride_photo || data.bride_image || DEFAULT_BRIDE_AVATAR;

    const bgStyle = data.bg_style || 'amber';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-couple-javanese-styles-${Math.random().toString(36).substr(2, 9)}`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Pinyon+Script&display=swap');
            .wedding-font-serif { font-family: 'Cinzel', serif; }
            .wedding-font-cursive { font-family: 'Pinyon Script', cursive; }
        </style>

        <section id="wedding_couple" class="py-20 md:py-28 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-5xl mx-auto text-center relative z-10">
                <!-- Bismillah & Opening Quote -->
                <div class="mb-14 max-w-2xl mx-auto">
                    <span class="text-3xl font-serif text-amber-300 block mb-3">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
                    <p class="${theme.subtitle} text-xs md:text-sm leading-relaxed italic wedding-font-serif text-base">
                        "${bismillahQuote}"
                    </p>
                </div>

                <!-- Couple Cards with Javanese Gapura Border -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
                    <!-- Groom Profile -->
                    <div class="bg-amber-950/70 border-2 border-amber-500/40 rounded-3xl p-8 text-center flex flex-col items-center shadow-2xl relative transition-all hover:-translate-y-1">
                        <div class="absolute inset-1 border border-amber-500/20 rounded-2xl pointer-events-none"></div>
                        <div class="mb-6 relative">
                            <img src="${groomPhoto}" alt="${groomName}" class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-amber-500/50 shadow-xl mx-auto ring-4 ring-amber-500/20" />
                        </div>
                        <h3 class="wedding-font-serif text-2xl md:text-3xl font-extrabold text-amber-100 mb-1 tracking-wide">${groomName}</h3>
                        <span class="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Mempelai Pria (${groomNickname})</span>
                        <p class="text-amber-200/80 text-xs md:text-sm leading-relaxed max-w-xs mb-4">${groomParents}</p>
                        ${groomIg ? `
                            <a href="https://instagram.com/${groomIg.replace('@', '')}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 transition-all">
                                <span>📸 @${groomIg.replace('@', '')}</span>
                            </a>
                        ` : ''}
                    </div>

                    <!-- Bride Profile -->
                    <div class="bg-amber-950/70 border-2 border-amber-500/40 rounded-3xl p-8 text-center flex flex-col items-center shadow-2xl relative transition-all hover:-translate-y-1">
                        <div class="absolute inset-1 border border-amber-500/20 rounded-2xl pointer-events-none"></div>
                        <div class="mb-6 relative">
                            <img src="${bridePhoto}" alt="${brideName}" class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-amber-500/50 shadow-xl mx-auto ring-4 ring-amber-500/20" />
                        </div>
                        <h3 class="wedding-font-serif text-2xl md:text-3xl font-extrabold text-amber-100 mb-1 tracking-wide">${brideName}</h3>
                        <span class="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Mempelai Wanita (${brideNickname})</span>
                        <p class="text-amber-200/80 text-xs md:text-sm leading-relaxed max-w-xs mb-4">${brideParents}</p>
                        ${brideIg ? `
                            <a href="https://instagram.com/${brideIg.replace('@', '')}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 transition-all">
                                <span>📸 @${brideIg.replace('@', '')}</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        </section>
    `;
}
