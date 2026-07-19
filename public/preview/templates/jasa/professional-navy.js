/**
 * Professional Navy Template for Jasa (Service) Landing Page - Version 1
 * Dark navy theme with orange accent. Covers: Hero, How It Works, About,
 * Services, Why Us, Stats, Deliverables, Pricing, Guarantee, Testimonials,
 * FAQ, Bottom CTA, and Footer.
 */
export async function render(pageConfig, guestName = 'Tamu', brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const appEl = document.getElementById('app');
    const content = pageConfig.content || {};
    const brand = content.brand || {};
    const hero = content.hero || {};
    const socialProof = content.social_proof || {};
    const howItWorks = content.how_it_works || {};
    const about = content.about || {};
    const services = content.services || {};
    const whyUs = content.why_us || {};
    const deliverables = content.deliverables || {};
    const pricing = content.pricing || {};
    const guarantee = content.guarantee || {};
    const testimonials = content.testimonials || {};
    const faqs = content.faqs || [];
    const closingCta = content.closing_cta || {};
    const contact = content.contact || {};

    // Inject Stylesheet
    if (!document.getElementById('professional-navy-styles')) {
        const style = document.createElement('style');
        style.id = 'professional-navy-styles';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

            #app {
                font-family: 'Inter', sans-serif;
                background-color: #ffffff;
                color: #1a202c;
                min-height: 100vh;
            }

            /* ── Color Tokens ───────────────────────────── */
            .jasa-navy       { background-color: #0f2e4c; }
            .jasa-navy-dark  { background-color: #0a1f35; }
            .jasa-navy-mid   { background-color: #163654; }
            .jasa-orange     { background-color: #f97316; }
            .jasa-orange-text{ color: #f97316; }
            .jasa-white-text { color: #ffffff; }
            .jasa-navy-text  { color: #0f2e4c; }

            /* ── Buttons ────────────────────────────────── */
            .btn-orange {
                display: inline-block;
                background-color: #f97316;
                color: #ffffff;
                font-weight: 700;
                padding: 0.85rem 2rem;
                border-radius: 0.5rem;
                text-decoration: none;
                transition: all 0.25s ease;
                border: 2px solid #f97316;
                cursor: pointer;
                font-size: 0.9rem;
                letter-spacing: 0.02em;
            }
            .btn-orange:hover {
                background-color: #ea6c0a;
                border-color: #ea6c0a;
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(249,115,22,0.35);
            }

            .btn-outline-white {
                display: inline-block;
                background-color: transparent;
                color: #ffffff;
                font-weight: 700;
                padding: 0.85rem 2rem;
                border-radius: 0.5rem;
                text-decoration: none;
                transition: all 0.25s ease;
                border: 2px solid rgba(255,255,255,0.6);
                cursor: pointer;
                font-size: 0.9rem;
                letter-spacing: 0.02em;
            }
            .btn-outline-white:hover {
                background-color: rgba(255,255,255,0.1);
                border-color: #ffffff;
                transform: translateY(-2px);
            }

            .btn-outline-navy {
                display: inline-block;
                background-color: transparent;
                color: #0f2e4c;
                font-weight: 700;
                padding: 0.85rem 2rem;
                border-radius: 0.5rem;
                text-decoration: none;
                transition: all 0.25s ease;
                border: 2px solid #0f2e4c;
                cursor: pointer;
                font-size: 0.9rem;
                letter-spacing: 0.02em;
            }
            .btn-outline-navy:hover {
                background-color: #0f2e4c;
                color: #ffffff;
                transform: translateY(-2px);
            }

            /* ── Section utility ───────────────────────── */
            .jasa-section {
                padding: 4.5rem 1.5rem;
            }
            .jasa-container {
                max-width: 1100px;
                margin: 0 auto;
            }
            .jasa-section-title {
                font-size: 1.85rem;
                font-weight: 800;
                line-height: 1.25;
                color: #0f2e4c;
                margin-bottom: 0.6rem;
            }
            .jasa-section-sub {
                font-size: 0.95rem;
                color: #5a6a7e;
                margin-bottom: 2.5rem;
            }
            .jasa-divider {
                width: 3rem;
                height: 4px;
                background-color: #f97316;
                border-radius: 2px;
                margin-bottom: 1.5rem;
            }

            /* ── Navbar ────────────────────────────────── */
            .jasa-nav {
                position: sticky;
                top: 0;
                z-index: 50;
                background-color: #0f2e4c;
                padding: 1rem 1.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .jasa-nav-brand {
                font-size: 1.2rem;
                font-weight: 800;
                color: #ffffff;
                letter-spacing: 0.04em;
                text-transform: uppercase;
                display: flex;
                align-items: center;
                gap: 0.6rem;
            }
            .jasa-nav-logo-box {
                width: 34px; height: 34px;
                background-color: #f97316;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                font-weight: 900;
                color: #fff;
                flex-shrink: 0;
            }

            /* ── Hero ──────────────────────────────────── */
            .jasa-hero {
                background: linear-gradient(135deg, #0a1f35 0%, #163654 60%, #0f2e4c 100%);
                padding: 5rem 1.5rem;
                position: relative;
                overflow: hidden;
            }
            .jasa-hero::before {
                content: '';
                position: absolute;
                width: 600px; height: 600px;
                background: radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%);
                top: -150px; right: -100px;
                pointer-events: none;
            }
            .jasa-hero::after {
                content: '';
                position: absolute;
                width: 400px; height: 400px;
                background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
                bottom: -80px; left: -80px;
                pointer-events: none;
            }
            .jasa-hero-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.4rem;
                background-color: rgba(249,115,22,0.15);
                border: 1px solid rgba(249,115,22,0.35);
                color: #f97316;
                font-size: 0.78rem;
                font-weight: 700;
                padding: 0.35rem 0.9rem;
                border-radius: 99px;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                margin-bottom: 1.5rem;
            }
            .jasa-hero-headline {
                font-size: clamp(1.9rem, 4.5vw, 3.2rem);
                font-weight: 900;
                color: #ffffff;
                line-height: 1.15;
                margin-bottom: 1.25rem;
                letter-spacing: -0.02em;
            }
            .jasa-hero-headline span {
                color: #f97316;
            }
            .jasa-hero-sub {
                font-size: 1.05rem;
                color: rgba(255,255,255,0.75);
                line-height: 1.65;
                max-width: 560px;
                margin-bottom: 2.2rem;
            }
            .jasa-hero-ctas {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                margin-bottom: 2.5rem;
            }
            .jasa-social-bar {
                display: flex;
                flex-wrap: wrap;
                gap: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid rgba(255,255,255,0.12);
            }
            .jasa-social-bar-item {
                text-align: center;
            }
            .jasa-social-bar-number {
                font-size: 1.5rem;
                font-weight: 800;
                color: #f97316;
                line-height: 1;
            }
            .jasa-social-bar-label {
                font-size: 0.72rem;
                color: rgba(255,255,255,0.55);
                text-transform: uppercase;
                letter-spacing: 0.06em;
                margin-top: 0.2rem;
            }
            .jasa-hero-image-wrap {
                display: flex;
                justify-content: flex-end;
                align-items: center;
            }
            .jasa-hero-image-wrap img {
                width: 100%;
                max-width: 460px;
                border-radius: 1.2rem;
                border: 3px solid rgba(249,115,22,0.3);
                box-shadow: 0 32px 80px rgba(0,0,0,0.45);
                object-fit: cover;
                aspect-ratio: 4/3;
            }

            /* ── How It Works ──────────────────────────── */
            .jasa-step-card {
                background: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 1rem;
                padding: 2rem 1.5rem;
                position: relative;
                text-align: center;
                transition: box-shadow 0.25s, transform 0.25s;
            }
            .jasa-step-card:hover {
                box-shadow: 0 12px 36px rgba(15,46,76,0.1);
                transform: translateY(-4px);
            }
            .jasa-step-number {
                width: 48px; height: 48px;
                border-radius: 50%;
                background: #f97316;
                color: #fff;
                font-size: 1.1rem;
                font-weight: 800;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1rem;
            }
            .jasa-step-title {
                font-size: 1rem;
                font-weight: 700;
                color: #0f2e4c;
                margin-bottom: 0.5rem;
            }
            .jasa-step-desc {
                font-size: 0.85rem;
                color: #5a6a7e;
                line-height: 1.6;
            }

            /* ── About ─────────────────────────────────── */
            .jasa-about-image {
                width: 100%;
                border-radius: 1.2rem;
                object-fit: cover;
                aspect-ratio: 4/3;
                border: 3px solid rgba(249,115,22,0.2);
                box-shadow: 0 24px 60px rgba(15,46,76,0.14);
            }

            /* ── Services ──────────────────────────────── */
            .jasa-service-card {
                background: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 1rem;
                overflow: hidden;
                transition: box-shadow 0.25s, transform 0.25s;
            }
            .jasa-service-card:hover {
                box-shadow: 0 16px 48px rgba(15,46,76,0.12);
                transform: translateY(-4px);
            }
            .jasa-service-card-img {
                width: 100%;
                height: 200px;
                object-fit: cover;
            }
            .jasa-service-card-body {
                padding: 1.5rem;
            }
            .jasa-service-name {
                font-size: 1.1rem;
                font-weight: 700;
                color: #0f2e4c;
                margin-bottom: 0.5rem;
            }
            .jasa-service-desc {
                font-size: 0.85rem;
                color: #5a6a7e;
                line-height: 1.6;
                margin-bottom: 1rem;
            }
            .jasa-service-feature {
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;
                font-size: 0.82rem;
                color: #2d3748;
                margin-bottom: 0.3rem;
            }
            .jasa-check-icon {
                color: #f97316;
                font-size: 0.85rem;
                margin-top: 1px;
                flex-shrink: 0;
            }

            /* ── Why Us ────────────────────────────────── */
            .jasa-whyus-item {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                padding: 1.25rem;
                border: 1px solid #e2e8f0;
                border-radius: 0.75rem;
                background: #fff;
                transition: border-color 0.2s, box-shadow 0.2s;
            }
            .jasa-whyus-item:hover {
                border-color: #f97316;
                box-shadow: 0 4px 16px rgba(249,115,22,0.1);
            }
            .jasa-whyus-icon {
                width: 40px; height: 40px;
                border-radius: 0.5rem;
                background: #fff3e8;
                color: #f97316;
                font-size: 1.15rem;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            .jasa-whyus-title {
                font-size: 0.95rem;
                font-weight: 700;
                color: #0f2e4c;
                margin-bottom: 0.25rem;
            }
            .jasa-whyus-desc {
                font-size: 0.82rem;
                color: #5a6a7e;
                line-height: 1.55;
            }

            /* ── Stats ─────────────────────────────────── */
            .jasa-stats-section {
                background: linear-gradient(135deg, #0f2e4c 0%, #163654 100%);
            }
            .jasa-stat-item {
                text-align: center;
                padding: 1.5rem;
            }
            .jasa-stat-number {
                font-size: 2.5rem;
                font-weight: 900;
                color: #f97316;
                line-height: 1;
            }
            .jasa-stat-label {
                font-size: 0.8rem;
                color: rgba(255,255,255,0.6);
                text-transform: uppercase;
                letter-spacing: 0.07em;
                margin-top: 0.4rem;
            }

            /* ── Deliverables ──────────────────────────── */
            .jasa-deliver-card {
                background: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 1rem;
                padding: 1.75rem 1.5rem;
                text-align: center;
                transition: border-color 0.2s, box-shadow 0.2s;
            }
            .jasa-deliver-card:hover {
                border-color: #f97316;
                box-shadow: 0 8px 24px rgba(249,115,22,0.1);
            }
            .jasa-deliver-icon {
                font-size: 2rem;
                margin-bottom: 0.75rem;
            }
            .jasa-deliver-title {
                font-size: 1rem;
                font-weight: 700;
                color: #0f2e4c;
                margin-bottom: 0.4rem;
            }
            .jasa-deliver-desc {
                font-size: 0.82rem;
                color: #5a6a7e;
                line-height: 1.6;
            }

            /* ── Pricing ───────────────────────────────── */
            .jasa-plan-card {
                background: #fff;
                border: 2px solid #e2e8f0;
                border-radius: 1.2rem;
                padding: 2rem 1.5rem;
                position: relative;
                display: flex;
                flex-direction: column;
                transition: all 0.25s;
            }
            .jasa-plan-card.highlighted {
                border-color: #f97316;
                box-shadow: 0 20px 60px rgba(249,115,22,0.2);
                transform: scale(1.03);
            }
            .jasa-plan-badge {
                position: absolute;
                top: -14px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #f97316;
                color: #fff;
                font-size: 0.7rem;
                font-weight: 800;
                padding: 0.3rem 1rem;
                border-radius: 99px;
                letter-spacing: 0.07em;
                text-transform: uppercase;
                white-space: nowrap;
            }
            .jasa-plan-name {
                font-size: 0.85rem;
                font-weight: 700;
                color: #5a6a7e;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                margin-bottom: 0.5rem;
            }
            .jasa-plan-price {
                font-size: 2rem;
                font-weight: 900;
                color: #0f2e4c;
                line-height: 1;
            }
            .jasa-plan-original {
                font-size: 0.85rem;
                color: #a0aec0;
                text-decoration: line-through;
                margin-left: 0.4rem;
                font-weight: 500;
            }
            .jasa-plan-features {
                list-style: none;
                padding: 0;
                margin: 1.25rem 0 1.5rem;
                flex-grow: 1;
            }
            .jasa-plan-features li {
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;
                font-size: 0.83rem;
                color: #2d3748;
                padding: 0.3rem 0;
                border-bottom: 1px solid #f7fafc;
            }
            .jasa-plan-features li:last-child { border-bottom: none; }

            /* ── Guarantee ─────────────────────────────── */
            .jasa-guarantee-section {
                background: #f7f9ff;
            }
            .jasa-guarantee-box {
                background: #fff;
                border: 2px solid rgba(249,115,22,0.25);
                border-radius: 1.5rem;
                padding: 3rem 2rem;
                text-align: center;
                max-width: 700px;
                margin: 0 auto;
            }

            /* ── Testimonials ──────────────────────────── */
            .jasa-testi-card {
                background: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 1rem;
                padding: 1.5rem;
                position: relative;
            }
            .jasa-testi-card::before {
                content: '"';
                position: absolute;
                top: 1rem;
                left: 1.25rem;
                font-size: 3rem;
                color: rgba(249,115,22,0.15);
                font-family: Georgia, serif;
                line-height: 1;
            }
            .jasa-testi-text {
                font-size: 0.85rem;
                color: #4a5568;
                line-height: 1.7;
                font-style: italic;
                margin-bottom: 1rem;
                padding-top: 1rem;
                position: relative;
                z-index: 1;
            }
            .jasa-testi-avatar {
                width: 38px; height: 38px;
                border-radius: 50%;
                object-fit: cover;
                background: linear-gradient(135deg, #0f2e4c, #f97316);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-weight: 700;
                font-size: 0.9rem;
                flex-shrink: 0;
            }
            .jasa-testi-name {
                font-size: 0.85rem;
                font-weight: 700;
                color: #0f2e4c;
            }
            .jasa-testi-role {
                font-size: 0.73rem;
                color: #a0aec0;
            }

            /* ── FAQ Accordion ─────────────────────────── */
            .jasa-faq-item {
                border: 1px solid #e2e8f0;
                border-radius: 0.75rem;
                overflow: hidden;
                margin-bottom: 0.75rem;
            }
            .jasa-faq-header {
                width: 100%;
                background: #fff;
                border: none;
                padding: 1.1rem 1.25rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                text-align: left;
                transition: background-color 0.2s;
            }
            .jasa-faq-header:hover { background-color: #f7f9ff; }
            .jasa-faq-question {
                font-size: 0.9rem;
                font-weight: 600;
                color: #0f2e4c;
                flex: 1;
            }
            .jasa-faq-icon {
                color: #f97316;
                font-size: 1.1rem;
                transition: transform 0.3s;
                flex-shrink: 0;
                margin-left: 0.75rem;
            }
            .jasa-faq-item.open .jasa-faq-icon {
                transform: rotate(45deg);
            }
            .jasa-faq-body {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease;
                background: #fafbff;
            }
            .jasa-faq-answer {
                padding: 0 1.25rem 1.1rem;
                font-size: 0.85rem;
                color: #5a6a7e;
                line-height: 1.7;
            }

            /* ── Closing CTA ───────────────────────────── */
            .jasa-cta-section {
                background: linear-gradient(135deg, #f97316 0%, #ea6c0a 100%);
            }

            /* ── Footer ────────────────────────────────── */
            .jasa-footer {
                background-color: #0a1f35;
                color: rgba(255,255,255,0.55);
                padding: 2rem 1.5rem;
                text-align: center;
                font-size: 0.8rem;
            }

            /* ── Grid Utilities ────────────────────────── */
            @media (min-width: 640px) {
                .jasa-grid-2  { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
            }
            @media (min-width: 768px) {
                .jasa-grid-3  { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; }
                .jasa-grid-2-1 { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
                .jasa-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
            }
            @media (min-width: 1024px) {
                .jasa-grid-3p { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.75rem; }
            }
        `;
        document.head.appendChild(style);
    }

    // ── WhatsApp Link ─────────────────────────────────────────────────────
    const cleanWa = (contact.whatsapp || '').replace(/\D/g, '');
    const waUrl = cleanWa
        ? `https://wa.me/${cleanWa}?text=${encodeURIComponent(`Halo, saya ingin mengetahui lebih lanjut tentang layanan ${brand.name || ''}.`)}`
        : '#';
    const ctaHref = (contact.cta_url || '').trim()
        ? (contact.cta_url.startsWith('http') ? contact.cta_url : `https://${contact.cta_url}`)
        : waUrl;

    // ── Default SVG Illustration for Hero ───────────────────────────────
    const defaultHeroSvg = `
        <svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px;border-radius:1.2rem;border:3px solid rgba(249,115,22,0.3);box-shadow:0 32px 80px rgba(0,0,0,0.45);">
            <rect width="480" height="360" rx="16" fill="#163654"/>
            <!-- Dashboard mockup -->
            <rect x="30" y="30" width="420" height="300" rx="10" fill="#0a1f35"/>
            <!-- Top bar -->
            <rect x="30" y="30" width="420" height="36" rx="10" fill="#0f2e4c"/>
            <circle cx="58" cy="48" r="6" fill="#f97316" opacity="0.7"/>
            <circle cx="78" cy="48" r="6" fill="#f59e0b" opacity="0.6"/>
            <circle cx="98" cy="48" r="6" fill="#22c55e" opacity="0.6"/>
            <!-- Sidebar -->
            <rect x="30" y="66" width="90" height="264" fill="#112840"/>
            <rect x="42" y="84" width="66" height="10" rx="4" fill="rgba(255,255,255,0.15)"/>
            <rect x="42" y="104" width="52" height="8" rx="3" fill="rgba(249,115,22,0.6)"/>
            <rect x="42" y="122" width="58" height="8" rx="3" fill="rgba(255,255,255,0.1)"/>
            <rect x="42" y="140" width="46" height="8" rx="3" fill="rgba(255,255,255,0.1)"/>
            <rect x="42" y="158" width="60" height="8" rx="3" fill="rgba(255,255,255,0.1)"/>
            <!-- Content area -->
            <rect x="135" y="76" width="140" height="80" rx="8" fill="#163654"/>
            <rect x="145" y="88" width="90" height="8" rx="3" fill="rgba(255,255,255,0.5)"/>
            <rect x="145" y="104" width="70" height="6" rx="3" fill="rgba(255,255,255,0.25)"/>
            <rect x="145" y="116" width="60" height="24" rx="5" fill="#f97316"/>
            <rect x="285" y="76" width="150" height="80" rx="8" fill="#163654"/>
            <rect x="295" y="88" width="80" height="8" rx="3" fill="rgba(255,255,255,0.5)"/>
            <rect x="295" y="104" width="100" height="6" rx="3" fill="rgba(255,255,255,0.25)"/>
            <rect x="295" y="116" width="40" height="24" rx="5" fill="rgba(249,115,22,0.5)"/>
            <!-- Stats bar -->
            <rect x="135" y="168" width="300" height="60" rx="8" fill="#163654"/>
            <rect x="155" y="183" width="40" height="10" rx="3" fill="rgba(255,255,255,0.4)"/>
            <rect x="155" y="198" width="25" height="16" rx="3" fill="#f97316"/>
            <rect x="250" y="183" width="40" height="10" rx="3" fill="rgba(255,255,255,0.4)"/>
            <rect x="250" y="198" width="25" height="16" rx="3" fill="#f97316"/>
            <rect x="345" y="183" width="40" height="10" rx="3" fill="rgba(255,255,255,0.4)"/>
            <rect x="345" y="198" width="25" height="16" rx="3" fill="#f97316"/>
            <!-- Chart area -->
            <rect x="135" y="240" width="300" height="80" rx="8" fill="#163654"/>
            <polyline points="155,300 185,275 220,285 260,255 300,265 340,245 415,260" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="155,310 185,300 220,305 260,290 300,295 340,280 415,285" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;

    // ── Default SVG for About section ────────────────────────────────────
    const defaultAboutSvg = `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:1.2rem;border:3px solid rgba(249,115,22,0.2);box-shadow:0 24px 60px rgba(15,46,76,0.14);">
            <rect width="400" height="300" rx="16" fill="#f0f4f8"/>
            <rect x="20" y="20" width="180" height="260" rx="12" fill="#0f2e4c"/>
            <circle cx="110" cy="100" r="40" fill="#f97316" opacity="0.9"/>
            <rect x="55" y="155" width="110" height="10" rx="4" fill="rgba(255,255,255,0.6)"/>
            <rect x="70" y="173" width="80" height="7" rx="3" fill="rgba(255,255,255,0.3)"/>
            <rect x="55" y="195" width="110" height="45" rx="6" fill="rgba(249,115,22,0.25)"/>
            <rect x="220" y="20" width="160" height="120" rx="12" fill="#0f2e4c"/>
            <rect x="235" y="36" width="130" height="8" rx="3" fill="rgba(255,255,255,0.55)"/>
            <rect x="235" y="52" width="100" height="7" rx="3" fill="rgba(255,255,255,0.3)"/>
            <rect x="235" y="66" width="115" height="7" rx="3" fill="rgba(255,255,255,0.3)"/>
            <rect x="235" y="88" width="80" height="32" rx="6" fill="#f97316"/>
            <rect x="220" y="156" width="160" height="124" rx="12" fill="#163654"/>
            <rect x="235" y="172" width="60" height="8" rx="3" fill="rgba(255,255,255,0.5)"/>
            <rect x="235" y="190" width="130" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
            <rect x="235" y="204" width="110" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
            <rect x="235" y="218" width="120" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
        </svg>
    `;

    // ── Build HTML sections ───────────────────────────────────────────────

    // Steps (How It Works)
    const defaultIcons = ['🔍', '✍️', '🚀'];
    let stepsHtml = '';
    if (Array.isArray(howItWorks.steps) && howItWorks.steps.length > 0) {
        howItWorks.steps.forEach((step, idx) => {
            stepsHtml += `
                <div class="jasa-step-card">
                    <div class="jasa-step-number">${idx + 1}</div>
                    <div class="jasa-step-title">${step.title || ''}</div>
                    <div class="jasa-step-desc">${step.desc || ''}</div>
                </div>
            `;
        });
    }

    // Services
    const serviceIcons = ['💼', '🎨', '⚙️', '📈'];
    let servicesHtml = '';
    if (Array.isArray(services.list) && services.list.length > 0) {
        services.list.forEach((svc, idx) => {
            const featuresHtml = Array.isArray(svc.features)
                ? svc.features.map(f => `
                    <div class="jasa-service-feature">
                        <span class="jasa-check-icon">✔</span>
                        <span>${f}</span>
                    </div>`).join('')
                : '';
            stepsHtml; // no-op to satisfy linter
            servicesHtml += `
                <div class="jasa-service-card">
                    ${svc.image_url
                        ? `<img src="${svc.image_url}" alt="${svc.name}" class="jasa-service-card-img">`
                        : `<div style="height:200px;background:linear-gradient(135deg,#0f2e4c,#163654);display:flex;align-items:center;justify-content:center;font-size:2.5rem;">${serviceIcons[idx % serviceIcons.length]}</div>`
                    }
                    <div class="jasa-service-card-body">
                        <div class="jasa-service-name">${svc.name || ''}</div>
                        <div class="jasa-service-desc">${svc.desc || ''}</div>
                        ${featuresHtml}
                    </div>
                </div>
            `;
        });
    }

    // Why Us
    const whyUsIcons = ['⭐', '🔒', '⚡', '🎯', '💎', '🤝'];
    let whyUsHtml = '';
    if (Array.isArray(whyUs.points) && whyUs.points.length > 0) {
        whyUs.points.forEach((pt, idx) => {
            whyUsHtml += `
                <div class="jasa-whyus-item">
                    <div class="jasa-whyus-icon">${whyUsIcons[idx % whyUsIcons.length]}</div>
                    <div>
                        <div class="jasa-whyus-title">${pt.title || ''}</div>
                        <div class="jasa-whyus-desc">${pt.desc || ''}</div>
                    </div>
                </div>
            `;
        });
    }

    // Deliverables
    const deliverIcons = ['📄', '🔧', '📱', '🎨', '📊', '🚀'];
    let deliverablesHtml = '';
    if (Array.isArray(deliverables.list) && deliverables.list.length > 0) {
        deliverables.list.forEach((d, idx) => {
            deliverablesHtml += `
                <div class="jasa-deliver-card">
                    <div class="jasa-deliver-icon">${deliverIcons[idx % deliverIcons.length]}</div>
                    <div class="jasa-deliver-title">${d.title || ''}</div>
                    <div class="jasa-deliver-desc">${d.desc || ''}</div>
                </div>
            `;
        });
    }



    // Testimonials
    let testimonialsHtml = '';
    if (Array.isArray(testimonials.list) && testimonials.list.length > 0) {
        testimonials.list.forEach(t => {
            const initial = t.name ? t.name.charAt(0).toUpperCase() : 'U';
            testimonialsHtml += `
                <div class="jasa-testi-card">
                    <div class="jasa-testi-text">"${t.content || ''}"</div>
                    <div style="display:flex;align-items:center;gap:0.75rem;border-top:1px solid #f0f4f8;padding-top:0.9rem;">
                        ${t.avatar_url
                            ? `<img src="${t.avatar_url}" alt="${t.name}" class="jasa-testi-avatar" style="background:none;">`
                            : `<div class="jasa-testi-avatar" style="background:linear-gradient(135deg,#0f2e4c,#f97316);">${initial}</div>`
                        }
                        <div>
                            <div class="jasa-testi-name">${t.name || ''}</div>
                            ${t.role ? `<div class="jasa-testi-role">${t.role}</div>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
    }



    // ── Main Render ────────────────────────────────────────────────────────
    appEl.innerHTML = `
        <div style="display:flex;flex-direction:column;min-height:100vh;">

            <!-- NAVBAR -->
            <nav class="jasa-nav">
                <div class="jasa-nav-brand">
                    <div class="jasa-nav-logo-box">
                        ${brand.name ? brand.name.charAt(0).toUpperCase() : 'J'}
                    </div>
                    <span>${brand.name || 'Jasa Profesional'}</span>
                </div>
                ${brand.cta_text ? `
                <a href="${brand.cta_url || ctaHref}" target="_blank" rel="noopener noreferrer" class="btn-orange" style="padding:0.55rem 1.25rem;font-size:0.8rem;">
                    ${brand.cta_text}
                </a>
                ` : ''}
            </nav>

            <!-- HERO -->
            <section class="jasa-hero">
                <div class="jasa-container" style="position:relative;z-index:1;">
                    <div class="jasa-hero-grid">
                        <!-- Left: Text -->
                        <div>
                            <div class="jasa-hero-badge">
                                ✦ ${brand.tagline || 'Layanan Profesional Terpercaya'}
                            </div>
                            <h1 class="jasa-hero-headline">
                                ${hero.headline || 'Wujudkan Impian Bisnis Anda Bersama Kami'}
                            </h1>
                            <p class="jasa-hero-sub">
                                ${hero.subheadline || 'Kami menyediakan solusi profesional yang terukur, terpercaya, dan berorientasi hasil untuk bisnis Anda.'}
                            </p>
                            <div class="jasa-hero-ctas">
                                <a href="${ctaHref}" target="_blank" rel="noopener noreferrer" class="btn-orange">
                                    ${hero.cta_text || 'Mulai Konsultasi'}
                                </a>
                                ${hero.cta_secondary_text ? `<a href="#services" class="btn-outline-white">${hero.cta_secondary_text}</a>` : ''}
                            </div>
                            <!-- Social Proof Bar -->
                            ${(socialProof.client_count || socialProof.project_count || socialProof.product_count) ? `
                            <div class="jasa-social-bar">
                                ${socialProof.client_count ? `
                                <div class="jasa-social-bar-item">
                                    <div class="jasa-social-bar-number">${socialProof.client_count}</div>
                                    <div class="jasa-social-bar-label">${socialProof.label_clients || 'Klien'}</div>
                                </div>` : ''}
                                ${socialProof.project_count ? `
                                <div class="jasa-social-bar-item">
                                    <div class="jasa-social-bar-number">${socialProof.project_count}</div>
                                    <div class="jasa-social-bar-label">${socialProof.label_projects || 'Project'}</div>
                                </div>` : ''}
                                ${socialProof.product_count ? `
                                <div class="jasa-social-bar-item">
                                    <div class="jasa-social-bar-number">${socialProof.product_count}</div>
                                    <div class="jasa-social-bar-label">${socialProof.label_products || 'Produk'}</div>
                                </div>` : ''}
                            </div>
                            ` : ''}
                        </div>
                        <!-- Right: Image -->
                        <div class="jasa-hero-image-wrap">
                            ${hero.image_url
                                ? `<img src="${hero.image_url}" alt="${brand.name || 'Jasa'}" style="width:100%;max-width:460px;border-radius:1.2rem;border:3px solid rgba(249,115,22,0.3);box-shadow:0 32px 80px rgba(0,0,0,0.45);object-fit:cover;aspect-ratio:4/3;">`
                                : defaultHeroSvg
                            }
                        </div>
                    </div>
                </div>
            </section>

            <!-- HOW IT WORKS -->
            ${stepsHtml ? `
            <section class="jasa-section" style="background:#fafbff;" id="how-it-works">
                <div class="jasa-container">
                    <div style="text-align:center;margin-bottom:2.5rem;">
                        <div class="jasa-divider" style="margin:0 auto 1rem;"></div>
                        <h2 class="jasa-section-title">${howItWorks.title || 'Cara Kerja Kami'}</h2>
                        <p class="jasa-section-sub">Proses yang simple dan transparan dari awal hingga selesai</p>
                    </div>
                    <div class="jasa-grid-3">
                        ${stepsHtml}
                    </div>
                </div>
            </section>
            ` : ''}

            <!-- ABOUT -->
            ${(about.title || about.desc) ? `
            <section class="jasa-section" id="about">
                <div class="jasa-container">
                    <div class="jasa-grid-2-1">
                        <div>
                            ${about.image_url
                                ? `<img src="${about.image_url}" alt="About" class="jasa-about-image">`
                                : defaultAboutSvg
                            }
                        </div>
                        <div>
                            <div class="jasa-divider"></div>
                            <h2 class="jasa-section-title">${about.title || 'Tentang Kami'}</h2>
                            <p style="font-size:0.92rem;color:#5a6a7e;line-height:1.75;margin-bottom:2rem;">${about.desc || ''}</p>
                            <div style="display:flex;flex-wrap:wrap;gap:0.75rem;">
                                <a href="#pricing" class="btn-orange">${about.cta_order_text || 'Pesan Sekarang'}</a>
                                ${about.cta_portfolio_text ? `<a href="${ctaHref}" target="_blank" rel="noopener noreferrer" class="btn-outline-navy">${about.cta_portfolio_text}</a>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            ` : ''}

            <!-- SERVICES -->
            ${servicesHtml ? `
            <section class="jasa-section" style="background:#fafbff;" id="services">
                <div class="jasa-container">
                    <div style="text-align:center;margin-bottom:2.5rem;">
                        <div class="jasa-divider" style="margin:0 auto 1rem;"></div>
                        <h2 class="jasa-section-title">${services.title || 'Layanan Kami'}</h2>
                        <p class="jasa-section-sub">Solusi lengkap yang kami tawarkan untuk kebutuhan bisnis Anda</p>
                    </div>
                    <div class="jasa-grid-${Math.min(services.list?.length || 1, 3) <= 2 ? '2' : '3'}">
                        ${servicesHtml}
                    </div>
                </div>
            </section>
            ` : ''}

            <!-- WHY US -->
            ${whyUsHtml ? `
            <section class="jasa-section" id="why-us">
                <div class="jasa-container">
                    <div style="text-align:center;margin-bottom:2.5rem;">
                        <div class="jasa-divider" style="margin:0 auto 1rem;"></div>
                        <h2 class="jasa-section-title">${whyUs.title || 'Mengapa Memilih Kami?'}</h2>
                        <p class="jasa-section-sub">Keunggulan yang membuat klien kami selalu kembali</p>
                    </div>
                    <div class="jasa-grid-2">
                        ${whyUsHtml}
                    </div>
                </div>
            </section>
            ` : ''}

            <!-- STATS -->
            ${(socialProof.client_count || socialProof.project_count || socialProof.product_count) ? `
            <section class="jasa-section jasa-stats-section" style="padding:3rem 1.5rem;">
                <div class="jasa-container">
                    <div class="jasa-grid-3" style="text-align:center;">
                        ${socialProof.client_count ? `
                        <div class="jasa-stat-item">
                            <div class="jasa-stat-number">${socialProof.client_count}</div>
                            <div class="jasa-stat-label">${socialProof.label_clients || 'Klien Puas'}</div>
                        </div>` : ''}
                        ${socialProof.project_count ? `
                        <div class="jasa-stat-item">
                            <div class="jasa-stat-number">${socialProof.project_count}</div>
                            <div class="jasa-stat-label">${socialProof.label_projects || 'Project Selesai'}</div>
                        </div>` : ''}
                        ${socialProof.product_count ? `
                        <div class="jasa-stat-item">
                            <div class="jasa-stat-number">${socialProof.product_count}</div>
                            <div class="jasa-stat-label">${socialProof.label_products || 'Produk Aktif'}</div>
                        </div>` : ''}
                    </div>
                </div>
            </section>
            ` : ''}

            <!-- DELIVERABLES -->
            ${deliverablesHtml ? `
            <section class="jasa-section" style="background:#fafbff;" id="deliverables">
                <div class="jasa-container">
                    <div style="text-align:center;margin-bottom:2.5rem;">
                        <div class="jasa-divider" style="margin:0 auto 1rem;"></div>
                        <h2 class="jasa-section-title">${deliverables.title || 'Apa yang Anda Dapatkan'}</h2>
                        <p class="jasa-section-sub">Hasil konkret dari setiap kolaborasi yang kami jalankan</p>
                    </div>
                    <div class="jasa-grid-3">
                        ${deliverablesHtml}
                    </div>
                </div>
            </section>
            ` : ''}

            <!-- PRICING -->
            ${pricing ? `
            <section class="jasa-section" id="pricing">
                <div class="jasa-container">
                    <div style="text-align:center;margin-bottom:2.5rem;">
                        <div class="jasa-divider" style="margin:0 auto 1rem;"></div>
                        <h2 class="jasa-section-title">${pricing.title || 'Pilih Paket Terbaik Anda'}</h2>
                        <p class="jasa-section-sub">${pricing.subtitle || 'Harga transparan tanpa biaya tersembunyi'}</p>
                    </div>
                    <div id="jasa-pricing-root"></div>
                </div>
            </section>
            ` : ''}

            <!-- GUARANTEE -->
            ${(guarantee.title || guarantee.desc) ? `
            <section class="jasa-section jasa-guarantee-section">
                <div class="jasa-container">
                    <div class="jasa-guarantee-box">
                        <div style="font-size:2.5rem;margin-bottom:1rem;">🛡️</div>
                        <h2 class="jasa-section-title" style="color:#0f2e4c;">${guarantee.title || 'Garansi Kepuasan 100%'}</h2>
                        <div class="jasa-divider" style="margin:1rem auto;"></div>
                        <p style="font-size:0.92rem;color:#5a6a7e;line-height:1.75;">${guarantee.desc || 'Kami berkomitmen memberikan hasil terbaik. Jika tidak puas, kami siap melakukan revisi hingga sesuai dengan ekspektasi Anda.'}</p>
                    </div>
                </div>
            </section>
            ` : ''}

            <!-- TESTIMONIALS -->
            ${testimonialsHtml ? `
            <section class="jasa-section" id="testimonials">
                <div class="jasa-container">
                    <div style="text-align:center;margin-bottom:2.5rem;">
                        <div class="jasa-divider" style="margin:0 auto 1rem;"></div>
                        <h2 class="jasa-section-title">${testimonials.title || 'Kata Klien Kami'}</h2>
                        <p class="jasa-section-sub">Kepuasan klien adalah prioritas kami</p>
                    </div>
                    <div class="jasa-grid-2">
                        ${testimonialsHtml}
                    </div>
                </div>
            </section>
            ` : ''}

            <!-- FAQ -->
            ${faqs && faqs.length > 0 ? `
            <section class="jasa-section" style="background:#fafbff;" id="faq">
                <div class="jasa-container">
                    <div style="text-align:center;margin-bottom:2.5rem;">
                        <div class="jasa-divider" style="margin:0 auto 1rem;"></div>
                        <h2 class="jasa-section-title">Pertanyaan yang Sering Diajukan</h2>
                        <p class="jasa-section-sub">Temukan jawaban atas pertanyaan umum seputar layanan kami</p>
                    </div>
                    <div id="jasa-faq-root"></div>
                </div>
            </section>
            ` : ''}

            <!-- BOTTOM CTA -->
            <section class="jasa-section jasa-cta-section" style="padding:3.5rem 1.5rem;text-align:center;" id="cta">
                <div class="jasa-container">
                    <h2 style="font-size:1.75rem;font-weight:900;color:#fff;margin-bottom:0.75rem;line-height:1.25;">
                        ${closingCta.title || 'Siap Memulai Project Anda?'}
                    </h2>
                    <p style="color:rgba(255,255,255,0.85);font-size:0.95rem;margin-bottom:2rem;">
                        Konsultasikan kebutuhan Anda sekarang. Respon cepat, profesional, dan terpercaya.
                    </p>
                    <a href="${ctaHref}" target="_blank" rel="noopener noreferrer"
                       class="btn-outline-white" style="font-size:1rem;">
                        ${closingCta.cta_text || 'Konsultasi Gratis Sekarang'}
                    </a>
                </div>
            </section>

            <!-- FOOTER -->
            <footer class="jasa-footer">
                <div style="margin-bottom:0.5rem;">
                    ${contact.address ? `📍 ${contact.address}` : ''}
                    ${contact.email ? ` &nbsp;·&nbsp; ✉️ ${contact.email}` : ''}
                    ${contact.whatsapp ? ` &nbsp;·&nbsp; <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="color:#f97316;text-decoration:none;">WhatsApp</a>` : ''}
                </div>
                <div>${contact.copyright || `© ${new Date().getFullYear()} ${brand.name || 'Jasa Profesional'}. Hak Cipta Dilindungi.`}</div>
            </footer>

        </div>
    `;

    // Initialize FAQ component
    const faqRoot = document.getElementById('jasa-faq-root');
    if (faqRoot && Array.isArray(faqs) && faqs.length > 0) {
        const { initFaq } = await import('../components/Faq.js');
        await initFaq(faqRoot, faqs, {
            theme: 'professional-navy',
            title: 'Pertanyaan yang Sering Diajukan',
            subtitle: 'Temukan jawaban atas pertanyaan umum seputar layanan kami'
        });
    }

    // Initialize Pricing component
    const pricingRoot = document.getElementById('jasa-pricing-root');
    if (pricingRoot) {
        const { initPricing } = await import('../components/Pricing.js');
        await initPricing(pricingRoot, pricing.plans || [], {
            theme: 'professional-navy',
            ctaHref: ctaHref,
            ctaOnly: !!pricing.cta_only,
            ctaText: pricing.cta_text || 'Konsultasi Sekarang'
        });
    }
}
