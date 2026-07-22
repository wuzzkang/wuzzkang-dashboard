import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: E-Course Mentor & Instructor Card (V2 Preview)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const name = data.name || 'Budi Pratama, S.Kom., M.T.';
    const role = data.role || 'Senior Digital Strategist & Lead Mentor';
    const bio = data.bio || 'Berpengalaman lebih dari 8+ tahun memimpin proyek teknologi & strategi digital. Telah membimbing lebih dari 5.000+ peserta dari latar belakang pemula hingga mahir.';
    const avatarUrl = data.avatar_url || '';
    const expYears = data.experience_years || '8+ Tahun';
    const studentsCount = data.students_count || '5,000+ Alumni';
    const linkedinUrl = data.linkedin_url || '';

    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const defaultMentorSvg = `
        <div class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-orange-500/10 border-4 border-orange-500/30 flex items-center justify-center text-3xl font-black text-orange-400 shadow-xl mx-auto mb-6">
            👨‍🏫
        </div>
    `;

    return `
        <section id="course_mentor" class="py-20 md:py-28 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-4xl mx-auto text-center relative z-10">
                <div class="w-12 h-1 ${theme.topLine} rounded-full mx-auto mb-4"></div>
                <span class="text-xs font-bold uppercase tracking-wider text-orange-400 block mb-2">Instruktur Utama</span>
                <h2 class="text-2xl md:text-4xl font-extrabold ${theme.heading} tracking-tight mb-12 leading-snug">
                    Belajar Langsung dari Pakar berpengalaman
                </h2>

                <div class="${theme.cardBg} border rounded-3xl p-8 md:p-12 text-center flex flex-col items-center shadow-xl max-w-2xl mx-auto">
                    ${avatarUrl ? `
                        <img src="${avatarUrl}" alt="${name}" class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-orange-500/30 shadow-xl mx-auto mb-6" />
                    ` : defaultMentorSvg}

                    <h3 class="text-xl md:text-2xl font-extrabold ${theme.cardTitle} mb-1 tracking-tight">${name}</h3>
                    <p class="text-xs md:text-sm font-bold text-orange-400 mb-4">${role}</p>
                    <p class="${theme.cardDesc} text-xs md:text-sm leading-relaxed max-w-lg mb-8">${bio}</p>

                    <!-- Stats Badges -->
                    <div class="grid grid-cols-2 gap-4 w-full max-w-md border-t border-slate-800/60 pt-6">
                        <div class="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                            <span class="text-lg md:text-xl font-black text-orange-400 block">${expYears}</span>
                            <span class="${theme.cardDesc} text-[10px] uppercase font-bold tracking-wider">Pengalaman Praktis</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                            <span class="text-lg md:text-xl font-black text-orange-400 block">${studentsCount}</span>
                            <span class="${theme.cardDesc} text-[10px] uppercase font-bold tracking-wider">Lulusan & Alumni</span>
                        </div>
                    </div>

                    ${linkedinUrl ? `
                        <a href="${linkedinUrl}" target="_blank" rel="noopener noreferrer" class="mt-6 inline-flex items-center gap-2 text-xs font-bold text-orange-400 hover:underline">
                            <span>💼 Profil LinkedIn / Portofolio Mentor →</span>
                        </a>
                    ` : ''}
                </div>
            </div>
        </section>
    `;
}
