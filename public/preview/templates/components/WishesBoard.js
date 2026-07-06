/**
 * WishesBoard Component
 * Reusable Guestbook and RSVP Form component for wedding invitations.
 */
export function initWishesBoard(containerEl, pageConfig, guestName, designStyles = {}) {
    if (!containerEl) return;

    const wishesKey = `wishes_${pageConfig.meta?.title || 'wedding'}`;
    const primaryColor = designStyles.primaryColor || '#5A7C64';
    const bgLight = designStyles.bgLight || '#F4F7F4';
    const borderColor = designStyles.borderColor || '#E2ECE4';
    const buttonClass = designStyles.buttonClass || 'btn-sage-primary';

    // Seed wishes in localStorage if not exists
    let savedWishes = JSON.parse(localStorage.getItem(wishesKey));
    if (!savedWishes) {
        savedWishes = [
            { name: 'Keluarga Budiarjo', status: 'Hadir', wish: 'Selamat menempuh hidup baru untuk kedua mempelai! Semoga menjadi keluarga yang sakinah, mawaddah, dan warahmah. Amin.', sticker: '🌸', time: '2 jam yang lalu' },
            { name: 'Siti & Rian', status: 'Hadir', wish: 'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khair. Bahagia selalu ya kalian!', sticker: '❤️', time: '5 jam yang lalu' },
            { name: 'Ahmad Faisal', status: 'Ragu-ragu', wish: 'Selamat ya bro! InsyaAllah hadir kalau tidak ada kendala. Semoga lancar acaranya.', sticker: '🎉', time: '1 hari yang lalu' }
        ];
        localStorage.setItem(wishesKey, JSON.stringify(savedWishes));
    }

    const stickers = ['❤️', '🌸', '💍', '🎉', '🥂'];
    let selectedSticker = '🌸';

    // Render HTML
    containerEl.innerHTML = `
        <div class="max-w-3xl mx-auto">
            <div class="text-center mb-12">
                <span class="tracking-[0.2em] uppercase text-xs font-bold" style="color: ${primaryColor}">Ulem Ulem</span>
                <h2 class="text-5xl mt-2 mb-4" style="color: ${primaryColor}; font-family: inherit;">Konfirmasi Kehadiran & Doa</h2>
                <p class="text-sm text-slate-500 max-w-md mx-auto">Kehadiran serta doa restu panjenengan sekalian anggadhahi arti ingkang ageng kagem kawula.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <!-- RSVP Form Card -->
                <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h3 class="text-lg font-bold text-slate-800 mb-6" style="font-family: inherit;">Kirim Ucapan</h3>
                    <form id="rsvp-form" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Anda</label>
                            <input type="text" id="rsvp-name" required value="${guestName !== 'Tamu Undangan' && guestName !== 'Tamu' ? guestName : ''}" placeholder="Nama lengkap Anda..." class="w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none transition-colors text-slate-700" style="background-color: ${bgLight}; border-color: ${borderColor};">
                        </div>
                        
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Konfirmasi Kehadiran</label>
                            <select id="rsvp-status" required class="w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none transition-colors text-slate-700" style="background-color: ${bgLight}; border-color: ${borderColor};">
                                <option value="Hadir">Saya akan Hadir</option>
                                <option value="Tidak Hadir">Maaf, tidak bisa Hadir</option>
                                <option value="Ragu-ragu">Masih Ragu-ragu</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Sticker Hiasan</label>
                            <div class="flex gap-3 justify-between py-1" id="sticker-selector">
                                ${stickers.map((stk) => `
                                    <button type="button" data-sticker="${stk}" class="sticker-btn text-2xl p-2 rounded-xl border hover:scale-115 transition-transform focus:outline-none" style="background-color: ${bgLight}; border-color: ${borderColor};">${stk}</button>
                                `).join('')}
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ucapan & Doa</label>
                            <textarea id="rsvp-wish" required rows="4" placeholder="Tulis doa restu terbaik untuk kedua mempelai..." class="w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none transition-colors text-slate-700" style="background-color: ${bgLight}; border-color: ${borderColor};"></textarea>
                        </div>

                        <button type="submit" class="w-full py-3.5 rounded-full text-sm font-bold tracking-wider mt-4 text-white transition-all hover:opacity-90 ${buttonClass}">
                            KIRIM UCAPAN
                        </button>
                    </form>
                </div>

                <!-- Wishes Guestbook List -->
                <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-[500px]">
                    <h3 class="text-lg font-bold text-slate-800 mb-6 flex justify-between items-center" style="font-family: inherit;">
                        <span>Buku Tamu</span>
                        <span class="text-xs px-2.5 py-1 rounded-full font-bold" id="wishes-count" style="background-color: ${primaryColor}15; color: ${primaryColor}">0</span>
                    </h3>
                    <!-- Scrolling Container -->
                    <div class="flex-grow overflow-y-auto space-y-4 pr-2" id="wishes-list-container">
                        <!-- Dynamically populated -->
                    </div>
                </div>
            </div>
        </div>
    `;

    // Hook listeners
    const rsvpForm = containerEl.querySelector('#rsvp-form');
    const rsvpName = containerEl.querySelector('#rsvp-name');
    const rsvpStatus = containerEl.querySelector('#rsvp-status');
    const rsvpWish = containerEl.querySelector('#rsvp-wish');
    const wishesContainer = containerEl.querySelector('#wishes-list-container');
    const wishesCountEl = containerEl.querySelector('#wishes-count');
    const stickerBtns = containerEl.querySelectorAll('.sticker-btn');

    // Default active sticker border styling
    const applyStickerBorder = (btn) => {
        stickerBtns.forEach(b => {
            b.style.borderColor = borderColor;
            b.style.boxShadow = '';
        });
        btn.style.borderColor = primaryColor;
        btn.style.boxShadow = `0 0 0 2px ${primaryColor}22`;
    };

    // Initialize default sticker border (index 1 = '🌸')
    if (stickerBtns[1]) applyStickerBorder(stickerBtns[1]);

    stickerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            applyStickerBorder(btn);
            selectedSticker = btn.getAttribute('data-sticker');
        });
    });

    const renderWishes = () => {
        const currentWishes = JSON.parse(localStorage.getItem(wishesKey)) || [];
        wishesCountEl.innerText = currentWishes.length;

        if (currentWishes.length === 0) {
            wishesContainer.innerHTML = `<div class="text-center text-xs text-slate-400 py-12">Belum ada ucapan. Jadilah yang pertama!</div>`;
            return;
        }

        wishesContainer.innerHTML = currentWishes.map(w => {
            const statusBadgeColor = w.status === 'Hadir' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                : w.status === 'Tidak Hadir' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100';

            return `
                <div class="rounded-2xl p-4 border relative hover:shadow-sm transition-shadow" style="background-color: ${bgLight}; border-color: ${borderColor}">
                    <div class="absolute right-4 top-4 text-2xl">${w.sticker || '🌸'}</div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="font-bold text-sm text-slate-800">${w.name}</span>
                        <span class="text-[10px] font-semibold px-2 py-0.5 border rounded-full ${statusBadgeColor}">${w.status}</span>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed mb-2 pr-6">${w.wish}</p>
                    <span class="text-[9px] text-slate-400 font-medium">${w.time || 'Baru saja'}</span>
                </div>
            `;
        }).join('');
    };

    renderWishes();

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = rsvpName.value.trim();
        const statusSelect = rsvpStatus.value;
        const wishText = rsvpWish.value.trim();

        if (!nameInput || !wishText) return;

        const newWish = {
            name: nameInput,
            status: statusSelect,
            wish: wishText,
            sticker: selectedSticker,
            time: 'Baru saja'
        };

        const currentWishes = JSON.parse(localStorage.getItem(wishesKey)) || [];
        currentWishes.unshift(newWish);
        localStorage.setItem(wishesKey, JSON.stringify(currentWishes));

        rsvpWish.value = '';
        renderWishes();
        wishesContainer.scrollTop = 0;
    });
}
