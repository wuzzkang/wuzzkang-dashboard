/**
 * Modern Clean Toko-Online Template
 * Minimalist design, clean light background, products grid, WA auto-checkout links
 */
export async function render(pageConfig, guestName = 'Tamu Undangan') {
    const appEl = document.getElementById('app');
    const content = pageConfig.content || {};
    const store = content.store || {};
    const products = content.products || [];
    const contact = content.contact || {};
    const quote = content.quote || '';

    // Style injector
    if (!document.getElementById('modern-clean-styles')) {
        const style = document.createElement('style');
        style.id = 'modern-clean-styles';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
            
            #app {
                font-family: 'Plus Jakarta Sans', sans-serif;
                background-color: #f8fafc;
                color: #0f172a;
                min-height: 100vh;
            }

            .store-hero {
                background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            }

            .product-card {
                background: #ffffff;
                border: 1px solid #f1f5f9;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .product-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            }

            .cta-button {
                background-color: #25d366;
                color: white;
                transition: all 0.2s;
            }
            .cta-button:hover {
                background-color: #128c7e;
                transform: scale(1.02);
            }

            /* Responsive tweaks */
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
    const defaultLogo = '🛍️';

    // WA Link generator for general checkout
    const waUrlGeneral = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo ${store.name || 'Toko'},\nsaya tertarik untuk bertanya mengenai produk Anda.`)}`;

    let productsHtml = '';
    products.forEach((prod, index) => {
        const prodPriceFormatted = formatPrice(prod.price);
        const waMsgProduct = `Halo ${store.name || 'Toko'},\n\nSaya ingin memesan produk ini:\n- *Nama Produk*: ${prod.name}\n- *Harga*: ${prodPriceFormatted}\n\nMohon informasi ketersediaan stock dan kelanjutan proses pemesanannya. Terima kasih!`;
        const waUrlProduct = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(waMsgProduct)}`;

        productsHtml += `
            <div class="product-card rounded-3xl overflow-hidden flex flex-col justify-between">
                <div>
                    <div class="relative w-full pt-[75%] bg-slate-100 overflow-hidden">
                        <img 
                            src="${prod.image_url || defaultProductImage}" 
                            class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                            alt="${prod.name}"
                            onerror="this.src='${defaultProductImage}'"
                        />
                    </div>
                    <div class="p-6">
                        <h4 class="font-bold text-lg text-slate-800 tracking-tight mb-1">${prod.name}</h4>
                        <div class="text-indigo-600 font-extrabold text-lg mb-2">${prodPriceFormatted}</div>
                        ${prod.description ? `<p class="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">${prod.description}</p>` : ''}
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <a 
                        href="${waUrlProduct}" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold cta-button text-center shadow-md shadow-emerald-500/10 active:scale-95"
                    >
                        <span>🛒 Beli Sekarang via WA</span>
                    </a>
                </div>
            </div>
        `;
    });

    appEl.innerHTML = `
        <div class="flex flex-col min-h-screen">
            <!-- Header/Navigation Bar -->
            <nav class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                <div class="flex items-center gap-2.5">
                    <div class="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg shadow-md shadow-blue-500/20">
                        ${store.logo_url ? `<img src="${store.logo_url}" class="h-full w-full object-cover rounded-xl" onerror="this.outerHTML='${defaultLogo}'" />` : defaultLogo}
                    </div>
                    <span class="font-bold tracking-tight text-slate-800 text-sm md:text-base">${store.name || 'Nama Toko'}</span>
                </div>
                
                <a 
                    href="${waUrlGeneral}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="py-2 px-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 text-xs font-bold transition-all"
                >
                    Hubungi Kami
                </a>
            </nav>

            <!-- Hero Section -->
            <section class="store-hero px-6 py-12 md:py-20 text-center relative overflow-hidden" ${store.banner_url ? `style="background: linear-gradient(rgba(15,23,42,0.55), rgba(15,23,42,0.45)), url('${store.banner_url}') center center / cover no-repeat;"` : ''}>
                <div class="max-w-2xl mx-auto relative z-10">
                    <span class="inline-flex px-3 py-1 rounded-full text-[10px] font-bold ${store.banner_url ? 'bg-white/20 text-white' : 'bg-blue-600/10 text-blue-600'} uppercase tracking-widest mb-4">Selamat Datang</span>
                    <h1 class="text-3xl md:text-5xl font-black ${store.banner_url ? 'text-white drop-shadow-lg' : 'text-slate-900'} leading-tight tracking-tight mb-4">${store.name || 'Nama Toko'}</h1>
                    <p class="text-sm md:text-base ${store.banner_url ? 'text-white/80' : 'text-blue-800/80'} font-medium tracking-wide mb-6">${store.tagline || 'Tagline Toko Online Anda'}</p>
                    
                    ${store.description ? `<p class="text-xs md:text-sm ${store.banner_url ? 'text-white/70' : 'text-slate-600'} max-w-lg mx-auto leading-relaxed mb-8">${store.description}</p>` : ''}

                    <div class="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <a 
                            href="#products" 
                            class="w-full sm:w-auto py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all text-center"
                        >
                            🛍️ Lihat Produk Kami
                        </a>
                    </div>
                </div>
            </section>

            <!-- Products List Section -->
            <section id="products" class="px-6 py-12 max-w-4xl mx-auto w-full">
                <div class="text-center mb-10">
                    <h3 class="text-2xl font-extrabold text-slate-900 tracking-tight">Katalog Produk</h3>
                    <p class="text-xs text-slate-500 mt-1">Pilih produk terbaik kami dan pesan langsung via WhatsApp</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    ${productsHtml}
                </div>
            </section>

            <!-- Welcome Slogan / Quote -->
            ${quote ? `
                <section class="bg-blue-600 text-white px-6 py-12 text-center relative overflow-hidden">
                    <div class="max-w-xl mx-auto relative z-10">
                        <span class="text-3xl opacity-40">✨</span>
                        <p class="text-sm md:text-base font-medium italic leading-relaxed my-4">"${quote}"</p>
                        <div class="h-1 w-12 bg-white/20 mx-auto rounded-full mt-4"></div>
                    </div>
                </section>
            ` : ''}

            <!-- Contact & Socials Footer -->
            <footer class="bg-slate-900 text-slate-400 px-6 py-12 border-t border-slate-800 mt-auto">
                <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h4 class="font-bold text-white text-sm uppercase tracking-wider mb-4">Tentang Toko</h4>
                        <p class="text-xs leading-relaxed text-slate-400 mb-4">${store.name} - ${store.tagline}</p>
                        ${contact.address ? `<p class="text-xs text-slate-400 flex items-start gap-2"><span>📍</span> <span>${contact.address}</span></p>` : ''}
                    </div>
                    <div>
                        <h4 class="font-bold text-white text-sm uppercase tracking-wider mb-4">Hubungi & Ikuti Kami</h4>
                        <div class="flex flex-wrap gap-2">
                            <a 
                                href="${waUrlGeneral}" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                            >
                                <span>💬 WhatsApp</span>
                            </a>
                            
                            ${contact.instagram ? `
                                <a 
                                    href="https://instagram.com/${contact.instagram.replace(/^@/, '')}" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                                >
                                    <span>📸 Instagram</span>
                                </a>
                            ` : ''}

                            ${contact.shopee_url ? `
                                <a 
                                    href="${contact.shopee_url}" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                                >
                                    <span>🛒 Shopee</span>
                                </a>
                            ` : ''}

                            ${contact.tokopedia_url ? `
                                <a 
                                    href="${contact.tokopedia_url}" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                                >
                                    <span>🛍️ Tokopedia</span>
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <div class="max-w-4xl mx-auto pt-8 border-t border-slate-800 text-center text-[10px] text-slate-600">
                    &copy; 2026 ${store.name}. Powered by Siluet Toko Online.
                </div>
            </footer>
        </div>
    `;
}
