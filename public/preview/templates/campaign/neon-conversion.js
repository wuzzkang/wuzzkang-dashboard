/**
 * Neon Conversion Template for Campaigns
 * Dark Mode theme with neon glow pink/violet accents
 */
export async function render(pageConfig, guestName = 'Tamu') {
    const appEl = document.getElementById('app');
    const content = pageConfig.content || {};
    const hero = content.hero || {};
    const problems = content.problems || {};
    const solutions = content.solutions || {};
    const socialProof = content.social_proof || {};
    const closing = content.closing || {};
    const contact = content.contact || {};

    // Inject Neon Custom Styles
    if (!document.getElementById('neon-conversion-styles')) {
        const style = document.createElement('style');
        style.id = 'neon-conversion-styles';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
            
            #app {
                font-family: 'Space Grotesk', sans-serif;
                background-color: #030712;
                color: #f3f4f6;
                min-height: 100vh;
            }

            .neon-text-pink {
                text-shadow: 0 0 10px rgba(236, 72, 153, 0.5), 0 0 20px rgba(236, 72, 153, 0.3);
            }

            .neon-text-purple {
                text-shadow: 0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3);
            }

            .neon-border-pink {
                box-shadow: 0 0 15px rgba(236, 72, 153, 0.15), inset 0 0 15px rgba(236, 72, 153, 0.05);
                border: 1px solid rgba(236, 72, 153, 0.3);
            }

            .neon-border-purple {
                box-shadow: 0 0 15px rgba(168, 85, 247, 0.15), inset 0 0 15px rgba(168, 85, 247, 0.05);
                border: 1px solid rgba(168, 85, 247, 0.3);
            }

            .neon-btn-pink {
                background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
                box-shadow: 0 0 20px rgba(236, 72, 153, 0.4);
                transition: all 0.3s ease;
            }

            .neon-btn-pink:hover {
                box-shadow: 0 0 35px rgba(236, 72, 153, 0.7);
                transform: scale(1.03);
            }

            @keyframes pulse-glow {
                0%, 100% { box-shadow: 0 0 15px rgba(236, 72, 153, 0.4); }
                50% { box-shadow: 0 0 30px rgba(236, 72, 153, 0.8); }
            }

            .pulse-neon {
                animation: pulse-glow 2s infinite;
            }
        `;
        document.head.appendChild(style);
    }

    // WA Link generator for general checkout
    const waUrlGeneral = `https://api.whatsapp.com/send?phone=${contact.whatsapp ? contact.whatsapp.replace(/\D/g, '') : ''}&text=${encodeURIComponent(`Halo,\nsaya tertarik dengan penawaran Anda: "${hero.headline || ''}".`)}`;

    // Compile problems HTML list
    let problemsListHtml = '';
    if (Array.isArray(problems.list)) {
        problems.list.forEach(p => {
            problemsListHtml += `
                <div class="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 flex items-start gap-4">
                    <span class="text-2xl text-red-500 flex-shrink-0">⚠️</span>
                    <p class="text-sm md:text-base text-gray-300 leading-relaxed font-medium">${p}</p>
                </div>
            `;
        });
    }

    // Compile benefits HTML list
    let benefitsListHtml = '';
    if (Array.isArray(solutions.benefits)) {
        solutions.benefits.forEach((b, index) => {
            const borderClass = index % 2 === 0 ? 'neon-border-pink' : 'neon-border-purple';
            benefitsListHtml += `
                <div class="bg-gray-900/40 rounded-2xl p-6 ${borderClass}">
                    <div class="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl text-purple-400 font-bold mb-4">
                        0${index + 1}
                    </div>
                    <h4 class="text-base md:text-lg font-bold text-white tracking-tight mb-2">${b.title}</h4>
                    <p class="text-xs md:text-sm text-gray-400 leading-relaxed">${b.desc}</p>
                </div>
            `;
        });
    }

    // Compile testimonials HTML
    let testimonialsHtml = '';
    if (Array.isArray(socialProof.testimonials)) {
        socialProof.testimonials.forEach(t => {
            testimonialsHtml += `
                <div class="bg-gray-900/80 border border-gray-850 rounded-2xl p-6 relative flex flex-col justify-between">
                    <div>
                        <span class="text-4xl text-pink-500/20 absolute top-4 left-4 font-serif">“</span>
                        <p class="text-xs md:text-sm text-gray-300 italic leading-relaxed relative z-10 mb-4 pt-2">
                            "${t.content}"
                        </p>
                    </div>
                    <div class="border-t border-gray-800 pt-4 flex items-center gap-3">
                        <div class="h-8 w-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            ${t.name ? t.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <h5 class="text-xs font-bold text-white">${t.name}</h5>
                            ${t.role ? `<p class="text-[10px] text-gray-500">${t.role}</p>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
    }

    appEl.innerHTML = `
        <div class="flex flex-col min-h-screen">
            <!-- Navigation -->
            <nav class="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-900 px-6 py-4 flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <div class="h-8 w-8 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-white font-black text-sm">
                        ⚡
                    </div>
                    <span class="font-extrabold tracking-tight text-white text-xs uppercase">PROMO CAMPAIGN</span>
                </div>
                <a 
                    href="${waUrlGeneral}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="py-1.5 px-3.5 rounded-lg border border-pink-500/30 hover:border-pink-500 text-pink-500 text-[10px] font-bold tracking-wider uppercase transition-all"
                >
                    Hubungi Kami
                </a>
            </nav>

            <!-- Hero Section -->
            <header class="relative px-6 py-16 md:py-24 text-center overflow-hidden border-b border-gray-900" style="${hero.image_url ? `background-image: linear-gradient(rgba(3,7,18,0.65), rgba(3,7,18,0.95)), url('${hero.image_url}'); background-size: cover; background-position: center;` : ''}">
                <!-- Glowing Backdrops -->
                <div class="absolute top-12 left-1/4 w-72 h-72 rounded-full bg-pink-500/10 blur-3xl -z-10 pointer-events-none"></div>
                <div class="absolute bottom-12 right-1/4 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl -z-10 pointer-events-none"></div>

                <div class="max-w-3xl mx-auto relative z-10">
                    <span class="inline-flex px-3.5 py-1 rounded-full text-[10px] font-bold bg-pink-500/10 border border-pink-500/20 text-pink-400 uppercase tracking-widest mb-6">
                        🔥 Penawaran Eksklusif Hari Ini
                    </span>
                    <h1 class="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-6">
                        ${hero.headline || 'Headline'}
                    </h1>
                    <p class="text-sm md:text-lg text-gray-400 font-medium max-w-xl mx-auto leading-relaxed mb-8">
                        ${hero.subheadline || 'Sub-headline'}
                    </p>
                    <div class="flex justify-center">
                        <a 
                            href="${waUrlGeneral}" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="py-3.5 px-8 rounded-xl font-bold text-white text-xs md:text-sm tracking-wide neon-btn-pink pulse-neon text-center active:scale-95"
                        >
                            ${hero.cta_text || 'CTA Text'}
                        </a>
                    </div>
                </div>
            </header>

            <!-- Problems Section -->
            ${problemsListHtml ? `
                <section class="px-6 py-16 bg-gray-950/60 max-w-3xl mx-auto w-full border-b border-gray-900">
                    <div class="text-center mb-10">
                        <h2 class="text-xl md:text-3xl font-black text-white tracking-tight">
                            ${problems.title || 'Masalah Utama Anda'}
                        </h2>
                        <div class="h-1 w-12 bg-pink-500 mx-auto rounded-full mt-3"></div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${problemsListHtml}
                    </div>
                </section>
            ` : ''}

            <!-- Solutions & Benefits Section -->
            <section class="px-6 py-16 max-w-4xl mx-auto w-full border-b border-gray-900">
                <div class="text-center mb-12">
                    <span class="text-pink-400 text-xs font-bold tracking-wider uppercase">${solutions.title || 'Solusi Kami'}</span>
                    <h2 class="text-2xl md:text-4xl font-black text-white tracking-tight mt-2">
                        Solusi Praktis & Manfaat Yang Anda Dapatkan
                    </h2>
                    ${solutions.intro ? `<p class="text-xs md:text-sm text-gray-400 max-w-lg mx-auto mt-4 leading-relaxed">${solutions.intro}</p>` : ''}
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${benefitsListHtml}
                </div>
            </section>

            <!-- Social Proof Section -->
            ${testimonialsHtml ? `
                <section class="px-6 py-16 bg-gray-950/60 max-w-3xl mx-auto w-full border-b border-gray-900">
                    <div class="text-center mb-12">
                        <h2 class="text-xl md:text-3xl font-black text-white tracking-tight">
                            Apa Kata Mereka Yang Sudah Membuktikan?
                        </h2>
                        <p class="text-xs text-gray-500 mt-2">Kisah sukses nyata dari pengguna kami</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        ${testimonialsHtml}
                    </div>

                    ${socialProof.guarantee ? `
                        <div class="bg-gradient-to-r from-purple-950/20 to-pink-950/20 border border-purple-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                            <div class="text-4xl flex-shrink-0">🛡️</div>
                            <div>
                                <h4 class="font-bold text-white text-base md:text-lg mb-1">Jaminan Garansi 100%</h4>
                                <p class="text-xs text-gray-400 leading-relaxed">${socialProof.guarantee}</p>
                            </div>
                        </div>
                    ` : ''}
                </section>
            ` : ''}

            <!-- Closing CTA Section -->
            <section class="px-6 py-16 text-center max-w-2xl mx-auto w-full">
                <div class="mb-8">
                    <h3 class="text-2xl md:text-3xl font-black text-white tracking-tight mb-4">
                        Tunggu Apa Lagi? Keputusan Ada Di Tangan Anda!
                    </h3>
                    <p class="text-xs md:text-sm text-pink-400 font-bold bg-pink-500/10 border border-pink-500/20 py-3 px-6 rounded-2xl max-w-md mx-auto leading-relaxed">
                        ${closing.urgency || 'Urgensi Penawaran'}
                    </p>
                </div>
                <div class="flex justify-center">
                    <a 
                        href="${waUrlGeneral}" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="py-3.5 px-8 rounded-xl font-bold text-white text-xs md:text-sm tracking-wide neon-btn-pink pulse-neon text-center active:scale-95"
                    >
                        ${closing.cta_text || 'CTA Text'}
                    </a>
                </div>
            </section>

            <!-- Footer -->
            <footer class="bg-gray-950 border-t border-gray-900 py-10 px-6 mt-auto text-center text-xs text-gray-600">
                <p class="mb-4">© ${new Date().getFullYear()} Promo Campaign. Hak Cipta Dilindungi.</p>
                <div class="flex justify-center gap-4 text-gray-500">
                    <a href="${waUrlGeneral}" target="_blank" rel="noopener noreferrer" class="hover:text-pink-400 transition-colors">WhatsApp</a>
                </div>
            </footer>
        </div>
    `;
}
