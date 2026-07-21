/**
 * Modular Section: About Simple Navy (V2 Preview)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title !== undefined ? data.title : 'Tentang Layanan Kami';
    const desc = data.description !== undefined ? data.description : (data.desc !== undefined ? data.desc : 'Kami adalah mitra terpercaya dalam menghadirkan solusi profesional berkualitas tinggi dengan komitmen penuh terhadap kepuasan klien.');
    const imageUrl = data.image_url || '';
    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';

    const themes = {
        navy: {
            solid: 'bg-slate-950 text-white border-b border-slate-900',
            soft: 'bg-slate-900/80 text-white border-b border-slate-800',
            gradient: 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border-b border-slate-800',
            pattern: 'bg-slate-950 text-white border-b border-slate-900',
            topLine: 'bg-orange-500',
            heading: 'text-white',
            desc: 'text-slate-400',
            imgBorder: 'border-slate-800 shadow-xl'
        },
        obsidian: {
            solid: 'bg-black text-white border-b border-zinc-900',
            soft: 'bg-zinc-900/80 text-white border-b border-zinc-800',
            gradient: 'bg-gradient-to-b from-black via-zinc-950 to-black text-white border-b border-zinc-900',
            pattern: 'bg-black text-white border-b border-zinc-900',
            topLine: 'bg-orange-500',
            heading: 'text-white',
            desc: 'text-zinc-400',
            imgBorder: 'border-zinc-800 shadow-xl'
        },
        indigo: {
            solid: 'bg-slate-950 text-white border-b border-indigo-950/60',
            soft: 'bg-indigo-950/60 text-white border-b border-indigo-900/60',
            gradient: 'bg-gradient-to-b from-slate-950 via-indigo-950/50 to-slate-950 text-white border-b border-indigo-900/50',
            pattern: 'bg-slate-950 text-white border-b border-indigo-950/60',
            topLine: 'bg-indigo-500',
            heading: 'text-white',
            desc: 'text-slate-300',
            imgBorder: 'border-indigo-900/60 shadow-xl'
        },
        emerald: {
            solid: 'bg-slate-950 text-white border-b border-emerald-950/60',
            soft: 'bg-emerald-950/60 text-white border-b border-emerald-900/60',
            gradient: 'bg-gradient-to-b from-slate-950 via-emerald-950/50 to-slate-950 text-white border-b border-emerald-900/50',
            pattern: 'bg-slate-950 text-white border-b border-emerald-950/60',
            topLine: 'bg-emerald-500',
            heading: 'text-white',
            desc: 'text-emerald-100/70',
            imgBorder: 'border-emerald-900/60 shadow-xl'
        },
        light: {
            solid: 'bg-slate-50 text-slate-800 border-b border-slate-200',
            soft: 'bg-white text-slate-800 border-b border-slate-200',
            gradient: 'bg-gradient-to-b from-slate-100 via-white to-slate-100 text-slate-800 border-b border-slate-200',
            pattern: 'bg-slate-50 text-slate-800 border-b border-slate-200',
            topLine: 'bg-orange-500',
            heading: 'text-slate-900',
            desc: 'text-slate-600',
            imgBorder: 'border-slate-200 shadow-lg'
        }
    };

    const theme = themes[bgStyle] || themes.navy;
    const sectionBgClass = theme[bgShade] || theme.solid;

    const patternHtml = bgShade === 'pattern' ? `
        <div class="absolute inset-0 bg-[radial-gradient(#ffffff0f_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none opacity-70"></div>
    ` : bgShade === 'gradient' ? `
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent pointer-events-none"></div>
    ` : '';

    const defaultAboutSvg = `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:1.2rem;border:3px solid rgba(249,115,22,0.2);box-shadow:0 24px 60px rgba(15,46,76,0.14);">
            <rect width="400" height="300" rx="16" fill="#f0f4f8"/>
            <rect x="20" y="20" width="180" height="260" rx="12" fill="#0f2e4c"/>
            <circle cx="110" cy="100" r="40" fill="#f97316" opacity="0.9"/>
            <rect x="55" y="155" width="110" height="10" rx="4" fill="rgba(255,255,255,0.6)"/>
            <rect x="70" y="173" width="80" height="7" rx="3" fill="rgba(255,255,255,0.3)"/>
            <rect x="220" y="20" width="160" height="120" rx="12" fill="#0f2e4c"/>
            <rect x="235" y="36" width="130" height="8" rx="3" fill="rgba(255,255,255,0.55)"/>
            <rect x="235" y="88" width="80" height="32" rx="6" fill="#f97316"/>
            <rect x="220" y="156" width="160" height="124" rx="12" fill="#163654"/>
        </svg>
    `;

    return `
        <section id="about" class="py-20 md:py-24 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                    ${imageUrl ? `
                        <img src="${imageUrl}" alt="${title}" class="w-full rounded-2xl border-2 ${theme.imgBorder} object-cover aspect-4/3" />
                    ` : defaultAboutSvg}
                </div>
                <div>
                    <div class="w-12 h-1 ${theme.topLine} rounded-full mb-4"></div>
                    <h2 class="text-2xl md:text-4xl font-extrabold ${theme.heading} mb-4 tracking-tight leading-snug">
                        ${title}
                    </h2>
                    <p class="${theme.desc} text-base md:text-lg leading-relaxed">
                        ${desc}
                    </p>
                </div>
            </div>
        </section>
    `;
}
