/**
 * Elegant Gold Birthday Invitation Template
 * Luxury dark-gold theme, serif fonts, perfect for adult/teenagers celebrations.
 */
export async function render(pageConfig, guestName = 'Tamu Undangan') {
    const appEl = document.getElementById('app');
    const content = pageConfig.content || {};
    const celebrant = content.celebrant || {};
    const event = content.event || {};
    const gift = content.gift || {};
    const quote = content.quote || 'As we celebrate this milestone birthday, we request the honor of your presence to share in our joy and celebrations.';

    const gold = '#D4AF37'; // Gold
    const bgDark = '#121212'; // Slate dark
    const cardBg = '#1E1E1E'; // Off-black
    const borderGold = '#2E2818'; // Dark gold border

    // Inject fonts & styles
    if (!document.getElementById('elegant-gold-styles')) {
        const style = document.createElement('style');
        style.id = 'elegant-gold-styles';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:wght@300;400;500;600;700&display=swap');
            
            .gold-title { font-family: 'Playfair Display', serif; }
            .gold-sans { font-family: 'Poppins', sans-serif; }
            
            body {
                background-color: ${bgDark};
                color: #FFFFFF;
                font-family: 'Poppins', sans-serif;
            }

            .border-gold-custom {
                border-color: ${gold};
            }

            /* Gold shining text */
            .shining-gold {
                background: linear-gradient(135deg, #CF9E41 0%, #F5DE7A 50%, #CF9E41 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        `;
        document.head.appendChild(style);
    }

    const defaultAvatar = '/groom-avatar.jpg'; // fallback avatar

    appEl.innerHTML = `
        <div class="w-full h-full flex flex-col overflow-y-auto text-center px-6 py-10 select-none gold-sans pb-24 bg-[#121212] text-white">
            
            <div class="my-6 py-6 border-b border-yellow-900/30 relative">
                <span class="text-[9px] tracking-widest uppercase font-bold text-[#D4AF37] opacity-80">YOU ARE INVITED TO CELEBRATE</span>
                <h3 class="text-3xl gold-title my-4 font-bold tracking-wide shining-gold">THE BIRTHDAY PARTY</h3>
                
                <div class="mt-4">
                    <p class="text-[9px] text-slate-400 mb-1.5">Dear Guest:</p>
                    <div class="bg-[#1E1E1E] border border-yellow-950/40 rounded-full px-4 py-1.5 inline-block shadow-sm">
                        <div class="font-bold text-xs text-[#D4AF37]">${guestName}</div>
                    </div>
                </div>
            </div>

            <div class="my-6 flex flex-col items-center gap-4">
                <div class="w-28 h-28 rounded-full overflow-hidden border-2 border-yellow-600/50 shadow-lg p-0.5 bg-[#1E1E1E]">
                    <img src="${celebrant.image_url || defaultAvatar}" class="w-full h-full object-cover rounded-full" alt="Celebrant" />
                </div>
                <div>
                    <h4 class="font-bold text-2xl gold-title text-slate-100">${celebrant.name || 'Celebrant Name'}</h4>
                    <p class="text-xs text-[#D4AF37] font-semibold mt-1">Celebrating the age of <span class="text-white">${celebrant.age || '17th'}</span></p>
                    ${celebrant.parent_name ? `<p class="text-[10px] text-slate-500 mt-2">Dilahirkan dari: ${celebrant.parent_name}</p>` : ''}
                </div>
            </div>

            <div class="my-4 px-5 py-4 bg-[#1E1E1E] border border-yellow-950/40 rounded-2xl text-xs italic leading-relaxed text-slate-400 gold-title">
                &ldquo;${quote}&rdquo;
            </div>

            <div class="my-6 p-6 bg-[#1E1E1E] border border-yellow-950/40 rounded-3xl shadow-sm text-left relative overflow-hidden">
                <h4 class="font-bold text-sm text-[#D4AF37] mb-4 gold-title tracking-wider">EVENT DETAILS</h4>
                <div class="space-y-3 text-xs text-slate-300">
                    <div>
                        <div class="font-semibold text-slate-500 uppercase tracking-widest text-[9px]">Date</div>
                        <div class="text-slate-100 font-medium mt-0.5">${event.date || 'TBA'}</div>
                    </div>
                    <div>
                        <div class="font-semibold text-slate-500 uppercase tracking-widest text-[9px]">Time</div>
                        <div class="text-slate-100 font-medium mt-0.5">${event.time || 'TBA'}</div>
                    </div>
                    <div>
                        <div class="font-semibold text-slate-500 uppercase tracking-widest text-[9px]">Location</div>
                        <div class="text-slate-100 font-semibold mt-0.5">${event.location || 'TBA'}</div>
                    </div>
                </div>
                ${event.maps_url ? `
                    <a href="${event.maps_url}" target="_blank" class="mt-5 block w-full py-2.5 bg-transparent border border-yellow-600/50 hover:bg-yellow-600/10 text-center rounded-xl text-xs font-bold text-[#D4AF37] transition-all">
                        VIEW MAPS LOCATION
                    </a>
                ` : ''}
            </div>

            ${gift.bank_name || gift.account_number ? `
                <div class="my-6 p-6 bg-[#1E1E1E] border border-yellow-950/40 rounded-3xl shadow-sm text-left relative overflow-hidden">
                    <h4 class="font-bold text-sm text-[#D4AF37] mb-3 gold-title tracking-wider">BIRTHDAY GIFT</h4>
                    <p class="text-[10px] text-slate-400 mb-4 leading-relaxed">
                        Your presence is gift enough, but if you wish to send birthday love:
                    </p>
                    <div class="bg-[#121212] border border-yellow-950/30 rounded-2xl p-4">
                        <div class="text-xs font-bold text-slate-300">${gift.bank_name || 'Bank'}</div>
                        <div class="text-sm font-bold text-[#D4AF37] mt-1">${gift.account_number || '123-456'}</div>
                        <div class="text-[10px] text-slate-500 mt-0.5">a.n. ${gift.account_holder || '-'}</div>
                    </div>
                </div>
            ` : ''}

            <div class="mt-8 text-[9px] text-slate-600 tracking-wider">Siluet Birthday Template • Elegant Gold</div>
        </div>
    `;
}
