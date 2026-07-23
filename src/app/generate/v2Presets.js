/**
 * Wuzzkang V2 Dynamic Builder - Starter Kit Presets
 * 
 * Provides deterministic initial section stacks for various landing page goals.
 * Pure JavaScript - 0% LLM token consumption.
 */

export const V2_STARTER_CATEGORIES = [
  { id: 'all', name: 'Semua Preset', icon: '✨' },
  { id: 'wedding', name: 'Undangan Pernikahan', icon: '🌸' },
  { id: 'toko-online', name: 'Toko Online', icon: '🛍️' },
  { id: 'campaign', name: 'Campaign Sales', icon: '⚡' },
  { id: 'e-course', name: 'E-Course & Kelas', icon: '🎓' },
  { id: 'birthday', name: 'Undangan Ulang Tahun', icon: '🎂' },
  { id: 'cv', name: 'Web CV & Portofolio', icon: '📄' },
  { id: 'jasa', name: 'Jasa & Layanan', icon: '🛠️' },
  { id: 'custom', name: 'Custom Setup', icon: '🎨' },
];

export const V2_STARTER_PRESETS = [
  // 🌸 DOMAIN UNDANGAN PERNIKAHAN (WEDDING MULTI-PRESETS WITH UNIQUE DESIGNS)
  {
    id: 'wedding-classic-navy',
    category: 'wedding',
    name: 'Classic Midnight Gold',
    icon: '✨',
    badge: 'Elegan & Mewah',
    description: 'Desain midnight navy & gold mewah untuk pesta ballroom hotel & resepsi malam.',
    defaultBrandName: 'Romeo & Juliet Wedding',
    defaultBrief: 'Undangan pernikahan digital indah dengan rincian acara dan konfirmasi tamu.',
    sections: [
      {
        id: 'sec-hero-wedding',
        type: 'wedding_hero',
        variant: 'navy',
        bg_style: 'navy',
        content: {
          groom_nickname: 'Romeo',
          bride_nickname: 'Juliet',
          headline: 'Romeo & Juliet',
          subheadline: 'Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di momen bahagia pernikahan kami.',
          recipient_name: 'Bapak/Ibu/Saudara/i',
          cta_text: '💌 BUKA UNDANGAN',
          cta_url: '#wedding_couple',
          image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
          bg_style: 'navy'
        }
      },
      {
        id: 'sec-wedding-couple',
        type: 'wedding_couple',
        variant: 'navy',
        bg_style: 'navy',
        content: {
          bismillah_quote: 'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Semoga Allah SWT memberkahi ikatan pernikahan kami.',
          groom_name: 'Romeo Adiputra, S.T.',
          groom_nickname: 'Romeo',
          groom_parents: 'Putra Pertama dari Bpk. Ahmad & Ibu Siti',
          groom_instagram: 'romeo_adiputra',
          groom_photo: 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/groom-avatar.jpg',
          bride_name: 'Juliet Saraswati, S.Ked.',
          bride_nickname: 'Juliet',
          bride_parents: 'Putri Kedua dari Bpk. Budi & Ibu Rini',
          bride_instagram: 'juliet_saraswati',
          bride_photo: 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/bride-avatar.jpg',
          bg_style: 'navy'
        }
      },
      {
        id: 'sec-wedding-countdown',
        type: 'wedding_countdown',
        variant: 'navy',
        bg_style: 'navy',
        content: {
          title: 'Menuju Hari Bahagia',
          subtitle: 'Hitung mundur momen istimewa pernikahan kami',
          target_date: '2026-12-12T08:00:00',
          bg_style: 'navy'
        }
      },
      {
        id: 'sec-wedding-events',
        type: 'wedding_events',
        variant: 'navy',
        bg_style: 'navy',
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
          resepsi_maps_url: 'https://maps.google.com',
          bg_style: 'navy'
        }
      },
      {
        id: 'sec-wedding-story',
        type: 'wedding_story',
        variant: 'navy',
        bg_style: 'navy',
        content: {
          title: 'Kisah Kasih Kami',
          subtitle: 'Perjalanan cinta kami dari pertama bertemu hingga ikatan suci pernikahan',
          stories: [
            { date: 'Tahun 2021', title: 'Awal Pertemuan Pertama', desc: 'Kami pertama kali bertemu dalam suatu acara kampus dan berlanjut menjalin persahabatan hangat.' },
            { date: 'Tahun 2024', title: 'Momen Lamaran Kebahagiaan', desc: 'Dengan restu kedua orang tua, kami mengikat janji suci lamaran untuk melangkah ke jenjang yang lebih serius.' },
            { date: 'Tahun 2026', title: 'Menuju Hari Pernikahan', desc: 'Insya Allah kami akan mengikat janji suci pernikahan dan mengarungi bahtera rumah tangga yang sakinah.' }
          ],
          bg_style: 'navy'
        }
      },
      {
        id: 'sec-wedding-gallery',
        type: 'wedding_gallery',
        variant: 'navy',
        bg_style: 'navy',
        content: {
          title: 'Galeri Album Prewedding',
          subtitle: 'Momen kebersamaan dan kenangan indah mempelai',
          images: [
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80'
          ],
          bg_style: 'navy'
        }
      },
      {
        id: 'sec-digital-gift',
        type: 'digital_gift',
        variant: 'navy',
        bg_style: 'navy',
        content: {
          title: 'Amplop Digital & Tanda Kasih',
          subtitle: 'Doa restu Anda merupakan hadiah terindah bagi kami. Bagi keluarga yang ingin memberikan tanda kasih secara cashless:',
          bank_accounts: [
            { bank_name: 'Bank BCA', account_number: '1234567890', account_holder: 'Romeo Adiputra' },
            { bank_name: 'Bank Mandiri', account_number: '0987654321', account_holder: 'Juliet Saraswati' }
          ],
          rsvp_whatsapp: '6281234567890',
          bg_style: 'navy'
        }
      },
      {
        id: 'sec-wedding-wishes',
        type: 'wedding_wishes',
        variant: 'navy',
        bg_style: 'navy',
        content: {
          title: 'Buku Tamu & Doa Restu',
          subtitle: 'Kirimkan pesan doa restu dan konfirmasi kehadiran Anda untuk mempelai',
          wishes: [
            { name: 'Ahmad & Keluarga', status: 'Hadir', message: 'Selamat atas pernikahan Romeo & Juliet. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah!' },
            { name: 'Siti Rahma', status: 'Hadir', message: 'Happy wedding Romeo & Juliet! Selamat menempuh hidup baru dan bahagia selalu!' },
            { name: 'Budi Santoso', status: 'Ragu', message: 'Barakallahu lakum! Semoga acaranya berjalan lancar dan penuh keberkahan.' }
          ],
          bg_style: 'navy'
        }
      },
      {
        id: 'sec-contact-wedding',
        type: 'contact',
        variant: 'footer-navy',
        bg_style: 'navy',
        content: {
          title: 'Konfirmasi Kehadiran (RSVP) & Doa Restu',
          subheadline: 'Kirimkan pesan ucapan doa & konfirmasi kehadiran Anda melalui WhatsApp Mempelai.',
          whatsapp: '6281234567890',
          bg_style: 'navy'
        }
      }
    ]
  },
  {
    id: 'wedding-sage-green',
    category: 'wedding',
    name: 'Botanical Sage Green',
    icon: '🍃',
    badge: 'Natural & Soft',
    description: 'Desain sage green natural & cream floral untuk pesta garden party, outdoor, & rustic.',
    defaultBrandName: 'Adrian & Clarissa Wedding',
    defaultBrief: 'Undangan pernikahan outdoor nuansa botanical sage green.',
    sections: [
      {
        id: 'sec-hero-wedding',
        type: 'wedding_hero',
        variant: 'sage',
        bg_style: 'emerald',
        content: {
          groom_nickname: 'Adrian',
          bride_nickname: 'Clarissa',
          headline: 'Adrian & Clarissa',
          subheadline: 'Dengan mengucap syukur kepada Tuhan YME, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia pernikahan outdoor kami.',
          recipient_name: 'Bapak/Ibu/Saudara/i',
          cta_text: '🌿 BUKA UNDANGAN',
          cta_url: '#wedding_couple',
          image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
          bg_style: 'emerald'
        }
      },
      {
        id: 'sec-wedding-couple',
        type: 'wedding_couple',
        variant: 'sage',
        bg_style: 'emerald',
        content: {
          bismillah_quote: 'Cinta tidak pernah memandang perbedaan. Bersama dalam kasih yang suci, kami melangkah menuju lembaran baru kebahagiaan.',
          groom_name: 'Adrian Pratama, S.T.',
          groom_nickname: 'Adrian',
          groom_parents: 'Putra Pertama dari Bpk. Hendra & Ibu Liliana',
          groom_instagram: 'adrian_pratama',
          groom_photo: 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/groom-avatar.jpg',
          bride_name: 'Clarissa Maharani, S.Ds.',
          bride_nickname: 'Clarissa',
          bride_parents: 'Putri Kedua dari Bpk. Supriyadi & Ibu Maya',
          bride_instagram: 'clarissa_maharani',
          bride_photo: 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/bride-avatar.jpg',
          bg_style: 'emerald'
        }
      },
      {
        id: 'sec-wedding-countdown',
        type: 'wedding_countdown',
        variant: 'sage',
        bg_style: 'emerald',
        content: {
          title: 'Menuju Momen Pesta Garden',
          subtitle: 'Hitung mundur perayaan pernikahan outdoor kami di tengah suasana asri',
          target_date: '2026-11-20T10:00:00',
          bg_style: 'emerald'
        }
      },
      {
        id: 'sec-wedding-events',
        type: 'wedding_events',
        variant: 'sage',
        bg_style: 'emerald',
        content: {
          title: 'Jadwal Acara Garden Party',
          subtitle: 'Pelaksanaan Pemberkatan & Resepsi Outdoor',
          akad_title: 'Pemberkatan Nikah',
          akad_date: 'Minggu, 20 November 2026',
          akad_time: 'Pukul 09.00 WIB - Selesai',
          akad_location: 'Pine Forest Garden Hall',
          akad_address: 'Jl. Dago Giri No. 88, Bandung',
          akad_maps_url: 'https://maps.google.com',
          resepsi_title: 'Garden Party Reception',
          resepsi_date: 'Minggu, 20 November 2026',
          resepsi_time: 'Pukul 11.30 WIB - 16.00 WIB',
          resepsi_location: 'Pine Forest Garden Hall',
          resepsi_address: 'Jl. Dago Giri No. 88, Bandung',
          resepsi_maps_url: 'https://maps.google.com',
          bg_style: 'emerald'
        }
      },
      {
        id: 'sec-wedding-story',
        type: 'wedding_story',
        variant: 'sage',
        bg_style: 'emerald',
        content: {
          title: 'Perjalanan Cerita Kasih',
          subtitle: 'Manisnya momen perkenalan hingga sepakat mengikat ikatan suci',
          stories: [
            { date: 'Tahun 2022', title: 'Perkenalan Di Komunitas Botanical', desc: 'Kesamaan hobi membawa kami pada obrolan hangat yang tak terlupakan.' },
            { date: 'Tahun 2025', title: 'Lamaran Romantis Outdoor', desc: 'Di bawah pepohonan pinus rindang, janji komitmen suci diucapkan.' },
            { date: 'Tahun 2026', title: 'Pesta Pernikahan Botanical', desc: 'Merayakan hari bahagia bersama keluarga dan sahabat terdekat.' }
          ],
          bg_style: 'emerald'
        }
      },
      {
        id: 'sec-wedding-gallery',
        type: 'wedding_gallery',
        variant: 'sage',
        bg_style: 'emerald',
        content: {
          title: 'Galeri Foto Warm & Rustic',
          subtitle: 'Album foto prewedding bertema alam dan kehangatan senja',
          images: [
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
          ],
          bg_style: 'emerald'
        }
      },
      {
        id: 'sec-digital-gift',
        type: 'digital_gift',
        variant: 'sage',
        bg_style: 'emerald',
        content: {
          title: 'Amplop Digital Cashless',
          subtitle: 'Bagi keluarga dan sahabat yang ingin memberikan tanda kasih secara digital:',
          bank_accounts: [
            { bank_name: 'Bank BCA', account_number: '8830192841', account_holder: 'Adrian Pratama' },
            { bank_name: 'Bank Mandiri', account_number: '1310009812', account_holder: 'Clarissa Maharani' }
          ],
          rsvp_whatsapp: '6281234567890',
          bg_style: 'emerald'
        }
      },
      {
        id: 'sec-wedding-wishes',
        type: 'wedding_wishes',
        variant: 'sage',
        bg_style: 'emerald',
        content: {
          title: 'Ucapan Doa & Buku Tamu',
          subtitle: 'Tuliskan ucapan selamat dan kesan pesan untuk kedua mempelai',
          wishes: [
            { name: 'Keluarga Besar Pratama', status: 'Hadir', message: 'Selamat untuk Adrian & Clarissa! Acara outdoornya pasti hangat dan luar biasa.' },
            { name: 'Dian & Teman Komunitas', status: 'Hadir', message: 'Happy wedding guys! Bahagia selamanya dan cepat dapat momongan!' }
          ],
          bg_style: 'emerald'
        }
      },
      {
        id: 'sec-contact-wedding',
        type: 'contact',
        variant: 'footer-navy',
        bg_style: 'emerald',
        content: {
          title: 'Konfirmasi Kehadiran RSVP',
          subheadline: 'Silakan konfirmasi kehadiran Anda untuk membantu penyesuaian tempat & katering outdoor.',
          whatsapp: '6281234567890',
          bg_style: 'emerald'
        }
      }
    ]
  },
  {
    id: 'wedding-javanese',
    category: 'wedding',
    name: 'Adat Jawa Tradisional',
    icon: '🏮',
    badge: 'Budaya & Adat',
    description: 'Nuansa maroon & gold khas ukiran batik Jawa dengan kutipan doa adat & ucapan selamat.',
    defaultBrandName: 'Raden & Dewi Wedding',
    defaultBrief: 'Undangan pernikahan adat Jawa tradisional dengan nuansa maroon & emas.',
    sections: [
      {
        id: 'sec-hero-wedding',
        type: 'wedding_hero',
        variant: 'javanese',
        bg_style: 'amber',
        content: {
          groom_nickname: 'Raden',
          bride_nickname: 'Dewi',
          headline: 'Raden & Dewi',
          subheadline: 'Nyuwun doa pangestu Bpk/Ibu/Saudara/i ing Pahargyan Ageng Pernikahan Adat Jawa kawula.',
          recipient_name: 'Bapak/Ibu/Saudara/i',
          cta_text: '🪷 BUKA UNDANGAN ADAT',
          cta_url: '#wedding_couple',
          image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
          bg_style: 'amber'
        }
      },
      {
        id: 'sec-wedding-couple',
        type: 'wedding_couple',
        variant: 'javanese',
        bg_style: 'amber',
        content: {
          bismillah_quote: 'Maha Suci Allah SWT ingkang sampun nyiptakaken makhluk-Nya kanthi berpasang-pasangan. Semoga Allah memberkahi ikatan suci pernikahan kawula.',
          groom_name: 'Raden Mas Haryo, S.T.',
          groom_nickname: 'Raden',
          groom_parents: 'Putra Kapisan saking Bpk. KRT Sosrodiningrat & Ibu Raden Ajeng Wulandari',
          groom_instagram: 'raden_haryo',
          groom_photo: 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/groom-avatar.jpg',
          bride_name: 'Dewi Sekartaji, S.E.',
          bride_nickname: 'Dewi',
          bride_parents: 'Putri Kapindho saking Bpk. Dr. Sutrisno & Ibu Endang Rahayu',
          bride_instagram: 'dewi_sekartaji',
          bride_photo: 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/bride-avatar.jpg',
          bg_style: 'amber'
        }
      },
      {
        id: 'sec-wedding-countdown',
        type: 'wedding_countdown',
        variant: 'javanese',
        bg_style: 'amber',
        content: {
          title: 'Ngenteni Dina Pawiwahan',
          subtitle: 'Hitung mundur pelaksanaan Upacara Panggih & Resepsi Adat Jawa',
          target_date: '2026-10-18T08:00:00',
          bg_style: 'amber'
        }
      },
      {
        id: 'sec-wedding-events',
        type: 'wedding_events',
        variant: 'javanese',
        bg_style: 'amber',
        content: {
          title: 'Rantaman Acara Pawiwahan',
          subtitle: 'Pelaksanaan Ijab Kabul & Resepsi Pahargyan Ageng',
          akad_title: 'Upacara Ijab Kabul',
          akad_date: 'Minggu Kliwon, 18 Oktober 2026',
          akad_time: 'Tabuh 08.00 WIB - Selesai',
          akad_location: 'Pendopo Sasana Krido',
          akad_address: 'Jl. Royal Jogja No. 12, Yogyakarta',
          akad_maps_url: 'https://maps.google.com',
          resepsi_title: 'Resepsi Pahargyan Ageng',
          resepsi_date: 'Minggu Kliwon, 18 Oktober 2026',
          resepsi_time: 'Tabuh 11.00 WIB - 14.00 WIB',
          resepsi_location: 'Pendopo Sasana Krido',
          resepsi_address: 'Jl. Royal Jogja No. 12, Yogyakarta',
          resepsi_maps_url: 'https://maps.google.com',
          bg_style: 'amber'
        }
      },
      {
        id: 'sec-wedding-story',
        type: 'wedding_story',
        variant: 'javanese',
        bg_style: 'amber',
        content: {
          title: 'Linimasa Katresnan',
          subtitle: 'Lelampahan katresnan kawula saking awal tepangan nganti dadi garwa',
          stories: [
            { date: 'Tahun 2020', title: 'Tepangan Kapisan', desc: 'Kawula kapisan tepangan ing pentas seni budaya Keraton Yogyakarta.' },
            { date: 'Tahun 2024', title: 'Lamaran Adat Jawa', desc: 'Kanthi pangestu tiyang sepuh, kawula ngaturaken niyat suci lamaran.' },
            { date: 'Tahun 2026', title: 'Pawiwahan Ageng', desc: 'Dina bahagia ngikat janji suci minangka pasangan ingkang sakinah.' }
          ],
          bg_style: 'amber'
        }
      },
      {
        id: 'sec-wedding-gallery',
        type: 'wedding_gallery',
        variant: 'javanese',
        bg_style: 'amber',
        content: {
          title: 'Album Prewedding Busana Adat',
          subtitle: 'Foto kenangan indah nggunakake busana ageng & kebayakan adat Jawa',
          images: [
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80'
          ],
          bg_style: 'amber'
        }
      },
      {
        id: 'sec-digital-gift',
        type: 'digital_gift',
        variant: 'javanese',
        bg_style: 'amber',
        content: {
          title: 'Tanda Kasih & Amplop Digital',
          subtitle: 'Matur nuwun donga pangestu Bpk/Ibu/Saudara/i. Kangge kersa paring tanda kasih cashless:',
          bank_accounts: [
            { bank_name: 'Bank BCA', account_number: '7129081234', account_holder: 'Raden Mas Haryo' },
            { bank_name: 'Bank BNI', account_number: '0412891238', account_holder: 'Dewi Sekartaji' }
          ],
          rsvp_whatsapp: '6281234567890',
          bg_style: 'amber'
        }
      },
      {
        id: 'sec-wedding-wishes',
        type: 'wedding_wishes',
        variant: 'javanese',
        bg_style: 'amber',
        content: {
          title: 'Buku Tamu & Donga Pangestu',
          subtitle: 'Kirimaken donga pangestu wilujeng kangge kapindho mempelai',
          wishes: [
            { name: 'Bpk. KRT Sumodiningrat', status: 'Hadir', message: 'Nderek bingah atas pawiwahan Raden & Dewi. Mugi dados keluarga ingkang sakinah lan langgeng.' },
            { name: 'Keluarga Bpk. Haryono', status: 'Hadir', message: 'Matur nuwun serat ulemipun. Mugi acara lumampah kanthi lancar tanpa alangan.' }
          ],
          bg_style: 'amber'
        }
      },
      {
        id: 'sec-contact-wedding',
        type: 'contact',
        variant: 'footer-navy',
        bg_style: 'amber',
        content: {
          title: 'Konfirmasi Kehadiran Pawiwahan',
          subheadline: 'Kirimaken pesen ucapan donga & konfirmasi rawuh lumantar WhatsApp Mempelai.',
          whatsapp: '6281234567890',
          bg_style: 'amber'
        }
      }
    ]
  },
  {
    id: 'wedding-pink-rose',
    category: 'wedding',
    name: 'Romantic Floral Pink',
    icon: '🌸',
    badge: 'Romantis & Floral',
    description: 'Desain soft pink & rose floral romantis yang manis untuk momen kebahagiaan mempelai.',
    defaultBrandName: 'Fajar & Nadia Wedding',
    defaultBrief: 'Undangan pernikahan romantis nuansa soft pink dan floral.',
    sections: [
      {
        id: 'sec-hero-wedding',
        type: 'wedding_hero',
        variant: 'rose',
        bg_style: 'rose',
        content: {
          groom_nickname: 'Fajar',
          bride_nickname: 'Nadia',
          headline: 'Fajar & Nadia',
          subheadline: 'Dengan penuh rasa syukur dan kebahagiaan, kami mengundang Bapak/Ibu/Saudara/i untuk merayakan hari pernikahan kami.',
          recipient_name: 'Bapak/Ibu/Saudara/i',
          cta_text: '💖 BUKA UNDANGAN ROMANTIS',
          cta_url: '#wedding_couple',
          image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
          bg_style: 'rose'
        }
      },
      {
        id: 'sec-wedding-couple',
        type: 'wedding_couple',
        variant: 'rose',
        bg_style: 'rose',
        content: {
          bismillah_quote: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari meksudmu sendiri, supaya kamu merasa tenteram kepadanya.',
          groom_name: 'Fajar Pratama, S.Kom.',
          groom_nickname: 'Fajar',
          groom_parents: 'Putra Kedua dari Bpk. Irwan & Ibu Ratna',
          groom_instagram: 'fajar_pratama',
          groom_photo: 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/groom-avatar.jpg',
          bride_name: 'Nadia Anindya, M.Psi.',
          bride_nickname: 'Nadia',
          bride_parents: 'Putri Pertama dari Bpk. Wahyu & Ibu Anita',
          bride_instagram: 'nadia_anindya',
          bride_photo: 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/bride-avatar.jpg',
          bg_style: 'rose'
        }
      },
      {
        id: 'sec-wedding-countdown',
        type: 'wedding_countdown',
        variant: 'rose',
        bg_style: 'rose',
        content: {
          title: 'Menuju Momen Indah Pernikahan',
          subtitle: 'Hitung mundur hari kebahagiaan cinta kami',
          target_date: '2026-12-25T08:00:00',
          bg_style: 'rose'
        }
      },
      {
        id: 'sec-wedding-events',
        type: 'wedding_events',
        variant: 'rose',
        bg_style: 'rose',
        content: {
          title: 'Rangkaian Hari Pernikahan',
          subtitle: 'Pelaksanaan Akad Nikah & Resepsi Pernikahan',
          akad_title: 'Akad Nikah Suci',
          akad_date: 'Jumat, 25 Desember 2026',
          akad_time: 'Pukul 08.00 WIB - Selesai',
          akad_location: 'Masjid Agung Trans Studio',
          akad_address: 'Jl. Gatot Subroto No. 289, Bandung',
          akad_maps_url: 'https://maps.google.com',
          resepsi_title: 'Resepsi Pernikahan Romantis',
          resepsi_date: 'Jumat, 25 Desember 2026',
          resepsi_time: 'Pukul 11.00 WIB - 15.00 WIB',
          resepsi_location: 'Grand Rose Ballroom',
          resepsi_address: 'Jl. Gatot Subroto No. 289, Bandung',
          resepsi_maps_url: 'https://maps.google.com',
          bg_style: 'rose'
        }
      },
      {
        id: 'sec-wedding-story',
        type: 'wedding_story',
        variant: 'rose',
        bg_style: 'rose',
        content: {
          title: 'Kisah Percintaan Kami',
          subtitle: 'Momen-momen indah yang membentuk perjalanan takdir cinta kami',
          stories: [
            { date: 'Tahun 2022', title: 'Awal Manis Perkenalan', desc: 'Berawal dari pertemuan rekan kerja di suatu proyek kreatif.' },
            { date: 'Tahun 2025', title: 'Kejutan Kejadian Lamaran', desc: 'Momen manis lamaran di pantai berpasir putih saat sunset.' },
            { date: 'Tahun 2026', title: 'Ikatan Suci Pernikahan', desc: 'Memulai petualangan masa depan bersama dalam mahligai rumah tangga.' }
          ],
          bg_style: 'rose'
        }
      },
      {
        id: 'sec-wedding-gallery',
        type: 'wedding_gallery',
        variant: 'rose',
        bg_style: 'rose',
        content: {
          title: 'Galeri Moments of Love',
          subtitle: 'Abadikan keceriaan dan canda tawa kami bersama',
          images: [
            'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
          ],
          bg_style: 'rose'
        }
      },
      {
        id: 'sec-digital-gift',
        type: 'digital_gift',
        variant: 'rose',
        bg_style: 'rose',
        content: {
          title: 'Amplop Digital & Kado Kasih',
          subtitle: 'Kehadiran dan doa restu Anda adalah karunia terbesar bagi kami. Untuk tanda kasih cashless:',
          bank_accounts: [
            { bank_name: 'Bank BCA', account_number: '5220918231', account_holder: 'Fajar Pratama' },
            { bank_name: 'Bank Mandiri', account_number: '1370008123', account_holder: 'Nadia Anindya' }
          ],
          rsvp_whatsapp: '6281234567890',
          bg_style: 'rose'
        }
      },
      {
        id: 'sec-wedding-wishes',
        type: 'wedding_wishes',
        variant: 'rose',
        bg_style: 'rose',
        content: {
          title: 'Doa Restu & Harapan Sahabat',
          subtitle: 'Ungkapkan pesan hangat dan doa restu untuk Fajar & Nadia',
          wishes: [
            { name: 'Rina & Maya', status: 'Hadir', message: 'Happy wedding Nadia & Fajar! Semoga cinta kalian selalu mekar seperti bunga manis ini!' },
            { name: 'Keluarga Bpk. Irwan', status: 'Hadir', message: 'Selamat menempuh hidup baru anakku. Semoga selalu sakinah mawaddah warahmah.' }
          ],
          bg_style: 'rose'
        }
      },
      {
        id: 'sec-contact-wedding',
        type: 'contact',
        variant: 'footer-navy',
        bg_style: 'rose',
        content: {
          title: 'Konfirmasi Kehadiran RSVP',
          subheadline: 'Kirimkan pesan ucapan doa & konfirmasi kehadiran Anda melalui WhatsApp Mempelai.',
          whatsapp: '6281234567890',
          bg_style: 'rose'
        }
      }
    ]
  },

  // 🛠️ DOMAIN JASA & LAYANAN
  {
    id: 'jasa',
    category: 'jasa',
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

  // ⚡ DOMAIN CAMPAIGN SALES
  {
    id: 'campaign',
    category: 'campaign',
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

  // 🛍️ DOMAIN TOKO ONLINE
  {
    id: 'toko-online',
    category: 'toko-online',
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

  // 🎓 DOMAIN E-COURSE
  {
    id: 'e-course',
    category: 'e-course',
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

  // 🎂 DOMAIN BIRTHDAY
  {
    id: 'birthday',
    category: 'birthday',
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

  // 📄 DOMAIN CV
  {
    id: 'cv',
    category: 'cv',
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

  // 🎨 DOMAIN CUSTOM
  {
    id: 'custom',
    category: 'custom',
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
