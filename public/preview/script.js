import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://pggaknycbpjvsmmofnln.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZ2FrbnljYnBqdnNtbW9mbmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MDU3NjksImV4cCI6MjA5NzQ4MTc2OX0.p-UpXLmhKrHV2l2wHYO7YNDv8OftW2MDJp21-pKJVEU'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// CACHE BUSTER CONFIG (FOR DEV & PRODUCTION DEPLOYMENTS)
// ==========================================
const LP_VERSION = '1.0.8'; // Bump this version to force-refresh clients' cache on update
const globalUrlParams = new URLSearchParams(window.location.search);
const hasNoCache = globalUrlParams.has('nocache') || globalUrlParams.has('dev');
const cacheBustQuery = `?v=${hasNoCache ? Date.now() : LP_VERSION}`;

// ==========================================
// RENDERING COMPONENTS (TEMPLATE LITERALS)
// ==========================================

const renderHeader = (data) => {
    if (!data) return '';
    const logoUrl = data.logo_url || '';
    const title = data.title || data.logo || 'Toko';

    return `
        <header class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-slate-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-center md:justify-start items-center py-4">
                    <div class="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
                        ${logoUrl && logoUrl !== 'https://via.placeholder.com/150' ? 
                            `<img src="${logoUrl}" alt="${title}" class="h-12 w-12 rounded-full object-cover shadow-sm border-2 border-primary">` : 
                            `<div class="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shadow-sm">${title.charAt(0).toUpperCase()}</div>`
                        }
                        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">${title}</h1>
                    </div>
                </div>
            </div>
        </header>
    `;
};

const renderHero = (section) => {
    if (!section) return '';
    // Adaptasi struktur JSON: mendukung section.heading ATAU section.data.title
    const heading = section.heading || (section.data && section.data.title) || '';
    const subheading = section.subheading || (section.data && section.data.subtitle) || '';
    const ctaText = section.cta_text || (section.data && section.data.cta_text) || '';
    const ctaLink = section.cta_link || (section.data && section.data.cta_link) || '#';

    return `
        <section class="relative bg-gradient-to-b from-slate-50 to-white py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
            <!-- Dekorasi latar belakang -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
            
            <div class="max-w-3xl mx-auto fade-in">
                <h2 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                    ${heading}
                </h2>
                <p class="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                    ${subheading}
                </p>
                ${ctaText ? `
                    <a href="${ctaLink}" class="inline-block bg-primary text-white font-semibold text-lg px-8 py-4 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 hover:bg-opacity-90 transition-all duration-300">
                        ${ctaText}
                    </a>
                ` : ''}
            </div>
        </section>
    `;
};

const renderFeatures = (data) => {
    if (!data || !data.items || data.items.length === 0) return '';
    
    const itemsHtml = data.items.map(item => `
        <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div class="text-5xl mb-6 bg-primary/10 w-20 h-20 flex items-center justify-center rounded-2xl">${item.icon || '✨'}</div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">${item.title || ''}</h3>
            <p class="text-slate-600 leading-relaxed">${item.desc || ''}</p>
        </div>
    `).join('');

    return `
        <section class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto fade-in" style="animation-delay: 0.1s;">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${itemsHtml}
            </div>
        </section>
    `;
};

const renderFooter = (data) => {
    if (!data) return '';
    const text = data.text || data.copyright || '';
    return `
        <footer class="bg-slate-900 py-10 px-4 mt-auto">
            <div class="max-w-7xl mx-auto text-center">
                <p class="text-slate-400 font-medium">${text}</p>
            </div>
        </footer>
    `;
};

const renderError = (message) => {
    return `
        <div class="min-h-[70vh] flex items-center justify-center px-4 fade-in">
            <div class="bg-white border border-red-100 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl shadow-red-500/10">
                <div class="text-6xl mb-6">😕</div>
                <h3 class="text-2xl font-bold text-slate-900 mb-3">Oops! Terjadi Masalah</h3>
                <p class="text-slate-500 mb-8 leading-relaxed">${message}</p>
                <button onclick="window.location.reload()" class="bg-slate-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-slate-800 transition-colors">
                    Coba Lagi
                </button>
            </div>
        </div>
    `;
};

// ==========================================
// CORE APP ENGINE
// ==========================================

const renderPage = async (pageConfig) => {
    const appEl = document.getElementById('app');
    
    const templateType = pageConfig.meta?.template_type || 'store';
    
    if (templateType === 'birthday') {
        const urlParams = new URLSearchParams(window.location.search);
        const guestName = urlParams.get('to') || urlParams.get('recipient') || 'Tamu Undangan';
        const designKey = pageConfig.meta?.design_key || 'cute-balloon';
        
        // Dynamic Font Pairing for Birthday
        if (!document.getElementById('birthday-fonts')) {
            const link = document.createElement('link');
            link.id = 'birthday-fonts';
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Fredoka+One&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:wght@300;400;500;600;700&display=swap';
            document.head.appendChild(link);
        }
        
        try {
            console.log(`[LP Router] Loading birthday design template: ${designKey}...`);
            const module = await import(`./templates/birthday/${designKey}.js${cacheBustQuery}`);
            await module.render(pageConfig, guestName);
        } catch (e) {
            console.error(`[LP Router] Failed to load template ${designKey}, falling back to cute-balloon:`, e);
            try {
                const module = await import(`./templates/birthday/cute-balloon.js${cacheBustQuery}`);
                await module.render(pageConfig, guestName);
            } catch (err) {
                console.error('[LP Router] Fallback template failed:', err);
                appEl.innerHTML = renderError('Gagal memuat template undangan ulang tahun.');
            }
        }
        return;
    }

    if (templateType === 'wedding') {
        const urlParams = new URLSearchParams(window.location.search);
        const guestName = urlParams.get('to') || urlParams.get('recipient') || 'Tamu Undangan';
        const designKey = pageConfig.meta?.design_key || 'sage-green';
        
        // 1. Dynamic Font Pairing for Wedding (Serif + Cursive)
        if (!document.getElementById('wedding-fonts')) {
            const link = document.createElement('link');
            link.id = 'wedding-fonts';
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:wght@300;400;500;600;700&display=swap';
            document.head.appendChild(link);
        }
        
        try {
            console.log(`[LP Router] Loading wedding design template: ${designKey}...`);
            const module = await import(`./templates/wedding/${designKey}.js${cacheBustQuery}`);
            await module.render(pageConfig, guestName);
        } catch (e) {
            console.error(`[LP Router] Failed to load template ${designKey}, falling back to sage-green:`, e);
            try {
                const module = await import(`./templates/wedding/sage-green.js${cacheBustQuery}`);
                await module.render(pageConfig, guestName);
            } catch (err) {
                console.error('[LP Router] Fallback template failed:', err);
                appEl.innerHTML = renderError('Gagal memuat template undangan pernikahan.');
            }
        }
        return;
    }

    if (templateType === 'toko-online') {
        const designKey = pageConfig.meta?.design_key || 'modern-clean';
        try {
            console.log(`[LP Router] Loading toko-online template: ${designKey}...`);
            const module = await import(`./templates/toko-online/${designKey}.js${cacheBustQuery}`);
            await module.render(pageConfig, 'Tamu');
        } catch (e) {
            console.error(`[LP Router] Failed to load template ${designKey}, falling back to modern-clean:`, e);
            try {
                const module = await import(`./templates/toko-online/modern-clean.js${cacheBustQuery}`);
                await module.render(pageConfig, 'Tamu');
            } catch (err) {
                console.error('[LP Router] Fallback template failed:', err);
                appEl.innerHTML = renderError('Gagal memuat template toko online.');
            }
        }
        return;
    }

    if (templateType === 'campaign') {
        const designKey = pageConfig.meta?.design_key || 'neon-conversion';
        try {
            console.log(`[LP Router] Loading campaign template: ${designKey}...`);
            const module = await import(`./templates/campaign/${designKey}.js${cacheBustQuery}`);
            await module.render(pageConfig, 'Tamu');
        } catch (e) {
            console.error(`[LP Router] Failed to load template ${designKey}, falling back to neon-conversion:`, e);
            try {
                const module = await import(`./templates/campaign/neon-conversion.js${cacheBustQuery}`);
                await module.render(pageConfig, 'Tamu');
            } catch (err) {
                console.error('[LP Router] Fallback template failed:', err);
                appEl.innerHTML = renderError('Gagal memuat template campaign.');
            }
        }
        return;
    }

    // 1. Update Dinamis Tailwind Config (Theme Color) - Default Store
    const themeColors = {
        light: '#3b82f6',       // Blue
        dark: '#1f2937',        // Slate
        corporate: '#4b6bfb',   // Indigo
        retro: '#ef9fbc',       // Pink
        cyberpunk: '#ff007f',   // Neon Pink
    };
    
    const themeName = pageConfig.meta?.theme || 'light';
    const colorHex = themeColors[themeName] || '#3b82f6';
    
    // Update CSS variable (untuk spinner)
    document.documentElement.style.setProperty('--primary-color', colorHex);
    // Update Meta Theme Color
    updateMetaTag('name', 'theme-color', colorHex);
    
    // Inject script untuk meng-override konfigurasi warna primer Tailwind di runtime
    const style = document.createElement('style');
    style.innerHTML = `
        .bg-primary { background-color: ${colorHex} !important; }
        .text-primary { color: ${colorHex} !important; }
        .border-primary { border-color: ${colorHex} !important; }
        .shadow-primary\\/30 { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px ${colorHex}80 !important; }
        .bg-primary\\/10 { background-color: ${colorHex}1A !important; }
        .bg-primary\\/5 { background-color: ${colorHex}0D !important; }
    `;
    document.head.appendChild(style);
    
    // Set dark theme properties if dark/cyberpunk is selected
    const isDarkTheme = ['dark', 'cyberpunk'].includes(themeName);
    if (isDarkTheme) {
        document.body.classList.remove('text-slate-800', 'bg-slate-50');
        document.body.classList.add('text-slate-100', 'bg-slate-950');
    } else {
        document.body.classList.remove('text-slate-100', 'bg-slate-950');
        document.body.classList.add('text-slate-800', 'bg-slate-50');
    }
    
    // 2. Update SEO Meta Tags
    const metaTitle = pageConfig.meta?.title || 'Siluet Landing Page';
    const metaDesc = pageConfig.content?.hero?.subheading || '';
    
    document.title = metaTitle;
    updateMetaTag('property', 'og:title', metaTitle);
    if (metaDesc) updateMetaTag('property', 'og:description', metaDesc);
    
    // 3. Merakit HTML Berdasarkan Struktur JSON PageSchema
    let finalHtml = '';
    
    const headerData = { title: metaTitle };
    finalHtml += renderHeader(headerData);
    
    finalHtml += '<main class="flex-grow">';
    
    if (pageConfig.content && pageConfig.content.hero) {
        const heroSection = {
            heading: pageConfig.content.hero.heading,
            subheading: pageConfig.content.hero.subheading,
            cta_text: pageConfig.content.hero.cta_text,
            cta_link: '#contact'
        };
        finalHtml += renderHero(heroSection);
    }
    
    if (pageConfig.features && Array.isArray(pageConfig.features)) {
        const featuresData = { items: pageConfig.features };
        finalHtml += renderFeatures(featuresData);
    }
    
    finalHtml += '</main>';
    
    const footerData = { text: `© ${new Date().getFullYear()} ${metaTitle}. All Rights Reserved.` };
    finalHtml += renderFooter(footerData);
    
    // 4. Suntik HTML ke dalam App Container
    appEl.innerHTML = finalHtml;
};

document.addEventListener('DOMContentLoaded', async () => {
    const loadingEl = document.getElementById('loading');
    const appEl = document.getElementById('app');
    
    try {
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;

        const urlParams = new URLSearchParams(window.location.search);
        let queryField = '';
        let queryValue = '';

        if (urlParams.has('slug')) {
            queryField = 'slug';
            queryValue = urlParams.get('slug');
        } else if (hostname.includes('github.io')) {
            const segments = pathname.split('/').filter(Boolean);
            queryField = 'slug';
            // Hindari menggunakan nama repository (wuzzkang-lp) sebagai slug jika tidak ada segment lain
            if (segments.length > 1) {
                queryValue = segments[1]; // misal wuzzkang.github.io/wuzzkang-lp/slug-name
            } else if (segments.length === 1 && segments[0] !== 'wuzzkang-lp') {
                queryValue = segments[0]; // misal wuzzkang.github.io/slug-name (jika custom domain/user page)
            } else {
                queryValue = '';
            }
        } else {
            queryField = 'custom_domain';
            queryValue = hostname;
        }

        // Mode Testing Lokal (localhost)
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('bmstaging.id')) {
            if (!queryValue) {
                throw new Error("Tambahkan parameter ?slug=nama-toko di URL untuk testing lokal.");
            }
        }

        if (!queryValue) {
            throw new Error("Slug landing page tidak ditemukan dalam URL.");
        }

        // Ambil data dari tabel projects di Supabase
        const { data: project, error } = await supabase
            .from('projects')
            .select('*')
            .eq(queryField, queryValue)
            .eq('status', 'deployed')
            .single();

        if (error || !project) {
            console.error("Supabase Error:", error);
            throw new Error("Landing page tidak ditemukan atau belum dipublikasikan.");
        }

        // Defensive Coding: Pastikan JSON ada
        if (!project.page_data) {
            console.error('Data JSON kosong!');
            throw new Error("Data landing page kosong.");
        }

        // Pastikan JSON diparsing jika ia masih string
        let pageConfig = project.page_data;
        if (typeof pageConfig === 'string') {
            try {
                pageConfig = JSON.parse(pageConfig);
            } catch(e) {
                console.error("Gagal mem-parsing page_data:", e);
                throw new Error("Format data JSON tidak valid.");
            }
        }

        // Set page title immediately after data is fetched — applies to ALL template types
        // (wedding template doesn't have its own title update, so this is critical)
        const pageTitle = pageConfig.meta?.title || 'Siluet Landing Page';
        document.title = pageTitle;

        // ── Tracking Pixel Injection ──────────────────────────────────────────
        // Reads IDs merged into pageConfig.meta at generate-time from profiles.tracking_config.
        // Works for all delivery modes: GitHub Pages slug, bmstaging subdomain, and future
        // custom domains — no template-level or routing changes needed.
        const meta = pageConfig.meta || {};
        if (meta.facebook_pixel_id)   injectFacebookPixel(meta.facebook_pixel_id);
        if (meta.google_analytics_id) injectGoogleTag(meta.google_analytics_id);
        if (meta.google_ads_id)       injectGoogleTag(meta.google_ads_id);
        if (meta.tiktok_pixel_id)     injectTikTokPixel(meta.tiktok_pixel_id);

        // Render keseluruhan komponen UI murni berdasarkan JSON
        renderPage(pageConfig);

    } catch (err) {
        console.error(err);
        document.title = "Oops! Terjadi Masalah";
        appEl.innerHTML = renderError(err.message);
    } finally {
        // Hilangkan Loading Spinner dengan transisi halus
        loadingEl.style.opacity = '0';
        setTimeout(() => {
            loadingEl.style.display = 'none';
        }, 300);
    }
});

// Helper Functions
function updateMetaTag(attribute, attributeValue, contentValue) {
    let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
    if (element) {
        element.setAttribute('content', contentValue);
    } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, attributeValue);
        element.setAttribute('content', contentValue);
        document.head.appendChild(element);
    }
}

function injectFacebookPixel(pixelId) {
    if (!pixelId) return;
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    fbq('init', pixelId);
    fbq('track', 'PageView');

    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = "1";
    img.width = "1";
    img.style.display = "none";
    img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.head.appendChild(noscript);
}

/**
 * Injects a Google Tag (gtag.js) script for Google Analytics 4 (G-...) or
 * Google Ads conversion tracking (AW-...). Safe to call multiple times with
 * different IDs — gtag handles multiple config() calls on the same global.
 * Custom-domain-ready: works on any domain, no routing changes needed.
 */
function injectGoogleTag(tagId) {
    if (!tagId) return;
    if (document.getElementById(`gtag-${tagId}`)) return; // already injected

    // Initialize gtag dataLayer once
    if (!window.dataLayer) {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
    }

    const script = document.createElement('script');
    script.id = `gtag-${tagId}`;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${tagId}`;
    document.head.appendChild(script);

    window.gtag('config', tagId);
}

/**
 * Injects the TikTok Pixel base code.
 * Custom-domain-ready: the pixel script targets pixel.tiktok.com — no origin
 * assumptions are made, so it works on any domain or subdomain.
 */
function injectTikTokPixel(pixelId) {
    if (!pixelId) return;
    if (window.ttq) return; // already injected

    !function(w,d,t){
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
        ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie'];
        ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
        for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
        ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
        ttq.load=function(e,n){var i='https://analytics.tiktok.com/i18n/pixel/events.js';
        ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};
        ttq._t[e]=+new Date;ttq._o=ttq._o||{};
        ttq._o[e]=n||{};
        var o=document.createElement('script');
        o.type='text/javascript';o.async=!0;o.src=i+'?sdkid='+e+'&lib='+t;
        var a=document.getElementsByTagName('script')[0];
        a.parentNode.insertBefore(o,a)};
        ttq.load(pixelId);
        ttq.page();
    }(window,document,'ttq');
}
