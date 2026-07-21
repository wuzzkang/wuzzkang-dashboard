/**
 * Shared Section Style & Theme Helper for V2 Modular Sections (Preview)
 */
export function getSectionStyle(bgStyle = 'navy', bgShade = 'solid', bgBrightness = 'default') {
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
        // Force the background to light (white/light-slate) - MUST be 100% solid/opaque to avoid blending with dark body backgrounds
        let bgClass = 'bg-white text-slate-800 border-b border-slate-100'; // default pure white
        if (bgStyle === 'indigo') {
            bgClass = 'bg-indigo-50 text-slate-800 border-b border-indigo-100';
        } else if (bgStyle === 'emerald') {
            bgClass = 'bg-emerald-50 text-slate-800 border-b border-emerald-100';
        } else if (bgStyle === 'obsidian') {
            bgClass = 'bg-zinc-50 text-zinc-800 border-b border-zinc-200';
        } else if (bgStyle === 'cream') {
            bgClass = 'bg-amber-50 text-stone-800 border-b border-amber-100';
        } else if (bgStyle === 'light') {
            bgClass = 'bg-slate-50 text-slate-800 border-b border-slate-200';
        }

        theme.solid = bgClass;
        theme.soft = bgClass;
        theme.gradient = bgClass;
        theme.pattern = bgClass;

        const textDark = (bgStyle === 'cream') ? 'text-stone-900' : (bgStyle === 'obsidian' ? 'text-zinc-900' : 'text-slate-900');
        const textMuted = (bgStyle === 'cream') ? 'text-stone-600' : (bgStyle === 'obsidian' ? 'text-zinc-600' : 'text-slate-600');

        theme.heading = textDark;
        theme.subtitle = textMuted;

        // Card elements adjustments (solid backgrounds)
        let cardBgColor = 'bg-slate-50 border-slate-200/80';
        if (bgStyle === 'indigo') {
            cardBgColor = 'bg-indigo-50/50 border-indigo-100';
        } else if (bgStyle === 'emerald') {
            cardBgColor = 'bg-emerald-50/50 border-emerald-100';
        } else if (bgStyle === 'cream') {
            cardBgColor = 'bg-white border-amber-200/80';
        } else if (bgStyle === 'obsidian') {
            cardBgColor = 'bg-zinc-50 border-zinc-200/80';
        }

        const accentName = theme.topLine.replace('bg-', '');
        theme.cardBg = `${cardBgColor} hover:border-${accentName}/30 shadow-xs`;
        theme.cardTitle = textDark;
        theme.cardDesc = textMuted;

        // Badge adjustment (make text darker for readability on light BG)
        if (bgStyle === 'navy' || bgStyle === 'obsidian') {
            theme.badge = 'bg-orange-500/10 text-orange-600 border-orange-500/20';
        } else if (bgStyle === 'indigo') {
            theme.badge = 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20';
        } else if (bgStyle === 'emerald') {
            theme.badge = 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
        } else if (bgStyle === 'cream') {
            theme.badge = 'bg-orange-500/15 text-orange-700 border-orange-400/30';
        }

        theme.btnSecondary = (bgStyle === 'cream') 
            ? 'bg-amber-50 hover:bg-amber-100 text-stone-800 border border-amber-300'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300';

        theme.faqBg = cardBgColor;

        theme.footerBg = (bgStyle === 'cream')
            ? 'bg-amber-100 text-stone-600 border-t border-amber-200'
            : 'bg-slate-100 text-slate-600 border-t border-slate-200';

    } else if (isForcedDark) {
        // Force the background to dark (slate-950/black)
        let bgClass = 'bg-slate-950 text-white border-b border-slate-900';
        if (bgStyle === 'obsidian') {
            bgClass = 'bg-black text-white border-b border-zinc-900';
        }

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

    return {
        theme,
        sectionBgClass,
        patternHtml
    };
}
