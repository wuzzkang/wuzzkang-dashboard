/**
 * Modular Section: Custom Feature / Step Cards Navy (V2 Preview)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const badgeText = data.badge_text || '';
    const title = data.title || '3 Langkah Mudah Membuat Landing Page Impian Anda';
    const subtitle = data.subtitle || 'Proses yang simple dan transparan dari awal hingga selesai';
    const bgStyle = data.bg_style || 'navy';
    const cards = Array.isArray(data.cards) ? data.cards : [
        { badge: '1', title: 'Langkah 1: Mulai dengan Ide Anda', description: 'Cukup tentukan tujuan landing page Anda. Tidak perlu skill coding atau desain, kami akan memandu Anda.' },
        { badge: '2', title: 'Langkah 2: AI Berkreasi untuk Anda', description: 'Saksikan AI cerdas kami secara otomatis menciptakan desain menawan dan mengisi konten persuasif.' },
        { badge: '3', title: 'Langkah 3: Publikasikan & Raih Konversi', description: 'Landing page profesional Anda siap dalam hitungan menit! Publikasikan dengan mudah.' }
    ];

    const themes = {
        navy: {
            section: 'bg-slate-950 text-white border-b border-slate-900',
            topLine: 'bg-orange-500',
            badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
            heading: 'text-white',
            subtitle: 'text-slate-400',
            cardBg: 'bg-slate-900/60 border-slate-800 hover:border-orange-500/30',
            cardNum: 'bg-orange-500 text-white shadow-orange-500/20',
            cardTitle: 'text-white',
            cardDesc: 'text-slate-400'
        },
        obsidian: {
            section: 'bg-black text-white border-b border-zinc-900',
            topLine: 'bg-orange-500',
            badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
            heading: 'text-white',
            subtitle: 'text-zinc-400',
            cardBg: 'bg-zinc-900/70 border-zinc-800 hover:border-orange-500/30',
            cardNum: 'bg-orange-500 text-white shadow-orange-500/20',
            cardTitle: 'text-white',
            cardDesc: 'text-zinc-400'
        },
        indigo: {
            section: 'bg-slate-950 text-white border-b border-indigo-950/60',
            topLine: 'bg-indigo-500',
            badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
            heading: 'text-white',
            subtitle: 'text-slate-300',
            cardBg: 'bg-indigo-950/50 border-indigo-900/60 hover:border-indigo-500/40',
            cardNum: 'bg-indigo-500 text-white shadow-indigo-500/20',
            cardTitle: 'text-white',
            cardDesc: 'text-slate-300'
        },
        emerald: {
            section: 'bg-slate-950 text-white border-b border-emerald-950/60',
            topLine: 'bg-emerald-500',
            badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            heading: 'text-white',
            subtitle: 'text-emerald-100/70',
            cardBg: 'bg-emerald-950/40 border-emerald-900/50 hover:border-emerald-500/40',
            cardNum: 'bg-emerald-500 text-white shadow-emerald-500/20',
            cardTitle: 'text-white',
            cardDesc: 'text-emerald-200/70'
        },
        light: {
            section: 'bg-slate-50 text-slate-900 border-b border-slate-200',
            topLine: 'bg-orange-500',
            badge: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
            heading: 'text-slate-900',
            subtitle: 'text-slate-600',
            cardBg: 'bg-white border-slate-200 hover:border-orange-500/40 shadow-sm hover:shadow-md',
            cardNum: 'bg-orange-500 text-white shadow-orange-500/20',
            cardTitle: 'text-slate-900',
            cardDesc: 'text-slate-600'
        }
    };

    const theme = themes[bgStyle] || themes.navy;

    const cardsHtml = cards.map((card, idx) => `
        <div class="${theme.cardBg} border rounded-3xl p-6 md:p-8 text-center flex flex-col items-center transition-all shadow-xl hover:-translate-y-1">
            <div class="w-12 h-12 rounded-full ${theme.cardNum} font-extrabold text-lg flex items-center justify-center mb-6 shadow-lg">
                ${card.badge || (idx + 1)}
            </div>
            <h3 class="text-lg md:text-xl font-bold ${theme.cardTitle} mb-3 tracking-tight">${card.title || 'Judul Kartu'}</h3>
            <p class="${theme.cardDesc} text-xs md:text-sm leading-relaxed">${card.description || 'Deskripsi singkat kartu'}</p>
        </div>
    `).join('');

    const gridColsClass = cards.length === 1 ? 'max-w-xl grid-cols-1' :
                          cards.length === 2 ? 'max-w-4xl grid-cols-1 md:grid-cols-2' :
                          cards.length === 4 ? 'max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                          'max-w-6xl grid-cols-1 md:grid-cols-3';

    return `
        <section id="custom" class="py-20 md:py-28 px-6 ${theme.section} relative overflow-hidden">
            <div class="max-w-6xl mx-auto text-center">
                <!-- Top Accent Line or Badge -->
                <div class="w-12 h-1 ${theme.topLine} rounded-full mx-auto mb-4"></div>
                ${badgeText ? `
                    <span class="inline-block px-3.5 py-1 ${theme.badge} border text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                        ${badgeText}
                    </span>
                ` : ''}

                <!-- Main Heading & Subtitle -->
                <h2 class="text-2xl md:text-4xl font-extrabold ${theme.heading} tracking-tight mb-4 max-w-3xl mx-auto leading-snug">
                    ${title}
                </h2>
                <p class="${theme.subtitle} text-sm md:text-base max-w-2xl mx-auto mb-14 leading-relaxed">
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
