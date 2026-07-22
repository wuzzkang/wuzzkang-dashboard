import { getSectionStyle } from '../../../utils/sectionStyle.js';

const DEFAULT_GROOM_AVATAR = 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/groom-avatar.jpg';
const DEFAULT_BRIDE_AVATAR = 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/bride-avatar.jpg';

/**
 * Modular Section: Wedding Couple (V2)
 * Profile card for Groom & Bride
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const bismillahQuote = data.bismillah_quote || 'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Semoga Allah SWT memberkahi ikatan pernikahan kami.';
    
    const groomName = data.groom_name || 'Romeo Adiputra, S.T.';
    const groomNickname = data.groom_nickname || 'Romeo';
    const groomParents = data.groom_parents || 'Putra Pertama dari Bpk. Ahmad & Ibu Siti';
    const groomIg = data.groom_instagram || '';
    const groomPhoto = data.groom_photo || data.groom_image || DEFAULT_GROOM_AVATAR;

    const brideName = data.bride_name || 'Juliet Saraswati, S.Ked.';
    const brideNickname = data.bride_nickname || 'Juliet';
    const brideParents = data.bride_parents || 'Putri Kedua dari Bpk. Budi & Ibu Rini';
    const brideIg = data.bride_instagram || '';
    const bridePhoto = data.bride_photo || data.bride_image || DEFAULT_BRIDE_AVATAR;

    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    return `
        <section id="wedding_couple" class="py-20 md:py-28 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-5xl mx-auto text-center relative z-10">
                <!-- Bismillah & Opening Quote -->
                <div class="mb-14 max-w-2xl mx-auto">
                    <span class="text-2xl font-serif text-orange-400 block mb-3">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
                    <p class="${theme.subtitle} text-xs md:text-sm leading-relaxed italic">
                        "${bismillahQuote}"
                    </p>
                </div>

                <!-- Couple Cards (Groom & Bride) -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
                    <!-- Groom Profile -->
                    <div class="${theme.cardBg} border rounded-3xl p-8 text-center flex flex-col items-center shadow-xl transition-all hover:-translate-y-1">
                        <div class="mb-6">
                            <img src="${groomPhoto}" alt="${groomName}" class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-orange-500/40 shadow-xl mx-auto ring-4 ring-orange-500/10" />
                        </div>
                        <h3 class="text-xl md:text-2xl font-extrabold ${theme.cardTitle} mb-1 tracking-tight">${groomName}</h3>
                        <span class="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">Mempelai Pria (${groomNickname})</span>
                        <p class="${theme.cardDesc} text-xs md:text-sm leading-relaxed max-w-xs mb-4">${groomParents}</p>
                        ${groomIg ? `
                            <a href="https://instagram.com/${groomIg.replace('@', '')}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold hover:bg-orange-500/20 transition-all">
                                <span>📸 @${groomIg.replace('@', '')}</span>
                            </a>
                        ` : ''}
                    </div>

                    <!-- Bride Profile -->
                    <div class="${theme.cardBg} border rounded-3xl p-8 text-center flex flex-col items-center shadow-xl transition-all hover:-translate-y-1">
                        <div class="mb-6">
                            <img src="${bridePhoto}" alt="${brideName}" class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-orange-500/40 shadow-xl mx-auto ring-4 ring-orange-500/10" />
                        </div>
                        <h3 class="text-xl md:text-2xl font-extrabold ${theme.cardTitle} mb-1 tracking-tight">${brideName}</h3>
                        <span class="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">Mempelai Wanita (${brideNickname})</span>
                        <p class="${theme.cardDesc} text-xs md:text-sm leading-relaxed max-w-xs mb-4">${brideParents}</p>
                        ${brideIg ? `
                            <a href="https://instagram.com/${brideIg.replace('@', '')}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold hover:bg-orange-500/20 transition-all">
                                <span>📸 @${brideIg.replace('@', '')}</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        </section>
    `;
}
