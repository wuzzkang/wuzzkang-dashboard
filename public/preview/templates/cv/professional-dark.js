/**
 * CV Template: professional-dark
 * ATS-Friendly Curriculum Vitae Landing Page
 *
 * Design: Premium dark mode with blue/cyan accent.
 * ATS Compliance:
 *   - Semantic HTML structure (h1, h2, h3, section, article, ul/li)
 *   - All text content is plain, parseable, selectable text — no image-based text
 *   - Standard section order: Profile → Experience → Education → Skills → Languages → Certifications
 *   - Clean heading hierarchy, no decorative fonts for critical content
 *   - Export to PDF via window.print() produces selectable, parseable text
 *
 * @param {object} pageConfig - The full pageConfig object from Supabase
 * @param {string} [guestName] - Unused for CV, kept for interface consistency
 */
export async function render(pageConfig, guestName = '') {
    const appEl = document.getElementById('app');
    const content = pageConfig.content || {};
    const profile = content.profile || {};
    const experiences = content.experiences || [];
    const educations = content.educations || [];
    const skills = content.skills || [];
    const languages = content.languages || [];
    const certifications = content.certifications || [];

    // Inject CSS (with unique ID to prevent duplicate injection on re-render)
    if (!document.getElementById('cv-professional-dark-styles')) {
        const style = document.createElement('style');
        style.id = 'cv-professional-dark-styles';
        style.textContent = `
            /* ===== CV PROFESSIONAL DARK — GLOBAL RESET ===== */
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

            body {
                font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
                background-color: #0f1117;
                color: #e2e8f0;
                line-height: 1.6;
                -webkit-font-smoothing: antialiased;
            }

            /* ===== PRINT / PDF STYLES ===== */
            @media print {
                body {
                    background: #ffffff !important;
                    color: #1a202c !important;
                    font-size: 11pt;
                }
                .cv-no-print { display: none !important; }
                .cv-wrapper {
                    max-width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                    border-radius: 0 !important;
                }
                .cv-header {
                    background: #1e3a5f !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    page-break-inside: avoid;
                }
                .cv-section { page-break-inside: avoid; }
                .cv-experience-item, .cv-education-item { page-break-inside: avoid; }
                .cv-skills-grid { page-break-inside: avoid; }
                a { color: inherit !important; text-decoration: none !important; }
                .cv-contact-link { color: #1a202c !important; }
            }

            /* ===== LAYOUT ===== */
            .cv-page {
                min-height: 100vh;
                padding: 1.5rem 1rem 4rem;
            }
            .cv-wrapper {
                max-width: 900px;
                margin: 0 auto;
                background: #1a1d2e;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 179, 237, 0.1);
            }

            /* ===== HEADER / PROFILE ===== */
            .cv-header {
                background: linear-gradient(135deg, #1e3a5f 0%, #1a2744 60%, #0f172a 100%);
                padding: 2.5rem 2.5rem 2rem;
                display: flex;
                gap: 2rem;
                align-items: flex-start;
                border-bottom: 1px solid rgba(99, 179, 237, 0.2);
                position: relative;
            }
            .cv-header::after {
                content: '';
                position: absolute;
                bottom: 0; left: 0; right: 0;
                height: 2px;
                background: linear-gradient(90deg, transparent, #63b3ed, #9f7aea, transparent);
            }
            .cv-photo {
                width: 110px;
                height: 110px;
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid #63b3ed;
                flex-shrink: 0;
                box-shadow: 0 0 0 4px rgba(99, 179, 237, 0.15);
            }
            .cv-photo-placeholder {
                width: 110px;
                height: 110px;
                border-radius: 50%;
                border: 3px solid #63b3ed;
                flex-shrink: 0;
                background: linear-gradient(135deg, #2d3748, #1a2744);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.5rem;
                color: #63b3ed;
                font-weight: 700;
                box-shadow: 0 0 0 4px rgba(99, 179, 237, 0.15);
            }
            .cv-header-info { flex: 1; min-width: 0; }
            .cv-name {
                font-size: 2rem;
                font-weight: 800;
                color: #f7fafc;
                letter-spacing: -0.025em;
                line-height: 1.2;
                margin-bottom: 0.35rem;
            }
            .cv-job-title {
                font-size: 1.05rem;
                font-weight: 600;
                color: #63b3ed;
                margin-bottom: 0.75rem;
                letter-spacing: 0.01em;
            }
            .cv-summary {
                font-size: 0.875rem;
                color: #a0aec0;
                line-height: 1.7;
                max-width: 540px;
                margin-bottom: 1.25rem;
            }
            .cv-contact-bar {
                display: flex;
                flex-wrap: wrap;
                gap: 0.6rem 1.2rem;
            }
            .cv-contact-link {
                display: inline-flex;
                align-items: center;
                gap: 0.35rem;
                font-size: 0.8rem;
                color: #90cdf4;
                text-decoration: none;
                transition: color 0.2s;
                word-break: break-all;
            }
            .cv-contact-link:hover { color: #bee3f8; text-decoration: underline; }
            .cv-contact-link svg { flex-shrink: 0; opacity: 0.8; }

            /* ===== ACTION BUTTONS ===== */
            .cv-actions {
                display: flex;
                gap: 0.75rem;
                padding: 1rem 2.5rem;
                background: rgba(0,0,0,0.2);
                border-bottom: 1px solid rgba(99, 179, 237, 0.08);
                justify-content: flex-end;
            }
            .cv-btn {
                display: inline-flex;
                align-items: center;
                gap: 0.4rem;
                padding: 0.5rem 1.1rem;
                border-radius: 8px;
                font-size: 0.8rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                border: none;
                text-decoration: none;
            }
            .cv-btn-primary {
                background: #2b6cb0;
                color: #fff;
            }
            .cv-btn-primary:hover { background: #3182ce; transform: translateY(-1px); }
            .cv-btn-secondary {
                background: rgba(99, 179, 237, 0.1);
                color: #90cdf4;
                border: 1px solid rgba(99, 179, 237, 0.25);
            }
            .cv-btn-secondary:hover { background: rgba(99, 179, 237, 0.18); }

            /* ===== BODY LAYOUT ===== */
            .cv-body {
                display: grid;
                grid-template-columns: 1fr 280px;
                gap: 0;
            }
            .cv-main { padding: 2rem 2.5rem; border-right: 1px solid rgba(99,179,237,0.08); }
            .cv-sidebar { padding: 2rem 1.75rem; background: rgba(0,0,0,0.15); }

            /* ===== SECTION HEADERS ===== */
            .cv-section { margin-bottom: 2rem; }
            .cv-section:last-child { margin-bottom: 0; }
            .cv-section-title {
                font-size: 0.7rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.12em;
                color: #63b3ed;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid rgba(99, 179, 237, 0.2);
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .cv-section-title svg { opacity: 0.9; }

            /* ===== EXPERIENCE ITEMS ===== */
            .cv-experience-item { margin-bottom: 1.35rem; padding-bottom: 1.35rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
            .cv-experience-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
            .cv-exp-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.2rem; flex-wrap: wrap; }
            .cv-exp-position { font-size: 0.95rem; font-weight: 700; color: #e2e8f0; }
            .cv-exp-period {
                font-size: 0.75rem;
                font-weight: 600;
                color: #63b3ed;
                background: rgba(99,179,237,0.1);
                padding: 0.15rem 0.55rem;
                border-radius: 9999px;
                white-space: nowrap;
            }
            .cv-exp-company { font-size: 0.85rem; font-weight: 600; color: #9f7aea; margin-bottom: 0.45rem; }
            .cv-exp-desc { font-size: 0.83rem; color: #a0aec0; line-height: 1.65; }

            /* ===== EDUCATION ITEMS ===== */
            .cv-education-item { margin-bottom: 1.1rem; }
            .cv-education-item:last-child { margin-bottom: 0; }
            .cv-edu-degree { font-size: 0.9rem; font-weight: 700; color: #e2e8f0; margin-bottom: 0.1rem; }
            .cv-edu-institution { font-size: 0.83rem; color: #9f7aea; font-weight: 600; margin-bottom: 0.1rem; }
            .cv-edu-period { font-size: 0.77rem; color: #718096; }
            .cv-edu-gpa { font-size: 0.77rem; color: #63b3ed; font-weight: 600; margin-top: 0.1rem; }

            /* ===== SKILLS ===== */
            .cv-skills-grid { display: flex; flex-wrap: wrap; gap: 0.45rem; }
            .cv-skill-tag {
                font-size: 0.77rem;
                font-weight: 600;
                color: #90cdf4;
                background: rgba(99, 179, 237, 0.1);
                border: 1px solid rgba(99, 179, 237, 0.2);
                padding: 0.25rem 0.7rem;
                border-radius: 6px;
                transition: all 0.15s;
            }
            .cv-skill-tag:hover { background: rgba(99,179,237,0.18); }

            /* ===== LANGUAGES ===== */
            .cv-language-item { display: flex; justify-content: space-between; align-items: center; padding: 0.45rem 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
            .cv-language-item:last-child { border-bottom: none; }
            .cv-lang-name { font-size: 0.85rem; font-weight: 600; color: #e2e8f0; }
            .cv-lang-level {
                font-size: 0.72rem;
                font-weight: 600;
                color: #63b3ed;
                background: rgba(99,179,237,0.1);
                padding: 0.15rem 0.55rem;
                border-radius: 9999px;
            }

            /* ===== CERTIFICATIONS ===== */
            .cv-cert-item { margin-bottom: 0.85rem; }
            .cv-cert-item:last-child { margin-bottom: 0; }
            .cv-cert-name { font-size: 0.85rem; font-weight: 700; color: #e2e8f0; }
            .cv-cert-meta { font-size: 0.77rem; color: #718096; margin-top: 0.1rem; }

            /* ===== FOOTER ===== */
            .cv-footer {
                text-align: center;
                padding: 1rem 2.5rem;
                font-size: 0.7rem;
                color: #4a5568;
                border-top: 1px solid rgba(99,179,237,0.08);
                background: rgba(0,0,0,0.15);
            }

            /* ===== RESPONSIVE ===== */
            @media (max-width: 700px) {
                .cv-page { padding: 0.75rem 0.5rem 3rem; }
                .cv-wrapper { border-radius: 12px; }
                .cv-header { flex-direction: column; align-items: center; text-align: center; padding: 2rem 1.25rem 1.5rem; gap: 1.25rem; }
                .cv-header-info { width: 100%; }
                .cv-contact-bar { justify-content: center; }
                .cv-summary { max-width: 100%; }
                .cv-body { grid-template-columns: 1fr; }
                .cv-main { padding: 1.5rem 1.25rem; border-right: none; border-bottom: 1px solid rgba(99,179,237,0.08); }
                .cv-sidebar { padding: 1.5rem 1.25rem; }
                .cv-actions { justify-content: center; padding: 0.75rem 1.25rem; flex-wrap: wrap; }
                .cv-name { font-size: 1.5rem; }
            }
        `;
        document.head.appendChild(style);
    }

    // Inject Inter font if not already loaded
    if (!document.getElementById('cv-inter-font')) {
        const link = document.createElement('link');
        link.id = 'cv-inter-font';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
        document.head.appendChild(link);
    }

    // Helper: escape HTML to prevent XSS in user-provided strings
    const esc = (str) => {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };

    // Helper: render SVG icons inline (ATS-neutral, hidden from screen readers)
    const icon = {
        email: `<svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
        phone: `<svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
        location: `<svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
        linkedin: `<svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`,
        github: `<svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
        globe: `<svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
        briefcase: `<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
        graduation: `<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
        code: `<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
        languages: `<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>`,
        award: `<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
        download: `<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
        share: `<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    };

    // Build photo section
    const photoHtml = profile.photo_url
        ? `<img src="${esc(profile.photo_url)}" alt="Foto ${esc(profile.name)}" class="cv-photo" loading="lazy" />`
        : `<div class="cv-photo-placeholder" aria-hidden="true">${esc(profile.name || 'CV').charAt(0).toUpperCase()}</div>`;

    // Build contact bar
    const contactItems = [
        profile.email    && `<a href="mailto:${esc(profile.email)}" class="cv-contact-link">${icon.email} ${esc(profile.email)}</a>`,
        profile.phone    && `<a href="tel:${esc(profile.phone)}" class="cv-contact-link">${icon.phone} ${esc(profile.phone)}</a>`,
        profile.location && `<span class="cv-contact-link">${icon.location} ${esc(profile.location)}</span>`,
        profile.linkedin_url && `<a href="${esc(profile.linkedin_url)}" target="_blank" rel="noopener noreferrer" class="cv-contact-link">${icon.linkedin} LinkedIn</a>`,
        profile.github_url   && `<a href="${esc(profile.github_url)}" target="_blank" rel="noopener noreferrer" class="cv-contact-link">${icon.github} GitHub</a>`,
        profile.portfolio_url && `<a href="${esc(profile.portfolio_url)}" target="_blank" rel="noopener noreferrer" class="cv-contact-link">${icon.globe} Portfolio</a>`,
    ].filter(Boolean).join('');

    // Build experiences section (main column)
    const experiencesHtml = experiences.length > 0
        ? `<section class="cv-section" aria-labelledby="cv-exp-heading">
            <h2 class="cv-section-title" id="cv-exp-heading">${icon.briefcase} Pengalaman Kerja</h2>
            ${experiences.map(exp => `
                <article class="cv-experience-item">
                    <div class="cv-exp-header">
                        <h3 class="cv-exp-position">${esc(exp.position)}</h3>
                        <time class="cv-exp-period">${esc(exp.period)}</time>
                    </div>
                    <p class="cv-exp-company">${esc(exp.company)}</p>
                    ${exp.description ? `<p class="cv-exp-desc">${esc(exp.description)}</p>` : ''}
                </article>
            `).join('')}
        </section>`
        : '';

    // Build education section (main column)
    const educationsHtml = educations.length > 0
        ? `<section class="cv-section" aria-labelledby="cv-edu-heading">
            <h2 class="cv-section-title" id="cv-edu-heading">${icon.graduation} Pendidikan</h2>
            ${educations.map(edu => `
                <article class="cv-education-item">
                    <h3 class="cv-edu-degree">${esc(edu.degree)}</h3>
                    <p class="cv-edu-institution">${esc(edu.institution)}</p>
                    <time class="cv-edu-period">${esc(edu.period)}</time>
                    ${edu.gpa ? `<p class="cv-edu-gpa">IPK / GPA: ${esc(edu.gpa)}</p>` : ''}
                </article>
            `).join('')}
        </section>`
        : '';

    // Build skills section (sidebar)
    const skillsHtml = skills.length > 0
        ? `<section class="cv-section" aria-labelledby="cv-skills-heading">
            <h2 class="cv-section-title" id="cv-skills-heading">${icon.code} Keahlian</h2>
            <div class="cv-skills-grid" role="list">
                ${skills.map(s => `<span class="cv-skill-tag" role="listitem">${esc(s)}</span>`).join('')}
            </div>
        </section>`
        : '';

    // Build languages section (sidebar)
    const languagesHtml = languages.length > 0
        ? `<section class="cv-section" aria-labelledby="cv-lang-heading">
            <h2 class="cv-section-title" id="cv-lang-heading">${icon.languages} Bahasa</h2>
            ${languages.map(l => `
                <div class="cv-language-item">
                    <span class="cv-lang-name">${esc(l.language)}</span>
                    <span class="cv-lang-level">${esc(l.level)}</span>
                </div>
            `).join('')}
        </section>`
        : '';

    // Build certifications section (sidebar)
    const certificationsHtml = certifications.length > 0
        ? `<section class="cv-section" aria-labelledby="cv-cert-heading">
            <h2 class="cv-section-title" id="cv-cert-heading">${icon.award} Sertifikasi</h2>
            ${certifications.map(c => `
                <article class="cv-cert-item">
                    <p class="cv-cert-name">${esc(c.name)}</p>
                    <p class="cv-cert-meta">${esc(c.issuer)} &bull; ${esc(c.year)}</p>
                </article>
            `).join('')}
        </section>`
        : '';

    const currentYear = new Date().getFullYear();

    // Assemble the full CV HTML
    appEl.innerHTML = `
        <main class="cv-page" id="cv-main-content">
            <div class="cv-wrapper" role="main">

                <!-- ===== HEADER / PROFILE ===== -->
                <header class="cv-header">
                    ${photoHtml}
                    <div class="cv-header-info">
                        <h1 class="cv-name">${esc(profile.name || 'Nama Lengkap')}</h1>
                        <p class="cv-job-title">${esc(profile.title || 'Posisi / Jabatan')}</p>
                        ${profile.summary
                            ? `<p class="cv-summary">${esc(profile.summary)}</p>`
                            : ''}
                        <address class="cv-contact-bar" aria-label="Informasi Kontak">
                            ${contactItems}
                        </address>
                    </div>
                </header>

                <!-- ===== ACTION BUTTONS (hidden on print) ===== -->
                <div class="cv-actions cv-no-print" role="toolbar" aria-label="Aksi CV">
                    <button
                        class="cv-btn cv-btn-primary"
                        onclick="window.print()"
                        aria-label="Download CV sebagai PDF"
                        title="Download sebagai PDF"
                    >
                        ${icon.download} Download PDF
                    </button>
                    <button
                        id="cv-share-btn"
                        class="cv-btn cv-btn-secondary"
                        aria-label="Salin link CV ini"
                        title="Bagikan link CV"
                    >
                        ${icon.share} Bagikan CV
                    </button>
                </div>

                <!-- ===== BODY: Main + Sidebar ===== -->
                <div class="cv-body">

                    <!-- Main Column: Experience + Education -->
                    <div class="cv-main">
                        ${experiencesHtml}
                        ${educationsHtml}
                    </div>

                    <!-- Sidebar Column: Skills + Languages + Certifications -->
                    <aside class="cv-sidebar" aria-label="Keahlian dan Informasi Tambahan">
                        ${skillsHtml}
                        ${languagesHtml}
                        ${certificationsHtml}
                    </aside>

                </div>

                <!-- ===== FOOTER ===== -->
                <footer class="cv-footer">
                    <p>CV dibuat dengan <a href="https://siluet.web.id" target="_blank" rel="noopener noreferrer" style="color:#63b3ed;text-decoration:none;">Wuzzkang</a> &bull; ${currentYear}</p>
                </footer>

            </div>
        </main>
    `;

    // Update document title and SEO meta
    const pageTitle = pageConfig.meta?.title || `CV — ${profile.name || 'Curriculum Vitae'}`;
    document.title = pageTitle;

    // Update OG meta if exists
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', profile.summary || `CV profesional ${profile.name || ''}`);

    // Add event listener programmatically to avoid HTML quote nesting issues
    const shareBtn = document.getElementById('cv-share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.innerHTML = '✅ Link Tersalin!';
                setTimeout(() => {
                    this.innerHTML = `${icon.share} Bagikan CV`;
                }, 2000);
            });
        });
    }
}
