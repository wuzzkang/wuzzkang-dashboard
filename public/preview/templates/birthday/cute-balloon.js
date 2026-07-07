/**
 * Cute Balloon Birthday Invitation Template
 * Cheerful balloon theme, pastel gradient, confetti animation, countdown timer.
 * Perfect for kids and fun celebrations.
 */
export async function render(pageConfig, guestName = 'Tamu Undangan') {
    const appEl = document.getElementById('app');
    const content = pageConfig.content || {};
    const celebrant = content.celebrant || {};
    const event = content.event || {};
    const gift = content.gift || {};
    const quote = content.quote || 'Dengan penuh suka cita dan rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir merayakan hari istimewa bersama kami. Kehadiran Anda adalah hadiah terbesar untuk si kecil! 🎉';

    if (!document.getElementById('cute-balloon-styles')) {
        const style = document.createElement('style');
        style.id = 'cute-balloon-styles';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@300;400;500;600;700;800;900&display=swap');

            * { -webkit-user-select: text !important; user-select: text !important; }

            .cb-title { font-family: 'Fredoka One', cursive; }
            .cb-body  { font-family: 'Nunito', sans-serif; }

            #app { background: linear-gradient(160deg, #FFF0F7 0%, #FFF9E6 40%, #F0F7FF 100%); min-height: 100%; }

            /* ── Confetti ─────────────────────────────────── */
            .confetti-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden; z-index: 0; }
            .confetti-piece {
                position: absolute; top: -20px;
                width: 10px; height: 10px;
                border-radius: 2px;
                animation: confetti-fall linear infinite;
                opacity: 0.75;
            }
            @keyframes confetti-fall {
                0%   { transform: translateY(-20px) rotate(0deg); opacity: 0.8; }
                100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
            }

            /* ── Balloons ─────────────────────────────────── */
            .balloon-float {
                animation: balloon-float 4s ease-in-out infinite alternate;
                display: inline-block;
            }
            .balloon-float-2 { animation-duration: 5.5s; animation-delay: -1.5s; }
            .balloon-float-3 { animation-duration: 3.8s; animation-delay: -2.2s; }
            @keyframes balloon-float {
                0%   { transform: translateY(0px) rotate(-3deg); }
                100% { transform: translateY(-18px) rotate(3deg); }
            }

            /* ── Age badge ────────────────────────────────── */
            .age-badge {
                animation: age-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
            }
            @keyframes age-pop {
                0%   { transform: scale(0); }
                100% { transform: scale(1); }
            }

            /* ── Photo frame ──────────────────────────────── */
            .photo-burst {
                clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
                animation: spin-slow 20s linear infinite;
            }
            @keyframes spin-slow {
                from { transform: rotate(0deg); }
                to   { transform: rotate(360deg); }
            }

            /* ── Countdown ────────────────────────────────── */
            .countdown-box {
                background: white;
                border: 2px solid rgba(255,141,161,0.3);
                border-radius: 16px;
                box-shadow: 0 4px 15px rgba(255,141,161,0.15);
            }

            /* ── Shimmer button ───────────────────────────── */
            .btn-rsvp {
                background: linear-gradient(135deg, #FF8DA1 0%, #FFB347 50%, #FF8DA1 100%);
                background-size: 200% auto;
                animation: shimmer-btn 2.5s linear infinite;
                border: none;
                cursor: pointer;
            }
            @keyframes shimmer-btn {
                0%   { background-position: 0% center; }
                100% { background-position: 200% center; }
            }

            /* ── Card hover ───────────────────────────────── */
            .cb-card {
                background: rgba(255,255,255,0.85);
                backdrop-filter: blur(10px);
                border: 1.5px solid rgba(255,141,161,0.2);
                border-radius: 24px;
                box-shadow: 0 4px 20px rgba(255,141,161,0.1);
                transition: transform 0.3s ease;
            }
            .cb-card:hover { transform: translateY(-3px); }

            /* ── Info row ─────────────────────────────────── */
            .info-row {
                display: flex; align-items: flex-start; gap: 10px;
                padding: 10px 0;
                border-bottom: 1px dashed rgba(255,141,161,0.2);
            }
            .info-row:last-child { border-bottom: none; }
            .info-icon {
                width: 34px; height: 34px; min-width: 34px;
                background: linear-gradient(135deg, #FFD6E0, #FFE8B8);
                border-radius: 10px;
                display: flex; align-items: center; justify-content: center;
                font-size: 16px;
            }
        `;
        document.head.appendChild(style);
    }

    const defaultAvatar = '/bride-avatar.jpg';

    // ── Countdown to event ────────────────────────────────────────────────────
    const eventDateStr = event.date || '';
    let countdownHTML = '';
    if (eventDateStr) {
        const eventDate = new Date(eventDateStr);
        if (!isNaN(eventDate)) {
            const now = new Date();
            const diff = eventDate - now;
            if (diff > 0) {
                const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                countdownHTML = `
                    <div style="margin: 20px 0;">
                        <div style="font-size:10px; text-transform:uppercase; letter-spacing:2px; color:#FF8DA1; font-weight:700; margin-bottom:10px; font-family:'Nunito',sans-serif;">⏰ Hitung Mundur Acara</div>
                        <div style="display:flex; gap:8px; justify-content:center;">
                            <div class="countdown-box" style="padding:10px 14px; text-align:center; min-width:56px;">
                                <div style="font-size:26px; font-weight:900; color:#FF8DA1; font-family:'Fredoka One',cursive; line-height:1;">${days}</div>
                                <div style="font-size:9px; color:#aaa; font-family:'Nunito',sans-serif; margin-top:2px;">Hari</div>
                            </div>
                            <div class="countdown-box" style="padding:10px 14px; text-align:center; min-width:56px;">
                                <div style="font-size:26px; font-weight:900; color:#FFB347; font-family:'Fredoka One',cursive; line-height:1;">${hours}</div>
                                <div style="font-size:9px; color:#aaa; font-family:'Nunito',sans-serif; margin-top:2px;">Jam</div>
                            </div>
                            <div class="countdown-box" style="padding:10px 14px; text-align:center; min-width:56px;">
                                <div style="font-size:26px; font-weight:900; color:#77DDE7; font-family:'Fredoka One',cursive; line-height:1;">${minutes}</div>
                                <div style="font-size:9px; color:#aaa; font-family:'Nunito',sans-serif; margin-top:2px;">Menit</div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                countdownHTML = `<div style="text-align:center; padding:14px; font-size:13px; color:#FF8DA1; font-family:'Fredoka One',cursive;">🎉 Acara Sedang Berlangsung!</div>`;
            }
        }
    }

    // ── Confetti pieces ───────────────────────────────────────────────────────
    const confettiColors = ['#FF8DA1','#FFD93D','#6BCB77','#4D96FF','#FF6B6B','#C77DFF'];
    let confettiPieces = '';
    for (let i = 0; i < 20; i++) {
        const color = confettiColors[i % confettiColors.length];
        const left  = Math.random() * 100;
        const dur   = 3 + Math.random() * 4;
        const delay = -Math.random() * 5;
        const size  = 6 + Math.random() * 6;
        const shape = Math.random() > 0.5 ? '50%' : '2px';
        confettiPieces += `<div class="confetti-piece" style="left:${left}%;width:${size}px;height:${size}px;background:${color};border-radius:${shape};animation-duration:${dur}s;animation-delay:${delay}s;"></div>`;
    }

    appEl.innerHTML = `
        <div class="cb-body" style="position:relative; padding:0 0 80px 0; min-height:100%;">

            <!-- Confetti -->
            <div class="confetti-container">${confettiPieces}</div>

            <!-- Hero Banner -->
            <div style="position:relative; background:linear-gradient(160deg, #FFD6E7 0%, #FFF0B3 50%, #C3F4FD 100%); padding:40px 24px 30px; text-align:center; overflow:hidden;">
                <!-- Decorative balloons -->
                <div style="position:absolute; top:10px; left:8px; font-size:48px; opacity:0.7;" class="balloon-float">🎈</div>
                <div style="position:absolute; top:5px; right:10px; font-size:40px; opacity:0.6;" class="balloon-float balloon-float-2">🎀</div>
                <div style="position:absolute; bottom:8px; left:20px; font-size:30px; opacity:0.5;" class="balloon-float balloon-float-3">🎊</div>
                <div style="position:absolute; bottom:10px; right:15px; font-size:34px; opacity:0.5;" class="balloon-float">🎁</div>

                <div style="font-size:10px; letter-spacing:3px; text-transform:uppercase; font-weight:800; color:#E8537A; margin-bottom:6px;">🎈 Kamu Diundang! 🎈</div>
                <h1 class="cb-title" style="font-size:36px; color:#D63060; margin:0 0 16px; line-height:1.2; text-shadow:2px 2px 0px rgba(255,100,100,0.15);">Pesta Ulang Tahun</h1>
                <div style="display:inline-block; position:relative;">
                    <div style="font-size:17px; font-weight:800; color:#5B3680; font-family:'Nunito',sans-serif;">${celebrant.nickname || celebrant.name?.split(' ')[0] || 'Si Kecil'}</div>
                    <!-- Age badge -->
                    <div class="age-badge" style="position:absolute; top:-18px; left:calc(100% + 6px); width:54px; height:54px; background:linear-gradient(135deg,#FF6B6B,#FFD93D); border-radius:50%; border:3px solid white; box-shadow:0 4px 12px rgba(255,107,107,0.4); display:flex; flex-direction:column; align-items:center; justify-content:center;">
                        <div class="cb-title" style="font-size:20px; color:white; line-height:1;">${celebrant.age || '?'}</div>
                        <div style="font-size:7px; color:rgba(255,255,255,0.9); font-weight:700; font-family:'Nunito',sans-serif;">TAHUN</div>
                    </div>
                </div>

                <!-- Guest name pill -->
                <div style="margin-top:18px;">
                    <div style="font-size:9px; color:#999; margin-bottom:6px; font-family:'Nunito',sans-serif;">Spesial untuk:</div>
                    <div style="display:inline-block; background:white; border:2px solid #FFD6E7; border-radius:50px; padding:6px 20px; box-shadow:0 2px 10px rgba(255,141,161,0.2);">
                        <span style="font-weight:800; font-size:13px; color:#D63060; font-family:'Nunito',sans-serif;">👤 ${guestName}</span>
                    </div>
                </div>
            </div>

            <!-- Content area -->
            <div style="padding:20px 18px; position:relative; z-index:1;">

                <!-- Photo & Name -->
                <div style="text-align:center; margin:20px 0 24px;">
                    <div style="position:relative; display:inline-block;">
                        <div style="width:110px; height:110px; border-radius:50%; overflow:hidden; border:5px solid white; box-shadow:0 8px 30px rgba(255,141,161,0.35); display:inline-block; position:relative; z-index:2;">
                            <img src="${celebrant.image_url || defaultAvatar}" style="width:100%; height:100%; object-fit:cover;" alt="Celebrant"/>
                        </div>
                        <!-- Star decorations around photo -->
                        <div style="position:absolute; top:-6px; right:-6px; font-size:20px; animation:balloon-float 3s ease-in-out infinite alternate;">⭐</div>
                        <div style="position:absolute; bottom:-6px; left:-4px; font-size:16px; animation:balloon-float 4s ease-in-out infinite alternate; animation-delay:-1s;">✨</div>
                    </div>
                    <div style="margin-top:12px;">
                        <h2 class="cb-title" style="font-size:24px; color:#D63060; margin:0;">${celebrant.name || 'Nama Celebrant'}</h2>
                        ${celebrant.parent_name ? `<p style="font-size:11px; color:#999; margin:4px 0 0; font-family:'Nunito',sans-serif;">Putra/Putri tercinta dari:<br/><span style="font-weight:700; color:#5B3680;">${celebrant.parent_name}</span></p>` : ''}
                    </div>
                </div>

                <!-- Quote card -->
                <div class="cb-card" style="padding:16px 18px; margin:0 0 20px; text-align:center;">
                    <div style="font-size:22px; margin-bottom:6px;">💌</div>
                    <p style="font-size:12px; line-height:1.7; color:#666; font-style:italic; margin:0; font-family:'Nunito',sans-serif;">"${quote}"</p>
                </div>

                <!-- Countdown -->
                ${countdownHTML}

                <!-- Event Details -->
                <div class="cb-card" style="padding:18px; margin:0 0 16px;">
                    <div class="cb-title" style="font-size:16px; color:#D63060; margin-bottom:14px; display:flex; align-items:center; gap:6px;">
                        🎉 Detail Acara
                    </div>
                    <div class="info-row">
                        <div class="info-icon">📅</div>
                        <div>
                            <div style="font-size:9px; color:#bbb; text-transform:uppercase; letter-spacing:1px; font-family:'Nunito',sans-serif; font-weight:700;">Tanggal</div>
                            <div style="font-size:13px; font-weight:800; color:#333; font-family:'Nunito',sans-serif;">${event.date || 'TBA'}</div>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-icon">⏰</div>
                        <div>
                            <div style="font-size:9px; color:#bbb; text-transform:uppercase; letter-spacing:1px; font-family:'Nunito',sans-serif; font-weight:700;">Waktu</div>
                            <div style="font-size:13px; font-weight:800; color:#333; font-family:'Nunito',sans-serif;">${event.time || 'TBA'}</div>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-icon">📍</div>
                        <div>
                            <div style="font-size:9px; color:#bbb; text-transform:uppercase; letter-spacing:1px; font-family:'Nunito',sans-serif; font-weight:700;">Lokasi</div>
                            <div style="font-size:13px; font-weight:800; color:#333; font-family:'Nunito',sans-serif;">${event.location || 'TBA'}</div>
                        </div>
                    </div>
                    ${event.maps_url ? `
                        <a href="${event.maps_url}" target="_blank" style="display:block; margin-top:14px; padding:10px; background:linear-gradient(135deg,#FF8DA1,#FFB347); border-radius:14px; color:white; text-align:center; font-size:12px; font-weight:800; text-decoration:none; font-family:'Fredoka One',cursive; letter-spacing:0.5px;">
                            📍 Lihat Peta Lokasi
                        </a>
                    ` : ''}
                </div>

                ${(gift.bank_name || gift.account_number) ? `
                    <div class="cb-card" style="padding:18px; margin:0 0 16px;">
                        <div class="cb-title" style="font-size:16px; color:#D63060; margin-bottom:12px;">🎁 Kado Digital</div>
                        <p style="font-size:11px; color:#999; margin:0 0 12px; font-family:'Nunito',sans-serif; line-height:1.6;">Kehadiran Bapak/Ibu adalah hadiah terbaik. Namun bila ingin memberikan kado digital, bisa melalui:</p>
                        <div style="background:linear-gradient(135deg,#FFF0F7,#FFF9E6); border:1.5px solid rgba(255,141,161,0.25); border-radius:16px; padding:14px; text-align:center;">
                            <div style="font-size:11px; font-weight:700; color:#555; font-family:'Nunito',sans-serif;">${gift.bank_name || 'Bank'}</div>
                            <div style="font-size:18px; font-weight:900; color:#D63060; font-family:'Fredoka One',cursive; margin:4px 0;">${gift.account_number || '000-000'}</div>
                            <div style="font-size:10px; color:#aaa; font-family:'Nunito',sans-serif;">a.n. ${gift.account_holder || '-'}</div>
                        </div>
                    </div>
                ` : ''}

                <!-- Footer -->
                <div style="text-align:center; margin-top:24px; padding-top:16px; border-top: 1px dashed rgba(255,141,161,0.3);">
                    <div style="font-size:24px; margin-bottom:6px;">🎂🎈🎉</div>
                    <div style="font-size:9px; color:#ccc; letter-spacing:1px; font-family:'Nunito',sans-serif;">Siluet Birthday Template • Cute Balloon</div>
                </div>
            </div>
        </div>
    `;
}
