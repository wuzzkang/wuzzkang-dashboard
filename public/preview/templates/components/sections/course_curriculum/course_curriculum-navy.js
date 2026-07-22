import { getSectionStyle } from '../../../utils/sectionStyle.js';

/**
 * Modular Section: E-Course Curriculum & Syllabus Accordion (V2 Preview)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const title = data.title || 'Silabus & Kurikulum Belajar Lengkap';
    const subtitle = data.subtitle || 'Daftar materi pembelajaran terstruktur yang dirancang khusus untuk menguasai skill hingga tuntas.';

    const modules = Array.isArray(data.modules) && data.modules.length > 0 ? data.modules : [
        { module_number: 'Modul 1', title: 'Fondasi Dasar & Mindset Sukses', duration: '4 Video (45 Menit)', lessons: ['Pengenalan Konsep & Ekosistem Utama', 'Instalasi Tools & Setup Lingkungan Kerja', 'Struktur Dasar & Workflow Profesional', 'Studi Kasus Pertama'] },
        { module_number: 'Modul 2', title: 'Penerapan Praktik & Strategi Lanjutan', duration: '6 Video (90 Menit)', lessons: ['Teknik Pembuatan Asset Kreatif', 'Optimasi Performa & Efisiensi', 'Integrasi Sistem & Otomatisasi', 'Troubleshooting & Solusi Masalah'] },
        { module_number: 'Modul 3', title: 'Monetisasi & Peluncuran Proyek', duration: '5 Video (60 Menit)', lessons: ['Strategi Menentukan Pricing & Penawaran', 'Cara Publikasi & Monetisasi Hasil Karya', 'Checklist Peluncuran Proyek Mandiri', 'Studi Kasus Sukses Alumni'] }
    ];

    const bgStyle = data.bg_style || 'navy';
    const bgShade = data.bg_shade || 'solid';
    const transition = data.transition || 'none';

    const { theme, sectionBgClass, patternHtml, dividerHtml } = getSectionStyle(bgStyle, bgShade, data.bg_brightness || 'default', transition);

    const modulesHtml = modules.map((mod, idx) => {
        const lessons = Array.isArray(mod.lessons) ? mod.lessons : [];
        const lessonsHtml = lessons.map(les => `
            <li class="flex items-center gap-2.5 text-xs md:text-sm ${theme.cardDesc}">
                <span class="text-orange-400 font-bold">✓</span>
                <span>${les}</span>
            </li>
        `).join('');

        return `
            <div class="${theme.cardBg} border rounded-3xl p-6 md:p-8 text-left shadow-xl transition-all mb-6">
                <div class="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800/60">
                    <div class="flex items-center gap-3">
                        <span class="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                            ${mod.module_number || `Modul ${idx + 1}`}
                        </span>
                        <h3 class="text-base md:text-xl font-extrabold ${theme.cardTitle} tracking-tight">
                            ${mod.title || 'Judul Modul'}
                        </h3>
                    </div>
                    ${mod.duration ? `
                        <span class="text-xs font-semibold ${theme.cardDesc} bg-slate-900/60 border border-slate-800 px-3 py-1 rounded-lg">
                            ⏱️ ${mod.duration}
                        </span>
                    ` : ''}
                </div>

                ${lessons.length > 0 ? `
                    <ul class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        ${lessonsHtml}
                    </ul>
                ` : ''}
            </div>
        `;
    }).join('');

    return `
        <section id="course_curriculum" class="py-20 md:py-28 px-6 ${sectionBgClass} relative overflow-hidden">
            ${patternHtml}
            ${dividerHtml || ''}
            <div class="max-w-4xl mx-auto text-center relative z-10">
                <div class="w-12 h-1 ${theme.topLine} rounded-full mx-auto mb-4"></div>
                <h2 class="text-2xl md:text-4xl font-extrabold ${theme.heading} tracking-tight mb-3 leading-snug">
                    ${title}
                </h2>
                <p class="${theme.subtitle} text-xs md:text-sm max-w-xl mx-auto mb-12 leading-relaxed">
                    ${subtitle}
                </p>

                <div class="text-left">
                    ${modulesHtml}
                </div>
            </div>
        </section>
    `;
}
