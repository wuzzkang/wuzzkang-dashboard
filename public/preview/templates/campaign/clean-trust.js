/**
 * Clean Trust Template for Campaigns
 * Light Mode theme with professional layout and teal/indigo accents
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

    // Inject Clean Trust Custom Styles
    if (!document.getElementById('clean-trust-styles')) {
        const style = document.createElement('style');
        style.id = 'clean-trust-styles';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
            
            #app {
                font-family: 'Plus Jakarta Sans', sans-serif;
                background-color: #f8fafc;
                color: #1e293b;
                min-height: 100vh;
            }

            .trust-hero {
                background: radial-gradient(50% 50% at 50% 50%, #f0fdfa 0%, #f8fafc 100%);
            }

            .trust-card {
                background: #ffffff;
                border: 1px solid #e2e8f0;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .trust-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08);
            }

            .trust-btn-teal {
                background-color: #0d9488;
                color: #ffffff;
                transition: all 0.2s ease-in-out;
            }

            .trust-btn-teal:hover {
                background-color: #0f766e;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
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
                <div class="bg-white border-l-4 border-amber-500 rounded-r-2xl p-5 shadow-sm">
                    <p class="text-sm md:text-base text-slate-700 leading-relaxed font-semibold">${p}</p>
                </div>
            `;
        });
    }

    // Compile benefits HTML list
    let benefitsListHtml = '';
    if (Array.isArray(solutions.benefits)) {
        solutions.benefits.forEach((b, index) => {
            benefitsListHtml += `
                <div class="trust-card rounded-3xl p-6">
                    <div class="h-10 w-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 font-extrabold text-base mb-5">
                        ${index + 1}
                    </div>
                    <h4 class="text-base md:text-lg font-bold text-slate-800 tracking-tight mb-2.5">${b.title}</h4>
                    <p class="text-xs md:text-sm text-slate-500 leading-relaxed">${b.desc}</p>
                </div>
            `;
        });
    }

    // Compile testimonials HTML
    let testimonialsHtml = '';
    if (Array.isArray(socialProof.testimonials)) {
        socialProof.testimonials.forEach(t => {
            testimonialsHtml += `
                <div class="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="flex text-amber-400 gap-1 mb-4 text-sm">★★★★★</div>
                        <p class="text-xs md:text-sm text-slate-600 italic leading-relaxed mb-6">
                            "${t.content}"
                        </p>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="h-9 w-9 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold">
                            ${t.name ? t.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <h5 class="text-xs font-bold text-slate-800">${t.name}</h5>
                            ${t.role ? `<p class="text-[10px] text-slate-400">${t.role}</p>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
    }

    appEl.innerHTML = `
        <div class="flex flex-col min-h-screen">
            <!-- Navigation -->
            <nav class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <div class="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-extrabold text-sm">
                        🛡️
                    </div>
                    <span class="font-bold tracking-tight text-slate-800 text-xs uppercase">OFFICIAL CAMPAIGN</span>
                </div>
                <a 
                    href="${waUrlGeneral}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                >
                    Hubungi
                </a>
            </nav>

            <!-- Hero Section -->
            <header class="trust-hero px-6 py-16 md:py-24 text-center border-b border-slate-100" style="${hero.image_url ? `background-image: linear-gradient(rgba(248,250,252,0.7), rgba(248,250,252,0.95)), url('${hero.image_url}'); background-size: cover; background-position: center;` : ''}">
                <div class="max-w-3xl mx-auto">
                    <span class="inline-flex px-3 py-1 rounded-full text-[10px] font-bold bg-teal-50 border border-teal-100 text-teal-600 uppercase tracking-widest mb-6">
                        Informasi & Penawaran Terverifikasi
                    </span>
                    <h1 class="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-6">
                        ${hero.headline || 'Headline'}
                    </h1>
                    <p class="text-sm md:text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed mb-8">
                        ${hero.subheadline || 'Sub-headline'}
                    </p>
                    <div class="flex justify-center">
                        <a 
                            href="${waUrlGeneral}" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="py-3.5 px-8 rounded-2xl font-bold text-white text-xs md:text-sm tracking-wide trust-btn-teal text-center active:scale-95 shadow-lg shadow-teal-600/10"
                        >
                            ${hero.cta_text || 'CTA Text'}
                        </a>
                    </div>
                </div>
            </header>

            <!-- Problems Section -->
            ${problemsListHtml ? `
                <section class="px-6 py-16 bg-slate-50 max-w-3xl mx-auto w-full border-b border-slate-100">
                    <div class="text-center mb-10">
                        <span class="text-slate-400 text-xs font-bold tracking-wider uppercase">Analisis Masalah</span>
                        <h2 class="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                            ${problems.title || 'Hambatan Utama Anda'}
                        </h2>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${problemsListHtml}
                    </div>
                </section>
            ` : ''}

            <!-- Solutions & Benefits Section -->
            <section class="px-6 py-16 max-w-4xl mx-auto w-full border-b border-slate-100">
                <div class="text-center mb-12">
                    <span class="text-teal-600 text-xs font-bold tracking-wider uppercase">${solutions.title || 'Solusi Kami'}</span>
                    <h2 class="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
                        Bagaimana Kami Membantu Mencapai Goal Anda
                    </h2>
                    ${solutions.intro ? `<p class="text-xs md:text-sm text-slate-500 max-w-lg mx-auto mt-4 leading-relaxed">${solutions.intro}</p>` : ''}
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${benefitsListHtml}
                </div>
            </section>

            <!-- Social Proof Section -->
            ${testimonialsHtml ? `
                <section class="px-6 py-16 bg-slate-50 max-w-3xl mx-auto w-full border-b border-slate-100">
                    <div class="text-center mb-12">
                        <h2 class="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Telah Terbukti Membantu Banyak Orang
                        </h2>
                        <p class="text-xs text-slate-500 mt-2">Ulasan jujur dari pengguna yang puas</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        ${testimonialsHtml}
                    </div>

                    ${socialProof.guarantee ? `
                        <div class="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                            <div class="text-4xl flex-shrink-0">🛡️</div>
                            <div>
                                <h4 class="font-bold text-slate-800 text-base md:text-lg mb-1">Garansi Kepuasan Pelanggan</h4>
                                <p class="text-xs text-slate-500 leading-relaxed">${socialProof.guarantee}</p>
                            </div>
                        </div>
                    ` : ''}
                </section>
            ` : ''}

            <!-- Closing CTA Section -->
            <section class="px-6 py-16 text-center max-w-2xl mx-auto w-full">
                <div class="mb-8">
                    <h3 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Ambil Keputusan Terbaik Hari Ini
                    </h3>
                    <p class="text-xs md:text-sm text-amber-700 font-bold bg-amber-500/10 border border-amber-500/20 py-3.5 px-6 rounded-2xl max-w-md mx-auto leading-relaxed">
                        ${closing.urgency || 'Urgensi Penawaran'}
                    </p>
                </div>
                <div class="flex justify-center">
                    <a 
                        href="${waUrlGeneral}" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="py-3.5 px-8 rounded-2xl font-bold text-white text-xs md:text-sm tracking-wide trust-btn-teal text-center active:scale-95 shadow-lg shadow-teal-600/10"
                    >
                        ${closing.cta_text || 'CTA Text'}
                    </a>
                </div>
            </section>

            <!-- Footer -->
            <footer class="bg-slate-900 text-slate-400 py-12 px-6 mt-auto text-center text-xs">
                <p class="mb-4">© ${new Date().getFullYear()} Official Campaign. Hak Cipta Dilindungi.</p>
                <div class="flex justify-center gap-4 text-slate-500">
                    <a href="${waUrlGeneral}" target="_blank" rel="noopener noreferrer" class="hover:text-teal-400 transition-colors">WhatsApp</a>
                </div>
            </footer>
        </div>
    `;
}
