import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: Header Navbar Navy (V2 Preview)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const brandName = data.brand_name || pageConfig.meta?.brand_name || pageConfig.meta?.title || brandConfig?.name || 'Siluet';
    const logoUrl = data.logo_url || '';
    const logoEnabled = data.logo_enabled !== false;
    const ctaText = data.cta_text || 'Mulai Sekarang';
    const ctaUrl = data.cta_url || '#contact';
    const showNav = data.show_nav !== false;
    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';

    const { theme, sectionBgClass, patternHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default');

    const defaultNavLabels = {
        hero: 'Beranda',
        about: 'Tentang',
        services: 'Layanan',
        pricing: 'Harga',
        faq: 'FAQ',
        social_proof: 'Statistik',
        contact: 'Kontak'
    };

    const selectedNavTypes = Array.isArray(data.selected_nav_items) && data.selected_nav_items.length > 0 
        ? data.selected_nav_items 
        : ['hero', 'about', 'services', 'pricing', 'faq', 'contact'];

    const customNavLabels = data.custom_nav_labels || {};

    const navItems = selectedNavTypes.map(type => ({
        label: customNavLabels[type] || defaultNavLabels[type] || type,
        url: `#${type}`
    }));

    const navLinksHtml = showNav ? navItems.map(item => `
        <a href="${item.url}" class="text-xs font-semibold ${theme.subtitle} hover:${theme.heading} transition-colors">
            ${item.label}
        </a>
    `).join('') : '';

    return `
        <header class="py-4 px-6 ${sectionBgClass} sticky top-0 z-50 backdrop-blur-md bg-opacity-90 transition-colors duration-300">
            ${patternHtml}
            <div class="max-w-6xl mx-auto flex items-center justify-between relative z-10">
                <!-- Brand Logo / Name -->
                <a href="#" class="flex items-center gap-2.5 group">
                    ${logoEnabled && logoUrl ? `
                        <img src="${logoUrl}" alt="${brandName}" class="h-8 w-auto object-contain transition-transform group-hover:scale-105" />
                    ` : `
                        <div class="w-8 h-8 rounded-lg ${theme.cardNum} font-black text-sm flex items-center justify-center">
                            ${brandName.charAt(0).toUpperCase()}
                        </div>
                    `}
                    <span class="font-extrabold text-base tracking-tight ${theme.heading}">
                        ${brandName}
                    </span>
                </a>

                <!-- Desktop Navigation Links -->
                ${showNav ? `
                    <nav class="hidden md:flex items-center gap-6">
                        ${navLinksHtml}
                    </nav>
                ` : ''}

                <!-- Header CTA Button -->
                <div class="flex items-center gap-3">
                    ${ctaText ? `
                        <a href="${ctaUrl}" class="px-4 py-2 text-xs font-bold rounded-xl ${theme.btnPrimary} transition-all active:scale-95">
                            ${ctaText}
                        </a>
                    ` : ''}
                </div>
            </div>
        </header>
    `;
}
