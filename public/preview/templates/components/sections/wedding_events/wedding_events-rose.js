import { getSectionStyle } from '../../../utils/sectionStyle.js';

export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Rangkaian Hari Pernikahan';
    const subtitle = data.subtitle || 'Pelaksanaan Akad Nikah & Resepsi Pernikahan';

    const akadTitle = data.akad_title || 'Akad Nikah Suci';
    const akadDate = data.akad_date || 'Jumat, 25 Desember 2026';
    const akadTime = data.akad_time || 'Pukul 08.00 WIB - Selesai';
    const akadLocation = data.akad_location || 'Masjid Agung Trans Studio';
    const akadAddress = data.akad_address || 'Jl. Gatot Subroto No. 289, Bandung';
    const akadMaps = data.akad_maps_url || 'https://maps.google.com';

    const resepsiTitle = data.resepsi_title || 'Resepsi Pernikahan Romantis';
    const resepsiDate = data.resepsi_date || 'Jumat, 25 Desember 2026';
    const resepsiTime = data.resepsi_time || 'Pukul 11.00 WIB - 15.00 WIB';
    const resepsiLocation = data.resepsi_location || 'Grand Rose Ballroom';
    const resepsiAddress = data.resepsi_address || 'Jl. Gatot Subroto No. 289, Bandung';
    const resepsiMaps = data.resepsi_maps_url || 'https://maps.google.com';

    const bgStyle = data.bg_style || 'rose';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-events-rose-styles-${Math.random().toString(36).substr(2, 9)}`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Parisienne&family=Montserrat:ital,wght@0,300..900;1,300..900&display=swap');
            .wedding-font-serif { font-family: 'Montserrat', sans-serif; font-weight: 700; }
            .wedding-font-cursive { font-family: 'Parisienne', cursive; }
        </style>

        <section id="wedding_events" class="py-20 md:py-28 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-5xl mx-auto text-center relative z-10">
                <div class="w-12 h-1 bg-rose-400 rounded-full mx-auto mb-4"></div>
                <h2 class="wedding-font-serif text-2xl md:text-4xl font-extrabold text-rose-100 tracking-tight mb-3 leading-snug">
                    ${title}
                </h2>
                <p class="${theme.subtitle} text-xs md:text-sm max-w-xl mx-auto mb-12 leading-relaxed">
                    ${subtitle}
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    <!-- Akad Card -->
                    <div class="bg-rose-950/60 border border-rose-500/30 rounded-3xl p-8 text-center flex flex-col justify-between items-center shadow-2xl transition-all hover:-translate-y-1">
                        <div>
                            <div class="w-14 h-14 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center text-2xl mx-auto mb-5 shadow-inner">
                                🌸
                            </div>
                            <h3 class="wedding-font-serif text-xl md:text-2xl font-bold text-rose-100 mb-2 tracking-tight">${akadTitle}</h3>
                            <div class="space-y-1 mb-6">
                                <p class="text-sm font-bold text-rose-300">📅 ${akadDate}</p>
                                <p class="text-rose-200/80 text-xs font-semibold">⏰ ${akadTime}</p>
                            </div>
                            <div class="pt-4 border-t border-rose-800/40 mb-6">
                                <p class="text-sm font-bold text-rose-100 mb-1">📍 ${akadLocation}</p>
                                <p class="text-rose-200/70 text-xs leading-relaxed">${akadAddress}</p>
                            </div>
                        </div>
                        ${akadMaps ? `
                            <a href="${akadMaps}" target="_blank" rel="noopener noreferrer" class="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-full text-xs font-extrabold inline-flex items-center gap-2 transition-all shadow-lg shadow-rose-950/50">
                                <span>🗺️ Petunjuk Google Maps</span>
                            </a>
                        ` : ''}
                    </div>

                    <!-- Resepsi Card -->
                    <div class="bg-rose-950/60 border border-rose-500/30 rounded-3xl p-8 text-center flex flex-col justify-between items-center shadow-2xl transition-all hover:-translate-y-1">
                        <div>
                            <div class="w-14 h-14 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center text-2xl mx-auto mb-5 shadow-inner">
                                💖
                            </div>
                            <h3 class="wedding-font-serif text-xl md:text-2xl font-bold text-rose-100 mb-2 tracking-tight">${resepsiTitle}</h3>
                            <div class="space-y-1 mb-6">
                                <p class="text-sm font-bold text-rose-300">📅 ${resepsiDate}</p>
                                <p class="text-rose-200/80 text-xs font-semibold">⏰ ${resepsiTime}</p>
                            </div>
                            <div class="pt-4 border-t border-rose-800/40 mb-6">
                                <p class="text-sm font-bold text-rose-100 mb-1">📍 ${resepsiLocation}</p>
                                <p class="text-rose-200/70 text-xs leading-relaxed">${resepsiAddress}</p>
                            </div>
                        </div>
                        ${resepsiMaps ? `
                            <a href="${resepsiMaps}" target="_blank" rel="noopener noreferrer" class="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-full text-xs font-extrabold inline-flex items-center gap-2 transition-all shadow-lg shadow-rose-950/50">
                                <span>🗺️ Petunjuk Google Maps</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        </section>
    `;
}
