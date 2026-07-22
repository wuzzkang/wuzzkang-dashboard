'use client';
import React from 'react';
import ImagePickerField from '@/components/ImagePickerField';

const DEFAULT_GROOM_AVATAR = 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/groom-avatar.jpg';
const DEFAULT_BRIDE_AVATAR = 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/bride-avatar.jpg';

export function V2SectionWeddingCoupleForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button,
  session,
  handleDeleteImage,
  handleUploadImage
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
      <div className="p-3 bg-theme-bg/60 border border-theme-border/70 rounded-xl space-y-2.5">
        <span className="text-[9px] font-extrabold text-orange-400 uppercase tracking-wider block">🤵 Mempelai Pria (Groom)</span>
        
        {/* Groom Photo Upload */}
        <div>
          <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Foto Mempelai Pria</label>
          <ImagePickerField
            checkboxId={`v2_groom_photo_${section.id}`}
            checkboxLabel="Gunakan Foto Kustom / Unsplash untuk Mempelai Pria"
            unsplashQuery="groom,man,portrait"
            imageUrl={section.content.groom_photo || section.content.groom_image || DEFAULT_GROOM_AVATAR}
            onImageChange={(val) => {
              if (!val && (section.content.groom_photo || section.content.groom_image)) {
                handleDeleteImage && handleDeleteImage(section.content.groom_photo || section.content.groom_image);
              }
              handleUpdateSectionContent(section.id, { groom_photo: val || DEFAULT_GROOM_AVATAR, groom_image: val || DEFAULT_GROOM_AVATAR });
            }}
            apiToken={session?.access_token}
            apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
            isEnabled={true}
            source={section.content.groom_photo_source || 'upload'}
            onSourceChange={(src) => handleUpdateSectionContent(section.id, { groom_photo_source: src })}
            onUpload={(file) => handleUploadImage && handleUploadImage(file, `v2_groom_${section.id}`)}
            uploadType={`v2_groom_${section.id}`}
          />
        </div>

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
      <div className="p-3 bg-theme-bg/60 border border-theme-border/70 rounded-xl space-y-2.5">
        <span className="text-[9px] font-extrabold text-orange-400 uppercase tracking-wider block">👰 Mempelai Wanita (Bride)</span>

        {/* Bride Photo Upload */}
        <div>
          <label className="block text-[8px] font-bold text-theme-text-muted mb-1">Foto Mempelai Wanita</label>
          <ImagePickerField
            checkboxId={`v2_bride_photo_${section.id}`}
            checkboxLabel="Gunakan Foto Kustom / Unsplash untuk Mempelai Wanita"
            unsplashQuery="bride,woman,portrait"
            imageUrl={section.content.bride_photo || section.content.bride_image || DEFAULT_BRIDE_AVATAR}
            onImageChange={(val) => {
              if (!val && (section.content.bride_photo || section.content.bride_image)) {
                handleDeleteImage && handleDeleteImage(section.content.bride_photo || section.content.bride_image);
              }
              handleUpdateSectionContent(section.id, { bride_photo: val || DEFAULT_BRIDE_AVATAR, bride_image: val || DEFAULT_BRIDE_AVATAR });
            }}
            apiToken={session?.access_token}
            apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
            isEnabled={true}
            source={section.content.bride_photo_source || 'upload'}
            onSourceChange={(src) => handleUpdateSectionContent(section.id, { bride_photo_source: src })}
            onUpload={(file) => handleUploadImage && handleUploadImage(file, `v2_bride_${section.id}`)}
            uploadType={`v2_bride_${section.id}`}
          />
        </div>

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
