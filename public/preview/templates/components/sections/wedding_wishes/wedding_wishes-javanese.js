import { getSectionStyle } from '../../../utils/sectionStyle.js';

export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Buku Tamu & Donga Pangestu';
    const subtitle = data.subtitle || 'Kirimaken donga pangestu wilujeng kangge kapindho mempelai';
    const wishes = data.wishes || [
        { name: 'Bpk. KRT Sumodiningrat', status: 'Hadir', message: 'Nderek bingah atas pawiwahan Raden & Dewi. Mugi dados keluarga ingkang sakinah lan langgeng.' },
        { name: 'Keluarga Bpk. Haryono', status: 'Hadir', message: 'Matur nuwun serat ulemipun. Mugi acara lumampah kanthi lancar tanpa alangan.' }
    ];

    const bgStyle = data.bg_style || 'amber';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `wedding-wishes-javanese-styles-${Math.random().toString(36).substr(2, 9)}`;

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Pinyon+Script&display=swap');
            .wedding-font-serif { font-family: 'Cinzel', serif; }
            .wedding-font-cursive { font-family: 'Pinyon Script', cursive; }
        </style>

        <section id="wedding_wishes" class="py-16 md:py-24 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-4xl mx-auto relative z-10">
                <div class="text-center mb-12">
                    <span class="text-xs font-bold text-amber-300 uppercase tracking-widest block mb-2 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 w-max mx-auto">🪷 DONGA PANGESTU</span>
                    <h2 class="wedding-font-serif text-3xl md:text-5xl font-extrabold text-amber-100 mb-3 tracking-tight">${title}</h2>
                    <p class="${theme.subtitle} text-xs md:text-sm max-w-md mx-auto">${subtitle}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <!-- Wish Form -->
                    <div class="bg-amber-950/70 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl relative">
                        <div class="absolute inset-1 border border-amber-500/20 rounded-2xl pointer-events-none"></div>
                        <h3 class="wedding-font-serif text-lg font-extrabold text-amber-100 mb-4 flex items-center gap-2">
                            <span>✏️ Kirim Donga Pangestu</span>
                        </h3>
                        <form onsubmit="event.preventDefault(); alert('Matur nuwun! Donga pangestu panjenengan sampun terkirim.');" class="space-y-3">
                            <div>
                                <label class="block text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">Asma Tamu / Tiyang Sepuh</label>
                                <input type="text" required placeholder="e.g. Budi & Keluarga" class="block w-full px-3.5 py-2 bg-black/20 border border-amber-500/20 rounded-xl text-xs text-amber-100 placeholder-amber-200/40 focus:outline-none" />
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">Konfirmasi Rawuh</label>
                                <select class="block w-full px-3.5 py-2 bg-black/20 border border-amber-500/20 rounded-xl text-xs text-amber-100 focus:outline-none">
                                    <option value="Hadir" class="bg-amber-950 text-amber-100">✅ Rawuh / Hadir</option>
                                    <option value="Ragu" class="bg-amber-950 text-amber-100">❓ Ragu-ragu</option>
                                    <option value="Maaf Tidak Bisa Hadir" class="bg-amber-950 text-amber-100">❌ Nyuwun Pangeksama Mboten Saged Rawuh</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">Pesen Donga Pangestu</label>
                                <textarea rows="3" required placeholder="Serataken donga pangestu paling sae..." class="block w-full px-3.5 py-2 bg-black/20 border border-amber-500/20 rounded-xl text-xs text-amber-100 placeholder-amber-200/40 focus:outline-none"></textarea>
                            </div>
                            <button type="submit" class="w-full py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95 cursor-pointer">
                                Kirim Donga Pangestu
                            </button>
                        </form>
                    </div>

                    <!-- Wishes List Feed -->
                    <div class="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                        ${wishes.map(w => `
                            <div class="bg-amber-950/70 border-2 border-amber-500/40 rounded-2xl p-4 space-y-1.5 shadow-md relative">
                                <div class="absolute inset-1 border border-amber-500/10 rounded-xl pointer-events-none"></div>
                                <div class="flex justify-between items-center">
                                    <span class="wedding-font-serif text-sm font-bold text-amber-100">${w.name}</span>
                                    <span class="text-[9px] font-extrabold px-2 py-0.5 rounded-full ${w.status === 'Hadir' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'}">
                                        ${w.status}
                                    </span>
                                </div>
                                <p class="text-amber-200/80 text-xs leading-relaxed italic">"${w.message}"</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </section>
    `;
}
