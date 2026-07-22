/**
 * Wuzzkang V2 Dynamic Builder - Starter Kit Presets
 * 
 * Provides deterministic initial section stacks for various landing page goals.
 * Pure JavaScript - 0% LLM token consumption.
 */

export const V2_STARTER_PRESETS = [
  {
    id: 'jasa',
    name: 'Jasa & Layanan Profesional',
    icon: '🛠️',
    badge: 'Populer',
    description: 'Cocok untuk agensi, konsultan, freelancer, jasa perbaikan, dan bisnis penyedia layanan.',
    defaultBrandName: 'Jasa Profesional Impian',
    defaultBrief: 'Menyediakan layanan profesional berkualitas tinggi dengan garansi kepuasan pelanggan.',
    sections: [
      {
        id: 'sec-header-jasa',
        type: 'header',
        variant: 'navbar-navy',
        content: {
          show_nav: true,
          cta_text: 'Konsultasi Gratis',
          cta_url: '#contact',
          logo_enabled: true
        }
      },
      {
        id: 'sec-hero-jasa',
        type: 'hero',
        variant: 'split-navy',
        content: {
          headline: 'Solusi Jasa Profesional & Terpercaya Untuk Anda',
          subheadline: 'Tingkatkan efisiensi dan hasil terbaik dengan tim berpengalaman yang siap membantu kebutuhan Anda.',
          cta_text: 'Hubungi Kami Sekarang'
        }
      },
      {
        id: 'sec-social_proof-jasa',
        type: 'social_proof',
        variant: 'navy',
        content: {
          client_count: '250+',
          label_clients: 'Klien Puas',
          project_count: '500+',
          label_projects: 'Proyek Selesai',
          product_count: '99%',
          label_products: 'Tingkat Kepuasan'
        }
      },
      {
        id: 'sec-about-jasa',
        type: 'about',
        variant: 'simple-navy',
        content: {
          title: 'Tentang Layanan Kami',
          description: 'Kami berkomitmen memberikan hasil kerja berstandar tinggi dengan proses yang efisien, transparan, dan tepat waktu.'
        }
      },
      {
        id: 'sec-services-jasa',
        type: 'services',
        variant: 'grid-navy',
        content: {
          title: 'Layanan Unggulan Kami',
          items: [
            { title: 'Konsultasi & Perencanaan', desc: 'Analisis kebutuhan mendalam untuk merumuskan strategi paling efektif.' },
            { title: 'Eksekusi & Implementasi', desc: 'Pengerjaan proyek secara profesional oleh tenaga ahli berpengalaman.' },
            { title: 'Dukungan & Pemeliharaan', desc: 'Layanan pendampingan dan penanganan responsif pasca proyek.' }
          ]
        }
      },
      {
        id: 'sec-pricing-jasa',
        type: 'pricing',
        variant: 'grid-navy',
        content: {
          title: 'Pilihan Paket Jasa Terbaik',
          plans: [
            { name: 'Paket Standard', sale_price: 'Rp 990.000', original_price: 'Rp 1.500.000', features: ['Konsultasi Kebutuhan', 'Laporan Analisis Dasar', 'Revisi 1x'] },
            { name: 'Paket Professional', sale_price: 'Rp 1.990.000', original_price: 'Rp 3.000.000', badge: 'Terfavorit', highlighted: true, features: ['Konsultasi Intensif', 'Laporan Lengkap', 'Prioritas Support 24/7', 'Revisi 3x'] }
          ]
        }
      },
      {
        id: 'sec-faq-jasa',
        type: 'faq',
        variant: 'accordion-navy',
        content: {
          title: 'Pertanyaan Yang Sering Diajukan',
          faqs: [
            { question: 'Berapa lama estimasi pengerjaan proyek?', answer: 'Waktu pengerjaan berkisar antara 3 hingga 14 hari kerja tergantung kompleksitas paket yang dipilih.' },
            { question: 'Apakah ada garansi hasil kerja?', answer: 'Ya, kami memberikan garansi revisi untuk memastikan kepuasan Anda sesuai kesepakatan awal.' }
          ]
        }
      },
      {
        id: 'sec-contact-jasa',
        type: 'contact',
        variant: 'footer-navy',
        content: {
          title: 'Konsultasikan Kebutuhan Anda Sekarang',
          subheadline: 'Tim kami siap memberikan rekomendasi dan penawaran harga terbaik.',
          whatsapp: '6281234567890'
        }
      }
    ]
  },
  {
    id: 'campaign',
    name: 'Campaign / Landing Page Sales',
    icon: '⚡',
    badge: 'Konversi Tinggi',
    description: 'Struktur khusus untuk promosi produk tunggal, launching penawaran, dan pendaftaran promo.',
    defaultBrandName: 'Special Offer Campaign',
    defaultBrief: 'Penawaran promo terbatas dengan konversi tinggi dan tombol aksi langsung.',
    sections: [
      {
        id: 'sec-hero-campaign',
        type: 'hero',
        variant: 'split-navy',
        content: {
          headline: 'Dapatkan Penawaran Spesial Hari Ini Sebelum Kehabisan!',
          subheadline: 'Solusi praktis dan terbukti ampuh untuk meningkatkan hasil bisnis Anda tanpa ribet.',
          cta_text: 'Ambil Promo Sekarang'
        }
      },
      {
        id: 'sec-custom-campaign',
        type: 'custom',
        variant: 'cards-navy',
        content: {
          badge_text: 'SOLUSI',
          title: '3 Alasan Mengapa Anda Wajib Mengambil Kesempatan Ini',
          subtitle: 'Kelebihan utama yang akan Anda rasakan secara langsung',
          cards: [
            { badge: '1', title: 'Hemat Waktu & Biaya', description: 'Proses serba praktis yang dirancang khusus untuk memangkas biaya operasional Anda.' },
            { badge: '2', title: 'Hasil Terbukti Nyata', description: 'Telah digunakan oleh ratusan pengguna dengan hasil kepuasan maksimal.' },
            { badge: '3', title: 'Garansi 100% Aman', description: 'Jaminan kepuasan dan dukungan penuh jika ada kendala.' }
          ]
        }
      },
      {
        id: 'sec-pricing-campaign',
        type: 'pricing',
        variant: 'grid-navy',
        content: {
          title: 'Penawaran Spesial Promo Hari Ini',
          plans: [
            { name: 'Paket Hemat Promo', sale_price: 'Rp 149.000', original_price: 'Rp 499.000', badge: 'Diskon 70%', highlighted: true, features: ['Akses Penuh Fitur Premium', 'Bonus Spesial Hari Ini', 'Garansi Kepuasan 100%'] }
          ]
        }
      },
      {
        id: 'sec-faq-campaign',
        type: 'faq',
        variant: 'accordion-navy',
        content: {
          title: 'Pertanyaan Sebelum Membeli',
          faqs: [
            { question: 'Apakah promo ini berlaku selamanya?', answer: 'Tidak, promo ini hanya berlaku untuk kuota pendaftar hari ini.' },
            { question: 'Bagaimana cara konfirmasi pembayaran?', answer: 'Setelah checkout, Anda akan langsung terhubung ke WhatsApp Admin untuk proses instan.' }
          ]
        }
      },
      {
        id: 'sec-contact-campaign',
        type: 'contact',
        variant: 'footer-navy',
        content: {
          title: 'Ambil Penawaran Promo Sekarang',
          subheadline: 'Klik tombol di bawah untuk langsung terhubung dengan admin kami.',
          whatsapp: '6281234567890'
        }
      }
    ]
  },
  {
    id: 'toko-online',
    name: 'Toko Online & Etalase Produk',
    icon: '🛍️',
    badge: 'E-Commerce',
    description: 'Tampilkan etalase dagangan, katalog produk, harga diskon, dan tombol order WhatsApp.',
    defaultBrandName: 'Toko Online Berkah',
    defaultBrief: 'Menjual beragam produk pilihan berkualitas dengan pemesanan langsung ke WhatsApp.',
    sections: [
      {
        id: 'sec-header-toko',
        type: 'header',
        variant: 'navbar-navy',
        content: {
          show_nav: true,
          cta_text: 'Chat Admin Olshop',
          cta_url: '#contact',
          logo_enabled: true
        }
      },
      {
        id: 'sec-hero-toko',
        type: 'hero',
        variant: 'split-navy',
        content: {
          headline: 'Katalog Produk Dagangan Pilihan Terbaik & Original',
          subheadline: 'Belanja mudah dan aman secara online dengan pengiriman cepat ke seluruh Indonesia.',
          cta_text: 'Lihat Etalase Produk'
        }
      },
      {
        id: 'sec-services-toko',
        type: 'services',
        variant: 'grid-navy',
        content: {
          title: 'Etalase Produk Unggulan',
          items: [
            { title: 'Produk Best Seller #1', desc: 'Produk terfavorit pelanggan dengan bahan kualitas tinggi & garansi puas.' },
            { title: 'Produk New Arrival #2', desc: 'Koleksi edisi terbatas terbaru dengan diskon spesial minggu ini.' },
            { title: 'Produk Paket Promo #3', desc: 'Paket bundling hemat dengan harga paling terjangkau.' }
          ]
        }
      },
      {
        id: 'sec-custom-toko',
        type: 'custom',
        variant: 'cards-navy',
        content: {
          badge_text: 'JAMINAN OLSHOP',
          title: 'Mengapa Belanja Di Toko Kami?',
          subtitle: 'Kenyamanan dan kepuasan Anda adalah prioritas utama kami',
          cards: [
            { badge: '🚚', title: 'Pengiriman Cepat', description: 'Proses kirim amanah dan tepat waktu setiap hari.' },
            { badge: '🛡️', title: 'Produk 100% Original', description: 'Jaminan kualitas barang asli tanpa cacat.' },
            { badge: '💬', title: 'Admin Fast Response', description: 'Layanan customer service siap melayani order Anda.' }
          ]
        }
      },
      {
        id: 'sec-faq-toko',
        type: 'faq',
        variant: 'accordion-navy',
        content: {
          title: 'Informasi Cara Order & Pengiriman',
          faqs: [
            { question: 'Bagaimana cara melakukan pemesanan?', answer: 'Pilih produk yang diinginkan lalu klik tombol pesan untuk terhubung ke WhatsApp Admin.' },
            { question: 'Ekspedisi apa yang digunakan?', answer: 'Kami bekerjasama dengan JNE, J&T, SiCepat, dan layanan pengiriman instan.' }
          ]
        }
      },
      {
        id: 'sec-contact-toko',
        type: 'contact',
        variant: 'footer-navy',
        content: {
          title: 'Order Sekarang via WhatsApp Admin',
          subheadline: 'Hubungi admin kami untuk menanyakan stok & penawaran promo terbaru.',
          whatsapp: '6281234567890'
        }
      }
    ]
  },
  {
    id: 'wedding',
    name: 'Undangan Pernikahan (Wedding)',
    icon: '🌸',
    badge: 'Undangan',
    description: 'Format anggun untuk momen pernikahan lengkap dengan profil pengantin, jadwal acara, & amplop digital.',
    defaultBrandName: 'Romeo & Juliet Wedding',
    defaultBrief: 'Undangan pernikahan digital indah dengan rincian acara dan konfirmasi tamu.',
    sections: [
      {
        id: 'sec-hero-wedding',
        type: 'hero',
        variant: 'split-navy',
        content: {
          headline: 'Undangan Pernikahan Romeo & Juliet',
          subheadline: 'Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di momen bahagia kami.',
          cta_text: 'Buka Undangan'
        }
      },
      {
        id: 'sec-about-wedding',
        type: 'about',
        variant: 'simple-navy',
        content: {
          title: 'Mempelai Pria & Mempelai Wanita',
          description: 'Romeo Adiputra (Putra Bpk. Ahmad & Ibu Siti) ❤️ Juliet Saraswati (Putri Bpk. Budi & Ibu Rini). Semoga Allah memberkahi pernikahan kami.'
        }
      },
      {
        id: 'sec-custom-events-wedding',
        type: 'custom',
        variant: 'cards-navy',
        content: {
          badge_text: 'AGENDA ACARA',
          title: 'Rangkaian Acara Pernikahan',
          subtitle: 'Pelaksanaan Akad Nikah & Resepsi Pernikahan',
          cards: [
            { badge: '💍', title: 'Akad Nikah', description: 'Sabtu, 12 Desember 2026 | Pukul 08.00 WIB - Selesai. Gedung Pernikahan Indah.' },
            { badge: '🎉', title: 'Resepsi Pernikahan', description: 'Sabtu, 12 Desember 2026 | Pukul 11.00 WIB - 15.00 WIB. Gedung Pernikahan Indah.' }
          ]
        }
      },
      {
        id: 'sec-custom-story-wedding',
        type: 'custom',
        variant: 'cards-navy',
        content: {
          badge_text: 'LOVE STORY',
          title: 'Kisah Kasih Mempelai',
          subtitle: 'Linimasa perjalanan dari awal berteman hingga pelaminan',
          cards: [
            { badge: '2021', title: 'Awal Pertemuan', description: 'Pertama kali saling mengenal di kampus dan menemukan banyak kesamaan minat.' },
            { badge: '2024', title: 'Pertunangan', description: 'Di hadapan keluarga besar, kami berkomitmen untuk melangkah ke pelaminan.' }
          ]
        }
      },
      {
        id: 'sec-custom-gift-wedding',
        type: 'custom',
        variant: 'cards-navy',
        content: {
          badge_text: 'AMPLOP DIGITAL',
          title: 'Tanda Kasih & Hadiah Digital',
          subtitle: 'Bagi keluarga yang ingin memberikan tanda kasih secara cashless',
          cards: [
            { badge: '💳', title: 'Bank BCA', description: 'No. Rekening: 1234567890 a.n Romeo Adiputra' },
            { badge: '📱', title: 'e-Wallet / QRIS', description: 'Scan QRIS atau transfer GoPay/OVO ke 081234567890' }
          ]
        }
      },
      {
        id: 'sec-faq-wedding',
        type: 'faq',
        variant: 'accordion-navy',
        content: {
          title: 'Protokol & Informasi Lokasi Acara',
          faqs: [
            { question: 'Dimana lokasi pasti gedung acara?', answer: 'Alamat lengkap dan petunjuk Google Maps dapat diakses melalui link lokasi di atas.' },
            { question: 'Apakah tersedia area parkir luas?', answer: 'Ya, tempat acara menyediakan fasilitas parkir kendaraan yang aman dan luas.' }
          ]
        }
      },
      {
        id: 'sec-contact-wedding',
        type: 'contact',
        variant: 'footer-navy',
        content: {
          title: 'Konfirmasi Kehadiran (RSVP) & Doa Restu',
          subheadline: 'Kirimkan pesan ucapan doa & konfirmasi kehadiran Anda melalui WhatsApp Mempelai.',
          whatsapp: '6281234567890'
        }
      }
    ]
  },
  {
    id: 'e-course',
    name: 'E-Course & Kelas Online',
    icon: '🎓',
    badge: 'Edukasi',
    description: 'Tampilkan silabus modul belajar, profil mentor/instruktur, harga promo, dan pendaftaran.',
    defaultBrandName: 'Mastery Academy Online',
    defaultBrief: 'Kelas online praktis untuk menguasai skill digital bernilai tinggi.',
    sections: [
      {
        id: 'sec-header-course',
        type: 'header',
        variant: 'navbar-navy',
        content: {
          show_nav: true,
          cta_text: 'Daftar Kelas',
          cta_url: '#contact',
          logo_enabled: true
        }
      },
      {
        id: 'sec-hero-course',
        type: 'hero',
        variant: 'split-navy',
        content: {
          headline: 'Kuasai Skill Digital Masa Depan Dari Rumah',
          subheadline: 'Bimbingan intensif dari mentor praktisi terbukti berpengalaman dengan modul studi kasus nyata.',
          cta_text: 'Gabung Kelas Sekarang'
        }
      },
      {
        id: 'sec-about-course',
        type: 'about',
        variant: 'simple-navy',
        content: {
          title: 'Profil Mentor & Pengajar Kelas',
          description: 'Dimentori langsung oleh praktisi yang telah berpengalaman lebih dari 7 tahun di bidang industri digital.'
        }
      },
      {
        id: 'sec-custom-modules-course',
        type: 'custom',
        variant: 'cards-navy',
        content: {
          badge_text: 'SILABUS MODUL',
          title: 'Kurikulum Pembelajaran Kelas',
          subtitle: 'Materi terstruktur dari pemula hingga siap buka jasa sendiri',
          cards: [
            { badge: 'Modul 1', title: 'Fondasi Dasar & mindset Sukses', description: 'Memahami prinsip utama dan persiapan alat kerja gratis.' },
            { badge: 'Modul 2', title: 'Taktik Praktek Studi Kasus Nyata', description: 'Langkah demi langkah mengeksekusi strategi yang sudah terbukti.' },
            { badge: 'Modul 3', title: 'Monetisasi & Buka Penawaran', description: 'Cara mendapatkan klien pertama dan mematok harga tinggi.' }
          ]
        }
      },
      {
        id: 'sec-pricing-course',
        type: 'pricing',
        variant: 'grid-navy',
        content: {
          title: 'Investasi Belajar Terbaik Hari Ini',
          plans: [
            { name: 'Akses Kelas VIP', sale_price: 'Rp 299.000', original_price: 'Rp 990.000', badge: 'Diskon 70%', highlighted: true, features: ['Akses Semua Modul Selamanya', 'Grup Komunitas Diskusi', 'Sertifikat Kelulusan'] }
          ]
        }
      },
      {
        id: 'sec-faq-course',
        type: 'faq',
        variant: 'accordion-navy',
        content: {
          title: 'Pertanyaan Seputar Kelas Online',
          faqs: [
            { question: 'Apakah pemula total bisa ikut?', answer: 'Sangat bisa! Materi disusun dari nol dan didampingi grup diskusi.' },
            { question: 'Berapa lama masa akses materi?', answer: 'Akses materi berlaku selamanya termasuk semua update di masa depan.' }
          ]
        }
      },
      {
        id: 'sec-contact-course',
        type: 'contact',
        variant: 'footer-navy',
        content: {
          title: 'Gabung Kelas & Klaim Diskon Hari Ini',
          subheadline: 'Klik tombol di bawah untuk langsung mendaftar via WhatsApp Admin.',
          whatsapp: '6281234567890'
        }
      }
    ]
  },
  {
    id: 'birthday',
    name: 'Undangan Ulang Tahun (Birthday)',
    icon: '🎂',
    badge: 'Acara Pesta',
    description: 'Desain ceria untuk pesta ulang tahun anak maupun dewasa dengan info waktu & alamat lokasi.',
    defaultBrandName: 'Birthday Party Celebration',
    defaultBrief: 'Undangan pesta ulang tahun meriah untuk kerabat dan sahabat.',
    sections: [
      {
        id: 'sec-hero-birthday',
        type: 'hero',
        variant: 'split-navy',
        content: {
          headline: 'You Are Invited! Pesta Ulang Tahun Ke-17',
          subheadline: 'Mari rayakan momen bahagia ulang tahun bersama kami dalam Pesta Kebersamaan yang meriah.',
          cta_text: 'Buka Undangan Pesta'
        }
      },
      {
        id: 'sec-about-birthday',
        type: 'about',
        variant: 'simple-navy',
        content: {
          title: 'Tentang Yang Berulang Tahun',
          description: 'Rasa syukur atas bertambahnya usia dan nikmat kebahagiaan bersama keluarga dan sahabat tercinta.'
        }
      },
      {
        id: 'sec-custom-birthday',
        type: 'custom',
        variant: 'cards-navy',
        content: {
          badge_text: 'AGENDA PESTA',
          title: 'Waktu & Tempat Pesta',
          subtitle: 'Susunan acara dan tempat perayaan',
          cards: [
            { badge: '📅', title: 'Tanggal & Jam', description: 'Minggu, 15 November 2026 | Pukul 15.00 WIB - Selesai' },
            { badge: '📍', title: 'Lokasi Acara', description: 'Cafe & Garden Fun, Jl. Merdeka No. 45 Bandung' }
          ]
        }
      },
      {
        id: 'sec-contact-birthday',
        type: 'contact',
        variant: 'footer-navy',
        content: {
          title: 'Konfirmasi Kehadiran Pesta (RSVP)',
          subheadline: 'Beritahu kami kehadiran Anda via WhatsApp agar persiapan konsumsi dapat disesuaikan.',
          whatsapp: '6281234567890'
        }
      }
    ]
  },
  {
    id: 'cv',
    name: 'Web CV & Portofolio Profesional',
    icon: '📄',
    badge: 'Karir / Portfolio',
    description: 'Tampilkan ringkasan profil, pengalaman kerja, daftar keahlian, & portofolio dalam format web ATS-friendly.',
    defaultBrandName: 'Professional Web CV',
    defaultBrief: 'Curriculum vitae web interaktif untuk melamar kerja atau personal branding.',
    sections: [
      {
        id: 'sec-hero-cv',
        type: 'hero',
        variant: 'split-navy',
        content: {
          headline: 'Halo, Saya Seorang Professional Specialist',
          subheadline: 'Berpengalaman dalam mengelola proyek, strategi digital, dan pengembangan solusi bernilai tinggi.',
          cta_text: 'Lihat Pengalaman Kerja'
        }
      },
      {
        id: 'sec-about-cv',
        type: 'about',
        variant: 'simple-navy',
        content: {
          title: 'Ringkasan Profil & Karir',
          description: 'Memiliki rekam jejak terbukti dalam menyelesaikan proyek tepat waktu, adaptif, dan berorientasi pada pencapaian target.'
        }
      },
      {
        id: 'sec-services-cv',
        type: 'services',
        variant: 'grid-navy',
        content: {
          title: 'Pengalaman & Keahlian Utama',
          items: [
            { title: 'Pengalaman Kerja #1', desc: 'Senior Specialist di Perusahaan ABC (2022 - Sekarang).' },
            { title: 'Pengalaman Kerja #2', desc: 'Project Lead di Perusahaan XYZ (2020 - 2022).' }
          ]
        }
      },
      {
        id: 'sec-contact-cv',
        type: 'contact',
        variant: 'footer-navy',
        content: {
          title: 'Mari Terhubung & Berkolaborasi',
          subheadline: 'Hubungi saya melalui email atau kontak WhatsApp untuk peluang karir & proyek.',
          whatsapp: '6281234567890'
        }
      }
    ]
  },
  {
    id: 'custom',
    name: 'Kanvas Kosong (Custom Setup)',
    icon: '🎨',
    badge: 'Bebas',
    description: 'Mulai dari struktur dasar sederhana untuk Anda susun bebas sesuai imajinasi.',
    defaultBrandName: 'My Custom Project',
    defaultBrief: 'Proyek landing page custom dengan kebebasan penuh.',
    sections: [
      {
        id: 'sec-hero-custom',
        type: 'hero',
        variant: 'split-navy',
        content: {
          headline: 'Selamat Datang Di Landing Page Anda',
          subheadline: 'Gunakan panel penyunting di sebelah kiri untuk menambah, menghapus, atau menyesuaikan section.',
          cta_text: 'Pelajari Lebih Lanjut'
        }
      },
      {
        id: 'sec-about-custom',
        type: 'about',
        variant: 'simple-navy',
        content: {
          title: 'Tentang Proyek Ini',
          description: 'Isi deskripsi singkat mengenai tujuan landing page Anda di sini.'
        }
      },
      {
        id: 'sec-contact-custom',
        type: 'contact',
        variant: 'footer-navy',
        content: {
          title: 'Hubungi Kami',
          subheadline: 'Siap berkomunikasi secara langsung.',
          whatsapp: '6281234567890'
        }
      }
    ]
  }
];
