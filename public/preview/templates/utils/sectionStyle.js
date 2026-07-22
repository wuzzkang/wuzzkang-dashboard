/**
 * Shared Section Style & Theme Helper for V2 Modular Sections (Preview)
 */
export function getSectionStyle(bgStyle = 'navy', bgShade = 'solid', bgBrightness = 'default', transition = 'none') {
    const themes = {
        navy: {
            solid: 'bg-slate-950 text-white border-b border-slate-900',
            soft: 'bg-slate-900/80 text-white border-b border-slate-800',
            gradient: 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border-b border-slate-800',
            pattern: 'bg-slate-950 text-white border-b border-slate-900',
            topLine: 'bg-orange-500',
            badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
            heading: 'text-white',
            subtitle: 'text-slate-400',
            cardBg: 'bg-slate-900/60 border-slate-800 hover:border-orange-500/30',
            cardNum: 'bg-orange-500 text-white shadow-orange-500/20',
            cardTitle: 'text-white',
            cardDesc: 'text-slate-400',
            imgBorder: 'border-slate-800 shadow-xl',
            btnPrimary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25',
            btnSecondary: 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-800',
            faqBg: 'bg-slate-900/50 border-slate-800/80',
            footerBg: 'bg-slate-950 text-slate-400 border-t border-slate-900'
        },
        obsidian: {
            solid: 'bg-black text-white border-b border-zinc-900',
            soft: 'bg-zinc-900/80 text-white border-b border-zinc-800',
            gradient: 'bg-gradient-to-b from-black via-zinc-950 to-black text-white border-b border-zinc-900',
            pattern: 'bg-black text-white border-b border-zinc-900',
            topLine: 'bg-orange-500',
            badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
            heading: 'text-white',
            subtitle: 'text-zinc-400',
            cardBg: 'bg-zinc-900/70 border-zinc-800 hover:border-orange-500/30',
            cardNum: 'bg-orange-500 text-white shadow-orange-500/20',
            cardTitle: 'text-white',
            cardDesc: 'text-zinc-400',
            imgBorder: 'border-zinc-800 shadow-xl',
            btnPrimary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25',
            btnSecondary: 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800',
            faqBg: 'bg-zinc-900/50 border-zinc-800/80',
            footerBg: 'bg-black text-zinc-400 border-t border-zinc-900'
        },
        indigo: {
            solid: 'bg-slate-950 text-white border-b border-indigo-950/60',
            soft: 'bg-indigo-950/60 text-white border-b border-indigo-900/60',
            gradient: 'bg-gradient-to-b from-slate-950 via-indigo-950/50 to-slate-950 text-white border-b border-indigo-900/50',
            pattern: 'bg-slate-950 text-white border-b border-indigo-950/60',
            topLine: 'bg-indigo-500',
            badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
            heading: 'text-white',
            subtitle: 'text-slate-300',
            cardBg: 'bg-indigo-950/50 border-indigo-900/60 hover:border-indigo-500/40',
            cardNum: 'bg-indigo-500 text-white shadow-indigo-500/20',
            cardTitle: 'text-white',
            cardDesc: 'text-slate-300',
            imgBorder: 'border-indigo-900/60 shadow-xl',
            btnPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25',
            btnSecondary: 'bg-indigo-950/80 hover:bg-indigo-900/80 text-white border border-indigo-800',
            faqBg: 'bg-indigo-950/40 border-indigo-900/60',
            footerBg: 'bg-slate-950 text-slate-400 border-t border-indigo-950/60'
        },
        emerald: {
            solid: 'bg-slate-950 text-white border-b border-emerald-950/60',
            soft: 'bg-emerald-950/60 text-white border-b border-emerald-900/60',
            gradient: 'bg-gradient-to-b from-slate-950 via-emerald-950/50 to-slate-950 text-white border-b border-emerald-900/50',
            pattern: 'bg-slate-950 text-white border-b border-emerald-950/60',
            topLine: 'bg-emerald-500',
            badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            heading: 'text-white',
            subtitle: 'text-emerald-100/70',
            cardBg: 'bg-emerald-950/40 border-emerald-900/50 hover:border-emerald-500/40',
            cardNum: 'bg-emerald-500 text-white shadow-emerald-500/20',
            cardTitle: 'text-white',
            cardDesc: 'text-emerald-200/70',
            imgBorder: 'border-emerald-900/60 shadow-xl',
            btnPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25',
            btnSecondary: 'bg-emerald-950/80 hover:bg-emerald-900/80 text-white border border-emerald-800',
            faqBg: 'bg-emerald-950/40 border-emerald-900/60',
            footerBg: 'bg-slate-950 text-emerald-100/70 border-t border-emerald-950/60'
        },
        amber: {
            solid: 'bg-amber-950 text-white border-b border-amber-900',
            soft: 'bg-amber-950/70 text-white border-b border-amber-900/60',
            gradient: 'bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-white border-b border-amber-900/50',
            pattern: 'bg-amber-950 text-white border-b border-amber-900',
            topLine: 'bg-amber-500',
            badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
            heading: 'text-white',
            subtitle: 'text-amber-100/70',
            cardBg: 'bg-amber-950/40 border-amber-900/50 hover:border-amber-500/40',
            cardNum: 'bg-amber-500 text-white shadow-amber-500/20',
            cardTitle: 'text-white',
            cardDesc: 'text-amber-200/70',
            imgBorder: 'border-amber-900/60 shadow-xl',
            btnPrimary: 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/25',
            btnSecondary: 'bg-amber-950/80 hover:bg-amber-900/80 text-white border border-amber-800',
            faqBg: 'bg-amber-950/40 border-amber-900/60',
            footerBg: 'bg-amber-950 text-amber-100/70 border-t border-amber-900/60'
        },
        purple: {
            solid: 'bg-purple-950 text-white border-b border-purple-900',
            soft: 'bg-purple-950/70 text-white border-b border-purple-900/60',
            gradient: 'bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 text-white border-b border-purple-900/50',
            pattern: 'bg-purple-950 text-white border-b border-purple-900',
            topLine: 'bg-purple-500',
            badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
            heading: 'text-white',
            subtitle: 'text-purple-100/70',
            cardBg: 'bg-purple-950/40 border-purple-900/50 hover:border-purple-500/40',
            cardNum: 'bg-purple-500 text-white shadow-purple-500/20',
            cardTitle: 'text-white',
            cardDesc: 'text-purple-200/70',
            imgBorder: 'border-purple-900/60 shadow-xl',
            btnPrimary: 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25',
            btnSecondary: 'bg-purple-950/80 hover:bg-purple-900/80 text-white border border-purple-800',
            faqBg: 'bg-purple-950/40 border-purple-900/60',
            footerBg: 'bg-purple-950 text-purple-100/70 border-t border-purple-900/60'
        },
        rose: {
            solid: 'bg-rose-950 text-white border-b border-rose-900',
            soft: 'bg-rose-950/70 text-white border-b border-rose-900/60',
            gradient: 'bg-gradient-to-b from-rose-950 via-rose-900 to-rose-950 text-white border-b border-rose-900/50',
            pattern: 'bg-rose-950 text-white border-b border-rose-900',
            topLine: 'bg-rose-500',
            badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
            heading: 'text-white',
            subtitle: 'text-rose-100/70',
            cardBg: 'bg-rose-950/40 border-rose-900/50 hover:border-rose-500/40',
            cardNum: 'bg-rose-500 text-white shadow-rose-500/20',
            cardTitle: 'text-white',
            cardDesc: 'text-rose-200/70',
            imgBorder: 'border-rose-900/60 shadow-xl',
            btnPrimary: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/25',
            btnSecondary: 'bg-rose-950/80 hover:bg-rose-900/80 text-white border border-rose-800',
            faqBg: 'bg-rose-950/40 border-rose-900/60',
            footerBg: 'bg-rose-950 text-rose-100/70 border-t border-rose-900/60'
        },
        slate: {
            solid: 'bg-slate-900 text-white border-b border-slate-800',
            soft: 'bg-slate-800/80 text-white border-b border-slate-700',
            gradient: 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white border-b border-slate-700',
            pattern: 'bg-slate-900 text-white border-b border-slate-800',
            topLine: 'bg-slate-400',
            badge: 'bg-slate-400/15 text-slate-300 border-slate-400/30',
            heading: 'text-white',
            subtitle: 'text-slate-300',
            cardBg: 'bg-slate-800/50 border-slate-700/80 hover:border-slate-500/40',
            cardNum: 'bg-slate-600 text-white shadow-slate-600/20',
            cardTitle: 'text-white',
            cardDesc: 'text-slate-300',
            imgBorder: 'border-slate-700 shadow-xl',
            btnPrimary: 'bg-slate-700 hover:bg-slate-600 text-white shadow-lg shadow-slate-700/25',
            btnSecondary: 'bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-600',
            faqBg: 'bg-slate-800/40 border-slate-700/60',
            footerBg: 'bg-slate-900 text-slate-300 border-t border-slate-800'
        },
        light: {
            solid: 'bg-slate-50 text-slate-900 border-b border-slate-200',
            soft: 'bg-white text-slate-900 border-b border-slate-200',
            gradient: 'bg-gradient-to-b from-slate-100 via-white to-slate-100 text-slate-900 border-b border-slate-200',
            pattern: 'bg-slate-50 text-slate-900 border-b border-slate-200',
            topLine: 'bg-orange-500',
            badge: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
            heading: 'text-slate-900',
            subtitle: 'text-slate-600',
            cardBg: 'bg-white border-slate-200 hover:border-orange-500/40 shadow-sm hover:shadow-md',
            cardNum: 'bg-orange-500 text-white shadow-orange-500/20',
            cardTitle: 'text-slate-900',
            cardDesc: 'text-slate-600',
            imgBorder: 'border-slate-200 shadow-lg',
            btnPrimary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25',
            btnSecondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300',
            faqBg: 'bg-white border-slate-200 shadow-xs',
            footerBg: 'bg-slate-100 text-slate-600 border-t border-slate-200'
        },
        white: {
            solid: 'bg-white text-slate-900 border-b border-slate-100',
            soft: 'bg-slate-50 text-slate-900 border-b border-slate-100',
            gradient: 'bg-gradient-to-b from-white via-slate-50 to-white text-slate-900 border-b border-slate-100',
            pattern: 'bg-white text-slate-900 border-b border-slate-100',
            topLine: 'bg-blue-600',
            badge: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
            heading: 'text-slate-900',
            subtitle: 'text-slate-500',
            cardBg: 'bg-slate-50 border-slate-200 hover:border-blue-400/50 shadow-sm hover:shadow-md',
            cardNum: 'bg-blue-600 text-white shadow-blue-500/20',
            cardTitle: 'text-slate-900',
            cardDesc: 'text-slate-500',
            imgBorder: 'border-slate-200 shadow-lg',
            btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25',
            btnSecondary: 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300',
            faqBg: 'bg-slate-50 border-slate-200 shadow-xs',
            footerBg: 'bg-slate-50 text-slate-500 border-t border-slate-200'
        },
        cream: {
            solid: 'bg-amber-50 text-stone-900 border-b border-amber-100',
            soft: 'bg-orange-50 text-stone-900 border-b border-orange-100',
            gradient: 'bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50 text-stone-900 border-b border-amber-100',
            pattern: 'bg-amber-50 text-stone-900 border-b border-amber-100',
            topLine: 'bg-orange-500',
            badge: 'bg-orange-500/15 text-orange-700 border-orange-400/30',
            heading: 'text-stone-900',
            subtitle: 'text-stone-600',
            cardBg: 'bg-white border-amber-200 hover:border-orange-400/50 shadow-sm hover:shadow-md',
            cardNum: 'bg-orange-500 text-white shadow-orange-500/20',
            cardTitle: 'text-stone-900',
            cardDesc: 'text-stone-600',
            imgBorder: 'border-amber-200 shadow-lg',
            btnPrimary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25',
            btnSecondary: 'bg-amber-50 hover:bg-amber-100 text-stone-800 border border-amber-300',
            faqBg: 'bg-white border-amber-200 shadow-xs',
            footerBg: 'bg-amber-100 text-stone-600 border-t border-amber-200'
        }
    };

    const theme = { ...(themes[bgStyle] || themes.navy) };

    // Resolve brightness variant
    const isForcedLight = bgBrightness === 'light';
    const isForcedDark = bgBrightness === 'dark';

    // If 'light' style is chosen as base, we treat it as light by default unless forced dark
    const resolveAsLight = isForcedLight || (['light', 'white', 'cream'].includes(bgStyle) && !isForcedDark);

    if (resolveAsLight) {
        let bgClass = 'bg-white text-slate-800 border-b border-slate-100';
        if (bgStyle === 'indigo') bgClass = 'bg-indigo-50 text-slate-800 border-b border-indigo-100';
        else if (bgStyle === 'emerald') bgClass = 'bg-emerald-50 text-slate-800 border-b border-emerald-100';
        else if (bgStyle === 'amber') bgClass = 'bg-amber-50 text-stone-800 border-b border-amber-100';
        else if (bgStyle === 'purple') bgClass = 'bg-purple-50 text-slate-800 border-b border-purple-100';
        else if (bgStyle === 'rose') bgClass = 'bg-rose-50 text-slate-800 border-b border-rose-100';
        else if (bgStyle === 'slate') bgClass = 'bg-slate-100 text-slate-800 border-b border-slate-200';
        else if (bgStyle === 'obsidian') bgClass = 'bg-zinc-50 text-zinc-800 border-b border-zinc-200';
        else if (bgStyle === 'cream') bgClass = 'bg-amber-50 text-stone-800 border-b border-amber-100';
        else if (bgStyle === 'light') bgClass = 'bg-slate-50 text-slate-800 border-b border-slate-200';

        theme.solid = bgClass;
        theme.soft = bgClass;
        theme.gradient = bgClass;
        theme.pattern = bgClass;

        const textDark = (bgStyle === 'cream' || bgStyle === 'amber') ? 'text-stone-900' : (bgStyle === 'obsidian' ? 'text-zinc-900' : 'text-slate-900');
        const textMuted = (bgStyle === 'cream' || bgStyle === 'amber') ? 'text-stone-600' : (bgStyle === 'obsidian' ? 'text-zinc-600' : 'text-slate-600');

        theme.heading = textDark;
        theme.subtitle = textMuted;

        let cardBgColor = 'bg-slate-50 border-slate-200/80';
        if (bgStyle === 'indigo') cardBgColor = 'bg-indigo-50/50 border-indigo-100';
        else if (bgStyle === 'emerald') cardBgColor = 'bg-emerald-50/50 border-emerald-100';
        else if (bgStyle === 'amber' || bgStyle === 'cream') cardBgColor = 'bg-white border-amber-200/80';
        else if (bgStyle === 'purple') cardBgColor = 'bg-purple-50/50 border-purple-100';
        else if (bgStyle === 'rose') cardBgColor = 'bg-rose-50/50 border-rose-100';
        else if (bgStyle === 'obsidian') cardBgColor = 'bg-zinc-50 border-zinc-200/80';

        const accentName = theme.topLine.replace('bg-', '');
        theme.cardBg = `${cardBgColor} hover:border-${accentName}/30 shadow-xs`;
        theme.cardTitle = textDark;
        theme.cardDesc = textMuted;

        if (bgStyle === 'navy' || bgStyle === 'obsidian') theme.badge = 'bg-orange-500/10 text-orange-600 border-orange-500/20';
        else if (bgStyle === 'indigo') theme.badge = 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20';
        else if (bgStyle === 'emerald') theme.badge = 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
        else if (bgStyle === 'amber' || bgStyle === 'cream') theme.badge = 'bg-amber-500/15 text-amber-700 border-amber-400/30';
        else if (bgStyle === 'purple') theme.badge = 'bg-purple-500/10 text-purple-700 border-purple-500/20';
        else if (bgStyle === 'rose') theme.badge = 'bg-rose-500/10 text-rose-700 border-rose-500/20';

        theme.btnSecondary = (bgStyle === 'cream' || bgStyle === 'amber') 
            ? 'bg-amber-50 hover:bg-amber-100 text-stone-800 border border-amber-300'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300';

        theme.faqBg = cardBgColor;
        theme.footerBg = (bgStyle === 'cream' || bgStyle === 'amber')
            ? 'bg-amber-100 text-stone-600 border-t border-amber-200'
            : 'bg-slate-100 text-slate-600 border-t border-slate-200';

    } else if (isForcedDark) {
        let bgClass = 'bg-slate-950 text-white border-b border-slate-900';
        if (bgStyle === 'obsidian') bgClass = 'bg-black text-white border-b border-zinc-900';

        theme.solid = bgClass;
        theme.soft = bgClass;
        theme.gradient = bgClass;
        theme.pattern = bgClass;

        theme.heading = 'text-white';
        theme.subtitle = (bgStyle === 'obsidian') ? 'text-zinc-400' : 'text-slate-400';
    }

    const sectionBgClass = (isForcedLight || isForcedDark) ? theme.solid : (theme[bgShade] || theme.solid);

    const patternHtml = (!resolveAsLight && bgShade === 'pattern') ? `
        <div class="absolute inset-0 bg-[radial-gradient(#ffffff0f_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none opacity-70"></div>
    ` : (!resolveAsLight && bgShade === 'gradient') ? `
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent pointer-events-none"></div>
    ` : '';

    // Determine section background fill color for SVG dividers
    let fillColor = '#020617'; // slate-950 default
    if (resolveAsLight) {
        fillColor = '#ffffff';
        if (bgStyle === 'indigo') fillColor = '#eef2ff';
        else if (bgStyle === 'emerald') fillColor = '#ecfdf5';
        else if (bgStyle === 'amber' || bgStyle === 'cream') fillColor = '#fffbeb';
        else if (bgStyle === 'purple') fillColor = '#faf5ff';
        else if (bgStyle === 'rose') fillColor = '#fff1f2';
        else if (bgStyle === 'slate') fillColor = '#f8fafc';
    } else {
        if (bgStyle === 'obsidian') fillColor = '#000000';
        else if (bgStyle === 'indigo') fillColor = '#020617';
        else if (bgStyle === 'emerald') fillColor = '#020617';
        else if (bgStyle === 'amber') fillColor = '#451a03';
        else if (bgStyle === 'purple') fillColor = '#3b0764';
        else if (bgStyle === 'rose') fillColor = '#4c0519';
        else if (bgStyle === 'slate') fillColor = '#0f172a';
    }

    let dividerHtml = '';
    if (transition === 'gradient') {
        dividerHtml = `
            <div class="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b ${resolveAsLight ? 'from-slate-950/20 via-slate-950/5' : 'from-black/50 via-black/15'} to-transparent pointer-events-none z-20"></div>
        `;
    } else if (transition === 'wave') {
        dividerHtml = `
            <div class="absolute top-0 left-0 right-0 overflow-hidden leading-none z-20 pointer-events-none -translate-y-[98%]">
                <svg class="relative block w-full h-7 md:h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z" fill="${fillColor}"></path>
                </svg>
            </div>
        `;
    } else if (transition === 'curve') {
        dividerHtml = `
            <div class="absolute top-0 left-0 right-0 overflow-hidden leading-none z-20 pointer-events-none -translate-y-[98%]">
                <svg class="relative block w-full h-7 md:h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0 Q600,120 1200,0 L1200,120 L0,120 Z" fill="${fillColor}"></path>
                </svg>
            </div>
        `;
    } else if (transition === 'slant') {
        dividerHtml = `
            <div class="absolute top-0 left-0 right-0 overflow-hidden leading-none z-20 pointer-events-none -translate-y-[98%]">
                <svg class="relative block w-full h-7 md:h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0 L1200,120 L0,120 Z" fill="${fillColor}"></path>
                </svg>
            </div>
        `;
    } else if (transition === 'glow') {
        dividerHtml = `
            <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-gradient-to-r from-orange-500/20 via-emerald-500/20 to-purple-500/20 blur-2xl pointer-events-none z-20"></div>
        `;
    }

    return {
        theme,
        sectionBgClass,
        patternHtml,
        dividerHtml
    };
}
