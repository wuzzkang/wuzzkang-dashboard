import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: About Simple Navy (V2 Preview)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title !== undefined ? data.title : 'Tentang Layanan Kami';
    const desc = data.description !== undefined ? data.description : (data.desc !== undefined ? data.desc : 'Kami adalah mitra terpercaya dalam menghadirkan solusi profesional berkualitas tinggi dengan komitmen penuh terhadap kepuasan klien.');
    const imageUrl = data.image_url || '';
    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';

    const { theme, sectionBgClass, patternHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default');

    const defaultAboutSvg = `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:1.2rem;border:3px solid rgba(249,115,22,0.2);box-shadow:0 24px 60px rgba(15,46,76,0.14);">
            <rect width="400" height="300" rx="16" fill="#f0f4f8"/>
            <rect x="20" y="20" width="180" height="260" rx="12" fill="#0f2e4c"/>
            <circle cx="110" cy="100" r="40" fill="#f97316" opacity="0.9"/>
            <rect x="55" y="155" width="110" height="10" rx="4" fill="rgba(255,255,255,0.6)"/>
            <rect x="70" y="173" width="80" height="7" rx="3" fill="rgba(255,255,255,0.3)"/>
            <rect x="220" y="20" width="160" height="120" rx="12" fill="#0f2e4c"/>
            <rect x="235" y="36" width="130" height="8" rx="3" fill="rgba(255,255,255,0.55)"/>
            <rect x="235" y="88" width="80" height="32" rx="6" fill="#f97316"/>
            <rect x="220" y="156" width="160" height="124" rx="12" fill="#163654"/>
        </svg>
    `;

    return `
        <section id="about" class="py-20 md:py-24 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                    ${imageUrl ? `
                        <img src="${imageUrl}" alt="${title}" class="w-full rounded-2xl border-2 ${theme.imgBorder} object-cover aspect-4/3" />
                    ` : defaultAboutSvg}
                </div>
                <div>
                    <div class="w-12 h-1 ${theme.topLine} rounded-full mb-4"></div>
                    <h2 class="text-2xl md:text-4xl font-extrabold ${theme.heading} mb-4 tracking-tight leading-snug">
                        ${title}
                    </h2>
                    <p class="${theme.subtitle} text-base md:text-lg leading-relaxed">
                        ${desc}
                    </p>
                </div>
            </div>
        </section>
    `;
}
