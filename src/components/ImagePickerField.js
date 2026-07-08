'use client';

import { useState } from 'react';

/**
 * ImagePickerField — Komponen reusable untuk memilih gambar background/cover.
 *
 * Mendukung dua sumber gambar:
 * - Unsplash (acak berdasarkan query keyword)
 * - Upload file dari perangkat pengguna
 *
 * Props:
 * @param {string}   checkboxId        - ID unik untuk element <input type="checkbox">
 * @param {string}   checkboxLabel     - Label teks yang ditampilkan di sebelah checkbox
 * @param {string}   unsplashQuery     - Keyword Unsplash, e.g. "wedding,romantic" atau "business,success"
 * @param {string}   imageUrl          - URL gambar yang sedang aktif (dikontrol parent)
 * @param {Function} onImageChange     - Callback saat URL gambar berubah: (url: string) => void
 * @param {string}   apiToken          - JWT Bearer token untuk otentikasi API
 * @param {string}   apiBaseUrl        - Base URL API, e.g. process.env.NEXT_PUBLIC_API_URL
 * @param {boolean}  [isEnabled]       - Apakah checkbox dicentang (controlled dari parent)
 * @param {Function} [onEnabledChange] - Callback saat checkbox berubah: (enabled: boolean) => void
 * @param {string}   [source]          - Sumber aktif: 'unsplash' | 'upload' (controlled dari parent)
 * @param {Function} [onSourceChange]  - Callback saat tab sumber berubah: (source: string) => void
 * @param {Function} [onUpload]        - Fungsi upload file: (file: File, uploadType: string) => void
 * @param {string}   [uploadType]      - Key type yang diteruskan ke onUpload, e.g. 'prewedding'
 *
 * Contoh penggunaan minimal (Wedding prewedding):
 * ```jsx
 * <ImagePickerField
 *   checkboxId="generatePrewedding"
 *   checkboxLabel="Gunakan Foto Cover / Background Prewedding"
 *   unsplashQuery=""
 *   imageUrl={preweddingPhotoUrl}
 *   onImageChange={setPreweddingPhotoUrl}
 *   apiToken={session.access_token}
 *   apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
 *   isEnabled={generatePrewedding}
 *   onEnabledChange={setGeneratePrewedding}
 *   source={preweddingSource}
 *   onSourceChange={setPreweddingSource}
 *   onUpload={handleUploadImage}
 *   uploadType="prewedding"
 * />
 * ```
 *
 * Contoh penggunaan (Campaign hero):
 * ```jsx
 * <ImagePickerField
 *   checkboxId="generateCampaignHero"
 *   checkboxLabel="Gunakan Foto Background Hero Section"
 *   unsplashQuery="business,workspace,marketing,success"
 *   imageUrl={campaignHeroImage}
 *   onImageChange={setCampaignHeroImage}
 *   apiToken={session.access_token}
 *   apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
 *   isEnabled={generateCampaignHero}
 *   onEnabledChange={setGenerateCampaignHero}
 *   source={campaignHeroImageSource}
 *   onSourceChange={setCampaignHeroImageSource}
 *   onUpload={handleUploadImage}
 *   uploadType="campaignHero"
 * />
 * ```
 *
 * Panduan menambah template baru:
 * 1. Tambahkan state di parent (page.js):
 *    const [generateXxxImage, setGenerateXxxImage] = useState(false);
 *    const [xxxImageUrl, setXxxImageUrl] = useState('');
 *    const [xxxImageSource, setXxxImageSource] = useState('unsplash');
 * 2. Saat load edit mode, set state dari DB:
 *    if (content.xxx?.image_url) { setGenerateXxxImage(true); ... }
 * 3. Di assembledContent, gunakan generateXxxImage sebagai gating:
 *    image_url: generateXxxImage ? (xxxImageUrl || null) : null
 * 4. Tambahkan xxxImageUrl dan generateXxxImage ke dependency array useEffect
 * 5. Di JSX, render komponen ini dengan props yang sesuai
 */
export default function ImagePickerField({
  checkboxId,
  checkboxLabel,
  unsplashQuery = '',
  imageUrl = '',
  onImageChange,
  apiToken,
  apiBaseUrl,
  isEnabled = false,
  onEnabledChange,
  source = 'unsplash',
  onSourceChange,
  onUpload,
  uploadType = 'image',
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    if (onEnabledChange) onEnabledChange(checked);
    if (!checked && onImageChange) onImageChange('');
  };

  const handleFetchUnsplash = async () => {
    if (!apiToken || !apiBaseUrl) return;
    setIsGenerating(true);
    try {
      const response = await fetch(`${apiBaseUrl}/media/prewedding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({ query: unsplashQuery }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        if (onImageChange) onImageChange(result.preweddingPhotoUrl);
      } else {
        const errMsg = result.error || 'Gagal mengambil foto dari Unsplash.';
        alert(errMsg);
      }
    } catch (err) {
      console.error('[ImagePickerField] Unsplash fetch error:', err);
      alert('Terjadi kesalahan jaringan saat mengambil foto background.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;
    setIsUploading(true);
    try {
      await onUpload(file, uploadType);
    } finally {
      setIsUploading(false);
    }
  };

  const isUnsplashImage = imageUrl && imageUrl.includes('images.unsplash.com');

  return (
    <div className="flex flex-col gap-2 bg-theme-bg/50 p-3 rounded-xl border border-theme-border mt-1">
      {/* Checkbox toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={checkboxId}
          checked={isEnabled}
          onChange={handleCheckboxChange}
          className="w-4 h-4 rounded border-theme-border text-theme-accent focus:ring-theme-accent bg-theme-surface cursor-pointer"
        />
        <label
          htmlFor={checkboxId}
          className="text-[10px] text-theme-text font-semibold cursor-pointer select-none"
        >
          {checkboxLabel}
        </label>
      </div>

      {/* Expanded content — tampil hanya saat checkbox aktif */}
      {isEnabled && (
        <div className="mt-1.5 border-t border-theme-border pt-2 flex flex-col gap-2">
          {/* Tab: Unsplash vs Upload */}
          <div className="flex gap-2 mb-1">
            <button
              type="button"
              onClick={() => onSourceChange && onSourceChange('unsplash')}
              className={`flex-1 py-1.5 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                source === 'unsplash'
                  ? 'bg-theme-accent text-theme-accent-text border-theme-accent shadow-sm'
                  : 'bg-theme-card border-theme-border text-theme-text-sec hover:text-theme-text'
              }`}
            >
              📷 Pilihan Acak Unsplash
            </button>
            <button
              type="button"
              onClick={() => onSourceChange && onSourceChange('upload')}
              className={`flex-1 py-1.5 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                source === 'upload'
                  ? 'bg-theme-accent text-theme-accent-text border-theme-accent shadow-sm'
                  : 'bg-theme-card border-theme-border text-theme-text-sec hover:text-theme-text'
              }`}
            >
              📤 Upload Sendiri
            </button>
          </div>

          {/* Panel: Unsplash */}
          {source === 'unsplash' && (
            <div className="flex flex-col gap-2">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center p-4 bg-theme-surface/50 border border-theme-border rounded-lg gap-2">
                  <div className="h-5 w-5 rounded-full border-2 border-theme-accent/20 border-t-theme-accent animate-spin" />
                  <span className="text-[9px] text-theme-text-muted font-bold animate-pulse">
                    Mengambil foto dari Unsplash...
                  </span>
                </div>
              ) : imageUrl ? (
                <>
                  <div className="text-[8px] font-bold text-theme-text-muted uppercase tracking-wider">
                    Foto Unsplash Saat Ini
                  </div>
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-theme-border bg-theme-surface">
                    <img src={imageUrl} className="w-full h-full object-cover" alt="Foto Unsplash" />
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchUnsplash}
                    className="w-full text-center font-bold py-1.5 px-2.5 rounded-lg transition-all active:scale-[0.98] border text-[9px] bg-theme-card hover:bg-theme-bg border-theme-border text-theme-text-sec cursor-pointer"
                  >
                    🔄 Ganti Foto Unsplash Acak
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="text-[9px] text-theme-text-muted leading-relaxed">
                    Belum ada foto background yang dipilih. Klik tombol di bawah untuk mengambil foto acak dari Unsplash.
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchUnsplash}
                    className="w-full font-bold py-2 px-3 rounded-lg text-center transition-all shadow-md active:scale-[0.98] text-[9px] bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text cursor-pointer"
                  >
                    ✨ Ambil Foto Unsplash Acak
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Panel: Upload */}
          {source === 'upload' && (
            <div className="flex flex-col gap-2">
              {isUploading ? (
                <div className="flex flex-col items-center justify-center p-4 bg-theme-surface/50 border border-theme-border rounded-lg gap-2">
                  <div className="h-5 w-5 rounded-full border-2 border-theme-accent/20 border-t-theme-accent animate-spin" />
                  <span className="text-[9px] text-theme-text-muted font-bold animate-pulse">
                    Mengunggah foto...
                  </span>
                </div>
              ) : imageUrl && !isUnsplashImage ? (
                <>
                  <div className="text-[8px] font-bold text-theme-text-muted uppercase tracking-wider">
                    Foto Upload Anda
                  </div>
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-theme-border bg-theme-surface">
                    <img src={imageUrl} className="w-full h-full object-cover" alt="Foto Upload" />
                  </div>
                  <button
                    type="button"
                    onClick={() => onImageChange && onImageChange('')}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-[9px] font-bold py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    🗑️ Hapus Foto Terupload
                  </button>
                </>
              ) : (
                <div className="text-[9px] text-theme-text-muted leading-relaxed">
                  Silakan unggah foto background Anda sendiri.
                </div>
              )}
              <label className="w-full bg-theme-card hover:bg-theme-bg border border-theme-border text-theme-text-sec hover:text-theme-text text-[9px] font-bold py-2 px-3 rounded-lg text-center cursor-pointer transition-colors">
                {isUploading ? 'Mengunggah...' : 'Upload Background'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
