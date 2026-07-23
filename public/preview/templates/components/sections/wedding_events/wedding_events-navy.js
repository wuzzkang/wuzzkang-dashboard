import { getSectionStyle } from '../../../utils/sectionStyle.js';

export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Rangkaian Acara Pernikahan';
    const subtitle = data.subtitle || 'Pelaksanaan Akad Nikah & Resepsi Pernikahan';

    const akadTitle = data.akad_title || 'Akad Nikah';
    const akadDate = data.akad_date || 'Sabtu, 12 Desember 2026';
    const akadTime = data.akad_time || 'Pukul 08.00 WIB - Selesai';
    const akadLocation = data.akad_location || 'Gedung Pernikahan Indah';
    const akadAddress = data.akad_address || 'Jl. Merdeka No. 45, Bandung';
    const akadMaps = data.akad_maps_url || 'https://maps.google.com';

    const resepsiTitle = data.resepsi_title || 'Resepsi Pernikahan';
    const resepsiDate = data.resepsi_date || 'Sabtu, 12 Desember 2026';
    const resepsiTime = data.resepsi_time || 'Pukul 11.00 WIB - 15.00 WIB';
    const resepsiLocation = data.resepsi_location || 'Gedung Pernikahan Indah';
    const resepsiAddress = data.resepsi_address || 'Jl. Merdeka No. 45, Bandung';
    const resepsiMaps = data.resepsi_maps_url || 'https://maps.google.com';

    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-events-styles-${Math.random().toString(36).substr(2, 9)}`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
            .wedding-font-serif { font-family: 'Playfair Display', serif; }
            .wedding-font-cursive { font-family: 'Great Vibes', cursive; }
        </style>

        <section id="wedding_events" class="py-20 md:py-28 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-5xl mx-auto text-center relative z-10">
                <div class="w-12 h-1 bg-amber-400 rounded-full mx-auto mb-4"></div>
                <h2 class="wedding-font-serif text-2xl md:text-4xl font-extrabold ${theme.heading} tracking-tight mb-3 leading-snug">
                    ${title}
                </h2>
                <p class="${theme.subtitle} text-xs md:text-sm max-w-xl mx-auto mb-12 leading-relaxed">
                    ${subtitle}
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    <!-- Akad Card -->
                    <div class="bg-slate-900/70 border border-amber-500/30 rounded-3xl p-8 text-center flex flex-col justify-between items-center shadow-xl transition-all hover:-translate-y-1">
                        <div>
                            <div class="w-14 h-14 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20 flex items-center justify-center text-2xl mx-auto mb-5 shadow-inner">
                                💍
                            </div>
                            <h3 class="wedding-font-serif text-xl md:text-2xl font-extrabold ${theme.cardTitle} mb-2 tracking-tight">${akadTitle}</h3>
                            <div class="space-y-1 mb-6">
                                <p class="text-sm font-bold text-amber-300">📅 ${akadDate}</p>
                                <p class="${theme.cardDesc} text-xs font-semibold">⏰ ${akadTime}</p>
                            </div>
                            <div class="pt-4 border-t border-slate-800/60 mb-6">
                                <p class="text-sm font-bold ${theme.cardTitle} mb-1">📍 ${akadLocation}</p>
                                <p class="${theme.cardDesc} text-xs leading-relaxed">${akadAddress}</p>
                            </div>
                        </div>
                        ${akadMaps ? `
                            <a href="${akadMaps}" target="_blank" rel="noopener noreferrer" class="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-6 py-2.5 rounded-full text-xs font-extrabold inline-flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20">
                                <span>🗺️ Petunjuk Google Maps</span>
                            </a>
                        ` : ''}
                    </div>

                    <!-- Resepsi Card -->
                    <div class="bg-slate-900/70 border border-amber-500/30 rounded-3xl p-8 text-center flex flex-col justify-between items-center shadow-xl transition-all hover:-translate-y-1">
                        <div>
                            <div class="w-14 h-14 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20 flex items-center justify-center text-2xl mx-auto mb-5 shadow-inner">
                                🎉
                            </div>
                            <h3 class="wedding-font-serif text-xl md:text-2xl font-extrabold ${theme.cardTitle} mb-2 tracking-tight">${resepsiTitle}</h3>
                            <div class="space-y-1 mb-6">
                                <p class="text-sm font-bold text-amber-300">📅 ${resepsiDate}</p>
                                <p class="${theme.cardDesc} text-xs font-semibold">⏰ ${resepsiTime}</p>
                            </div>
                            <div class="pt-4 border-t border-slate-800/60 mb-6">
                                <p class="text-sm font-bold ${theme.cardTitle} mb-1">📍 ${resepsiLocation}</p>
                                <p class="${theme.cardDesc} text-xs leading-relaxed">${resepsiAddress}</p>
                            </div>
                        </div>
                        ${resepsiMaps ? `
                            <a href="${resepsiMaps}" target="_blank" rel="noopener noreferrer" class="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-6 py-2.5 rounded-full text-xs font-extrabold inline-flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20">
                                <span>🗺️ Petunjuk Google Maps</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        </section>
    `;
}
