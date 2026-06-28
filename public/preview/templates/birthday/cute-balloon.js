/**
 * Cute Balloon Birthday Invitation Template
 * Cheerful balloon theme, pastel colors, playful fonts, perfect for kids.
 */
export async function render(pageConfig, guestName = 'Tamu Undangan') {
    const appEl = document.getElementById('app');
    const content = pageConfig.content || {};
    const celebrant = content.celebrant || {};
    const event = content.event || {};
    const gift = content.gift || {};
    const quote = content.quote || 'Puji syukur kepada Tuhan YME atas bertambahnya usia putra/putri kami. Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam pesta perayaan ulang tahun.';

    const primary = '#FF8DA1'; // Pastel Pink
    const secondary = '#FFF0F3'; // Light Pink
    const accent = '#6C5B7B'; // Purple
    const bgLight = '#FFFDF9'; // Soft Cream

    // Inject fonts & styles
    if (!document.getElementById('cute-balloon-styles')) {
        const style = document.createElement('style');
        style.id = 'cute-balloon-styles';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Poppins:wght@300;400;500;600;700&display=swap');
            
            .balloon-title { font-family: 'Fredoka One', cursive; }
            .balloon-sans { font-family: 'Poppins', sans-serif; }
            
            body {
                background-color: ${bgLight};
                color: ${accent};
                font-family: 'Poppins', sans-serif;
            }

            .btn-balloon {
                background-color: ${primary};
                color: white;
                font-family: 'Fredoka One', cursive;
                transition: all 0.3s ease;
            }
            .btn-balloon:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 15px rgba(255, 141, 161, 0.4);
            }

            /* Balloon floating animation */
            .float-balloon {
                animation: float 4s ease-in-out infinite alternate;
            }
            @keyframes float {
                from { transform: translateY(0px); }
                to { transform: translateY(-15px); }
            }
        `;
        document.head.appendChild(style);
    }

    const defaultAvatar = '/bride-avatar.jpg'; // fallback avatar

    appEl.innerHTML = `
        <div class="w-full h-full flex flex-col overflow-y-auto text-center px-6 py-8 balloon-sans pb-24">
            
            <div class="my-6 py-6 border-b border-dashed border-pink-200 relative">
                <span class="text-[10px] tracking-widest uppercase font-bold text-pink-400">Kamu Diundang! 🎈</span>
                <h3 class="text-3xl balloon-title my-4 text-pink-500 float-balloon">Pesta Ulang Tahun</h3>
                <div class="text-[18px] font-extrabold text-slate-800">${celebrant.nickname || 'Anak'} yang ke-${celebrant.age || '1'}</div>
                
                <div class="mt-4">
                    <p class="text-[9px] text-slate-400 mb-1.5">Spesial untuk Bapak/Ibu/Teman:</p>
                    <div class="bg-white/80 border border-pink-100 rounded-full px-4 py-1.5 inline-block shadow-sm">
                        <div class="font-bold text-xs text-pink-600">${guestName}</div>
                    </div>
                </div>
            </div>

            <div class="my-6 flex flex-col items-center gap-4">
                <div class="w-28 h-28 rounded-full overflow-hidden border-4 border-pink-300 shadow-md float-balloon">
                    <img src="${celebrant.image_url || defaultAvatar}" class="w-full h-full object-cover" alt="Celebrant" />
                </div>
                <div>
                    <h4 class="font-bold text-xl text-pink-600 balloon-title">${celebrant.name || 'Nama Lengkap'}</h4>
                    ${celebrant.parent_name ? `<p class="text-xs text-slate-500 mt-1">Putra/Putri tercinta dari: <br/><span class="font-semibold text-slate-700">${celebrant.parent_name}</span></p>` : ''}
                </div>
            </div>

            <div class="my-4 px-4 py-3 bg-pink-50/50 rounded-2xl border border-pink-100 text-xs italic leading-relaxed text-slate-600">
                &ldquo;${quote}&rdquo;
            </div>

            <div class="my-6 p-5 bg-white border border-pink-100 rounded-3xl shadow-sm text-left relative overflow-hidden">
                <div class="absolute top-2 right-2 text-2xl">🍰</div>
                <h4 class="font-bold text-sm text-pink-600 mb-3 balloon-title">📅 Acara Ulang Tahun</h4>
                <div class="space-y-2.5 text-xs text-slate-600">
                    <div>
                        <div class="font-bold text-slate-800">Tanggal:</div>
                        <div>${event.date || 'TBA'}</div>
                    </div>
                    <div>
                        <div class="font-bold text-slate-800">Jam:</div>
                        <div>${event.time || 'TBA'}</div>
                    </div>
                    <div>
                        <div class="font-bold text-slate-800">Tempat:</div>
                        <div class="font-semibold text-slate-800">${event.location || 'TBA'}</div>
                    </div>
                </div>
                ${event.maps_url ? `
                    <a href="${event.maps_url}" target="_blank" class="mt-4 block w-full py-2 bg-pink-100 text-pink-600 hover:bg-pink-200 text-center rounded-xl text-xs font-bold transition-all">
                        📍 Lihat Peta Lokasi
                    </a>
                ` : ''}
            </div>

            ${gift.bank_name || gift.account_number ? `
                <div class="my-6 p-5 bg-white border border-pink-100 rounded-3xl shadow-sm text-left relative overflow-hidden">
                    <h4 class="font-bold text-sm text-pink-600 mb-3 balloon-title">🎁 Kado Ulang Tahun</h4>
                    <p class="text-[10px] text-slate-500 mb-3 leading-relaxed">
                        Terima kasih atas doa dan kehadiran Anda. Bagi yang ingin mengirimkan kado digital:
                    </p>
                    <div class="bg-pink-50/50 border border-pink-100 rounded-2xl p-4">
                        <div class="text-xs font-bold text-slate-800">${gift.bank_name || 'Bank'}</div>
                        <div class="text-sm font-bold text-pink-600 mt-1">${gift.account_number || '123-456'}</div>
                        <div class="text-[10px] text-slate-500 mt-0.5">a.n. ${gift.account_holder || '-'}</div>
                    </div>
                </div>
            ` : ''}

            <div class="mt-8 text-[9px] opacity-50">Siluet Birthday Template • Cute Balloon</div>
        </div>
    `;
}
