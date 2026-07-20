/**
 * Modular Section: Contact Footer Navy (V2)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title !== undefined ? data.title : 'Siap Mengembangkan Bisnis Anda?';
    const subheadline = data.subheadline !== undefined ? data.subheadline : 'Hubungi tim kami sekarang juga untuk konsultasi gratis dan penawaran khusus.';
    const whatsapp = data.whatsapp || '';
    const email = data.email || 'support@wuzzkang.com';
    const address = data.address || 'Jakarta, Indonesia';
    const copyright = data.copyright || `© ${new Date().getFullYear()} ${brandConfig.name || 'Wuzzkang'}. All Rights Reserved.`;

    const cleanWa = whatsapp.replace(/\D/g, '');
    const waUrl = cleanWa ? `https://wa.me/${cleanWa}?text=${encodeURIComponent('Halo, saya berminat dengan layanan Anda.')}` : '#';

    return `
        <section id="contact" class="py-16 px-6 bg-slate-900 text-white">
            <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12 border-b border-slate-800 pb-12">
                <div>
                    <div class="inline-block bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                        Kontak & Konsultasi
                    </div>
                    <h2 class="text-2xl md:text-4xl font-extrabold text-white mb-4">${title}</h2>
                    <p class="text-slate-400 text-sm md:text-base leading-relaxed mb-6">${subheadline}</p>
                    ${cleanWa ? `
                        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all">
                            <span>💬 Hubungi via WhatsApp</span>
                        </a>
                    ` : ''}
                </div>
                <div class="space-y-4 text-sm text-slate-300 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                    <div class="flex items-center gap-3">
                        <span class="text-orange-400 text-lg">📧</span>
                        <span>${email}</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-orange-400 text-lg">📍</span>
                        <span>${address}</span>
                    </div>
                </div>
            </div>
            <div class="max-w-6xl mx-auto text-center text-xs text-slate-500">
                ${copyright}
            </div>
        </section>
    `;
}
