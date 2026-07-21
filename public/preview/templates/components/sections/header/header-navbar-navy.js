/**
 * Modular Section: Header Navbar Navy (V2)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const brandName = data.brand_name || pageConfig?.content?.brand_name || brandConfig?.name || 'Siluet';
    const logoUrl = (data.logo_enabled !== false) ? (data.logo_url || data.image_url || '') : '';
    const showNav = data.show_nav !== false;
    const ctaText = data.cta_text || '';
    const ctaUrl = data.cta_url || '#contact';

    // Build dynamic navigation items based on active page sections
    const activeSections = pageConfig?.content?.sections || pageConfig?.sections || data?.sections || [];
    const customNavLabels = (typeof data.custom_nav_labels === 'object' && data.custom_nav_labels) ? data.custom_nav_labels : {};

    const sectionLabelMap = {
        hero: customNavLabels.hero !== undefined ? customNavLabels.hero : 'Beranda',
        about: customNavLabels.about !== undefined ? customNavLabels.about : 'Tentang',
        services: customNavLabels.services !== undefined ? customNavLabels.services : 'Layanan',
        pricing: customNavLabels.pricing !== undefined ? customNavLabels.pricing : 'Harga',
        faq: customNavLabels.faq !== undefined ? customNavLabels.faq : 'FAQ',
        social_proof: customNavLabels.social_proof !== undefined ? customNavLabels.social_proof : 'Statistik',
        contact: customNavLabels.contact !== undefined ? customNavLabels.contact : 'Kontak',
        custom: customNavLabels.custom !== undefined ? customNavLabels.custom : 'Fitur Utama'
    };

    const selectedNavKeys = Array.isArray(data.selected_nav_items) ? data.selected_nav_items : null;

    const navItems = [];
    if (showNav) {
        for (const sec of activeSections) {
            if (sec.type && sec.type !== 'header' && sec.type !== 'footer' && sectionLabelMap[sec.type]) {
                const targetId = sec.type === 'social_proof' ? 'social-proof' : sec.type;
                
                // If custom selected nav items are specified by user, filter by selectedNavKeys
                if (selectedNavKeys !== null && !selectedNavKeys.includes(sec.type) && !selectedNavKeys.includes(targetId)) {
                    continue;
                }

                navItems.push({
                    id: targetId,
                    label: sectionLabelMap[sec.type]
                });
            }
        }
    }

    const desktopLinksHtml = navItems.map(item => `
        <a href="#${item.id}" class="text-sm font-medium text-slate-300 hover:text-orange-400 transition-colors">
            ${item.label}
        </a>
    `).join('');

    const mobileLinksHtml = navItems.map(item => `
        <a href="#${item.id}" onclick="const el = document.getElementById('v2-mobile-menu'); if(el) el.classList.add('hidden');" class="text-base font-semibold text-slate-200 hover:text-orange-400 transition-colors py-2 border-b border-slate-800/60">
            ${item.label}
        </a>
    `).join('');

    const ctaHtml = ctaText ? `
        <a href="${ctaUrl}" target="${ctaUrl.startsWith('http') ? '_blank' : '_self'}" class="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-lg shadow-md shadow-orange-500/20 transition-all">
            ${ctaText}
        </a>
    ` : '';

    const mobileCtaHtml = ctaText ? `
        <a href="${ctaUrl}" target="${ctaUrl.startsWith('http') ? '_blank' : '_self'}" onclick="const el = document.getElementById('v2-mobile-menu'); if(el) el.classList.add('hidden');" class="mt-2 w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-3 rounded-lg shadow-md shadow-orange-500/20 transition-all">
            ${ctaText}
        </a>
    ` : '';

    const logoHtml = logoUrl ? `
        <img src="${logoUrl}" alt="${brandName}" class="h-8 md:h-10 w-auto object-contain" />
    ` : `
        <span class="text-xl md:text-2xl font-black text-white tracking-tight">
            ${brandName}<span class="text-orange-500">.</span>
        </span>
    `;

    return `
        <header class="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 text-white">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
                <!-- Brand / Logo -->
                <a href="#" class="flex items-center gap-3">
                    ${logoHtml}
                </a>

                <!-- Desktop Navigation Menu -->
                ${showNav && navItems.length > 0 ? `
                    <nav class="hidden sm:flex items-center gap-4 md:gap-8">
                        ${desktopLinksHtml}
                    </nav>
                ` : ''}

                <!-- Action Button & Hamburger Toggle -->
                <div class="flex items-center gap-3 md:gap-4">
                    ${ctaHtml ? `<div class="hidden sm:block">${ctaHtml}</div>` : ''}

                    ${(showNav && navItems.length > 0) || ctaText ? `
                        <button 
                            type="button" 
                            onclick="const el = document.getElementById('v2-mobile-menu'); if(el) el.classList.toggle('hidden');" 
                            class="sm:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
                            aria-label="Toggle Navigation Menu"
                        >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    ` : ''}
                </div>
            </div>

            <!-- Mobile Hamburger Dropdown Menu -->
            <div id="v2-mobile-menu" class="hidden sm:hidden bg-slate-950/95 border-b border-slate-800 px-6 py-4 flex flex-col gap-3">
                ${mobileLinksHtml}
                ${mobileCtaHtml}
            </div>
        </header>
    `;
}
