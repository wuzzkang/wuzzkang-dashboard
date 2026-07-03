/**
 * Classic Love Wedding Invitation Template
 * Bohemian rustic romantic theme with warm cream background,
 * bronze/brown accents, decorative SVG florals and elegant typography.
 */
export async function render(pageConfig, guestName = 'Tamu Undangan') {
    const appEl = document.getElementById('app');
    const content = pageConfig.content || {};
    const groom = content.groom || {};
    const bride = content.bride || {};
    const akad = content.akad || {};
    const resepsi = content.resepsi || {};
    const gift = content.gift || {};
    const quote = content.quote || 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri... (Ar-Rum: 21)';
    const stories = content.story || [];

    // ── Theme Colors ──────────────────────────────────────────────────────────
    const primary   = '#9B7B6A'; // Warm bronze/brown
    const light     = '#C4A49A'; // Muted rose-beige
    const bgCream   = '#FBF8F4'; // Parchment cream
    const bgCard    = '#FFFFFF';
    const textDark  = '#4A3728'; // Deep espresso
    const textMuted = '#9A7D72';

    // ── SVG Decorations ───────────────────────────────────────────────────────
    const floralSvgTL = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" width="120" height="120">
        <ellipse cx="25" cy="85" rx="8" ry="28" fill="#C4A49A" opacity="0.5" transform="rotate(-40 25 85)"/>
        <ellipse cx="40" cy="95" rx="7" ry="22" fill="#D4B5A8" opacity="0.5" transform="rotate(-20 40 95)"/>
        <ellipse cx="15" cy="70" rx="6" ry="20" fill="#B89080" opacity="0.45" transform="rotate(-55 15 70)"/>
        <circle cx="48" cy="68" r="12" fill="#E8C9BF" opacity="0.6"/>
        <circle cx="60" cy="80" r="9" fill="#F0D8CF" opacity="0.55"/>
        <circle cx="35" cy="60" r="8" fill="#DAAD9E" opacity="0.5"/>
        <ellipse cx="55" cy="52" rx="5" ry="14" fill="#C4A49A" opacity="0.4" transform="rotate(20 55 52)"/>
        <circle cx="22" cy="50" r="4" fill="#E8C9BF" opacity="0.5"/>
        <circle cx="65" cy="62" r="5" fill="#F5E5DE" opacity="0.55"/>
    </svg>`;

    const floralSvgTR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" width="120" height="120" style="transform:scaleX(-1)">
        <ellipse cx="25" cy="85" rx="8" ry="28" fill="#C4A49A" opacity="0.5" transform="rotate(-40 25 85)"/>
        <ellipse cx="40" cy="95" rx="7" ry="22" fill="#D4B5A8" opacity="0.5" transform="rotate(-20 40 95)"/>
        <ellipse cx="15" cy="70" rx="6" ry="20" fill="#B89080" opacity="0.45" transform="rotate(-55 15 70)"/>
        <circle cx="48" cy="68" r="12" fill="#E8C9BF" opacity="0.6"/>
        <circle cx="60" cy="80" r="9" fill="#F0D8CF" opacity="0.55"/>
        <circle cx="35" cy="60" r="8" fill="#DAAD9E" opacity="0.5"/>
        <ellipse cx="55" cy="52" rx="5" ry="14" fill="#C4A49A" opacity="0.4" transform="rotate(20 55 52)"/>
        <circle cx="22" cy="50" r="4" fill="#E8C9BF" opacity="0.5"/>
        <circle cx="65" cy="62" r="5" fill="#F5E5DE" opacity="0.55"/>
    </svg>`;

    const floralSvgBL = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" width="120" height="120" style="transform:scaleY(-1)">
        <ellipse cx="25" cy="85" rx="8" ry="28" fill="#C4A49A" opacity="0.5" transform="rotate(-40 25 85)"/>
        <ellipse cx="40" cy="95" rx="7" ry="22" fill="#D4B5A8" opacity="0.5" transform="rotate(-20 40 95)"/>
        <ellipse cx="15" cy="70" rx="6" ry="20" fill="#B89080" opacity="0.45" transform="rotate(-55 15 70)"/>
        <circle cx="48" cy="68" r="12" fill="#E8C9BF" opacity="0.6"/>
        <circle cx="60" cy="80" r="9" fill="#F0D8CF" opacity="0.55"/>
        <circle cx="35" cy="60" r="8" fill="#DAAD9E" opacity="0.5"/>
        <ellipse cx="55" cy="52" rx="5" ry="14" fill="#C4A49A" opacity="0.4" transform="rotate(20 55 52)"/>
    </svg>`;

    const floralSvgBR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" width="120" height="120" style="transform:scale(-1)">
        <ellipse cx="25" cy="85" rx="8" ry="28" fill="#C4A49A" opacity="0.5" transform="rotate(-40 25 85)"/>
        <ellipse cx="40" cy="95" rx="7" ry="22" fill="#D4B5A8" opacity="0.5" transform="rotate(-20 40 95)"/>
        <ellipse cx="15" cy="70" rx="6" ry="20" fill="#B89080" opacity="0.45" transform="rotate(-55 15 70)"/>
        <circle cx="48" cy="68" r="12" fill="#E8C9BF" opacity="0.6"/>
        <circle cx="60" cy="80" r="9" fill="#F0D8CF" opacity="0.55"/>
        <circle cx="35" cy="60" r="8" fill="#DAAD9E" opacity="0.5"/>
        <ellipse cx="55" cy="52" rx="5" ry="14" fill="#C4A49A" opacity="0.4" transform="rotate(20 55 52)"/>
    </svg>`;

    // ── Inject fonts & styles ─────────────────────────────────────────────────
    if (!document.getElementById('classic-love-styles')) {
        const style = document.createElement('style');
        style.id = 'classic-love-styles';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Playball&family=Cinzel:wght@400;600;700&family=Montserrat:wght@300;400;500;600&display=swap');

            .cl-cursive  { font-family: 'Playball', cursive; }
            .cl-serif    { font-family: 'Cinzel', serif; }
            .cl-sans     { font-family: 'Montserrat', sans-serif; }

            body {
                background-color: ${bgCream};
                color: ${textDark};
                font-family: 'Montserrat', sans-serif;
                overflow-x: hidden;
            }

            .btn-cl {
                background-color: ${primary};
                color: #fff;
                transition: all 0.3s ease;
                border: none;
            }
            .btn-cl:hover {
                background-color: #7D5F50;
                transform: translateY(-2px);
                box-shadow: 0 6px 18px rgba(155,123,106,0.35);
            }

            /* Corner decoration */
            .cl-corner { position: absolute; width: 120px; height: 120px; pointer-events: none; z-index: 5; }
            .cl-corner-tl { top: 0; left: 0; }
            .cl-corner-tr { top: 0; right: 0; }
            .cl-corner-bl { bottom: 0; left: 0; }
            .cl-corner-br { bottom: 0; right: 0; }

            /* Divider ornament */
            .cl-divider {
                display: flex; align-items: center; gap: 1rem;
                color: ${light}; font-size: 1.25rem; margin: 1.25rem 0;
            }
            .cl-divider::before, .cl-divider::after {
                content: ''; flex: 1;
                height: 1px; background: linear-gradient(to right, transparent, ${light}90);
            }
            .cl-divider::after { background: linear-gradient(to left, transparent, ${light}90); }

            /* Countdown boxes */
            .cl-countdown-box {
                background: ${primary};
                color: #fff;
                border-radius: 12px;
                padding: 0.75rem;
                text-align: center;
                min-width: 68px;
            }

            /* Couple avatar ring */
            .cl-avatar-ring {
                width: 140px; height: 140px;
                border-radius: 50%;
                border: 4px solid ${light};
                box-shadow: 0 4px 16px rgba(155,123,106,0.2);
                overflow: hidden;
                background: ${bgCream};
            }

            /* Card style */
            .cl-card {
                background: ${bgCard};
                border-radius: 20px;
                border: 1px solid ${light}44;
                box-shadow: 0 2px 12px rgba(155,123,106,0.1);
                padding: 1.75rem;
            }

            /* Guestbook wish item */
            .cl-wish-item {
                background: ${bgCream};
                border: 1px solid ${light}55;
                border-radius: 14px;
                padding: 1rem;
            }

            /* Input */
            .cl-input {
                width: 100%;
                background: ${bgCream};
                border: 1px solid ${light}88;
                border-radius: 12px;
                padding: 0.65rem 1rem;
                font-size: 0.82rem;
                color: ${textDark};
                font-family: 'Montserrat', sans-serif;
                transition: border-color 0.2s;
                outline: none;
            }
            .cl-input:focus { border-color: ${primary}; }

            /* Spin animation for music disc */
            @keyframes cl-spin {
                from { transform: rotate(0deg); }
                to   { transform: rotate(360deg); }
            }
            .cl-spin { animation: cl-spin 10s linear infinite; }

            /* Fade in */
            @keyframes cl-fadein {
                from { opacity: 0; transform: translateY(16px); }
                to   { opacity: 1; transform: translateY(0); }
            }
            .cl-fadein { animation: cl-fadein 0.8s ease both; }

            ::-webkit-scrollbar { width: 5px; }
            ::-webkit-scrollbar-track { background: ${bgCream}; }
            ::-webkit-scrollbar-thumb { background: ${light}88; border-radius: 4px; }
        `;
        document.head.appendChild(style);
    }

    // Lock scrolling until opened
    document.body.style.overflow = 'hidden';

    // ── Seed guestbook ───────────────────────────────────────────────────────
    const wishesKey = `wishes_classic_${pageConfig.meta?.title || 'wedding'}`;
    let savedWishes = JSON.parse(localStorage.getItem(wishesKey));
    if (!savedWishes) {
        savedWishes = [
            { name: 'Keluarga Santoso', status: 'Hadir', wish: 'Barakallahu lakuma wa baraka alaikuma wa jama\'a bainakuma fi khair. Semoga menjadi keluarga sakinah mawaddah warahmah.', sticker: '🌹', time: '3 jam yang lalu' },
            { name: 'Anisa & Deni', status: 'Hadir', wish: 'Selamat menempuh hidup baru! Semoga pernikahan ini menjadi awal kebahagiaan yang tak pernah berakhir. 💕', sticker: '💍', time: '6 jam yang lalu' },
            { name: 'Pak Hendra', status: 'Ragu-ragu', wish: 'Selamat ya, semoga lekas dikaruniai keturunan yang sholeh dan sholehah. Aamiin.', sticker: '🤲', time: '1 hari yang lalu' },
        ];
        localStorage.setItem(wishesKey, JSON.stringify(savedWishes));
    }

    // ── Avatars ───────────────────────────────────────────────────────────────
    const defaultGroom = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256';
    const defaultBride = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256';
    const groomImage   = groom.image_url || defaultGroom;
    const brideImage   = bride.image_url || defaultBride;

    // ── Love Story HTML ───────────────────────────────────────────────────────
    let storyHtml = '';
    if (stories && stories.length > 0) {
        const items = stories.map((s, i) => {
            const imgHtml = s.image_url ? `<img src="${s.image_url}" alt="${s.title}" class="rounded-xl w-full h-40 object-cover mb-3">` : '';
            return `
                <div class="cl-card cl-fadein text-center">
                    <div class="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2" style="background:${primary}22;color:${primary}">${s.year || s.date || ''}</div>
                    <h4 class="cl-serif text-base font-semibold mb-2" style="color:${textDark}">${s.title}</h4>
                    ${imgHtml}
                    <p class="cl-sans text-xs leading-relaxed" style="color:${textMuted}">${s.desc}</p>
                </div>
            `;
        }).join('');
        storyHtml = `
            <section class="py-20 px-4 max-w-2xl mx-auto">
                <div class="text-center mb-10">
                    <p class="cl-sans text-[10px] uppercase tracking-widest font-semibold" style="color:${primary}">Kisah Cinta</p>
                    <h2 class="cl-cursive" style="font-size:2.8rem;color:${primary};margin-top:0.25rem">Perjalanan Kami</h2>
                </div>
                <div class="grid grid-cols-1 gap-5">${items}</div>
            </section>
        `;
    }

    // ── Gift Section HTML ─────────────────────────────────────────────────────
    let giftHtml = '';
    if (gift && gift.bank_name && gift.account_number) {
        giftHtml = `
            <section class="py-20 px-4" style="background:${bgCard};border-top:1px solid ${light}44;border-bottom:1px solid ${light}44">
                <div class="max-w-sm mx-auto text-center">
                    <p class="cl-sans text-[10px] uppercase tracking-widest font-semibold" style="color:${primary}">Kado Kasih</p>
                    <h2 class="cl-cursive" style="font-size:2.5rem;color:${primary};margin-top:0.25rem;margin-bottom:1rem">Hadiah Digital</h2>
                    <p class="cl-sans text-xs mb-8" style="color:${textMuted}">Bagi yang ingin mengirimkan tanda kasih, dapat melalui transfer rekening berikut:</p>
                    <div class="cl-card">
                        <div class="cl-sans text-[11px] font-bold uppercase tracking-widest mb-1" style="color:${textMuted}">${gift.bank_name}</div>
                        <div class="cl-serif text-2xl font-bold tracking-wider my-3 select-all cursor-pointer" id="cl-acc-num" style="color:${primary}">${gift.account_number}</div>
                        <div class="cl-sans text-xs font-semibold mb-6" style="color:${textDark}">a/n ${gift.account_holder || ''}</div>
                        <button id="cl-copy-btn" class="btn-cl w-full py-3 rounded-full cl-sans text-xs font-semibold tracking-wider flex items-center justify-center gap-2">
                            <span id="cl-copy-icon">📋</span> <span id="cl-copy-text">Salin Nomor Rekening</span>
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    // ── Main HTML ─────────────────────────────────────────────────────────────
    appEl.innerHTML = `
        <!-- WELCOME COVER -->
        <div id="invitation-cover" class="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-4" style="background-color:${bgCream}; overflow:hidden">
            <!-- Corner florals -->
            <div class="cl-corner cl-corner-tl">${floralSvgTL}</div>
            <div class="cl-corner cl-corner-tr">${floralSvgTR}</div>
            <div class="cl-corner cl-corner-bl">${floralSvgBL}</div>
            <div class="cl-corner cl-corner-br">${floralSvgBR}</div>

            <div class="relative z-10 flex flex-col items-center max-w-xs">
                <p class="cl-sans text-[10px] uppercase tracking-widest font-semibold mb-4" style="color:${textMuted}">The Wedding Of</p>
                <h1 class="cl-cursive" style="font-size:3.6rem;line-height:1.1;color:${primary}">${groom.nickname || 'Groom'} & ${bride.nickname || 'Bride'}</h1>
                <div class="cl-divider my-5" style="width:100%">💍</div>
                <div class="cl-card px-6 py-4 mb-8 w-full" style="background:${bgCard}77;backdrop-filter:blur(6px)">
                    <p class="cl-sans text-[10px] uppercase tracking-widest font-semibold mb-1" style="color:${textMuted}">Kepada Yth.</p>
                    <p class="cl-serif text-base font-semibold" style="color:${textDark}">${guestName}</p>
                </div>
                <button id="cl-open-btn" class="btn-cl rounded-full px-8 py-3.5 cl-sans text-xs font-semibold tracking-wider flex items-center gap-2 shadow-lg">
                    💌 Buka Undangan
                </button>
            </div>
        </div>

        <!-- MUSIC -->
        <audio id="cl-music" loop>
            <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" type="audio/mpeg">
        </audio>
        <button id="cl-music-btn" class="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg cl-spin scale-0 transition-transform"
            style="background:${bgCard};border:1.5px solid ${light}88;color:${primary};transform:scale(0)" id="cl-music-btn-inner">
            🎵
        </button>

        <!-- MAIN CONTENT -->
        <main id="main-content" class="w-full opacity-0 transition-opacity duration-700">

            <!-- HERO -->
            <section class="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden" style="background-color:${bgCream}">
                <div class="cl-corner cl-corner-tl">${floralSvgTL}</div>
                <div class="cl-corner cl-corner-tr">${floralSvgTR}</div>

                <div class="relative z-10 max-w-sm mx-auto">
                    <p class="cl-sans text-[10px] uppercase tracking-widest font-semibold mb-2" style="color:${textMuted}">Walimatul 'Ursy</p>
                    <h1 class="cl-cursive" style="font-size:3.8rem;line-height:1.1;color:${primary}">${groom.nickname || 'Groom'} & ${bride.nickname || 'Bride'}</h1>

                    <!-- Ayat -->
                    <div class="my-8 px-6 py-5 cl-card cl-fadein">
                        <p class="cl-sans text-xs italic leading-relaxed" style="color:${textMuted}">"${quote}"</p>
                    </div>

                    <!-- Countdown -->
                    <p class="cl-sans text-[10px] uppercase tracking-widest font-semibold mb-3" style="color:${textMuted}">Menghitung Hari</p>
                    <div class="flex gap-3 justify-center" id="cl-countdown">
                        <div class="cl-countdown-box">
                            <div class="cl-serif text-2xl font-bold" id="cl-days">00</div>
                            <div class="cl-sans text-[10px] font-semibold mt-1 opacity-80">Hari</div>
                        </div>
                        <div class="cl-countdown-box">
                            <div class="cl-serif text-2xl font-bold" id="cl-hours">00</div>
                            <div class="cl-sans text-[10px] font-semibold mt-1 opacity-80">Jam</div>
                        </div>
                        <div class="cl-countdown-box">
                            <div class="cl-serif text-2xl font-bold" id="cl-mins">00</div>
                            <div class="cl-sans text-[10px] font-semibold mt-1 opacity-80">Menit</div>
                        </div>
                        <div class="cl-countdown-box">
                            <div class="cl-serif text-2xl font-bold" id="cl-secs">00</div>
                            <div class="cl-sans text-[10px] font-semibold mt-1 opacity-80">Detik</div>
                        </div>
                    </div>
                </div>

                <div class="cl-corner cl-corner-bl">${floralSvgBL}</div>
                <div class="cl-corner cl-corner-br">${floralSvgBR}</div>
            </section>

            <!-- COUPLE SECTION -->
            <section id="couple" class="py-24 px-4 text-center" style="background:${bgCard}">
                <p class="cl-sans text-[10px] uppercase tracking-widest font-semibold mb-2" style="color:${primary}">Bismillahirrahmanirrahim</p>
                <p class="cl-sans text-xs max-w-xs mx-auto leading-relaxed mb-10" style="color:${textMuted}">
                    Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara pernikahan putra-putri kami.
                </p>

                <div class="cl-divider max-w-xs mx-auto">🌹</div>

                <div class="max-w-sm mx-auto mt-10 space-y-10">
                    <!-- Groom -->
                    <div class="flex flex-col items-center cl-fadein">
                        <div class="cl-avatar-ring mb-4">
                            <img src="${groomImage}" alt="Groom" class="w-full h-full object-cover">
                        </div>
                        <h2 class="cl-serif text-lg font-bold uppercase tracking-wider" style="color:${textDark}">${groom.name || ''}</h2>
                        <p class="cl-sans text-xs mt-1" style="color:${textMuted}">Putra dari:</p>
                        <p class="cl-sans text-xs font-semibold mt-0.5" style="color:${textDark}">${groom.father || ''} &amp; ${groom.mother || ''}</p>
                    </div>

                    <div class="cl-divider">💕</div>

                    <!-- Bride -->
                    <div class="flex flex-col items-center cl-fadein">
                        <div class="cl-avatar-ring mb-4">
                            <img src="${brideImage}" alt="Bride" class="w-full h-full object-cover">
                        </div>
                        <h2 class="cl-serif text-lg font-bold uppercase tracking-wider" style="color:${textDark}">${bride.name || ''}</h2>
                        <p class="cl-sans text-xs mt-1" style="color:${textMuted}">Putri dari:</p>
                        <p class="cl-sans text-xs font-semibold mt-0.5" style="color:${textDark}">${bride.father || ''} &amp; ${bride.mother || ''}</p>
                    </div>
                </div>
            </section>

            <!-- LOVE STORY (dynamic) -->
            ${storyHtml}

            <!-- EVENT SECTION -->
            <section id="events" class="py-20 px-4 relative overflow-hidden" style="background-color:${bgCream}">
                <div class="cl-corner cl-corner-tl">${floralSvgTL}</div>
                <div class="cl-corner cl-corner-tr">${floralSvgTR}</div>
                <div class="relative z-10 max-w-sm mx-auto text-center">
                    <p class="cl-sans text-[10px] uppercase tracking-widest font-semibold mb-2" style="color:${primary}">Waktu & Tempat</p>
                    <h2 class="cl-cursive mb-10" style="font-size:2.8rem;color:${primary}">Acara Kami</h2>

                    <div class="space-y-5">
                        <!-- Akad -->
                        <div class="cl-card text-left">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style="background:${primary}22">💍</div>
                                <div>
                                    <h3 class="cl-serif text-sm font-bold" style="color:${textDark}">Akad Nikah</h3>
                                    <p class="cl-sans text-[11px]" style="color:${textMuted}">${akad.date || ''}</p>
                                </div>
                            </div>
                            <div class="cl-sans text-xs space-y-1 pl-[52px]" style="color:${textMuted}">
                                <p><span class="font-semibold" style="color:${textDark}">🕐</span> ${akad.time || ''}</p>
                                <p><span class="font-semibold" style="color:${textDark}">📍</span> ${akad.location || ''}</p>
                            </div>
                            ${akad.maps_url ? `<a href="${akad.maps_url}" target="_blank" rel="noopener noreferrer" class="btn-cl mt-4 ml-[52px] inline-flex items-center gap-2 px-5 py-2.5 rounded-full cl-sans text-[11px] font-semibold">📍 Buka Maps</a>` : ''}
                        </div>

                        <!-- Resepsi -->
                        <div class="cl-card text-left">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style="background:${primary}22">🎉</div>
                                <div>
                                    <h3 class="cl-serif text-sm font-bold" style="color:${textDark}">Resepsi Pernikahan</h3>
                                    <p class="cl-sans text-[11px]" style="color:${textMuted}">${resepsi.date || ''}</p>
                                </div>
                            </div>
                            <div class="cl-sans text-xs space-y-1 pl-[52px]" style="color:${textMuted}">
                                <p><span class="font-semibold" style="color:${textDark}">🕐</span> ${resepsi.time || ''}</p>
                                <p><span class="font-semibold" style="color:${textDark}">📍</span> ${resepsi.location || ''}</p>
                            </div>
                            ${resepsi.maps_url ? `<a href="${resepsi.maps_url}" target="_blank" rel="noopener noreferrer" class="btn-cl mt-4 ml-[52px] inline-flex items-center gap-2 px-5 py-2.5 rounded-full cl-sans text-[11px] font-semibold">📍 Buka Maps</a>` : ''}
                        </div>
                    </div>
                </div>
            </section>

            <!-- DIGITAL GIFT (dynamic) -->
            ${giftHtml}

            <!-- GUESTBOOK -->
            <section id="guestbook" class="py-20 px-4" style="background:${bgCard}">
                <div class="max-w-sm mx-auto">
                    <div class="text-center mb-10">
                        <p class="cl-sans text-[10px] uppercase tracking-widest font-semibold mb-2" style="color:${primary}">Buku Tamu</p>
                        <h2 class="cl-cursive mb-2" style="font-size:2.8rem;color:${primary}">Kehadiran & Doa</h2>
                        <p class="cl-sans text-xs" style="color:${textMuted}">Doa dan kehadiran Anda adalah kebahagiaan bagi kami.</p>
                    </div>

                    <!-- RSVP Form -->
                    <div class="cl-card mb-6">
                        <h3 class="cl-serif text-sm font-bold mb-5" style="color:${textDark}">Kirim Ucapan</h3>
                        <form id="cl-rsvp-form" class="space-y-3">
                            <input type="text" id="cl-rsvp-name" placeholder="Nama Anda..." required
                                class="cl-input" value="${guestName !== 'Tamu Undangan' ? guestName : ''}">
                            <select id="cl-rsvp-status" class="cl-input">
                                <option value="Hadir">✅ Insyaallah Hadir</option>
                                <option value="Tidak Hadir">❌ Maaf Tidak Bisa Hadir</option>
                                <option value="Ragu-ragu">🤔 Masih Ragu-ragu</option>
                            </select>

                            <!-- Sticker Picker -->
                            <div>
                                <label class="cl-sans text-[10px] font-bold uppercase tracking-wider block mb-2" style="color:${textMuted}">Pilih Stiker</label>
                                <div class="flex gap-2 justify-around" id="cl-sticker-row">
                                    ${['🌹','💍','🥂','🎉','🤲'].map((s, i) => `
                                        <button type="button" data-sticker="${s}"
                                            class="cl-sticker-btn text-xl p-2 rounded-xl border transition-all"
                                            style="background:${bgCream};border-color:${i===0?primary:light+'44'};${i===0?`box-shadow:0 0 0 2px ${primary}33`:''}"
                                        >${s}</button>
                                    `).join('')}
                                </div>
                            </div>

                            <textarea id="cl-rsvp-wish" rows="3" placeholder="Tulis doa & ucapan terbaik..." required class="cl-input" style="resize:none"></textarea>

                            <button type="submit" class="btn-cl w-full py-3 rounded-full cl-sans text-xs font-semibold tracking-wider">
                                Kirim Ucapan 💌
                            </button>
                        </form>
                    </div>

                    <!-- Wish List -->
                    <div class="cl-card">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="cl-serif text-sm font-bold" style="color:${textDark}">Ucapan Tamu</h3>
                            <span class="cl-sans text-[10px] font-bold px-2.5 py-0.5 rounded-full" style="background:${primary}22;color:${primary}" id="cl-wishes-count">0</span>
                        </div>
                        <div class="space-y-3 max-h-80 overflow-y-auto pr-1" id="cl-wishes-list"></div>
                    </div>
                </div>
            </section>

            <!-- FOOTER -->
            <footer class="py-16 text-center px-4 relative overflow-hidden" style="background:${textDark}">
                <div class="cl-corner cl-corner-tl" style="opacity:0.15">${floralSvgTL}</div>
                <div class="cl-corner cl-corner-br" style="opacity:0.15">${floralSvgBR}</div>
                <div class="relative z-10">
                    <p class="cl-cursive mb-2" style="font-size:2.5rem;color:${light}">Terima Kasih</p>
                    <p class="cl-sans text-xs leading-relaxed max-w-xs mx-auto" style="color:${light}99">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.</p>
                    <div class="h-px my-6 max-w-xs mx-auto" style="background:${light}33"></div>
                    <p class="cl-sans text-[10px]" style="color:${light}55">© ${new Date().getFullYear()} ${groom.nickname || 'Groom'} & ${bride.nickname || 'Bride'}. Created with ❤️ on Siluet.</p>
                </div>
            </footer>
        </main>
    `;

    // ── Open Invitation Handler ────────────────────────────────────────────────
    document.getElementById('cl-open-btn').addEventListener('click', () => {
        document.body.style.overflow = 'auto';
        const cover = document.getElementById('invitation-cover');
        cover.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        cover.style.opacity = '0';
        cover.style.transform = 'translateY(-30px)';
        setTimeout(() => { cover.style.display = 'none'; }, 800);

        const main = document.getElementById('main-content');
        main.classList.remove('opacity-0');

        const audioEl = document.getElementById('cl-music');
        const musicBtn = document.getElementById('cl-music-btn');
        audioEl.play().then(() => {
            musicBtn.style.transform = 'scale(1)';
        }).catch(() => {
            musicBtn.style.transform = 'scale(1)';
        });
    });

    // ── Music Toggle ──────────────────────────────────────────────────────────
    const audioEl = document.getElementById('cl-music');
    const musicBtn = document.getElementById('cl-music-btn');
    musicBtn.addEventListener('click', () => {
        if (audioEl.paused) {
            audioEl.play();
            musicBtn.classList.add('cl-spin');
            musicBtn.innerHTML = '🎵';
        } else {
            audioEl.pause();
            musicBtn.classList.remove('cl-spin');
            musicBtn.innerHTML = '🔇';
        }
    });

    // ── Countdown Timer ───────────────────────────────────────────────────────
    let weddingDate = new Date();
    if (akad.date) {
        const parsed = Date.parse(akad.date.replace(/[^a-zA-Z0-9\s,-]/g, ''));
        if (!isNaN(parsed)) { weddingDate = new Date(parsed); }
        else { weddingDate.setDate(weddingDate.getDate() + 30); }
    } else { weddingDate.setDate(weddingDate.getDate() + 30); }

    const tick = () => {
        const diff = weddingDate - new Date();
        if (diff <= 0) {
            document.getElementById('cl-countdown').innerHTML = `<p class="cl-sans text-sm font-semibold col-span-4" style="color:${primary}">🎉 Hari Bahagia Telah Tiba!</p>`;
            return;
        }
        document.getElementById('cl-days').innerText  = String(Math.floor(diff / 86400000)).padStart(2, '0');
        document.getElementById('cl-hours').innerText = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
        document.getElementById('cl-mins').innerText  = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        document.getElementById('cl-secs').innerText  = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    };
    tick(); setInterval(tick, 1000);

    // ── Copy Account Number ───────────────────────────────────────────────────
    if (giftHtml) {
        document.getElementById('cl-copy-btn').addEventListener('click', async () => {
            const num = document.getElementById('cl-acc-num').innerText;
            try {
                await navigator.clipboard.writeText(num);
                document.getElementById('cl-copy-text').innerText = 'Berhasil Disalin!';
                document.getElementById('cl-copy-icon').innerText = '✅';
                setTimeout(() => {
                    document.getElementById('cl-copy-text').innerText = 'Salin Nomor Rekening';
                    document.getElementById('cl-copy-icon').innerText = '📋';
                }, 2500);
            } catch(e) { console.error('Clipboard error', e); }
        });
    }

    // ── Sticker Selector ──────────────────────────────────────────────────────
    let selectedSticker = '🌹';
    document.querySelectorAll('.cl-sticker-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cl-sticker-btn').forEach(b => {
                b.style.borderColor = light + '44';
                b.style.boxShadow = 'none';
            });
            btn.style.borderColor = primary;
            btn.style.boxShadow = `0 0 0 2px ${primary}33`;
            selectedSticker = btn.dataset.sticker;
        });
    });

    // ── Wish Rendering ────────────────────────────────────────────────────────
    const wishList  = document.getElementById('cl-wishes-list');
    const wishCount = document.getElementById('cl-wishes-count');

    const renderWishes = () => {
        const all = JSON.parse(localStorage.getItem(wishesKey)) || [];
        wishCount.innerText = all.length;
        if (all.length === 0) {
            wishList.innerHTML = `<p class="cl-sans text-xs text-center py-8" style="color:${textMuted}">Belum ada ucapan. Jadilah yang pertama! 🌹</p>`;
            return;
        }
        wishList.innerHTML = all.map(w => {
            const color = w.status === 'Hadir' ? '#16a34a' : w.status === 'Tidak Hadir' ? '#dc2626' : '#b45309';
            return `
                <div class="cl-wish-item relative">
                    <span class="absolute right-3 top-3 text-xl">${w.sticker || '🌹'}</span>
                    <div class="flex items-center gap-2 mb-1 pr-8">
                        <span class="cl-sans text-xs font-bold" style="color:${textDark}">${w.name}</span>
                        <span class="cl-sans text-[9px] font-semibold px-2 py-0.5 rounded-full" style="background:${color}18;color:${color}">${w.status}</span>
                    </div>
                    <p class="cl-sans text-xs leading-relaxed mb-1 pr-8" style="color:${textMuted}">${w.wish}</p>
                    <span class="cl-sans text-[9px]" style="color:${textMuted}88">${w.time || 'Baru saja'}</span>
                </div>
            `;
        }).join('');
    };
    renderWishes();

    // ── RSVP Submit ───────────────────────────────────────────────────────────
    document.getElementById('cl-rsvp-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name   = document.getElementById('cl-rsvp-name').value.trim();
        const status = document.getElementById('cl-rsvp-status').value;
        const wish   = document.getElementById('cl-rsvp-wish').value.trim();
        if (!name || !wish) return;

        const all = JSON.parse(localStorage.getItem(wishesKey)) || [];
        all.unshift({ name, status, wish, sticker: selectedSticker, time: 'Baru saja' });
        localStorage.setItem(wishesKey, JSON.stringify(all));

        document.getElementById('cl-rsvp-wish').value = '';
        renderWishes();
        wishList.scrollTop = 0;
    });
}
