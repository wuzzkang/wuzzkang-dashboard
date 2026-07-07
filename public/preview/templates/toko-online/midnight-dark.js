/**
 * Midnight Dark Toko-Online Template
 * Premium dark luxury theme, gold accents, products grid, WA checkout integration
 */
export async function render(pageConfig, guestName = 'Tamu Undangan') {
    const appEl = document.getElementById('app');
    const content = pageConfig.content || {};
    const store = content.store || {};
    const products = content.products || [];
    const contact = content.contact || {};
    const quote = content.quote || '';

    // Style injector
    if (!document.getElementById('midnight-dark-styles')) {
        const style = document.createElement('style');
        style.id = 'midnight-dark-styles';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
            
            #app {
                font-family: 'Plus Jakarta Sans', sans-serif;
                background-color: #09090b;
                color: #e4e4e7;
                min-height: 100vh;
            }

            .eg-gold-text {
                background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 50%, #d4af37 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .store-hero-dark {
                background: radial-gradient(circle at top, #18181b 0%, #09090b 100%);
                border-bottom: 1px solid rgba(212, 175, 55, 0.15);
            }

            .product-card-dark {
                background: #18181b;
                border: 1px solid rgba(255, 255, 255, 0.05);
                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .product-card-dark:hover {
                transform: translateY(-4px);
                border-color: rgba(212, 175, 55, 0.3);
                box-shadow: 0 10px 25px rgba(212, 175, 55, 0.05);
            }

            .gold-button {
                background: linear-gradient(135deg, #b8860b 0%, #ffd700 100%);
                color: #09090b;
                transition: all 0.2s;
            }
            .gold-button:hover {
                background: linear-gradient(135deg, #ffd700 0%, #f5de7a 100%);
                transform: scale(1.02);
            }

            .gold-border {
                border-color: rgba(212, 175, 55, 0.2);
            }

            @media (max-width: 640px) {
                .product-grid {
                    grid-template-cols: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Currency Formatter
    const formatPrice = (val) => {
        const num = parseInt(val.replace(/\D/g, '')) || 0;
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    };

    // Default Images
    const defaultProductImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
    const defaultLogo = '👑';

    // WA Link generator for general checkout
    const waUrlGeneral = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo ${store.name || 'Toko'},\nsaya tertarik untuk bertanya mengenai katalog eksklusif Anda.`)}`;

    let productsHtml = '';
    products.forEach((prod, index) => {
        const prodPriceFormatted = formatPrice(prod.price);
        const waMsgProduct = `Halo ${store.name || 'Toko'},\n\nSaya ingin memesan produk ini:\n- *Nama Produk*: ${prod.name}\n- *Harga*: ${prodPriceFormatted}\n\nMohon informasi ketersediaan stock dan kelanjutan proses pemesanannya. Terima kasih!`;
        const waUrlProduct = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(waMsgProduct)}`;

        productsHtml += `
            <div class="product-card-dark rounded-3xl overflow-hidden flex flex-col justify-between">
                <div>
                    <div class="relative w-full pt-[75%] bg-zinc-900 overflow-hidden">
                        <img 
                            src="${prod.image_url || defaultProductImage}" 
                            class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                            alt="${prod.name}"
                            onerror="this.src='${defaultProductImage}'"
                        />
                    </div>
                    <div class="p-6">
                        <h4 class="font-bold text-lg text-zinc-100 tracking-tight mb-1" style="font-family: 'Plus Jakarta Sans', sans-serif;">${prod.name}</h4>
                        <div class="text-[#d4af37] font-extrabold text-lg mb-2">${prodPriceFormatted}</div>
                        ${prod.description ? `<p class="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-3">${prod.description}</p>` : ''}
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <a 
                        href="${waUrlProduct}" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold gold-button text-center shadow-lg shadow-yellow-500/5 active:scale-95"
                    >
                        <span>🛒 Pesan via WhatsApp</span>
                    </a>
                </div>
            </div>
        `;
    });

    appEl.innerHTML = `
        <div class="flex flex-col min-h-screen">
            <!-- Header/Navigation Bar -->
            <nav class="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex justify-between items-center">
                <div class="flex items-center gap-2.5">
                    <div class="h-9 w-9 rounded-xl bg-zinc-800 flex items-center justify-center text-white text-lg shadow-md border border-zinc-700">
                        ${store.logo_url ? `<img src="${store.logo_url}" class="h-full w-full object-cover rounded-xl" onerror="this.outerHTML='${defaultLogo}'" />` : defaultLogo}
                    </div>
                    <span class="font-bold tracking-tight text-[#d4af37] text-sm md:text-base" style="font-family: 'Cinzel', serif;">${store.name || 'Nama Toko'}</span>
                </div>
                
                <a 
                    href="${waUrlGeneral}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="py-2 px-4 rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/5 hover:bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold transition-all"
                >
                    Hubungi
                </a>
            </nav>

            <!-- Hero Section -->
            <section class="store-hero-dark px-6 py-16 md:py-24 text-center relative overflow-hidden" ${store.banner_url ? `style="background: linear-gradient(rgba(9,9,11,0.70), rgba(9,9,11,0.60)), url('${store.banner_url}') center center / cover no-repeat; border-bottom: 1px solid rgba(212,175,55,0.15);"` : ''}>
                <div class="max-w-2xl mx-auto relative z-10">
                    <div class="flex justify-center items-center gap-2 mb-4">
                        <div class="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#d4af37]"></div>
                        <span class="text-[#d4af37] text-[10px] tracking-widest uppercase font-bold">Exclusive Catalog</span>
                        <div class="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#d4af37]"></div>
                    </div>
                    
                    <h1 class="text-3xl md:text-5xl font-extrabold text-zinc-100 leading-tight tracking-tight mb-4" style="font-family: 'Cinzel', serif;">
                        ${store.name || 'Nama Toko'}
                    </h1>
                    <p class="text-xs md:text-sm text-[#d4af37] font-semibold tracking-widest uppercase mb-6">${store.tagline || 'Tagline Toko Online Anda'}</p>
                    
                    ${store.description ? `<p class="text-xs md:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed mb-8">${store.description}</p>` : ''}

                    <div class="flex gap-3 justify-center">
                        <a 
                            href="#products" 
                            class="py-3 px-6 rounded-xl gold-button text-xs font-bold shadow-lg shadow-yellow-500/10 transition-all text-center"
                        >
                            🛍️ Jelajahi Produk
                        </a>
                    </div>
                </div>
            </section>

            <!-- Products List Section -->
            <section id="products" class="px-6 py-12 max-w-4xl mx-auto w-full">
                <div class="text-center mb-10">
                    <h3 class="text-2xl font-bold text-zinc-100 tracking-tight" style="font-family: 'Cinzel', serif;">Product Showcase</h3>
                    <p class="text-xs text-zinc-500 mt-1">Koleksi pilihan terbaik dari kami untuk kenyamanan Anda</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    ${productsHtml}
                </div>
            </section>

            <!-- Welcome Slogan / Quote -->
            ${quote ? `
                <section class="bg-zinc-950 px-6 py-14 text-center relative border-y border-zinc-900">
                    <div class="max-w-xl mx-auto relative z-10">
                        <span class="text-2xl text-[#d4af37] opacity-60">✦</span>
                        <p class="text-sm md:text-base font-medium italic leading-relaxed text-zinc-300 my-4">"${quote}"</p>
                        <div class="h-[1px] w-12 bg-[#d4af37]/30 mx-auto mt-4"></div>
                    </div>
                </section>
            ` : ''}

            <!-- Contact & Socials Footer -->
            <footer class="bg-zinc-950 text-zinc-500 px-6 py-12 border-t border-zinc-900 mt-auto">
                <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h4 class="font-bold text-zinc-200 text-xs uppercase tracking-wider mb-4" style="font-family: 'Cinzel', serif;">Exclusive Store</h4>
                        <p class="text-xs leading-relaxed text-zinc-400 mb-4">${store.name} - ${store.tagline}</p>
                        ${contact.address ? `<p class="text-xs text-zinc-400 flex items-start gap-2"><span>📍</span> <span>${contact.address}</span></p>` : ''}
                    </div>
                    <div>
                        <h4 class="font-bold text-zinc-200 text-xs uppercase tracking-wider mb-4" style="font-family: 'Cinzel', serif;">Contact Channels</h4>
                        <div class="flex flex-wrap gap-2">
                            <a 
                                href="${waUrlGeneral}" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                class="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-100 text-xs font-bold transition-all flex items-center gap-1.5"
                            >
                                <span>💬 WhatsApp</span>
                            </a>
                            
                            ${contact.instagram ? `
                                <a 
                                    href="https://instagram.com/${contact.instagram.replace(/^@/, '')}" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    class="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-100 text-xs font-bold transition-all flex items-center gap-1.5"
                                >
                                    <span>📸 Instagram</span>
                                </a>
                            ` : ''}

                            ${contact.shopee_url ? `
                                <a 
                                    href="${contact.shopee_url}" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    class="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-100 text-xs font-bold transition-all flex items-center gap-1.5"
                                >
                                    <span>🛒 Shopee</span>
                                </a>
                            ` : ''}

                            ${contact.tokopedia_url ? `
                                <a 
                                    href="${contact.tokopedia_url}" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    class="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-100 text-xs font-bold transition-all flex items-center gap-1.5"
                                >
                                    <span>🛍️ Tokopedia</span>
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <div class="max-w-4xl mx-auto pt-8 border-t border-zinc-900 text-center text-[10px] text-zinc-700">
                    &copy; 2026 ${store.name}. Luxury Store Presentation.
                </div>
            </footer>
        </div>
    `;
}
