/**
 * Faq Component
 * Reusable FAQ (Frequently Asked Questions) accordion component.
 */
export function initFaq(containerEl, faqs, options = {}) {
    if (!containerEl) return;
    if (!Array.isArray(faqs) || faqs.length === 0) {
        containerEl.innerHTML = '';
        return;
    }

    const theme = options.theme || 'clean-trust';
    const title = options.title || 'Pertanyaan yang Sering Diajukan (FAQ)';
    const subtitle = options.subtitle || 'Temukan jawaban cepat untuk pertanyaan-pertanyaan umum Anda.';

    // Setup styles based on theme
    let containerClass = 'max-w-3xl mx-auto w-full';
    let cardClass = '';
    let questionClass = '';
    let answerClass = '';
    let arrowClass = '';
    let sectionTitleClass = '';
    let sectionSubtitleClass = '';

    if (theme === 'neon-conversion') {
        sectionTitleClass = 'text-2xl md:text-4xl font-black text-white text-center';
        sectionSubtitleClass = 'text-xs text-gray-505 text-center mt-2';
        cardClass = 'bg-gray-900/60 border border-gray-800 rounded-2xl mb-4 overflow-hidden transition-all duration-300';
        questionClass = 'flex justify-between items-center w-full p-5 text-left text-sm md:text-base font-bold text-white hover:text-pink-400 transition-colors cursor-pointer select-none';
        answerClass = 'p-5 pt-0 text-xs md:text-sm text-gray-400 leading-relaxed border-t border-gray-850/50 hidden';
        arrowClass = 'text-pink-500 transition-transform duration-300 text-lg';
    } else {
        // clean-trust default
        sectionTitleClass = 'text-2xl md:text-4xl font-extrabold text-slate-900 text-center';
        sectionSubtitleClass = 'text-xs text-slate-500 text-center mt-2';
        cardClass = 'bg-white border border-slate-200 rounded-2xl mb-4 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md';
        questionClass = 'flex justify-between items-center w-full p-5 text-left text-sm md:text-base font-bold text-slate-800 hover:text-teal-600 transition-colors cursor-pointer select-none';
        answerClass = 'p-5 pt-0 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-100 hidden';
        arrowClass = 'text-teal-600 transition-transform duration-300 text-lg';
    }

    let faqItemsHtml = faqs.map((faq, index) => {
        return `
            <div class="${cardClass}" data-faq-index="${index}">
                <button type="button" class="${questionClass}" aria-expanded="false">
                    <span>${faq.question}</span>
                    <span class="${arrowClass}">▼</span>
                </button>
                <div class="${answerClass}">
                    ${faq.answer}
                </div>
            </div>
        `;
    }).join('');

    containerEl.innerHTML = `
        <div class="${containerClass}">
            <div class="text-center mb-10">
                <h3 class="${sectionTitleClass}">${title}</h3>
                <p class="${sectionSubtitleClass}">${subtitle}</p>
                ${theme === 'neon-conversion' ? '<div class="h-1 w-12 bg-pink-500 mx-auto rounded-full mt-3"></div>' : ''}
            </div>
            <div class="space-y-3">
                ${faqItemsHtml}
            </div>
        </div>
    `;

    // Add interactivity
    const cards = containerEl.querySelectorAll('[data-faq-index]');
    cards.forEach(card => {
        const btn = card.querySelector('button');
        const content = card.querySelector('div');
        const arrow = card.querySelector('span:last-child');

        btn.addEventListener('click', () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';

            // Close all other FAQs (accordion behavior)
            cards.forEach(otherCard => {
                if (otherCard !== card) {
                    const otherBtn = otherCard.querySelector('button');
                    const otherContent = otherCard.querySelector('div');
                    const otherArrow = otherCard.querySelector('span:last-child');
                    
                    otherBtn.setAttribute('aria-expanded', 'false');
                    otherContent.classList.add('hidden');
                    otherArrow.style.transform = 'rotate(0deg)';
                    if (theme === 'neon-conversion') {
                        otherCard.classList.remove('border-pink-500/50', 'bg-gray-900/80');
                    } else {
                        otherCard.classList.remove('border-teal-500', 'bg-slate-50/50');
                    }
                }
            });

            // Toggle current
            if (isExpanded) {
                btn.setAttribute('aria-expanded', 'false');
                content.classList.add('hidden');
                arrow.style.transform = 'rotate(0deg)';
                if (theme === 'neon-conversion') {
                    card.classList.remove('border-pink-500/50', 'bg-gray-900/80');
                } else {
                    card.classList.remove('border-teal-500', 'bg-slate-50/50');
                }
            } else {
                btn.setAttribute('aria-expanded', 'true');
                content.classList.remove('hidden');
                arrow.style.transform = 'rotate(180deg)';
                if (theme === 'neon-conversion') {
                    card.classList.add('border-pink-500/50', 'bg-gray-900/80');
                } else {
                    card.classList.add('border-teal-500', 'bg-slate-50/50');
                }
            }
        });
    });
}
