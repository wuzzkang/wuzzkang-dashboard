'use client';

import React from 'react';
import { X, Plus, Check, Layout, Sparkles, AlertCircle } from 'lucide-react';

const SECTION_CATALOG = [
  {
    type: 'header',
    title: 'Header / Top Navigation',
    icon: '📌',
    badge: 'Standard',
    description: 'Baris navigasi paling atas dengan logo brand, menu link otomatis, dan tombol kontak fast response.',
    isSingleInstance: true
  },
  {
    type: 'hero',
    title: 'Hero / Banner Utama',
    icon: '🖼️',
    badge: 'Wajib',
    description: 'Area utama di bagian paling atas halaman dengan headline menonjol, sub-judul, dan tombol penawaran utama.',
    isSingleInstance: true
  },
  {
    type: 'about',
    title: 'About / Tentang Kami',
    icon: '📖',
    badge: 'Standard',
    description: 'Penjelasan singkat tentang latar belakang bisnis, sejarah singkat, atau kisah inspiratif pengantin/brand.',
    isSingleInstance: true
  },
  {
    type: 'social_proof',
    title: 'Social Proof & Statistik',
    icon: '⭐',
    badge: 'Konversi',
    description: 'Counter lencana berisi statistik angka klien puas, total proyek selesai, atau persentase reputasi.',
    isSingleInstance: true
  },
  {
    type: 'services',
    title: 'Services / Layanan Grid',
    icon: '🛠️',
    badge: 'Grid',
    description: 'Kartu kisi-kisi untuk menampilkan daftar produk, varian layanan, atau keunggulan fasilitas.',
    isSingleInstance: true
  },
  {
    type: 'pricing',
    title: 'Pricing / Paket Harga',
    icon: '🏷️',
    badge: 'Penawaran',
    description: 'Tabel perbandingan harga dengan opsi kartu highlight untuk menarik perhatian calon pembeli.',
    isSingleInstance: true
  },
  {
    type: 'custom',
    title: 'Custom / Feature Cards',
    icon: '✦',
    badge: 'Bebas & Banyak',
    description: 'Blok fleksibel dengan lencana angka/ikon (misal: 3 Langkah Kerja, Keunggulan Utama, atau Rincian Acara).',
    isSingleInstance: false
  },
  {
    type: 'wedding_hero',
    title: 'Wedding / Cover Depan & Header',
    icon: '🌸',
    badge: 'Pernikahan',
    description: 'Cover utama undangan pernikahan romantis dengan nama pengantin cursive, kaligrafi Walimatul Ursy, dan tombol Buka Undangan.',
    isSingleInstance: true
  },
  {
    type: 'wedding_couple',
    title: 'Wedding / Profil Mempelai',
    icon: '💍',
    badge: 'Pernikahan',
    description: 'Kartu profil eksklusif untuk Mempelai Pria & Mempelai Wanita lengkap dengan foto, bio, nama orang tua, & Instagram.',
    isSingleInstance: true
  },
  {
    type: 'wedding_countdown',
    title: 'Wedding / Live Countdown Timer',
    icon: '⏳',
    badge: 'Pernikahan',
    description: 'Penghitung mundur waktu nyata (Hari, Jam, Menit, Detik) menuju hari-H Akad Nikah & Resepsi Pernikahan.',
    isSingleInstance: true
  },
  {
    type: 'wedding_events',
    title: 'Wedding / Rangkaian Acara',
    icon: '📅',
    badge: 'Pernikahan',
    description: 'Jadwal waktu & tempat pelaksanaan Akad Nikah dan Resepsi Pernikahan lengkap dengan tombol petunjuk Google Maps.',
    isSingleInstance: true
  },
  {
    type: 'wedding_story',
    title: 'Wedding / Love Story Timeline',
    icon: '💕',
    badge: 'Pernikahan',
    description: 'Linimasa perjalanan kisah cinta pasangan (Pertama Bertemu, Momen Lamaran, Menuju Pernikahan).',
    isSingleInstance: true
  },
  {
    type: 'wedding_gallery',
    title: 'Wedding / Galeri Foto Prewedding',
    icon: '📸',
    badge: 'Pernikahan',
    description: 'Grid album galeri foto kenangan momen bahagia mempelai.',
    isSingleInstance: true
  },
  {
    type: 'digital_gift',
    title: 'Wedding / Amplop Digital & QRIS',
    icon: '💳',
    badge: 'Pernikahan',
    description: 'Kartu tanda kasih cashless dengan tombol 1-Click Copy No. Rekening Bank, pratinjau gambar QRIS, dan konfirmasi WhatsApp RSVP.',
    isSingleInstance: true
  },
  {
    type: 'wedding_wishes',
    title: 'Wedding / Buku Tamu & Ucapan Doa',
    icon: '💌',
    badge: 'Pernikahan',
    description: 'Form interaktif ucapan doa restu dan konfirmasi kehadiran tamu lengkap dengan feed ucapan.',
    isSingleInstance: true
  },
  {
    type: 'product_grid',
    title: 'Store / Etalase Katalog Produk',
    icon: '🛍️',
    badge: 'Toko Online',
    description: 'Grid etalase produk katalog dengan badge diskon, perbandingan harga promo vs asli, thumbnail foto, & tombol Checkout WA.',
    isSingleInstance: true
  },
  {
    type: 'store_guarantee',
    title: 'Store / Jaminan & Garansi Toko',
    icon: '🛡️',
    badge: 'Toko Online',
    description: 'Lencana kepercayaan pembeli seperti garansi 100% original, pengiriman cepat, ganti baru, & admin CS fast response.',
    isSingleInstance: true
  },
  {
    type: 'course_curriculum',
    title: 'E-Course / Silabus & Kurikulum',
    icon: '📚',
    badge: 'Kelas Online',
    description: 'Daftar modul materi pembelajaran terstruktur lengkap dengan checklist daftar materi, durasi video, & sumber daya.',
    isSingleInstance: true
  },
  {
    type: 'course_mentor',
    title: 'E-Course / Profil Instruktur Mentor',
    icon: '👨‍🏫',
    badge: 'Kelas Online',
    description: 'Kartu biografi instruktur utama lengkap dengan lencana statistik alumni, tahun pengalaman, & tautan LinkedIn/Portofolio.',
    isSingleInstance: true
  },
  {
    type: 'faq',
    title: 'FAQ / Pertanyaan Umum',
    icon: '❓',
    badge: 'Support',
    description: 'Daftar pertanyaan dan jawaban interaktif untuk menghilangkan keraguan calon pembeli.',
    isSingleInstance: true
  },
  {
    type: 'contact',
    title: 'Contact / WhatsApp CTA',
    icon: '💬',
    badge: 'Penutup',
    description: 'Section penutup di bagian bawah halaman dengan deskripsi pendorong aksi dan tombol langsung ke WhatsApp.',
    isSingleInstance: true
  }
];

export default function V2VisualSectionPickerModal({ isOpen, onClose, onSelectSection, existingSections = [] }) {
  if (!isOpen) return null;

  const existingTypes = new Set(existingSections.map(s => s.type));

  const handlePick = (sectionType, isAlreadyAdded) => {
    if (isAlreadyAdded && sectionType !== 'custom') {
      alert(`Section '${sectionType.toUpperCase()}' sudah ada di halaman Anda. Section standar hanya boleh dibuat 1 kali.\n\nGunakan '✦ Custom / Feature Cards' jika ingin menambah bagian baru tanpa batas.`);
      return;
    }
    onSelectSection(sectionType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-theme-card border border-theme-border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-5 border-b border-theme-border/60 bg-theme-bg/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-theme-accent/15 text-theme-accent flex items-center justify-center font-bold text-lg">
              ✨
            </div>
            <div>
              <h3 className="text-base font-extrabold text-theme-text tracking-wide flex items-center gap-2">
                Katalog Visual Section V2
              </h3>
              <p className="text-xs text-theme-text-sec mt-0.5">
                Pilih komponen section modular yang ingin Anda tambahkan ke dalam landing page
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-theme-text-sec hover:text-theme-text hover:bg-theme-bg rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Section Grid */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTION_CATALOG.map((sec) => {
              const isAlreadyAdded = sec.isSingleInstance && existingTypes.has(sec.type);

              return (
                <div
                  key={sec.type}
                  onClick={() => handlePick(sec.type, isAlreadyAdded)}
                  className={`group relative flex flex-col justify-between p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isAlreadyAdded
                      ? 'bg-theme-bg/40 border-theme-border/40 opacity-70 hover:opacity-100 hover:border-theme-border'
                      : 'bg-theme-bg hover:bg-theme-bg/90 border-theme-border hover:border-theme-accent hover:shadow-lg hover:shadow-theme-accent/5 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <span className="text-2xl">{sec.icon}</span>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isAlreadyAdded
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-theme-accent/10 text-theme-accent border-theme-accent/20'
                        }`}
                      >
                        {isAlreadyAdded ? '✓ Sudah Ada' : sec.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-theme-text group-hover:text-theme-accent transition-colors">
                        {sec.title}
                      </h4>
                      <p className="text-xs text-theme-text-sec mt-1 line-clamp-3 leading-relaxed">
                        {sec.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-theme-border/40 flex items-center justify-between text-xs font-bold">
                    <span className="text-theme-text-sec text-[10px] uppercase tracking-wider">
                      {sec.isSingleInstance ? '1x Per Halaman' : 'Bebas / Unlimited'}
                    </span>
                    <button
                      type="button"
                      className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-bold transition-colors ${
                        isAlreadyAdded
                          ? 'text-theme-text-muted bg-theme-bg border border-theme-border'
                          : 'bg-theme-accent text-theme-accent-text group-hover:scale-105'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAlreadyAdded ? 'Tambah Lagi' : 'Pilih'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3.5 px-6 border-t border-theme-border/60 bg-theme-bg/60 text-center text-xs text-theme-text-sec">
          💡 <span className="font-semibold">Tips:</span> Anda dapat menggeser urutan tampilan atau mengubah gaya tema warna per section kapan saja di panel editor.
        </div>
      </div>
    </div>
  );
}
