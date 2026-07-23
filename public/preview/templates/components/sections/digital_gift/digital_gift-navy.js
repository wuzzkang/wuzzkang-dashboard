import { getSectionStyle } from '../../../utils/sectionStyle.js';

export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Amplop Digital & Tanda Kasih';
    const subtitle = data.subtitle || 'Doa restu Anda merupakan hadiah terindah bagi kami. Bagi keluarga yang ingin memberikan tanda kasih secara cashless:';
    
    const bankAccounts = Array.isArray(data.bank_accounts) && data.bank_accounts.length > 0 ? data.bank_accounts : [
        { bank_name: 'Bank BCA', account_number: '1234567890', account_holder: 'Romeo Adiputra' },
        { bank_name: 'Bank Mandiri', account_number: '0987654321', account_holder: 'Juliet Saraswati' }
    ];
    
    const qrisUrl = data.qris_image_url || '';
    const rsvpWhatsapp = data.rsvp_whatsapp || data.whatsapp || '';

    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const styleId = `digital-gift-styles-${Math.random().toString(36).substr(2, 9)}`;

    const accountsHtml = bankAccounts.map((acc, idx) => `
        <div class="bg-slate-900/70 border border-amber-500/30 rounded-3xl p-6 text-center flex flex-col items-center justify-between shadow-xl relative z-10 transition-all hover:-translate-y-1">
            <div class="w-12 h-12 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20 flex items-center justify-center text-xl font-bold mb-4">
                💳
            </div>
            <span class="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">${acc.bank_name || 'Bank'}</span>
            <span class="text-lg md:text-xl font-black ${theme.cardTitle} tracking-wider my-1 select-all font-mono">${acc.account_number || '1234567890'}</span>
            <span class="${theme.cardDesc} text-xs mb-5">a.n ${acc.account_holder || 'Nama Pemilik'}</span>
            
            <button
                type="button"
                onclick="navigator.clipboard.writeText('${acc.account_number}'); this.innerText='✓ Tersalin!'; setTimeout(()=>this.innerText='📋 Salin No. Rekening', 2000);"
                class="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 w-full py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
            >
                📋 Salin No. Rekening
            </button>
        </div>
    `).join('');

    return `
        <style id="${styleId}">
            @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
            .wedding-font-serif { font-family: 'Playfair Display', serif; }
            .wedding-font-cursive { font-family: 'Great Vibes', cursive; }
        </style>

        <section id="digital_gift" class="py-20 md:py-28 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-5xl mx-auto text-center relative z-10">
                <div class="w-12 h-1 bg-amber-400 rounded-full mx-auto mb-4"></div>
                <h2 class="wedding-font-serif text-2xl md:text-4xl font-extrabold ${theme.heading} tracking-tight mb-3 leading-snug">
                    ${title}
                </h2>
                <p class="${theme.subtitle} text-xs md:text-sm max-w-2xl mx-auto mb-12 leading-relaxed">
                    ${subtitle}
                </p>

                <!-- Bank Accounts Grid -->
                <div class="grid grid-cols-1 md:grid-cols-${Math.min(bankAccounts.length, 3)} gap-6 max-w-4xl mx-auto mb-12">
                    ${accountsHtml}
                </div>

                ${qrisUrl ? `
                    <div class="bg-slate-900/70 border border-amber-500/30 rounded-3xl p-6 max-w-sm mx-auto mb-12 text-center shadow-xl">
                        <span class="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-3">Scan QRIS All Payment</span>
                        <img src="${qrisUrl}" alt="QRIS Digital Gift" class="w-48 h-48 object-contain rounded-2xl mx-auto border border-slate-700 bg-white p-2 shadow-inner" />
                    </div>
                ` : ''}

                ${rsvpWhatsapp ? `
                    <div class="pt-6 border-t border-slate-800/60 max-w-xl mx-auto">
                        <p class="${theme.subtitle} text-xs mb-4">Ingin mengonfirmasi kehadiran atau mengirim ucapan doa restu?</p>
                        <a href="https://wa.me/${rsvpWhatsapp.replace(/[^0-9]/g, '')}?text=Halo,%20saya%20ingin%20mengonfirmasi%20kehadiran%20di%20acara%20pernikahan..." target="_blank" rel="noopener noreferrer" class="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-8 py-3 rounded-full text-xs font-black inline-flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
                            <span>💬 Konfirmasi Kehadiran via WhatsApp</span>
                        </a>
                    </div>
                ` : ''}
            </div>
        </section>
    `;
}
