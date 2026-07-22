import React from 'react';

export function V2SectionWeddingEventsForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-3">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Jadwal Akad & Resepsi</label>
        {renderAIV2Button(section.id, 'wedding_events')}
      </div>
      <input
        type="text"
        value={section.content.title || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { title: e.target.value })}
        placeholder="Rangkaian Acara Pernikahan..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
      <input
        type="text"
        value={section.content.subtitle || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { subtitle: e.target.value })}
        placeholder="Pelaksanaan Akad Nikah & Resepsi..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />

      {/* Akad Nikah */}
      <div className="p-3 bg-theme-bg/60 border border-theme-border/70 rounded-xl space-y-2">
        <span className="text-[9px] font-extrabold text-orange-400 uppercase tracking-wider block">💍 Pelaksanaan Akad Nikah</span>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={section.content.akad_date || ''}
            onChange={(e) => handleUpdateSectionContent(section.id, { akad_date: e.target.value })}
            placeholder="Sabtu, 12 Des 2026"
            className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
          />
          <input
            type="text"
            value={section.content.akad_time || ''}
            onChange={(e) => handleUpdateSectionContent(section.id, { akad_time: e.target.value })}
            placeholder="Pukul 08.00 WIB"
            className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
          />
        </div>
        <input
          type="text"
          value={section.content.akad_location || ''}
          onChange={(e) => handleUpdateSectionContent(section.id, { akad_location: e.target.value })}
          placeholder="Nama Tempat (e.g. Gedung Pernikahan Indah)..."
          className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
        />
        <input
          type="text"
          value={section.content.akad_address || ''}
          onChange={(e) => handleUpdateSectionContent(section.id, { akad_address: e.target.value })}
          placeholder="Alamat Lengkap Gedung Akad..."
          className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
        />
        <input
          type="text"
          value={section.content.akad_maps_url || ''}
          onChange={(e) => handleUpdateSectionContent(section.id, { akad_maps_url: e.target.value })}
          placeholder="Link Google Maps Akad URL..."
          className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
        />
      </div>

      {/* Resepsi Pernikahan */}
      <div className="p-3 bg-theme-bg/60 border border-theme-border/70 rounded-xl space-y-2">
        <span className="text-[9px] font-extrabold text-orange-400 uppercase tracking-wider block">🎉 Pelaksanaan Resepsi Pernikahan</span>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={section.content.resepsi_date || ''}
            onChange={(e) => handleUpdateSectionContent(section.id, { resepsi_date: e.target.value })}
            placeholder="Sabtu, 12 Des 2026"
            className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
          />
          <input
            type="text"
            value={section.content.resepsi_time || ''}
            onChange={(e) => handleUpdateSectionContent(section.id, { resepsi_time: e.target.value })}
            placeholder="Pukul 11.00 - 15.00 WIB"
            className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
          />
        </div>
        <input
          type="text"
          value={section.content.resepsi_location || ''}
          onChange={(e) => handleUpdateSectionContent(section.id, { resepsi_location: e.target.value })}
          placeholder="Nama Tempat Resepsi..."
          className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
        />
        <input
          type="text"
          value={section.content.resepsi_address || ''}
          onChange={(e) => handleUpdateSectionContent(section.id, { resepsi_address: e.target.value })}
          placeholder="Alamat Lengkap Resepsi..."
          className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
        />
        <input
          type="text"
          value={section.content.resepsi_maps_url || ''}
          onChange={(e) => handleUpdateSectionContent(section.id, { resepsi_maps_url: e.target.value })}
          placeholder="Link Google Maps Resepsi URL..."
          className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
        />
      </div>
    </div>
  );
}
