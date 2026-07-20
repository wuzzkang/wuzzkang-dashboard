/**
 * Modular Section: Services Grid Navy (V2)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title !== undefined ? data.title : 'Layanan Terbaik Kami';
    const rawList = Array.isArray(data.items) ? data.items : (Array.isArray(data.list) ? data.list : null);
    const list = rawList && rawList.length > 0 ? rawList : [
        { name: 'Konsultasi Strategi', desc: 'Analisis kebutuhan dan perencanaan langkah strategis bisnis.' },
        { name: 'Pengembangan Solusi Digital', desc: 'Pembuatan platform digital berperforma tinggi dan responsif.' },
        { name: 'Pendampingan & Dukungan', desc: 'Layanan dukungan berkelanjutan untuk memastikan stabilitas.' },
    ];

    const serviceIcons = ['💼', '🎨', '⚙️', '📈', '🚀', '💡'];

    const cardsHtml = list.map((svc, idx) => `
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="w-14 h-14 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-2xl font-bold mb-4">
                ${serviceIcons[idx % serviceIcons.length]}
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">${svc.name || svc.title || ''}</h3>
            <p class="text-slate-600 text-sm leading-relaxed mb-4">${svc.desc || svc.description || ''}</p>
            ${Array.isArray(svc.features) && svc.features.length > 0 ? `
                <ul class="space-y-1.5 pt-3 border-t border-slate-100">
                    ${svc.features.map(f => `
                        <li class="text-xs text-slate-700 flex items-center gap-2">
                            <span class="text-orange-500 font-bold">✓</span> ${f}
                        </li>
                    `).join('')}
                </ul>
            ` : ''}
        </div>
    `).join('');

    return `
        <section id="services" class="py-16 px-6 bg-white text-slate-800">
            <div class="max-w-6xl mx-auto text-center mb-12">
                <div class="w-12 h-1 bg-orange-500 rounded-full mx-auto mb-4"></div>
                <h2 class="text-2xl md:text-4xl font-extrabold text-slate-900 mb-3">${title}</h2>
                <p class="text-slate-500 text-sm md:text-base max-w-xl mx-auto">Solusi lengkap yang dirancang khusus untuk mempercepat pertumbuhan bisnis Anda.</p>
            </div>
            <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                ${cardsHtml}
            </div>
        </section>
    `;
}
