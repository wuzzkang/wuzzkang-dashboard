import React from 'react';
import ImagePickerField from '@/components/ImagePickerField';

export function V2SectionHeaderForm({
  section,
  v2Sections = [],
  v2BrandName = '',
  handleUpdateSectionContent,
  renderSectionStylePicker,
  session,
  handleDeleteImage,
  handleUploadImage
}) {
  return (
    <div className="space-y-3">
      {renderSectionStylePicker(section)}

      <div>
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1">
          Nama Brand / Teks Logo Header (Opsional)
        </label>
        <input
          type="text"
          value={section.content.brand_name || ''}
          onChange={(e) => handleUpdateSectionContent(section.id, { brand_name: e.target.value })}
          placeholder={v2BrandName ? `e.g. ${v2BrandName}` : "Nama Brand / Bisnis"}
          className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
        />
        <p className="text-[8px] text-theme-text-muted mt-1">
          Kosongkan jika ingin otomatis mengikuti Identitas Brand di atas ({v2BrandName || 'Default'}).
        </p>
      </div>

      <label className="flex items-center gap-2 text-xs font-semibold text-theme-text cursor-pointer bg-theme-surface p-2.5 rounded-xl border border-theme-border">
        <input
          type="checkbox"
          checked={section.content.show_nav !== false}
          onChange={(e) => handleUpdateSectionContent(section.id, { show_nav: e.target.checked })}
          className="rounded border-theme-border text-theme-accent focus:ring-theme-accent"
        />
        <span>Tampilkan Menu Navigasi Otomatis (Link Section)</span>
      </label>

      {section.content.show_nav !== false && (
        <div className="space-y-2 p-2.5 bg-theme-surface/50 border border-theme-border/60 rounded-xl">
          <label className="block text-[8px] font-bold text-theme-text-muted uppercase tracking-wider mb-1">
            Pilih Link Menu yang Ingin Ditampilkan:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {v2Sections
              .filter(s => s.type !== 'header' && s.type !== 'footer')
              .map(s => {
                const typeLabelMap = {
                  hero: 'Beranda',
                  about: 'Tentang',
                  services: 'Layanan',
                  pricing: 'Harga',
                  faq: 'FAQ',
                  social_proof: 'Statistik',
                  contact: 'Kontak'
                };
                const label = typeLabelMap[s.type] || s.type;
                const allNavTypes = v2Sections.filter(x => x.type !== 'header' && x.type !== 'footer').map(x => x.type);
                const currentSelected = Array.isArray(section.content.selected_nav_items) 
                  ? section.content.selected_nav_items 
                  : allNavTypes;
                
                const isChecked = currentSelected.includes(s.type);

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      let updated;
                      if (isChecked) {
                        updated = currentSelected.filter(t => t !== s.type);
                      } else {
                        updated = [...currentSelected, s.type];
                      }
                      handleUpdateSectionContent(section.id, { selected_nav_items: updated });
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-theme-accent/15 border-theme-accent text-theme-accent'
                        : 'bg-theme-surface border-theme-border text-theme-text-muted hover:text-theme-text'
                    }`}
                  >
                    {isChecked ? '✓ ' : '+ '}{label}
                  </button>
                );
              })}
          </div>

          {/* Custom Labels Section Inputs */}
          <div className="pt-2 border-t border-theme-border/50 space-y-1.5">
            <label className="block text-[8px] font-bold text-theme-text-sec uppercase tracking-wider">
              Ubah Teks Label Menu (Opsional):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {v2Sections
                .filter(s => s.type !== 'header' && s.type !== 'footer')
                .filter(s => {
                  const allNavTypes = v2Sections.filter(x => x.type !== 'header' && x.type !== 'footer').map(x => x.type);
                  const currentSelected = Array.isArray(section.content.selected_nav_items)
                    ? section.content.selected_nav_items
                    : allNavTypes;
                  return currentSelected.includes(s.type);
                })
                .map(s => {
                  const typeDefaultMap = {
                    hero: 'Beranda',
                    about: 'Tentang',
                    services: 'Layanan',
                    pricing: 'Harga',
                    faq: 'FAQ',
                    social_proof: 'Statistik',
                    contact: 'Kontak'
                  };
                  const defaultLabel = typeDefaultMap[s.type] || s.type;
                  const customLabels = section.content.custom_nav_labels || {};
                  const val = customLabels[s.type] !== undefined ? customLabels[s.type] : defaultLabel;

                  return (
                    <div key={s.id}>
                      <label className="block text-[8px] font-semibold text-theme-text-muted mb-0.5 truncate">
                        Link #{s.type === 'social_proof' ? 'social-proof' : s.type}
                      </label>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => {
                          const updated = { ...(section.content.custom_nav_labels || {}), [s.type]: e.target.value };
                          handleUpdateSectionContent(section.id, { custom_nav_labels: updated });
                        }}
                        placeholder={defaultLabel}
                        className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[8px] font-bold text-theme-text-muted uppercase tracking-wider mb-1">Teks Tombol CTA Header</label>
          <input
            type="text"
            value={section.content.cta_text || ''}
            onChange={(e) => handleUpdateSectionContent(section.id, { cta_text: e.target.value })}
            placeholder="e.g. Hubungi Kami / Login..."
            className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[8px] font-bold text-theme-text-muted uppercase tracking-wider mb-1">Link Tombol CTA Header</label>
          <input
            type="text"
            value={section.content.cta_url || ''}
            onChange={(e) => handleUpdateSectionContent(section.id, { cta_url: e.target.value })}
            placeholder="e.g. #contact atau https://..."
            className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
          />
        </div>
      </div>

      {/* Header Logo Upload */}
      <div className="pt-1 border-t border-theme-border/60">
        <label className="block text-[9px] font-bold text-theme-accent uppercase tracking-wider mb-1.5">🖼️ Gambar Logo Brand Header (Opsional)</label>
        <ImagePickerField
          checkboxId={`v2_header_logo_${section.id}`}
          checkboxLabel="Gunakan Logo kustom untuk Header Navbar"
          unsplashQuery="logo,brand,minimal"
          imageUrl={section.content.logo_url || section.content.image_url || ''}
          onImageChange={(val) => {
            if (!val && (section.content.logo_url || section.content.image_url) && (section.content.logo_source === 'upload' || section.content.image_source === 'upload')) {
              handleDeleteImage && handleDeleteImage(section.content.logo_url || section.content.image_url);
            }
            handleUpdateSectionContent(section.id, { logo_url: val, image_url: val });
          }}
          apiToken={session?.access_token}
          apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
          isEnabled={section.content.logo_enabled !== false}
          onEnabledChange={(enabled) => handleUpdateSectionContent(section.id, { logo_enabled: enabled })}
          source={section.content.logo_source || 'upload'}
          onSourceChange={(src) => handleUpdateSectionContent(section.id, { logo_source: src, image_source: src })}
          onUpload={(file) => handleUploadImage && handleUploadImage(file, `v2_sec_${section.id}`)}
          uploadType={`v2_sec_${section.id}`}
        />
      </div>
    </div>
  );
}

export function V2SectionHeroForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button,
  session,
  handleDeleteImage,
  handleUploadImage
}) {
  return (
    <div className="space-y-2.5">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Headline Utama</label>
        {renderAIV2Button(section.id, 'hero')}
      </div>
      <input
        type="text"
        value={section.content.headline || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { headline: e.target.value })}
        placeholder="Headline penawaran..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
      <textarea
        value={section.content.subheadline || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { subheadline: e.target.value })}
        placeholder="Subheadline penjelasan..."
        rows={2}
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[8px] font-bold text-theme-text-muted uppercase tracking-wider mb-1">Teks Tombol Utama</label>
          <input
            type="text"
            value={section.content.cta_text || ''}
            onChange={(e) => handleUpdateSectionContent(section.id, { cta_text: e.target.value })}
            placeholder="Hubungi Kami..."
            className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[8px] font-bold text-theme-text-muted uppercase tracking-wider mb-1">Link Tombol Utama</label>
          <input
            type="text"
            value={section.content.cta_url || ''}
            onChange={(e) => handleUpdateSectionContent(section.id, { cta_url: e.target.value })}
            placeholder="#contact..."
            className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
          />
        </div>
      </div>

      {/* Hero Image Upload */}
      <div className="pt-2 border-t border-theme-border/60">
        <label className="block text-[9px] font-bold text-theme-accent uppercase tracking-wider mb-1.5">🖼️ Gambar Banner Hero</label>
        <ImagePickerField
          checkboxId={`v2_hero_img_${section.id}`}
          checkboxLabel="Gunakan Gambar Custom / Unsplash untuk Hero"
          unsplashQuery="business,technology,modern"
          imageUrl={section.content.image_url || ''}
          onImageChange={(val) => {
            if (!val && section.content.image_url && section.content.image_source === 'upload') {
              handleDeleteImage && handleDeleteImage(section.content.image_url);
            }
            handleUpdateSectionContent(section.id, { image_url: val });
          }}
          apiToken={session?.access_token}
          apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
          isEnabled={section.content.image_enabled !== false}
          onEnabledChange={(enabled) => handleUpdateSectionContent(section.id, { image_enabled: enabled })}
          source={section.content.image_source || 'upload'}
          onSourceChange={(src) => handleUpdateSectionContent(section.id, { image_source: src })}
          onUpload={(file) => handleUploadImage && handleUploadImage(file, `v2_sec_${section.id}`)}
          uploadType={`v2_sec_${section.id}`}
        />
      </div>
    </div>
  );
}

export function V2SectionAboutForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-2.5">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Judul & Cerita Tentang Kami</label>
        {renderAIV2Button(section.id, 'about')}
      </div>
      <input
        type="text"
        value={section.content.title || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { title: e.target.value })}
        placeholder="Judul tentang..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
      <textarea
        value={section.content.story || section.content.description || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { story: e.target.value, description: e.target.value })}
        placeholder="Cerita atau deskripsi bisnis..."
        rows={4}
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
    </div>
  );
}

export function V2SectionServicesForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-2.5">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Layanan / Fitur Unggulan</label>
        {renderAIV2Button(section.id, 'services')}
      </div>
      <input
        type="text"
        value={section.content.title || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { title: e.target.value })}
        placeholder="Judul bagian layanan..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
    </div>
  );
}

export function V2SectionSocialProofForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-2.5">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Statistik / Pencapaian</label>
        {renderAIV2Button(section.id, 'social_proof')}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Angka Klien</label>
          <input
            type="text"
            value={section.content.client_count || '100+'}
            onChange={(e) => handleUpdateSectionContent(section.id, { client_count: e.target.value })}
            className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Angka Proyek</label>
          <input
            type="text"
            value={section.content.project_count || '250+'}
            onChange={(e) => handleUpdateSectionContent(section.id, { project_count: e.target.value })}
            className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Angka Produk</label>
          <input
            type="text"
            value={section.content.product_count || '50+'}
            onChange={(e) => handleUpdateSectionContent(section.id, { product_count: e.target.value })}
            className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export function V2SectionPricingForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-2.5">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Paket Harga</label>
        {renderAIV2Button(section.id, 'pricing')}
      </div>
      <input
        type="text"
        value={section.content.title || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { title: e.target.value })}
        placeholder="Judul paket harga..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
    </div>
  );
}

export function V2SectionFaqForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-2.5">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Tanya Jawab FAQ</label>
        {renderAIV2Button(section.id, 'faq')}
      </div>
      <input
        type="text"
        value={section.content.title || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { title: e.target.value })}
        placeholder="Judul FAQ..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
    </div>
  );
}

export function V2SectionContactForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-2.5">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Judul & Detail Kontak</label>
        {renderAIV2Button(section.id, 'contact')}
      </div>
      <input
        type="text"
        value={section.content.title || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { title: e.target.value })}
        placeholder="Judul bagian kontak (e.g. Siap Mengembangkan Bisnis Anda?)..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
      <input
        type="text"
        value={section.content.subheadline || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { subheadline: e.target.value })}
        placeholder="Subheadline (e.g. Hubungi tim kami via WhatsApp)..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
      <input
        type="text"
        value={section.content.whatsapp || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { whatsapp: e.target.value })}
        placeholder="No. WhatsApp (e.g. 6281234567890)..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
    </div>
  );
}

export function V2SectionCustomForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-3">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center bg-theme-surface/70 p-2.5 rounded-xl border border-theme-border/60">
        <span className="text-[10px] font-bold text-theme-text uppercase tracking-wider flex items-center gap-1">
          ✦ Custom Section AI Generator
        </span>
        {renderAIV2Button(section.id, 'custom')}
      </div>

      <div>
        <label className="block text-[8px] font-bold text-theme-text-muted uppercase tracking-wider mb-1">
          Badge / Label Accent Top Header (Opsional)
        </label>
        <input
          type="text"
          value={section.content.badge_text || ''}
          onChange={(e) => handleUpdateSectionContent(section.id, { badge_text: e.target.value })}
          placeholder="e.g. PROSES MUDAH / LAYANAN UNGGULAN"
          className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-[8px] font-bold text-theme-text-muted uppercase tracking-wider mb-1">
          Judul Utama (Heading)
        </label>
        <input
          type="text"
          value={section.content.title || ''}
          onChange={(e) => handleUpdateSectionContent(section.id, { title: e.target.value })}
          placeholder="Judul utama section..."
          className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none font-bold"
        />
      </div>

      <div>
        <label className="block text-[8px] font-bold text-theme-text-muted uppercase tracking-wider mb-1">
          Sub Judul (Subheading)
        </label>
        <textarea
          rows={2}
          value={section.content.subtitle || ''}
          onChange={(e) => handleUpdateSectionContent(section.id, { subtitle: e.target.value })}
          placeholder="Penjelasan singkat..."
          className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none resize-y"
        />
      </div>

      {/* Cards List Manager */}
      <div className="pt-2 border-t border-theme-border/60 space-y-3">
        <div className="flex justify-between items-center">
          <label className="block text-[9px] font-bold text-theme-accent uppercase tracking-wider">
            🎴 Daftar Kartu ({(section.content.cards || []).length} Kartu)
          </label>
          <button
            type="button"
            onClick={() => {
              const currentCards = Array.isArray(section.content.cards) ? section.content.cards : [];
              const nextNum = currentCards.length + 1;
              const newCard = {
                badge: `${nextNum}`,
                title: `Langkah ${nextNum}: Judul Baru`,
                description: `Deskripsi penjelasan untuk langkah ${nextNum}...`
              };
              handleUpdateSectionContent(section.id, { cards: [...currentCards, newCard] });
            }}
            className="px-2.5 py-1 text-[10px] font-bold bg-theme-accent/15 hover:bg-theme-accent/25 border border-theme-accent text-theme-accent rounded-lg transition-all cursor-pointer"
          >
            + Tambah Kartu
          </button>
        </div>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {(section.content.cards || []).map((card, cardIdx) => (
            <div key={cardIdx} className="bg-theme-surface border border-theme-border/70 rounded-xl p-3 space-y-2 relative">
              <div className="flex justify-between items-center pb-1.5 border-b border-theme-border/40">
                <span className="text-[9px] font-bold text-theme-accent uppercase tracking-wider">
                  Kartu #{cardIdx + 1}
                </span>
                {(section.content.cards || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const currentCards = Array.isArray(section.content.cards) ? section.content.cards : [];
                      const updatedCards = currentCards.filter((_, i) => i !== cardIdx);
                      handleUpdateSectionContent(section.id, { cards: updatedCards });
                    }}
                    className="text-[9px] font-bold text-red-400 hover:text-red-300 p-0.5 px-1.5 rounded bg-red-500/10 hover:bg-red-500/20 cursor-pointer"
                  >
                    ✕ Hapus
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-[8px] font-semibold text-theme-text-muted mb-0.5">
                    Angka / Badge
                  </label>
                  <input
                    type="text"
                    value={card.badge || ''}
                    onChange={(e) => {
                      const currentCards = [...(section.content.cards || [])];
                      currentCards[cardIdx] = { ...currentCards[cardIdx], badge: e.target.value };
                      handleUpdateSectionContent(section.id, { cards: currentCards });
                    }}
                    placeholder="e.g. 1 / 🚀"
                    className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border rounded-lg text-xs text-theme-text text-center font-bold focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[8px] font-semibold text-theme-text-muted mb-0.5">
                    Judul Kartu
                  </label>
                  <input
                    type="text"
                    value={card.title || ''}
                    onChange={(e) => {
                      const currentCards = [...(section.content.cards || [])];
                      currentCards[cardIdx] = { ...currentCards[cardIdx], title: e.target.value };
                      handleUpdateSectionContent(section.id, { cards: currentCards });
                    }}
                    placeholder="Judul kartu..."
                    className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border rounded-lg text-xs text-theme-text font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-semibold text-theme-text-muted mb-0.5">
                  Deskripsi Kartu
                </label>
                <textarea
                  rows={2}
                  value={card.description || ''}
                  onChange={(e) => {
                    const currentCards = [...(section.content.cards || [])];
                    currentCards[cardIdx] = { ...currentCards[cardIdx], description: e.target.value };
                    handleUpdateSectionContent(section.id, { cards: currentCards });
                  }}
                  placeholder="Penjelasan isi kartu..."
                  className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none resize-y"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function V2SectionStoreGuaranteeForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-3">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Jaminan Belanja Toko</label>
        {renderAIV2Button(section.id, 'store_guarantee')}
      </div>
      <input
        type="text"
        value={section.content.title || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { title: e.target.value })}
        placeholder="Mengapa Belanja Di Toko Kami?..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
    </div>
  );
}

export function V2SectionCourseCurriculumForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-3">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Silabus & Modul Belajar</label>
        {renderAIV2Button(section.id, 'course_curriculum')}
      </div>
      <input
        type="text"
        value={section.content.title || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { title: e.target.value })}
        placeholder="Silabus & Kurikulum Belajar..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
    </div>
  );
}

export function V2SectionCourseMentorForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-3">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Profil Instruktur / Mentor</label>
        {renderAIV2Button(section.id, 'course_mentor')}
      </div>
      <input
        type="text"
        value={section.content.name || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { name: e.target.value })}
        placeholder="Budi Pratama, S.Kom., M.T."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
      <input
        type="text"
        value={section.content.role || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { role: e.target.value })}
        placeholder="Lead Mentor & Digital Strategist..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
      <textarea
        value={section.content.bio || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { bio: e.target.value })}
        placeholder="Biografi singkat mentor..."
        rows={3}
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
    </div>
  );
}
