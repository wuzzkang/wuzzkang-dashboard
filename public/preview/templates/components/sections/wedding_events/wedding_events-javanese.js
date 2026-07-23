import { getSectionStyle } from '../../../utils/sectionStyle.js';

export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Rantaman Acara Pawiwahan';
    const subtitle = data.subtitle || 'Pelaksanaan Ijab Kabul & Resepsi Pahargyan Ageng';

    const akadTitle = data.akad_title || 'Upacara Ijab Kabul';
    const akadDate = data.akad_date || 'Minggu Kliwon, 18 Oktober 2026';
    const akadTime = data.akad_time || 'Tabuh 08.00 WIB - Selesai';
    const akadLocation = data.akad_location || 'Pendopo Sasana Krido';
    const akadAddress = data.akad_address || 'Jl. Royal Jogja No. 12, Yogyakarta';
    const akadMaps = data.akad_maps_url || 'https://maps.google.com';

    const resepsiTitle = data.resepsi_title || 'Resepsi Pahargyan Ageng';
    const resepsiDate = data.resepsi_date || 'Minggu Kliwon, 18 Oktober 2026';
    const resepsiTime = data.resepsi_time || 'Tabuh 11.00 WIB - 14.00 WIB';
    const resepsiLocation = data.resepsi_location || 'Pendopo Sasana Krido';
    const resepsiAddress = data.resepsi_address || 'Jl. Royal Jogja No. 12, Yogyakarta';
    const resepsiMaps = data.resepsi_maps_url || 'https://maps.google.com';

    const bgStyle = data.bg_style || 'amber';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-events-javanese-styles-${Math.random().toString(36).substr(2, 9)}`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Pinyon+Script&display=swap');
            .wedding-font-serif { font-family: 'Cinzel', serif; }
            .wedding-font-cursive { font-family: 'Pinyon Script', cursive; }
        </style>

        <section id="wedding_events" class="py-20 md:py-28 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-5xl mx-auto text-center relative z-10">
                <div class="w-12 h-1 bg-amber-400 rounded-full mx-auto mb-4"></div>
                <h2 class="wedding-font-serif text-3xl md:text-5xl font-extrabold text-amber-100 tracking-tight mb-3 leading-snug">
                    ${title}
                </h2>
                <p class="${theme.subtitle} text-xs md:text-sm max-w-xl mx-auto mb-12 leading-relaxed">
                    ${subtitle}
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    <!-- Akad Card -->
                    <div class="bg-amber-950/70 border-2 border-amber-500/40 rounded-3xl p-8 text-center flex flex-col justify-between items-center shadow-2xl relative transition-all hover:-translate-y-1">
                        <div class="absolute inset-1 border border-amber-500/20 rounded-2xl pointer-events-none"></div>
                        <div>
                            <div class="w-14 h-14 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-2xl mx-auto mb-5 shadow-inner">
                                🪷
                            </div>
                            <h3 class="wedding-font-serif text-2xl md:text-3xl font-extrabold text-amber-100 mb-2 tracking-wide">${akadTitle}</h3>
                            <div class="space-y-1 mb-6">
                                <p class="text-sm font-bold text-amber-300">📅 ${akadDate}</p>
                                <p class="text-amber-200/80 text-xs font-semibold">⏰ ${akadTime}</p>
                            </div>
                            <div class="pt-4 border-t border-amber-800/40 mb-6">
                                <p class="text-sm font-bold text-amber-100 mb-1">📍 ${akadLocation}</p>
                                <p class="text-amber-200/70 text-xs leading-relaxed">${akadAddress}</p>
                            </div>
                        </div>
                        ${akadMaps ? `
                            <a href="${akadMaps}" target="_blank" rel="noopener noreferrer" class="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-6 py-2.5 rounded-full text-xs font-extrabold inline-flex items-center gap-2 transition-all shadow-lg shadow-amber-950/50">
                                <span>🗺️ Petunjuk Google Maps</span>
                            </a>
                        ` : ''}
                    </div>

                    <!-- Resepsi Card -->
                    <div class="bg-amber-950/70 border-2 border-amber-500/40 rounded-3xl p-8 text-center flex flex-col justify-between items-center shadow-2xl relative transition-all hover:-translate-y-1">
                        <div class="absolute inset-1 border border-amber-500/20 rounded-2xl pointer-events-none"></div>
                        <div>
                            <div class="w-14 h-14 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-2xl mx-auto mb-5 shadow-inner">
                                🏮
                            </div>
                            <h3 class="wedding-font-serif text-2xl md:text-3xl font-extrabold text-amber-100 mb-2 tracking-wide">${resepsiTitle}</h3>
                            <div class="space-y-1 mb-6">
                                <p class="text-sm font-bold text-amber-300">📅 ${resepsiDate}</p>
                                <p class="text-amber-200/80 text-xs font-semibold">⏰ ${resepsiTime}</p>
                            </div>
                            <div class="pt-4 border-t border-amber-800/40 mb-6">
                                <p class="text-sm font-bold text-amber-100 mb-1">📍 ${resepsiLocation}</p>
                                <p class="text-amber-200/70 text-xs leading-relaxed">${resepsiAddress}</p>
                            </div>
                        </div>
                        ${resepsiMaps ? `
                            <a href="${resepsiMaps}" target="_blank" rel="noopener noreferrer" class="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-6 py-2.5 rounded-full text-xs font-extrabold inline-flex items-center gap-2 transition-all shadow-lg shadow-amber-950/50">
                                <span>🗺️ Petunjuk Google Maps</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        </section>
    `;
}
