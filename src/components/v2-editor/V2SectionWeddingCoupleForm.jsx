'use client';
import React from 'react';

export function V2SectionWeddingCoupleForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-3">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Kutipan & Profil Mempelai</label>
        {renderAIV2Button(section.id, 'wedding_couple')}
      </div>
      <div>
        <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Kutipan Bismillah / Doa Restu</label>
        <textarea
          value={section.content.bismillah_quote || ''}
          onChange={(e) => handleUpdateSectionContent(section.id, { bismillah_quote: e.target.value })}
          placeholder="Maha Suci Allah yang telah menciptakan..."
          rows={2}
          className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
        />
      </div>

      {/* Groom Inputs */}
      <div className="p-3 bg-theme-bg/60 border border-theme-border/70 rounded-xl space-y-2">
        <span className="text-[9px] font-extrabold text-orange-400 uppercase tracking-wider block">🤵 Mempelai Pria (Groom)</span>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={section.content.groom_name || ''}
              onChange={(e) => handleUpdateSectionContent(section.id, { groom_name: e.target.value })}
              placeholder="Romeo Adiputra, S.T."
              className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Nama Panggilan</label>
            <input
              type="text"
              value={section.content.groom_nickname || ''}
              onChange={(e) => handleUpdateSectionContent(section.id, { groom_nickname: e.target.value })}
              placeholder="Romeo"
              className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Info Orang Tua</label>
          <input
            type="text"
            value={section.content.groom_parents || ''}
            onChange={(e) => handleUpdateSectionContent(section.id, { groom_parents: e.target.value })}
            placeholder="Putra Pertama dari Bpk. Ahmad & Ibu Siti"
            className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Username Instagram</label>
          <input
            type="text"
            value={section.content.groom_instagram || ''}
            onChange={(e) => handleUpdateSectionContent(section.id, { groom_instagram: e.target.value })}
            placeholder="romeo_adiputra"
            className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
          />
        </div>
      </div>

      {/* Bride Inputs */}
      <div className="p-3 bg-theme-bg/60 border border-theme-border/70 rounded-xl space-y-2">
        <span className="text-[9px] font-extrabold text-orange-400 uppercase tracking-wider block">👰 Mempelai Wanita (Bride)</span>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={section.content.bride_name || ''}
              onChange={(e) => handleUpdateSectionContent(section.id, { bride_name: e.target.value })}
              placeholder="Juliet Saraswati, S.Ked."
              className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Nama Panggilan</label>
            <input
              type="text"
              value={section.content.bride_nickname || ''}
              onChange={(e) => handleUpdateSectionContent(section.id, { bride_nickname: e.target.value })}
              placeholder="Juliet"
              className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Info Orang Tua</label>
          <input
            type="text"
            value={section.content.bride_parents || ''}
            onChange={(e) => handleUpdateSectionContent(section.id, { bride_parents: e.target.value })}
            placeholder="Putri Kedua dari Bpk. Budi & Ibu Rini"
            className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Username Instagram</label>
          <input
            type="text"
            value={section.content.bride_instagram || ''}
            onChange={(e) => handleUpdateSectionContent(section.id, { bride_instagram: e.target.value })}
            placeholder="juliet_saraswati"
            className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
