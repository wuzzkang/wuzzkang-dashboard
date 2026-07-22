import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: Toko Online Product Grid Catalog (V2 Preview)
 * Features product cards, category badges, sale prices, and direct WA checkout
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Katalog Produk Pilihan Terbaik';
    const subtitle = data.subtitle || 'Temukan koleksi produk berkualitas tinggi dengan pemesanan mudah secara langsung ke WhatsApp Admin.';

    const products = Array.isArray(data.products) && data.products.length > 0 ? data.products : [
        { name: 'Koleksi Best Seller #1', category: 'Best Seller', sale_price: 'Rp 149.000', original_price: 'Rp 299.000', badge: 'Diskon 50%', description: 'Produk unggulan favorit pelanggan dengan bahan kualitas tinggi.', image_url: '' },
        { name: 'Koleksi Premium #2', category: 'New Arrival', sale_price: 'Rp 199.000', original_price: 'Rp 399.000', badge: 'Terlaris', description: 'Desain elegan dan eksklusif edisi terbatas minggu ini.', image_url: '' },
        { name: 'Paket Bundling Hemat #3', category: 'Promo Paket', sale_price: 'Rp 279.000', original_price: 'Rp 599.000', badge: 'Hemat BANYAK', description: 'Paket kombinasi hemat isi 2 item serba praktis.', image_url: '' }
    ];

    const whatsapp = data.whatsapp || brandConfig.whatsapp || '6281234567890';
    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const defaultProductSvg = `
        <div class="w-full aspect-4/3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-center text-4xl shadow-inner mb-5">
            📦
        </div>
    `;

    const productsHtml = products.map((prod, idx) => {
        const waMessage = encodeURIComponent(`Halo, saya berminat memesan produk "${prod.name}" (${prod.sale_price || ''}). Apakah stok masih tersedia?`);
        const waLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${waMessage}`;

        return `
            <div class="${theme.cardBg} border rounded-3xl p-6 text-left flex flex-col justify-between shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden group">
                ${prod.badge ? `
                    <div class="absolute top-4 right-4 z-20">
                        <span class="bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                            ${prod.badge}
                        </span>
                    </div>
                ` : ''}

                <div>
                    <!-- Product Thumbnail -->
                    <div class="overflow-hidden rounded-2xl mb-5">
                        ${prod.image_url ? `
                            <img src="${prod.image_url}" alt="${prod.name}" class="w-full aspect-4/3 object-cover group-hover:scale-105 transition-transform duration-300 rounded-2xl border border-slate-800" />
                        ` : defaultProductSvg}
                    </div>

                    ${prod.category ? `
                        <span class="text-[10px] font-extrabold uppercase tracking-wider text-orange-400 block mb-1">
                            ${prod.category}
                        </span>
                    ` : ''}

                    <h3 class="text-base md:text-lg font-extrabold ${theme.cardTitle} mb-2 leading-snug tracking-tight">
                        ${prod.name || 'Nama Produk'}
                    </h3>

                    <p class="${theme.cardDesc} text-xs leading-relaxed mb-5 line-clamp-2">
                        ${prod.description || 'Deskripsi singkat mengenai keunggulan produk ini.'}
                    </p>
                </div>

                <div>
                    <!-- Price Tag -->
                    <div class="flex items-baseline gap-2 mb-4 pt-3 border-t border-slate-800/60">
                        <span class="text-lg md:text-xl font-black text-orange-400">
                            ${prod.sale_price || 'Rp 99.000'}
                        </span>
                        ${prod.original_price ? `
                            <span class="text-xs line-through ${theme.cardDesc} opacity-60">
                                ${prod.original_price}
                            </span>
                        ` : ''}
                    </div>

                    <!-- Checkout Button -->
                    <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="${theme.btnPrimary} w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all active:scale-95">
                        <span>🛒 Pesan Sekarang (WA)</span>
                    </a>
                </div>
            </div>
        `;
    }).join('');

    return `
        <section id="product_grid" class="py-20 md:py-28 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-6xl mx-auto text-center relative z-10">
                <div class="w-12 h-1 ${theme.topLine} rounded-full mx-auto mb-4"></div>
                <h2 class="text-2xl md:text-4xl font-extrabold ${theme.heading} tracking-tight mb-3 leading-snug">
                    ${title}
                </h2>
                <p class="${theme.subtitle} text-xs md:text-sm max-w-2xl mx-auto mb-14 leading-relaxed">
                    ${subtitle}
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    ${productsHtml}
                </div>
            </div>
        </section>
    `;
}
