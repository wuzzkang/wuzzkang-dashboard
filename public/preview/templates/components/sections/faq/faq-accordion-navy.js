/**
 * Modular Section: FAQ Accordion Navy (V2)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title !== undefined ? data.title : 'Pertanyaan Sering Diajukan (FAQ)';
    const subtitle = data.subtitle !== undefined ? data.subtitle : 'Temukan jawaban atas pertanyaan yang sering diajukan calon klien kami.';
    const list = Array.isArray(data) ? data : (Array.isArray(data.faqs) && data.faqs.length > 0 ? data.faqs : [
        { question: 'Berapa lama proses pengerjaan?', answer: 'Proses pengerjaan berkisar antara 1-3 hari kerja tergantung paket yang dipilih.' },
        { question: 'Apakah tersedia garansi revisi?', answer: 'Ya, kami menyediakan garansi revisi gratis sesuai dengan batas ketentuan tiap paket.' },
        { question: 'Bagaimana metode pembayarannya?', answer: 'Pembayaran dapat dilakukan melalui transfer bank lokal, Virtual Account, maupun QRIS secara aman.' },
    ]);

    const itemsHtml = list.map((item, idx) => `
        <div class="border border-slate-200 rounded-xl overflow-hidden mb-3 bg-white">
            <button onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('.faq-icon').classList.toggle('rotate-45');" class="w-full px-5 py-4 flex justify-between items-center text-left text-slate-900 font-bold text-sm md:text-base hover:bg-slate-50 transition-colors">
                <span>${item.question || ''}</span>
                <span class="faq-icon text-orange-500 font-bold text-lg transition-transform duration-200 ml-4">+</span>
            </button>
            <div class="hidden px-5 py-4 bg-slate-50 text-slate-600 text-xs md:text-sm leading-relaxed border-t border-slate-100">
                ${item.answer || ''}
            </div>
        </div>
    `).join('');

    return `
        <section id="faq" class="py-16 px-6 bg-white text-slate-800">
            <div class="max-w-4xl mx-auto text-center mb-12">
                <div class="w-12 h-1 bg-orange-500 rounded-full mx-auto mb-4"></div>
                <h2 class="text-2xl md:text-4xl font-extrabold text-slate-900 mb-3">${title}</h2>
                <p class="text-slate-500 text-sm md:text-base max-w-xl mx-auto">${subtitle}</p>
            </div>
            <div class="max-w-3xl mx-auto">
                ${itemsHtml}
            </div>
        </section>
    `;
}
