import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: FAQ Accordion Navy (V2 Preview)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Pertanyaan yang Sering Diajukan (FAQ)';
    const subtitle = data.subtitle || 'Temukan jawaban cepat untuk hal-hal yang sering ditanyakan seputar layanan kami.';
    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';

    const faqs = Array.isArray(data.faqs) ? data.faqs : [
        { q: 'Berapa lama proses pengerjaan landing page?', a: 'Proses pengerjaan cepat hanya membutuhkan waktu 1-3 hari kerja setelah materi dan brief lengkap kami terima.' },
        { q: 'Apakah saya bisa mengubah konten di kemudian hari?', a: 'Ya tentu! Kami memberikan akses penuh dan panduan mudah agar Anda dapat mengedit teks & gambar kapan saja.' },
        { q: 'Apakah harga sudah termasuk domain dan hosting?', a: 'Benar, semua paket kami sudah include domain pilihan Anda (.com / .id) serta cloud hosting super cepat selama 1 tahun.' }
    ];

    const { theme, sectionBgClass, patternHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default');

    const faqsHtml = faqs.map((faq, idx) => `
        <details className="group ${theme.faqBg} border rounded-2xl p-5 md:p-6 transition-all duration-300 relative z-10 cursor-pointer">
            <summary className="flex justify-between items-center font-bold text-sm md:text-base ${theme.heading} list-none">
                <span>${faq.q || faq.question || 'Pertanyaan FAQ'}</span>
                <span className="text-orange-500 font-extrabold text-lg transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="${theme.subtitle} text-xs md:text-sm leading-relaxed mt-4 pt-4 border-t border-white/10">
                ${faq.a || faq.answer || 'Jawaban FAQ'}
            </p>
        </details>
    `).join('');

    return `
        <section id="faq" class="py-20 md:py-28 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            <div class="max-w-4xl mx-auto text-center relative z-10">
                <div class="w-12 h-1 ${theme.topLine} rounded-full mx-auto mb-4"></div>
                <h2 class="text-2xl md:text-4xl font-extrabold ${theme.heading} tracking-tight mb-4 max-w-2xl mx-auto leading-snug">
                    ${title}
                </h2>
                <p class="${theme.subtitle} text-sm md:text-base max-w-xl mx-auto mb-14 leading-relaxed">
                    ${subtitle}
                </p>

                <div class="space-y-4 text-left">
                    ${faqsHtml}
                </div>
            </div>
        </section>
    `;
}
