import { getSectionStyle } from '../../../utils/sectionStyle.js';

export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Doa Restu & Harapan Sahabat';
    const subtitle = data.subtitle || 'Ungkapkan pesan hangat dan doa restu untuk Fajar & Nadia';
    const wishes = data.wishes || [
        { name: 'Rina & Maya', status: 'Hadir', message: 'Happy wedding Nadia & Fajar! Semoga cinta kalian selalu mekar seperti bunga manis ini!' },
        { name: 'Keluarga Bpk. Irwan', status: 'Hadir', message: 'Selamat menempuh hidup baru anakku. Semoga selalu sakinah mawaddah warahmah.' }
    ];

    const bgStyle = data.bg_style || 'rose';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-wishes-rose-styles-${Math.random().toString(36).substr(2, 9)}`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Parisienne&family=Montserrat:ital,wght@0,300..900;1,300..900&display=swap');
            .wedding-font-serif { font-family: 'Montserrat', sans-serif; font-weight: 700; }
            .wedding-font-cursive { font-family: 'Parisienne', cursive; }
        </style>

        <section id="wedding_wishes" class="py-16 md:py-24 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-4xl mx-auto relative z-10">
                <div class="text-center mb-12">
                    <span class="text-xs font-bold text-rose-300 uppercase tracking-widest block mb-2 px-4 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 w-max mx-auto">🌸 GUESTBOOK & WISHES</span>
                    <h2 class="wedding-font-serif text-2xl md:text-4xl font-extrabold text-rose-100 mb-3 tracking-tight">${title}</h2>
                    <p class="${theme.subtitle} text-xs md:text-sm max-w-md mx-auto">${subtitle}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <!-- Wish Form -->
                    <div class="bg-rose-950/60 border border-rose-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
                        <h3 class="wedding-font-serif text-base font-extrabold text-rose-100 mb-4 flex items-center gap-2">
                            <span>✏️ Kirim Ucapan Doa</span>
                        </h3>
                        <form onsubmit="event.preventDefault(); alert('Terima kasih! Ucapan doa restu Anda telah terkirim.');" class="space-y-3">
                            <div>
                                <label class="block text-[10px] font-bold text-rose-300 uppercase tracking-wider mb-1">Nama Tamu / Keluarga</label>
                                <input type="text" required placeholder="e.g. Budi & Keluarga" class="block w-full px-3.5 py-2 bg-black/20 border border-rose-500/20 rounded-xl text-xs text-rose-100 placeholder-rose-200/40 focus:outline-none" />
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-rose-300 uppercase tracking-wider mb-1">Konfirmasi Kehadiran</label>
                                <select class="block w-full px-3.5 py-2 bg-black/20 border border-rose-500/20 rounded-xl text-xs text-rose-100 focus:outline-none">
                                    <option value="Hadir" class="bg-rose-950 text-rose-100">✅ Hadir</option>
                                    <option value="Ragu" class="bg-rose-950 text-rose-100">❓ Ragu-ragu</option>
                                    <option value="Maaf Tidak Bisa Hadir" class="bg-rose-950 text-rose-100">❌ Maaf Tidak Bisa Hadir</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-rose-300 uppercase tracking-wider mb-1">Pesan Ucapan & Doa Restu</label>
                                <textarea rows="3" required placeholder="Tuliskan ucapan doa terbaik..." class="block w-full px-3.5 py-2 bg-black/20 border border-rose-500/20 rounded-xl text-xs text-rose-100 placeholder-rose-200/40 focus:outline-none"></textarea>
                            </div>
                            <button type="submit" class="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95 cursor-pointer">
                                Kirim Ucapan & RSVP
                            </button>
                        </form>
                    </div>

                    <!-- Wishes List Feed -->
                    <div class="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                        ${wishes.map(w => `
                            <div class="bg-rose-950/60 border border-rose-500/30 rounded-2xl p-4 space-y-1.5 shadow-md">
                                <div class="flex justify-between items-center">
                                    <span class="wedding-font-serif text-sm font-bold text-rose-100">${w.name}</span>
                                    <span class="text-[9px] font-extrabold px-2 py-0.5 rounded-full ${w.status === 'Hadir' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'}">
                                        ${w.status}
                                    </span>
                                </div>
                                <p class="text-rose-200/80 text-xs leading-relaxed italic">"${w.message}"</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </section>
    `;
}
