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
        id: 'sec-product-grid-toko',
        type: 'product_grid',
        variant: 'navy',
        content: {
          title: 'Katalog Produk Pilihan Terbaik',
          subtitle: 'Temukan koleksi produk berkualitas tinggi dengan pemesanan mudah secara langsung ke WhatsApp Admin.',
          whatsapp: '6281234567890',
          products: [
            { name: 'Koleksi Best Seller #1', category: 'Best Seller', sale_price: 'Rp 149.000', original_price: 'Rp 299.000', badge: 'Diskon 50%', description: 'Produk unggulan favorit pelanggan dengan bahan kualitas tinggi & garansi puas.' },
            { name: 'Koleksi New Arrival #2', category: 'New Arrival', sale_price: 'Rp 199.000', original_price: 'Rp 399.000', badge: 'Terlaris', description: 'Desain elegan dan eksklusif edisi terbatas minggu ini.' },
            { name: 'Paket Bundling Hemat #3', category: 'Promo Paket', sale_price: 'Rp 279.000', original_price: 'Rp 599.000', badge: 'Hemat BANYAK', description: 'Paket kombinasi hemat isi 2 item serba praktis.' }
          ]
        }
      },
      {
        id: 'sec-store-guarantee-toko',
        type: 'store_guarantee',
        variant: 'navy',
        content: {
          title: 'Mengapa Belanja Di Toko Kami?',
          features: [
            { icon: '🚚', title: 'Pengiriman Cepat & Aman', desc: 'Proses kirim amanah dan tepat waktu ke seluruh Indonesia.' },
            { icon: '🛡️', title: 'Produk 100% Original', desc: 'Jaminan kualitas barang asli tanpa cacat dan garansi ganti baru.' },
            { icon: '💬', title: 'Admin Fast Response', desc: 'Layanan customer service ramah yang siap membantu order Anda.' },
            { icon: '💳', title: 'Pembayaran Mudah', desc: 'Dukung transfer bank, e-wallet, hingga sistem COD di tempat.' }
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
        id: 'sec-wedding-couple',
        type: 'wedding_couple',
        variant: 'navy',
        content: {
          bismillah_quote: 'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Semoga Allah SWT memberkahi ikatan pernikahan kami.',
          groom_name: 'Romeo Adiputra, S.T.',
          groom_nickname: 'Romeo',
          groom_parents: 'Putra Pertama dari Bpk. Ahmad & Ibu Siti',
          groom_instagram: 'romeo_adiputra',
          bride_name: 'Juliet Saraswati, S.Ked.',
          bride_nickname: 'Juliet',
          bride_parents: 'Putri Kedua dari Bpk. Budi & Ibu Rini',
          bride_instagram: 'juliet_saraswati'
        }
      },
      {
        id: 'sec-wedding-countdown',
        type: 'wedding_countdown',
        variant: 'navy',
        content: {
          title: 'Menuju Hari Bahagia',
          subtitle: 'Hitung mundur momen istimewa pernikahan kami',
          target_date: '2026-12-12T08:00:00'
        }
      },
      {
        id: 'sec-wedding-events',
        type: 'wedding_events',
        variant: 'navy',
        content: {
          title: 'Rangkaian Acara Pernikahan',
          subtitle: 'Pelaksanaan Akad Nikah & Resepsi Pernikahan',
          akad_title: 'Akad Nikah',
          akad_date: 'Sabtu, 12 Desember 2026',
          akad_time: 'Pukul 08.00 WIB - Selesai',
          akad_location: 'Gedung Pernikahan Indah',
          akad_address: 'Jl. Merdeka No. 45, Bandung',
          akad_maps_url: 'https://maps.google.com',
          resepsi_title: 'Resepsi Pernikahan',
          resepsi_date: 'Sabtu, 12 Desember 2026',
          resepsi_time: 'Pukul 11.00 WIB - 15.00 WIB',
          resepsi_location: 'Gedung Pernikahan Indah',
          resepsi_address: 'Jl. Merdeka No. 45, Bandung',
          resepsi_maps_url: 'https://maps.google.com'
        }
      },
      {
        id: 'sec-wedding-story',
        type: 'wedding_story',
        variant: 'navy',
        content: {
          title: 'Kisah Kasih Kami',
          subtitle: 'Perjalanan cinta kami dari pertama bertemu hingga ikatan suci pernikahan',
          stories: [
            { date: 'Tahun 2021', title: 'Awal Pertemuan Pertama', desc: 'Kami pertama kali bertemu dalam suatu acara kampus dan berlanjut menjalin persahabatan hangat.' },
            { date: 'Tahun 2024', title: 'Momen Lamaran Kebahagiaan', desc: 'Dengan restu kedua orang tua, kami mengikat janji suci lamaran untuk melangkah ke jenjang yang lebih serius.' },
            { date: 'Tahun 2026', title: 'Menuju Hari Pernikahan', desc: 'Insya Allah kami akan mengikat janji suci pernikahan dan mengarungi bahtera rumah tangga yang sakinah.' }
          ]
        }
      },
      {
        id: 'sec-wedding-gallery',
        type: 'wedding_gallery',
        variant: 'navy',
        content: {
          title: 'Galeri Album Prewedding',
          subtitle: 'Momen kebersamaan dan kenangan indah mempelai',
          images: [
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80'
          ]
        }
      },
      {
        id: 'sec-digital-gift',
        type: 'digital_gift',
        variant: 'navy',
        content: {
          title: 'Amplop Digital & Tanda Kasih',
          subtitle: 'Doa restu Anda merupakan hadiah terindah bagi kami. Bagi keluarga yang ingin memberikan tanda kasih secara cashless:',
          bank_accounts: [
            { bank_name: 'Bank BCA', account_number: '1234567890', account_holder: 'Romeo Adiputra' },
            { bank_name: 'Bank Mandiri', account_number: '0987654321', account_holder: 'Juliet Saraswati' }
          ],
          rsvp_whatsapp: '6281234567890'
        }
      },
      {
        id: 'sec-wedding-wishes',
        type: 'wedding_wishes',
        variant: 'navy',
        content: {
          title: 'Buku Tamu & Doa Restu',
          subtitle: 'Kirimkan pesan doa restu dan konfirmasi kehadiran Anda untuk mempelai',
          wishes: [
            { name: 'Ahmad & Keluarga', status: 'Hadir', message: 'Selamat atas pernikahan Romeo & Juliet. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah!' },
            { name: 'Siti Rahma', status: 'Hadir', message: 'Happy wedding Romeo & Juliet! Selamat menempuh hidup baru dan bahagia selalu!' },
            { name: 'Budi Santoso', status: 'Ragu', message: 'Barakallahu lakum! Semoga acaranya berjalan lancar dan penuh keberkahan.' }
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
        id: 'sec-course-mentor',
        type: 'course_mentor',
        variant: 'navy',
        content: {
          name: 'Budi Pratama, S.Kom., M.T.',
          role: 'Senior Digital Strategist & Lead Mentor',
          bio: 'Berpengalaman lebih dari 8+ tahun memimpin proyek teknologi & strategi digital. Telah membimbing lebih dari 5.000+ peserta dari latar belakang pemula hingga mahir.',
          experience_years: '8+ Tahun',
          students_count: '5,000+ Alumni'
        }
      },
      {
        id: 'sec-course-curriculum',
        type: 'course_curriculum',
        variant: 'navy',
        content: {
          title: 'Silabus & Kurikulum Belajar Lengkap',
          subtitle: 'Daftar materi pembelajaran terstruktur yang dirancang khusus untuk menguasai skill hingga tuntas.',
          modules: [
            { module_number: 'Modul 1', title: 'Fondasi Dasar & Mindset Sukses', duration: '4 Video (45 Menit)', lessons: ['Pengenalan Konsep & Ekosistem Utama', 'Instalasi Tools & Setup Lingkungan Kerja', 'Struktur Dasar & Workflow Profesional', 'Studi Kasus Pertama'] },
            { module_number: 'Modul 2', title: 'Penerapan Praktik & Strategi Lanjutan', duration: '6 Video (90 Menit)', lessons: ['Teknik Pembuatan Asset Kreatif', 'Optimasi Performa & Efisiensi', 'Integrasi Sistem & Otomatisasi', 'Troubleshooting & Solusi Masalah'] },
            { module_number: 'Modul 3', title: 'Monetisasi & Peluncuran Proyek', duration: '5 Video (60 Menit)', lessons: ['Strategi Menentukan Pricing & Penawaran', 'Cara Publikasi & Monetisasi Hasil Karya', 'Checklist Peluncuran Proyek Mandiri', 'Studi Kasus Sukses Alumni'] }
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
