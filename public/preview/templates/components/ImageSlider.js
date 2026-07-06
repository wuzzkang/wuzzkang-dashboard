/**
 * Reusable Image Slider (Carousel) component.
 * Built with Tailwind CSS classes and vanilla JavaScript for transitions and interactivity.
 */
export function renderImageSlider(containerId, imageUrls) {
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
        return { html: '', setup: () => {} };
    }

    const sliderId = `slider-${containerId}`;
    const prevBtnId = `prev-${containerId}`;
    const nextBtnId = `next-${containerId}`;
    const dotsId = `dots-${containerId}`;

    // Slides HTML
    const slidesHtml = imageUrls.map((url, index) => `
        <div class="slider-slide-${containerId} min-w-full h-72 md:h-[400px] transition-opacity duration-700 ease-in-out ${index === 0 ? 'opacity-100 block' : 'opacity-0 hidden'} relative">
            <img src="${url}" alt="Gallery Image ${index + 1}" class="w-full h-full object-cover rounded-3xl shadow-lg border border-white/10">
            <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-6 rounded-b-3xl">
                <span class="text-white/80 text-xs font-semibold tracking-wider font-sans">Galeri Kebahagiaan ${index + 1} dari ${imageUrls.length}</span>
            </div>
        </div>
    `).join('');

    // Indicators (Dots) HTML
    const indicatorsHtml = imageUrls.map((_, index) => `
        <button data-index="${index}" class="slider-dot-${containerId} w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === 0 ? 'bg-emerald-600 w-6' : 'bg-slate-300'}" aria-label="Slide ${index + 1}"></button>
    `).join('');

    // Final Slider Container HTML
    const html = `
        <div id="${sliderId}" class="relative w-full max-w-3xl mx-auto overflow-hidden group rounded-3xl shadow-xl bg-slate-900/5 p-1">
            <!-- Slides wrapper -->
            <div class="flex overflow-hidden relative rounded-3xl w-full">
                ${slidesHtml}
            </div>

            <!-- Navigation Buttons (Only if > 1 images) -->
            ${imageUrls.length > 1 ? `
                <button id="${prevBtnId}" class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 hover:text-black w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:outline-none backdrop-blur-sm active:scale-95 z-20">
                    <span class="text-lg">&#10094;</span>
                </button>
                <button id="${nextBtnId}" class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 hover:text-black w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:outline-none backdrop-blur-sm active:scale-95 z-20">
                    <span class="text-lg">&#10095;</span>
                </button>
            ` : ''}

            <!-- Indicators Tracker (Only if > 1 images) -->
            ${imageUrls.length > 1 ? `
                <div id="${dotsId}" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 shadow-md">
                    ${indicatorsHtml}
                </div>
            ` : ''}
        </div>
    `;

    // Interactivity JS Setup logic
    const setup = () => {
        if (imageUrls.length <= 1) return;

        const sliderEl = document.getElementById(sliderId);
        if (!sliderEl) return;

        const slides = sliderEl.querySelectorAll(`.slider-slide-${containerId}`);
        const dots = sliderEl.querySelectorAll(`.slider-dot-${containerId}`);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);

        let currentIndex = 0;
        let autoSlideInterval = null;

        const showSlide = (index) => {
            // Fade out current slide, fade in target slide
            slides.forEach((slide, idx) => {
                if (idx === index) {
                    slide.classList.remove('hidden', 'opacity-0');
                    slide.classList.add('block', 'opacity-100');
                } else {
                    slide.classList.remove('block', 'opacity-100');
                    slide.classList.add('hidden', 'opacity-0');
                }
            });

            // Update dot sizes and colors
            dots.forEach((dot, idx) => {
                if (idx === index) {
                    dot.classList.remove('bg-slate-300');
                    // Use theme color for the active dot
                    dot.classList.add('bg-emerald-600', 'w-6');
                } else {
                    dot.classList.remove('bg-emerald-600', 'w-6');
                    dot.classList.add('bg-slate-300');
                }
            });

            currentIndex = index;
        };

        const nextSlide = () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= imageUrls.length) nextIndex = 0;
            showSlide(nextIndex);
        };

        const prevSlide = () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) prevIndex = imageUrls.length - 1;
            showSlide(prevIndex);
        };

        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); });
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(dot.getAttribute('data-index'), 10);
                showSlide(index);
            });
        });

        // Auto-Slide behavior (every 6 seconds)
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(nextSlide, 6000);
        };

        const stopAutoSlide = () => {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
            }
        };

        startAutoSlide();

        // Pause auto-sliding on hover
        sliderEl.addEventListener('mouseenter', stopAutoSlide);
        sliderEl.addEventListener('mouseleave', startAutoSlide);
    };

    return { html, setup };
}
