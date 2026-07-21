import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: Contact Footer Navy (V2 Preview)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title !== undefined ? data.title : 'Siap Mengembangkan Bisnis Anda?';
    const subheadline = data.subheadline !== undefined ? data.subheadline : 'Hubungi tim kami sekarang juga untuk konsultasi gratis dan penawaran khusus.';
    const whatsapp = data.whatsapp || '';
    const email = data.email || 'support@wuzzkang.com';
    const address = data.address || 'Jakarta, Indonesia';
    const copyright = data.copyright || `© ${new Date().getFullYear()} ${brandConfig.name || 'Wuzzkang'}. All Rights Reserved.`;
    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';

    const cleanWa = whatsapp.replace(/\D/g, '');
    const waUrl = cleanWa ? `https://wa.me/${cleanWa}?text=${encodeURIComponent('Halo, saya berminat dengan layanan Anda.')}` : '#';

    const { theme, sectionBgClass, patternHtml } = getSectionStyle(bgStyle, bgShade);

    return `
        <section id="contact" class="py-16 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12 border-b border-white/10 pb-12 relative z-10">
                <div>
                    <div class="inline-block ${theme.badge} border text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                        Kontak &amp; Konsultasi
                    </div>
                    <h2 class="text-2xl md:text-4xl font-extrabold ${theme.heading} mb-4">${title}</h2>
                    <p class="${theme.subtitle} text-sm md:text-base leading-relaxed mb-6">${subheadline}</p>
                    ${cleanWa ? `
                        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-3 ${theme.btnPrimary} font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all">
                            <span>💬 Hubungi via WhatsApp</span>
                        </a>
                    ` : ''}
                </div>
                <div class="space-y-4 text-sm ${theme.subtitle} bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div class="flex items-center gap-3">
                        <span class="${theme.topLine.replace('bg-', 'text-')} text-lg">📧</span>
                        <span>${email}</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="${theme.topLine.replace('bg-', 'text-')} text-lg">📍</span>
                        <span>${address}</span>
                    </div>
                </div>
            </div>
            <div class="max-w-6xl mx-auto text-center text-xs ${theme.subtitle} relative z-10">
                ${copyright}
            </div>
        </section>
    `;
}
