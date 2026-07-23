import { getSectionStyle } from '../../../utils/sectionStyle.js';

export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Ucapan Doa & Buku Tamu';
    const subtitle = data.subtitle || 'Tuliskan ucapan selamat dan kesan pesan untuk kedua mempelai';
    const wishes = data.wishes || [
        { name: 'Keluarga Besar Pratama', status: 'Hadir', message: 'Selamat untuk Adrian & Clarissa! Acara outdoornya pasti hangat dan luar biasa.' },
        { name: 'Dian & Teman Komunitas', status: 'Hadir', message: 'Happy wedding guys! Bahagia selamanya dan cepat dapat momongan!' }
    ];

    const bgStyle = data.bg_style || 'emerald';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-wishes-sage-styles-${Math.random().toString(36).substr(2, 9)}`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,400..700;1,400..700&display=swap');
            .wedding-font-serif { font-family: 'Cormorant Garamond', serif; }
            .wedding-font-cursive { font-family: 'Alex Brush', cursive; }
        </style>

        <section id="wedding_wishes" class="py-16 md:py-24 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-4xl mx-auto relative z-10">
                <div class="text-center mb-12">
                    <span class="text-xs font-bold text-emerald-300 uppercase tracking-widest block mb-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-max mx-auto">🌿 GUESTBOOK & WISHES</span>
                    <h2 class="wedding-font-serif text-3xl md:text-5xl font-extrabold ${theme.heading} mb-3 tracking-tight">${title}</h2>
                    <p class="${theme.subtitle} text-xs md:text-sm max-w-md mx-auto">${subtitle}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <!-- Wish Form -->
                    <div class="${theme.cardBg} border border-emerald-500/30 rounded-3xl p-6 shadow-xl backdrop-blur-md">
                        <h3 class="wedding-font-serif text-lg font-extrabold ${theme.cardTitle} mb-4 flex items-center gap-2">
                            <span>✏️ Kirim Ucapan Doa</span>
                        </h3>
                        <form onsubmit="event.preventDefault(); alert('Terima kasih! Ucapan doa restu Anda telah terkirim.');" class="space-y-3">
                            <div>
                                <label class="block text-[10px] font-bold ${theme.cardDesc} uppercase tracking-wider mb-1">Nama Tamu / Keluarga</label>
                                <input type="text" required placeholder="e.g. Budi & Keluarga" class="block w-full px-3.5 py-2 bg-black/20 border border-emerald-500/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none" />
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold ${theme.cardDesc} uppercase tracking-wider mb-1">Konfirmasi Kehadiran</label>
                                <select class="block w-full px-3.5 py-2 bg-black/20 border border-emerald-500/20 rounded-xl text-xs text-white focus:outline-none">
                                    <option value="Hadir" class="bg-gray-900 text-white">✅ Hadir</option>
                                    <option value="Ragu" class="bg-gray-900 text-white">❓ Ragu-ragu</option>
                                    <option value="Maaf Tidak Bisa Hadir" class="bg-gray-900 text-white">❌ Maaf Tidak Bisa Hadir</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold ${theme.cardDesc} uppercase tracking-wider mb-1">Pesan Ucapan & Doa Restu</label>
                                <textarea rows="3" required placeholder="Tuliskan ucapan doa terbaik..." class="block w-full px-3.5 py-2 bg-black/20 border border-emerald-500/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none"></textarea>
                            </div>
                            <button type="submit" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95 cursor-pointer">
                                Kirim Ucapan & RSVP
                            </button>
                        </form>
                    </div>

                    <!-- Wishes List Feed -->
                    <div class="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                        ${wishes.map(w => `
                            <div class="${theme.cardBg} border border-emerald-500/30 rounded-2xl p-4 space-y-1.5 shadow-md">
                                <div class="flex justify-between items-center">
                                    <span class="wedding-font-serif text-sm font-bold ${theme.cardTitle}">${w.name}</span>
                                    <span class="text-[9px] font-extrabold px-2 py-0.5 rounded-full ${w.status === 'Hadir' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}">
                                        ${w.status}
                                    </span>
                                </div>
                                <p class="${theme.cardDesc} text-xs leading-relaxed italic">"${w.message}"</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </section>
    `;
}
