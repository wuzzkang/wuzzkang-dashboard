/**
 * Elegant Gold Birthday Invitation Template
 * Luxury dark-gold theme, sparkle particles, Roman numeral age, countdown timer.
 * Perfect for adult/teens milestone celebrations.
 */
export async function render(pageConfig, guestName = 'Tamu Undangan') {
    const appEl = document.getElementById('app');
    const content = pageConfig.content || {};
    const celebrant = content.celebrant || {};
    const event = content.event || {};
    const gift = content.gift || {};
    const quote = content.quote || 'As we celebrate this milestone, every year lived is a story worth telling. We humbly request the honor of your presence to share in this joyous celebration.';

    if (!document.getElementById('elegant-gold-styles')) {
        const style = document.createElement('style');
        style.id = 'elegant-gold-styles';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Poppins:wght@300;400;500;600&display=swap');

            * { -webkit-user-select: text !important; user-select: text !important; }

            .eg-serif  { font-family: 'Playfair Display', serif; }
            .eg-italic { font-family: 'Cormorant Garamond', serif; }
            .eg-sans   { font-family: 'Poppins', sans-serif; }

            #app { background: #0a0a0a; min-height: 100%; }

            /* ── Stars / sparkle particles ───────────────── */
            .star-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; overflow: hidden; }
            .star {
                position: absolute;
                background: #D4AF37;
                border-radius: 50%;
                animation: star-twinkle ease-in-out infinite alternate;
            }
            @keyframes star-twinkle {
                0%   { opacity: 0.1; transform: scale(0.8); }
                100% { opacity: 0.9; transform: scale(1.3); }
            }

            /* ── Shimmer gold text ────────────────────────── */
            .gold-shimmer {
                background: linear-gradient(90deg, #B8860B 0%, #FFD700 30%, #F5DE7A 50%, #FFD700 70%, #B8860B 100%);
                background-size: 300% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: gold-flow 4s linear infinite;
            }
            @keyframes gold-flow {
                0%   { background-position: 0% center; }
                100% { background-position: 300% center; }
            }

            /* ── Ornament lines ───────────────────────────── */
            .ornament-line {
                display: flex; align-items: center; gap: 10px; margin: 12px 0;
            }
            .ornament-line::before, .ornament-line::after {
                content: '';
                flex: 1;
                height: 1px;
                background: linear-gradient(90deg, transparent, #D4AF37, transparent);
            }
            .ornament-line span { color: #D4AF37; font-size: 14px; }

            /* ── Photo frame ──────────────────────────────── */
            .gold-ring-outer {
                width: 124px; height: 124px;
                border-radius: 50%;
                background: conic-gradient(from 0deg, #B8860B, #FFD700, #F5DE7A, #FFD700, #B8860B, #FFD700, #B8860B);
                padding: 3px;
                animation: ring-spin 8s linear infinite;
                box-shadow: 0 0 30px rgba(212,175,55,0.4);
            }
            @keyframes ring-spin {
                from { transform: rotate(0deg); }
                to   { transform: rotate(360deg); }
            }
            .gold-ring-inner {
                width: 100%; height: 100%;
                border-radius: 50%;
                border: 3px solid #0a0a0a;
                overflow: hidden;
                animation: ring-spin 8s linear infinite reverse;
            }
            .gold-ring-inner img { width: 100%; height: 100%; object-fit: cover; }

            /* ── Countdown ────────────────────────────────── */
            .eg-countdown-box {
                background: #161616;
                border: 1px solid rgba(212,175,55,0.3);
                border-radius: 12px;
                padding: 12px 16px;
                text-align: center;
                min-width: 60px;
                position: relative;
                overflow: hidden;
            }
            .eg-countdown-box::before {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(180deg, rgba(212,175,55,0.05) 0%, transparent 100%);
            }

            /* ── Cards ────────────────────────────────────── */
            .eg-card {
                background: #141414;
                border: 1px solid rgba(212,175,55,0.2);
                border-radius: 20px;
                overflow: hidden;
                position: relative;
            }
            .eg-card::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0;
                height: 1px;
                background: linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent);
            }

            /* ── Info row ─────────────────────────────────── */
            .eg-info-row {
                display: flex;
                align-items: flex-start;
                gap: 14px;
                padding: 13px 0;
                border-bottom: 1px solid rgba(212,175,55,0.1);
            }
            .eg-info-row:last-child { border-bottom: none; }
            .eg-info-icon {
                width: 36px; height: 36px; min-width: 36px;
                border: 1px solid rgba(212,175,55,0.3);
                border-radius: 10px;
                display: flex; align-items: center; justify-content: center;
                font-size: 16px;
                background: rgba(212,175,55,0.05);
            }

            /* ── Glow pulse ───────────────────────────────── */
            .glow-pulse {
                animation: glow-pulse 3s ease-in-out infinite;
            }
            @keyframes glow-pulse {
                0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.2); }
                50%       { box-shadow: 0 0 40px rgba(212,175,55,0.5); }
            }
        `;
        document.head.appendChild(style);
    }

    const defaultAvatar = '/groom-avatar.jpg';

    // ── Roman numeral helper ──────────────────────────────────────────────────
    function toRoman(num) {
        const val = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
        const sym = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
        let result = '';
        for (let i = 0; i < val.length; i++) {
            while (num >= val[i]) { result += sym[i]; num -= val[i]; }
        }
        return result;
    }
    const ageNum = parseInt(celebrant.age) || 0;
    const ageRoman = ageNum > 0 ? toRoman(ageNum) : '';

    // ── Countdown ─────────────────────────────────────────────────────────────
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
                    <div style="margin: 24px 0;">
                        <div class="ornament-line"><span>◆</span></div>
                        <div style="font-size:9px; text-transform:uppercase; letter-spacing:3px; color:#D4AF37; opacity:0.7; text-align:center; margin-bottom:12px; font-family:'Poppins',sans-serif;">Menuju Hari Istimewa</div>
                        <div style="display:flex; gap:8px; justify-content:center;">
                            <div class="eg-countdown-box">
                                <div class="eg-serif gold-shimmer" style="font-size:28px; font-weight:700; line-height:1;">${days}</div>
                                <div style="font-size:8px; color:#666; margin-top:4px; letter-spacing:2px; text-transform:uppercase; font-family:'Poppins',sans-serif;">Days</div>
                            </div>
                            <div class="eg-countdown-box">
                                <div class="eg-serif gold-shimmer" style="font-size:28px; font-weight:700; line-height:1;">${hours}</div>
                                <div style="font-size:8px; color:#666; margin-top:4px; letter-spacing:2px; text-transform:uppercase; font-family:'Poppins',sans-serif;">Hours</div>
                            </div>
                            <div class="eg-countdown-box">
                                <div class="eg-serif gold-shimmer" style="font-size:28px; font-weight:700; line-height:1;">${minutes}</div>
                                <div style="font-size:8px; color:#666; margin-top:4px; letter-spacing:2px; text-transform:uppercase; font-family:'Poppins',sans-serif;">Min</div>
                            </div>
                        </div>
                        <div class="ornament-line" style="margin-top:20px;"><span>◆</span></div>
                    </div>
                `;
            } else {
                countdownHTML = `<div style="text-align:center; padding:14px;" class="gold-shimmer eg-serif" style="font-size:14px;">✦ The Celebration Has Begun ✦</div>`;
            }
        }
    }

    // ── Stars ─────────────────────────────────────────────────────────────────
    let starsHTML = '';
    for (let i = 0; i < 30; i++) {
        const size  = 1 + Math.random() * 2.5;
        const left  = Math.random() * 100;
        const top   = Math.random() * 100;
        const dur   = 2 + Math.random() * 3;
        const delay = -Math.random() * 3;
        starsHTML += `<div class="star" style="width:${size}px;height:${size}px;left:${left}%;top:${top}%;animation-duration:${dur}s;animation-delay:${delay}s;"></div>`;
    }

    appEl.innerHTML = `
        <div class="eg-sans" style="position:relative; min-height:100%; background:#0a0a0a; color:#e0e0e0; padding:0 0 80px;">

            <!-- Stars -->
            <div class="star-container">${starsHTML}</div>

            <!-- Hero Section -->
            <div style="position:relative; text-align:center; padding:48px 24px 36px; border-bottom:1px solid rgba(212,175,55,0.12); z-index:1;">
                <!-- Top ornament -->
                <div style="display:flex; align-items:center; justify-content:center; gap:12px; margin-bottom:20px;">
                    <div style="height:1px; width:40px; background:linear-gradient(90deg,transparent,#D4AF37);"></div>
                    <span style="color:#D4AF37; font-size:12px;">✦</span>
                    <div style="height:1px; width:40px; background:linear-gradient(90deg,#D4AF37,transparent);"></div>
                </div>

                <div style="font-size:9px; letter-spacing:5px; text-transform:uppercase; color:#D4AF37; opacity:0.7; margin-bottom:12px; font-family:'Poppins',sans-serif;">— You Are Cordially Invited —</div>
                <h1 class="eg-serif gold-shimmer" style="font-size:34px; font-weight:700; margin:0 0 8px; line-height:1.2;">The Birthday</h1>
                <h2 class="eg-serif gold-shimmer" style="font-size:22px; font-weight:400; margin:0; font-style:italic; opacity:0.9;">Celebration</h2>

                ${ageRoman ? `
                <div style="margin:20px 0;">
                    <span class="eg-serif" style="font-size:42px; font-weight:900; color:#D4AF37; text-shadow:0 0 30px rgba(212,175,55,0.5); letter-spacing:6px; line-height:1;">${ageRoman}</span>
                    <div style="font-size:9px; color:#D4AF37; opacity:0.6; letter-spacing:3px; text-transform:uppercase; font-family:'Poppins',sans-serif; margin-top:4px;">The ${ageNum}${ageNum===1?'st':ageNum===2?'nd':ageNum===3?'rd':'th'} Anniversary of Life</div>
                </div>
                ` : ''}

                <!-- Guest name -->
                <div style="margin-top:18px;">
                    <div style="font-size:9px; color:#666; letter-spacing:2px; text-transform:uppercase; margin-bottom:8px; font-family:'Poppins',sans-serif;">Dear Esteemed Guest</div>
                    <div style="display:inline-block; border:1px solid rgba(212,175,55,0.35); border-radius:4px; padding:8px 22px; background:rgba(212,175,55,0.04);">
                        <span class="eg-serif" style="font-size:14px; color:#D4AF37; font-style:italic;">${guestName}</span>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div style="padding:24px 18px; position:relative; z-index:1;">

                <!-- Photo & Name -->
                <div style="text-align:center; margin: 20px 0 28px;">
                    <div class="glow-pulse" style="display:inline-block; position:relative;">
                        <div class="gold-ring-outer">
                            <div class="gold-ring-inner">
                                <img src="${celebrant.image_url || defaultAvatar}" alt="Celebrant"/>
                            </div>
                        </div>
                        <!-- Crown decoration -->
                        <div style="position:absolute; top:-18px; left:50%; transform:translateX(-50%); font-size:22px; filter:drop-shadow(0 0 8px rgba(212,175,55,0.8));">👑</div>
                    </div>
                    <div style="margin-top:18px;">
                        <h2 class="eg-serif" style="font-size:26px; color:#f0f0f0; font-weight:700; margin:0;">${celebrant.name || 'Celebrant Name'}</h2>
                        ${celebrant.parent_name ? `<p style="font-size:11px; color:#555; margin:6px 0 0; font-family:'Poppins',sans-serif;">Born of: <span style="color:#D4AF37; font-style:italic;">${celebrant.parent_name}</span></p>` : ''}
                    </div>
                </div>

                <!-- Quote -->
                <div class="eg-card" style="padding:20px; margin:0 0 20px; text-align:center;">
                    <div class="ornament-line"><span>✦</span></div>
                    <p class="eg-italic" style="font-size:15px; line-height:1.8; color:#aaa; font-style:italic; margin:8px 0;">
                        &ldquo;${quote}&rdquo;
                    </p>
                    <div class="ornament-line"><span>✦</span></div>
                </div>

                <!-- Countdown -->
                ${countdownHTML}

                <!-- Event Details -->
                <div class="eg-card" style="padding:20px; margin:0 0 16px;">
                    <div class="eg-serif" style="font-size:12px; letter-spacing:3px; text-transform:uppercase; color:#D4AF37; margin-bottom:16px; text-align:center; opacity:0.9;">✦ Event Details ✦</div>
                    <div class="eg-info-row">
                        <div class="eg-info-icon">📅</div>
                        <div>
                            <div style="font-size:8px; color:#555; text-transform:uppercase; letter-spacing:2px; font-family:'Poppins',sans-serif; margin-bottom:2px;">Date</div>
                            <div style="font-size:14px; color:#e0e0e0; font-weight:500; font-family:'Poppins',sans-serif;">${event.date || 'To Be Announced'}</div>
                        </div>
                    </div>
                    <div class="eg-info-row">
                        <div class="eg-info-icon">🕰️</div>
                        <div>
                            <div style="font-size:8px; color:#555; text-transform:uppercase; letter-spacing:2px; font-family:'Poppins',sans-serif; margin-bottom:2px;">Time</div>
                            <div style="font-size:14px; color:#e0e0e0; font-weight:500; font-family:'Poppins',sans-serif;">${event.time || 'To Be Announced'}</div>
                        </div>
                    </div>
                    <div class="eg-info-row">
                        <div class="eg-info-icon">🏛️</div>
                        <div>
                            <div style="font-size:8px; color:#555; text-transform:uppercase; letter-spacing:2px; font-family:'Poppins',sans-serif; margin-bottom:2px;">Venue</div>
                            <div style="font-size:14px; color:#e0e0e0; font-weight:500; font-family:'Poppins',sans-serif;">${event.location || 'To Be Announced'}</div>
                        </div>
                    </div>
                    ${event.maps_url ? `
                        <a href="${event.maps_url}" target="_blank" style="display:block; margin-top:16px; padding:11px; border:1px solid rgba(212,175,55,0.4); border-radius:10px; color:#D4AF37; text-align:center; font-size:11px; font-weight:600; text-decoration:none; letter-spacing:2px; text-transform:uppercase; font-family:'Poppins',sans-serif; background:rgba(212,175,55,0.04); transition:background 0.3s;">
                            ◈ View Venue Map
                        </a>
                    ` : ''}
                </div>

                ${(gift.bank_name || gift.account_number) ? `
                    <div class="eg-card" style="padding:20px; margin:0 0 16px;">
                        <div class="eg-serif" style="font-size:12px; letter-spacing:3px; text-transform:uppercase; color:#D4AF37; margin-bottom:12px; text-align:center; opacity:0.9;">✦ Birthday Gift ✦</div>
                        <p style="font-size:11px; color:#555; text-align:center; margin:0 0 14px; line-height:1.7; font-family:'Poppins',sans-serif;">Your presence is our greatest gift. For those who wish to share birthday blessings:</p>
                        <div style="background:#0f0f0f; border:1px solid rgba(212,175,55,0.2); border-radius:12px; padding:16px; text-align:center;">
                            <div style="font-size:11px; color:#888; font-family:'Poppins',sans-serif; margin-bottom:4px;">${gift.bank_name || 'Bank'}</div>
                            <div class="eg-serif gold-shimmer" style="font-size:22px; font-weight:700; margin:4px 0;">${gift.account_number || '000-000'}</div>
                            <div style="font-size:10px; color:#555; font-family:'Poppins',sans-serif;">a.n. ${gift.account_holder || '-'}</div>
                        </div>
                    </div>
                ` : ''}

                <!-- Footer -->
                <div style="text-align:center; margin-top:28px; padding-top:20px; border-top:1px solid rgba(212,175,55,0.1);">
                    <div style="display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:8px;">
                        <div style="height:1px; width:30px; background:linear-gradient(90deg,transparent,#D4AF37);"></div>
                        <span style="color:#D4AF37; font-size:12px;">✦ ✦ ✦</span>
                        <div style="height:1px; width:30px; background:linear-gradient(90deg,#D4AF37,transparent);"></div>
                    </div>
                    <div style="font-size:9px; color:#333; letter-spacing:2px; text-transform:uppercase; font-family:'Poppins',sans-serif;">Siluet Birthday Template • Elegant Gold</div>
                </div>
            </div>
        </div>
    `;
}
