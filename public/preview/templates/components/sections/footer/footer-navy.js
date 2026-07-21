import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: Footer Navy (V2 Preview)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const brandName = data.brand_name || brandConfig.name || 'Siluet';
    const copyrightText = data.copyright_text || `© ${new Date().getFullYear()} ${brandName}. Hak Cipta Dilindungi Undang-Undang.`;
    const disclaimer = data.disclaimer || '';
    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';

    const { theme, patternHtml } = getSectionStyle(bgStyle, bgShade);

    return `
        <footer id="footer" class="py-12 px-6 ${theme.footerBg} text-center relative overflow-hidden">
            ${patternHtml}
            <div class="max-w-6xl mx-auto space-y-4 relative z-10">
                <div class="font-extrabold text-lg tracking-tight ${theme.heading}">
                    ${brandName}
                </div>

                ${disclaimer ? `
                    <p class="text-xs ${theme.subtitle} max-w-2xl mx-auto leading-relaxed opacity-80">
                        ${disclaimer}
                    </p>
                ` : ''}

                <div class="text-xs ${theme.subtitle} border-t border-white/10 pt-6">
                    ${copyrightText}
                </div>
            </div>
        </footer>
    `;
}
