import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: Toko Online Store Guarantee & Trust Badges (V2 Preview)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Mengapa Belanja Di Toko Kami?';
    const features = Array.isArray(data.features) && data.features.length > 0 ? data.features : [
        { icon: '🚚', title: 'Pengiriman Cepat & Aman', desc: 'Proses kirim amanah dan tepat waktu ke seluruh Indonesia.' },
        { icon: '🛡️', title: 'Produk 100% Original', desc: 'Jaminan kualitas barang asli tanpa cacat dan garansi ganti baru.' },
        { icon: '💬', title: 'Admin Fast Response', desc: 'Layanan customer service ramah yang siap membantu order Anda.' },
        { icon: '💳', title: 'Pembayaran Mudah', desc: 'Dukung transfer bank, e-wallet, hingga sistem COD di tempat.' }
    ];

    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const featuresHtml = features.map((item, idx) => `
        <div class="${theme.cardBg} border rounded-3xl p-6 md:p-8 text-center flex flex-col items-center shadow-xl transition-all hover:-translate-y-1">
            <div class="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center text-2xl font-bold mb-5 shadow-inner">
                ${item.icon || '⭐'}
            </div>
            <h3 class="text-base md:text-lg font-extrabold ${theme.cardTitle} mb-2 tracking-tight">${item.title || 'Jaminan Toko'}</h3>
            <p class="${theme.cardDesc} text-xs md:text-sm leading-relaxed">${item.desc || 'Deskripsi singkat jaminan belanja.'}</p>
        </div>
    `).join('');

    return `
        <section id="store_guarantee" class="py-20 md:py-28 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-6xl mx-auto text-center relative z-10">
                <div class="w-12 h-1 ${theme.topLine} rounded-full mx-auto mb-4"></div>
                <h2 class="text-2xl md:text-4xl font-extrabold ${theme.heading} tracking-tight mb-14 leading-snug">
                    ${title}
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${featuresHtml}
                </div>
            </div>
        </section>
    `;
}
