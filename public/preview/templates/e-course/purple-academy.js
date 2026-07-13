/**
 * Purple Academy Template for E-Courses - Version 1
 * Dark theme with purple gradients, countdown timer, curriculum accordion, and cartoon placeholders.
 */
export async function render(pageConfig, guestName = 'Tamu') {
    const appEl = document.getElementById('app');
    const content = pageConfig.content || {};
    const hero = content.hero || {};
    const problems = content.problems || {};
    const solutions = content.solutions || {};
    const audience = content.audience || {};
    const mentor = content.mentor || {};
    const curriculum = content.curriculum || {};
    const benefits = content.benefits || {};
    const bonuses = content.bonuses || {};
    const pricing = content.pricing || {};
    const testimonials = content.testimonials || {};
    const contact = content.contact || {};

    // Inject Stylesheet
    if (!document.getElementById('purple-academy-styles')) {
        const style = document.createElement('style');
        style.id = 'purple-academy-styles';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
            
            #app {
                font-family: 'Outfit', sans-serif;
                background-color: #0c0817;
                color: #f3f4f6;
                min-height: 100vh;
            }

            .purple-gradient-text {
                background: linear-gradient(135deg, #a855f7 0%, #c084fc 50%, #6366f1 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .purple-bg-gradient {
                background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            }

            .purple-glow-border {
                box-shadow: 0 0 15px rgba(168, 85, 247, 0.15);
                border: 1px solid rgba(168, 85, 247, 0.25);
            }

            .purple-btn {
                background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
                box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4);
                transition: all 0.3s ease;
            }

            .purple-btn:hover {
                box-shadow: 0 4px 30px rgba(168, 85, 247, 0.6);
                transform: translateY(-2px);
            }

            .purple-btn-outline {
                border: 2px solid rgba(168, 85, 247, 0.5);
                transition: all 0.3s ease;
            }

            .purple-btn-outline:hover {
                background: rgba(168, 85, 247, 0.1);
                border-color: #a855f7;
            }

            /* Custom Accordion */
            .curriculum-accordion-header {
                cursor: pointer;
                transition: background-color 0.2s ease;
            }
            
            .curriculum-accordion-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s cubic-bezier(0, 1, 0, 1);
            }
            
            .curriculum-accordion-item.active .curriculum-accordion-content {
                max-height: 1000px;
                transition: max-height 0.3s cubic-bezier(1, 0, 1, 0);
            }

            .curriculum-accordion-item.active .accordion-icon {
                transform: rotate(180deg);
            }
        `;
        document.head.appendChild(style);
    }

    // Default Cartoon SVG Illustrations
    const defaultHeroSvg = `
        <svg viewBox="0 0 500 400" class="w-full h-auto max-h-[350px] mx-auto drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#8b5cf6" />
                    <stop offset="100%" stop-color="#4f46e5" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            <!-- Background circle glow -->
            <circle cx="250" cy="200" r="160" fill="url(#purpleGrad)" opacity="0.15" filter="url(#glow)" />
            <!-- Laptop / Screen mockup -->
            <rect x="70" y="100" width="360" height="220" rx="16" fill="#1e1b4b" stroke="#8b5cf6" stroke-width="4" />
            <rect x="80" y="110" width="340" height="180" rx="8" fill="#090514" />
            <!-- Laptop base -->
            <path d="M40 320 L460 320 L430 340 L70 340 Z" fill="#2e2a72" stroke="#8b5cf6" stroke-width="2" />
            <rect x="220" y="325" width="60" height="6" rx="3" fill="#4f46e5" />
            <!-- Floating Cartoon E-learning objects -->
            <!-- Dashboard graph lines -->
            <path d="M100 240 L160 180 L220 210 L300 150 L380 220" fill="none" stroke="#a855f7" stroke-width="4" stroke-linecap="round" filter="url(#glow)" />
            <circle cx="160" cy="180" r="6" fill="#c084fc" />
            <circle cx="300" cy="150" r="6" fill="#c084fc" />
            <!-- Floating Graduation Cap -->
            <g transform="translate(320, 50) scale(0.7)" filter="url(#glow)">
                <path d="M50 15 L90 35 L50 55 L10 35 Z" fill="#c084fc" />
                <path d="M25 43 L25 60 C25 65, 75 65, 75 60 L75 43" fill="#8b5cf6" />
                <path d="M90 35 L90 55" fill="none" stroke="#db2777" stroke-width="2" />
                <circle cx="90" cy="55" r="4" fill="#db2777" />
            </g>
            <!-- Floating Book -->
            <g transform="translate(60, 60) scale(0.7) rotate(-15)">
                <rect x="10" y="15" width="50" height="70" rx="4" fill="#3b82f6" />
                <rect x="15" y="15" width="40" height="70" fill="#eff6ff" />
                <path d="M10 15 Q35 25 60 15" fill="none" stroke="#2563eb" stroke-width="2" />
                <path d="M10 85 Q35 95 60 85" fill="none" stroke="#2563eb" stroke-width="2" />
            </g>
            <!-- Floating Rocket -->
            <g transform="translate(220, 40) scale(0.8)">
                <path d="M20 0 C40 20, 40 50, 20 80 C0 50, 0 20, 20 0 Z" fill="#e11d48" />
                <path d="M20 0 C30 20, 30 50, 20 80 Z" fill="#f43f5e" />
                <circle cx="20" cy="30" r="6" fill="#fff" />
                <!-- Rocket wings -->
                <path d="M5 50 L-10 70 L5 70 Z" fill="#be123c" />
                <path d="M35 50 L50 70 L35 70 Z" fill="#be123c" />
                <!-- Fire -->
                <path d="M12 80 L20 100 L28 80 Z" fill="#f59e0b" />
            </g>
        </svg>
    `;

    const defaultMentorSvg = `
        <svg viewBox="0 0 100 100" class="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto bg-indigo-950 border-4 border-purple-500 shadow-lg" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <clipPath id="avatarCircle">
                    <circle cx="50" cy="50" r="46" />
                </clipPath>
            </defs>
            <circle cx="50" cy="50" r="46" fill="#1e1b4b" />
            <g clip-path="url(#avatarCircle)">
                <!-- Mentor face/body background -->
                <circle cx="50" cy="45" r="20" fill="#fed7aa" />
                <!-- Hair -->
                <path d="M25 40 C25 20, 75 20, 75 40 C70 30, 30 30, 25 40 Z" fill="#1e293b" />
                <!-- Glasses -->
                <circle cx="42" cy="42" r="6" fill="none" stroke="#000" stroke-width="1.5" />
                <circle cx="58" cy="42" r="6" fill="none" stroke="#000" stroke-width="1.5" />
                <line x1="48" y1="42" x2="52" y2="42" stroke="#000" stroke-width="1.5" />
                <!-- Mouth -->
                <path d="M45 52 Q50 56 55 52" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round" />
                <!-- Body suit -->
                <path d="M20 85 C20 70, 30 65, 50 65 C70 65, 80 70, 80 85 Z" fill="#4f46e5" />
                <path d="M42 65 L50 78 L58 65 Z" fill="#fed7aa" />
                <!-- Tie -->
                <path d="M48 78 L52 78 L54 95 L50 99 L46 95 Z" fill="#db2777" />
            </g>
        </svg>
    `;

    // WhatsApp Redirect Link
    const cleanWaNumber = contact.whatsapp ? contact.whatsapp.replace(/\D/g, '') : '';
    const waUrlGeneral = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(`Halo,\nsaya tertarik bergabung dengan kelas E-Course: "${hero.headline || ''}".`)}`;

    let finalCtaUrl = waUrlGeneral;
    if (contact.cta_url && contact.cta_url.trim()) {
        const urlStr = contact.cta_url.trim();
        finalCtaUrl = (urlStr.startsWith('http://') || urlStr.startsWith('https://')) ? urlStr : `https://${urlStr}`;
    }

    // Build Problems HTML
    let problemsHtml = '';
    if (Array.isArray(problems.list)) {
        problems.list.forEach(p => {
            problemsHtml += `
                <div class="bg-indigo-950/20 border border-purple-950/50 rounded-2xl p-5 flex items-start gap-4 hover:border-purple-500/30 transition-colors">
                    <span class="text-2xl text-red-500 flex-shrink-0">⚠️</span>
                    <p class="text-sm md:text-base text-gray-300 leading-relaxed font-medium">${p}</p>
                </div>
            `;
        });
    }

    // Build Solutions HTML
    let solutionsHtml = '';
    if (Array.isArray(solutions.list)) {
        solutions.list.forEach((s, idx) => {
            solutionsHtml += `
                <div class="flex items-center gap-3">
                    <div class="h-6 w-6 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-xs text-purple-300 font-bold">
                        ${idx + 1}
                    </div>
                    <p class="text-sm md:text-base text-gray-300 font-semibold">${s}</p>
                </div>
            `;
        });
    }

    // Build Target Audience HTML
    let audienceHtml = '';
    if (Array.isArray(audience.list)) {
        audience.list.forEach((a, idx) => {
            audienceHtml += `
                <div class="bg-indigo-950/10 border border-purple-950/40 rounded-2xl p-6 text-center hover:border-purple-500/25 transition-all">
                    <div class="text-3xl mb-3">👤</div>
                    <h4 class="text-sm md:text-base font-bold text-white mb-2">${a}</h4>
                </div>
            `;
        });
    }

    // Build Curriculum Accordion HTML
    let curriculumHtml = '';
    if (Array.isArray(curriculum.modules)) {
        curriculum.modules.forEach((mod, idx) => {
            curriculumHtml += `
                <div class="curriculum-accordion-item bg-indigo-950/10 border border-purple-950/40 rounded-2xl overflow-hidden mb-3">
                    <div class="curriculum-accordion-header px-6 py-4 flex justify-between items-center bg-indigo-950/20">
                        <div class="flex items-center gap-4">
                            <span class="text-xs font-bold text-purple-400">Modul 0${idx + 1}</span>
                            <h4 class="text-sm md:text-base font-bold text-white">${mod.title}</h4>
                        </div>
                        <span class="accordion-icon text-gray-500 transition-transform duration-300">▼</span>
                    </div>
                    <div class="curriculum-accordion-content px-6 bg-indigo-950/5">
                        <p class="py-4 text-xs md:text-sm text-gray-400 leading-relaxed">${mod.desc}</p>
                    </div>
                </div>
            `;
        });
    }

    // Build Benefits HTML
    let benefitsHtml = '';
    if (Array.isArray(benefits.list)) {
        benefits.list.forEach((b, idx) => {
            benefitsHtml += `
                <div class="bg-indigo-950/15 border border-purple-950/40 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
                    <div class="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-lg text-purple-400 font-bold mb-4">
                        0${idx + 1}
                    </div>
                    <h4 class="text-base font-bold text-white mb-2">${b.title}</h4>
                    <p class="text-xs md:text-sm text-gray-450 leading-relaxed">${b.desc}</p>
                </div>
            `;
        });
    }

    // Build Bonuses HTML
    let bonusesHtml = '';
    if (Array.isArray(bonuses.list)) {
        bonuses.list.forEach((bon, idx) => {
            bonusesHtml += `
                <div class="bg-gradient-to-r from-indigo-950/20 to-purple-950/20 border-2 border-dashed border-purple-500/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                    <div class="text-5xl flex-shrink-0">🎁</div>
                    <div>
                        <span class="px-2 py-0.5 rounded text-[8px] bg-pink-500 text-white font-bold tracking-wider uppercase">BONUS #0${idx + 1}</span>
                        <h4 class="font-extrabold text-white text-base md:text-lg mt-1 mb-1">${bon.title}</h4>
                        <p class="text-xs text-gray-400 leading-relaxed">${bon.desc}</p>
                    </div>
                </div>
            `;
        });
    }

    // Build Testimonials HTML
    let testimonialsHtml = '';
    if (Array.isArray(testimonials.list)) {
        testimonials.list.forEach(t => {
            testimonialsHtml += `
                <div class="bg-indigo-950/10 border border-purple-950/40 rounded-2xl p-6 relative flex flex-col justify-between">
                    <div>
                        <span class="text-4xl text-purple-500/20 absolute top-4 left-4 font-serif">“</span>
                        <p class="text-xs md:text-sm text-gray-300 italic leading-relaxed relative z-10 mb-4 pt-2">
                            "${t.content}"
                        </p>
                    </div>
                    <div class="border-t border-purple-950/50 pt-4 flex items-center gap-3">
                        <div class="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
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

    // Build Pricing Features HTML
    let pricingFeaturesHtml = '';
    if (Array.isArray(pricing.features)) {
        pricing.features.forEach(f => {
            pricingFeaturesHtml += `
                <li class="flex items-center gap-3 text-xs md:text-sm text-gray-350">
                    <span class="text-purple-400 text-base">✔️</span>
                    <span>${f}</span>
                </li>
            `;
        });
    }

    // Main layout
    appEl.innerHTML = `
        <div class="flex flex-col min-h-screen">
            <!-- Navigation -->
            <nav class="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-purple-950 px-6 py-4 flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <div class="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-black text-sm">
                        🎓
                    </div>
                    <span class="font-extrabold tracking-tight text-white text-xs uppercase">${content.brand_name || 'E-COURSE ACADEMY'}</span>
                </div>
                <a 
                    href="#pricing"
                    class="py-1.5 px-3.5 rounded-lg border border-purple-500/30 hover:border-purple-500 text-purple-400 text-[10px] font-bold tracking-wider uppercase transition-all"
                >
                    Daftar Sekarang
                </a>
            </nav>

            <!-- Hero Section -->
            <header class="relative px-6 py-16 md:py-24 overflow-hidden border-b border-purple-950" style="${hero.image_url ? `background-image: linear-gradient(rgba(12,8,23,0.7), rgba(12,8,23,0.95)), url('${hero.image_url}'); background-size: cover; background-position: center;` : ''}">
                <div class="absolute top-12 left-1/4 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl -z-10 pointer-events-none"></div>
                <div class="absolute bottom-12 right-1/4 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl -z-10 pointer-events-none"></div>

                <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <span class="inline-flex px-3.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 border border-purple-500/20 text-purple-400 uppercase tracking-widest mb-6">
                            🔥 Penawaran Spesial Terbatas
                        </span>
                        <h1 class="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
                            ${hero.headline || 'Headline'}
                        </h1>
                        <p class="text-sm md:text-lg text-gray-400 font-medium leading-relaxed mb-8">
                            ${hero.subheadline || 'Sub-headline'}
                        </p>
                        
                        <!-- Countdown Timer inside Hero -->
                        ${(content.countdown?.enabled !== false) ? `
                        <div class="bg-indigo-950/30 border border-purple-950 rounded-2xl p-5 mb-8 max-w-sm">
                            <p class="text-xs text-purple-300 font-bold uppercase tracking-wider text-center mb-3">${content.countdown?.title || 'Sisa Waktu Promo Hari Ini:'}</p>
                            <div class="grid grid-cols-4 gap-2 text-center" id="countdown-timer">
                                <div>
                                    <span class="block text-2xl font-black text-white" id="cd-days">00</span>
                                    <span class="text-[9px] text-gray-500 uppercase font-bold">Hari</span>
                                </div>
                                <div>
                                    <span class="block text-2xl font-black text-white" id="cd-hours">00</span>
                                    <span class="text-[9px] text-gray-500 uppercase font-bold">Jam</span>
                                </div>
                                <div>
                                    <span class="block text-2xl font-black text-white" id="cd-mins">00</span>
                                    <span class="text-[9px] text-gray-500 uppercase font-bold">Menit</span>
                                </div>
                                <div>
                                    <span class="block text-2xl font-black text-white" id="cd-secs">00</span>
                                    <span class="text-[9px] text-gray-500 uppercase font-bold">Detik</span>
                                </div>
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="flex flex-col sm:flex-row gap-4">
                            <a 
                                href="#pricing" 
                                class="py-3.5 px-8 rounded-xl font-bold text-white text-xs md:text-sm tracking-wide purple-btn text-center active:scale-95"
                            >
                                ${hero.cta_text || 'Gabung Kelas'}
                            </a>
                            <a 
                                href="#curriculum" 
                                class="py-3.5 px-8 rounded-xl font-bold text-purple-400 text-xs md:text-sm tracking-wide purple-btn-outline text-center active:scale-95"
                            >
                                Lihat Kurikulum
                            </a>
                        </div>
                    </div>

                    <!-- Right Column: Image or SVG Vector Illustration -->
                    <div class="flex justify-center items-center">
                        ${hero.image_url ? `
                            <img src="${hero.image_url}" alt="E-course Illustration" class="rounded-3xl border border-purple-500/20 shadow-2xl max-h-[350px] object-cover w-full">
                        ` : defaultHeroSvg}
                    </div>
                </div>
            </header>

            <!-- Problems Section -->
            ${problemsHtml ? `
                <section class="px-6 py-16 bg-gray-950/20 max-w-6xl mx-auto w-full border-b border-purple-950">
                    <div class="text-center mb-10">
                        <h2 class="text-xl md:text-3xl font-black text-white tracking-tight">
                            ${problems.title || 'Kendala Yang Sering Dihadapi'}
                        </h2>
                        <div class="h-1 w-12 bg-purple-500 mx-auto rounded-full mt-3"></div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        ${problemsHtml}
                    </div>
                </section>
            ` : ''}

            <!-- Value Prop & Solutions -->
            <section class="px-6 py-16 max-w-6xl mx-auto w-full border-b border-purple-950">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div>
                        <span class="text-purple-400 text-xs font-bold tracking-wider uppercase">${solutions.title || 'Solusi Belajar'}</span>
                        <h2 class="text-2xl md:text-4xl font-extrabold text-white tracking-tight mt-2 mb-4">
                            Metode Belajar Terstruktur Untuk Hasil Nyata
                        </h2>
                        ${solutions.intro ? `<p class="text-xs md:text-sm text-gray-400 leading-relaxed mb-6">${solutions.intro}</p>` : ''}
                    </div>
                    <div class="flex flex-col gap-4">
                        ${solutionsHtml}
                    </div>
                </div>
            </section>

            <!-- Target Audience -->
            ${audienceHtml ? `
                <section class="px-6 py-16 max-w-6xl mx-auto w-full border-b border-purple-950">
                    <div class="text-center mb-12">
                        <h2 class="text-xl md:text-3xl font-extrabold text-white tracking-tight">
                            ${audience.title || 'Siapa Yang Wajib Mengikuti Kelas Ini?'}
                        </h2>
                        <p class="text-xs text-gray-500 mt-2">Didesain khusus agar mudah dipelajari oleh berbagai kalangan</p>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
                        ${audienceHtml}
                    </div>
                </section>
            ` : ''}

            <!-- Mentor Section -->
            ${mentor.name ? `
                <section class="px-6 py-16 bg-gray-950/10 border-b border-purple-950">
                    <div class="max-w-6xl mx-auto bg-indigo-950/20 border border-purple-950/50 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                        <div class="flex-shrink-0">
                            ${mentor.avatar_url ? `
                                <img src="${mentor.avatar_url}" alt="${mentor.name}" class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-purple-500 shadow-lg mx-auto">
                            ` : defaultMentorSvg}
                        </div>
                        <div>
                            <span class="px-3 py-1 rounded-full text-[9px] font-bold bg-purple-500/10 border border-purple-500/20 text-purple-400 uppercase tracking-widest">Mentor Kelas</span>
                            <h3 class="text-xl font-extrabold text-white mt-2">${mentor.name}</h3>
                            <p class="text-xs text-purple-300 font-bold mb-3">${mentor.role || 'Instruktur Utama'}</p>
                            <p class="text-xs md:text-sm text-gray-400 leading-relaxed">${mentor.desc || ''}</p>
                        </div>
                    </div>
                </section>
            ` : ''}

            <!-- Curriculum Section -->
            ${curriculumHtml ? `
                <section class="px-6 py-16 max-w-6xl mx-auto w-full border-b border-purple-950" id="curriculum">
                    <div class="text-center mb-12">
                        <h2 class="text-xl md:text-3xl font-extrabold text-white tracking-tight">
                            ${curriculum.title || 'Kurikulum Kelas'}
                        </h2>
                        <p class="text-xs text-gray-500 mt-2">Syllabus lengkap materi pembelajaran yang akan Anda pelajari</p>
                    </div>
                    <div class="flex flex-col">
                        ${curriculumHtml}
                    </div>
                </section>
            ` : ''}

            <!-- Benefits Section -->
            ${benefitsHtml ? `
                <section class="px-6 py-16 max-w-6xl mx-auto w-full border-b border-purple-950">
                    <div class="text-center mb-12">
                        <h2 class="text-xl md:text-3xl font-extrabold text-white tracking-tight">
                            ${benefits.title || 'Keuntungan Bergabung'}
                        </h2>
                        <p class="text-xs text-gray-500 mt-2">Segudang fasilitas belajar premium untuk menunjang kesuksesan Anda</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        ${benefitsHtml}
                    </div>
                </section>
            ` : ''}

            <!-- Testimonials Section -->
            ${testimonialsHtml ? `
                <section class="px-6 py-16 max-w-6xl mx-auto w-full border-b border-purple-950">
                    <div class="text-center mb-12">
                        <h2 class="text-xl md:text-3xl font-extrabold text-white tracking-tight">
                            ${testimonials.title || 'Kisah Sukses Alumni'}
                        </h2>
                        <p class="text-xs text-gray-500 mt-2">Ulasan jujur mereka yang sudah merasakan manfaat e-course ini</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${testimonialsHtml}
                    </div>
                </section>
            ` : ''}

            <!-- Special Bonuses -->
            ${bonusesHtml ? `
                <section class="px-6 py-16 bg-gray-950/20 w-full border-b border-purple-950">
                    <div class="max-w-6xl mx-auto">
                        <div class="text-center mb-12">
                            <h2 class="text-xl md:text-3xl font-extrabold text-white tracking-tight">
                                ${bonuses.title || 'Bonus Eksklusif Tambahan'}
                            </h2>
                            <p class="text-xs text-gray-500 mt-2">Dapatkan semua bonus premium ini secara gratis khusus pendaftaran hari ini</p>
                        </div>
                        <div class="flex flex-col gap-6">
                            ${bonusesHtml}
                        </div>
                    </div>
                </section>
            ` : ''}

            <!-- Pricing / Checkout Section -->
            <section class="px-6 py-16 bg-gradient-to-b from-indigo-950/5 to-purple-950/10 w-full border-b border-purple-950" id="pricing">
                <div class="max-w-md mx-auto bg-gray-950/90 border-2 border-purple-500 rounded-3xl p-8 relative shadow-2xl">
                    <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-pink-600 text-white text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full uppercase shadow">
                        PROMO AKTIF HARI INI
                    </div>
                    <div class="text-center mb-8 pt-4">
                        <h3 class="text-lg md:text-xl font-extrabold text-white mb-2">
                            ${pricing.title || 'Investasi Terbaik Anda'}
                        </h3>
                        <p class="text-xs text-gray-500 mb-4">Akses selamanya ke seluruh materi pembelajaran</p>
                        
                        <div class="flex justify-center items-center gap-3 mb-2">
                            <span class="text-xs text-gray-500 line-through">${pricing.original_price || ''}</span>
                            <span class="text-3xl font-black text-white">${pricing.discounted_price || ''}</span>
                        </div>
                        <p class="text-[10px] text-pink-400 font-bold bg-pink-500/10 border border-pink-500/20 py-2 px-4 rounded-xl inline-block">
                            Garansi 100% Uang Kembali 30 Hari
                        </p>
                    </div>

                    ${pricingFeaturesHtml ? `
                        <ul class="flex flex-col gap-3 mb-8 border-t border-purple-950 pt-6">
                            ${pricingFeaturesHtml}
                        </ul>
                    ` : ''}

                    <div class="flex justify-center">
                        <a 
                            href="${finalCtaUrl}" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="py-4 px-8 rounded-xl font-bold text-white text-xs md:text-sm tracking-wide purple-btn text-center w-full active:scale-95"
                        >
                            ${pricing.cta_text || 'Daftar Sekarang'}
                        </a>
                    </div>
                </div>
            </section>

            <!-- FAQ Section -->
            ${content.faqs && content.faqs.length > 0 ? `
                <section class="px-6 py-16 max-w-6xl mx-auto w-full border-b border-purple-950" id="e-course-faq-root"></section>
            ` : ''}

            <!-- Footer -->
            <footer class="bg-gray-950 border-t border-purple-950 py-10 px-6 mt-auto text-center text-xs text-gray-500">
                <p class="mb-4">${contact.copyright || `© ${new Date().getFullYear()} E-Course Academy. Hak Cipta Dilindungi.`}</p>
                <div class="flex justify-center gap-4 text-gray-500">
                    <a href="${waUrlGeneral}" target="_blank" rel="noopener noreferrer" class="hover:text-purple-400 transition-colors">Hubungi Kami (WhatsApp)</a>
                </div>
            </footer>
        </div>
    `;

    // Initialize Countdown Timer Logic
    setupCountdownTimer(content.countdown);

    // Initialize Accordion Logic
    setupCurriculumAccordion();

    // Initialize FAQ component if available
    const faqRoot = document.getElementById('e-course-faq-root');
    if (faqRoot && Array.isArray(content.faqs) && content.faqs.length > 0) {
        const { initFaq } = await import('../components/Faq.js');
        await initFaq(faqRoot, content.faqs, { 
            theme: 'neon-conversion',
            title: 'Tanya Jawab Seputar E-Course',
            subtitle: 'Jawaban atas pertanyaan yang paling sering diajukan'
        });
    }
}

/**
 * Timer counting down to the end of today (23:59:59)
 */
function setupCountdownTimer(countdown) {
    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-mins');
    const sEl = document.getElementById('cd-secs');

    if (!dEl || !hEl || !mEl || !sEl) return;

    const timerType = countdown?.type || 'end_of_day';
    const targetDateStr = countdown?.target_date;

    function update() {
        const now = new Date();
        let targetDate;

        if (timerType === 'fixed' && targetDateStr) {
            targetDate = new Date(targetDateStr);
        } else {
            targetDate = new Date();
            targetDate.setHours(23, 59, 59, 999);
        }

        let diff = targetDate - now;
        if (diff < 0) diff = 0;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        dEl.innerText = String(days).padStart(2, '0');
        hEl.innerText = String(hours).padStart(2, '0');
        mEl.innerText = String(mins).padStart(2, '0');
        sEl.innerText = String(secs).padStart(2, '0');
    }

    update();
    const interval = setInterval(update, 1000);
    return interval;
}

/**
 * Accordion Expand/Collapse logic for Curriculum Modules
 */
function setupCurriculumAccordion() {
    const headers = document.querySelectorAll('.curriculum-accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.curriculum-accordion-item').forEach(i => {
                i.classList.remove('active');
                const content = i.querySelector('.curriculum-accordion-content');
                if (content) content.style.maxHeight = '0px';
            });

            if (!isActive) {
                item.classList.add('active');
                const content = item.querySelector('.curriculum-accordion-content');
                if (content) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            }
        });
    });

    // Open first item by default
    const firstItem = document.querySelector('.curriculum-accordion-item');
    if (firstItem) {
        firstItem.classList.add('active');
        const content = firstItem.querySelector('.curriculum-accordion-content');
        if (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    }
}
