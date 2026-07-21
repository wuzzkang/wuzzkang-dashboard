/**
 * Modular Section: Social Proof / Stats Navy (V2)
 */
export function render(data = {}, pageConfig = {}, brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const clientCount = data.client_count || '';
    const projectCount = data.project_count || '';
    const productCount = data.product_count || '';
    const labelClients = data.label_clients || 'Klien Puas';
    const labelProjects = data.label_projects || 'Proyek Selesai';
    const labelProducts = data.label_products || 'Produk Aktif';

    // If no count data provided, return empty string (hide section)
    if (!clientCount && !projectCount && !productCount) {
        return '';
    }

    const items = [];
    if (clientCount) items.push({ number: clientCount, label: labelClients });
    if (projectCount) items.push({ number: projectCount, label: labelProjects });
    if (productCount) items.push({ number: productCount, label: labelProducts });

    const gridCols = items.length === 1 ? 'grid-cols-1 max-w-sm' : (items.length === 2 ? 'grid-cols-2 max-w-2xl' : 'grid-cols-3 max-w-4xl');

    const itemsHtml = items.map(item => `
        <div class="p-6 bg-slate-900/90 text-white rounded-2xl border border-slate-800 text-center shadow-lg hover:border-orange-500/50 transition-all">
            <div class="text-3xl md:text-4xl font-extrabold text-orange-500 mb-1">${item.number}</div>
            <div class="text-xs md:text-sm text-slate-400 font-medium uppercase tracking-wider">${item.label}</div>
        </div>
    `).join('');

    return `
        <section id="social-proof" class="py-12 px-6 bg-slate-950">
            <div class="mx-auto grid ${gridCols} gap-6">
                ${itemsHtml}
            </div>
        </section>
    `;
}
