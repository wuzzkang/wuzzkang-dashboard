import React from 'react';

export function V2SectionWeddingHeroForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-3">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Hero / Cover Depan Undangan Pernikahan</label>
        {renderAIV2Button(section.id, 'wedding_hero')}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Nama Panggilan Pria</label>
          <input
            type="text"
            value={section.content.groom_nickname || ''}
            onChange={(e) => handleUpdateSectionContent(section.id, { groom_nickname: e.target.value })}
            placeholder="Romeo"
            className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Nama Panggilan Wanita</label>
          <input
            type="text"
            value={section.content.bride_nickname || ''}
            onChange={(e) => handleUpdateSectionContent(section.id, { bride_nickname: e.target.value })}
            placeholder="Juliet"
            className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Judul Cursive Pasangan (Headline)</label>
        <input
          type="text"
          value={section.content.headline || ''}
          onChange={(e) => handleUpdateSectionContent(section.id, { headline: e.target.value })}
          placeholder="Romeo & Juliet"
          className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none font-bold"
        />
      </div>
      <div>
        <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Pesan Pembuka (Subheadline)</label>
        <textarea
          rows={2}
          value={section.content.subheadline || ''}
          onChange={(e) => handleUpdateSectionContent(section.id, { subheadline: e.target.value })}
          placeholder="Tanpa mengurangi rasa hormat, kami mengundang..."
          className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Teks Tombol Buka Undangan</label>
          <input
            type="text"
            value={section.content.cta_text || ''}
            onChange={(e) => handleUpdateSectionContent(section.id, { cta_text: e.target.value })}
            placeholder="💌 BUKA UNDANGAN"
            className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Label Tamu Default</label>
          <input
            type="text"
            value={section.content.recipient_name || ''}
            onChange={(e) => handleUpdateSectionContent(section.id, { recipient_name: e.target.value })}
            placeholder="Bapak/Ibu/Saudara/i"
            className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export function V2SectionWeddingCountdownForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-3">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Live Countdown Timer Hari-H</label>
        {renderAIV2Button(section.id, 'wedding_countdown')}
      </div>
      <input
        type="text"
        value={section.content.title || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { title: e.target.value })}
        placeholder="Menuju Hari Bahagia..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
      <input
        type="text"
        value={section.content.subtitle || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { subtitle: e.target.value })}
        placeholder="Hitung mundur momen istimewa..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
      <div>
        <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Target Tanggal & Jam Pernikahan (ISO Format)</label>
        <input
          type="datetime-local"
          value={section.content.target_date ? section.content.target_date.substring(0, 16) : ''}
          onChange={(e) => handleUpdateSectionContent(section.id, { target_date: e.target.value })}
          className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
        />
      </div>
    </div>
  );
}

export function V2SectionWeddingStoryForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-3">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Kisah Kasih (Love Story Timeline)</label>
        {renderAIV2Button(section.id, 'wedding_story')}
      </div>
      <input
        type="text"
        value={section.content.title || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { title: e.target.value })}
        placeholder="Kisah Kasih Kami..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
      <input
        type="text"
        value={section.content.subtitle || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { subtitle: e.target.value })}
        placeholder="Perjalanan cinta kami..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />

      {/* Story Items Repeater */}
      <div className="space-y-2 pt-2 border-t border-theme-border/60">
        <div className="flex justify-between items-center">
          <label className="block text-[9px] font-bold text-theme-accent uppercase tracking-wider">Momen Perjalanan ({(section.content.stories || []).length})</label>
          <button
            type="button"
            onClick={() => {
              const current = [...(section.content.stories || [])];
              current.push({ date: 'Tahun Baru', title: 'Momen Bahagia', desc: 'Penjelasan momen...' });
              handleUpdateSectionContent(section.id, { stories: current });
            }}
            className="text-[9px] font-bold text-theme-accent hover:underline flex items-center gap-1"
          >
            + Tambah Momen
          </button>
        </div>

        {(section.content.stories || []).map((st, idx) => (
          <div key={idx} className="p-2.5 bg-theme-bg/60 border border-theme-border/70 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-theme-text-sec">Momen #{idx + 1}</span>
              <button
                type="button"
                onClick={() => {
                  const current = [...(section.content.stories || [])];
                  current.splice(idx, 1);
                  handleUpdateSectionContent(section.id, { stories: current });
                }}
                className="text-red-400 hover:text-red-300 text-xs font-bold px-1"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={st.date || ''}
                onChange={(e) => {
                  const current = [...(section.content.stories || [])];
                  current[idx] = { ...current[idx], date: e.target.value };
                  handleUpdateSectionContent(section.id, { stories: current });
                }}
                placeholder="Tanggal/Tahun"
                className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
              />
              <input
                type="text"
                value={st.title || ''}
                onChange={(e) => {
                  const current = [...(section.content.stories || [])];
                  current[idx] = { ...current[idx], title: e.target.value };
                  handleUpdateSectionContent(section.id, { stories: current });
                }}
                placeholder="Judul Momen"
                className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
              />
            </div>
            <textarea
              rows={2}
              value={st.desc || ''}
              onChange={(e) => {
                const current = [...(section.content.stories || [])];
                current[idx] = { ...current[idx], desc: e.target.value };
                handleUpdateSectionContent(section.id, { stories: current });
              }}
              placeholder="Cerita singkat..."
              className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function V2SectionWeddingGalleryForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-3">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Galeri Album Prewedding</label>
        {renderAIV2Button(section.id, 'wedding_gallery')}
      </div>
      <input
        type="text"
        value={section.content.title || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { title: e.target.value })}
        placeholder="Galeri Album Prewedding..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
      <input
        type="text"
        value={section.content.subtitle || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { subtitle: e.target.value })}
        placeholder="Momen kebersamaan..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
    </div>
  );
}

export function V2SectionWeddingWishesForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-3">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Buku Tamu & Form Ucapan Doa Restu</label>
        {renderAIV2Button(section.id, 'wedding_wishes')}
      </div>
      <input
        type="text"
        value={section.content.title || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { title: e.target.value })}
        placeholder="Buku Tamu & Doa Restu..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
      <input
        type="text"
        value={section.content.subtitle || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { subtitle: e.target.value })}
        placeholder="Kirimkan pesan ucapan doa restu..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
    </div>
  );
}
