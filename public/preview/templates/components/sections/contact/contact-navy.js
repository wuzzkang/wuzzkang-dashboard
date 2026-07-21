import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: Contact Navy (V2 Preview)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Siap Meluncurkan Landing Page Anda?';
    const subtitle = data.subtitle || 'Konsultasikan kebutuhan proyek Anda secara langsung dengan tim spesialis kami hari ini.';
    const waNumber = data.wa_number || data.phone || '6281234567890';
    const waText = data.wa_text || 'Halo, saya ingin konsultasi mengenai pembuatan Landing Page V2.';
    const ctaText = data.cta_text || 'Hubungi via WhatsApp';
    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';

    const cleanWaNumber = waNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(waText)}`;

    const { theme, sectionBgClass, patternHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default');

    return `
        <section id="contact" class="py-20 md:py-28 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            <div class="max-w-4xl mx-auto text-center relative z-10">
                <div class="w-12 h-1 ${theme.topLine} rounded-full mx-auto mb-4"></div>
                <h2 class="text-3xl md:text-5xl font-black ${theme.heading} tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
                    ${title}
                </h2>
                <p class="${theme.subtitle} text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                    ${subtitle}
                </p>

                <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="px-8 py-4 text-base font-extrabold rounded-2xl ${theme.btnPrimary} transition-all active:scale-95 flex items-center gap-3">
                        <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.999 1.592-1.048 3.824 3.792-.995.999 1.592z"/>
                        </svg>
                        <span>${ctaText}</span>
                    </a>
                </div>
            </div>
        </section>
    `;
}
