/**
 * Modular Section: Custom Feature / Step Cards Navy (V2 Preview)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const badgeText = data.badge_text || '';
    const title = data.title || '3 Langkah Mudah Membuat Landing Page Impian Anda';
    const subtitle = data.subtitle || 'Proses yang simple dan transparan dari awal hingga selesai';
    const cards = Array.isArray(data.cards) ? data.cards : [
        { badge: '1', title: 'Langkah 1: Mulai dengan Ide Anda', description: 'Cukup tentukan tujuan landing page Anda. Tidak perlu skill coding atau desain, kami akan memandu Anda.' },
        { badge: '2', title: 'Langkah 2: AI Berkreasi untuk Anda', description: 'Saksikan AI cerdas kami secara otomatis menciptakan desain menawan dan mengisi konten persuasif.' },
        { badge: '3', title: 'Langkah 3: Publikasikan & Raih Konversi', description: 'Landing page profesional Anda siap dalam hitungan menit! Publikasikan dengan mudah.' }
    ];

    const cardsHtml = cards.map((card, idx) => `
        <div class="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 text-center flex flex-col items-center hover:border-orange-500/30 transition-all shadow-xl hover:-translate-y-1">
            <div class="w-12 h-12 rounded-full bg-orange-500 text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                ${card.badge || (idx + 1)}
            </div>
            <h3 class="text-lg md:text-xl font-bold text-white mb-3 tracking-tight">${card.title || 'Judul Kartu'}</h3>
            <p class="text-slate-400 text-xs md:text-sm leading-relaxed">${card.description || 'Deskripsi singkat kartu'}</p>
        </div>
    `).join('');

    const gridColsClass = cards.length === 1 ? 'max-w-xl grid-cols-1' :
                          cards.length === 2 ? 'max-w-4xl grid-cols-1 md:grid-cols-2' :
                          cards.length === 4 ? 'max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                          'max-w-6xl grid-cols-1 md:grid-cols-3';

    return `
        <section id="custom" class="py-20 md:py-28 px-6 bg-slate-950 text-white border-b border-slate-900 relative overflow-hidden">
            <div class="max-w-6xl mx-auto text-center">
                <!-- Top Accent Line or Badge -->
                <div class="w-12 h-1 bg-orange-500 rounded-full mx-auto mb-4"></div>
                ${badgeText ? `
                    <span class="inline-block px-3.5 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                        ${badgeText}
                    </span>
                ` : ''}

                <!-- Main Heading & Subtitle -->
                <h2 class="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-4 max-w-3xl mx-auto leading-snug">
                    ${title}
                </h2>
                <p class="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-14 leading-relaxed">
                    ${subtitle}
                </p>

                <!-- Cards Grid -->
                <div class="grid ${gridColsClass} gap-6 mx-auto">
                    ${cardsHtml}
                </div>
            </div>
        </section>
    `;
}
