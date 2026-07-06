/**
 * Javanese Traditional Wedding Invitation Template
 * Cultural Javanese theme, elegant serif headings, deep maroon and gold palette.
 */
import { renderImageSlider } from '../components/ImageSlider.js';

export async function render(pageConfig, guestName) {
    const appEl = document.getElementById('app');
    const content = pageConfig.content || {};
    const groom = content.groom || {};
    const bride = content.bride || {};
    const akad = content.akad || {};
    const resepsi = content.resepsi || {};
    const gift = content.gift || {};
    const quote = content.quote || 'Kairing pakurmatan, kanthi hangajab nugrahaning Gusti Ingkang Maha Agung. Mugi pinaringan berkah lan rahayu dumateng panjenengan sekalian.';
    const stories = content.story || [];
    const gallery = content.gallery || [];

    // Colors
    const primary = '#8C2D19'; // Deep Javanese Maroon
    const secondary = '#F2E6DF'; // Light Batik Cream
    const accent = '#C59B27'; // Traditional Gold
    const textDark = '#3D1B13'; // Dark Java Brown
    const textMuted = '#6E554F';
    const bgLight = '#F7F2EF';

    // Inject fonts & styles
    if (!document.getElementById('javanese-traditional-styles')) {
        const style = document.createElement('style');
        style.id = 'javanese-traditional-styles';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Great+Vibes&family=Poppins:wght@300;400;500;600;700&display=swap');
            
            .java-serif { font-family: 'Cinzel', serif; }
            .java-cursive { font-family: 'Great Vibes', cursive; }
            .java-sans { font-family: 'Poppins', sans-serif; }
            
            body {
                background-color: ${bgLight};
                color: ${textDark};
                font-family: 'Poppins', sans-serif;
            }

            .btn-java-primary {
                background-color: ${primary};
                color: white;
                transition: all 0.3s ease;
                border: 1px solid ${accent}44;
            }
            .btn-java-primary:hover {
                background-color: #6e2010;
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(140, 45, 25, 0.4);
            }

            .btn-java-accent {
                background-color: ${accent};
                color: ${textDark};
                font-weight: 700;
                transition: all 0.3s ease;
            }
            .btn-java-accent:hover {
                background-color: #b0871d;
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(197, 155, 39, 0.4);
            }

            /* Animations */
            .spin-slow {
                animation: spin 15s linear infinite;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            /* Timeline line styling */
            .timeline-line-java::before {
                content: '';
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                width: 2px;
                height: 100%;
                background-color: ${accent}44;
                z-index: 0;
            }
            @media (max-width: 768px) {
                .timeline-line-java::before {
                    left: 20px;
                }
            }

            /* Decorative border */
            .java-gold-border {
                border: 2px solid ${accent};
                position: relative;
            }
            .java-gold-border::before {
                content: '';
                position: absolute;
                top: 4px;
                left: 4px;
                right: 4px;
                bottom: 4px;
                border: 1px dashed ${accent};
                pointer-events: none;
            }

            /* Custom scrollbar */
            ::-webkit-scrollbar {
                width: 6px;
            }
            ::-webkit-scrollbar-track {
                background: ${bgLight};
            }
            ::-webkit-scrollbar-thumb {
                background: ${primary}66;
                border-radius: 3px;
            }

            /* Gunungan breathing animation */
            @keyframes java-glowing-gold {
                0%, 100% { opacity: 0.85; filter: drop-shadow(0 0 2px ${accent}22); }
                50% { opacity: 1; filter: drop-shadow(0 0 8px ${accent}66); transform: scale(1.03); }
            }
            .java-decor-tr {
                position: absolute; top: -5px; right: -5px; width: 140px; height: 140px;
                pointer-events: none; z-index: 20; transform-origin: top right;
                animation: java-glowing-gold 5s ease-in-out infinite;
            }
            .java-decor-tl {
                position: absolute; top: -5px; left: -5px; width: 140px; height: 140px;
                pointer-events: none; z-index: 20; transform-origin: top left;
                animation: java-glowing-gold 5s ease-in-out infinite;
            }
            .java-decor-br {
                position: absolute; bottom: -5px; right: -5px; width: 140px; height: 140px;
                pointer-events: none; z-index: 20; transform-origin: bottom right;
                animation: java-glowing-gold 6s ease-in-out infinite;
            }
            .java-decor-bl {
                position: absolute; bottom: -5px; left: -5px; width: 140px; height: 140px;
                pointer-events: none; z-index: 20; transform-origin: bottom left;
                animation: java-glowing-gold 6s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }

    // Lock body scrolling until invitation is opened
    document.body.style.overflow = 'hidden';

    // Seeding wishes in localStorage if not exists
    const wishesKey = `wishes_${pageConfig.meta?.title || 'wedding'}`;
    let savedWishes = JSON.parse(localStorage.getItem(wishesKey));
    if (!savedWishes) {
        savedWishes = [
            { name: 'Keluarga Budiarjo', status: 'Hadir', wish: 'Sugeng polokromo dumateng penganten kekalih! Mugi pinaringan berkah lan kasantosan salami-laminipun. Amin.', sticker: '🌸', time: '2 jam yang lalu' },
            { name: 'Siti & Rian', status: 'Hadir', wish: 'Selamat menempuh hidup baru ya! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah lan pinaringan putra-putri ingkang sholeh/sholehah.', sticker: '❤️', time: '5 jam yang lalu' },
            { name: 'Ahmad Faisal', status: 'Ragu-ragu', wish: 'Nderek mangayubagyo, mas lan mbak. Mugi Gusti berkahi acara Akad lan Resepsinipun. InsyaAllah hadir.', sticker: '🎉', time: '1 hari yang lalu' }
        ];
        localStorage.setItem(wishesKey, JSON.stringify(savedWishes));
    }

    // Default avatars
    const defaultGroomAvatar = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256';
    const defaultBrideAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256';

    const groomImage = groom.image_url || defaultGroomAvatar;
    const brideImage = bride.image_url || defaultBrideAvatar;
    const coverImage = content.prewedding_photo_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200';

    // ── Gunungan SVGs ────────────────────────────────────────────────────────
    const javaSvgTL = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <!-- Styled Javanese Gunungan / Batik Pattern -->
        <path d="M50 10 L85 65 C85 65 70 85 50 85 C30 85 15 65 15 65 Z" fill="#C59B27" opacity="0.15"/>
        <path d="M50 10 C53 30 75 55 80 65" stroke="#C59B27" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M50 10 C47 30 25 55 20 65" stroke="#C59B27" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M50 85 L50 35" stroke="#C59B27" stroke-width="2" stroke-linecap="round"/>
        <path d="M50 55 C60 50 70 52 75 58" stroke="#C59B27" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M50 55 C40 50 30 52 25 58" stroke="#C59B27" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M50 45 C62 40 68 45 70 48" stroke="#C59B27" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M50 45 C38 40 32 45 30 48" stroke="#C59B27" stroke-width="1.2" stroke-linecap="round"/>
        <circle cx="50" cy="85" r="3" fill="#C59B27"/>
        <circle cx="35" cy="80" r="2.5" fill="#C59B27"/>
        <circle cx="65" cy="80" r="2.5" fill="#C59B27"/>
    </svg>`;

    const javaSvgTR = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" style="transform:scaleX(-1)">
        <path d="M50 10 L85 65 C85 65 70 85 50 85 C30 85 15 65 15 65 Z" fill="#C59B27" opacity="0.15"/>
        <path d="M50 10 C53 30 75 55 80 65" stroke="#C59B27" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M50 10 C47 30 25 55 20 65" stroke="#C59B27" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M50 85 L50 35" stroke="#C59B27" stroke-width="2" stroke-linecap="round"/>
        <path d="M50 55 C60 50 70 52 75 58" stroke="#C59B27" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M50 55 C40 50 30 52 25 58" stroke="#C59B27" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M50 45 C62 40 68 45 70 48" stroke="#C59B27" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M50 45 C38 40 32 45 30 48" stroke="#C59B27" stroke-width="1.2" stroke-linecap="round"/>
        <circle cx="50" cy="85" r="3" fill="#C59B27"/>
        <circle cx="35" cy="80" r="2.5" fill="#C59B27"/>
        <circle cx="65" cy="80" r="2.5" fill="#C59B27"/>
    </svg>`;

    const javaSvgBL = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" style="transform:scaleY(-1)">
        <path d="M50 10 L85 65 C85 65 70 85 50 85 C30 85 15 65 15 65 Z" fill="#C59B27" opacity="0.15"/>
        <path d="M50 10 C53 30 75 55 80 65" stroke="#C59B27" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M50 10 C47 30 25 55 20 65" stroke="#C59B27" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M50 85 L50 35" stroke="#C59B27" stroke-width="2" stroke-linecap="round"/>
        <path d="M50 55 C60 50 70 52 75 58" stroke="#C59B27" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M50 55 C40 50 30 52 25 58" stroke="#C59B27" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M50 45 C62 40 68 45 70 48" stroke="#C59B27" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M50 45 C38 40 32 45 30 48" stroke="#C59B27" stroke-width="1.2" stroke-linecap="round"/>
        <circle cx="50" cy="85" r="3" fill="#C59B27"/>
        <circle cx="35" cy="80" r="2.5" fill="#C59B27"/>
        <circle cx="65" cy="80" r="2.5" fill="#C59B27"/>
    </svg>`;

    const javaSvgBR = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" style="transform:scale(-1)">
        <path d="M50 10 L85 65 C85 65 70 85 50 85 C30 85 15 65 15 65 Z" fill="#C59B27" opacity="0.15"/>
        <path d="M50 10 C53 30 75 55 80 65" stroke="#C59B27" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M50 10 C47 30 25 55 20 65" stroke="#C59B27" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M50 85 L50 35" stroke="#C59B27" stroke-width="2" stroke-linecap="round"/>
        <path d="M50 55 C60 50 70 52 75 58" stroke="#C59B27" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M50 55 C40 50 30 52 25 58" stroke="#C59B27" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M50 45 C62 40 68 45 70 48" stroke="#C59B27" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M50 45 C38 40 32 45 30 48" stroke="#C59B27" stroke-width="1.2" stroke-linecap="round"/>
        <circle cx="50" cy="85" r="3" fill="#C59B27"/>
        <circle cx="35" cy="80" r="2.5" fill="#C59B27"/>
        <circle cx="65" cy="80" r="2.5" fill="#C59B27"/>
    </svg>`;

    // Love Story timeline render helper
    let storyHtml = '';
    if (stories && stories.length > 0) {
        const storyItems = stories.map((s, index) => {
            const isEven = index % 2 === 0;
            const imgHtml = s.image_url ? `<img src="${s.image_url}" alt="${s.title}" class="rounded-2xl max-w-full h-48 object-cover mb-4 mx-auto border border-slate-100 shadow-sm">` : '';
            
            return `
                <div class="relative flex flex-col md:flex-row items-center justify-between mb-16 w-full ${isEven ? 'md:flex-row-reverse' : ''}">
                    <!-- Timeline Dot -->
                    <div class="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center z-10">
                        <div class="w-8 h-8 rounded-full bg-white border-4 border-wedding-primary flex items-center justify-center shadow-sm">
                            <span class="w-2.5 h-2.5 rounded-full bg-wedding-primary"></span>
                        </div>
                    </div>
                    
                    <!-- Content Card -->
                    <div class="w-full md:w-[45%] pl-12 md:pl-0">
                        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/80 hover:shadow-md transition-shadow">
                            <div class="inline-block px-3 py-1 bg-wedding-secondary text-wedding-primary rounded-full text-xs font-semibold tracking-wider mb-3">${s.date}</div>
                            <h4 class="java-serif text-xl font-bold text-slate-800 mb-2">${s.title}</h4>
                            ${imgHtml}
                            <p class="text-sm text-slate-600 leading-relaxed">${s.desc}</p>
                        </div>
                    </div>
                    <!-- Empty spacer for desktop layout symmetry -->
                    <div class="hidden md:block w-[45%]"></div>
                </div>
            `;
        }).join('');

        storyHtml = `
            <section id="our-story" class="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <div class="text-center mb-16">
                    <span class="text-wedding-primary java-serif tracking-[0.2em] uppercase text-xs font-bold">Cariyos Tresna</span>
                    <h2 class="java-cursive text-6xl text-wedding-primary mt-2">Kisah Cinta Kami</h2>
                </div>
                <div class="relative timeline-line-java flex flex-col items-center">
                    ${storyItems}
                </div>
            </section>
        `;
    }

    // Gallery Slider Section render helper
    let galleryHtml = '';
    let sliderInstance = null;
    if (gallery && gallery.length > 0) {
        sliderInstance = renderImageSlider('wedding-gallery', gallery);
        galleryHtml = `
            <section id="photo-gallery" class="py-24 px-4 bg-wedding-secondary/20 border-t border-b border-wedding-primary/5">
                <div class="max-w-4xl mx-auto text-center">
                    <span class="text-wedding-primary java-serif tracking-[0.2em] uppercase text-xs font-bold">Galeri Foto</span>
                    <h2 class="java-cursive text-6xl text-wedding-primary mt-2 mb-12">Momen Bahagia</h2>
                    
                    <div class="w-full">
                        ${sliderInstance.html}
                    </div>
                </div>
            </section>
        `;
    }

    // Gift cards render helper
    let giftHtml = '';
    if (gift && gift.bank_name && gift.account_number) {
        giftHtml = `
            <section id="digital-gift" class="py-20 px-4 bg-white border-t border-b border-slate-100">
                <div class="max-w-2xl mx-auto text-center">
                    <span class="text-wedding-primary java-serif tracking-[0.2em] uppercase text-xs font-bold">Kado Digital</span>
                    <h2 class="java-cursive text-5xl text-wedding-primary mt-2 mb-4">Hadiah Kasih</h2>
                    <p class="text-sm text-slate-500 max-w-md mx-auto mb-10">Bagi panjenengan ingkang kersa ngintunaken hadiah kasih, saged kintun liwat rekening ing ngandhap menika:</p>
                    
                    <div class="bg-[#FBF8F7] rounded-3xl p-8 shadow-sm border border-[#F2E5E2] max-w-sm mx-auto relative overflow-hidden">
                        <div class="absolute right-6 top-4 text-wedding-primary text-6xl pointer-events-none font-black select-none tracking-widest whitespace-nowrap opacity-5">KADO</div>
                        <div class="font-bold text-sm text-slate-400 tracking-wider uppercase mb-1">${gift.bank_name}</div>
                        <div class="text-2xl font-mono font-bold text-wedding-primary tracking-wide my-3 select-all cursor-pointer" id="account-number-el">${gift.account_number}</div>
                        <div class="text-sm text-slate-700 font-semibold mb-6">a/n ${gift.account_holder || ''}</div>
                        
                        <button id="copy-btn" class="w-full btn-java-primary text-xs py-3 rounded-full font-semibold flex items-center justify-center gap-2">
                            <span id="copy-btn-icon">📋</span> <span id="copy-btn-text">Salin Nomor Rekening</span>
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    appEl.innerHTML = `
        <!-- Welcome Overlay Cover -->
        <div id="invitation-cover" class="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-4 bg-cover bg-center transition-all duration-1000" style="background-image: linear-gradient(rgba(61,27,19,0.65), rgba(61,27,19,0.9)), url('${coverImage}');">
            <!-- Corner Gunungan -->
            <div class="java-decor-tl">${javaSvgTL}</div>
            <div class="java-decor-tr">${javaSvgTR}</div>
            <div class="java-decor-bl">${javaSvgBL}</div>
            <div class="java-decor-br">${javaSvgBR}</div>
            
            <div class="max-w-2xl mx-auto text-white flex flex-col items-center">
                <span class="java-serif uppercase tracking-[0.3em] text-xs font-semibold text-white/80 mb-4">Serat Ulem Pernikahan</span>
                <h1 class="java-cursive text-7xl md:text-8xl text-white my-4 drop-shadow-md">${groom.nickname || 'Groom'} & ${bride.nickname || 'Bride'}</h1>
                
                <div class="w-16 h-0.5 bg-white/40 my-8"></div>
                
                <div class="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 max-w-sm mb-10 w-full">
                    <p class="text-xs text-white/70 font-medium uppercase tracking-wider mb-2">Katur Dumateng:</p>
                    <h3 class="java-serif text-2xl font-bold text-white tracking-wide">${guestName}</h3>
                </div>
                
                <button id="open-invitation-btn" class="btn-java-accent text-sm font-bold tracking-wider px-8 py-4 rounded-full flex items-center gap-3 shadow-lg shadow-black/30">
                    <span>💌</span> BUKA UNDANGAN
                </button>
            </div>
        </div>

        <!-- Background Music Player -->
        <audio id="bg-music" loop>
            <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" type="audio/mpeg">
        </audio>
        <button id="music-control-btn" class="fixed bottom-6 right-6 z-40 bg-white/80 backdrop-blur-md hover:bg-white text-wedding-primary w-12 h-12 rounded-full shadow-lg border border-slate-100 flex items-center justify-center focus:outline-none transition-all duration-300 transform scale-0">
            <div class="w-8 h-8 rounded-full border border-wedding-primary/20 flex items-center justify-center spin-slow" id="music-disc">
                🎵
            </div>
        </button>

        <!-- Main Content -->
        <main class="w-full flex-grow opacity-0 transition-opacity duration-1000" id="main-content">
            <!-- Hero / Cover Page -->
            <section class="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden bg-cover bg-center" style="background-image: linear-gradient(rgba(247,242,239,0.92), rgba(247,242,239,0.96)), url('${coverImage}');">
                <!-- Corner Gunungan -->
                <div class="java-decor-tl">${javaSvgTL}</div>
                <div class="java-decor-tr">${javaSvgTR}</div>
                <div class="java-decor-bl">${javaSvgBL}</div>
                <div class="java-decor-br">${javaSvgBR}</div>

                <div class="max-w-2xl mx-auto z-10 py-16">
                    <span class="java-serif uppercase tracking-[0.25em] text-xs font-semibold text-wedding-primary mb-4 block">Pahargyan Polokromo</span>
                    <h1 class="java-cursive text-7xl md:text-8xl text-wedding-primary my-6">${groom.nickname || 'Groom'} & ${bride.nickname || 'Bride'}</h1>
                    
                    <!-- Countdown Timer -->
                    <div class="mt-12 bg-white/85 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-[#F2E5E2] max-w-lg mx-auto">
                        <p class="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">Menuju Hari Bahagia</p>
                        <div class="grid grid-cols-4 gap-4" id="countdown-timer">
                            <div class="bg-[#FBF8F7] rounded-2xl p-3 border border-[#F2E5E2]">
                                <div class="text-2xl md:text-3xl font-bold text-wedding-primary" id="timer-days">00</div>
                                <div class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Dinten</div>
                            </div>
                            <div class="bg-[#FBF8F7] rounded-2xl p-3 border border-[#F2E5E2]">
                                <div class="text-2xl md:text-3xl font-bold text-wedding-primary" id="timer-hours">00</div>
                                <div class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Jam</div>
                            </div>
                            <div class="bg-[#FBF8F7] rounded-2xl p-3 border border-[#F2E5E2]">
                                <div class="text-2xl md:text-3xl font-bold text-wedding-primary" id="timer-mins">00</div>
                                <div class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Menit</div>
                            </div>
                            <div class="bg-[#FBF8F7] rounded-2xl p-3 border border-[#F2E5E2]">
                                <div class="text-2xl md:text-3xl font-bold text-wedding-primary" id="timer-secs">00</div>
                                <div class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Detik</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Bride and Groom Section -->
            <section id="bride-groom" class="py-24 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
                <div class="java-serif italic text-base md:text-lg text-wedding-primary max-w-2xl mx-auto px-4 mb-16 leading-relaxed">
                    "${quote}"
                </div>
                
                <h2 class="java-cursive text-6xl text-wedding-primary mb-16">Penganten Kekalih</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    <!-- Groom Card -->
                    <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100/85 flex flex-col items-center">
                        <div class="w-40 h-40 rounded-full overflow-hidden border-4 border-wedding-secondary shadow-md mb-6 java-gold-border">
                            <img src="${groomImage}" alt="Groom Avatar" class="w-full h-full object-cover">
                        </div>
                        <h3 class="java-serif text-2xl font-bold text-slate-900">${groom.name || ''}</h3>
                        <p class="text-wedding-primary font-semibold text-sm mt-1 mb-4">@${groom.nickname || 'groom'}</p>
                        <p class="text-xs text-slate-500 mt-2 leading-relaxed">
                            Putra Kinasih Pasangan:<br>
                            <span class="font-bold text-slate-700">${groom.father || ''}</span><br>
                            &<br>
                            <span class="font-bold text-slate-700">${groom.mother || ''}</span>
                        </p>
                    </div>
                    
                    <!-- Bride Card -->
                    <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100/85 flex flex-col items-center">
                        <div class="w-40 h-40 rounded-full overflow-hidden border-4 border-wedding-secondary shadow-md mb-6 java-gold-border">
                            <img src="${brideImage}" alt="Bride Avatar" class="w-full h-full object-cover">
                        </div>
                        <h3 class="java-serif text-2xl font-bold text-slate-900">${bride.name || ''}</h3>
                        <p class="text-wedding-primary font-semibold text-sm mt-1 mb-4">@${bride.nickname || 'bride'}</p>
                        <p class="text-xs text-slate-500 mt-2 leading-relaxed">
                            Putri Kinasih Pasangan:<br>
                            <span class="font-bold text-slate-700">${bride.father || ''}</span><br>
                            &<br>
                            <span class="font-bold text-slate-700">${bride.mother || ''}</span>
                        </p>
                    </div>
                </div>
            </section>

            <!-- Love Story Section (Dynamic) -->
            ${storyHtml}

            <!-- Gallery Section (Dynamic Slider) -->
            ${galleryHtml}

            <!-- Events Section -->
            <section id="events" class="py-24 px-4 bg-wedding-secondary/20 border-t border-b border-wedding-primary/5">
                <div class="max-w-4xl mx-auto text-center">
                    <span class="text-wedding-primary java-serif tracking-[0.2em] uppercase text-xs font-bold">Wekdal & Papan</span>
                    <h2 class="java-cursive text-6xl text-wedding-primary mt-2 mb-16">Pahargyan Upacara</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Akad Nikah -->
                        <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center flex flex-col justify-between items-center">
                            <div class="flex flex-col items-center w-full">
                                <div class="w-16 h-16 rounded-2xl bg-wedding-secondary/60 flex items-center justify-center text-3xl text-wedding-primary mb-6">💍</div>
                                <h3 class="java-serif text-2xl font-bold text-slate-800 mb-4">Pahargyan Akad</h3>
                                <div class="w-12 h-[1px] bg-wedding-primary/20 mb-6"></div>
                                <p class="text-sm font-semibold text-slate-700 mb-1">${akad.date || ''}</p>
                                <p class="text-xs text-slate-500 mb-6">${akad.time || ''}</p>
                                <p class="text-sm font-medium text-slate-600 max-w-xs leading-relaxed mb-4">${akad.location || ''}</p>
                            </div>
                            ${akad.maps_url ? `
                                <a href="${akad.maps_url}" target="_blank" rel="noopener noreferrer" class="btn-java-primary text-xs font-semibold px-6 py-3 rounded-full flex items-center gap-2">
                                    📍 Peta Google Maps
                                </a>
                            ` : ''}
                        </div>
                        
                        <!-- Resepsi -->
                        <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center flex flex-col justify-between items-center">
                            <div class="flex flex-col items-center w-full">
                                <div class="w-16 h-16 rounded-2xl bg-wedding-secondary/60 flex items-center justify-center text-3xl text-wedding-primary mb-6">🎉</div>
                                <h3 class="java-serif text-2xl font-bold text-slate-800 mb-4">Pahargyan Resepsi</h3>
                                <div class="w-12 h-[1px] bg-wedding-primary/20 mb-6"></div>
                                <p class="text-sm font-semibold text-slate-700 mb-1">${resepsi.date || ''}</p>
                                <p class="text-xs text-slate-500 mb-6">${resepsi.time || ''}</p>
                                <p class="text-sm font-medium text-slate-600 max-w-xs leading-relaxed mb-4">${resepsi.location || ''}</p>
                            </div>
                            ${resepsi.maps_url ? `
                                <a href="${resepsi.maps_url}" target="_blank" rel="noopener noreferrer" class="btn-java-primary text-xs font-semibold px-6 py-3 rounded-full flex items-center gap-2">
                                    📍 Peta Google Maps
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </section>

            <!-- Digital Gift -->
            ${giftHtml}

            <!-- RSVP & wishes (Guestbook) Section -->
            <section id="guestbook" class="py-24 px-4 bg-wedding-secondary/10">
                <div class="max-w-3xl mx-auto">
                    <div class="text-center mb-12">
                        <span class="text-wedding-primary java-serif tracking-[0.2em] uppercase text-xs font-bold">Ulem Ulem</span>
                        <h2 class="java-cursive text-5xl text-wedding-primary mt-2 mb-4">Konfirmasi Kehadiran & Doa</h2>
                        <p class="text-sm text-slate-500 max-w-md mx-auto">Kehadiran serta doa restu panjenengan sekalian anggadhahi arti ingkang ageng kagem kawula.</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <!-- RSVP Form Card -->
                        <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <h3 class="java-serif text-lg font-bold text-slate-800 mb-6">Kirim Ucapan</h3>
                            <form id="rsvp-form" class="space-y-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Anda</label>
                                    <input type="text" id="rsvp-name" required value="${guestName !== 'Tamu Undangan' ? guestName : ''}" placeholder="Nama lengkap Anda..." class="w-full bg-[#FBF8F7] border border-[#F2E5E2] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-wedding-primary transition-colors text-slate-700">
                                </div>
                                
                                <div>
                                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Konfirmasi Kehadiran</label>
                                    <select id="rsvp-status" required class="w-full bg-[#FBF8F7] border border-[#F2E5E2] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-wedding-primary transition-colors text-slate-700">
                                        <option value="Hadir">Saya akan Hadir</option>
                                        <option value="Tidak Hadir">Maaf, tidak bisa Hadir</option>
                                        <option value="Ragu-ragu">Masih Ragu-ragu</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Sticker Hiasan</label>
                                    <div class="flex gap-3 justify-between py-1" id="sticker-selector">
                                        <button type="button" data-sticker="❤️" class="sticker-btn text-2xl p-2 rounded-xl bg-[#FBF8F7] border border-slate-100 hover:scale-115 transition-transform active:bg-wedding-secondary focus:outline-none">❤️</button>
                                        <button type="button" data-sticker="🌸" class="sticker-btn text-2xl p-2 rounded-xl bg-[#FBF8F7] border border-slate-100 hover:scale-115 transition-transform active:bg-wedding-secondary focus:outline-none border-wedding-primary ring-2 ring-wedding-primary/10">🌸</button>
                                        <button type="button" data-sticker="💍" class="sticker-btn text-2xl p-2 rounded-xl bg-[#FBF8F7] border border-slate-100 hover:scale-115 transition-transform active:bg-wedding-secondary focus:outline-none">💍</button>
                                        <button type="button" data-sticker="🎉" class="sticker-btn text-2xl p-2 rounded-xl bg-[#FBF8F7] border border-slate-100 hover:scale-115 transition-transform active:bg-wedding-secondary focus:outline-none">🎉</button>
                                        <button type="button" data-sticker="🥂" class="sticker-btn text-2xl p-2 rounded-xl bg-[#FBF8F7] border border-slate-100 hover:scale-115 transition-transform active:bg-wedding-secondary focus:outline-none">🥂</button>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ucapan & Doa</label>
                                    <textarea id="rsvp-wish" required rows="4" placeholder="Tulis doa restu terbaik untuk penganten kekalih..." class="w-full bg-[#FBF8F7] border border-[#F2E5E2] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-wedding-primary transition-colors text-slate-700"></textarea>
                                </div>

                                <button type="submit" class="w-full btn-java-accent py-3.5 rounded-full text-sm font-bold tracking-wider mt-4">
                                    KIRIM UCAPAN
                                </button>
                            </form>
                        </div>

                        <!-- Wishes Guestbook List -->
                        <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-[500px]">
                            <h3 class="java-serif text-lg font-bold text-slate-800 mb-6 flex justify-between items-center">
                                <span>Buku Tamu</span>
                                <span class="bg-wedding-secondary text-wedding-primary text-xs px-2.5 py-1 rounded-full font-bold" id="wishes-count">0</span>
                            </h3>
                            <!-- Scrolling Container -->
                            <div class="flex-grow overflow-y-auto space-y-4 pr-2" id="wishes-list-container">
                                <!-- Dynamically populated -->
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Footer -->
            <footer class="bg-[#24130F] py-20 text-center text-[#E8D4C8]">
                <div class="max-w-md mx-auto px-4">
                    <p class="java-cursive text-4xl text-wedding-primary mb-3">Matur Nuwun</p>
                    <p class="text-xs leading-relaxed text-white/60">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu dumateng penganten kekalih.</p>
                    
                    <div class="h-[1px] bg-white/10 my-8"></div>
                    
                    <p class="text-[10px] text-white/40">© ${new Date().getFullYear()} ${groom.nickname || 'Groom'} & ${bride.nickname || 'Bride'} Wedding. Created with Siluet.</p>
                </div>
            </footer>
        </main>
    `;

    // Apply color values to style blocks
    const styleColors = document.createElement('style');
    styleColors.innerHTML = `
        .bg-wedding-primary { background-color: ${primary} !important; }
        .text-wedding-primary { color: ${primary} !important; }
        .border-wedding-primary { border-color: ${primary} !important; }
        .bg-wedding-secondary { background-color: ${secondary} !important; }
    `;
    document.head.appendChild(styleColors);

    // Initialize Slider if exists
    if (sliderInstance) {
        sliderInstance.setup();
    }

    // Audio Elements
    const audioEl = document.getElementById('bg-music');
    const playBtn = document.getElementById('music-control-btn');
    const playDisc = document.getElementById('music-disc');

    // Controls Cover Open Event
    document.getElementById('open-invitation-btn').addEventListener('click', () => {
        // Unlock Scrolling
        document.body.style.overflow = 'auto';
        
        // Anim cover transition
        const coverEl = document.getElementById('invitation-cover');
        coverEl.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            coverEl.style.display = 'none';
        }, 1000);

        // Fade in content
        const contentEl = document.getElementById('main-content');
        contentEl.classList.remove('opacity-0');

        // Play music
        audioEl.play().then(() => {
            playBtn.classList.remove('scale-0');
        }).catch(err => {
            console.log("Music autoplay prevented. Displaying button.", err);
            playBtn.classList.remove('scale-0');
        });
    });

    // Audio Playback Toggles
    playBtn.addEventListener('click', () => {
        if (audioEl.paused) {
            audioEl.play();
            playDisc.classList.add('spin-slow');
            playDisc.innerHTML = '🎵';
        } else {
            audioEl.pause();
            playDisc.classList.remove('spin-slow');
            playDisc.innerHTML = '🔇';
        }
    });

    // Countdown Timer logic
    let weddingDate = new Date();
    if (akad.date) {
        const cleanDateStr = akad.date.replace(/[^a-zA-Z0-9\s,-]/g, '');
        const parsedDate = Date.parse(cleanDateStr);
        if (!isNaN(parsedDate)) {
            weddingDate = new Date(parsedDate);
        } else {
            weddingDate.setDate(weddingDate.getDate() + 30);
        }
    } else {
        weddingDate.setDate(weddingDate.getDate() + 30);
    }

    const updateTimer = () => {
        const now = new Date();
        const diff = weddingDate - now;

        if (diff <= 0) {
            document.getElementById('countdown-timer').innerHTML = `
                <div class="col-span-4 text-center font-bold text-wedding-primary py-4">Hari Bahagia Telah Tiba!</div>
            `;
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('timer-days').innerText = String(days).padStart(2, '0');
        document.getElementById('timer-hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('timer-mins').innerText = String(mins).padStart(2, '0');
        document.getElementById('timer-secs').innerText = String(secs).padStart(2, '0');
    };
    
    updateTimer();
    setInterval(updateTimer, 1000);

    // Copy to clipboard functionality
    if (giftHtml) {
        const copyBtn = document.getElementById('copy-btn');
        copyBtn.addEventListener('click', async () => {
            const accNum = document.getElementById('account-number-el').innerText;
            try {
                await navigator.clipboard.writeText(accNum);
                document.getElementById('copy-btn-text').innerText = 'Nomor Rekening Disalin!';
                document.getElementById('copy-btn-icon').innerText = '✅';
                copyBtn.classList.add('bg-green-600');
                
                setTimeout(() => {
                    document.getElementById('copy-btn-text').innerText = 'Salin Nomor Rekening';
                    document.getElementById('copy-btn-icon').innerText = '📋';
                    copyBtn.classList.remove('bg-green-600');
                }, 2500);
            } catch (err) {
                console.error("Gagal menyalin rekening:", err);
            }
        });
    }

    // Interactive Wishes Guestbook functions
    let selectedSticker = '🌸';
    const stickerBtns = document.querySelectorAll('.sticker-btn');
    stickerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            stickerBtns.forEach(b => {
                b.classList.remove('border-wedding-primary', 'ring-2', 'ring-wedding-primary/10');
            });
            btn.classList.add('border-wedding-primary', 'ring-2', 'ring-wedding-primary/10');
            selectedSticker = btn.getAttribute('data-sticker');
        });
    });

    const wishesContainer = document.getElementById('wishes-list-container');
    const wishesCountEl = document.getElementById('wishes-count');

    const renderWishes = () => {
        const currentWishes = JSON.parse(localStorage.getItem(wishesKey)) || [];
        wishesCountEl.innerText = currentWishes.length;

        if (currentWishes.length === 0) {
            wishesContainer.innerHTML = `<div class="text-center text-xs text-slate-400 py-12">Belum ada ucapan. Jadilah yang pertama!</div>`;
            return;
        }

        wishesContainer.innerHTML = currentWishes.map(w => {
            const statusBadgeColor = w.status === 'Hadir' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                : w.status === 'Tidak Hadir' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100';

            return `
                <div class="bg-[#FBF8F7] rounded-2xl p-4 border border-[#F2E5E2] relative hover:shadow-sm transition-shadow">
                    <div class="absolute right-4 top-4 text-2xl">${w.sticker || '🌸'}</div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="font-bold text-sm text-slate-800">${w.name}</span>
                        <span class="text-[10px] font-semibold px-2 py-0.5 border rounded-full ${statusBadgeColor}">${w.status}</span>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed mb-2 pr-6">${w.wish}</p>
                    <span class="text-[9px] text-slate-400 font-medium">${w.time || 'Baru saja'}</span>
                </div>
            `;
        }).join('');
    };

    renderWishes();

    const formEl = document.getElementById('rsvp-form');
    formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('rsvp-name').value.trim();
        const statusSelect = document.getElementById('rsvp-status').value;
        const wishText = document.getElementById('rsvp-wish').value.trim();

        if (!nameInput || !wishText) return;

        const newWish = {
            name: nameInput,
            status: statusSelect,
            wish: wishText,
            sticker: selectedSticker,
            time: 'Baru saja'
        };

        const currentWishes = JSON.parse(localStorage.getItem(wishesKey)) || [];
        currentWishes.unshift(newWish);
        localStorage.setItem(wishesKey, JSON.stringify(currentWishes));

        document.getElementById('rsvp-wish').value = '';
        renderWishes();
        wishesContainer.scrollTop = 0;
    });
}
