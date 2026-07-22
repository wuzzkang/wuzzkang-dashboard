import React from 'react';

export function V2SectionProductGridForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-3">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Etalase Produk Toko Online</label>
        {renderAIV2Button(section.id, 'product_grid')}
      </div>
      <input
        type="text"
        value={section.content.title || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { title: e.target.value })}
        placeholder="Judul Katalog Produk..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
      <input
        type="text"
        value={section.content.whatsapp || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { whatsapp: e.target.value })}
        placeholder="No. WhatsApp Order..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />

      {/* Products Repeater */}
      <div className="space-y-2 pt-2 border-t border-theme-border/60">
        <div className="flex justify-between items-center">
          <label className="block text-[9px] font-bold text-theme-accent uppercase tracking-wider">Daftar Produk Katalog ({(section.content.products || []).length})</label>
          <button
            type="button"
            onClick={() => {
              const currentList = [...(section.content.products || [])];
              currentList.push({ name: '', category: 'Best Seller', sale_price: '', original_price: '', badge: '', description: '' });
              handleUpdateSectionContent(section.id, { products: currentList });
            }}
            className="text-[9px] font-bold text-theme-accent hover:underline flex items-center gap-1"
          >
            + Tambah Produk
          </button>
        </div>

        {(section.content.products || []).map((prod, pIdx) => (
          <div key={pIdx} className="p-2.5 bg-theme-bg/60 border border-theme-border/70 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-theme-text-sec">Produk #{pIdx + 1}</span>
              <button
                type="button"
                onClick={() => {
                  const currentList = [...(section.content.products || [])];
                  currentList.splice(pIdx, 1);
                  handleUpdateSectionContent(section.id, { products: currentList });
                }}
                className="text-red-400 hover:text-red-300 text-xs font-bold px-1"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              value={prod.name || ''}
              onChange={(e) => {
                const currentList = [...(section.content.products || [])];
                currentList[pIdx] = { ...currentList[pIdx], name: e.target.value };
                handleUpdateSectionContent(section.id, { products: currentList });
              }}
              placeholder="Nama Produk..."
              className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={prod.sale_price || ''}
                onChange={(e) => {
                  const currentList = [...(section.content.products || [])];
                  currentList[pIdx] = { ...currentList[pIdx], sale_price: e.target.value };
                  handleUpdateSectionContent(section.id, { products: currentList });
                }}
                placeholder="Harga Promo..."
                className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
              />
              <input
                type="text"
                value={prod.original_price || ''}
                onChange={(e) => {
                  const currentList = [...(section.content.products || [])];
                  currentList[pIdx] = { ...currentList[pIdx], original_price: e.target.value };
                  handleUpdateSectionContent(section.id, { products: currentList });
                }}
                placeholder="Harga Coret..."
                className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
              />
            </div>
            <textarea
              value={prod.description || ''}
              onChange={(e) => {
                const currentList = [...(section.content.products || [])];
                currentList[pIdx] = { ...currentList[pIdx], description: e.target.value };
                handleUpdateSectionContent(section.id, { products: currentList });
              }}
              placeholder="Deskripsi singkat produk..."
              rows={2}
              className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
