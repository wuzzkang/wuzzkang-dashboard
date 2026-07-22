'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Loading from '@/components/Loading';
import ImagePickerField from '@/components/ImagePickerField';
import { Sparkles, ArrowRight, CheckCircle, ExternalLink, Globe, Layout, Smartphone, Laptop, AlertCircle, ChevronRight, X, Search, ShoppingBag, Heart } from 'lucide-react';
const DEFAULT_GROOM_AVATAR = 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/groom-avatar.jpg';
const DEFAULT_BRIDE_AVATAR = 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/bride-avatar.jpg';
const DEFAULT_CAMPAIGN_HERO_IMAGE = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80';
import { supabase } from '@/lib/supabase';
import { V2_STARTER_PRESETS } from './v2Presets';
import V2VisualSectionPickerModal from '@/components/V2VisualSectionPickerModal';
import V2SectionFormDispatcher from '@/components/v2-editor/V2SectionFormDispatcher';

// Helper dinamis untuk ikon template
const getProductIcon = (id) => {
  switch (id) {
    case 'wedding': return '🌸';
    case 'birthday': return '🎂';
    case 'toko-online': return '🛍️';
    case 'campaign': return '⚡';
    case 'cv': return '📄';
    case 'e-course': return '🎓';
    case 'jasa': return '🛠️';
    default: return '📄';
  }
};

// Helper dinamis untuk deskripsi default template
const getProductDefaultDescription = (id) => {
  switch (id) {
    case 'wedding': return 'Undangan pernikahan digital premium dengan kelola RSVP, iringan musik, dan linimasa kisah kasih.';
    case 'birthday': return 'Desain ceria dan elegan untuk pesta ulang tahun anak maupun dewasa.';
    case 'toko-online': return 'Landing page e-commerce instan untuk katalog dagangan.';
    case 'campaign': return 'Landing page satu halaman dengan struktur konversi tinggi untuk promosi produk atau penawaran digital.';
    case 'cv': return 'Web CV profesional yang ATS-friendly, siap dibagikan sebagai link atau di-export ke PDF.';
    case 'e-course': return 'Landing page e-course profesional dengan kurikulum modul, ulasan alumni, bonus penawaran, dan countdown urgensi.';
    case 'jasa': return 'Landing page jasa profesional lengkap dengan portofolio, daftar layanan, paket harga, testimoni, FAQ, dan form kontak.';
    default: return 'Rancang landing page instan sesuai kebutuhan Anda.';
  }
};

const compressImage = (file) => {
  const maxW = parseInt(process.env.NEXT_PUBLIC_IMAGE_MAX_WIDTH, 10) || 800;
  const maxH = parseInt(process.env.NEXT_PUBLIC_IMAGE_MAX_HEIGHT, 10) || 800;
  const startQuality = parseFloat(process.env.NEXT_PUBLIC_IMAGE_QUALITY) || 0.8;
  const maxKB = parseInt(process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE_KB, 10) || 300;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxW) {
            height = Math.round((height * maxW) / width);
            width = maxW;
          }
        } else {
          if (height > maxH) {
            width = Math.round((width * maxH) / height);
            height = maxH;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const attemptBlob = (q) => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const sizeKB = blob.size / 1024;
                console.log(`[compressImage] Quality: ${q.toFixed(2)} resulted in size: ${sizeKB.toFixed(1)} KB`);
                if (sizeKB <= maxKB || q <= 0.3) {
                  const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                } else {
                  attemptBlob(q - 0.1);
                }
              } else {
                reject(new Error('Canvas to Blob failed'));
              }
            },
            'image/jpeg',
            q
          );
        };

        attemptBlob(startQuality);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const TEMPLATE_LATEST_VERSIONS = {
  // Toko Online
  'modern-clean': 1,
  'midnight-dark': 1,
  // Wedding
  'sage-green': 1,
  'floral-pink': 1,
  'classic-love': 1,
  'javanese-traditional': 1,
  // Birthday
  'cute-balloon': 1,
  'elegant-gold': 1,
  // Campaign
  'neon-conversion': 2,
  'clean-trust': 1,
  // CV
  'professional-dark': 1,
  // E-Course
  'purple-academy': 1,
  // Jasa
  'professional-navy': 1
};

function GenerateContent() {
  const { user, session, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('id');
  const editMode = searchParams.get('editMode') === 'true';
  const [editCount, setEditCount] = useState(0);
  const iframeRef = useRef(null);
  const hasSavedRef = useRef(false);
  const uploadedImagesRef = useRef([]);
  const sessionRef = useRef(session);
  const originalPageDataRef = useRef(null);
  const [iframeReady, setIframeReady] = useState(false);

  // Input states
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [slug, setSlug] = useState('');
  const [templateType, setTemplateType] = useState('');
  const [products, setProducts] = useState([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  // Wedding form states
  const [groomName, setGroomName] = useState('');
  const [groomNickname, setGroomNickname] = useState('');
  const [groomFather, setGroomFather] = useState('');
  const [groomMother, setGroomMother] = useState('');

  const [brideName, setBrideName] = useState('');
  const [brideNickname, setBrideNickname] = useState('');
  const [brideFather, setBrideFather] = useState('');
  const [brideMother, setBrideMother] = useState('');

  const [akadDate, setAkadDate] = useState('');
  const [akadTime, setAkadTime] = useState('');
  const [akadLocation, setAkadLocation] = useState('');
  const [akadMaps, setAkadMaps] = useState('');

  const [resepsiDate, setResepsiDate] = useState('');
  const [resepsiTime, setResepsiTime] = useState('');
  const [resepsiLocation, setResepsiLocation] = useState('');
  const [resepsiMaps, setResepsiMaps] = useState('');

  const [giftBank, setGiftBank] = useState('');
  const [giftAccount, setGiftAccount] = useState('');
  const [giftHolder, setGiftHolder] = useState('');

  // Wedding modular additions
  const [designKey, setDesignKey] = useState('modern-clean');
  const [designVersion, setDesignVersion] = useState(1);
  const [previewDesignKey, setPreviewDesignKey] = useState(null);

  const closePreviewModal = () => {
    setPreviewDesignKey(null);
    if (typeof window !== 'undefined' && window.history.state?.isPreviewModal) {
      window.history.back();
    }
  };

  const handleSelectDesign = (key) => {
    setDesignKey(key);
    setDesignVersion(TEMPLATE_LATEST_VERSIONS[key] || 1);
  };

  // Handle Back Button closure for the Design Preview Modal
  useEffect(() => {
    if (!previewDesignKey) return;

    // Push a custom state to the history stack when the preview is opened
    window.history.pushState({ isPreviewModal: true }, '');

    const handlePopState = (event) => {
      // If the popstate is fired (e.g. user pressed browser back or mobile back)
      if (previewDesignKey) {
        // Prevent going back by closing the modal instead
        setPreviewDesignKey(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [previewDesignKey]);

  // Reset scroll indicator when template modal is opened or category is changed
  useEffect(() => {
    if (isTemplateModalOpen) {
      setShowScrollIndicator(true);
    }
  }, [isTemplateModalOpen, selectedCategory]);

  const [groomImage, setGroomImage] = useState(DEFAULT_GROOM_AVATAR);
  const [brideImage, setBrideImage] = useState(DEFAULT_BRIDE_AVATAR);
  const [storyList, setStoryList] = useState([]);
  const [generatePrewedding, setGeneratePrewedding] = useState(false);
  const [preweddingSource, setPreweddingSource] = useState('unsplash'); // 'unsplash' or 'upload'
  const [preweddingPhotoUrl, setPreweddingPhotoUrl] = useState('');
  const [galleryList, setGalleryList] = useState([]);
  const [isUploadingGalleryImage, setIsUploadingGalleryImage] = useState(false);
  const [isGeneratingPrewedding, setIsGeneratingPrewedding] = useState(false);
  const [isUploadingPreweddingImage, setIsUploadingPreweddingImage] = useState(false);
  const [preweddingGenerateCount, setPreweddingGenerateCount] = useState(0);
  const [maxProjectEdits, setMaxProjectEdits] = useState(3);
  const [projectEditCost, setProjectEditCost] = useState(1);
  const [maxPreweddingGenerations, setMaxPreweddingGenerations] = useState(3);

  // Birthday modular additions
  const [celebrantName, setCelebrantName] = useState('');
  const [celebrantNickname, setCelebrantNickname] = useState('');
  const [celebrantAge, setCelebrantAge] = useState('');
  const [celebrantParents, setCelebrantParents] = useState('');
  const [celebrantImage, setCelebrantImage] = useState(DEFAULT_GROOM_AVATAR);
  const [celebrantGender, setCelebrantGender] = useState('male');

  const [birthdayDate, setBirthdayDate] = useState('');
  const [birthdayTime, setBirthdayTime] = useState('');
  const [birthdayLocation, setBirthdayLocation] = useState('');
  const [birthdayMaps, setBirthdayMaps] = useState('');

  const [birthdayGiftBank, setBirthdayGiftBank] = useState('');
  const [birthdayGiftAccount, setBirthdayGiftAccount] = useState('');
  const [birthdayGiftHolder, setBirthdayGiftHolder] = useState('');

  const [isUploadingCelebrantImage, setIsUploadingCelebrantImage] = useState(false);
  const [isGeneratingCelebrantImage, setIsGeneratingCelebrantImage] = useState(false);

  // Toko Online form states
  const [storeName, setStoreName] = useState('');
  const [storeTagline, setStoreTagline] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeLogoUrl, setStoreLogoUrl] = useState('');
  const [storeBannerUrl, setStoreBannerUrl] = useState('');
  const [generateStoreBanner, setGenerateStoreBanner] = useState(false);
  const [storeBannerSource, setStoreBannerSource] = useState('unsplash');
  const [tokoProducts, setTokoProducts] = useState([{ name: '', price: '', description: '', image_url: '' }]);
  const [tokoWhatsapp, setTokoWhatsapp] = useState('');
  const [tokoInstagram, setTokoInstagram] = useState('');
  const [tokoShopee, setTokoShopee] = useState('');
  const [tokoTokopedia, setTokoTokopedia] = useState('');
  const [tokoAddress, setTokoAddress] = useState('');
  const [tokoQuote, setTokoQuote] = useState('');

  // Campaign form states
  const [campaignHeadline, setCampaignHeadline] = useState('');
  const [campaignSubheadline, setCampaignSubheadline] = useState('');
  const [campaignCtaText, setCampaignCtaText] = useState('Dapatkan Sekarang!');
  const [campaignHeroImage, setCampaignHeroImage] = useState('');
  const [campaignHeroImageSource, setCampaignHeroImageSource] = useState('unsplash');
  const [generateCampaignHero, setGenerateCampaignHero] = useState(false);
  const [isGeneratingCampaignHeroImage, setIsGeneratingCampaignHeroImage] = useState(false);
  const [isUploadingCampaignHeroImage, setIsUploadingCampaignHeroImage] = useState(false);
  const [campaignProblemsTitle, setCampaignProblemsTitle] = useState('Hambatan Utama Anda');
  const [campaignProblemsList, setCampaignProblemsList] = useState(['', '', '']);
  const [campaignSolutionsTitle, setCampaignSolutionsTitle] = useState('Solusi Kami');
  const [campaignSolutionsIntro, setCampaignSolutionsIntro] = useState('');
  const [campaignBenefits, setCampaignBenefits] = useState([
    { title: '', desc: '' },
    { title: '', desc: '' },
    { title: '', desc: '' }
  ]);
  const [campaignTestimonials, setCampaignTestimonials] = useState([
    { name: '', role: '', content: '' },
    { name: '', role: '', content: '' }
  ]);
  const [campaignGuarantee, setCampaignGuarantee] = useState('');
  const [campaignUrgency, setCampaignUrgency] = useState('');
  const [campaignClosingCta, setCampaignClosingCta] = useState('Dapatkan Sekarang!');
  const [campaignWhatsapp, setCampaignWhatsapp] = useState('');
  const [campaignCtaUrl, setCampaignCtaUrl] = useState('');
  const [campaignBrief, setCampaignBrief] = useState('');
  const [campaignFaqs, setCampaignFaqs] = useState([{ question: '', answer: '' }]);

  // Campaign AI loader states
  const [isGeneratingCampaignHero, setIsGeneratingCampaignHero] = useState(false);
  const [isGeneratingCampaignProblems, setIsGeneratingCampaignProblems] = useState(false);
  const [isGeneratingCampaignBenefits, setIsGeneratingCampaignBenefits] = useState(false);
  const [isGeneratingCampaignTestimonials, setIsGeneratingCampaignTestimonials] = useState(false);
  const [isGeneratingCampaignUrgency, setIsGeneratingCampaignUrgency] = useState(false);
  const [isGeneratingCampaignFaq, setIsGeneratingCampaignFaq] = useState(false);

  // CV form states
  const [cvName, setCvName] = useState('');
  const [cvTitle, setCvTitle] = useState('');
  const [cvSummary, setCvSummary] = useState('');
  const [cvEmail, setCvEmail] = useState('');
  const [cvPhone, setCvPhone] = useState('');
  const [cvLocation, setCvLocation] = useState('');
  const [cvLinkedin, setCvLinkedin] = useState('');
  const [cvGithub, setCvGithub] = useState('');
  const [cvPortfolio, setCvPortfolio] = useState('');
  const [cvPhotoUrl, setCvPhotoUrl] = useState('');
  const [isUploadingCvPhoto, setIsUploadingCvPhoto] = useState(false);
  const [cvExperiences, setCvExperiences] = useState([{ company: '', position: '', period: '', description: '' }]);
  const [cvEducations, setCvEducations] = useState([{ institution: '', degree: '', period: '', gpa: '' }]);
  const [cvSkillsInput, setCvSkillsInput] = useState('');
  const [cvSkills, setCvSkills] = useState([]);
  const [cvLanguages, setCvLanguages] = useState([{ language: '', level: '' }]);
  const [cvCertifications, setCvCertifications] = useState([]);
  const [hideFooter, setHideFooter] = useState(false);
 
  // CV AI loader states
  const [isGeneratingCvSummary, setIsGeneratingCvSummary] = useState(false);
  const [isGeneratingCvExperienceDesc, setIsGeneratingCvExperienceDesc] = useState({});

  // E-Course form states
  const [courseName, setCourseName] = useState('');
  const [courseBrief, setCourseBrief] = useState('');
  const [courseTargetAudience, setCourseTargetAudience] = useState('');
  const [courseTone, setCourseTone] = useState('persuasive');
  const [eCourseHeroHeadline, setECourseHeroHeadline] = useState('');
  const [eCourseHeroSubheadline, setECourseHeroSubheadline] = useState('');
  const [eCourseHeroCtaText, setECourseHeroCtaText] = useState('Gabung Kelas Sekarang');
  const [eCourseHeroImage, setECourseHeroImage] = useState('');
  const [generateECourseHeroImage, setGenerateECourseHeroImage] = useState(false);
  const [eCourseHeroImageSource, setECourseHeroImageSource] = useState('unsplash');
  const [eCourseBrandName, setECourseBrandName] = useState('E-COURSE ACADEMY');
  const [eCourseCountdownEnabled, setECourseCountdownEnabled] = useState(true);
  const [eCourseCountdownTitle, setECourseCountdownTitle] = useState('Sisa Waktu Promo Hari Ini:');
  const [eCourseCountdownType, setECourseCountdownType] = useState('end_of_day');
  const [eCourseCountdownTargetDate, setECourseCountdownTargetDate] = useState('');
  const [isGeneratingECourseHeroImage, setIsGeneratingECourseHeroImage] = useState(false);
  const [isUploadingECourseHeroImage, setIsUploadingECourseHeroImage] = useState(false);
  const [eCourseProblemsTitle, setECourseProblemsTitle] = useState('Hambatan Belajar Anda');
  const [eCourseProblemsList, setECourseProblemsList] = useState(['', '', '']);
  const [eCourseSolutionsTitle, setECourseSolutionsTitle] = useState('Solusi Kelas Kami');
  const [eCourseSolutionsIntro, setECourseSolutionsIntro] = useState('');
  const [eCourseSolutionsList, setECourseSolutionsList] = useState(['', '', '']);
  const [eCourseAudienceTitle, setECourseAudienceTitle] = useState('Siapa Yang Wajib Ikut?');
  const [eCourseAudienceList, setECourseAudienceList] = useState(['', '', '']);
  const [eCourseMentorName, setECourseMentorName] = useState('');
  const [eCourseMentorRole, setECourseMentorRole] = useState('');
  const [eCourseMentorDesc, setECourseMentorDesc] = useState('');
  const [eCourseMentorAvatar, setECourseMentorAvatar] = useState('');
  const [generateECourseMentorImage, setGenerateECourseMentorImage] = useState(false);
  const [eCourseMentorImageSource, setECourseMentorImageSource] = useState('upload');
  const [isUploadingECourseMentorAvatar, setIsUploadingECourseMentorAvatar] = useState(false);
  const [eCourseCurriculumTitle, setECourseCurriculumTitle] = useState('Kurikulum & Modul Belajar');
  const [eCourseCurriculumModules, setECourseCurriculumModules] = useState([
    { title: '', desc: '' },
    { title: '', desc: '' },
    { title: '', desc: '' }
  ]);
  const [eCourseBenefitsTitle, setECourseBenefitsTitle] = useState('Fasilitas & Keuntungan');
  const [eCourseBenefitsList, setECourseBenefitsList] = useState([
    { title: '', desc: '' },
    { title: '', desc: '' },
    { title: '', desc: '' }
  ]);
  const [eCourseBonusesTitle, setECourseBonusesTitle] = useState('Bonus Spesial');
  const [eCourseBonusesList, setECourseBonusesList] = useState([
    { title: '', desc: '' },
    { title: '', desc: '' }
  ]);
  const [eCoursePricingTitle, setECoursePricingTitle] = useState('Investasi Belajar Terbaik');
  const [eCoursePricingOriginal, setECoursePricingOriginal] = useState('');
  const [eCoursePricingDiscounted, setECoursePricingDiscounted] = useState('');
  const [eCoursePricingCtaText, setECoursePricingCtaText] = useState('Daftar Sekarang');
  const [eCoursePricingFeatures, setECoursePricingFeatures] = useState(['', '', '']);
  const [eCourseTestimonialsTitle, setECourseTestimonialsTitle] = useState('Ulasan Dari Alumni');
  const [eCourseTestimonialsList, setECourseTestimonialsList] = useState([
    { name: '', role: '', content: '' },
    { name: '', role: '', content: '' }
  ]);
  const [eCourseFaqs, setECourseFaqs] = useState([{ question: '', answer: '' }]);
  const [eCourseWhatsapp, setECourseWhatsapp] = useState('');
  const [eCourseCtaUrl, setECourseCtaUrl] = useState('');
  const [eCourseCopyright, setECourseCopyright] = useState('');

  // E-Course AI assist loading states
  const [isGeneratingECourseHero, setIsGeneratingECourseHero] = useState(false);
  const [isGeneratingECourseProblems, setIsGeneratingECourseProblems] = useState(false);
  const [isGeneratingECourseSolutions, setIsGeneratingECourseSolutions] = useState(false);
  const [isGeneratingECourseAudience, setIsGeneratingECourseAudience] = useState(false);
  const [isGeneratingECourseMentor, setIsGeneratingECourseMentor] = useState(false);
  const [isGeneratingECourseCurriculum, setIsGeneratingECourseCurriculum] = useState(false);
  const [isGeneratingECourseBenefits, setIsGeneratingECourseBenefits] = useState(false);
  const [isGeneratingECourseBonuses, setIsGeneratingECourseBonuses] = useState(false);
  const [isGeneratingECoursePricing, setIsGeneratingECoursePricing] = useState(false);
  const [isGeneratingECourseTestimonials, setIsGeneratingECourseTestimonials] = useState(false);
  const [isGeneratingECourseFaq, setIsGeneratingECourseFaq] = useState(false);

  // Jasa form states
  const [jasaBrandName, setJasaBrandName] = useState('');
  const [jasaBrandTagline, setJasaBrandTagline] = useState('');
  const [jasaBrandDesc, setJasaBrandDesc] = useState('');
  const [jasaBrandLogo, setJasaBrandLogo] = useState('');
  const [jasaBrandCtaText, setJasaBrandCtaText] = useState('Hubungi Kami');
  const [jasaBrandCtaUrl, setJasaBrandCtaUrl] = useState('');
  const [isUploadingJasaBrandLogo, setIsUploadingJasaBrandLogo] = useState(false);
  const [jasaHeroHeadline, setJasaHeroHeadline] = useState('');
  const [jasaHeroSubheadline, setJasaHeroSubheadline] = useState('');
  const [jasaHeroCtaText, setJasaHeroCtaText] = useState('Mulai Konsultasi');
  const [jasaHeroCtaSecondaryText, setJasaHeroCtaSecondaryText] = useState('Lihat Layanan');
  const [jasaHeroImage, setJasaHeroImage] = useState('');
  const [generateJasaHeroImage, setGenerateJasaHeroImage] = useState(false);
  const [jasaHeroImageSource, setJasaHeroImageSource] = useState('unsplash');
  const [isUploadingJasaHeroImage, setIsUploadingJasaHeroImage] = useState(false);
  const [jasaSocialClientCount, setJasaSocialClientCount] = useState('100+');
  const [jasaSocialProjectCount, setJasaSocialProjectCount] = useState('250+');
  const [jasaSocialProductCount, setJasaSocialProductCount] = useState('50+');
  const [jasaSocialLabelClients, setJasaSocialLabelClients] = useState('Klien Puas');
  const [jasaSocialLabelProjects, setJasaSocialLabelProjects] = useState('Project Selesai');
  const [jasaSocialLabelProducts, setJasaSocialLabelProducts] = useState('Produk Aktif');
  const [jasaHowItWorksTitle, setJasaHowItWorksTitle] = useState('Cara Kerja Kami');
  const [jasaHowItWorksSteps, setJasaHowItWorksSteps] = useState([
    { title: 'Konsultasi Kebutuhan', desc: 'Diskusikan kebutuhan proyek Anda secara mendalam dengan tim ahli kami.' },
    { title: 'Perencanaan & Desain', desc: 'Kami menyusun rencana kerja terstruktur dan konsep awal untuk persetujuan Anda.' },
    { title: 'Eksekusi & Deliver', desc: 'Pengerjaan proyek secara profesional dengan jaminan selesai tepat waktu.' }
  ]);
  const [jasaAboutTitle, setJasaAboutTitle] = useState('Tentang Kami');
  const [jasaAboutDesc, setJasaAboutDesc] = useState('');
  const [jasaAboutImage, setJasaAboutImage] = useState('');
  const [generateJasaAboutImage, setGenerateJasaAboutImage] = useState(false);
  const [jasaAboutImageSource, setJasaAboutImageSource] = useState('unsplash');
  const [isUploadingJasaAboutImage, setIsUploadingJasaAboutImage] = useState(false);
  const [jasaAboutCtaPortfolioText, setJasaAboutCtaPortfolioText] = useState('Lihat Portofolio');
  const [jasaAboutCtaOrderText, setJasaAboutCtaOrderText] = useState('Pesan Sekarang');
  const [jasaServicesTitle, setJasaServicesTitle] = useState('Layanan Kami');
  const [jasaServicesList, setJasaServicesList] = useState([
    { name: 'Konsultasi Bisnis', desc: 'Analisis mendalam untuk menemukan strategi pertumbuhan bisnis terbaik.', features: ['Strategi Pemasaran', 'Analisis Kompetitor', 'Optimasi Operasional'], image_url: '' },
    { name: 'Pengembangan Web', desc: 'Pembuatan website profesional yang cepat, responsif, dan SEO-friendly.', features: ['Desain Custom', 'Mobile Responsive', 'SEO Optimization'], image_url: '' }
  ]);
  const [jasaWhyUsTitle, setJasaWhyUsTitle] = useState('Mengapa Memilih Kami?');
  const [jasaWhyUsPoints, setJasaWhyUsPoints] = useState([
    { title: 'Tim Profesional', desc: 'Dikerjakan oleh tenaga ahli berpengalaman di bidangnya.' },
    { title: 'Tepat Waktu', desc: 'Komitmen penuh pada tenggat waktu penyelesaian proyek.' },
    { title: 'Kualitas Premium', desc: 'Standar kualitas tinggi untuk setiap hasil kerja kami.' },
    { title: 'Dukungan Penuh', desc: 'Layanan konsultasi dan support responsif pasca proyek.' }
  ]);
  const [jasaDeliverablesTitle, setJasaDeliverablesTitle] = useState('Apa yang Anda Dapatkan');
  const [jasaDeliverablesList, setJasaDeliverablesList] = useState([
    { title: 'Laporan Analisis Lengkap', desc: 'Dokumen evaluasi mendalam mengenai performa bisnis Anda.' },
    { title: 'Aset Digital Siap Pakai', desc: 'File source code, desain grafis, atau konten dalam format premium.' },
    { title: 'Panduan Operasional', desc: 'Petunjuk praktis untuk mengelola dan mengembangkan sistem baru Anda.' }
  ]);
  const [jasaPricingTitle, setJasaPricingTitle] = useState('Pilih Paket Terbaik Anda');
  const [jasaPricingSubtitle, setJasaPricingSubtitle] = useState('Harga transparan tanpa biaya tersembunyi');
  const [jasaPricingCtaOnly, setJasaPricingCtaOnly] = useState(false);
  const [jasaPricingCtaText, setJasaPricingCtaText] = useState('Konsultasi Sekarang');
  const [jasaPricingPlans, setJasaPricingPlans] = useState([
    { name: 'Paket Silver', badge: '', original_price: 'Rp 1.500.000', sale_price: 'Rp 990.000', cta_text: '', features: ['1x Sesi Konsultasi', 'Laporan Dasar', 'Revisi 1x'], highlighted: false },
    { name: 'Paket Gold', badge: 'Terpopuler', original_price: 'Rp 3.000.000', sale_price: 'Rp 1.990.000', cta_text: '', features: ['3x Sesi Konsultasi', 'Laporan Lengkap', 'Revisi 3x', 'Prioritas Support'], highlighted: true },
    { name: 'Paket Platinum', badge: '', original_price: 'Rp 5.000.000', sale_price: 'Rp 3.490.000', cta_text: '', features: ['Sesi Unlimited', 'Implementasi Sistem', 'Revisi Unlimited', 'Support 24/7'], highlighted: false }
  ]);
  const [jasaGuaranteeTitle, setJasaGuaranteeTitle] = useState('Garansi Kepuasan 100%');
  const [jasaGuaranteeDesc, setJasaGuaranteeDesc] = useState('Kami berkomitmen memberikan hasil terbaik. Jika tidak puas, kami siap melakukan revisi hingga sesuai dengan ekspektasi Anda.');
  const [jasaTestimonialsTitle, setJasaTestimonialsTitle] = useState('Kata Klien Kami');
  const [jasaTestimonialsList, setJasaTestimonialsList] = useState([
    { name: 'Ahmad Subardjo', role: 'CEO TechStart', content: 'Layanan yang sangat luar biasa. Tim sangat responsif dan hasil kerjanya melebihi ekspektasi kami.', avatar_url: '' },
    { name: 'Siti Aminah', role: 'Owner Crafty', content: 'Sangat puas dengan kolaborasi ini. Penjualan kami meningkat pesat setelah menerapkan rekomendasi dari mereka.', avatar_url: '' }
  ]);
  const [jasaFaqs, setJasaFaqs] = useState([
    { question: 'Berapa lama proses pengerjaan?', answer: 'Proses pengerjaan bergantung pada skala proyek, umumnya berkisar antara 7 hingga 30 hari kerja.' },
    { question: 'Apakah ada garansi revisi?', answer: 'Ya, setiap paket memiliki kuota revisi masing-masing untuk memastikan kepuasan Anda.' }
  ]);
  const [jasaWhatsapp, setJasaWhatsapp] = useState('');
  const [jasaEmail, setJasaEmail] = useState('');
  const [jasaAddress, setJasaAddress] = useState('');
  const [jasaCtaUrl, setJasaCtaUrl] = useState('');
  const [jasaCopyright, setJasaCopyright] = useState('');
  const [jasaClosingTitle, setJasaClosingTitle] = useState('');
  const [jasaClosingCtaText, setJasaClosingCtaText] = useState('');

  // Dynamic Builder (V2) Modular Section States
  const [isGeneratingV2Section, setIsGeneratingV2Section] = useState(null);
  // Ref that always holds the latest v2Sections value.
  // Used inside async handlers to avoid stale-closure bugs.
  const v2SectionsRef = useRef([]);
  const [isV2OnboardingOpen, setIsV2OnboardingOpen] = useState(false);
  const [isV2VisualPickerOpen, setIsV2VisualPickerOpen] = useState(false);
  const [v2GlobalTheme, setV2GlobalTheme] = useState('navy');

  const getSectionTypeIcon = (type) => {
    switch (type) {
      case 'header': return '📌';
      case 'hero': return '🖼️';
      case 'about': return '📖';
      case 'social_proof': return '⭐';
      case 'services': return '🛠️';
      case 'pricing': return '🏷️';
      case 'faq': return '❓';
      case 'contact': return '💬';
      case 'wedding_hero': return '🌸';
      case 'wedding_couple': return '💍';
      case 'wedding_countdown': return '⏳';
      case 'wedding_events': return '📅';
      case 'wedding_story': return '💕';
      case 'wedding_gallery': return '📸';
      case 'digital_gift': return '💳';
      case 'wedding_wishes': return '💌';
      case 'product_grid': return '🛍️';
      case 'store_guarantee': return '🛡️';
      case 'course_curriculum': return '📚';
      case 'course_mentor': return '🎓';
      case 'custom': return '✦';
      default: return '🧩';
    }
  };

  const getSectionDisplayTitle = (section) => {
    const rawTitle = section.content?.title || section.content?.headline || section.content?.badge_text || section.content?.brand_name || section.content?.groom_name || '';
    if (rawTitle) {
      return rawTitle.length > 30 ? `${rawTitle.substring(0, 30)}...` : rawTitle;
    }
    switch (section.type) {
      case 'header': return 'Header / Navigasi Top Bar';
      case 'hero': return 'Hero / Banner Utama';
      case 'about': return 'About / Tentang Kami';
      case 'social_proof': return 'Social Proof & Statistik';
      case 'services': return 'Services / Layanan Grid';
      case 'pricing': return 'Pricing / Paket Harga';
      case 'faq': return 'FAQ / Pertanyaan Umum';
      case 'wedding_hero': return 'Cover Depan Undangan Pernikahan';
      case 'wedding_couple': return 'Profil Mempelai Pria & Wanita';
      case 'wedding_countdown': return 'Live Countdown Timer';
      case 'wedding_events': return 'Jadwal Akad & Resepsi';
      case 'wedding_story': return 'Love Story Timeline';
      case 'wedding_gallery': return 'Galeri Album Prewedding';
      case 'digital_gift': return 'Amplop Digital & QRIS';
      case 'wedding_wishes': return 'Buku Tamu & Ucapan Doa';
      case 'product_grid': return 'Etalase Katalog Produk';
      case 'store_guarantee': return 'Jaminan Belanja Toko';
      case 'course_curriculum': return 'Silabus & Modul Belajar';
      case 'course_mentor': return 'Profil Instruktur Mentor';
      case 'contact': return 'Contact / WhatsApp CTA';
      case 'custom': return 'Custom / Feature Cards';
      default: return `${section.type.toUpperCase()} Section`;
    }
  };

  const handleSelectV2Preset = (presetId) => {
    const found = V2_STARTER_PRESETS.find(p => p.id === presetId);
    if (found) {
      const clonedSections = JSON.parse(JSON.stringify(found.sections)).map((sec, idx) => ({
        ...sec,
        id: `sec-${sec.type}-${Date.now()}-${idx}`
      }));
      setV2BrandName(found.defaultBrandName || '');
      setV2BrandBrief(found.defaultBrief || '');
      setV2Sections(clonedSections);
      setIsV2OnboardingOpen(false);
    }
  };

  const handleApplyGlobalTheme = (themeKey) => {
    setV2GlobalTheme(themeKey);
    setV2Sections(prev => prev.map(sec => ({
      ...sec,
      bg_style: themeKey,
      content: {
        ...sec.content,
        bg_style: themeKey
      }
    })));
  };


  const handleFocusSectionInPreview = (sectionId, sectionType) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SCROLL_TO_SECTION',
        sectionId: sectionId,
        sectionType: sectionType
      }, '*');
    }
  };

  const [v2BrandName, setV2BrandName] = useState('');
  const [v2BrandBrief, setV2BrandBrief] = useState('');
  const [v2Sections, setV2Sections] = useState([]);

  // Auto-open V2 Starter Kit Onboarding Modal when creating a new V2 project
  useEffect(() => {
    if (templateType === 'dynamic-builder' && !draftId && v2Sections.length === 0) {
      setIsV2OnboardingOpen(true);
    }
  }, [templateType, draftId]);


  const handleAddSection = (type) => {
    if (!type) return;

    // Standard sections can only exist ONCE to prevent duplicate navigation & structure bugs
    if (type !== 'custom') {
      const alreadyExists = v2Sections.some(s => s.type === type);
      if (alreadyExists) {
        alert(`Section '${type.toUpperCase()}' sudah ada di landing page Anda. Section standar hanya boleh dibuat 1 kali.\n\nJika ingin menambah bagian baru, gunakan '✦ Custom / Feature Cards' yang bisa ditambahkan tanpa batas.`);
        return;
      }
    }

    const defaultContent = type === 'header' ? {
      show_nav: true,
      cta_text: 'Hubungi Kami',
      cta_url: '#contact',
      logo_url: '',
      logo_enabled: true,
      logo_source: 'upload'
    } : type === 'custom' ? {
      badge_text: 'PROSES MUDAH',
      title: '3 Langkah Mudah Membuat Landing Page Impian Anda dengan Siluet',
      subtitle: 'Proses yang simple dan transparan dari awal hingga selesai',
      cards: [
        { badge: '1', title: 'Langkah 1: Mulai dengan Ide Anda', description: 'Cukup tentukan tujuan landing page Anda (undangan, campaign, toko online, e-course, atau bahkan CV). Tidak perlu skill coding atau desain, kami akan memandu Anda.' },
        { badge: '2', title: 'Langkah 2: AI Siluet Berkreasi untuk Anda', description: 'Saksikan AI cerdas kami secara otomatis menciptakan desain menawan dan mengisi konten persuasif yang relevan, khusus untuk tujuan Anda. Tanpa coding, tanpa pusing!' },
        { badge: '3', title: 'Langkah 3: Publikasikan & Raih Konversi', description: 'Landing page profesional Anda siap dalam hitungan menit! Publikasikan dengan mudah, sebarkan ke audiens Anda, dan mulai konversi ide menjadi aksi nyata.' }
      ]
    } : type === 'social_proof' ? {
      client_count: '100+',
      label_clients: 'Klien Puas',
      project_count: '250+',
      label_projects: 'Proyek Selesai',
      product_count: '50+',
      label_products: 'Produk Aktif'
    } : {
      title: '',
      headline: '',
      subheadline: '',
      description: '',
      whatsapp: ''
    };

    const newSec = {
      id: `sec-${type}-${Date.now()}`,
      type: type,
      variant: type === 'header' ? 'navbar-navy' : type === 'hero' ? 'split-navy' : type === 'about' ? 'simple-navy' : type === 'services' ? 'grid-navy' : type === 'pricing' ? 'grid-navy' : type === 'faq' ? 'accordion-navy' : type === 'social_proof' ? 'navy' : type === 'custom' ? 'cards-navy' : 'footer-navy',
      content: defaultContent
    };
    setV2Sections(prev => {
      if (type === 'header') {
        return [newSec, ...prev];
      }
      const heroIdx = prev.findIndex(s => s.type === 'hero');
      if (heroIdx >= 0) {
        const next = [...prev];
        next.splice(heroIdx + 1, 0, newSec);
        return next;
      }
      return [newSec, ...prev];
    });
  };

  const handleRemoveSection = (id) => {
    setV2Sections(prev => prev.filter(s => s.id !== id));
  };

  const handleMoveSection = (id, direction) => {
    setV2Sections(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (idx < 0) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      return next;
    });
  };

  const handleUpdateSectionContent = (id, newContent) => {
    setV2Sections(prev => prev.map(s => s.id === id ? { ...s, content: { ...s.content, ...newContent } } : s));
  };

  // Keep ref in sync with the latest v2Sections state so async handlers
  // always read fresh data even after rapid state updates.
  useEffect(() => {
    v2SectionsRef.current = v2Sections;
  }, [v2Sections]);

  const handleAISectionAssist = async (id, sectionType) => {
    if (!session?.access_token) return;
    try {
      // ── Read the absolute-latest state from the React scheduler ────────────
      const { latestSec } = await new Promise((resolve) => {
        setV2Sections(prev => {
          const latestSec = prev.find(s => s.id === id) || null;
          resolve({ latestSec });
          return prev; // read-only peek — state unchanged
        });
      });

      if (!latestSec) return;

      setIsGeneratingV2Section(id);
      const fieldType = `v2_${sectionType}`;

      // ── Build context with existing filled items so AI only fills empty slots ─
      let context = {
        brandName: v2BrandName || name,
        brief: v2BrandBrief,
      };

      if (sectionType === 'services') {
        const allItems = latestSec.content?.items || latestSec.content?.list || [];
        const filledItems = allItems.filter(it => (it.title || it.name || '').trim() !== '');
        const emptyCount = allItems.length - filledItems.length;
        if (emptyCount > 0) {
          // Partial: generate only missing items, keep filled ones
          context.existingItems = filledItems;
          context.emptyCount = emptyCount;
        } else {
          // No empty items: regenerate all
          context.itemCount = allItems.length || 2;
        }
      } else if (sectionType === 'pricing') {
        const allPlans = latestSec.content?.plans || [];
        const filledPlans = allPlans.filter(p => (p.name || '').trim() !== '');
        const emptyCount = allPlans.length - filledPlans.length;
        if (emptyCount > 0) {
          context.existingPlans = filledPlans;
          context.emptyCount = emptyCount;
        } else {
          context.itemCount = allPlans.length || 2;
        }
      } else if (sectionType === 'faq') {
        const allFaqs = latestSec.content?.faqs || [];
        const filledFaqs = allFaqs.filter(f => (f.question || '').trim() !== '');
        const emptyCount = allFaqs.length - filledFaqs.length;
        if (emptyCount > 0) {
          context.existingFaqs = filledFaqs;
          context.emptyCount = emptyCount;
        } else {
          context.itemCount = allFaqs.length || 3;
        }
      } else if (sectionType === 'custom') {
        const allCards = latestSec.content?.cards || [];
        context.itemCount = allCards.length || 3;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/field`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ fieldType, context, projectId: projectId || undefined }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error && typeof result.error === 'object' ? JSON.stringify(result.error) : (result.error || 'Gagal mengirim tugas copywriting ke antrean.'));
      }

      const jobId = result.jobId;
      let attempts = 0;
      let finalContent = null;

      while (attempts < 60) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const statusRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/status`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!statusRes.ok) break;
        const jobData = await statusRes.json();
        if (jobData.state === 'completed') {
          finalContent = jobData.result?.content;
          break;
        } else if (jobData.state === 'failed') {
          throw new Error(jobData.failedReason || 'Gagal memproses copywriting AI di antrean.');
        }
        attempts++;
      }

      if (finalContent) {
        let parsed = finalContent;
        if (typeof parsed === 'string') {
          try {
            const cleaned = parsed.replace(/^```(json)?\s*/i, '').replace(/\s*```$/i, '').trim();
            parsed = JSON.parse(cleaned);
          } catch (e) {
            console.error('Failed to parse finalContent string:', e);
          }
        }

        if (parsed && typeof parsed === 'object') {
          if (parsed.data && typeof parsed.data === 'object' && !Array.isArray(parsed.data)) {
            parsed = parsed.data;
          }

          // ── Merge AI result with existing filled items ──────────────────────
          // Read current state once more for the merge
          setV2Sections(prev => {
            const currentSec = prev.find(s => s.id === id);
            if (!currentSec) return prev;

            let newContent = { ...parsed };

            if (sectionType === 'services') {
              const allItems = currentSec.content?.items || currentSec.content?.list || [];
              const filledItems = allItems.filter(it => (it.title || it.name || '').trim() !== '');
              const newItems = Array.isArray(parsed.newItems) ? parsed.newItems
                : (Array.isArray(parsed.items) ? parsed.items : (Array.isArray(parsed.list) ? parsed.list : []));
              const normalizedNew = newItems.map(item => ({
                title: item.title || item.name || '',
                name: item.title || item.name || '',
                desc: item.desc || item.description || '',
                description: item.desc || item.description || '',
              }));
              const mergedItems = [...filledItems, ...normalizedNew];
              newContent = { ...newContent, items: mergedItems, list: mergedItems };
              delete newContent.newItems;
            } else if (sectionType === 'pricing') {
              const allPlans = currentSec.content?.plans || [];
              const filledPlans = allPlans.filter(p => (p.name || '').trim() !== '');
              const newPlans = Array.isArray(parsed.newPlans) ? parsed.newPlans
                : (Array.isArray(parsed.plans) ? parsed.plans : []);
              const mergedPlans = [...filledPlans, ...newPlans];
              newContent = { ...newContent, plans: mergedPlans };
              delete newContent.newPlans;
            } else if (sectionType === 'faq') {
              const allFaqs = currentSec.content?.faqs || [];
              const filledFaqs = allFaqs.filter(f => (f.question || '').trim() !== '');
              const newFaqs = Array.isArray(parsed.newFaqs) ? parsed.newFaqs
                : (Array.isArray(parsed.faqs) ? parsed.faqs : []);
              const mergedFaqs = [...filledFaqs, ...newFaqs];
              newContent = { ...newContent, faqs: mergedFaqs };
              delete newContent.newFaqs;
            } else if (sectionType === 'custom') {
              if (Array.isArray(parsed.cards)) {
                newContent.cards = parsed.cards;
              }
            }

            return prev.map(s => s.id === id ? { ...s, content: { ...s.content, ...newContent } } : s);
          });

          refreshProfile();
        }
      }
    } catch (err) {
      console.error('AI section assist error:', err);
      alert(`Gagal membuat konten AI: ${err.message}`);
    } finally {
      setIsGeneratingV2Section(null);
    }
  };

  // Jasa AI assist loading states
  const [isGeneratingJasaTagline, setIsGeneratingJasaTagline] = useState(false);
  const [isGeneratingJasaHero, setIsGeneratingJasaHero] = useState(false);
  const [isGeneratingJasaHowItWorks, setIsGeneratingJasaHowItWorks] = useState(false);
  const [isGeneratingJasaAbout, setIsGeneratingJasaAbout] = useState(false);
  const [isGeneratingJasaServices, setIsGeneratingJasaServices] = useState(false);
  const [isGeneratingJasaWhyUs, setIsGeneratingJasaWhyUs] = useState(false);
  const [isGeneratingJasaDeliverables, setIsGeneratingJasaDeliverables] = useState(false);
  const [isGeneratingJasaPricing, setIsGeneratingJasaPricing] = useState(false);
  const [isGeneratingJasaTestimonials, setIsGeneratingJasaTestimonials] = useState(false);
  const [isGeneratingJasaFaq, setIsGeneratingJasaFaq] = useState(false);

  // Toko Online upload & AI loader states
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingProductIndex, setIsUploadingProductIndex] = useState(null);
  const [pendingDeleteImages, setPendingDeleteImages] = useState([]);
  const [isGeneratingStoreDesc, setIsGeneratingStoreDesc] = useState(false);
  const [isGeneratingStoreTagline, setIsGeneratingStoreTagline] = useState(false);
  const [isGeneratingStoreQuote, setIsGeneratingStoreQuote] = useState(false);
  const [isGeneratingProductDesc, setIsGeneratingProductDesc] = useState({});

  // Adding story temp states
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryDate, setNewStoryDate] = useState('');
  const [newStoryDesc, setNewStoryDesc] = useState('');
  const [newStoryImage, setNewStoryImage] = useState('');
  const [isUploadingStoryImage, setIsUploadingStoryImage] = useState(false);

  // loading states for upload/generation
  const [isGeneratingGroomImage, setIsGeneratingGroomImage] = useState(false);
  const [isGeneratingBrideImage, setIsGeneratingBrideImage] = useState(false);
  const [isUploadingGroomImage, setIsUploadingGroomImage] = useState(false);
  const [isUploadingBrideImage, setIsUploadingBrideImage] = useState(false);

  // App states
  const [projectId, setProjectId] = useState(null);
  const [projectStatus, setProjectStatus] = useState('draft');
  const [pageData, setPageData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState('');
  const [successUrl, setSuccessUrl] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [aiProgressStatus, setAiProgressStatus] = useState('');
  const [aiProgressDetail, setAiProgressDetail] = useState('');

  // Preview mode (desktop vs mobile)
  const [previewDevice, setPreviewDevice] = useState('mobile');
  const [activeTab, setActiveTab] = useState('edit');

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Tracking pixel states (loaded from user profile, read-only in this view)
  const [trackingConfig, setTrackingConfig] = useState(null);

  // Derives a clean, context-aware slug suggestion from the active form state.
  // Called after AI generation completes to pre-fill the slug input field.
  // Each template type maps to its most meaningful content fields.
  const buildSlugSuggestion = () => {
    let raw = '';
    if (templateType === 'wedding' && groomNickname && brideNickname) {
      raw = `${groomNickname}-${brideNickname}`;
    } else if (templateType === 'birthday' && celebrantNickname) {
      raw = `${celebrantNickname}-ultah`;
    } else if (templateType === 'toko-online' && storeName) {
      raw = storeName;
    } else if (templateType === 'campaign' && campaignHeadline) {
      raw = campaignHeadline.substring(0, 25);
    } else if (templateType === 'cv' && cvName) {
      raw = `${cvName}-cv`;
    } else if (templateType === 'e-course' && courseName) {
      raw = `${courseName}-kelas`;
    } else if (templateType === 'jasa' && jasaBrandName) {
      raw = `${jasaBrandName}-jasa`;
    } else {
      raw = name; // fallback to project name
    }
    return raw
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with dash
      .replace(/-+/g, '-')          // collapse consecutive dashes
      .replace(/(^-|-$)/g, '')      // trim leading/trailing dashes
      .substring(0, 40);            // max 40 chars (leaves room for 6-char UUID suffix)
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch tracking config from user profile
  useEffect(() => {
    const fetchTrackingConfig = async () => {
      if (!session) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const result = await res.json();
          setTrackingConfig(result.data?.tracking_config ?? null);
          if (result.systemSettings) {
            setMaxProjectEdits(result.systemSettings.max_project_edits || 3);
            setProjectEditCost(result.systemSettings.project_edit_cost || 1);
            setMaxPreweddingGenerations(result.systemSettings.max_prewedding_generations || 3);
          }
        }
      } catch (e) {
        // Non-critical: silently ignore
      }
    };
    fetchTrackingConfig();
  }, [session?.access_token]);

  // Load existing draft if ID in query params
  useEffect(() => {
    const fetchDraft = async () => {
      if (!session || !draftId) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${draftId}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const project = result.data;
            setName(project.name);
            setProjectId(project.id);
            setProjectStatus(project.status || 'draft');
            setEditCount(project.edit_count || 0);
            setSuccessUrl(project.live_url || '');
            let pageConfig = project.page_data;
            if (typeof pageConfig === 'string') {
              try {
                pageConfig = JSON.parse(pageConfig);
              } catch (e) {
                console.error('Gagal parsing page_data string:', e);
              }
            }
            originalPageDataRef.current = pageConfig;
            setPageData(pageConfig);
            setHideFooter(!!pageConfig.meta?.hide_footer);

            // Deduce a clean default slug from project name or use already existing slug
            const suggestedSlug = project.slug || project.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            setSlug(suggestedSlug);

            // Set template type and details if wedding
            if (pageConfig && pageConfig.meta?.template_type === 'wedding') {
              setTemplateType('wedding');
              const content = pageConfig.content || {};
              setGroomName(content.groom?.name || '');
              setGroomNickname(content.groom?.nickname || '');
              setGroomFather(content.groom?.father || '');
              setGroomMother(content.groom?.mother || '');

              setBrideName(content.bride?.name || '');
              setBrideNickname(content.bride?.nickname || '');
              setBrideFather(content.bride?.father || '');
              setBrideMother(content.bride?.mother || '');

              setAkadDate(content.akad?.date || '');
              setAkadTime(content.akad?.time || '');
              setAkadLocation(content.akad?.location || '');
              setAkadMaps(content.akad?.maps_url || '');

              setResepsiDate(content.resepsi?.date || '');
              setResepsiTime(content.resepsi?.time || '');
              setResepsiLocation(content.resepsi?.location || '');
              setResepsiMaps(content.resepsi?.maps_url || '');

              setGiftBank(content.gift?.bank_name || '');
              setGiftAccount(content.gift?.account_number || '');
              setGiftHolder(content.gift?.account_holder || '');

              setDesignKey(pageConfig.meta?.design_key || 'sage-green');
              setDesignVersion(pageConfig.meta?.template_version || 1);
              setGroomImage(content.groom?.image_url || DEFAULT_GROOM_AVATAR);
              setBrideImage(content.bride?.image_url || DEFAULT_BRIDE_AVATAR);
              setStoryList(content.story || []);
              setGalleryList(content.gallery || []);
              const activePhoto = content.prewedding_photo_url || content.last_generated_prewedding_url || '';
              setPreweddingPhotoUrl(activePhoto);
              setPreweddingGenerateCount(content.prewedding_generate_count || 0);
              if (content.prewedding_photo_url) {
                setGeneratePrewedding(true);
                if (content.prewedding_photo_url.includes('images.unsplash.com')) {
                  setPreweddingSource('unsplash');
                } else {
                  setPreweddingSource('upload');
                }
              } else {
                setGeneratePrewedding(false);
                setPreweddingSource('unsplash');
              }
            } else if (pageConfig && pageConfig.meta?.template_type === 'birthday') {
              setTemplateType('birthday');
              const content = pageConfig.content || {};
              setCelebrantName(content.celebrant?.name || '');
              setCelebrantNickname(content.celebrant?.nickname || '');
              setCelebrantAge(content.celebrant?.age || '');
              setCelebrantParents(content.celebrant?.parent_name || '');
              setCelebrantImage(content.celebrant?.image_url || DEFAULT_GROOM_AVATAR);
              setCelebrantGender(content.celebrant?.gender || 'male');

              setBirthdayDate(content.event?.date || '');
              setBirthdayTime(content.event?.time || '');
              setBirthdayLocation(content.event?.location || '');
              setBirthdayMaps(content.event?.maps_url || '');

              setBirthdayGiftBank(content.gift?.bank_name || '');
              setBirthdayGiftAccount(content.gift?.account_number || '');
              setBirthdayGiftHolder(content.gift?.account_holder || '');

              setDesignKey(pageConfig.meta?.design_key || 'cute-balloon');
              setDesignVersion(pageConfig.meta?.template_version || 1);
            } else if (pageConfig && pageConfig.meta?.template_type === 'toko-online') {
              setTemplateType('toko-online');
              const content = pageConfig.content || {};
              setStoreName(content.store?.name || '');
              setStoreTagline(content.store?.tagline || '');
              setStoreDescription(content.store?.description || '');
              setStoreLogoUrl(content.store?.logo_url || '');
              setStoreBannerUrl(content.store?.banner_url || '');
              if (content.store?.banner_url) {
                setGenerateStoreBanner(true);
                if (content.store.banner_url.includes('images.unsplash.com')) {
                  setStoreBannerSource('unsplash');
                } else {
                  setStoreBannerSource('upload');
                }
              } else {
                setGenerateStoreBanner(false);
                setStoreBannerSource('unsplash');
              }
              setTokoProducts(content.products || [{ name: '', price: '', description: '', image_url: '' }]);
              setTokoWhatsapp(content.contact?.whatsapp || '');
              setTokoInstagram(content.contact?.instagram || '');
              setTokoShopee(content.contact?.shopee_url || '');
              setTokoTokopedia(content.contact?.tokopedia_url || '');
              setTokoAddress(content.contact?.address || '');
              setTokoQuote(content.quote || '');
              setDesignKey(pageConfig.meta?.design_key || 'modern-clean');
              setDesignVersion(pageConfig.meta?.template_version || 1);
            } else if (pageConfig && pageConfig.meta?.template_type === 'campaign') {
              setTemplateType('campaign');
              const content = pageConfig.content || {};
              setCampaignBrief(content.brief || pageConfig.meta?.brief || '');
              setCampaignHeadline(content.hero?.headline || '');
              setCampaignSubheadline(content.hero?.subheadline || '');
              setCampaignCtaText(content.hero?.cta_text || 'Dapatkan Sekarang!');
              setCampaignHeroImage(content.hero?.image_url || '');
              if (content.hero?.image_url) {
                setGenerateCampaignHero(true);
                if (content.hero.image_url.includes('images.unsplash.com')) {
                  setCampaignHeroImageSource('unsplash');
                } else {
                  setCampaignHeroImageSource('upload');
                }
              } else {
                setGenerateCampaignHero(false);
                setCampaignHeroImageSource('unsplash');
              }
              setCampaignProblemsTitle(content.problems?.title || 'Hambatan Utama Anda');
              setCampaignProblemsList(content.problems?.list || ['', '', '']);
              setCampaignSolutionsTitle(content.solutions?.title || 'Solusi Kami');
              setCampaignSolutionsIntro(content.solutions?.intro || '');
              setCampaignBenefits(content.solutions?.benefits || [{ title: '', desc: '' }, { title: '', desc: '' }, { title: '', desc: '' }]);
              setCampaignTestimonials(content.social_proof?.testimonials || [{ name: '', role: '', content: '' }, { name: '', role: '', content: '' }]);
              setCampaignGuarantee(content.social_proof?.guarantee || '');
              setCampaignUrgency(content.closing?.urgency || '');
              setCampaignClosingCta(content.closing?.cta_text || 'Dapatkan Sekarang!');
              setCampaignWhatsapp(content.contact?.whatsapp || '');
              setCampaignCtaUrl(content.contact?.cta_url || '');
              setCampaignFaqs(content.faqs || [{ question: '', answer: '' }]);
              setDesignKey(pageConfig.meta?.design_key || 'neon-conversion');
              setDesignVersion(pageConfig.meta?.template_version || 1);
            } else if (pageConfig && pageConfig.meta?.template_type === 'cv') {
              setTemplateType('cv');
              const content = pageConfig.content || {};
              setCvName(content.profile?.name || '');
              setCvTitle(content.profile?.title || '');
              setCvSummary(content.profile?.summary || '');
              setCvEmail(content.profile?.email || '');
              setCvPhone(content.profile?.phone || '');
              setCvLocation(content.profile?.location || '');
              setCvLinkedin(content.profile?.linkedin_url || '');
              setCvGithub(content.profile?.github_url || '');
              setCvPortfolio(content.profile?.portfolio_url || '');
              setCvPhotoUrl(content.profile?.photo_url || '');
              setCvExperiences(content.experiences?.length > 0 ? content.experiences : [{ company: '', position: '', period: '', description: '' }]);
              setCvEducations(content.educations?.length > 0 ? content.educations : [{ institution: '', degree: '', period: '', gpa: '' }]);
              setCvSkills(content.skills || []);
              setCvSkillsInput('');
              setCvLanguages(content.languages?.length > 0 ? content.languages : [{ language: '', level: '' }]);
              setCvCertifications(content.certifications || []);
              setDesignKey(pageConfig.meta?.design_key || 'professional-dark');
              setDesignVersion(pageConfig.meta?.template_version || 1);
            } else if (pageConfig && pageConfig.meta?.template_type === 'e-course') {
              setTemplateType('e-course');
              const content = pageConfig.content || {};
              setCourseName(content.courseName || pageConfig.meta?.courseName || '');
              setCourseBrief(content.courseBrief || pageConfig.meta?.courseBrief || '');
              setCourseTargetAudience(content.courseTargetAudience || '');
              setCourseTone(content.courseTone || pageConfig.meta?.resolvedToneKey || 'persuasive');
              
              setECourseHeroHeadline(content.hero?.headline || '');
              setECourseHeroSubheadline(content.hero?.subheadline || '');
              setECourseHeroCtaText(content.hero?.cta_text || 'Gabung Kelas Sekarang');
              setECourseHeroImage(content.hero?.image_url || '');
              if (content.hero?.image_url) {
                setGenerateECourseHeroImage(true);
                if (content.hero.image_url.includes('images.unsplash.com')) {
                  setECourseHeroImageSource('unsplash');
                } else {
                  setECourseHeroImageSource('upload');
                }
              } else {
                setGenerateECourseHeroImage(false);
                setECourseHeroImageSource('unsplash');
              }
              setECourseBrandName(content.brand_name || 'E-COURSE ACADEMY');
              const cd = content.countdown || {};
              setECourseCountdownEnabled(cd.enabled !== false);
              setECourseCountdownTitle(cd.title || 'Sisa Waktu Promo Hari Ini:');
              setECourseCountdownType(cd.type || 'end_of_day');
              if (cd.target_date) {
                try {
                  const date = new Date(cd.target_date);
                  const localIso = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                  setECourseCountdownTargetDate(localIso);
                } catch (e) {
                  setECourseCountdownTargetDate('');
                }
              } else {
                setECourseCountdownTargetDate('');
              }
              
              setECourseProblemsTitle(content.problems?.title || 'Hambatan Belajar Anda');
              setECourseProblemsList(content.problems?.list || ['', '', '']);
              setECourseSolutionsTitle(content.solutions?.title || 'Solusi Kelas Kami');
              setECourseSolutionsIntro(content.solutions?.intro || '');
              setECourseSolutionsList(content.solutions?.list || ['', '', '']);
              setECourseAudienceTitle(content.audience?.title || 'Siapa Yang Wajib Ikut?');
              setECourseAudienceList(content.audience?.list || ['', '', '']);
              
              setECourseMentorName(content.mentor?.name || '');
              setECourseMentorRole(content.mentor?.role || '');
              setECourseMentorDesc(content.mentor?.desc || '');
              setECourseMentorAvatar(content.mentor?.avatar_url || '');
              if (content.mentor?.avatar_url) {
                setGenerateECourseMentorImage(true);
                if (content.mentor.avatar_url.includes('images.unsplash.com')) {
                  setECourseMentorImageSource('unsplash');
                } else {
                  setECourseMentorImageSource('upload');
                }
              } else {
                setGenerateECourseMentorImage(false);
                setECourseMentorImageSource('upload');
              }
              
              setECourseCurriculumTitle(content.curriculum?.title || 'Kurikulum & Modul Belajar');
              setECourseCurriculumModules(content.curriculum?.modules || [{ title: '', desc: '' }, { title: '', desc: '' }, { title: '', desc: '' }]);
              
              setECourseBenefitsTitle(content.benefits?.title || 'Fasilitas & Keuntungan');
              setECourseBenefitsList(content.benefits?.list || [{ title: '', desc: '' }, { title: '', desc: '' }, { title: '', desc: '' }]);
              
              setECourseBonusesTitle(content.bonuses?.title || 'Bonus Spesial');
              setECourseBonusesList(content.bonuses?.list || [{ title: '', desc: '' }, { title: '', desc: '' }]);
              
              setECoursePricingTitle(content.pricing?.title || 'Investasi Belajar Terbaik');
              setECoursePricingOriginal(content.pricing?.original_price || '');
              setECoursePricingDiscounted(content.pricing?.discounted_price || '');
              setECoursePricingCtaText(content.pricing?.cta_text || 'Daftar Sekarang');
              setECoursePricingFeatures(content.pricing?.features || ['', '', '']);
              
              setECourseTestimonialsTitle(content.testimonials?.title || 'Ulasan Dari Alumni');
              setECourseTestimonialsList(content.testimonials?.list || [{ name: '', role: '', content: '' }, { name: '', role: '', content: '' }]);
              
              setECourseFaqs(content.faqs || [{ question: '', answer: '' }]);
              setECourseWhatsapp(content.contact?.whatsapp || '');
              setECourseCtaUrl(content.contact?.cta_url || '');
              setECourseCopyright(content.contact?.copyright || '');
              
              setDesignKey(pageConfig.meta?.design_key || 'purple-academy');
              setDesignVersion(pageConfig.meta?.template_version || 1);
            } else if (pageConfig && pageConfig.meta?.template_type === 'jasa') {
              setTemplateType('jasa');
              const content = pageConfig.content || {};
              setJasaBrandName(content.brand?.name || '');
              setJasaBrandTagline(content.brand?.tagline || '');
              setJasaBrandDesc(content.brand?.description || '');
              setJasaBrandLogo(content.brand?.logo_url || '');
              setJasaBrandCtaText(content.brand?.cta_text === undefined ? 'Hubungi Kami' : (content.brand?.cta_text || ''));
              setJasaBrandCtaUrl(content.brand?.cta_url || '');

              setJasaHeroHeadline(content.hero?.headline || '');
              setJasaHeroSubheadline(content.hero?.subheadline || '');
              setJasaHeroCtaText(content.hero?.cta_text || 'Mulai Konsultasi');
              setJasaHeroCtaSecondaryText(content.hero?.cta_secondary_text === undefined ? 'Lihat Layanan' : (content.hero?.cta_secondary_text || ''));
              setJasaHeroImage(content.hero?.image_url || '');
              if (content.hero?.image_url) {
                setGenerateJasaHeroImage(true);
                if (content.hero.image_url.includes('images.unsplash.com')) {
                  setJasaHeroImageSource('unsplash');
                } else {
                  setJasaHeroImageSource('upload');
                }
              } else {
                setGenerateJasaHeroImage(false);
                setJasaHeroImageSource('unsplash');
              }

              const sp = content.social_proof || {};
              setJasaSocialClientCount(sp.client_count || '100+');
              setJasaSocialProjectCount(sp.project_count || '250+');
              setJasaSocialProductCount(sp.product_count || '50+');
              setJasaSocialLabelClients(sp.label_clients || 'Klien Puas');
              setJasaSocialLabelProjects(sp.label_projects || 'Project Selesai');
              setJasaSocialLabelProducts(sp.label_products || 'Produk Aktif');

              const hiw = content.how_it_works || {};
              setJasaHowItWorksTitle(hiw.title || 'Cara Kerja Kami');
              setJasaHowItWorksSteps(hiw.steps || [
                { title: 'Konsultasi Kebutuhan', desc: 'Diskusikan kebutuhan proyek Anda secara mendalam dengan tim ahli kami.' },
                { title: 'Perencanaan & Desain', desc: 'Kami menyusun rencana kerja terstruktur dan konsep awal untuk persetujuan Anda.' },
                { title: 'Eksekusi & Deliver', desc: 'Pengerjaan proyek secara profesional dengan jaminan selesai tepat waktu.' }
              ]);

              const ab = content.about || {};
              setJasaAboutTitle(ab.title || 'Tentang Kami');
              setJasaAboutDesc(ab.desc || '');
              setJasaAboutImage(ab.image_url || '');
              if (ab.image_url) {
                setGenerateJasaAboutImage(true);
                if (ab.image_url.includes('images.unsplash.com')) {
                  setJasaAboutImageSource('unsplash');
                } else {
                  setJasaAboutImageSource('upload');
                }
              } else {
                setGenerateJasaAboutImage(false);
                setJasaAboutImageSource('unsplash');
              }
              setJasaAboutCtaPortfolioText(ab.cta_portfolio_text === undefined ? 'Lihat Portofolio' : (ab.cta_portfolio_text || ''));
              setJasaAboutCtaOrderText(ab.cta_order_text || 'Pesan Sekarang');

              const svcs = content.services || {};
              setJasaServicesTitle(svcs.title || 'Layanan Kami');
              setJasaServicesList(svcs.list || [
                { name: 'Konsultasi Bisnis', desc: 'Analisis mendalam untuk menemukan strategi pertumbuhan bisnis terbaik.', features: ['Strategi Pemasaran', 'Analisis Kompetitor', 'Optimasi Operasional'], image_url: '' },
                { name: 'Pengembangan Web', desc: 'Pembuatan website profesional yang cepat, responsif, dan SEO-friendly.', features: ['Desain Custom', 'Mobile Responsive', 'SEO Optimization'], image_url: '' }
              ]);

              const wu = content.why_us || {};
              setJasaWhyUsTitle(wu.title || 'Mengapa Memilih Kami?');
              setJasaWhyUsPoints(wu.points || [
                { title: 'Tim Profesional', desc: 'Dikerjakan oleh tenaga ahli berpengalaman di bidangnya.' },
                { title: 'Tepat Waktu', desc: 'Komitmen penuh pada tenggat waktu penyelesaian proyek.' },
                { title: 'Kualitas Premium', desc: 'Standar kualitas tinggi untuk setiap hasil kerja kami.' },
                { title: 'Dukungan Penuh', desc: 'Layanan konsultasi dan support responsif pasca proyek.' }
              ]);

              const del = content.deliverables || {};
              setJasaDeliverablesTitle(del.title || 'Apa yang Anda Dapatkan');
              setJasaDeliverablesList(del.list || [
                { title: 'Laporan Analisis Lengkap', desc: 'Dokumen evaluasi mendalam mengenai performa bisnis Anda.' },
                { title: 'Aset Digital Siap Pakai', desc: 'File source code, desain grafis, atau konten dalam format premium.' },
                { title: 'Panduan Operasional', desc: 'Petunjuk praktis untuk mengelola dan mengembangkan sistem baru Anda.' }
              ]);

              const pr = content.pricing || {};
              setJasaPricingTitle(pr.title || 'Pilih Paket Terbaik Anda');
              setJasaPricingSubtitle(pr.subtitle || 'Harga transparan tanpa biaya tersembunyi');
              setJasaPricingCtaOnly(!!pr.cta_only);
              setJasaPricingCtaText(pr.cta_text || 'Konsultasi Sekarang');
              setJasaPricingPlans(pr.plans || [
                { name: 'Paket Silver', badge: '', original_price: 'Rp 1.500.000', sale_price: 'Rp 990.000', cta_text: '', features: ['1x Sesi Konsultasi', 'Laporan Dasar', 'Revisi 1x'], highlighted: false },
                { name: 'Paket Gold', badge: 'Terpopuler', original_price: 'Rp 3.000.000', sale_price: 'Rp 1.990.000', cta_text: '', features: ['3x Sesi Konsultasi', 'Laporan Lengkap', 'Revisi 3x', 'Prioritas Support'], highlighted: true },
                { name: 'Paket Platinum', badge: '', original_price: 'Rp 5.000.000', sale_price: 'Rp 3.490.000', cta_text: '', features: ['Sesi Unlimited', 'Implementasi Sistem', 'Revisi Unlimited', 'Support 24/7'], highlighted: false }
              ]);

              const gt = content.guarantee || {};
              setJasaGuaranteeTitle(gt.title || 'Garansi Kepuasan 100%');
              setJasaGuaranteeDesc(gt.desc || 'Kami berkomitmen memberikan hasil terbaik. Jika tidak puas, kami siap melakukan revisi hingga sesuai dengan ekspektasi Anda.');

              const tst = content.testimonials || {};
              setJasaTestimonialsTitle(tst.title || 'Kata Klien Kami');
              setJasaTestimonialsList(tst.list || [
                { name: 'Ahmad Subardjo', role: 'CEO TechStart', content: 'Layanan yang sangat luar biasa. Tim sangat responsif dan hasil kerjanya melebihi ekspektasi kami.', avatar_url: '' },
                { name: 'Siti Aminah', role: 'Owner Crafty', content: 'Sangat puas dengan kolaborasi ini. Penjualan kami meningkat pesat setelah menerapkan rekomendasi dari mereka.', avatar_url: '' }
              ]);

              setJasaFaqs(content.faqs || [
                { question: 'Berapa lama proses pengerjaan?', answer: 'Proses pengerjaan bergantung pada skala proyek, umumnya berkisar antara 7 hingga 30 hari kerja.' },
                { question: 'Apakah ada garansi revisi?', answer: 'Ya, setiap paket memiliki kuota revisi masing-masing untuk memastikan kepuasan Anda.' }
              ]);

              setJasaWhatsapp(content.contact?.whatsapp || '');
              setJasaEmail(content.contact?.email || '');
              setJasaAddress(content.contact?.address || '');
              setJasaCtaUrl(content.contact?.cta_url || '');
              setJasaCopyright(content.contact?.copyright || '');
              setJasaClosingTitle(content.closing_cta?.title || '');
              setJasaClosingCtaText(content.closing_cta?.cta_text || '');

              setDesignKey(pageConfig.meta?.design_key || 'professional-navy');
              setDesignVersion(pageConfig.meta?.template_version || 1);
            } else if (pageConfig && pageConfig.meta?.template_type === 'dynamic-builder') {
              setTemplateType('dynamic-builder');
              const content = pageConfig.content || {};
              setV2BrandName(content.brand_name || '');
              setV2BrandBrief(content.brief || '');
              if (Array.isArray(content.sections) && content.sections.length > 0) {
                // Strict deduplication: Keep at most ONE section per section type
                const uniqueSections = [];
                const seenTypes = new Set();
                for (const sec of content.sections) {
                  if (!seenTypes.has(sec.type)) {
                    seenTypes.add(sec.type);
                    uniqueSections.push(sec);
                  } else {
                    const existingIdx = uniqueSections.findIndex(s => s.type === sec.type);
                    if (existingIdx !== -1) {
                      const existing = uniqueSections[existingIdx];
                      const existingHasContent = existing.content && (existing.content.title || existing.content.description || existing.content.headline);
                      const currentHasContent = sec.content && (sec.content.title || sec.content.description || sec.content.headline);
                      if (!existingHasContent && currentHasContent) {
                        uniqueSections[existingIdx] = sec;
                      }
                    }
                  }
                }
                setV2Sections(uniqueSections);
              }
              setDesignKey(pageConfig.meta?.design_key || 'modern-clean');
              setDesignVersion(pageConfig.meta?.template_version || 1);
            } else {
              setTemplateType('store');
            }
          }
        }
      } catch (err) {
        console.error('Gagal mengambil draft:', err);
      }
    };

    if (session && draftId) {
      fetchDraft();
    }
  }, [session?.access_token, draftId]);

  // Keep sessionRef updated to avoid stale closure during unmount cleanup
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // Auto-cleanup unsaved uploaded images when component unmounts (navigating away)
  useEffect(() => {
    // Reset values on mount
    hasSavedRef.current = false;
    uploadedImagesRef.current = [];

    return () => {
      // Unmount cleanup logic: delete all newly uploaded images if changes were not saved
      if (!hasSavedRef.current && uploadedImagesRef.current.length > 0) {
        console.log('[Cleanup] User navigated away without saving. Deleting unsaved uploads:', uploadedImagesRef.current);
        uploadedImagesRef.current.forEach(url => {
          executeDeleteImage(url);
        });
        try {
          localStorage.removeItem('wuzzkang_unsaved_uploads');
        } catch (e) {}
      }
    };
  }, []);

  // Auto-update pageData in editMode or V2 modular builder to refresh the iframe live preview in real-time
  useEffect(() => {
    const isV2Mode = templateType === 'dynamic-builder';
    if (!isV2Mode && (!editMode || !projectId)) return;


    let assembledContent;
    let metaTitle;

    if (templateType === 'birthday') {
      metaTitle = `Undangan Ulang Tahun ${celebrantNickname || 'Celebrant'}`;
      assembledContent = {
        celebrant: {
          name: celebrantName,
          nickname: celebrantNickname,
          age: celebrantAge,
          parent_name: celebrantParents || null,
          image_url: celebrantImage || null,
          gender: celebrantGender
        },
        event: {
          date: birthdayDate,
          time: birthdayTime,
          location: birthdayLocation,
          maps_url: birthdayMaps || null
        },
        gift: birthdayGiftBank && birthdayGiftAccount ? {
          bank_name: birthdayGiftBank,
          account_number: birthdayGiftAccount,
          account_holder: birthdayGiftHolder || ''
        } : null,
        quote: pageData?.content?.quote || 'Selamat hari lahir! Semoga panjang umur, sehat selalu, dan dilimpahi kebahagiaan serta kesuksesan.'
      };
    } else if (templateType === 'toko-online') {
      metaTitle = storeName || 'Toko Online';
      assembledContent = {
        store: {
          name: storeName,
          tagline: storeTagline,
          description: storeDescription || null,
          logo_url: storeLogoUrl || null,
          banner_url: generateStoreBanner ? (storeBannerUrl || null) : null
        },
        products: tokoProducts.map(p => ({
          name: p.name,
          price: p.price,
          description: p.description || null,
          image_url: p.image_url || null
        })),
        contact: {
          whatsapp: tokoWhatsapp,
          instagram: tokoInstagram || null,
          shopee_url: tokoShopee || null,
          tokopedia_url: tokoTokopedia || null,
          address: tokoAddress || null
        },
        quote: tokoQuote || null
      };
    } else if (templateType === 'campaign') {
      metaTitle = name || 'Campaign Halaman';
      assembledContent = {
        brief: campaignBrief || null,
        hero: {
          headline: campaignHeadline,
          subheadline: campaignSubheadline,
          cta_text: campaignCtaText,
          image_url: generateCampaignHero ? (campaignHeroImage || null) : null
        },
        problems: {
          title: campaignProblemsTitle,
          list: campaignProblemsList.filter(Boolean)
        },
        solutions: {
          title: campaignSolutionsTitle,
          intro: campaignSolutionsIntro,
          benefits: campaignBenefits
        },
        social_proof: {
          testimonials: campaignTestimonials,
          guarantee: campaignGuarantee || null
        },
        closing: {
          urgency: campaignUrgency,
          cta_text: campaignClosingCta
        },
        contact: {
          whatsapp: campaignWhatsapp,
          cta_url: campaignCtaUrl || null
        },
        faqs: campaignFaqs.filter(f => f.question && f.answer)
      };
    } else if (templateType === 'wedding') {
      metaTitle = `Undangan Pernikahan ${groomNickname || 'Groom'} & ${brideNickname || 'Bride'}`;
      assembledContent = {
        groom: { name: groomName, nickname: groomNickname, father: groomFather, mother: groomMother, image_url: groomImage || null },
        bride: { name: brideName, nickname: brideNickname, father: brideFather, mother: brideMother, image_url: brideImage || null },
        story: storyList.length > 0 ? storyList : null,
        akad: { date: akadDate, time: akadTime, location: akadLocation, maps_url: akadMaps || null },
        resepsi: { date: resepsiDate, time: resepsiTime, location: resepsiLocation, maps_url: resepsiMaps || null },
        gift: giftBank && giftAccount ? { bank_name: giftBank, account_number: giftAccount, account_holder: giftHolder || '' } : null,
        gallery: galleryList.length > 0 ? galleryList : null,
        quote: pageData?.content?.quote || '',
        // Reset prewedding photo to null if user unchecks the option, otherwise use generated/saved URL
        prewedding_photo_url: generatePrewedding ? (preweddingPhotoUrl || pageData?.content?.prewedding_photo_url || null) : null,
        // Always preserve the last generated/saved URL in a backup property to enable checklist recovery later
        last_generated_prewedding_url: preweddingPhotoUrl || pageData?.content?.last_generated_prewedding_url || pageData?.content?.prewedding_photo_url || null,
        prewedding_generate_count: preweddingGenerateCount,
        banner_tagline: pageData?.content?.banner_tagline || null,
        invitation_intro: pageData?.content?.invitation_intro || null,
        closing_message: pageData?.content?.closing_message || null,
        style_palette: pageData?.content?.style_palette || null,
        scene_description: pageData?.content?.scene_description || null,
      };
    } else if (templateType === 'jasa') {
      metaTitle = name || 'Layanan Jasa';
      assembledContent = {
        brand: {
          name: jasaBrandName,
          tagline: jasaBrandTagline,
          description: jasaBrandDesc || null,
          logo_url: jasaBrandLogo || null,
          cta_text: jasaBrandCtaText || null,
          cta_url: jasaBrandCtaUrl || null,
        },
        hero: {
          headline: jasaHeroHeadline,
          subheadline: jasaHeroSubheadline,
          cta_text: jasaHeroCtaText,
          cta_secondary_text: jasaHeroCtaSecondaryText || null,
          image_url: generateJasaHeroImage ? (jasaHeroImage || null) : null
        },
        social_proof: {
          client_count: jasaSocialClientCount || null,
          project_count: jasaSocialProjectCount || null,
          product_count: jasaSocialProductCount || null,
          label_clients: jasaSocialLabelClients || null,
          label_projects: jasaSocialLabelProjects || null,
          label_products: jasaSocialLabelProducts || null,
        },
        how_it_works: {
          title: jasaHowItWorksTitle || 'Cara Kerja Kami',
          steps: jasaHowItWorksSteps.filter(s => s.title && s.desc)
        },
        about: {
          title: jasaAboutTitle || 'Tentang Kami',
          desc: jasaAboutDesc,
          image_url: generateJasaAboutImage ? (jasaAboutImage || null) : null,
          cta_portfolio_text: jasaAboutCtaPortfolioText || null,
          cta_order_text: jasaAboutCtaOrderText || null,
        },
        services: {
          title: jasaServicesTitle || 'Layanan Kami',
          list: jasaServicesList.filter(s => s.name && s.desc).map(s => ({
            name: s.name,
            desc: s.desc,
            features: Array.isArray(s.features) ? s.features.filter(Boolean) : [],
            image_url: s.image_url || null
          }))
        },
        why_us: {
          title: jasaWhyUsTitle || 'Mengapa Memilih Kami?',
          points: jasaWhyUsPoints.filter(p => p.title && p.desc)
        },
        deliverables: {
          title: jasaDeliverablesTitle || 'Apa yang Anda Dapatkan',
          list: jasaDeliverablesList.filter(d => d.title && d.desc)
        },
        pricing: {
          title: jasaPricingTitle || 'Pilih Paket Terbaik Anda',
          subtitle: jasaPricingSubtitle || 'Harga transparan tanpa biaya tersembunyi',
          cta_only: !!jasaPricingCtaOnly,
          cta_text: jasaPricingCtaText || 'Konsultasi Sekarang',
          plans: jasaPricingCtaOnly ? [] : jasaPricingPlans.filter(p => p.name).map(p => ({
            name: p.name,
            badge: p.badge || null,
            original_price: p.original_price || null,
            sale_price: p.sale_price || null,
            cta_text: p.cta_text || null,
            features: Array.isArray(p.features) ? p.features.filter(Boolean) : [],
            highlighted: !!p.highlighted
          }))
        },
        guarantee: {
          title: jasaGuaranteeTitle || 'Garansi Kepuasan 100%',
          desc: jasaGuaranteeDesc,
        },
        testimonials: {
          title: jasaTestimonialsTitle || 'Kata Klien Kami',
          list: jasaTestimonialsList.filter(t => t.name && t.content).map(t => ({
            name: t.name,
            role: t.role || null,
            content: t.content,
            avatar_url: t.avatar_url || null
          }))
        },
        faqs: jasaFaqs.filter(f => f.question && f.answer),
        contact: {
          whatsapp: jasaWhatsapp,
          email: jasaEmail || null,
          address: jasaAddress || null,
          cta_url: jasaCtaUrl || null,
          copyright: jasaCopyright || null
        },
        closing_cta: {
          title: jasaClosingTitle || null,
          cta_text: jasaClosingCtaText || null
        }
      };
    } else if (templateType === 'cv') {
      metaTitle = cvName ? `CV — ${cvName}` : 'Curriculum Vitae';
      assembledContent = {
        profile: {
          name: cvName,
          title: cvTitle,
          summary: cvSummary,
          photo_url: cvPhotoUrl || null,
          email: cvEmail,
          phone: cvPhone,
          location: cvLocation,
          linkedin_url: cvLinkedin || null,
          github_url: cvGithub || null,
          portfolio_url: cvPortfolio || null,
        },
        experiences: cvExperiences.filter(e => e.company && e.position && e.period),
        educations: cvEducations.filter(e => e.institution && e.degree && e.period),
        skills: cvSkills,
        languages: cvLanguages.filter(l => l.language && l.level),
        certifications: cvCertifications.filter(c => c.name && c.issuer && c.year),
      };
    } else if (templateType === 'e-course') {
      metaTitle = name || 'E-Course Halaman';
      assembledContent = {
        courseName: courseName,
        courseBrief: courseBrief,
        courseTargetAudience: courseTargetAudience || null,
        courseTone: courseTone || null,
        hero: {
          headline: eCourseHeroHeadline,
          subheadline: eCourseHeroSubheadline,
          cta_text: eCourseHeroCtaText,
          image_url: generateECourseHeroImage ? (eCourseHeroImage || null) : null
        },
        problems: {
          title: eCourseProblemsTitle,
          list: eCourseProblemsList.filter(Boolean)
        },
        solutions: {
          title: eCourseSolutionsTitle,
          intro: eCourseSolutionsIntro,
          list: eCourseSolutionsList.filter(Boolean)
        },
        audience: {
          title: eCourseAudienceTitle,
          list: eCourseAudienceList.filter(Boolean)
        },
        mentor: {
          name: eCourseMentorName,
          role: eCourseMentorRole,
          desc: eCourseMentorDesc,
          avatar_url: generateECourseMentorImage ? (eCourseMentorAvatar || null) : null
        },
        curriculum: {
          title: eCourseCurriculumTitle,
          modules: eCourseCurriculumModules.filter(m => m.title && m.desc)
        },
        benefits: {
          title: eCourseBenefitsTitle,
          list: eCourseBenefitsList.filter(b => b.title && b.desc)
        },
        bonuses: {
          title: eCourseBonusesTitle,
          list: eCourseBonusesList.filter(b => b.title && b.desc)
        },
        pricing: {
          title: eCoursePricingTitle,
          original_price: eCoursePricingOriginal,
          discounted_price: eCoursePricingDiscounted,
          cta_text: eCoursePricingCtaText,
          features: eCoursePricingFeatures.filter(Boolean)
        },
        testimonials: {
          title: eCourseTestimonialsTitle,
          list: eCourseTestimonialsList.filter(t => t.name && t.content)
        },
        faqs: eCourseFaqs.filter(f => f.question && f.answer),
        contact: {
          whatsapp: eCourseWhatsapp,
          cta_url: eCourseCtaUrl || null,
          copyright: eCourseCopyright || null
        },
        brand_name: eCourseBrandName || 'E-COURSE ACADEMY',
        countdown: {
          enabled: eCourseCountdownEnabled,
          title: eCourseCountdownTitle || 'Sisa Waktu Promo Hari Ini:',
          type: eCourseCountdownType,
          target_date: eCourseCountdownType === 'fixed' && eCourseCountdownTargetDate ? new Date(eCourseCountdownTargetDate).toISOString() : null
        }
      };
    } else if (templateType === 'dynamic-builder') {
      metaTitle = name || v2BrandName || 'Modular Landing Page (V2)';
      const cleanSections = [];
      const seenTypeSet = new Set();
      const seenIdSet = new Set();
      for (const s of (v2Sections || [])) {
        if (!seenIdSet.has(s.id)) {
          seenIdSet.add(s.id);
          if (!seenTypeSet.has(s.type)) {
            seenTypeSet.add(s.type);
            cleanSections.push(s);
          } else {
            const hasRealContent = s.content && (s.content.title || s.content.description || s.content.headline);
            if (hasRealContent) {
              cleanSections.push(s);
            }
          }
        }
      }
      assembledContent = {
        brand_name: v2BrandName,
        brief: v2BrandBrief,
        sections: cleanSections
      };
    } else {
      metaTitle = 'Draft Page';
      assembledContent = {};
    }

    const assembledPageData = {
      meta: {
        template_type: templateType,
        design_key: designKey,
        template_version: designVersion,
        title: metaTitle,
        theme: designKey,
        hide_footer: hideFooter
      },
      content: assembledContent
    };

    setTimeout(() => {
      setPageData(assembledPageData);
    }, 0);

  }, [
    editMode,
    projectId,
    templateType,
    designKey,
    designVersion,
    groomName,
    groomNickname,
    groomFather,
    groomMother,
    groomImage,
    brideName,
    brideNickname,
    brideFather,
    brideMother,
    brideImage,
    storyList,
    akadDate,
    akadTime,
    akadLocation,
    akadMaps,
    resepsiDate,
    resepsiTime,
    resepsiLocation,
    resepsiMaps,
    giftBank,
    giftAccount,
    giftHolder,
    celebrantName,
    celebrantNickname,
    celebrantAge,
    celebrantParents,
    celebrantImage,
    celebrantGender,
    birthdayDate,
    birthdayTime,
    birthdayLocation,
    birthdayMaps,
    birthdayGiftBank,
    birthdayGiftAccount,
    birthdayGiftHolder,
    storeName,
    storeTagline,
    storeDescription,
    storeLogoUrl,
    storeBannerUrl,
    generateStoreBanner,
    storeBannerSource,
    tokoProducts,
    tokoWhatsapp,
    tokoInstagram,
    tokoShopee,
    tokoTokopedia,
    tokoAddress,
    tokoQuote,
    campaignHeadline,
    campaignSubheadline,
    campaignCtaText,
    campaignProblemsTitle,
    campaignProblemsList,
    campaignSolutionsTitle,
    campaignSolutionsIntro,
    campaignBenefits,
    campaignTestimonials,
    campaignGuarantee,
    campaignUrgency,
    campaignClosingCta,
    campaignWhatsapp,
    campaignCtaUrl,
    campaignFaqs,
    campaignHeroImage,
    generateCampaignHero,
    preweddingPhotoUrl,
    generatePrewedding,
    preweddingGenerateCount,
    galleryList,
    cvName,
    cvTitle,
    cvSummary,
    cvEmail,
    cvPhone,
    cvLocation,
    cvLinkedin,
    cvGithub,
    cvPortfolio,
    cvPhotoUrl,
    cvExperiences,
    cvEducations,
    cvSkills,
    cvLanguages,
    cvCertifications,
    courseName,
    courseBrief,
    courseTargetAudience,
    courseTone,
    eCourseHeroHeadline,
    eCourseHeroSubheadline,
    eCourseHeroCtaText,
    eCourseHeroImage,
    generateECourseHeroImage,
    eCourseHeroImageSource,
    eCourseBrandName,
    eCourseCountdownEnabled,
    eCourseCountdownTitle,
    eCourseCountdownType,
    eCourseCountdownTargetDate,
    eCourseProblemsTitle,
    eCourseProblemsList,
    eCourseSolutionsTitle,
    eCourseSolutionsIntro,
    eCourseSolutionsList,
    eCourseAudienceTitle,
    eCourseAudienceList,
    eCourseMentorName,
    eCourseMentorRole,
    eCourseMentorDesc,
    eCourseMentorAvatar,
    generateECourseMentorImage,
    eCourseMentorImageSource,
    eCourseCurriculumTitle,
    eCourseCurriculumModules,
    eCourseBenefitsTitle,
    eCourseBenefitsList,
    eCourseBonusesTitle,
    eCourseBonusesList,
    eCoursePricingTitle,
    eCoursePricingOriginal,
    eCoursePricingDiscounted,
    eCoursePricingCtaText,
    eCoursePricingFeatures,
    eCourseTestimonialsTitle,
    eCourseTestimonialsList,
    eCourseFaqs,
    eCourseWhatsapp,
    eCourseCtaUrl,
    eCourseCopyright,
    hideFooter,
    jasaBrandName,
    jasaBrandTagline,
    jasaBrandDesc,
    jasaBrandLogo,
    jasaHeroHeadline,
    jasaHeroSubheadline,
    jasaHeroCtaText,
    jasaHeroCtaSecondaryText,
    jasaHeroImage,
    generateJasaHeroImage,
    jasaSocialClientCount,
    jasaSocialProjectCount,
    jasaSocialProductCount,
    jasaSocialLabelClients,
    jasaSocialLabelProjects,
    jasaSocialLabelProducts,
    jasaHowItWorksTitle,
    jasaHowItWorksSteps,
    jasaAboutTitle,
    jasaAboutDesc,
    jasaAboutImage,
    generateJasaAboutImage,
    jasaAboutCtaPortfolioText,
    jasaAboutCtaOrderText,
    jasaServicesTitle,
    jasaServicesList,
    jasaWhyUsTitle,
    jasaWhyUsPoints,
    jasaDeliverablesTitle,
    jasaDeliverablesList,
    jasaPricingTitle,
    jasaPricingPlans,
    jasaGuaranteeTitle,
    jasaGuaranteeDesc,
    jasaTestimonialsTitle,
    jasaTestimonialsList,
    jasaFaqs,
    jasaWhatsapp,
    jasaEmail,
    jasaAddress,
    jasaCtaUrl,
    jasaCopyright,
    v2GlobalTheme,
    v2BrandName,
    v2BrandBrief,
    v2Sections,
  ]);

  // Synchronize state with live preview iframe
  // Only send postMessage when both iframeReady AND pageData exist
  useEffect(() => {
    if (iframeRef.current && pageData && iframeReady) {
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_PREVIEW',
        pageData: pageData
      }, '*');
    }
  }, [pageData, iframeReady]);

  // Listen for IFRAME_READY message from the preview sandbox iframe
  // This fires on every load of preview/index.html (fresh or refresh)
  useEffect(() => {
    const handleIframeMessage = (event) => {
      if (event.data?.type === 'IFRAME_READY') {
        setIframeReady(true);
        // Immediately send current pageData if available
        if (iframeRef.current && pageData) {
          iframeRef.current.contentWindow.postMessage({
            type: 'UPDATE_PREVIEW',
            pageData: pageData
          }, '*');
        }
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [pageData]);

  // Fetch active products list from backend
  useEffect(() => {
    const fetchProducts = async () => {
      if (!session) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            // Sort products:
            // 1. priority = 1 comes first.
            // 2. within groups, sort by created_at descending (newest first).
            const sortedData = [...result.data].sort((a, b) => {
              const aIsPriority = a.priority === 1;
              const bIsPriority = b.priority === 1;

              if (aIsPriority && !bIsPriority) return -1;
              if (!aIsPriority && bIsPriority) return 1;

              const aTime = new Date(a.created_at || 0).getTime();
              const bTime = new Date(b.created_at || 0).getTime();
              return bTime - aTime;
            });

            setProducts(sortedData);

            // Set the first active template as default ONLY if creating a new project (no draftId)
            if (!draftId) {
              const activeProducts = sortedData.filter(p => p.is_active);
              if (activeProducts.length > 0) {
                const defaultProduct = activeProducts[0];
                setTemplateType(defaultProduct.id);
                
                // Initialize corresponding design key and version
                if (defaultProduct.id === 'toko-online') {
                  setDesignKey('modern-clean');
                  setDesignVersion(TEMPLATE_LATEST_VERSIONS['modern-clean'] || 1);
                } else if (defaultProduct.id === 'wedding') {
                  setDesignKey('sage-green');
                  setDesignVersion(TEMPLATE_LATEST_VERSIONS['sage-green'] || 1);
                } else if (defaultProduct.id === 'birthday') {
                  setDesignKey('cute-balloon');
                  setDesignVersion(TEMPLATE_LATEST_VERSIONS['cute-balloon'] || 1);
                } else if (defaultProduct.id === 'campaign') {
                  setDesignKey('neon-conversion');
                  setDesignVersion(TEMPLATE_LATEST_VERSIONS['neon-conversion'] || 1);
                } else if (defaultProduct.id === 'cv') {
                  setDesignKey('professional-dark');
                  setDesignVersion(TEMPLATE_LATEST_VERSIONS['professional-dark'] || 1);
                } else if (defaultProduct.id === 'e-course') {
                  setDesignKey('purple-academy');
                  setDesignVersion(TEMPLATE_LATEST_VERSIONS['purple-academy'] || 1);
                } else if (defaultProduct.id === 'jasa') {
                  setDesignKey('professional-navy');
                  setDesignVersion(TEMPLATE_LATEST_VERSIONS['professional-navy'] || 1);
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Gagal mengambil daftar produk/template:', err);
      }
    };
    fetchProducts();
  }, [session?.access_token, draftId]);

  const getDisplayProducts = () => {
    if (products && products.length > 0) {
      return products;
    }
    const defaultProducts = [
      { id: 'dynamic-builder', name: 'Modular Section Builder (V2)', is_active: true, cost: 100, description: 'Sistem pembuatan landing page modular fleksibel. Bebas menambah, menghapus, merestrukturisasi, dan mengedit section sesuai kebutuhan.', unit: 'Campaign', priority: 1, created_at: '2026-07-20T00:00:00Z' },
      { id: 'toko-online', name: 'Toko Online', is_active: true, cost: 100, description: 'Desain responsif komersial, katalog produk modern, dan CTA kontak WhatsApp.', unit: 'Toko', priority: null, created_at: '2026-06-20T00:00:00Z' },
      { id: 'campaign', name: 'Campaign Landing Page', is_active: true, cost: 150, description: 'Landing page satu halaman dengan struktur konversi tinggi untuk promosi produk atau penawaran digital.', unit: 'Campaign', priority: null, created_at: '2026-06-21T00:00:00Z' },
      { id: 'wedding', name: 'Undangan Pernikahan', is_active: true, cost: 100, description: 'Undangan digital premium dengan kelola RSVP, iringan musik, dan linimasa kisah kasih.', unit: 'Undangan', priority: null, created_at: '2026-06-22T00:00:00Z' },
      { id: 'birthday', name: 'Undangan Ulang Tahun', is_active: true, cost: 190, description: 'Desain ceria dan elegan untuk pesta ulang tahun anak maupun dewasa.', unit: 'Undangan', priority: null, created_at: '2026-06-23T00:00:00Z' },
      { id: 'jasa', name: 'Jasa Landing Page', is_active: true, cost: 100, description: 'Landing page jasa profesional lengkap dengan portofolio, daftar layanan, paket harga, testimoni, FAQ, dan form kontak.', unit: 'Project', priority: null, created_at: '2026-07-18T00:00:00Z' }
    ];

    return [...defaultProducts].sort((a, b) => {
      const aIsPriority = a.priority === 1;
      const bIsPriority = b.priority === 1;

      if (aIsPriority && !bIsPriority) return -1;
      if (!aIsPriority && bIsPriority) return 1;

      const aTime = new Date(a.created_at || 0).getTime();
      const bTime = new Date(b.created_at || 0).getTime();
      return bTime - aTime;
    });
  };

  const displayProducts = getDisplayProducts();
  const currentProduct = displayProducts.find(p => p.id === templateType);
  const currentCost = currentProduct?.cost ?? 100;

  const getFinalCost = () => {
    const baseCost = currentProduct?.cost ?? 100;
    if (!appliedCoupon) return baseCost;
    if (appliedCoupon.discount_type === 'percentage') {
      const discount = Math.round((baseCost * appliedCoupon.discount_value) / 100);
      return Math.max(0, baseCost - discount);
    } else if (appliedCoupon.discount_type === 'fixed_amount') {
      return Math.max(0, baseCost - appliedCoupon.discount_value);
    }
    return baseCost;
  };

  const finalCost = getFinalCost();

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Masukkan kode kupon terlebih dahulu.');
      return;
    }

    setCouponError('');
    setCouponSuccess('');
    setIsValidatingCoupon(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ code: couponCode, productId: templateType }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setAppliedCoupon(result.data);
        const discountDesc = result.data.discount_type === 'percentage'
          ? `${result.data.discount_value}%`
          : `${result.data.discount_value} Credit`;
        setCouponSuccess(`Kupon "${result.data.code}" berhasil diterapkan! Diskon ${discountDesc}.`);
      } else {
        setAppliedCoupon(null);
        setCouponError(result.error || 'Kupon tidak valid atau sudah kedaluwarsa.');
      }
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError('Gagal memvalidasi kupon. Periksa koneksi internet Anda.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponSuccess('');
    setCouponError('');
  };

  if (loading || (!user && loading)) {
    return <Loading fullScreen={true} text="Memuat Akun..." size="lg" />;
  }

  // Helper to get descriptive validation errors
  const getFormValidationErrors = () => {
    const errors = [];
    if (!name) {
      errors.push(templateType === 'wedding' ? 'Nama Undangan / Pernikahan' :
                  templateType === 'birthday' ? 'Nama Acara Ulang Tahun' :
                  templateType === 'toko-online' ? 'Nama Toko Online' :
                  templateType === 'campaign' ? 'Nama Campaign / Halaman Penjualan' :
                  templateType === 'cv' ? 'Nama CV / Resume' :
                  templateType === 'e-course' ? 'Nama E-Course' :
                  templateType === 'jasa' ? 'Nama Proyek Jasa' : 'Nama Halaman / Acara');
    }
    if (templateType === 'wedding') {
      if (!groomName) errors.push("Nama Lengkap Pria");
      if (!groomNickname) errors.push("Nama Panggilan Pria");
      if (!groomFather) errors.push("Nama Ayah Pria");
      if (!groomMother) errors.push("Nama Ibu Pria");
      if (!brideName) errors.push("Nama Lengkap Wanita");
      if (!brideNickname) errors.push("Nama Panggilan Wanita");
      if (!brideFather) errors.push("Nama Ayah Wanita");
      if (!brideMother) errors.push("Nama Ibu Wanita");
      if (!akadDate) errors.push("Tanggal Akad Nikah");
      if (!akadTime) errors.push("Waktu Akad Nikah");
      if (!akadLocation) errors.push("Lokasi Akad Nikah");
      if (!resepsiDate) errors.push("Tanggal Resepsi Pernikahan");
      if (!resepsiTime) errors.push("Waktu Resepsi Pernikahan");
      if (!resepsiLocation) errors.push("Lokasi Resepsi Pernikahan");
    } else if (templateType === 'birthday') {
      if (!celebrantName) errors.push("Nama Lengkap Anak/Penerima");
      if (!celebrantNickname) errors.push("Nama Panggilan Anak/Penerima");
      if (!celebrantAge) errors.push("Umur Anak/Penerima");
      if (!birthdayDate) errors.push("Tanggal Acara Ulang Tahun");
      if (!birthdayTime) errors.push("Waktu Acara Ulang Tahun");
      if (!birthdayLocation) errors.push("Lokasi Acara Ulang Tahun");
    } else if (templateType === 'toko-online') {
      if (!storeName) errors.push("Nama Toko");
      if (!storeTagline) errors.push("Tagline Toko");
      if (!tokoWhatsapp) errors.push("Nomor WhatsApp Toko");
      if (tokoProducts.length === 0) {
        errors.push("Katalog Produk (Minimal harus ada 1 produk)");
      } else {
        tokoProducts.forEach((p, idx) => {
          if (!p.name) errors.push(`Nama Produk #${idx + 1}`);
          if (!p.price) errors.push(`Harga Produk #${idx + 1}`);
        });
      }
    } else if (templateType === 'campaign') {
      if (!campaignHeadline) errors.push("Headline Utama");
      if (!campaignSubheadline) errors.push("Sub-headline");
      if (!campaignWhatsapp) errors.push("WhatsApp Checkout");
      campaignBenefits.forEach((b, idx) => {
        if (!b.title || !b.desc) errors.push(`Manfaat/Fitur ke-${idx + 1}`);
      });
      campaignTestimonials.forEach((t, idx) => {
        if (!t.name || !t.content) errors.push(`Testimoni ke-${idx + 1}`);
      });
    } else if (templateType === 'cv') {
      if (!cvName) errors.push("Nama Lengkap");
      if (!cvTitle) errors.push("Pekerjaan / Bidang");
      if (!cvSummary) errors.push("Ringkasan Profesional");
      if (!cvEmail) errors.push("Email");
      if (!cvPhone) errors.push("Nomor Telepon/WhatsApp");
      if (!cvLocation) errors.push("Lokasi / Kota");
      if (cvSkills.length === 0) errors.push("Keahlian (Skills)");
      if (cvEducations.length === 0) {
        errors.push("Riwayat Pendidikan (Minimal 1)");
      } else {
        cvEducations.forEach((e, idx) => {
          if (!e.institution || !e.degree || !e.period) errors.push(`Pendidikan #${idx + 1} (Institusi/Gelar/Periode)`);
        });
      }
    } else if (templateType === 'e-course') {
      if (!courseName) errors.push("Nama Kelas/Kursus");
      if (!eCourseWhatsapp) errors.push("Nomor WhatsApp E-Course");
      eCourseCurriculumModules.forEach((m, idx) => {
        if (!m.title || !m.desc) errors.push(`Modul Kurikulum #${idx + 1}`);
      });
      eCourseBenefitsList.forEach((b, idx) => {
        if (!b.title || !b.desc) errors.push(`Keuntungan/Fasilitas #${idx + 1}`);
      });
    } else if (templateType === 'jasa') {
      if (!jasaBrandName) errors.push("Nama Brand / Penyedia Jasa");
      if (!jasaHeroHeadline) errors.push("Headline Utama Jasa");
      if (!jasaWhatsapp) errors.push("Nomor WhatsApp Kontak");
      jasaServicesList.forEach((s, idx) => {
        if (!s.name || !s.desc) errors.push(`Layanan ke-${idx + 1} (Nama/Deskripsi)`);
      });
    } else if (templateType === 'dynamic-builder') {
      if (!v2BrandName) errors.push("Nama Brand / Bisnis");
      if (v2Sections.length === 0) errors.push("Minimal harus ada 1 Section");
    } else if (templateType === 'store') {
      if (!prompt) errors.push("Prompt Ide Landing Page");
    }
    return errors;
  };

  // Helper to validate the form before preview generate
  const isFormInvalid = () => {
    return getFormValidationErrors().length > 0;
  };

  const handleUploadImage = async (file, target) => {
    if (!file) return;

    const maxUploadMB = parseInt(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB, 10) || 5;
    const MAX_SIZE_BYTES = maxUploadMB * 1024 * 1024;
    const isImage = file.type.startsWith('image/');

    // Immediately reject non-images exceeding size limit
    if (!isImage && file.size > MAX_SIZE_BYTES) {
      setError(`Ukuran file terlalu besar. Batas maksimal adalah ${maxUploadMB}MB.`);
      alert(`Ukuran file terlalu besar. Batas maksimal adalah ${maxUploadMB}MB.`);
      return;
    }

    const isGroom = target === 'groom';
    const isBride = target === 'bride';
    const isStory = target === 'story';
    const isPrewedding = target === 'prewedding';
    const isGallery = target === 'gallery';
    const isCampaignHero = target === 'campaignHero';
    const isCelebrant = target === 'celebrant';
    const isLogo = target === 'logo';
    const isBanner = target === 'banner' || target === 'storeBanner';
    const isProduct = target.startsWith('product-');
    const productIndex = isProduct ? parseInt(target.split('-')[1]) : null;
    const isCv = target === 'cv' || target === 'cvPhoto';
    const isECourseHero = target === 'eCourseHero';
    const isECourseMentor = target === 'eCourseMentor';
    const isJasaHero = target === 'jasaHero';
    const isJasaAbout = target === 'jasaAbout';
    const isJasaBrandLogo = target === 'jasaBrandLogo';

    let category = 'other';
    if (isGroom || isBride || isCelebrant || isECourseMentor) category = 'avatar';
    else if (isPrewedding || isCampaignHero || isBanner || isECourseHero || isJasaHero || isJasaAbout) category = 'background';
    else if (isGallery) category = 'gallery';
    else if (isStory) category = 'story';
    else if (isLogo || isJasaBrandLogo) category = 'logo';
    else if (isProduct) category = 'product';
    else if (isCv) category = 'cv';

    if (isGroom) setIsUploadingGroomImage(true);
    if (isBride) setIsUploadingBrideImage(true);
    if (isStory) setIsUploadingStoryImage(true);
    if (isPrewedding) setIsUploadingPreweddingImage(true);
    if (isGallery) setIsUploadingGalleryImage(true);
    if (isCampaignHero) setIsUploadingCampaignHeroImage(true);
    if (isCelebrant) setIsUploadingCelebrantImage(true);
    if (isLogo) setIsUploadingLogo(true);
    if (isBanner) setIsUploadingBanner(true);
    if (isProduct) setIsUploadingProductIndex(productIndex);
    if (isCv) setIsUploadingCvPhoto(true);
    if (isECourseHero) setIsUploadingECourseHeroImage(true);
    if (isECourseMentor) setIsUploadingECourseMentorAvatar(true);
    if (isJasaHero) setIsUploadingJasaHeroImage(true);
    if (isJasaAbout) setIsUploadingJasaAboutImage(true);
    if (isJasaBrandLogo) setIsUploadingJasaBrandLogo(true);

    try {
      let fileToUpload = file;
      if (isImage) {
        if (file.size > MAX_SIZE_BYTES) {
          console.log(`[Dashboard] File size (${(file.size / 1024 / 1024).toFixed(1)} MB) exceeds limit. System will automatically resize/compress image...`);
        }
        try {
          console.log(`[Dashboard] Compressing ${file.name} (${(file.size / 1024).toFixed(1)} KB)...`);
          fileToUpload = await compressImage(file);
          console.log(`[Dashboard] Compressed to ${(fileToUpload.size / 1024).toFixed(1)} KB`);
        } catch (compError) {
          console.error('[Dashboard] Compression failed, uploading original:', compError);
        }
      }

      // Check size limit post-compression/resizing
      if (fileToUpload.size > MAX_SIZE_BYTES) {
        throw new Error(`Ukuran file setelah kompresi/resize (${(fileToUpload.size / 1024 / 1024).toFixed(1)} MB) masih melebihi batas maksimal ${maxUploadMB}MB.`);
      }

      console.log(`[Dashboard] Requesting signed upload URL for: ${fileToUpload.name}`);
      const urlResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          fileName: fileToUpload.name || 'image.jpg',
          mimeType: fileToUpload.type || 'image/jpeg',
          category: category
        })
      });

      const urlResult = await urlResponse.json();
      if (!urlResponse.ok || !urlResult.success) {
        throw new Error(urlResult.error || 'Gagal mendapatkan URL unggah bertanda tangan dari API.');
      }

      const { signedUrl, publicUrl } = urlResult;
      console.log(`[Dashboard] Uploading file directly to signed URL...`);

      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': fileToUpload.type || 'application/octet-stream'
        },
        body: fileToUpload
      });

      if (!uploadResponse.ok) {
        throw new Error('Gagal mengunggah file langsung to storage.');
      }

      console.log(`[Dashboard] Upload successful. Public URL: ${publicUrl}`);
      uploadedImagesRef.current.push(publicUrl);
      try {
        const unsaved = JSON.parse(localStorage.getItem('wuzzkang_unsaved_uploads') || '[]');
        unsaved.push(publicUrl);
        localStorage.setItem('wuzzkang_unsaved_uploads', JSON.stringify(unsaved));
      } catch (e) {
        console.error('[Dashboard] Error saving uploaded image URL to localStorage:', e);
      }

      if (isGroom) {
        if (groomImage) handleDeleteImage(groomImage);
        setGroomImage(publicUrl);
      }
      if (isBride) {
        if (brideImage) handleDeleteImage(brideImage);
        setBrideImage(publicUrl);
      }
      if (isStory) {
        if (newStoryImage) handleDeleteImage(newStoryImage);
        setNewStoryImage(publicUrl);
      }
      if (isPrewedding) {
        if (preweddingPhotoUrl) handleDeleteImage(preweddingPhotoUrl);
        setPreweddingPhotoUrl(publicUrl);
      }
      if (isGallery) setGalleryList(prev => [...prev, publicUrl]);
      if (isCampaignHero) {
        if (campaignHeroImage) handleDeleteImage(campaignHeroImage);
        setCampaignHeroImage(publicUrl);
      }
      if (isCelebrant) {
        if (celebrantImage) handleDeleteImage(celebrantImage);
        setCelebrantImage(publicUrl);
      }
      if (isLogo) {
        if (storeLogoUrl) handleDeleteImage(storeLogoUrl);
        setStoreLogoUrl(publicUrl);
      }
      if (isBanner) {
        if (storeBannerUrl) handleDeleteImage(storeBannerUrl);
        setStoreBannerUrl(publicUrl);
      }
      if (isCv) {
        if (cvPhotoUrl) handleDeleteImage(cvPhotoUrl);
        setCvPhotoUrl(publicUrl);
      }
      if (isECourseHero) {
        if (eCourseHeroImage) handleDeleteImage(eCourseHeroImage);
        setECourseHeroImage(publicUrl);
      }
      if (isECourseMentor) {
        if (eCourseMentorAvatar) handleDeleteImage(eCourseMentorAvatar);
        setECourseMentorAvatar(publicUrl);
      }
      if (isJasaHero) {
        if (jasaHeroImage) handleDeleteImage(jasaHeroImage);
        setJasaHeroImage(publicUrl);
      }
      if (isJasaAbout) {
        if (jasaAboutImage) handleDeleteImage(jasaAboutImage);
        setJasaAboutImage(publicUrl);
      }
      if (isJasaBrandLogo) {
        if (jasaBrandLogo) handleDeleteImage(jasaBrandLogo);
        setJasaBrandLogo(publicUrl);
      }
      if (target && target.startsWith('v2_sec_')) {
        const secId = target.replace('v2_sec_', '');
        handleUpdateSectionContent(secId, { logo_url: publicUrl, image_url: publicUrl, image_source: 'upload', logo_source: 'upload' });
      }
      if (target && target.startsWith('v2_groom_')) {
        const secId = target.replace('v2_groom_', '');
        handleUpdateSectionContent(secId, { groom_photo: publicUrl, groom_image: publicUrl, groom_photo_source: 'upload' });
      }
      if (target && target.startsWith('v2_bride_')) {
        const secId = target.replace('v2_bride_', '');
        handleUpdateSectionContent(secId, { bride_photo: publicUrl, bride_image: publicUrl, bride_photo_source: 'upload' });
      }
      if (isProduct) {
        const oldProductImageUrl = tokoProducts[productIndex]?.image_url;
        if (oldProductImageUrl) handleDeleteImage(oldProductImageUrl);
        setTokoProducts(prev => {
          const next = [...prev];
          next[productIndex].image_url = publicUrl;
          return next;
        });
      }
      return publicUrl;
    } catch (err) {
      console.error('[Dashboard] File upload error:', err);
      setError('Gagal mengunggah foto: ' + err.message);
    } finally {
      if (isGroom) setIsUploadingGroomImage(false);
      if (isBride) setIsUploadingBrideImage(false);
      if (isStory) setIsUploadingStoryImage(false);
      if (isPrewedding) setIsUploadingPreweddingImage(false);
      if (isGallery) setIsUploadingGalleryImage(false);
      if (isCampaignHero) setIsUploadingCampaignHeroImage(false);
      if (isCelebrant) setIsUploadingCelebrantImage(false);
      if (isLogo) setIsUploadingLogo(false);
      if (isBanner) setIsUploadingBanner(false);
      if (isProduct) setIsUploadingProductIndex(null);
      if (isCv) setIsUploadingCvPhoto(false);
      if (isECourseHero) setIsUploadingECourseHeroImage(false);
      if (isECourseMentor) setIsUploadingECourseMentorAvatar(false);
      if (isJasaHero) setIsUploadingJasaHeroImage(false);
      if (isJasaAbout) setIsUploadingJasaAboutImage(false);
      if (isJasaBrandLogo) setIsUploadingJasaBrandLogo(false);
    }
  };

  const handleDeleteImage = (imageUrl) => {
    if (!imageUrl || imageUrl.includes('/defaults/')) return;
    setPendingDeleteImages(prev => {
      if (prev.includes(imageUrl)) return prev;
      return [...prev, imageUrl];
    });
  };

  const executeDeleteImage = async (imageUrl) => {
    if (!imageUrl || imageUrl.includes('/defaults/')) return;

    let path = '';
    try {
      const bucketMarker = '/wuzzkang-bucket/';
      const markerIdx = imageUrl.indexOf(bucketMarker);
      if (markerIdx === -1) {
        console.warn(`[Dashboard] Image URL is not stored in our Supabase bucket: ${imageUrl}`);
        return;
      }
      path = imageUrl.substring(markerIdx + bucketMarker.length);
      const queryIdx = path.indexOf('?');
      if (queryIdx !== -1) {
        path = path.substring(0, queryIdx);
      }
    } catch (parseErr) {
      console.error('[Dashboard] Error parsing image storage path:', parseErr);
      return;
    }

    if (!path) return;

    console.log(`[Dashboard] Requesting server deletion for path: "${path}"`);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionRef.current?.access_token}`,
        },
        body: JSON.stringify({ path }),
        keepalive: true
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        console.warn(`[Dashboard] Storage deletion failed: ${result.error || 'Unknown error'}`);
      } else {
        console.log(`[Dashboard] Successfully deleted from storage: ${path}`);
      }
    } catch (err) {
      console.error('[Dashboard] Error calling delete media API:', err);
    }
  };

  const cleanupOrphanedAssets = async (oldData, newData) => {
    if (!oldData) return;

    const extractUrls = (obj) => {
      const urls = new Set();
      const traverse = (val) => {
        if (!val) return;
        if (typeof val === 'string') {
          if (val.includes('/wuzzkang-bucket/') && !val.includes('/defaults/')) {
            urls.add(val);
          }
        } else if (Array.isArray(val)) {
          val.forEach(traverse);
        } else if (typeof val === 'object') {
          Object.values(val).forEach(traverse);
        }
      };
      traverse(obj);
      return urls;
    };

    try {
      const oldUrls = extractUrls(oldData);
      const newUrls = extractUrls(newData);

      const deletePromises = [];
      oldUrls.forEach(url => {
        if (!newUrls.has(url)) {
          console.log('[Cleanup] Replaced or removed asset detected. Deleting from storage:', url);
          deletePromises.push(executeDeleteImage(url));
        }
      });
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
      }
    } catch (err) {
      console.error('[Cleanup] Error processing orphaned assets:', err);
    }
  };

  const handleGenerateAIImage = async (target) => {
    const isGroom = target === 'groom';
    const isBride = target === 'bride';
    const isCelebrant = target === 'celebrant';

    const remainingFree = profile?.remainingFree ?? 0;
    const cost = profile?.ai_generate_cost ?? 1;

    if (remainingFree === 0) {
      const confirmCharge = window.confirm(
        `Jatah generate gratis harian Anda telah habis.\n\nGenerate berikutnya akan dikenakan biaya ${cost} Credit yang dipotong dari saldo dompet Anda.\n\nApakah Anda ingin melanjutkan?`
      );
      if (!confirmCharge) return;
    }

    let defaultPrompt = 'A cute 3D Pixar-style avatar, clean minimalist background, smiling';
    if (isGroom) {
      defaultPrompt = 'A cute 3D Pixar-style groom avatar, clean minimalist background, wedding theme, smiling, handsome';
    } else if (isBride) {
      defaultPrompt = 'A cute 3D Pixar-style bride avatar, clean minimalist background, wedding theme, smiling, beautiful';
    } else if (isCelebrant) {
      defaultPrompt = `A cute 3D Pixar-style ${celebrantGender === 'female' ? 'girl' : 'boy'} avatar celebrating birthday, holding balloons, colorful theme, smiling, happy`;
    }

    const userPrompt = window.prompt(`Masukkan deskripsi/prompt untuk avatar AI ${isGroom ? 'Pria' : isBride ? 'Wanita' : celebrantGender === 'female' ? 'Perempuan' : 'Laki-laki'}:`, defaultPrompt);
    if (userPrompt === null) return;
    if (!userPrompt.trim()) return;

    if (isGroom) setIsGeneratingGroomImage(true);
    if (isBride) setIsGeneratingBrideImage(true);
    if (isCelebrant) setIsGeneratingCelebrantImage(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          mode: 'generate_avatar',
          params: { prompt: userPrompt },
          projectId: projectId || undefined,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal mengirim tugas generate ke antrean.');
      }

      const jobId = result.jobId;
      let attempts = 0;
      let finalUrl = null;

      // Poll the job status endpoint every 5 seconds
      while (attempts < 60) {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const statusRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/status`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!statusRes.ok) {
          if (statusRes.status === 404) {
            throw new Error('Pekerjaan generate tidak ditemukan di antrean.');
          }
          throw new Error('Gagal memeriksa status pekerjaan generate gambar.');
        }

        const jobData = await statusRes.json();
        if (jobData.state === 'completed') {
          finalUrl = jobData.result?.url;
          break;
        } else if (jobData.state === 'failed') {
          throw new Error(jobData.failedReason || 'Gagal memproses gambar AI di antrean.');
        }
        attempts++;
      }

      if (!finalUrl) {
        throw new Error('Waktu tunggu pembuatan gambar AI habis (timeout).');
      }

      if (isGroom) setGroomImage(finalUrl);
      if (isBride) setBrideImage(finalUrl);
      if (isCelebrant) setCelebrantImage(finalUrl);
      await refreshProfile();
    } catch (err) {
      console.error('[Dashboard] AI avatar error, falling back to default:', err);
      if (isGroom) setGroomImage(DEFAULT_GROOM_AVATAR);
      if (isBride) setBrideImage(DEFAULT_BRIDE_AVATAR);
      if (isCelebrant) setCelebrantImage(celebrantGender === 'female' ? DEFAULT_BRIDE_AVATAR : DEFAULT_GROOM_AVATAR);

      alert(`Gagal men-generate foto AI: ${err.message || 'Error'}\n\nSistem otomatis menggunakan avatar default untuk Anda.`);
    } finally {
      if (isGroom) setIsGeneratingGroomImage(false);
      if (isBride) setIsGeneratingBrideImage(false);
      if (isCelebrant) setIsGeneratingCelebrantImage(false);
    }
  };

  const handleAIAssist = async (fieldType, index = null) => {
    if (!session?.access_token) return;
 
    const remainingFree = profile?.remainingFree ?? 0;
    const cost = profile?.ai_generate_cost ?? 1;
 
    if (remainingFree === 0) {
      const confirmCharge = window.confirm(
        `Jatah generate gratis harian Anda telah habis.\n\nGenerate berikutnya akan dikenakan biaya ${cost} Credit yang dipotong dari saldo dompet Anda.\n\nApakah Anda ingin melanjutkan?`
      );
      if (!confirmCharge) return;
    }
 
    // Determine context data
    const context = {
      storeName: storeName,
      storeTagline: storeTagline,
      storeDescription: storeDescription,
      profileName: cvName,
      profileTitle: cvTitle,
      profileSummary: cvSummary,
    };
    if (index !== null) {
      if (templateType === 'cv') {
        context.company = cvExperiences[index]?.company;
        context.position = cvExperiences[index]?.position;
        context.description = cvExperiences[index]?.description;
      } else {
        context.productName = tokoProducts[index].name;
        context.productPrice = tokoProducts[index].price;
      }
    }
 
    if (fieldType === 'store_tagline') setIsGeneratingStoreTagline(true);
    if (fieldType === 'store_description') setIsGeneratingStoreDesc(true);
    if (fieldType === 'store_quote') setIsGeneratingStoreQuote(true);
    if (fieldType === 'product_description') {
      setIsGeneratingProductDesc(prev => ({ ...prev, [index]: true }));
    }
    if (fieldType === 'cv_summary') setIsGeneratingCvSummary(true);
    if (fieldType === 'cv_experience_description') {
      setIsGeneratingCvExperienceDesc(prev => ({ ...prev, [index]: true }));
    }
 
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/field`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ fieldType, context, projectId: projectId || undefined }),
      });
 
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal mengirim tugas copywriting ke antrean.');
      }
 
      const jobId = result.jobId;
      let attempts = 0;
      let finalContent = null;
 
      // Poll the job status endpoint every 5 seconds
      while (attempts < 60) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
 
        const statusRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/status`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
 
        if (!statusRes.ok) {
          if (statusRes.status === 404) {
            throw new Error('Pekerjaan generate tidak ditemukan di antrean.');
          }
          throw new Error('Gagal memeriksa status pekerjaan copywriting.');
        }
 
        const jobData = await statusRes.json();
        if (jobData.state === 'completed') {
          finalContent = jobData.result?.content;
          break;
        } else if (jobData.state === 'failed') {
          throw new Error(jobData.failedReason || 'Gagal memproses copywriting AI di antrean.');
        }
        attempts++;
      }
 
      if (!finalContent) {
        throw new Error('Waktu tunggu pembuatan copywriting AI habis (timeout).');
      }
 
      if (fieldType === 'store_tagline') setStoreTagline(finalContent);
      if (fieldType === 'store_description') setStoreDescription(finalContent);
      if (fieldType === 'store_quote') setTokoQuote(finalContent);
      if (fieldType === 'product_description') {
        setTokoProducts(prev => {
          const next = [...prev];
          next[index].description = finalContent;
          return next;
        });
      }
      if (fieldType === 'cv_summary') setCvSummary(finalContent);
      if (fieldType === 'cv_experience_description') {
        setCvExperiences(prev => {
          const next = [...prev];
          next[index].description = finalContent;
          return next;
        });
      }
      await refreshProfile();
    } catch (err) {
      console.error('[Dashboard] Field assist failed:', err);
      alert('Terjadi kesalahan jaringan saat memanggil AI.');
    } finally {
      if (fieldType === 'store_tagline') setIsGeneratingStoreTagline(false);
      if (fieldType === 'store_description') setIsGeneratingStoreDesc(false);
      if (fieldType === 'store_quote') setIsGeneratingStoreQuote(false);
      if (fieldType === 'product_description') {
        setIsGeneratingProductDesc(prev => ({ ...prev, [index]: false }));
      }
      if (fieldType === 'cv_summary') setIsGeneratingCvSummary(false);
      if (fieldType === 'cv_experience_description') {
        setIsGeneratingCvExperienceDesc(prev => ({ ...prev, [index]: false }));
      }
    }
  };

  const handleAICampaignAssist = async (fieldType) => {
    if (!session?.access_token) return;

    if (!campaignBrief.trim()) {
      alert('Harap isi Brief Deskripsi Campaign terlebih dahulu di bagian atas sebagai acuan AI.');
      return;
    }

    const remainingFree = profile?.remainingFree ?? 0;
    const cost = profile?.ai_generate_cost ?? 1;

    if (remainingFree === 0) {
      const confirmCharge = window.confirm(
        `Jatah generate gratis harian Anda telah habis.\n\nGenerate berikutnya akan dikenakan biaya ${cost} Credit yang dipotong dari saldo dompet Anda.\n\nApakah Anda ingin melanjutkan?`
      );
      if (!confirmCharge) return;
    }

    if (fieldType === 'campaign_hero') setIsGeneratingCampaignHero(true);
    if (fieldType === 'campaign_problems') setIsGeneratingCampaignProblems(true);
    if (fieldType === 'campaign_benefits') setIsGeneratingCampaignBenefits(true);
    if (fieldType === 'campaign_testimonials') setIsGeneratingCampaignTestimonials(true);
    if (fieldType === 'campaign_urgency') setIsGeneratingCampaignUrgency(true);
    if (fieldType === 'campaign_faq') setIsGeneratingCampaignFaq(true);

    let context = {
      campaignName: name,
      campaignBrief: campaignBrief
    };

    if (fieldType === 'campaign_faq') {
      const filledFaqs = campaignFaqs.filter(faq => faq.question?.trim() && faq.answer?.trim());
      const totalSlots = campaignFaqs.length;
      let targetGenerateCount = 3;

      if (totalSlots > 1) {
        targetGenerateCount = totalSlots - filledFaqs.length;
      } else {
        targetGenerateCount = filledFaqs.length > 0 ? 0 : 3;
      }

      // If they clicked AI Generate but all slots are already filled, we regenerate all slots
      if (targetGenerateCount === 0 && totalSlots > 0) {
        targetGenerateCount = totalSlots;
        context.filledFaqs = [];
      } else {
        context.filledFaqs = filledFaqs;
      }
      context.faqCount = targetGenerateCount;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/field`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ fieldType, context, projectId: projectId || undefined }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal mengirim tugas copywriting ke antrean.');
      }

      const jobId = result.jobId;
      let attempts = 0;
      let finalContent = null;

      // Poll the job status endpoint every 5 seconds
      while (attempts < 60) {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const statusRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/status`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!statusRes.ok) {
          if (statusRes.status === 404) {
            throw new Error('Pekerjaan generate tidak ditemukan di antrean.');
          }
          throw new Error('Gagal memeriksa status pekerjaan copywriting.');
        }

        const jobData = await statusRes.json();
        if (jobData.state === 'completed') {
          finalContent = jobData.result?.content;
          break;
        } else if (jobData.state === 'failed') {
          throw new Error(jobData.failedReason || 'Gagal memproses copywriting AI di antrean.');
        }
        attempts++;
      }

      if (!finalContent) {
        throw new Error('Waktu tunggu pembuatan copywriting AI habis (timeout).');
      }

      if (fieldType === 'campaign_hero') {
        setCampaignHeadline(finalContent.headline || '');
        setCampaignSubheadline(finalContent.subheadline || '');
        if (finalContent.cta_text) setCampaignCtaText(finalContent.cta_text);
      }
      if (fieldType === 'campaign_problems') {
        setCampaignProblemsTitle(finalContent.title || 'Hambatan Utama Anda');
        setCampaignProblemsList(finalContent.list || ['', '', '']);
      }
      if (fieldType === 'campaign_benefits') {
        setCampaignSolutionsTitle(finalContent.title || 'Solusi Kami');
        setCampaignSolutionsIntro(finalContent.intro || '');
        setCampaignBenefits(finalContent.benefits || [{ title: '', desc: '' }, { title: '', desc: '' }, { title: '', desc: '' }]);
      }
      if (fieldType === 'campaign_testimonials') {
        setCampaignTestimonials(finalContent.testimonials || [{ name: '', role: '', content: '' }, { name: '', role: '', content: '' }]);
      }
      if (fieldType === 'campaign_urgency') {
        setCampaignUrgency(finalContent.urgency || '');
        if (finalContent.cta_text) setCampaignClosingCta(finalContent.cta_text);
      }
      if (fieldType === 'campaign_faq') {
        const generated = finalContent.faqs || [];
        const originalFaqs = [...campaignFaqs];
        let genIndex = 0;

        const mergedFaqs = originalFaqs.map(faq => {
          const isFilled = faq.question?.trim() && faq.answer?.trim();
          if (isFilled && context.filledFaqs && context.filledFaqs.length > 0) {
            return faq;
          } else {
            const replacement = generated[genIndex] || { question: '', answer: '' };
            genIndex++;
            return replacement;
          }
        });

        let finalFaqs = [...mergedFaqs];
        while (genIndex < generated.length && finalFaqs.length < 5) {
          finalFaqs.push(generated[genIndex]);
          genIndex++;
        }

        setCampaignFaqs(finalFaqs);
      }

      await refreshProfile();
    } catch (err) {
      console.error('[Dashboard] Campaign AI Assist error:', err);
      alert('Terjadi kesalahan jaringan saat memanggil AI.');
    } finally {
      if (fieldType === 'campaign_hero') setIsGeneratingCampaignHero(false);
      if (fieldType === 'campaign_problems') setIsGeneratingCampaignProblems(false);
      if (fieldType === 'campaign_benefits') setIsGeneratingCampaignBenefits(false);
      if (fieldType === 'campaign_testimonials') setIsGeneratingCampaignTestimonials(false);
      if (fieldType === 'campaign_urgency') setIsGeneratingCampaignUrgency(false);
      if (fieldType === 'campaign_faq') setIsGeneratingCampaignFaq(false);
    }
  };

  const handleAIECourseAssist = async (fieldType) => {
    if (!session?.access_token) return;

    if (!courseBrief.trim()) {
      alert('Harap isi Deskripsi Brief E-Course terlebih dahulu di bagian atas sebagai acuan AI.');
      return;
    }

    const remainingFree = profile?.remainingFree ?? 0;
    const cost = profile?.ai_generate_cost ?? 1;

    if (remainingFree === 0) {
      const confirmCharge = window.confirm(
        `Jatah generate gratis harian Anda telah habis.\n\nGenerate berikutnya akan dikenakan biaya ${cost} Credit yang dipotong dari saldo dompet Anda.\n\nApakah Anda ingin melanjutkan?`
      );
      if (!confirmCharge) return;
    }

    if (fieldType === 'e_course_hero') setIsGeneratingECourseHero(true);
    if (fieldType === 'e_course_problems') setIsGeneratingECourseProblems(true);
    if (fieldType === 'e_course_solutions') setIsGeneratingECourseSolutions(true);
    if (fieldType === 'e_course_audience') setIsGeneratingECourseAudience(true);
    if (fieldType === 'e_course_mentor') setIsGeneratingECourseMentor(true);
    if (fieldType === 'e_course_curriculum') setIsGeneratingECourseCurriculum(true);
    if (fieldType === 'e_course_benefits') setIsGeneratingECourseBenefits(true);
    if (fieldType === 'e_course_bonuses') setIsGeneratingECourseBonuses(true);
    if (fieldType === 'e_course_pricing') setIsGeneratingECoursePricing(true);
    if (fieldType === 'e_course_testimonials') setIsGeneratingECourseTestimonials(true);
    if (fieldType === 'e_course_faq') setIsGeneratingECourseFaq(true);

    let context = {
      courseName: name || courseName,
      courseBrief: courseBrief
    };

    if (fieldType === 'e_course_faq') {
      const filledFaqs = eCourseFaqs.filter(faq => faq.question?.trim() && faq.answer?.trim());
      const totalSlots = eCourseFaqs.length;
      let targetGenerateCount = 3;

      if (totalSlots > 1) {
        targetGenerateCount = totalSlots - filledFaqs.length;
      } else {
        targetGenerateCount = filledFaqs.length > 0 ? 0 : 3;
      }

      if (targetGenerateCount === 0 && totalSlots > 0) {
        targetGenerateCount = totalSlots;
        context.filledFaqs = [];
      } else {
        context.filledFaqs = filledFaqs;
      }
      context.faqCount = targetGenerateCount;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/field`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ fieldType, context, projectId: projectId || undefined }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal mengirim tugas copywriting ke antrean.');
      }

      const jobId = result.jobId;
      let attempts = 0;
      let finalContent = null;

      while (attempts < 60) {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const statusRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/status`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!statusRes.ok) {
          if (statusRes.status === 404) {
            throw new Error('Pekerjaan generate tidak ditemukan di antrean.');
          }
          throw new Error('Gagal memeriksa status pekerjaan copywriting.');
        }

        const jobData = await statusRes.json();
        if (jobData.state === 'completed') {
          finalContent = jobData.result?.content;
          break;
        } else if (jobData.state === 'failed') {
          throw new Error(jobData.failedReason || 'Gagal memproses copywriting AI di antrean.');
        }
        attempts++;
      }

      if (!finalContent) {
        throw new Error('Waktu tunggu pembuatan copywriting AI habis (timeout).');
      }

      if (fieldType === 'e_course_hero') {
        setECourseHeroHeadline(finalContent.headline || '');
        setECourseHeroSubheadline(finalContent.subheadline || '');
        if (finalContent.cta_text) setECourseHeroCtaText(finalContent.cta_text);
      }
      if (fieldType === 'e_course_problems') {
        setECourseProblemsTitle(finalContent.title || 'Hambatan Belajar Anda');
        setECourseProblemsList(finalContent.list || ['', '', '']);
      }
      if (fieldType === 'e_course_solutions') {
        setECourseSolutionsTitle(finalContent.title || 'Solusi Kelas Kami');
        setECourseSolutionsIntro(finalContent.intro || '');
        setECourseSolutionsList(finalContent.list || ['', '', '']);
      }
      if (fieldType === 'e_course_audience') {
        setECourseAudienceTitle(finalContent.title || 'Siapa Yang Wajib Ikut?');
        setECourseAudienceList(finalContent.list || ['', '', '']);
      }
      if (fieldType === 'e_course_mentor') {
        setECourseMentorName(finalContent.name || '');
        setECourseMentorRole(finalContent.role || '');
        setECourseMentorDesc(finalContent.desc || '');
      }
      if (fieldType === 'e_course_curriculum') {
        setECourseCurriculumTitle(finalContent.title || 'Kurikulum & Modul Belajar');
        setECourseCurriculumModules(finalContent.modules || [{ title: '', desc: '' }, { title: '', desc: '' }, { title: '', desc: '' }]);
      }
      if (fieldType === 'e_course_benefits') {
        setECourseBenefitsTitle(finalContent.title || 'Fasilitas & Keuntungan');
        setECourseBenefitsList(finalContent.list || [{ title: '', desc: '' }, { title: '', desc: '' }, { title: '', desc: '' }]);
      }
      if (fieldType === 'e_course_bonuses') {
        setECourseBonusesTitle(finalContent.title || 'Bonus Spesial');
        setECourseBonusesList(finalContent.list || [{ title: '', desc: '' }, { title: '', desc: '' }]);
      }
      if (fieldType === 'e_course_pricing') {
        setECoursePricingTitle(finalContent.title || 'Investasi Belajar Terbaik');
        setECoursePricingOriginal(finalContent.original_price || '');
        setECoursePricingDiscounted(finalContent.discounted_price || '');
        if (finalContent.cta_text) setECoursePricingCtaText(finalContent.cta_text);
        setECoursePricingFeatures(finalContent.features || ['', '', '']);
      }
      if (fieldType === 'e_course_testimonials') {
        setECourseTestimonialsTitle(finalContent.title || 'Ulasan Dari Alumni');
        setECourseTestimonialsList(finalContent.list || [{ name: '', role: '', content: '' }, { name: '', role: '', content: '' }]);
      }
      if (fieldType === 'e_course_faq') {
        const generated = finalContent.faqs || [];
        const originalFaqs = [...eCourseFaqs];
        let genIndex = 0;
        
        // Merge generated FAQ into original empty slots
        const mergedFaqs = originalFaqs.map(faq => {
          const isFilled = faq.question?.trim() && faq.answer?.trim();
          if (isFilled && context.filledFaqs && context.filledFaqs.length > 0) {
            return faq;
          }
          const next = generated[genIndex++];
          return next || faq;
        });

        let finalFaqs = [...mergedFaqs];
        while (genIndex < generated.length && finalFaqs.length < 5) {
          finalFaqs.push(generated[genIndex]);
          genIndex++;
        }
        setECourseFaqs(finalFaqs);
      }

      await refreshProfile();
    } catch (err) {
      console.error('[Dashboard] E-Course AI Assist error:', err);
      alert('Terjadi kesalahan jaringan saat memanggil AI.');
    } finally {
      if (fieldType === 'e_course_hero') setIsGeneratingECourseHero(false);
      if (fieldType === 'e_course_problems') setIsGeneratingECourseProblems(false);
      if (fieldType === 'e_course_solutions') setIsGeneratingECourseSolutions(false);
      if (fieldType === 'e_course_audience') setIsGeneratingECourseAudience(false);
      if (fieldType === 'e_course_mentor') setIsGeneratingECourseMentor(false);
      if (fieldType === 'e_course_curriculum') setIsGeneratingECourseCurriculum(false);
      if (fieldType === 'e_course_benefits') setIsGeneratingECourseBenefits(false);
      if (fieldType === 'e_course_bonuses') setIsGeneratingECourseBonuses(false);
      if (fieldType === 'e_course_pricing') setIsGeneratingECoursePricing(false);
      if (fieldType === 'e_course_testimonials') setIsGeneratingECourseTestimonials(false);
      if (fieldType === 'e_course_faq') setIsGeneratingECourseFaq(false);
    }
  };

  const handleAIJasaAssist = async (fieldType) => {
    if (!session?.access_token) return;

    if (!jasaBrandDesc.trim()) {
      alert('Harap isi Deskripsi Layanan (Brief AI) terlebih dahulu sebagai acuan AI.');
      return;
    }

    const remainingFree = profile?.remainingFree ?? 0;
    const cost = profile?.ai_generate_cost ?? 1;

    if (remainingFree === 0) {
      const confirmCharge = window.confirm(
        `Jatah generate gratis harian Anda telah habis.\n\nGenerate berikutnya akan dikenakan biaya ${cost} Credit yang dipotong dari saldo dompet Anda.\n\nApakah Anda ingin melanjutkan?`
      );
      if (!confirmCharge) return;
    }

    if (fieldType === 'jasa_tagline') setIsGeneratingJasaTagline(true);
    if (fieldType === 'jasa_hero') setIsGeneratingJasaHero(true);
    if (fieldType === 'jasa_how_it_works') setIsGeneratingJasaHowItWorks(true);
    if (fieldType === 'jasa_about') setIsGeneratingJasaAbout(true);
    if (fieldType === 'jasa_services') setIsGeneratingJasaServices(true);
    if (fieldType === 'jasa_why_us') setIsGeneratingJasaWhyUs(true);
    if (fieldType === 'jasa_deliverables') setIsGeneratingJasaDeliverables(true);
    if (fieldType === 'jasa_pricing') setIsGeneratingJasaPricing(true);
    if (fieldType === 'jasa_testimonials') setIsGeneratingJasaTestimonials(true);
    if (fieldType === 'jasa_faq') setIsGeneratingJasaFaq(true);

    const context = {
      brandName: jasaBrandName,
      brandDesc: jasaBrandDesc,
      brandTagline: jasaBrandTagline,
    };

    if (fieldType === 'jasa_faq') {
      const filledFaqs = jasaFaqs.filter(f => f.question?.trim() && f.answer?.trim());
      context.filledFaqs = filledFaqs;
      context.faqCount = jasaFaqs.length > 1 ? (jasaFaqs.length - filledFaqs.length) || jasaFaqs.length : 3;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/field`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ fieldType, context, projectId: projectId || undefined }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal mengirim tugas copywriting ke antrean.');
      }

      const jobId = result.jobId;
      let attempts = 0;
      let finalContent = null;

      while (attempts < 60) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const statusRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/status`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!statusRes.ok) throw new Error('Gagal memeriksa status pekerjaan copywriting.');
        const jobData = await statusRes.json();
        if (jobData.state === 'completed') { finalContent = jobData.result?.content; break; }
        else if (jobData.state === 'failed') throw new Error(jobData.failedReason || 'Gagal memproses copywriting AI.');
        attempts++;
      }

      if (!finalContent) throw new Error('Waktu tunggu AI habis (timeout).');

      if (fieldType === 'jasa_tagline') {
        setJasaBrandTagline(finalContent.tagline || '');
      }
      if (fieldType === 'jasa_hero') {
        setJasaHeroHeadline(finalContent.headline || '');
        setJasaHeroSubheadline(finalContent.subheadline || '');
        if (finalContent.cta_text) setJasaHeroCtaText(finalContent.cta_text);
      }
      if (fieldType === 'jasa_how_it_works') {
        setJasaHowItWorksTitle(finalContent.title || 'Cara Kerja Kami');
        setJasaHowItWorksSteps(finalContent.steps || []);
      }
      if (fieldType === 'jasa_about') {
        setJasaAboutTitle(finalContent.title || 'Tentang Kami');
        setJasaAboutDesc(finalContent.desc || '');
      }
      if (fieldType === 'jasa_services') {
        setJasaServicesTitle(finalContent.title || 'Layanan Kami');
        setJasaServicesList(finalContent.list || []);
      }
      if (fieldType === 'jasa_why_us') {
        setJasaWhyUsTitle(finalContent.title || 'Mengapa Memilih Kami?');
        setJasaWhyUsPoints(finalContent.points || []);
      }
      if (fieldType === 'jasa_deliverables') {
        setJasaDeliverablesTitle(finalContent.title || 'Apa yang Anda Dapatkan');
        setJasaDeliverablesList(finalContent.list || []);
      }
      if (fieldType === 'jasa_pricing') {
        setJasaPricingTitle(finalContent.title || 'Pilih Paket Terbaik Anda');
        setJasaPricingPlans(finalContent.plans || []);
      }
      if (fieldType === 'jasa_testimonials') {
        setJasaTestimonialsTitle(finalContent.title || 'Kata Klien Kami');
        setJasaTestimonialsList(finalContent.list || []);
      }
      if (fieldType === 'jasa_faq') {
        const generated = finalContent.faqs || [];
        const originalFaqs = [...jasaFaqs];
        let genIndex = 0;
        
        // Merge generated FAQ into original empty slots
        const mergedFaqs = originalFaqs.map(faq => {
          const isFilled = faq.question?.trim() && faq.answer?.trim();
          if (isFilled && context.filledFaqs && context.filledFaqs.length > 0) {
            return faq;
          }
          const next = generated[genIndex++];
          return next || faq;
        });

        let finalFaqs = [...mergedFaqs];
        while (genIndex < generated.length && finalFaqs.length < 5) {
          finalFaqs.push(generated[genIndex]);
          genIndex++;
        }
        setJasaFaqs(finalFaqs);
      }

      await refreshProfile();
    } catch (err) {
      console.error('[Dashboard] Jasa AI Assist error:', err);
      alert('Terjadi kesalahan jaringan saat memanggil AI.');
    } finally {
      if (fieldType === 'jasa_tagline') setIsGeneratingJasaTagline(false);
      if (fieldType === 'jasa_hero') setIsGeneratingJasaHero(false);
      if (fieldType === 'jasa_how_it_works') setIsGeneratingJasaHowItWorks(false);
      if (fieldType === 'jasa_about') setIsGeneratingJasaAbout(false);
      if (fieldType === 'jasa_services') setIsGeneratingJasaServices(false);
      if (fieldType === 'jasa_why_us') setIsGeneratingJasaWhyUs(false);
      if (fieldType === 'jasa_deliverables') setIsGeneratingJasaDeliverables(false);
      if (fieldType === 'jasa_pricing') setIsGeneratingJasaPricing(false);
      if (fieldType === 'jasa_testimonials') setIsGeneratingJasaTestimonials(false);
      if (fieldType === 'jasa_faq') setIsGeneratingJasaFaq(false);
    }
  };

  const renderAIJasaButton = (fieldType, isLoading) => {
    const remainingFree = profile?.remainingFree ?? 15;
    const cost = profile?.ai_generate_cost ?? 1;
    const isFree = remainingFree > 0;
    return (
      <button
        type="button"
        disabled={isLoading || (!jasaBrandDesc.trim() && !jasaBrandName.trim())}
        onClick={() => handleAIJasaAssist(fieldType)}
        className="text-[9px] font-bold text-theme-accent disabled:opacity-40 hover:underline flex items-center gap-0.5 active:scale-95 transition-transform cursor-pointer"
      >
        {isLoading ? 'Generating...' : `✨ AI Generate (${isFree ? `Gratis: ${remainingFree}` : `${cost} Credit`})`}
      </button>
    );
  };

  const renderAITokoButton = (fieldType, isLoading, index = null) => {
    const remainingFree = profile?.remainingFree ?? 15;
    const cost = profile?.ai_generate_cost ?? 100;
    const isFree = remainingFree > 0;

    let isDisabled = isLoading;
    if (fieldType === 'store_tagline') {
      isDisabled = isDisabled || !storeName;
    } else if (fieldType === 'store_description' || fieldType === 'store_quote') {
      isDisabled = isDisabled || !storeName || !storeTagline;
    } else if (fieldType === 'product_description') {
      isDisabled = isDisabled || !storeName || !tokoProducts[index]?.name;
    }

    return (
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => handleAIAssist(fieldType, index)}
        className="text-[9px] font-bold text-theme-accent disabled:opacity-40 hover:underline flex items-center gap-0.5 active:scale-95 transition-transform cursor-pointer"
      >
        {isLoading ? 'Generating...' : `✨ AI Generate (${isFree ? `Gratis: ${remainingFree}` : `${cost} Credit`})`}
      </button>
    );
  };

  const renderAIAvatarButton = (target, isLoading) => {
    const remainingFree = profile?.remainingFree ?? 15;
    const cost = profile?.ai_generate_cost ?? 1;
    const isFree = remainingFree > 0;

    return (
      <button
        type="button"
        onClick={() => handleGenerateAIImage(target)}
        disabled={isLoading}
        className="flex-1 bg-theme-accent/90 hover:bg-theme-accent text-theme-accent-text text-[9px] font-bold py-1 px-2 rounded transition-colors active:scale-95 cursor-pointer"
      >
        {isLoading ? 'Generating...' : `AI Avatar (${isFree ? `Gratis: ${remainingFree}` : `${cost} Credit`})`}
      </button>
    );
  };

  const renderAICampaignButton = (fieldType, isLoading) => {
    const remainingFree = profile?.remainingFree ?? 15;
    const cost = profile?.ai_generate_cost ?? 1;
    const isFree = remainingFree > 0;

    return (
      <button
        type="button"
        disabled={isLoading || !campaignBrief.trim()}
        onClick={() => handleAICampaignAssist(fieldType)}
        className="text-[9px] font-bold text-theme-accent disabled:opacity-40 hover:underline flex items-center gap-0.5 active:scale-95 transition-transform cursor-pointer"
      >
        {isLoading ? 'Generating...' : `✨ AI Generate (${isFree ? `Gratis: ${remainingFree}` : `${cost} Credit`})`}
      </button>
    );
  };

  const renderAIECourseButton = (fieldType, isLoading) => {
    const remainingFree = profile?.remainingFree ?? 15;
    const cost = profile?.ai_generate_cost ?? 1;
    const isFree = remainingFree > 0;

    return (
      <button
        type="button"
        disabled={isLoading || !courseBrief.trim()}
        onClick={() => handleAIECourseAssist(fieldType)}
        className="text-[9px] font-bold text-theme-accent disabled:opacity-40 hover:underline flex items-center gap-0.5 active:scale-95 transition-transform cursor-pointer"
      >
        {isLoading ? 'Generating...' : `✨ AI Generate (${isFree ? `Gratis: ${remainingFree}` : `${cost} Credit`})`}
      </button>
    );
  };

  const renderAICVButton = (fieldType, isLoading, index = null) => {
    const remainingFree = profile?.remainingFree ?? 15;
    const cost = profile?.ai_generate_cost ?? 100;
    const isFree = remainingFree > 0;

    let isDisabled = isLoading;
    if (fieldType === 'cv_summary') {
      isDisabled = isDisabled || !cvName || !cvTitle;
    } else if (fieldType === 'cv_experience_description') {
      isDisabled = isDisabled || !cvExperiences[index]?.company || !cvExperiences[index]?.position;
    }

    return (
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => handleAIAssist(fieldType, index)}
        className="text-[9px] font-bold text-theme-accent disabled:opacity-40 hover:underline flex items-center gap-0.5 active:scale-95 transition-transform cursor-pointer"
      >
        {isLoading ? 'Generating...' : `✨ AI Generate (${isFree ? `Gratis: ${remainingFree}` : `${cost} Credit`})`}
      </button>
    );
  };

  const renderAIV2Button = (sectionId, sectionType) => {
    const remainingFree = profile?.remainingFree ?? 15;
    const cost = profile?.ai_generate_cost ?? 1;
    const isFree = remainingFree > 0;
    const isLoading = isGeneratingV2Section === sectionId;
    const hasBrief = !!v2BrandName.trim() || !!v2BrandBrief.trim();

    return (
      <button
        type="button"
        disabled={isLoading || !hasBrief}
        onClick={() => handleAISectionAssist(sectionId, sectionType)}
        className="text-[9px] font-bold text-theme-accent disabled:opacity-40 hover:underline flex items-center gap-0.5 active:scale-95 transition-transform cursor-pointer"
        title={!hasBrief ? 'Isi Nama Brand atau Brief AI terlebih dahulu' : 'Generate konten otomatis dengan AI'}
      >
        {isLoading ? 'Generating...' : `✨ AI Generate (${isFree ? `Gratis: ${remainingFree}` : `${cost} Credit`})`}
      </button>
    );
  };

  const renderSectionStylePicker = (section) => {
    const currentShade = section.content.bg_shade || 'solid';
    const currentBrightness = section.content.bg_brightness || 'default';
    const currentTransition = section.content.transition || 'none';

    const shades = [
      { key: 'solid', label: 'Pekat Solid', icon: '⬛' },
      { key: 'soft', label: 'Surface Soft', icon: '🌗' },
      { key: 'gradient', label: 'Degradasi', icon: '🌌' },
      { key: 'pattern', label: 'Grid Texture', icon: '🏁' }
    ];

    const brightnesses = [
      { key: 'default', label: 'Ikuti Tema Global', icon: '⚙️' },
      { key: 'light', label: 'Terang (Putih)', icon: '☀️' },
      { key: 'dark', label: 'Gelap (Hitam)', icon: '🌙' }
    ];

    const transitions = [
      { key: 'none', label: 'Datar Lurus', icon: '➖' },
      { key: 'gradient', label: 'Gradasi Soft', icon: '🌌' },
      { key: 'wave', label: 'Gelombang Wave', icon: '🌊' },
      { key: 'curve', label: 'Lengkung Soft', icon: '🌙' },
      { key: 'slant', label: 'Potongan Miring', icon: '📐' },
      { key: 'glow', label: 'Glow Ambient', icon: '✨' }
    ];

    const selectedShadeLabel = shades.find(s => s.key === currentShade)?.label || 'Pekat Solid';

    return (
      <div className="p-3.5 bg-theme-surface/60 backdrop-blur-md border border-theme-border/80 rounded-2xl space-y-3 mb-4 shadow-sm">
        {/* Header Badge & Live Indicator */}
        <div className="flex items-center justify-between pb-2 border-b border-theme-border/50">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-theme-accent bg-theme-accent/10 px-2 py-0.5 rounded-md border border-theme-accent/20">
              🎨 Tampilan Section
            </span>
          </div>
          <span className="text-[9px] font-semibold text-theme-text-muted truncate max-w-[170px]">
            {selectedShadeLabel}
          </span>
        </div>

        {/* 1. Variasi Shading (Segmented Control Bar) */}
        <div className="space-y-1.5">
          <label className="block text-[8px] font-bold text-theme-text-muted uppercase tracking-wider">
            Variasi Shading Background:
          </label>
          <div className="flex bg-theme-bg/80 p-1 rounded-xl border border-theme-border/60 gap-1">
            {shades.map((shade) => {
              const isSelected = currentShade === shade.key;
              return (
                <button
                  key={shade.key}
                  type="button"
                  onClick={() => handleUpdateSectionContent(section.id, { bg_shade: shade.key })}
                  className={`flex-1 py-1 px-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-theme-accent text-theme-accent-text shadow-xs'
                      : 'text-theme-text-muted hover:text-theme-text'
                  }`}
                >
                  <span className="text-[10px] leading-none">{shade.icon}</span>
                  <span className="hidden sm:inline text-[8px] truncate">{shade.label}</span>
                  <span className="inline sm:hidden text-[8px] truncate">{shade.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Varian Background Brightness / Mode Kontras */}
        <div className="space-y-1.5 pt-2 border-t border-theme-border/40">
          <label className="block text-[8px] font-bold text-theme-text-muted uppercase tracking-wider">
            Mode Kontras Warna:
          </label>
          <div className="flex bg-theme-bg/80 p-1 rounded-xl border border-theme-border/60 gap-1">
            {brightnesses.map((brightness) => {
              const isSelected = currentBrightness === brightness.key;
              return (
                <button
                  key={brightness.key}
                  type="button"
                  onClick={() => handleUpdateSectionContent(section.id, { bg_brightness: brightness.key })}
                  className={`flex-1 py-1 px-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-theme-accent text-theme-accent-text shadow-xs'
                      : 'text-theme-text-muted hover:text-theme-text'
                  }`}
                >
                  <span className="text-[10px] leading-none">{brightness.icon}</span>
                  <span className="text-[8px] truncate">{brightness.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Transisi Batas Section (Soft Divider) */}
        <div className="space-y-1.5 pt-2 border-t border-theme-border/40">
          <label className="block text-[8px] font-bold text-theme-text-muted uppercase tracking-wider">
            Transisi Batas Section (Soft Divider):
          </label>
          <div className="grid grid-cols-3 gap-1">
            {transitions.map((trans) => {
              const isSelected = currentTransition === trans.key;
              return (
                <button
                  key={trans.key}
                  type="button"
                  onClick={() => handleUpdateSectionContent(section.id, { transition: trans.key })}
                  className={`py-1.5 px-1.5 rounded-xl text-[9px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                    isSelected
                      ? 'bg-theme-accent text-theme-accent-text border-theme-accent shadow-xs'
                      : 'bg-theme-bg/60 border-theme-border/60 text-theme-text-muted hover:text-theme-text hover:bg-theme-bg'
                  }`}
                >
                  <span className="text-[10px] leading-none">{trans.icon}</span>
                  <span className="text-[8px] truncate">{trans.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };



  // Helper untuk memetakan technical_status ke teks bahasa Indonesia yang ramah
  const getFriendlyProgressMessage = (status, techStatus) => {
    if (status === 'queued') return 'Menunggu dalam antrean AI...';
    switch (techStatus) {
      case 'uploading_assets': return 'Mengunduh dan menyiapkan foto mempelai...';
      case 'building_prompt': return 'Menyusun naskah undangan peradaban...';
      case 'calling_provider': return 'Menganalisis konten menggunakan model kecerdasan buatan...';
      case 'saving_result': return 'Menyimpan konfigurasi undangan digital Anda...';
      case 'retrying': return 'Mengulangi pemrosesan (jaringan sibuk)...';
      default: return 'Sedang memproses konsep kreatif...';
    }
  };

  // Polling status tugas AI asinkron
  const pollTaskStatus = (taskId) => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/ai/task/${taskId}`, {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          if (!response.ok) {
            clearInterval(interval);
            return reject(new Error('Gagal memeriksa status tugas AI.'));
          }

          const result = await response.json();
          if (result.success && result.data) {
            const task = result.data;
            setAiProgressStatus(task.status);
            setAiProgressDetail(getFriendlyProgressMessage(task.status, task.technical_status));

            if (task.status === 'completed') {
              clearInterval(interval);
              resolve(task.resultUrl);  // API returns camelCase 'resultUrl'
            } else if (task.status === 'failed') {
              clearInterval(interval);
              reject(new Error(task.errorMessage || 'Pemrosesan AI gagal secara internal.'));  // API returns camelCase 'errorMessage'
            }
          }
        } catch (err) {
          clearInterval(interval);
          reject(err);
        }
      }, 3000); // Poll every 3 seconds
    });
  };

  // Helper to get random prewedding photo from Unsplash
  const handleGeneratePreweddingOnly = async () => {
    console.log('[AI Platform] handleGeneratePreweddingOnly triggered.');
    
    setError('');
    setIsGeneratingPrewedding(true);

    try {
      console.log('[AI Platform] Sending API request to fetch random Unsplash photo...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/prewedding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({}),
      });

      const result = await response.json();
      console.log('[AI Platform] Random photo response received:', result);
      
      if (response.ok && result.success) {
        setPreweddingPhotoUrl(result.preweddingPhotoUrl);
        console.log(`[AI Platform] Prewedding photo fetched successfully: ${result.preweddingPhotoUrl}`);
      } else {
        const errMsg = result.error || 'Gagal mengambil foto dari Unsplash. Silakan coba kembali.';
        setError(errMsg);
        alert(errMsg);
      }
    } catch (err) {
      console.error('[AI Platform] Local prewedding fetch error:', err);
      const errMsg = 'Terjadi kesalahan jaringan saat mengambil foto background.';
      setError(errMsg);
      alert(errMsg);
    } finally {
      setIsGeneratingPrewedding(false);
    }
  };

  // Helper to get random campaign hero background photo from Unsplash
  const handleGenerateCampaignHeroOnly = async () => {
    console.log('[AI Platform] handleGenerateCampaignHeroOnly triggered.');
    
    setError('');
    setIsGeneratingCampaignHeroImage(true);

    try {
      console.log('[AI Platform] Sending API request to fetch random Unsplash photo for campaign...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/prewedding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          query: 'business,workspace,marketing,success'
        }),
      });

      const result = await response.json();
      console.log('[AI Platform] Random campaign photo response received:', result);
      
      if (response.ok && result.success) {
        setCampaignHeroImage(result.preweddingPhotoUrl);
        console.log(`[AI Platform] Campaign hero photo fetched successfully: ${result.preweddingPhotoUrl}`);
      } else {
        const errMsg = result.error || 'Gagal mengambil foto dari Unsplash. Silakan coba kembali.';
        setError(errMsg);
        alert(errMsg);
      }
    } catch (err) {
      console.error('[AI Platform] Local campaign hero fetch error:', err);
      const errMsg = 'Terjadi kesalahan jaringan saat mengambil foto background.';
      setError(errMsg);
      alert(errMsg);
    } finally {
      setIsGeneratingCampaignHeroImage(false);
    }
  };

  // Handle generating preview from prompt
  const handleGenerate = async (e) => {
    e.preventDefault();
    
    const validationErrors = getFormValidationErrors();
    if (validationErrors.length > 0) {
      setError(`Silakan lengkapi bidang wajib berikut: ${validationErrors.join(', ')}`);
      // Scroll to the error box or form top
      const formElement = document.getElementById('generate-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    setError('');
    setIsGenerating(true);
    setPageData(null);
    setAiProgressStatus('');
    setAiProgressDetail('');

    try {
      let activePreweddingPhotoUrl = preweddingPhotoUrl;
      let activeCampaignHeroImage = campaignHeroImage;
      let activeStoreBannerUrl = storeBannerUrl;

      if (templateType === 'wedding' && generatePrewedding && preweddingSource === 'unsplash' && !activePreweddingPhotoUrl) {
        setAiProgressStatus('queued');
        setAiProgressDetail('Sedang mengambil foto background dari Unsplash...');
        try {
          const preResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/prewedding`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({}),
          });
          const preResult = await preResponse.json();
          if (preResponse.ok && preResult.success) {
            activePreweddingPhotoUrl = preResult.preweddingPhotoUrl;
            setPreweddingPhotoUrl(activePreweddingPhotoUrl);
            console.log(`[AI Platform] Prewedding photo fetched successfully from Unsplash: ${activePreweddingPhotoUrl}`);
          } else {
            console.warn('[AI Platform] Prewedding photo Unsplash fetch returned error:', preResult.error);
          }
        } catch (err) {
          console.error('[AI Platform] Prewedding photo Unsplash fetch API error:', err);
        }
      }

      if (templateType === 'campaign' && generateCampaignHero && campaignHeroImageSource === 'unsplash' && !activeCampaignHeroImage) {
        setAiProgressStatus('queued');
        setAiProgressDetail('Sedang mengambil foto background campaign dari Unsplash...');
        try {
          const preResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/prewedding`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              query: 'business,workspace,marketing,success'
            }),
          });
          const preResult = await preResponse.json();
          if (preResponse.ok && preResult.success) {
            activeCampaignHeroImage = preResult.preweddingPhotoUrl;
            setCampaignHeroImage(activeCampaignHeroImage);
            console.log(`[AI Platform] Campaign hero photo fetched successfully from Unsplash: ${activeCampaignHeroImage}`);
          } else {
            console.warn('[AI Platform] Campaign hero photo Unsplash fetch returned error:', preResult.error);
          }
        } catch (err) {
          console.error('[AI Platform] Campaign hero photo Unsplash fetch API error:', err);
        }
      } else if (templateType === 'campaign' && !generateCampaignHero) {
        // User did not check "Gunakan Foto Background", clear the image
        activeCampaignHeroImage = null;
      }

      if (templateType === 'toko-online' && generateStoreBanner && storeBannerSource === 'unsplash' && !activeStoreBannerUrl) {
        setAiProgressStatus('queued');
        setAiProgressDetail('Sedang mengambil foto background toko dari Unsplash...');
        try {
          const preResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/prewedding`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              query: 'shopping,store,commercial,product'
            }),
          });
          const preResult = await preResponse.json();
          if (preResponse.ok && preResult.success) {
            activeStoreBannerUrl = preResult.preweddingPhotoUrl;
            setStoreBannerUrl(activeStoreBannerUrl);
            console.log(`[AI Platform] Store banner photo fetched successfully from Unsplash: ${activeStoreBannerUrl}`);
          } else {
            console.warn('[AI Platform] Store banner photo Unsplash fetch returned error:', preResult.error);
          }
        } catch (err) {
          console.error('[AI Platform] Store banner photo Unsplash fetch API error:', err);
        }
      } else if (templateType === 'toko-online' && !generateStoreBanner) {
        // User did not check the banner option, clear the image
        activeStoreBannerUrl = null;
      }

      if (true) {
        // --- DIRECT DRAFT SAVE FOR ALL TEMPLATE TYPES ---
        setIsGenerating(true);
        let compiledPageData;

        if (templateType === 'cv') {
          compiledPageData = {
            meta: {
              title: cvName ? `CV — ${cvName}` : 'Curriculum Vitae',
              theme: designKey || 'professional-dark',
              template_type: 'cv',
              design_key: designKey || 'professional-dark',
              template_version: designVersion,
              hide_footer: hideFooter
            },
            content: {
              profile: {
                name: cvName,
                title: cvTitle,
                summary: cvSummary,
                photo_url: cvPhotoUrl || null,
                email: cvEmail,
                phone: cvPhone,
                location: cvLocation,
                linkedin_url: cvLinkedin || null,
                github_url: cvGithub || null,
                portfolio_url: cvPortfolio || null,
              },
              experiences: cvExperiences.filter(e => e.company && e.position && e.period),
              educations: cvEducations.filter(e => e.institution && e.degree && e.period),
              skills: cvSkills,
              languages: cvLanguages.filter(l => l.language && l.level),
              certifications: cvCertifications.filter(c => c.name && c.issuer && c.year),
            }
          };
        } else if (templateType === 'jasa') {
          compiledPageData = {
            meta: {
              title: name || 'Layanan Jasa Profesional',
              theme: designKey || 'professional-navy',
              template_type: 'jasa',
              design_key: designKey || 'professional-navy',
              template_version: designVersion,
            },
            content: {
              brand: {
                name: jasaBrandName,
                tagline: jasaBrandTagline,
                description: jasaBrandDesc || null,
                logo_url: jasaBrandLogo || null,
                cta_text: jasaBrandCtaText || null,
                cta_url: jasaBrandCtaUrl || null,
              },
              hero: {
                headline: jasaHeroHeadline,
                subheadline: jasaHeroSubheadline,
                cta_text: jasaHeroCtaText,
                cta_secondary_text: jasaHeroCtaSecondaryText || null,
                image_url: generateJasaHeroImage ? (jasaHeroImage || null) : null
              },
              social_proof: {
                client_count: jasaSocialClientCount || null,
                project_count: jasaSocialProjectCount || null,
                product_count: jasaSocialProductCount || null,
                label_clients: jasaSocialLabelClients || null,
                label_projects: jasaSocialLabelProjects || null,
                label_products: jasaSocialLabelProducts || null,
              },
              how_it_works: {
                title: jasaHowItWorksTitle || 'Cara Kerja Kami',
                steps: jasaHowItWorksSteps.filter(s => s.title && s.desc)
              },
              about: {
                title: jasaAboutTitle || 'Tentang Kami',
                desc: jasaAboutDesc,
                image_url: generateJasaAboutImage ? (jasaAboutImage || null) : null,
                cta_portfolio_text: jasaAboutCtaPortfolioText || null,
                cta_order_text: jasaAboutCtaOrderText || null,
              },
              services: {
                title: jasaServicesTitle || 'Layanan Kami',
                list: jasaServicesList.filter(s => s.name && s.desc).map(s => ({
                  name: s.name,
                  desc: s.desc,
                  features: Array.isArray(s.features) ? s.features.filter(Boolean) : [],
                  image_url: s.image_url || null
                }))
              },
              why_us: {
                title: jasaWhyUsTitle || 'Mengapa Memilih Kami?',
                points: jasaWhyUsPoints.filter(p => p.title && p.desc)
              },
              deliverables: {
                title: jasaDeliverablesTitle || 'Apa yang Anda Dapatkan',
                list: jasaDeliverablesList.filter(d => d.title && d.desc)
              },
              pricing: {
                title: jasaPricingTitle || 'Pilih Paket Terbaik Anda',
                subtitle: jasaPricingSubtitle || 'Harga transparan tanpa biaya tersembunyi',
                cta_only: !!jasaPricingCtaOnly,
                cta_text: jasaPricingCtaText || 'Konsultasi Sekarang',
                plans: jasaPricingCtaOnly ? [] : jasaPricingPlans.filter(p => p.name).map(p => ({
                  name: p.name,
                  badge: p.badge || null,
                  original_price: p.original_price || null,
                  sale_price: p.sale_price || null,
                  cta_text: p.cta_text || null,
                  features: Array.isArray(p.features) ? p.features.filter(Boolean) : [],
                  highlighted: !!p.highlighted
                }))
              },
              guarantee: {
                title: jasaGuaranteeTitle || 'Garansi Kepuasan 100%',
                desc: jasaGuaranteeDesc,
              },
              testimonials: {
                title: jasaTestimonialsTitle || 'Kata Klien Kami',
                list: jasaTestimonialsList.filter(t => t.name && t.content).map(t => ({
                  name: t.name,
                  role: t.role || null,
                  content: t.content,
                  avatar_url: t.avatar_url || null
                }))
              },
              faqs: jasaFaqs.filter(f => f.question && f.answer),
              contact: {
                whatsapp: jasaWhatsapp,
                email: jasaEmail || null,
                address: jasaAddress || null,
                cta_url: jasaCtaUrl || null,
                copyright: jasaCopyright || null
              },
              closing_cta: {
                title: jasaClosingTitle || null,
                cta_text: jasaClosingCtaText || null
              }
            }
          };
        } else if (templateType === 'e-course') {
          compiledPageData = {
            meta: {
              title: name || 'E-Course Halaman',
              theme: designKey,
              template_type: 'e-course',
              design_key: designKey,
              template_version: designVersion,
            },
            content: {
              courseName: courseName,
              courseBrief: courseBrief,
              courseTargetAudience: courseTargetAudience || null,
              courseTone: courseTone || null,
              hero: {
                headline: eCourseHeroHeadline,
                subheadline: eCourseHeroSubheadline,
                cta_text: eCourseHeroCtaText,
                image_url: generateECourseHeroImage ? (eCourseHeroImage || null) : null
              },
              problems: {
                title: eCourseProblemsTitle,
                list: eCourseProblemsList.filter(Boolean)
              },
              solutions: {
                title: eCourseSolutionsTitle,
                intro: eCourseSolutionsIntro,
                list: eCourseSolutionsList.filter(Boolean)
              },
              audience: {
                title: eCourseAudienceTitle,
                list: eCourseAudienceList.filter(Boolean)
              },
              mentor: {
                name: eCourseMentorName,
                role: eCourseMentorRole,
                desc: eCourseMentorDesc,
                avatar_url: generateECourseMentorImage ? (eCourseMentorAvatar || null) : null
              },
              curriculum: {
                title: eCourseCurriculumTitle,
                modules: eCourseCurriculumModules.filter(m => m.title && m.desc)
              },
              benefits: {
                title: eCourseBenefitsTitle,
                list: eCourseBenefitsList.filter(b => b.title && b.desc)
              },
              bonuses: {
                title: eCourseBonusesTitle,
                list: eCourseBonusesList.filter(b => b.title && b.desc)
              },
              pricing: {
                title: eCoursePricingTitle,
                original_price: eCoursePricingOriginal,
                discounted_price: eCoursePricingDiscounted,
                cta_text: eCoursePricingCtaText,
                features: eCoursePricingFeatures.filter(Boolean)
              },
              testimonials: {
                title: eCourseTestimonialsTitle,
                list: eCourseTestimonialsList.filter(t => t.name && t.content)
              },
              faqs: eCourseFaqs.filter(f => f.question && f.answer),
              contact: {
                whatsapp: eCourseWhatsapp,
                cta_url: eCourseCtaUrl || null,
                copyright: eCourseCopyright || null
              },
              brand_name: eCourseBrandName || 'E-COURSE ACADEMY',
              countdown: {
                enabled: eCourseCountdownEnabled,
                title: eCourseCountdownTitle || 'Sisa Waktu Promo Hari Ini:',
                type: eCourseCountdownType,
                target_date: eCourseCountdownType === 'fixed' && eCourseCountdownTargetDate ? new Date(eCourseCountdownTargetDate).toISOString() : null
              }
            }
          };
        } else if (templateType === 'toko-online') {
          compiledPageData = {
            meta: {
              title: storeName || 'Toko Online',
              theme: designKey,
              template_type: 'toko-online',
              design_key: designKey,
              template_version: designVersion,
            },
            content: {
              design_key: designKey,
              store: {
                name: storeName,
                tagline: storeTagline,
                description: storeDescription || null,
                logo_url: storeLogoUrl || null,
                banner_url: generateStoreBanner ? (activeStoreBannerUrl || null) : null
              },
              products: tokoProducts.map(p => ({
                name: p.name,
                price: p.price,
                description: p.description || null,
                image_url: p.image_url || null
              })),
              contact: {
                whatsapp: tokoWhatsapp,
                instagram: tokoInstagram || null,
                shopee_url: tokoShopee || null,
                tokopedia_url: tokoTokopedia || null,
                address: tokoAddress || null
              },
              quote: tokoQuote || null
            }
          };
        } else if (templateType === 'campaign') {
          compiledPageData = {
            meta: {
              title: name || 'Campaign Halaman',
              theme: designKey,
              template_type: 'campaign',
              design_key: designKey,
              template_version: designVersion,
            },
            content: {
              design_key: designKey,
              brief: campaignBrief || null,
              hero: {
                headline: campaignHeadline,
                subheadline: campaignSubheadline,
                cta_text: campaignCtaText,
                image_url: generateCampaignHero ? (activeCampaignHeroImage || null) : null
              },
              problems: {
                title: campaignProblemsTitle,
                list: campaignProblemsList.filter(Boolean)
              },
              solutions: {
                title: campaignSolutionsTitle,
                intro: campaignSolutionsIntro,
                benefits: campaignBenefits
              },
              social_proof: {
                testimonials: campaignTestimonials,
                guarantee: campaignGuarantee || null
              },
              closing: {
                urgency: campaignUrgency,
                cta_text: campaignClosingCta
              },
              contact: {
                whatsapp: campaignWhatsapp || '',
                cta_url: campaignCtaUrl || null
              },
              faqs: campaignFaqs.filter(f => f.question && f.answer)
            }
          };
        } else if (templateType === 'wedding') {
          compiledPageData = {
            meta: {
              title: `Undangan Pernikahan ${groomNickname || 'Groom'} & ${brideNickname || 'Bride'}`,
              theme: designKey,
              template_type: 'wedding',
              design_key: designKey,
              template_version: designVersion,
            },
            content: {
              design_key: designKey,
              groom: { name: groomName, nickname: groomNickname, father: groomFather, mother: groomMother, image_url: groomImage || null },
              bride: { name: brideName, nickname: brideNickname, father: brideMother, mother: brideMother, image_url: brideImage || null },
              prewedding_photo_url: generatePrewedding ? (activePreweddingPhotoUrl || null) : null,
              story: storyList.length > 0 ? storyList : null,
              akad: { date: akadDate, time: akadTime, location: akadLocation, maps_url: akadMaps || null },
              resepsi: { date: resepsiDate, time: resepsiTime, location: resepsiLocation, maps_url: resepsiMaps || null },
              gift: giftBank && giftAccount ? { bank_name: giftBank, account_number: giftAccount, account_holder: giftHolder || '' } : null,
              gallery: galleryList.length > 0 ? galleryList : null,
              quote: pageData?.content?.quote || 'Semoga menjadi keluarga sakinah mawaddah warahmah.',
              last_generated_prewedding_url: activePreweddingPhotoUrl || pageData?.content?.last_generated_prewedding_url || null,
              prewedding_generate_count: preweddingGenerateCount,
              banner_tagline: pageData?.content?.banner_tagline || null,
              invitation_intro: pageData?.content?.invitation_intro || null,
              closing_message: pageData?.content?.closing_message || null,
              style_palette: pageData?.content?.style_palette || null,
              scene_description: pageData?.content?.scene_description || null,
            }
          };
        } else if (templateType === 'birthday') {
          compiledPageData = {
            meta: {
              title: `Undangan Ulang Tahun ${celebrantNickname || celebrantName || 'Celebrant'}`,
              theme: designKey,
              template_type: 'birthday',
              design_key: designKey,
              template_version: designVersion,
            },
            content: {
              design_key: designKey,
              celebrant: {
                name: celebrantName,
                nickname: celebrantNickname,
                age: celebrantAge,
                parent_name: celebrantParents || null,
                image_url: celebrantImage || null,
                gender: celebrantGender
              },
              event: {
                date: birthdayDate,
                time: birthdayTime,
                location: birthdayLocation,
                maps_url: birthdayMaps || null
              },
              gift: birthdayGiftBank && birthdayGiftAccount ? {
                bank_name: birthdayGiftBank,
                account_number: birthdayGiftAccount,
                account_holder: birthdayGiftHolder || ''
              } : null,
              quote: pageData?.content?.quote || 'Selamat hari lahir! Semoga panjang umur, sehat selalu.',
              banner_tagline: pageData?.content?.banner_tagline || null,
              closing_message: pageData?.content?.closing_message || null,
            }
          };
        } else if (templateType === 'dynamic-builder') {
          const cleanSections = [];
          const seenTypeSet = new Set();
          const seenIdSet = new Set();
          for (const s of (v2Sections || [])) {
            if (!seenIdSet.has(s.id)) {
              seenIdSet.add(s.id);
              if (!seenTypeSet.has(s.type)) {
                seenTypeSet.add(s.type);
                cleanSections.push(s);
              } else {
                const hasRealContent = s.content && (s.content.title || s.content.description || s.content.headline);
                if (hasRealContent) {
                  cleanSections.push(s);
                }
              }
            }
          }
          compiledPageData = {
            meta: {
              title: v2BrandName || name || 'Modular Landing Page',
              theme: designKey || 'modern-clean',
              template_type: 'dynamic-builder',
              design_key: designKey || 'modern-clean',
              template_version: designVersion,
            },
            content: {
              brand_name: v2BrandName || name,
              brief: v2BrandBrief,
              sections: cleanSections
            }
          };
        }

        const saveEndpoint = projectId 
          ? (projectStatus === 'deployed'
              ? `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/edit-deployed`
              : `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/draft`)
          : `${process.env.NEXT_PUBLIC_API_URL}/projects/draft`;
        
        const saveMethod = projectId
          ? (projectStatus === 'deployed' ? 'POST' : 'PUT')
          : 'POST';

        let savePayload;
        if (!projectId) {
          savePayload = { name, template_type: templateType, pageData: compiledPageData };
        } else if (projectStatus === 'deployed') {
          savePayload = { pageData: compiledPageData };
        } else {
          savePayload = { name, pageData: compiledPageData };
        }

        // Set pageData and switch to preview FIRST so user sees result
        // regardless of whether save to DB succeeds (defensive UX)
        setPageData(compiledPageData);
        const suggestedSlug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        setSlug(suggestedSlug);
        setActiveTab('preview');

        try {
          const saveResponse = await fetch(saveEndpoint, {
            method: saveMethod,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify(savePayload),
          });

          const saveResult = await saveResponse.json();
          if (saveResponse.ok && saveResult.success) {
            hasSavedRef.current = true;
            uploadedImagesRef.current = [];
            try {
              localStorage.removeItem('wuzzkang_unsaved_uploads');
            } catch (e) {}
            await cleanupOrphanedAssets(originalPageDataRef.current, compiledPageData);
            originalPageDataRef.current = compiledPageData;
            if (!projectId) {
              setProjectId(saveResult.data.id || saveResult.data.projectId);
              setProjectStatus('draft');
            }
            if (pendingDeleteImages.length > 0) {
              await Promise.all(pendingDeleteImages.map(url => executeDeleteImage(url)));
              setPendingDeleteImages([]);
            }
            hasSavedRef.current = false;
          } else {
            // Save failed — log warning but don't throw so user can still see & publish the preview
            console.warn('[Preview Save] Failed to persist project draft to DB:', saveResult.error);
            setError('Peringatan: Hasil preview berhasil dibuat namun gagal disimpan ke database. Coba kembali nanti.');
          }
        } catch (saveErr) {
          console.error('[Preview Save] Error persisting draft:', saveErr);
          setError('Terjadi kesalahan saat menyimpan draf preview.');
        } finally {
          setIsGenerating(false);
        }
      }

      await refreshProfile();
    } catch (err) {
      console.error('[handleGenerate] ERROR caught:', err?.message, err);
      setError(err.message || 'Terjadi kesalahan jaringan.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle saving deployed changes (specifically for editMode)
  const handleSaveDeployed = async (e) => {
    e.preventDefault();
    if (!projectId) return;

    const validationErrors = getFormValidationErrors();
    if (validationErrors.length > 0) {
      setError(`Silakan lengkapi bidang wajib berikut: ${validationErrors.join(', ')}`);
      // Scroll to the error box or form top
      const formElement = document.getElementById('generate-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    setError('');
    setIsPublishing(true);

    let compiledPageData;
    if (templateType === 'cv') {
      compiledPageData = {
        meta: {
          title: cvName ? `CV — ${cvName}` : 'Curriculum Vitae',
          theme: designKey || 'professional-dark',
          template_type: 'cv',
          design_key: designKey || 'professional-dark',
          template_version: designVersion,
        },
        content: {
          profile: {
            name: cvName,
            title: cvTitle,
            summary: cvSummary,
            photo_url: cvPhotoUrl || null,
            email: cvEmail,
            phone: cvPhone,
            location: cvLocation,
            linkedin_url: cvLinkedin || null,
            github_url: cvGithub || null,
            portfolio_url: cvPortfolio || null,
          },
          experiences: cvExperiences.filter(e => e.company && e.position && e.period),
          educations: cvEducations.filter(e => e.institution && e.degree && e.period),
          skills: cvSkills,
          languages: cvLanguages.filter(l => l.language && l.level),
          certifications: cvCertifications.filter(c => c.name && c.issuer && c.year),
        }
      };
    } else if (templateType === 'jasa') {
      compiledPageData = {
        meta: {
          title: name || 'Layanan Jasa Profesional',
          theme: designKey || 'professional-navy',
          template_type: 'jasa',
          design_key: designKey || 'professional-navy',
          template_version: designVersion,
        },
        content: {
          brand: {
            name: jasaBrandName,
            tagline: jasaBrandTagline,
            description: jasaBrandDesc || null,
            logo_url: jasaBrandLogo || null,
            cta_text: jasaBrandCtaText || null,
            cta_url: jasaBrandCtaUrl || null,
          },
          hero: {
            headline: jasaHeroHeadline,
            subheadline: jasaHeroSubheadline,
            cta_text: jasaHeroCtaText,
            cta_secondary_text: jasaHeroCtaSecondaryText || null,
            image_url: generateJasaHeroImage ? (jasaHeroImage || null) : null
          },
          social_proof: {
            client_count: jasaSocialClientCount || null,
            project_count: jasaSocialProjectCount || null,
            product_count: jasaSocialProductCount || null,
            label_clients: jasaSocialLabelClients || null,
            label_projects: jasaSocialLabelProjects || null,
            label_products: jasaSocialLabelProducts || null,
          },
          how_it_works: {
            title: jasaHowItWorksTitle || 'Cara Kerja Kami',
            steps: jasaHowItWorksSteps.filter(s => s.title && s.desc)
          },
          about: {
            title: jasaAboutTitle || 'Tentang Kami',
            desc: jasaAboutDesc,
            image_url: generateJasaAboutImage ? (jasaAboutImage || null) : null,
            cta_portfolio_text: jasaAboutCtaPortfolioText || null,
            cta_order_text: jasaAboutCtaOrderText || null,
          },
          services: {
            title: jasaServicesTitle || 'Layanan Kami',
            list: jasaServicesList.filter(s => s.name && s.desc).map(s => ({
              name: s.name,
              desc: s.desc,
              features: Array.isArray(s.features) ? s.features.filter(Boolean) : [],
              image_url: s.image_url || null
            }))
          },
          why_us: {
            title: jasaWhyUsTitle || 'Mengapa Memilih Kami?',
            points: jasaWhyUsPoints.filter(p => p.title && p.desc)
          },
          deliverables: {
            title: jasaDeliverablesTitle || 'Apa yang Anda Dapatkan',
            list: jasaDeliverablesList.filter(d => d.title && d.desc)
          },
          pricing: {
            title: jasaPricingTitle || 'Pilih Paket Terbaik Anda',
            subtitle: jasaPricingSubtitle || 'Harga transparan tanpa biaya tersembunyi',
            cta_only: !!jasaPricingCtaOnly,
            cta_text: jasaPricingCtaText || 'Konsultasi Sekarang',
            plans: jasaPricingCtaOnly ? [] : jasaPricingPlans.filter(p => p.name).map(p => ({
              name: p.name,
              badge: p.badge || null,
              original_price: p.original_price || null,
              sale_price: p.sale_price || null,
              cta_text: p.cta_text || null,
              features: Array.isArray(p.features) ? p.features.filter(Boolean) : [],
              highlighted: !!p.highlighted
            }))
          },
          guarantee: {
            title: jasaGuaranteeTitle || 'Garansi Kepuasan 100%',
            desc: jasaGuaranteeDesc,
          },
          testimonials: {
            title: jasaTestimonialsTitle || 'Kata Klien Kami',
            list: jasaTestimonialsList.filter(t => t.name && t.content).map(t => ({
              name: t.name,
              role: t.role || null,
              content: t.content,
              avatar_url: t.avatar_url || null
            }))
          },
          faqs: jasaFaqs.filter(f => f.question && f.answer),
          contact: {
            whatsapp: jasaWhatsapp,
            email: jasaEmail || null,
            address: jasaAddress || null,
            cta_url: jasaCtaUrl || null,
            copyright: jasaCopyright || null
          },
          closing_cta: {
            title: jasaClosingTitle || null,
            cta_text: jasaClosingCtaText || null
          }
        }
      };
    } else if (templateType === 'e-course') {
      compiledPageData = {
        meta: {
          title: name || 'E-Course Halaman',
          theme: designKey,
          template_type: 'e-course',
          design_key: designKey,
          template_version: designVersion,
        },
        content: {
          courseName: courseName,
          courseBrief: courseBrief,
          courseTargetAudience: courseTargetAudience || null,
          courseTone: courseTone || null,
          hero: {
            headline: eCourseHeroHeadline,
            subheadline: eCourseHeroSubheadline,
            cta_text: eCourseHeroCtaText,
            image_url: generateECourseHeroImage ? (eCourseHeroImage || null) : null
          },
          problems: {
            title: eCourseProblemsTitle,
            list: eCourseProblemsList.filter(Boolean)
          },
          solutions: {
            title: eCourseSolutionsTitle,
            intro: eCourseSolutionsIntro,
            list: eCourseSolutionsList.filter(Boolean)
          },
          audience: {
            title: eCourseAudienceTitle,
            list: eCourseAudienceList.filter(Boolean)
          },
          mentor: {
            name: eCourseMentorName,
            role: eCourseMentorRole,
            desc: eCourseMentorDesc,
            avatar_url: generateECourseMentorImage ? (eCourseMentorAvatar || null) : null
          },
          curriculum: {
            title: eCourseCurriculumTitle,
            modules: eCourseCurriculumModules.filter(m => m.title && m.desc)
          },
          benefits: {
            title: eCourseBenefitsTitle,
            list: eCourseBenefitsList.filter(b => b.title && b.desc)
          },
          bonuses: {
            title: eCourseBonusesTitle,
            list: eCourseBonusesList.filter(b => b.title && b.desc)
          },
          pricing: {
            title: eCoursePricingTitle,
            original_price: eCoursePricingOriginal,
            discounted_price: eCoursePricingDiscounted,
            cta_text: eCoursePricingCtaText,
            features: eCoursePricingFeatures.filter(Boolean)
          },
          testimonials: {
            title: eCourseTestimonialsTitle,
            list: eCourseTestimonialsList.filter(t => t.name && t.content)
          },
          faqs: eCourseFaqs.filter(f => f.question && f.answer),
          contact: {
            whatsapp: eCourseWhatsapp,
            cta_url: eCourseCtaUrl || null,
            copyright: eCourseCopyright || null
          },
          brand_name: eCourseBrandName || 'E-COURSE ACADEMY',
          countdown: {
            enabled: eCourseCountdownEnabled,
            title: eCourseCountdownTitle || 'Sisa Waktu Promo Hari Ini:',
            type: eCourseCountdownType,
            target_date: eCourseCountdownType === 'fixed' && eCourseCountdownTargetDate ? new Date(eCourseCountdownTargetDate).toISOString() : null
          }
        }
      };
    } else if (templateType === 'toko-online') {
      compiledPageData = {
        meta: {
          title: storeName || 'Toko Online',
          theme: designKey,
          template_type: 'toko-online',
          design_key: designKey,
          template_version: designVersion,
        },
        content: {
          design_key: designKey,
          store: {
            name: storeName,
            tagline: storeTagline,
            description: storeDescription || null,
            logo_url: storeLogoUrl || null,
            banner_url: generateStoreBanner ? (storeBannerUrl || null) : null
          },
          products: tokoProducts.map(p => ({
            name: p.name,
            price: p.price,
            description: p.description || null,
            image_url: p.image_url || null
          })),
          contact: {
            whatsapp: tokoWhatsapp,
            instagram: tokoInstagram || null,
            shopee_url: tokoShopee || null,
            tokopedia_url: tokoTokopedia || null,
            address: tokoAddress || null
          },
          quote: tokoQuote || null
        }
      };
    } else if (templateType === 'campaign') {
      compiledPageData = {
        meta: {
          title: name || 'Campaign Halaman',
          theme: designKey,
          template_type: 'campaign',
          design_key: designKey,
          template_version: designVersion,
        },
        content: {
          design_key: designKey,
          brief: campaignBrief || null,
          hero: {
            headline: campaignHeadline,
            subheadline: campaignSubheadline,
            cta_text: campaignCtaText,
            image_url: generateCampaignHero ? (campaignHeroImage || null) : null
          },
          problems: {
            title: campaignProblemsTitle,
            list: campaignProblemsList.filter(Boolean)
          },
          solutions: {
            title: campaignSolutionsTitle,
            intro: campaignSolutionsIntro,
            benefits: campaignBenefits
          },
          social_proof: {
            testimonials: campaignTestimonials,
            guarantee: campaignGuarantee || null
          },
          closing: {
            urgency: campaignUrgency,
            cta_text: campaignClosingCta
          },
          contact: {
            whatsapp: campaignWhatsapp || '',
            cta_url: campaignCtaUrl || null
          },
          faqs: campaignFaqs.filter(f => f.question && f.answer)
        }
      };
    } else if (templateType === 'wedding') {
      compiledPageData = {
        meta: {
          title: `Undangan Pernikahan ${groomNickname || 'Groom'} & ${brideNickname || 'Bride'}`,
          theme: designKey,
          template_type: 'wedding',
          design_key: designKey,
          template_version: designVersion,
        },
        content: {
          design_key: designKey,
          groom: { name: groomName, nickname: groomNickname, father: groomFather, mother: groomMother, image_url: groomImage || null },
          bride: { name: brideName, nickname: brideNickname, father: brideMother, mother: brideMother, image_url: brideImage || null },
          prewedding_photo_url: generatePrewedding ? (preweddingPhotoUrl || null) : null,
          story: storyList.length > 0 ? storyList : null,
          akad: { date: akadDate, time: akadTime, location: akadLocation, maps_url: akadMaps || null },
          resepsi: { date: resepsiDate, time: resepsiTime, location: resepsiLocation, maps_url: resepsiMaps || null },
          gift: giftBank && giftAccount ? { bank_name: giftBank, account_number: giftAccount, account_holder: giftHolder || '' } : null,
          gallery: galleryList.length > 0 ? galleryList : null,
          quote: pageData?.content?.quote || 'Semoga menjadi keluarga sakinah mawaddah warahmah.',
          last_generated_prewedding_url: preweddingPhotoUrl || pageData?.content?.last_generated_prewedding_url || null,
          prewedding_generate_count: preweddingGenerateCount,
          banner_tagline: pageData?.content?.banner_tagline || null,
          invitation_intro: pageData?.content?.invitation_intro || null,
          closing_message: pageData?.content?.closing_message || null,
          style_palette: pageData?.content?.style_palette || null,
          scene_description: pageData?.content?.scene_description || null,
        }
      };
    } else if (templateType === 'birthday') {
      compiledPageData = {
        meta: {
          title: `Undangan Ulang Tahun ${celebrantNickname || celebrantName || 'Celebrant'}`,
          theme: designKey,
          template_type: 'birthday',
          design_key: designKey,
          template_version: designVersion,
        },
        content: {
          design_key: designKey,
          celebrant: {
            name: celebrantName,
            nickname: celebrantNickname,
            age: celebrantAge,
            parent_name: celebrantParents || null,
            image_url: celebrantImage || null,
            gender: celebrantGender
          },
          event: {
            date: birthdayDate,
            time: birthdayTime,
            location: birthdayLocation,
            maps_url: birthdayMaps || null
          },
          gift: birthdayGiftBank && birthdayGiftAccount ? {
            bank_name: birthdayGiftBank,
            account_number: birthdayGiftAccount,
            account_holder: birthdayGiftHolder || ''
          } : null,
          quote: pageData?.content?.quote || 'Selamat hari lahir! Semoga panjang umur, sehat selalu.',
          banner_tagline: pageData?.content?.banner_tagline || null,
          closing_message: pageData?.content?.closing_message || null,
        }
      };
    } else if (templateType === 'dynamic-builder') {
      const cleanSections = [];
      const seenTypeSet = new Set();
      const seenIdSet = new Set();
      for (const s of (v2Sections || [])) {
        if (!seenIdSet.has(s.id)) {
          seenIdSet.add(s.id);
          if (!seenTypeSet.has(s.type)) {
            seenTypeSet.add(s.type);
            cleanSections.push(s);
          } else {
            const hasRealContent = s.content && (s.content.title || s.content.description || s.content.headline || s.content.client_count || s.content.project_count);
            if (hasRealContent) {
              cleanSections.push(s);
            }
          }
        }
      }
      compiledPageData = {
        meta: {
          title: v2BrandName || name || 'Modular Landing Page',
          theme: designKey || 'modern-clean',
          template_type: 'dynamic-builder',
          design_key: designKey || 'modern-clean',
          template_version: designVersion,
        },
        content: {
          brand_name: v2BrandName || name,
          brief: v2BrandBrief,
          sections: cleanSections
        }
      };
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/edit-deployed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ name, pageData: compiledPageData }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        hasSavedRef.current = true;
        uploadedImagesRef.current = [];
        try {
          localStorage.removeItem('wuzzkang_unsaved_uploads');
        } catch (e) {}
        await cleanupOrphanedAssets(originalPageDataRef.current, compiledPageData);
        originalPageDataRef.current = compiledPageData;
        setPageData(compiledPageData);
        if (pendingDeleteImages.length > 0) {
          await Promise.all(pendingDeleteImages.map(url => executeDeleteImage(url)));
          setPendingDeleteImages([]);
        }
        await refreshProfile();
        router.push('/');
      } else {
        setError(
          result.error && typeof result.error === 'object'
            ? Object.values(result.error).flat().join(', ')
            : (result.error || 'Gagal menyimpan perubahan.')
        );
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menyimpan perubahan.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle publishing landing page (deducts dynamic cost based on coupon)
  const handlePublish = async (e) => {
    e?.preventDefault();
    if (!projectId || !slug) return;

    // Check balance first based on finalCost
    if (finalCost > 0 && (profile?.balance ?? 0) < finalCost) {
      setError(`Saldo Anda tidak mencukupi untuk mempublikasikan halaman. Biaya: ${finalCost} Credit. Silakan top up credit terlebih dahulu.`);
      return;
    }

    setError('');
    setIsPublishing(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ slug, couponCode: appliedCoupon?.code || null }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        hasSavedRef.current = true;
        uploadedImagesRef.current = [];
        try {
          localStorage.removeItem('wuzzkang_unsaved_uploads');
        } catch (e) {}
        await cleanupOrphanedAssets(originalPageDataRef.current, pageData);
        originalPageDataRef.current = pageData;
        if (pendingDeleteImages.length > 0) {
          await Promise.all(pendingDeleteImages.map(url => executeDeleteImage(url)));
          setPendingDeleteImages([]);
        }
        setSuccessUrl(result.liveUrl);
        setShowSuccessModal(true);
        await refreshProfile(); // Refresh balance
      } else {
        setError(result.error ? Object.values(result.error).flat().join(', ') : (result.error || 'Gagal mempublikasikan landing page.'));
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mempublikasikan.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Render high-fidelity preview component
  const renderPreview = () => {
    if (!pageData) return null;

    // Default Store template preview
    const themeColors = {
      light: '#3b82f6',
      dark: '#1f2937',
      corporate: '#4b6bfb',
      retro: '#ef9fbc',
      cyberpunk: '#ff007f',
    };

    const themeName = pageData.meta?.theme || 'light';
    const primaryColor = themeColors[themeName] || '#3b82f6';
    const isDark = ['dark', 'cyberpunk'].includes(themeName);

    return (
      <div
        className={`w-full h-full flex flex-col overflow-y-auto transition-colors duration-300 select-none ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
          }`}
        style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}
      >
        {/* Navigation Bar Mockup */}
        <header className={`sticky top-0 border-b z-10 px-6 py-4 flex justify-between items-center backdrop-blur-md ${isDark ? 'bg-slate-950/80 border-slate-900' : 'bg-white/80 border-slate-200/60'
          }`}>
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
              style={{ backgroundColor: primaryColor }}
            >
              {pageData.meta?.title ? pageData.meta.title.charAt(0).toUpperCase() : 'W'}
            </div>
            <span className="font-bold tracking-tight text-sm md:text-base">
              {pageData.meta?.title || 'Brand'}
            </span>
          </div>
          <button
            className="text-xs px-3 py-1.5 rounded-full text-white font-medium shadow-sm transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            {pageData.content?.hero?.cta_text || 'Mulai'}
          </button>
        </header>

        {/* Hero Section Mockup */}
        <section className={`relative py-16 px-6 text-center overflow-hidden border-b ${isDark ? 'border-slate-900 bg-slate-950' : 'border-slate-100 bg-white'
          }`}>
          {/* Decorative background aura */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-48 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ backgroundColor: primaryColor }}
          ></div>

          <div className="max-w-xl mx-auto relative z-10">
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'
              }`}>
              {pageData.content?.hero?.heading || 'Headline'}
            </h2>
            <p className={`text-sm md:text-base mt-4 leading-relaxed max-w-lg mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
              {pageData.content?.hero?.subheading || 'Subheading supporting the headline.'}
            </p>
            {pageData.content?.hero?.cta_text && (
              <button
                className="mt-6 px-6 py-2.5 rounded-full text-white text-sm font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                style={{ backgroundColor: primaryColor }}
              >
                {pageData.content.hero.cta_text}
              </button>
            )}
          </div>
        </section>

        {/* Features Section Mockup */}
        <section className="py-12 px-6 max-w-3xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pageData.features?.map((feature, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-5 border text-center transition-all ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
                  }`}
              >
                <div
                  className="text-3xl mb-4 w-12 h-12 flex items-center justify-center rounded-xl mx-auto"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  {feature.icon || '✨'}
                </div>
                <h4 className={`text-sm font-bold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                  {feature.title || 'Fitur'}
                </h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                  {feature.desc || 'Deskripsi singkat mengenai keunggulan fitur.'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Mockup */}
        <footer className={`py-8 text-center text-xs mt-auto border-t ${isDark ? 'bg-slate-950 border-slate-900 text-slate-500' : 'bg-slate-100 border-slate-200/60 text-slate-400'
          }`}>
          <p>© {new Date().getFullYear()} {pageData.meta?.title || 'Brand'}. All Rights Reserved.</p>
        </footer>
      </div>
    );
  };

  if (loading || !user) {
    return <Loading fullScreen text="Memverifikasi Autentikasi..." size="lg" />;
  }

  return (
    <div className="min-h-screen bg-theme-bg flex flex-col transition-theme">
      <Sidebar />

      {/* Main Content Area - Full Screen Responsive Desktop 12-Col / Mobile Stacked */}
      <main className="flex-grow p-3 md:p-6 flex flex-col min-h-screen pt-20 lg:pt-24 pb-48 md:pb-12 w-full max-w-full mx-auto bg-theme-surface border-x border-theme-border relative transition-theme">
        {/* Title */}
        <div className="mb-6 flex-shrink-0">
          <h1 className="text-2xl font-black text-theme-text tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>AI Siap Kerja Untukmu</h1>
          <p className="text-theme-text-sec text-xs mt-1">Masukkan data Anda, biarkan AI merancang halaman instan</p>
        </div>

        {/* Success Modal Overlay */}
        {showSuccessModal && successUrl && (
          <div className="fixed inset-0 bg-theme-bg/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-theme-surface border border-theme-border rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative">
              <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-theme-text mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>Halaman Siap!</h2>
              <p className="text-theme-text-sec text-xs mb-6 leading-relaxed">
                Landing page Anda berhasil dipublikasikan secara instan dan kini dapat diakses oleh publik secara online!
              </p>

              <div className="bg-theme-bg border border-theme-border rounded-xl p-3.5 mb-6 flex items-center justify-between text-xs overflow-hidden gap-3">
                <span className="text-theme-accent font-medium truncate select-all">{successUrl}</span>
                <a
                  href={successUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-theme-text-sec hover:text-theme-text transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={successUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Buka Halaman</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setSuccessUrl('');
                    setPageData(null);
                    setProjectId(null);
                    setName('');
                    setPrompt('');
                    setSlug('');
                    router.push('/');
                  }}
                  className="w-full bg-theme-card hover:bg-theme-surface border border-theme-border text-theme-text-sec hover:text-theme-text font-semibold py-3 rounded-xl text-xs transition-all"
                >
                  Kembali ke Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Panels Responsive Layout (Mobile Stacked Tabs / Desktop Split 12-Cols) */}
        <div className="flex-grow flex flex-col min-h-0 w-full">
          {/* Mobile Tab Switcher (Only shown if pageData exists on mobile screens) */}
          {pageData && (
            <div className="flex lg:hidden bg-theme-bg p-1 rounded-xl border border-theme-border mb-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'edit'
                  ? 'bg-theme-accent text-theme-accent-text shadow'
                  : 'text-theme-text-sec hover:text-theme-text'
                  }`}
              >
                Edit Konten
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'preview'
                  ? 'bg-theme-accent text-theme-accent-text shadow'
                  : 'text-theme-text-sec hover:text-theme-text'
                  }`}
              >
                Lihat Preview
              </button>
            </div>
          )}

          {/* 12-Column Responsive Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full flex-grow items-start">
            {/* Column 1: Edit Form (Full width on mobile if activeTab === 'edit', 4-cols on lg desktop) */}
            <div className={`col-span-1 lg:col-span-4 flex flex-col lg:max-h-[calc(100vh-140px)] ${pageData && activeTab !== 'edit' ? 'hidden lg:flex' : 'flex'}`}>
              <div className="bg-theme-card/40 border border-theme-border rounded-2xl p-5 flex flex-col flex-grow overflow-y-auto scrollbar-thin">
                <div className="space-y-5">
                  <div className="pb-2 border-b border-theme-border flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-theme-text tracking-wide" style={{ fontFamily: "'Sora', sans-serif" }}>Detail Landing Page</h3>
                      <p className="text-[10px] text-theme-text-sec mt-0.5">Lengkapi formulir untuk membuat pratinjau halaman Anda</p>
                    </div>
                  </div>

                  <form id="generate-form" onSubmit={editMode ? handleSaveDeployed : handleGenerate} className="space-y-4">
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold p-3.5 rounded-xl">
                        {error}
                      </div>
                    )}
                    {/* Tipe Template Selector */}
                    <div>
                      <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">
                        Tipe Layanan / Template
                      </label>
                      <button
                        type="button"
                        onClick={() => !editMode && setIsTemplateModalOpen(true)}
                        disabled={editMode}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-theme-bg border border-theme-border rounded-xl text-left transition-all group ${editMode ? 'opacity-70 cursor-not-allowed' : 'hover:border-theme-accent'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-7 rounded-lg bg-theme-accent/10 flex items-center justify-center text-theme-accent group-hover:scale-105 transition-transform text-sm">
                            {getProductIcon(templateType)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-theme-text">
                              {currentProduct ? currentProduct.name : 'Pilih Layanan'}
                            </p>
                            <p className="text-[9px] text-theme-text-sec">
                              {editMode ? 'Tipe produk dikunci pada mode edit' : 'Klik untuk mengganti tipe produk/template'}
                            </p>
                          </div>
                        </div>
                        {!editMode && <ChevronRight className="h-4 w-4 text-theme-text-muted group-hover:text-theme-text transition-colors" />}
                      </button>
                    </div>

                    {/* Nama Halaman / Acara */}
                    <div>
                      <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">
                        {templateType === 'wedding' ? 'Nama Undangan / Pernikahan' :
                         templateType === 'birthday' ? 'Nama Acara Ulang Tahun' :
                         templateType === 'toko-online' ? 'Nama Toko Online' :
                         templateType === 'campaign' ? 'Nama Campaign / Halaman Penjualan' :
                         templateType === 'cv' ? 'Nama CV / Resume' :
                         templateType === 'e-course' ? 'Nama E-Course' : 'Nama Halaman / Acara'}
                        <span className="text-red-500 font-bold ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={
                          templateType === 'wedding' ? 'Contoh: Pernikahan Budi & Riri' :
                          templateType === 'birthday' ? 'Contoh: Ulang Tahun Kayla - Ke-17' :
                          templateType === 'toko-online' ? 'Contoh: Serasi Gadget Store' :
                          templateType === 'campaign' ? 'Contoh: Blueprint Copywriting AI' :
                          templateType === 'cv' ? 'Contoh: CV Rian Prasetya - Senior Developer' :
                          templateType === 'e-course' ? 'Contoh: E-Course Digital Marketing Mastery' : 'Contoh: Halaman Keren Saya'
                        }
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isGenerating}
                        className="block w-full px-3.5 py-2.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Template Upgrade Banner */}
                    {(() => {
                      const latestVer = TEMPLATE_LATEST_VERSIONS[designKey] || 1;
                      const canUpgrade = latestVer > designVersion;
                      if (!canUpgrade) return null;

                      return (
                        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-2xl mb-4 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="space-y-1">
                            <div className="font-bold flex items-center gap-1.5 text-amber-400">
                              <AlertCircle size={14} /> Tersedia Versi Desain Baru!
                            </div>
                            <p className="text-theme-text-sec text-[11px] leading-relaxed">
                              Tema <b>{designKey}</b> memiliki pembaruan desain terbaru (Versi {latestVer}). Upgrade sekarang untuk menikmati tata letak terbaru secara aman.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Upgrade desain tema "${designKey}" ke versi ${latestVer}?\n\nKonten lama Anda akan tetap dipertahankan.`)) {
                                setDesignVersion(latestVer);
                              }
                            }}
                            className="flex-shrink-0 bg-amber-500 text-slate-900 font-bold px-3 py-2 rounded-xl hover:bg-amber-400 active:scale-95 transition-all"
                          >
                            Upgrade Desain (v{latestVer})
                          </button>
                        </div>
                      );
                    })()}

                    {/* Wedding Fields */}
                    {templateType === 'wedding' && (
                      <div className="space-y-4 border-t border-theme-border pt-4">
                        {/* Desain Template Picker */}
                        <div>
                          <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">
                            Pilih Desain Tema
                          </label>
                          <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x snap-mandatory">
                            <div className="flex flex-col gap-1.5 flex-shrink-0 w-36 snap-start">
                              <button
                                type="button"
                                onClick={() => handleSelectDesign('sage-green')}
                                className={`w-full p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${designKey === 'sage-green' ? 'border-theme-accent bg-theme-accent/10 text-theme-accent' : 'border-theme-border bg-theme-bg/50 text-theme-text-sec'
                                  }`}
                              >
                                <span className="text-lg">🌿</span>
                                <span className="text-[10px] font-bold">Sage Green</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewDesignKey('sage-green')}
                                className="text-[9px] font-semibold text-theme-accent hover:underline text-center"
                              >
                                Lihat Contoh Desain
                              </button>
                            </div>
                            <div className="flex flex-col gap-1.5 flex-shrink-0 w-36 snap-start">
                              <button
                                type="button"
                                onClick={() => handleSelectDesign('floral-pink')}
                                className={`w-full p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${designKey === 'floral-pink' ? 'border-theme-accent bg-theme-accent/10 text-theme-accent' : 'border-theme-border bg-theme-bg/50 text-theme-text-sec'
                                  }`}
                              >
                                <span className="text-lg">🌸</span>
                                <span className="text-[10px] font-bold">Floral Pink</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewDesignKey('floral-pink')}
                                className="text-[9px] font-semibold text-theme-accent hover:underline text-center"
                              >
                                Lihat Contoh Desain
                              </button>
                            </div>
                            <div className="flex flex-col gap-1.5 flex-shrink-0 w-36 snap-start">
                              <button
                                type="button"
                                onClick={() => handleSelectDesign('classic-love')}
                                className={`w-full p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${designKey === 'classic-love' ? 'border-theme-accent bg-theme-accent/10 text-theme-accent' : 'border-theme-border bg-theme-bg/50 text-theme-text-sec'
                                  }`}
                              >
                                <span className="text-lg">🌹</span>
                                <span className="text-[10px] font-bold">Classic Love</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewDesignKey('classic-love')}
                                className="text-[9px] font-semibold text-theme-accent hover:underline text-center"
                              >
                                Lihat Contoh Desain
                              </button>
                            </div>
                            <div className="flex flex-col gap-1.5 flex-shrink-0 w-36 snap-start">
                              <button
                                type="button"
                                onClick={() => handleSelectDesign('javanese-traditional')}
                                className={`w-full p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${designKey === 'javanese-traditional' ? 'border-theme-accent bg-theme-accent/10 text-theme-accent' : 'border-theme-border bg-theme-bg/50 text-theme-text-sec'
                                  }`}
                              >
                                <span className="text-lg">🤎</span>
                                <span className="text-[10px] font-bold">Traditional Javanese</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewDesignKey('javanese-traditional')}
                                className="text-[9px] font-semibold text-theme-accent hover:underline text-center"
                              >
                                Lihat Contoh Desain
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Mempelai Pria */}
                        <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider pt-1">Detail Mempelai Pria *</div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Nama Lengkap Pria *"
                            value={groomName}
                            onChange={(e) => setGroomName(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Panggilan *"
                            value={groomNickname}
                            onChange={(e) => setGroomNickname(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Nama Ayah Pria *"
                            value={groomFather}
                            onChange={(e) => setGroomFather(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Nama Ibu Pria *"
                            value={groomMother}
                            onChange={(e) => setGroomMother(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                        </div>

                        {/* Foto Mempelai Pria */}
                        <div className="text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Foto Pria</div>
                        <div className="flex gap-2.5 items-center bg-theme-bg p-2.5 rounded-xl border border-theme-border">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-theme-border bg-theme-surface flex-shrink-0 flex items-center justify-center text-[9px] text-theme-text-muted">
                            {groomImage ? <img src={groomImage} className="w-full h-full object-cover" /> : 'No image'}
                          </div>
                          <div className="flex-grow flex flex-col gap-1">
                            <div className="flex gap-1.5">
                              <label className="flex-1 bg-theme-card hover:bg-theme-bg border border-theme-border text-theme-text-sec hover:text-theme-text text-[9px] font-bold py-1 px-2 rounded text-center cursor-pointer transition-colors">
                                {isUploadingGroomImage ? 'Uploading...' : 'Upload'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleUploadImage(e.target.files[0], 'groom')}
                                />
                              </label>
                              {renderAIAvatarButton('groom', isGeneratingGroomImage)}
                              {groomImage && groomImage !== DEFAULT_GROOM_AVATAR && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDeleteImage(groomImage);
                                    setGroomImage(DEFAULT_GROOM_AVATAR);
                                  }}
                                  className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-[9px] font-bold px-2 rounded transition-colors cursor-pointer"
                                >
                                  Hapus
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Mempelai Wanita */}
                        <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider pt-1">Detail Mempelai Wanita *</div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Nama Lengkap Wanita *"
                            value={brideName}
                            onChange={(e) => setBrideName(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Panggilan *"
                            value={brideNickname}
                            onChange={(e) => setBrideNickname(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Nama Ayah Wanita *"
                            value={brideFather}
                            onChange={(e) => setBrideFather(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Nama Ibu Wanita *"
                            value={brideMother}
                            onChange={(e) => setBrideMother(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                        </div>

                        {/* Foto Mempelai Wanita */}
                        <div className="text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Foto Wanita</div>
                        <div className="flex gap-2.5 items-center bg-theme-bg p-2.5 rounded-xl border border-theme-border">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-theme-border bg-theme-surface flex-shrink-0 flex items-center justify-center text-[9px] text-theme-text-muted">
                            {brideImage ? <img src={brideImage} className="w-full h-full object-cover" /> : 'No image'}
                          </div>
                          <div className="flex-grow flex flex-col gap-1">
                            <div className="flex gap-1.5">
                              <label className="flex-1 bg-theme-card hover:bg-theme-bg border border-theme-border text-theme-text-sec hover:text-theme-text text-[9px] font-bold py-1 px-2 rounded text-center cursor-pointer transition-colors">
                                {isUploadingBrideImage ? 'Uploading...' : 'Upload'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleUploadImage(e.target.files[0], 'bride')}
                                />
                              </label>
                              {renderAIAvatarButton('bride', isGeneratingBrideImage)}
                              {brideImage && brideImage !== DEFAULT_BRIDE_AVATAR && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDeleteImage(brideImage);
                                    setBrideImage(DEFAULT_BRIDE_AVATAR);
                                  }}
                                  className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-[9px] font-bold px-2 rounded transition-colors cursor-pointer"
                                >
                                  Hapus
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Option: Custom Prewedding Background Photo */}
                        <ImagePickerField
                          checkboxId="generatePrewedding"
                          checkboxLabel="Gunakan Foto Cover / Background Prewedding"
                          unsplashQuery=""
                          imageUrl={preweddingPhotoUrl}
                          onImageChange={(val) => {
                            if (!val && preweddingPhotoUrl && preweddingSource === 'upload') {
                              handleDeleteImage(preweddingPhotoUrl);
                            }
                            setPreweddingPhotoUrl(val);
                          }}
                          apiToken={session?.access_token}
                          apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
                          isEnabled={generatePrewedding}
                          onEnabledChange={setGeneratePrewedding}
                          source={preweddingSource}
                          onSourceChange={setPreweddingSource}
                          onUpload={handleUploadImage}
                          uploadType="prewedding"
                        />

                        {/* Galeri Foto Pernikahan */}
                        <div className="space-y-2 border-t border-theme-border pt-4">
                          <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider">
                            Galeri Foto Pernikahan (Tampil di Slider)
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {galleryList.map((url, idx) => (
                              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-theme-border bg-theme-surface group">
                                <img src={url} className="w-full h-full object-cover" alt="Gallery preview" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDeleteImage(url);
                                    setGalleryList(galleryList.filter((_, i) => i !== idx));
                                  }}
                                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity"
                                >
                                  Hapus
                                </button>
                              </div>
                            ))}
                            {galleryList.length < 12 && (
                              <label className="flex flex-col items-center justify-center aspect-square bg-theme-bg/50 hover:bg-theme-bg border border-dashed border-theme-border rounded-xl cursor-pointer hover:border-theme-accent transition-colors">
                                <span className="text-xl text-theme-text-sec">{isUploadingGalleryImage ? '⏳' : '＋'}</span>
                                <span className="text-[8px] text-theme-text-sec font-semibold mt-1">
                                  {isUploadingGalleryImage ? 'Mengunggah...' : 'Tambah Foto'}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={isUploadingGalleryImage}
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleUploadImage(e.target.files[0], 'gallery');
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        </div>

                        {/* Kisah Cinta (Story) Builder */}
                        <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider pt-1">Kisah Cinta (Timeline)</div>
                        {storyList.length > 0 && (
                          <div className="space-y-1 bg-theme-bg p-2 rounded-xl border border-theme-border max-h-[120px] overflow-y-auto">
                            {storyList.map((story, sIdx) => (
                              <div key={sIdx} className="flex items-center justify-between bg-theme-card/80 px-2.5 py-1.5 rounded-lg border border-theme-border text-[9px]">
                                <span className="truncate text-theme-text font-bold">{story.date} - {story.title}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (story.image_url) {
                                      handleDeleteImage(story.image_url);
                                    }
                                    setStoryList(storyList.filter((_, i) => i !== sIdx));
                                  }}
                                  className="text-red-400 hover:text-red-300 font-bold ml-2 text-[9px]"
                                >
                                  Hapus
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="bg-theme-bg/50 p-2.5 rounded-xl border border-theme-border space-y-2">
                          <div className="grid grid-cols-2 gap-1.5">
                            <input
                              type="text"
                              placeholder="Tahun / Tanggal"
                              value={newStoryDate}
                              onChange={(e) => setNewStoryDate(e.target.value)}
                              className="block w-full px-2 py-1 bg-theme-bg border border-theme-border rounded-lg text-[9px] text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Judul Kejadian"
                              value={newStoryTitle}
                              onChange={(e) => setNewStoryTitle(e.target.value)}
                              className="block w-full px-2 py-1 bg-theme-bg border border-theme-border rounded-lg text-[9px] text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
                          </div>
                          <textarea
                            placeholder="Ceritakan singkat..."
                            value={newStoryDesc}
                            onChange={(e) => setNewStoryDesc(e.target.value)}
                            rows={2}
                            className="block w-full px-2 py-1 bg-theme-bg border border-theme-border rounded-lg text-[9px] text-theme-text placeholder-theme-text-muted focus:outline-none resize-none"
                          />
                          <div className="flex justify-between items-center gap-1.5">
                            <label className="bg-theme-card hover:bg-theme-bg border border-theme-border text-theme-text-sec hover:text-theme-text text-[8px] font-bold py-1 px-2 rounded cursor-pointer">
                              {isUploadingStoryImage ? 'Uploading...' : 'Pilih Foto'}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleUploadImage(e.target.files[0], 'story')}
                              />
                            </label>
                            {newStoryImage && <span className="text-[8px] text-emerald-400 truncate max-w-[80px]">Foto siap</span>}
                            <button
                              type="button"
                              onClick={() => {
                                if (!newStoryTitle || !newStoryDate || !newStoryDesc) {
                                  alert('Harap isi judul, tanggal, dan cerita singkat.');
                                  return;
                                }
                                setStoryList([...storyList, {
                                  title: newStoryTitle,
                                  date: newStoryDate,
                                  desc: newStoryDesc,
                                  image_url: newStoryImage || null
                                }]);
                                setNewStoryTitle('');
                                setNewStoryDate('');
                                setNewStoryDesc('');
                                setNewStoryImage('');
                              }}
                              className="bg-theme-accent text-theme-accent-text text-[8px] font-bold py-1 px-2.5 rounded hover:bg-theme-accent-hover transition-colors"
                            >
                              Tambah
                            </button>
                          </div>
                        </div>

                        {/* Akad Nikah */}
                        <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider pt-1">Acara Akad Nikah *</div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            required
                            value={akadDate}
                            onChange={(e) => setAkadDate(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none"
                          />
                          <input
                            type="time"
                            required
                            value={akadTime}
                            onChange={(e) => setAkadTime(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none"
                          />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Lokasi Akad (Masjid Agung Jambi) *"
                          value={akadLocation}
                          onChange={(e) => setAkadLocation(e.target.value)}
                          className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Link Google Maps Akad (Opsional)"
                          value={akadMaps}
                          onChange={(e) => setAkadMaps(e.target.value)}
                          className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                        />

                        {/* Resepsi */}
                        <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider pt-1">Acara Resepsi *</div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            required
                            value={resepsiDate}
                            onChange={(e) => setResepsiDate(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none"
                          />
                          <input
                            type="time"
                            required
                            value={resepsiTime}
                            onChange={(e) => setResepsiTime(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none"
                          />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Lokasi Resepsi (Gedung Serbaguna) *"
                          value={resepsiLocation}
                          onChange={(e) => setResepsiLocation(e.target.value)}
                          className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Link Google Maps Resepsi (Opsional)"
                          value={resepsiMaps}
                          onChange={(e) => setResepsiMaps(e.target.value)}
                          className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                        />

                        {/* Kado Digital */}
                        <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider pt-1">Kado Digital (Opsional)</div>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Bank (BCA)"
                            value={giftBank}
                            onChange={(e) => setGiftBank(e.target.value)}
                            className="block w-full px-2 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-[10px] text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="No Rekening"
                            value={giftAccount}
                            onChange={(e) => setGiftAccount(e.target.value)}
                            className="block w-full px-2 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-[10px] text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Atas Nama"
                            value={giftHolder}
                            onChange={(e) => setGiftHolder(e.target.value)}
                            className="block w-full px-2 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-[10px] text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Birthday Fields */}
                    {templateType === 'birthday' && (
                      <div className="space-y-4 border-t border-theme-border pt-4">
                        {/* Desain Template Picker */}
                        <div>
                          <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">
                            Pilih Desain Tema
                          </label>
                          <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x snap-mandatory">
                            <div className="flex flex-col gap-1.5 flex-shrink-0 w-36 snap-start">
                              <button
                                type="button"
                                onClick={() => handleSelectDesign('cute-balloon')}
                                className={`w-full p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${designKey === 'cute-balloon' ? 'border-theme-accent bg-theme-accent/10 text-theme-accent' : 'border-theme-border bg-theme-bg/50 text-theme-text-sec'
                                  }`}
                              >
                                <span className="text-lg">🎈</span>
                                <span className="text-[10px] font-bold">Cute Balloon</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewDesignKey('cute-balloon')}
                                className="text-[9px] font-semibold text-theme-accent hover:underline text-center"
                              >
                                Lihat Contoh Desain
                              </button>
                            </div>
                            <div className="flex flex-col gap-1.5 flex-shrink-0 w-36 snap-start">
                              <button
                                type="button"
                                onClick={() => handleSelectDesign('elegant-gold')}
                                className={`w-full p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${designKey === 'elegant-gold' ? 'border-theme-accent bg-theme-accent/10 text-theme-accent' : 'border-theme-border bg-theme-bg/50 text-theme-text-sec'
                                  }`}
                              >
                                <span className="text-lg">✨</span>
                                <span className="text-[10px] font-bold">Elegant Gold</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewDesignKey('elegant-gold')}
                                className="text-[9px] font-semibold text-theme-accent hover:underline text-center"
                              >
                                Lihat Contoh Desain
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Yang Berulang Tahun */}
                        <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider pt-1">Detail Yang Berulang Tahun *</div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Nama Lengkap *"
                            value={celebrantName}
                            onChange={(e) => setCelebrantName(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Nama Panggilan *"
                            value={celebrantNickname}
                            onChange={(e) => setCelebrantNickname(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Umur (e.g. 5 atau Sweet 17) *"
                            value={celebrantAge}
                            onChange={(e) => setCelebrantAge(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Nama Orang Tua (Opsional)"
                            value={celebrantParents}
                            onChange={(e) => setCelebrantParents(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                        </div>

                        {/* Jenis Kelamin */}
                        <div className="grid grid-cols-2 gap-2 items-center">
                          <label className="text-[10px] font-bold text-theme-text-sec uppercase tracking-wider">Jenis Kelamin</label>
                          <div className="flex gap-1 bg-theme-bg p-0.5 rounded-lg border border-theme-border">
                            <button
                              type="button"
                              onClick={() => {
                                setCelebrantGender('male');
                                if (celebrantImage === DEFAULT_GROOM_AVATAR || celebrantImage === DEFAULT_BRIDE_AVATAR) {
                                  setCelebrantImage(DEFAULT_GROOM_AVATAR);
                                }
                              }}
                              className={`flex-1 py-1 rounded text-[9px] font-bold transition-all ${celebrantGender === 'male' ? 'bg-theme-accent text-theme-accent-text shadow-sm' : 'text-theme-text-sec hover:text-theme-text'
                                }`}
                            >
                              Laki-laki
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCelebrantGender('female');
                                if (celebrantImage === DEFAULT_GROOM_AVATAR || celebrantImage === DEFAULT_BRIDE_AVATAR) {
                                  setCelebrantImage(DEFAULT_BRIDE_AVATAR);
                                }
                              }}
                              className={`flex-1 py-1 rounded text-[9px] font-bold transition-all ${celebrantGender === 'female' ? 'bg-theme-accent text-theme-accent-text shadow-sm' : 'text-theme-text-sec hover:text-theme-text'
                                }`}
                            >
                              Perempuan
                            </button>
                          </div>
                        </div>

                        {/* Foto Yang Berulang Tahun */}
                        <div className="text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Foto Profil</div>
                        <div className="flex gap-2.5 items-center bg-theme-bg p-2.5 rounded-xl border border-theme-border">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-theme-border bg-theme-surface flex-shrink-0 flex items-center justify-center text-[9px] text-theme-text-muted">
                            {celebrantImage ? <img src={celebrantImage} className="w-full h-full object-cover" /> : 'No image'}
                          </div>
                          <div className="flex-grow flex flex-col gap-1">
                            <div className="flex gap-1.5">
                              <label className="flex-1 bg-theme-card hover:bg-theme-bg border border-theme-border text-theme-text-sec hover:text-theme-text text-[9px] font-bold py-1 px-2 rounded text-center cursor-pointer transition-colors">
                                {isUploadingCelebrantImage ? 'Uploading...' : 'Upload'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleUploadImage(e.target.files[0], 'celebrant')}
                                />
                              </label>
                              {renderAIAvatarButton('celebrant', isGeneratingCelebrantImage)}
                              {celebrantImage && celebrantImage !== DEFAULT_GROOM_AVATAR && celebrantImage !== DEFAULT_BRIDE_AVATAR && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDeleteImage(celebrantImage);
                                    setCelebrantImage(celebrantGender === 'female' ? DEFAULT_BRIDE_AVATAR : DEFAULT_GROOM_AVATAR);
                                  }}
                                  className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-[9px] font-bold px-2 rounded transition-colors cursor-pointer"
                                >
                                  Hapus
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Waktu & Lokasi Acara */}
                        <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider pt-1">Acara Perayaan *</div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            required
                            value={birthdayDate}
                            onChange={(e) => setBirthdayDate(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none"
                          />
                          <input
                            type="time"
                            required
                            value={birthdayTime}
                            onChange={(e) => setBirthdayTime(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none"
                          />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Nama Tempat / Lokasi Acara *"
                          value={birthdayLocation}
                          onChange={(e) => setBirthdayLocation(e.target.value)}
                          className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Link Google Maps Lokasi (Opsional)"
                          value={birthdayMaps}
                          onChange={(e) => setBirthdayMaps(e.target.value)}
                          className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                        />

                        {/* Kado Digital */}
                        <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider pt-1">Kado Digital (Opsional)</div>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Bank (BCA)"
                            value={birthdayGiftBank}
                            onChange={(e) => setBirthdayGiftBank(e.target.value)}
                            className="block w-full px-2 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-[10px] text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="No Rekening"
                            value={birthdayGiftAccount}
                            onChange={(e) => setBirthdayGiftAccount(e.target.value)}
                            className="block w-full px-2 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-[10px] text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Atas Nama"
                            value={birthdayGiftHolder}
                            onChange={(e) => setBirthdayGiftHolder(e.target.value)}
                            className="block w-full px-2 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-[10px] text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Toko Online Fields */}
                    {templateType === 'toko-online' && (
                      <div className="space-y-5 border-t border-theme-border pt-4">
                        {/* Desain Template Picker */}
                        <div>
                          <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">
                            Pilih Desain Tema
                          </label>
                          <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x snap-mandatory">
                            <div className="flex flex-col gap-1.5 flex-shrink-0 w-36 snap-start">
                              <button
                                type="button"
                                onClick={() => handleSelectDesign('modern-clean')}
                                className={`w-full p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${designKey === 'modern-clean' ? 'border-theme-accent bg-theme-accent/10 text-theme-accent' : 'border-theme-border bg-theme-bg/50 text-theme-text-sec'
                                  }`}
                              >
                                <span className="text-lg">🛍️</span>
                                <span className="text-[10px] font-bold">Modern Clean</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewDesignKey('modern-clean')}
                                className="text-[9px] font-semibold text-theme-accent hover:underline text-center"
                              >
                                Lihat Contoh Desain
                              </button>
                            </div>
                            <div className="flex flex-col gap-1.5 flex-shrink-0 w-36 snap-start">
                              <button
                                type="button"
                                onClick={() => handleSelectDesign('midnight-dark')}
                                className={`w-full p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${designKey === 'midnight-dark' ? 'border-theme-accent bg-theme-accent/10 text-theme-accent' : 'border-theme-border bg-theme-bg/50 text-theme-text-sec'
                                  }`}
                              >
                                <span className="text-lg">👑</span>
                                <span className="text-[10px] font-bold">Midnight Dark</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewDesignKey('midnight-dark')}
                                className="text-[9px] font-semibold text-[#d4af37] hover:underline text-center"
                              >
                                Lihat Contoh Desain
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Profil Toko */}
                        <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider pt-1">Informasi Toko</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Nama Toko <span className="text-red-500 font-bold ml-0.5">*</span></label>
                            <input
                              type="text"
                              required
                              placeholder="Nama Toko"
                              value={storeName}
                              onChange={(e) => setStoreName(e.target.value)}
                              className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-[8px] font-semibold text-theme-text-sec">Tagline Toko <span className="text-red-500 font-bold ml-0.5">*</span></label>
                              {renderAITokoButton('store_tagline', isGeneratingStoreTagline)}
                            </div>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Sepatu Original Termurah"
                              value={storeTagline}
                              onChange={(e) => setStoreTagline(e.target.value)}
                              className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Deskripsi Toko dengan AI */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[8px] font-semibold text-theme-text-sec">Deskripsi Toko</label>
                            {renderAITokoButton('store_description', isGeneratingStoreDesc)}
                          </div>
                          <textarea
                            rows={3}
                            placeholder="Deskripsi singkat toko Anda..."
                            value={storeDescription}
                            onChange={(e) => setStoreDescription(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none resize-none leading-relaxed"
                          />
                        </div>

                        {/* Logo Toko */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Logo Toko (Opsional)</label>
                            <div className="flex gap-2 items-center bg-theme-bg p-2 rounded-xl border border-theme-border">
                              <div className="w-8 h-8 rounded-lg overflow-hidden border border-theme-border bg-theme-surface flex-shrink-0 flex items-center justify-center text-[10px]">
                                {storeLogoUrl ? <img src={storeLogoUrl} className="w-full h-full object-cover" /> : '🛒'}
                              </div>
                              <div className="flex-grow flex gap-1">
                                <label className="flex-grow bg-theme-card hover:bg-theme-bg border border-theme-border text-theme-text-sec hover:text-theme-text text-[9px] font-bold py-1.5 px-2 rounded text-center cursor-pointer transition-all">
                                  {isUploadingLogo ? 'Uploading...' : 'Upload'}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleUploadImage(e.target.files[0], 'logo')}
                                  />
                                </label>
                                {storeLogoUrl && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleDeleteImage(storeLogoUrl);
                                      setStoreLogoUrl('');
                                    }}
                                    className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-[9px] font-bold px-2 rounded transition-all cursor-pointer"
                                  >
                                    Hapus
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Banner Hero / Background Image */}
                        <ImagePickerField
                          checkboxId="generateStoreBanner"
                          checkboxLabel="Gunakan Foto Background / Banner Hero Section"
                          unsplashQuery="shopping,store,commercial,product"
                          imageUrl={storeBannerUrl}
                          onImageChange={(val) => {
                            if (!val && storeBannerUrl && storeBannerSource === 'upload') {
                              handleDeleteImage(storeBannerUrl);
                            }
                            setStoreBannerUrl(val);
                          }}
                          apiToken={session?.access_token}
                          apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
                          isEnabled={generateStoreBanner}
                          onEnabledChange={setGenerateStoreBanner}
                          source={storeBannerSource}
                          onSourceChange={setStoreBannerSource}
                          onUpload={handleUploadImage}
                          uploadType="storeBanner"
                        />

                        {/* Katalog Produk */}
                        <div className="flex justify-between items-center border-t border-theme-border pt-4">
                          <span className="text-[9px] font-bold text-theme-accent uppercase tracking-wider">Katalog Produk * ({tokoProducts.length}/6)</span>
                          {tokoProducts.length < 6 && (
                            <button
                              type="button"
                              onClick={() => setTokoProducts(prev => [...prev, { name: '', price: '', description: '', image_url: '' }])}
                              className="text-[9px] font-bold text-theme-accent hover:underline border border-theme-accent/30 bg-theme-accent/5 px-2.5 py-1 rounded-lg"
                            >
                              + Tambah Produk
                            </button>
                          )}
                        </div>

                        <div className="space-y-4">
                          {tokoProducts.map((product, index) => (
                            <div key={index} className="bg-theme-bg/30 p-3.5 rounded-2xl border border-theme-border space-y-3 relative">
                              <div className="flex justify-between items-center pb-1.5 border-b border-theme-border/50">
                                <span className="text-[10px] font-bold text-theme-text-sec">Produk #{index + 1} *</span>
                                {tokoProducts.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const prod = tokoProducts[index];
                                      if (prod?.image_url) handleDeleteImage(prod.image_url);
                                      setTokoProducts(prev => prev.filter((_, idx) => idx !== index));
                                    }}
                                    className="text-[9px] font-bold text-red-400 hover:text-red-500 flex items-center gap-0.5"
                                  >
                                    Hapus
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  required
                                  placeholder="Nama Produk *"
                                  value={product.name}
                                  onChange={(e) => {
                                    setTokoProducts(prev => {
                                      const next = [...prev];
                                      next[index].name = e.target.value;
                                      return next;
                                    });
                                  }}
                                  className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                                />
                                <input
                                  type="text"
                                  required
                                  placeholder="Harga (e.g. 150000) *"
                                  value={product.price}
                                  onChange={(e) => {
                                    setTokoProducts(prev => {
                                      const next = [...prev];
                                      next[index].price = e.target.value.replace(/\D/g, '');
                                      return next;
                                    });
                                  }}
                                  className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                                />
                              </div>

                              {/* Deskripsi Produk */}
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <label className="block text-[8px] font-semibold text-theme-text-sec">Deskripsi Produk (Opsional)</label>
                                  {renderAITokoButton('product_description', isGeneratingProductDesc[index], index)}
                                </div>
                                <textarea
                                  rows={2}
                                  placeholder="Deskripsi spesifikasi/keunggulan produk..."
                                  value={product.description || ''}
                                  onChange={(e) => {
                                    setTokoProducts(prev => {
                                      const next = [...prev];
                                      next[index].description = e.target.value;
                                      return next;
                                    });
                                  }}
                                  className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-[10px] text-theme-text placeholder-theme-text-muted focus:outline-none resize-none leading-relaxed"
                                />
                              </div>

                              {/* Gambar Produk */}
                              <div className="flex gap-2.5 items-center bg-theme-bg p-2 rounded-xl border border-theme-border">
                                <div className="w-8 h-8 rounded-lg overflow-hidden border border-theme-border bg-theme-surface flex-shrink-0 flex items-center justify-center text-[10px]">
                                  {product.image_url ? <img src={product.image_url} className="w-full h-full object-cover" /> : '📦'}
                                </div>
                                <div className="flex-grow flex gap-1">
                                  <label className="flex-grow bg-theme-card hover:bg-theme-bg border border-theme-border text-theme-text-sec hover:text-theme-text text-[9px] font-bold py-1 px-2 rounded text-center cursor-pointer transition-all">
                                    {isUploadingProductIndex === index ? 'Uploading...' : 'Upload Foto Produk'}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => handleUploadImage(e.target.files[0], `product-${index}`)}
                                    />
                                  </label>
                                  {product.image_url && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleDeleteImage(product.image_url);
                                        setTokoProducts(prev => {
                                          const next = [...prev];
                                          next[index].image_url = '';
                                          return next;
                                        });
                                      }}
                                      className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-[9px] font-bold px-2 rounded transition-all cursor-pointer"
                                    >
                                      Hapus
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Kontak & Sosmed */}
                        <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider pt-1">Kontak & Media Sosial</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">WhatsApp Toko <span className="text-red-500 font-bold ml-0.5">*</span></label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 628123456789"
                              value={tokoWhatsapp}
                              onChange={(e) => setTokoWhatsapp(e.target.value)}
                              className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Username Instagram</label>
                            <input
                              type="text"
                              placeholder="e.g. @tokosepatu"
                              value={tokoInstagram}
                              onChange={(e) => setTokoInstagram(e.target.value)}
                              className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Link Toko Shopee (Opsional)</label>
                            <input
                              type="text"
                              placeholder="https://shopee.co.id/toko"
                              value={tokoShopee}
                              onChange={(e) => setTokoShopee(e.target.value)}
                              className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Link Tokopedia (Opsional)</label>
                            <input
                              type="text"
                              placeholder="https://tokopedia.com/toko"
                              value={tokoTokopedia}
                              onChange={(e) => setTokoTokopedia(e.target.value)}
                              className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Alamat Toko (Opsional)</label>
                          <textarea
                            rows={2}
                            placeholder="Alamat fisik outlet/toko Anda..."
                            value={tokoAddress}
                            onChange={(e) => setTokoAddress(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none resize-none leading-relaxed"
                          />
                        </div>

                        {/* Slogan Toko / Quote */}
                        <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider pt-1">Slogan / Sambutan Toko (Opsional)</div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[8px] font-semibold text-theme-text-sec">Quotes / Slogan Pembuka</label>
                            {renderAITokoButton('store_quote', isGeneratingStoreQuote)}
                          </div>
                          <textarea
                            rows={2}
                            placeholder="Tulis kalimat sambutan atau slogan penarik minat..."
                            value={tokoQuote}
                            onChange={(e) => setTokoQuote(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none resize-none leading-relaxed"
                          />
                        </div>
                      </div>
                    )}

                    {/* Campaign Fields */}
                    {templateType === 'campaign' && (
                      <div className="space-y-5 border-t border-theme-border pt-4">
                        {/* Desain Template Picker */}
                        <div>
                          <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">
                            Pilih Desain Tema
                          </label>
                          <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x snap-mandatory">
                            <div className="flex flex-col gap-1.5 flex-shrink-0 w-36 snap-start">
                              <button
                                type="button"
                                onClick={() => handleSelectDesign('neon-conversion')}
                                className={`w-full p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${designKey === 'neon-conversion' ? 'border-theme-accent bg-theme-accent/10 text-theme-accent' : 'border-theme-border bg-theme-bg/50 text-theme-text-sec'
                                  }`}
                              >
                                <span className="text-lg">⚡</span>
                                <span className="text-[10px] font-bold">Neon Conversion</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewDesignKey('neon-conversion')}
                                className="text-[9px] font-semibold text-theme-accent hover:underline text-center"
                              >
                                Lihat Contoh Desain
                              </button>
                            </div>
                            <div className="flex flex-col gap-1.5 flex-shrink-0 w-36 snap-start">
                              <button
                                type="button"
                                onClick={() => handleSelectDesign('clean-trust')}
                                className={`w-full p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${designKey === 'clean-trust' ? 'border-theme-accent bg-theme-accent/10 text-theme-accent' : 'border-theme-border bg-theme-bg/50 text-theme-text-sec'
                                  }`}
                              >
                                <span className="text-lg">🛡️</span>
                                <span className="text-[10px] font-bold">Clean Trust</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewDesignKey('clean-trust')}
                                className="text-[9px] font-semibold text-theme-accent hover:underline text-center"
                              >
                                Lihat Contoh Desain
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Brief Deskripsi Campaign */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider">
                            Brief Deskripsi Campaign (Context AI)
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Jelaskan produk/penawaran, target audiens, dan nilai jual utama Anda secara detail sebagai acuan untuk AI Copywriter..."
                            value={campaignBrief}
                            onChange={(e) => setCampaignBrief(e.target.value)}
                            className="block w-full px-3 py-2.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none resize-none leading-relaxed"
                          />
                          <p className="text-[8px] text-theme-text-muted leading-tight">
                            * Wajib diisi agar fitur <b>AI Generate</b> di masing-masing bagian dapat menghasilkan copywriting yang akurat.
                          </p>
                        </div>

                        {/* HERO SECTION FORM */}
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider">1. Hero Section</div>
                            {renderAICampaignButton('campaign_hero', isGeneratingCampaignHero)}
                          </div>
                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Headline Utama <span className="text-red-500 font-bold ml-0.5">*</span></label>
                            <textarea
                              rows={2}
                              required
                              placeholder="Tulis headline yang menghentak dan fokus ke solusi..."
                              value={campaignHeadline}
                              onChange={(e) => setCampaignHeadline(e.target.value)}
                              className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none resize-none leading-relaxed"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Sub-headline <span className="text-red-500 font-bold ml-0.5">*</span></label>
                            <textarea
                              rows={2}
                              required
                              placeholder="Jelaskan detail pendukung dari headline utama Anda..."
                              value={campaignSubheadline}
                              onChange={(e) => setCampaignSubheadline(e.target.value)}
                              className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none resize-none leading-relaxed"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Teks Tombol CTA Utama <span className="text-red-500 font-bold ml-0.5">*</span></label>
                            <input
                              type="text"
                              required
                              placeholder="Teks tombol, e.g. Dapatkan Sekarang!"
                              value={campaignCtaText}
                              onChange={(e) => setCampaignCtaText(e.target.value)}
                              className="block w-full px-3 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
                          </div>

                          {/* Hero Background Image */}
                          <ImagePickerField
                            checkboxId="generateCampaignHero"
                            checkboxLabel="Gunakan Foto Background Hero Section"
                            unsplashQuery="business,workspace,marketing,success"
                            imageUrl={campaignHeroImage}
                            onImageChange={(val) => {
                              if (!val && campaignHeroImage && campaignHeroImageSource === 'upload') {
                                handleDeleteImage(campaignHeroImage);
                              }
                              setCampaignHeroImage(val);
                            }}
                            apiToken={session?.access_token}
                            apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
                            isEnabled={generateCampaignHero}
                            onEnabledChange={setGenerateCampaignHero}
                            source={campaignHeroImageSource}
                            onSourceChange={setCampaignHeroImageSource}
                            onUpload={handleUploadImage}
                            uploadType="campaignHero"
                          />
                        </div>

                        {/* CONTACT SECTION FORM */}
                        <div className="space-y-2.5">
                          <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider">2. Kontak & Tujuan CTA</div>
                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">WhatsApp Checkout (Format: 628xxx) <span className="text-red-500 font-bold ml-0.5">*</span></label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 6281234567890"
                              value={campaignWhatsapp}
                              onChange={(e) => setCampaignWhatsapp(e.target.value)}
                              className="block w-full px-3 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Link Kustom Tujuan Tombol CTA (Opsional)</label>
                            <input
                              type="text"
                              placeholder="e.g. https://shopee.co.id/toko-saya"
                              value={campaignCtaUrl}
                              onChange={(e) => setCampaignCtaUrl(e.target.value)}
                              className="block w-full px-3 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
                            <p className="text-[7.5px] text-theme-text-muted mt-1 leading-normal">
                              Jika diisi, klik tombol CTA akan mengarah ke link ini (misal Shopee, Tokopedia, dll). Jika dikosongkan, tombol otomatis mengarah ke WhatsApp di atas.
                            </p>
                          </div>
                        </div>

                        {/* PROBLEMS SECTION FORM */}
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider">3. Bagian Masalah (Problem & Agitation)</div>
                            {renderAICampaignButton('campaign_problems', isGeneratingCampaignProblems)}
                          </div>
                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Judul Bagian Masalah</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Hambatan Utama Anda"
                              value={campaignProblemsTitle}
                              onChange={(e) => setCampaignProblemsTitle(e.target.value)}
                              className="block w-full px-3 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[8px] font-semibold text-theme-text-sec">Daftar Poin Masalah (Minimal 1, Maksimal 3)</label>
                            {campaignProblemsList.map((item, index) => (
                              <input
                                key={index}
                                type="text"
                                placeholder={`Masalah #${index + 1}`}
                                value={item}
                                onChange={(e) => {
                                  const updated = [...campaignProblemsList];
                                  updated[index] = e.target.value;
                                  setCampaignProblemsList(updated);
                                }}
                                className="block w-full px-3 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                              />
                            ))}
                            <div className="flex gap-2">
                              {campaignProblemsList.length < 6 && (
                                <button
                                  type="button"
                                  onClick={() => setCampaignProblemsList(prev => [...prev, ''])}
                                  className="text-[9px] font-bold text-theme-accent hover:underline"
                                >
                                  + Tambah Poin
                                </button>
                              )}
                              {campaignProblemsList.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setCampaignProblemsList(prev => prev.slice(0, -1))}
                                  className="text-[9px] font-bold text-red-400 hover:underline"
                                >
                                  - Kurangi Poin
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* SOLUTIONS & BENEFITS FORM */}
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider">4. Bagian Solusi & Manfaat</div>
                            {renderAICampaignButton('campaign_benefits', isGeneratingCampaignBenefits)}
                          </div>
                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Judul Bagian Solusi <span className="text-red-500 font-bold ml-0.5">*</span></label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Solusi Kami"
                              value={campaignSolutionsTitle}
                              onChange={(e) => setCampaignSolutionsTitle(e.target.value)}
                              className="block w-full px-3 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Teks Pengantar Solusi</label>
                            <textarea
                              rows={2}
                              placeholder="Teks singkat memperkenalkan solusi (opsional)..."
                              value={campaignSolutionsIntro}
                              onChange={(e) => setCampaignSolutionsIntro(e.target.value)}
                              className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none resize-none leading-relaxed"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="block text-[8px] font-semibold text-theme-text-sec">Poin-Poin Manfaat Utama * (Max 3)</label>
                            {campaignBenefits.map((benefit, index) => (
                              <div key={index} className="bg-theme-bg/30 p-2.5 rounded-xl border border-theme-border space-y-1.5">
                                <input
                                  type="text"
                                  required
                                  placeholder={`Nama Manfaat #${index + 1} *`}
                                  value={benefit.title}
                                  onChange={(e) => {
                                    const updated = [...campaignBenefits];
                                    updated[index] = { ...updated[index], title: e.target.value };
                                    setCampaignBenefits(updated);
                                  }}
                                  className="block w-full px-2 py-1 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text placeholder-theme-text-muted focus:outline-none font-bold"
                                />
                                <textarea
                                  rows={2}
                                  required
                                  placeholder={`Penjelasan Manfaat #${index + 1} *`}
                                  value={benefit.desc}
                                  onChange={(e) => {
                                    const updated = [...campaignBenefits];
                                    updated[index] = { ...updated[index], desc: e.target.value };
                                    setCampaignBenefits(updated);
                                  }}
                                  className="block w-full px-2 py-1 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-[10px] text-theme-text placeholder-theme-text-muted focus:outline-none resize-none"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* SOCIAL PROOF SECTION FORM */}
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider">5. Testimoni & Elemen Kepercayaan</div>
                            {renderAICampaignButton('campaign_testimonials', isGeneratingCampaignTestimonials)}
                          </div>
                          <div className="space-y-3">
                            <label className="block text-[8px] font-semibold text-theme-text-sec">Contoh Testimoni Pelanggan * (Max 2)</label>
                            {campaignTestimonials.map((t, index) => (
                              <div key={index} className="bg-theme-bg/30 p-2.5 rounded-xl border border-theme-border space-y-1.5">
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    required
                                    placeholder={`Nama Testi #${index + 1} *`}
                                    value={t.name}
                                    onChange={(e) => {
                                      const updated = [...campaignTestimonials];
                                      updated[index] = { ...updated[index], name: e.target.value };
                                      setCampaignTestimonials(updated);
                                    }}
                                    className="block w-full px-2 py-1 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                                  />
                                  <input
                                    type="text"
                                    placeholder={`Pekerjaan/Role #${index + 1}`}
                                    value={t.role}
                                    onChange={(e) => {
                                      const updated = [...campaignTestimonials];
                                      updated[index] = { ...updated[index], role: e.target.value };
                                      setCampaignTestimonials(updated);
                                    }}
                                    className="block w-full px-2 py-1 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                                  />
                                </div>
                                <textarea
                                  rows={2}
                                  required
                                  placeholder={`Isi Testi #${index + 1} *`}
                                  value={t.content}
                                  onChange={(e) => {
                                    const updated = [...campaignTestimonials];
                                    updated[index] = { ...updated[index], content: e.target.value };
                                    setCampaignTestimonials(updated);
                                  }}
                                  className="block w-full px-2 py-1 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-[10px] text-theme-text placeholder-theme-text-muted focus:outline-none resize-none"
                                />
                              </div>
                            ))}
                          </div>
                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Informasi Garansi (Opsional)</label>
                            <textarea
                              rows={2}
                              placeholder="Tulis jaminan garansi atau pembangun kredibilitas..."
                              value={campaignGuarantee}
                              onChange={(e) => setCampaignGuarantee(e.target.value)}
                              className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none resize-none leading-relaxed"
                            />
                          </div>
                        </div>

                        {/* CLOSING SECTION FORM */}
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider">6. Penutup & Urgensi</div>
                            {renderAICampaignButton('campaign_urgency', isGeneratingCampaignUrgency)}
                          </div>
                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Teks Urgensi / Kelangkaan (Scarcity) <span className="text-red-500 font-bold ml-0.5">*</span></label>
                            <textarea
                              rows={2}
                              required
                              placeholder="e.g. Diskon 70% hanya untuk 100 pembeli pertama..."
                              value={campaignUrgency}
                              onChange={(e) => setCampaignUrgency(e.target.value)}
                              className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none resize-none leading-relaxed"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Teks Tombol CTA Penutup <span className="text-red-500 font-bold ml-0.5">*</span></label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Dapatkan Sekarang!"
                              value={campaignClosingCta}
                              onChange={(e) => setCampaignClosingCta(e.target.value)}
                              className="block w-full px-3 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* FAQ SECTION FORM */}
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider">7. Pertanyaan yang Sering Diajukan (FAQ - Opsional)</div>
                            {renderAICampaignButton('campaign_faq', isGeneratingCampaignFaq)}
                          </div>
                          <div className="space-y-3">
                            {campaignFaqs.map((faq, index) => (
                              <div key={index} className="bg-theme-bg/30 p-2.5 rounded-xl border border-theme-border space-y-1.5 relative">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (campaignFaqs.length > 1) {
                                      setCampaignFaqs(prev => prev.filter((_, idx) => idx !== index));
                                    } else {
                                      setCampaignFaqs([{ question: '', answer: '' }]);
                                    }
                                  }}
                                  className="absolute top-2 right-2 text-[8px] font-bold text-red-400 hover:underline cursor-pointer"
                                >
                                  Hapus
                                </button>
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <label className="block text-[8px] font-semibold text-theme-text-sec">Pertanyaan #${index + 1}</label>
                                    <span className="text-[7px] text-theme-text-muted">{(faq.question || '').length}/120</span>
                                  </div>
                                  <input
                                    type="text"
                                    maxLength={120}
                                    placeholder={`e.g. Apakah ada garansi uang kembali?`}
                                    value={faq.question}
                                    onChange={(e) => {
                                      const updated = [...campaignFaqs];
                                      updated[index] = { ...updated[index], question: e.target.value };
                                      setCampaignFaqs(updated);
                                    }}
                                    className="block w-full px-2 py-1 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <label className="block text-[8px] font-semibold text-theme-text-sec">Jawaban #${index + 1}</label>
                                    <span className="text-[7px] text-theme-text-muted">{(faq.answer || '').length}/200</span>
                                  </div>
                                  <textarea
                                    rows={2}
                                    maxLength={200}
                                    placeholder={`e.g. Ya, kami memberikan garansi 100% uang kembali jika...`}
                                    value={faq.answer}
                                    onChange={(e) => {
                                      const updated = [...campaignFaqs];
                                      updated[index] = { ...updated[index], answer: e.target.value };
                                      setCampaignFaqs(updated);
                                    }}
                                    className="block w-full px-2 py-1 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-[10px] text-theme-text placeholder-theme-text-muted focus:outline-none resize-none"
                                  />
                                </div>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              {campaignFaqs.length < 5 && (
                                <button
                                  type="button"
                                  onClick={() => setCampaignFaqs(prev => [...prev, { question: '', answer: '' }])}
                                  className="text-[9px] font-bold text-theme-accent hover:underline cursor-pointer"
                                >
                                  + Tambah FAQ (Maksimal 5)
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* E-Course Fields */}
                    {templateType === 'e-course' && (
                      <div className="space-y-5 border-t border-theme-border pt-4">

                        {/* Design Picker */}
                        <div>
                          <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">
                            Pilih Desain Tema
                          </label>
                          <div className="flex gap-3">
                            <div className="flex flex-col gap-1.5 flex-shrink-0 w-36">
                              <button
                                type="button"
                                onClick={() => handleSelectDesign('purple-academy')}
                                className={`w-full p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                                  designKey === 'purple-academy'
                                    ? 'border-theme-accent bg-theme-accent/10 text-theme-accent'
                                    : 'border-theme-border hover:border-theme-text-sec text-theme-text-muted bg-theme-bg'
                                }`}
                              >
                                <span className="text-xl">💜</span>
                                <div className="text-[10px] font-black tracking-wide uppercase">Purple Academy</div>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewDesignKey('purple-academy')}
                                className="text-[9px] font-semibold text-theme-accent hover:underline text-center"
                              >
                                Lihat Contoh Desain
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* General Info */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide">
                            <span>ℹ️</span> Informasi Dasar E-Course
                          </h3>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Nama Kelas / E-Course <span className="text-red-500 font-bold ml-0.5">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Contoh: Digital Marketing Mastery"
                              value={courseName}
                              onChange={(e) => setCourseName(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Deskripsi Brief E-Course (Digunakan sebagai Konteks AI)
                            </label>
                            <textarea
                              placeholder="Tuliskan penjelasan singkat e-course ini, materi utamanya, dan apa tujuan akhirnya..."
                              value={courseBrief}
                              onChange={(e) => setCourseBrief(e.target.value)}
                              rows={3}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none transition-colors resize-y"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Target Audiens (Opsional)
                            </label>
                            <input
                              type="text"
                              placeholder="Contoh: Pemula, UMKM, Freelancer"
                              value={courseTargetAudience}
                              onChange={(e) => setCourseTargetAudience(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Gaya Bahasa Copywriting (Tone)
                            </label>
                            <select
                              value={courseTone}
                              onChange={(e) => setCourseTone(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            >
                              <option value="persuasive">Persuasif & Manfaat Nyata</option>
                              <option value="urgency">Mendesak (FOMO & Promo)</option>
                              <option value="professional">Profesional & Edukatif</option>
                              <option value="conversational">Santai & Bersahabat</option>
                            </select>
                          </div>
                        </div>

                        {/* Hero Section */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide">
                              <span>🚀</span> Hero / Bagian Utama
                            </h3>
                            {renderAIECourseButton('e_course_hero', isGeneratingECourseHero)}
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Nama Brand / Akademi (Header)
                            </label>
                            <input
                              type="text"
                              placeholder="Contoh: E-COURSE ACADEMY"
                              value={eCourseBrandName}
                              onChange={(e) => setECourseBrandName(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Headline Promosi
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Headline utama halaman..."
                              value={eCourseHeroHeadline}
                              onChange={(e) => setECourseHeroHeadline(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Sub-Headline (Detail Singkat)
                            </label>
                            <textarea
                              required
                              placeholder="Penjelasan ringkas manfaat kelas..."
                              value={eCourseHeroSubheadline}
                              onChange={(e) => setECourseHeroSubheadline(e.target.value)}
                              rows={2}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors resize-y"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Teks Tombol CTA
                            </label>
                            <input
                              type="text"
                              required
                              value={eCourseHeroCtaText}
                              onChange={(e) => setECourseHeroCtaText(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          
                          {/* Countdown Timer Config */}
                          <div className="bg-theme-bg-muted rounded-xl p-3 border border-theme-border/40 space-y-3 mt-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="eCourseCountdownEnabled"
                                checked={eCourseCountdownEnabled}
                                onChange={(e) => setECourseCountdownEnabled(e.target.checked)}
                                className="h-4 w-4 rounded border-theme-border bg-theme-bg text-theme-accent focus:ring-theme-accent cursor-pointer"
                              />
                              <label htmlFor="eCourseCountdownEnabled" className="text-[10px] font-bold text-theme-text cursor-pointer">
                                Aktifkan Countdown Timer (Urgency)
                              </label>
                            </div>

                            {eCourseCountdownEnabled && (
                              <div className="space-y-3 pt-2 border-t border-theme-border/20">
                                <div>
                                  <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                                    Judul / Teks Countdown
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Contoh: Sisa Waktu Promo Hari Ini:"
                                    value={eCourseCountdownTitle}
                                    onChange={(e) => setECourseCountdownTitle(e.target.value)}
                                    className="block w-full px-3.5 py-2.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                                    Tipe Countdown
                                  </label>
                                  <div className="flex gap-4">
                                    <label className="flex items-center gap-1.5 text-xs text-theme-text cursor-pointer">
                                      <input
                                        type="radio"
                                        name="eCourseCountdownType"
                                        value="end_of_day"
                                        checked={eCourseCountdownType === 'end_of_day'}
                                        onChange={() => setECourseCountdownType('end_of_day')}
                                        className="h-3 w-3 border-theme-border text-theme-accent"
                                      />
                                      Setiap Hari (Reset Tengah Malam)
                                    </label>
                                    <label className="flex items-center gap-1.5 text-xs text-theme-text cursor-pointer">
                                      <input
                                        type="radio"
                                        name="eCourseCountdownType"
                                        value="fixed"
                                        checked={eCourseCountdownType === 'fixed'}
                                        onChange={() => setECourseCountdownType('fixed')}
                                        className="h-3 w-3 border-theme-border text-theme-accent"
                                      />
                                      Tanggal Spesifik (Statis)
                                    </label>
                                  </div>
                                </div>

                                {eCourseCountdownType === 'fixed' && (
                                  <div>
                                    <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                                      Tanggal Target (Statis)
                                    </label>
                                    <input
                                      type="datetime-local"
                                      value={eCourseCountdownTargetDate}
                                      onChange={(e) => setECourseCountdownTargetDate(e.target.value)}
                                      className="block w-full px-3.5 py-2.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Hero Image Picker with Cartoon Fallback Info */}
                          <ImagePickerField
                            checkboxId="generateECourseHeroImage"
                            checkboxLabel="Gunakan Foto Kustom (jika tidak dicentang, grafis kartun default akan digunakan)"
                            unsplashQuery="education,classroom,student,online learning"
                            imageUrl={eCourseHeroImage}
                            onImageChange={(val) => {
                              if (!val && eCourseHeroImage && eCourseHeroImageSource === 'upload') {
                                handleDeleteImage(eCourseHeroImage);
                              }
                              setECourseHeroImage(val);
                            }}
                            apiToken={session?.access_token}
                            apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
                            isEnabled={generateECourseHeroImage}
                            onEnabledChange={setGenerateECourseHeroImage}
                            source={eCourseHeroImageSource}
                            onSourceChange={setECourseHeroImageSource}
                            onUpload={handleUploadImage}
                            uploadType="eCourseHero"
                          />
                        </div>

                        {/* Problems Section */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide">
                              <span>⚠️</span> Masalah & Agitasi
                            </h3>
                            {renderAIECourseButton('e_course_problems', isGeneratingECourseProblems)}
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Judul Bagian Masalah
                            </label>
                            <input
                              type="text"
                              required
                              value={eCourseProblemsTitle}
                              onChange={(e) => setECourseProblemsTitle(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">
                              Daftar Masalah (Maksimal 3)
                            </label>
                            {eCourseProblemsList.map((prob, idx) => (
                              <input
                                key={idx}
                                type="text"
                                placeholder={`Contoh Masalah ${idx + 1}...`}
                                value={prob}
                                onChange={(e) => {
                                  const next = [...eCourseProblemsList];
                                  next[idx] = e.target.value;
                                  setECourseProblemsList(next);
                                }}
                                className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                              />
                            ))}
                          </div>
                        </div>

                        {/* Solutions Section */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide">
                              <span>💡</span> Solusi & Value Proposition
                            </h3>
                            {renderAIECourseButton('e_course_solutions', isGeneratingECourseSolutions)}
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Judul Bagian Solusi
                            </label>
                            <input
                              type="text"
                              required
                              value={eCourseSolutionsTitle}
                              onChange={(e) => setECourseSolutionsTitle(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Kalimat Pengantar Solusi
                            </label>
                            <input
                              type="text"
                              placeholder="Kalimat pengantar kelas..."
                              value={eCourseSolutionsIntro}
                              onChange={(e) => setECourseSolutionsIntro(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">
                              Poin-poin Solusi (Maksimal 3)
                            </label>
                            {eCourseSolutionsList.map((sol, idx) => (
                              <input
                                key={idx}
                                type="text"
                                placeholder={`Poin Solusi ${idx + 1}...`}
                                value={sol}
                                onChange={(e) => {
                                  const next = [...eCourseSolutionsList];
                                  next[idx] = e.target.value;
                                  setECourseSolutionsList(next);
                                }}
                                className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                              />
                            ))}
                          </div>
                        </div>

                        {/* Audience Section */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide">
                              <span>🎯</span> Target Audiens / Calon Peserta
                            </h3>
                            {renderAIECourseButton('e_course_audience', isGeneratingECourseAudience)}
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Judul Bagian Audiens
                            </label>
                            <input
                              type="text"
                              required
                              value={eCourseAudienceTitle}
                              onChange={(e) => setECourseAudienceTitle(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">
                              Target Kategori Peserta (Maksimal 3)
                            </label>
                            {eCourseAudienceList.map((aud, idx) => (
                              <input
                                key={idx}
                                type="text"
                                placeholder={`Contoh: Pelaku Bisnis, Mahasiswa, Freelancer`}
                                value={aud}
                                onChange={(e) => {
                                  const next = [...eCourseAudienceList];
                                  next[idx] = e.target.value;
                                  setECourseAudienceList(next);
                                }}
                                className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                              />
                            ))}
                          </div>
                        </div>

                        {/* Mentor Section */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide">
                              <span>👨‍🏫</span> Profil Mentor / Instruktur
                            </h3>
                            {renderAIECourseButton('e_course_mentor', isGeneratingECourseMentor)}
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Nama Mentor
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Nama lengkap mentor..."
                              value={eCourseMentorName}
                              onChange={(e) => setECourseMentorName(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Peran / Jabatan Profesional
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Contoh: Digital Marketer at Tech Company"
                              value={eCourseMentorRole}
                              onChange={(e) => setECourseMentorRole(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Bio Singkat / Kredibilitas Mentor
                            </label>
                            <textarea
                              required
                              placeholder="Latar belakang pengalaman dan keahlian mentor..."
                              value={eCourseMentorDesc}
                              onChange={(e) => setECourseMentorDesc(e.target.value)}
                              rows={2}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors resize-y"
                            />
                          </div>
                          <ImagePickerField
                            checkboxId="generateECourseMentorImage"
                            checkboxLabel="Gunakan Foto Kustom Mentor (jika tidak dicentang, avatar kartun default akan digunakan)"
                            unsplashQuery="portrait,teacher,lecturer,avatar"
                            imageUrl={eCourseMentorAvatar}
                            onImageChange={(val) => {
                              if (!val && eCourseMentorAvatar && eCourseMentorImageSource === 'upload') {
                                handleDeleteImage(eCourseMentorAvatar);
                              }
                              setECourseMentorAvatar(val);
                            }}
                            apiToken={session?.access_token}
                            apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
                            isEnabled={generateECourseMentorImage}
                            onEnabledChange={setGenerateECourseMentorImage}
                            source={eCourseMentorImageSource}
                            onSourceChange={setECourseMentorImageSource}
                            onUpload={handleUploadImage}
                            uploadType="eCourseMentor"
                          />
                        </div>

                        {/* Curriculum Section */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide">
                              <span>📖</span> Kurikulum & Modul Pembelajaran
                            </h3>
                            {renderAIECourseButton('e_course_curriculum', isGeneratingECourseCurriculum)}
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Judul Bagian Kurikulum
                            </label>
                            <input
                              type="text"
                              required
                              value={eCourseCurriculumTitle}
                              onChange={(e) => setECourseCurriculumTitle(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">
                              Daftar Modul Belajar <span className="text-red-500 font-bold ml-0.5">*</span>
                            </label>
                            {eCourseCurriculumModules.map((mod, idx) => (
                              <div key={idx} className="bg-theme-bg-muted rounded-xl p-3 border border-theme-border/40 space-y-2 relative">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-theme-text-sec">Modul #0{idx + 1} *</span>
                                  {eCourseCurriculumModules.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => setECourseCurriculumModules(prev => prev.filter((_, i) => i !== idx))}
                                      className="text-[9px] font-bold text-red-400 hover:underline cursor-pointer"
                                    >
                                      Hapus
                                    </button>
                                  )}
                                </div>
                                <input
                                  type="text"
                                  required
                                  placeholder="Judul Modul... *"
                                  value={mod.title}
                                  onChange={(e) => {
                                    const next = [...eCourseCurriculumModules];
                                    next[idx].title = e.target.value;
                                    setECourseCurriculumModules(next);
                                  }}
                                  className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none"
                                />
                                <input
                                  type="text"
                                  required
                                  placeholder="Deskripsi Singkat Materi... *"
                                  value={mod.desc}
                                  onChange={(e) => {
                                    const next = [...eCourseCurriculumModules];
                                    next[idx].desc = e.target.value;
                                    setECourseCurriculumModules(next);
                                  }}
                                  className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none"
                                />
                              </div>
                            ))}
                            {eCourseCurriculumModules.length < 5 && (
                              <button
                                type="button"
                                onClick={() => setECourseCurriculumModules(prev => [...prev, { title: '', desc: '' }])}
                                className="text-[9px] font-bold text-theme-accent hover:underline cursor-pointer"
                              >
                                + Tambah Modul Kurikulum
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Benefits Section */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide">
                              <span>⭐</span> Keuntungan & Fasilitas
                            </h3>
                            {renderAIECourseButton('e_course_benefits', isGeneratingECourseBenefits)}
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Judul Bagian Benefit
                            </label>
                            <input
                              type="text"
                              required
                              value={eCourseBenefitsTitle}
                              onChange={(e) => setECourseBenefitsTitle(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">
                              Daftar Keuntungan / Fasilitas <span className="text-red-500 font-bold ml-0.5">*</span> (Maksimal 3)
                            </label>
                            {eCourseBenefitsList.map((ben, idx) => (
                              <div key={idx} className="bg-theme-bg-muted rounded-xl p-3 border border-theme-border/40 space-y-2">
                                <span className="text-[10px] font-bold text-theme-text-sec">Benefit #0{idx + 1} *</span>
                                <input
                                  type="text"
                                  required
                                  placeholder="Nama Benefit (e.g. Akses Selamanya) *"
                                  value={ben.title}
                                  onChange={(e) => {
                                    const next = [...eCourseBenefitsList];
                                    next[idx].title = e.target.value;
                                    setECourseBenefitsList(next);
                                  }}
                                  className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none"
                                />
                                <input
                                  type="text"
                                  required
                                  placeholder="Deskripsi Ringkas Benefit... *"
                                  value={ben.desc}
                                  onChange={(e) => {
                                    const next = [...eCourseBenefitsList];
                                    next[idx].desc = e.target.value;
                                    setECourseBenefitsList(next);
                                  }}
                                  className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bonuses Section */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide">
                              <span>🎁</span> Bonus Spesial Eksklusif
                            </h3>
                            {renderAIECourseButton('e_course_bonuses', isGeneratingECourseBonuses)}
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Judul Bagian Bonus
                            </label>
                            <input
                              type="text"
                              required
                              value={eCourseBonusesTitle}
                              onChange={(e) => setECourseBonusesTitle(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">
                              Daftar Bonus
                            </label>
                            {eCourseBonusesList.map((bon, idx) => (
                              <div key={idx} className="bg-theme-bg-muted rounded-xl p-3 border border-theme-border/40 space-y-2">
                                <span className="text-[10px] font-bold text-theme-text-sec">Bonus #0{idx + 1}</span>
                                <input
                                  type="text"
                                  required
                                  placeholder="Nama Bonus (e.g. Ebook Premium)"
                                  value={bon.title}
                                  onChange={(e) => {
                                    const next = [...eCourseBonusesList];
                                    next[idx].title = e.target.value;
                                    setECourseBonusesList(next);
                                  }}
                                  className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none"
                                />
                                <input
                                  type="text"
                                  required
                                  placeholder="Penjelasan Isi Bonus..."
                                  value={bon.desc}
                                  onChange={(e) => {
                                    const next = [...eCourseBonusesList];
                                    next[idx].desc = e.target.value;
                                    setECourseBonusesList(next);
                                  }}
                                  className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Pricing / Checkout Section */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide">
                              <span>💰</span> Investasi & Harga Kelas
                            </h3>
                            {renderAIECourseButton('e_course_pricing', isGeneratingECoursePricing)}
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Judul Investasi Belajar
                            </label>
                            <input
                              type="text"
                              required
                              value={eCoursePricingTitle}
                              onChange={(e) => setECoursePricingTitle(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3.5">
                            <div>
                              <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                                Harga Normal (Dicoret)
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g., Rp 999.000"
                                value={eCoursePricingOriginal}
                                onChange={(e) => setECoursePricingOriginal(e.target.value)}
                                className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                                Harga Promo (Aktif)
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g., Rp 199.000"
                                value={eCoursePricingDiscounted}
                                onChange={(e) => setECoursePricingDiscounted(e.target.value)}
                                className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Teks Tombol Pembelian
                            </label>
                            <input
                              type="text"
                              required
                              value={eCoursePricingCtaText}
                              onChange={(e) => setECoursePricingCtaText(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">
                              Fasilitas / Akses Belajar (Maksimal 3)
                            </label>
                            {eCoursePricingFeatures.map((feat, idx) => (
                              <input
                                key={idx}
                                type="text"
                                placeholder={`Fasilitas ${idx + 1}...`}
                                value={feat}
                                onChange={(e) => {
                                  const next = [...eCoursePricingFeatures];
                                  next[idx] = e.target.value;
                                  setECoursePricingFeatures(next);
                                }}
                                className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                              />
                            ))}
                          </div>
                        </div>

                        {/* Testimonials Section */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide">
                              <span>💬</span> Ulasan / Testimoni Alumni
                            </h3>
                            {renderAIECourseButton('e_course_testimonials', isGeneratingECourseTestimonials)}
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Judul Bagian Testimoni
                            </label>
                            <input
                              type="text"
                              required
                              value={eCourseTestimonialsTitle}
                              onChange={(e) => setECourseTestimonialsTitle(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">
                              Ulasan Alumni (Maksimal 2)
                            </label>
                            {eCourseTestimonialsList.map((test, idx) => (
                              <div key={idx} className="bg-theme-bg-muted rounded-xl p-3 border border-theme-border/40 space-y-2">
                                <span className="text-[10px] font-bold text-theme-text-sec">Alumni #0{idx + 1}</span>
                                <input
                                  type="text"
                                  required
                                  placeholder="Nama Alumni..."
                                  value={test.name}
                                  onChange={(e) => {
                                    const next = [...eCourseTestimonialsList];
                                    next[idx].name = e.target.value;
                                    setECourseTestimonialsList(next);
                                  }}
                                  className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none"
                                />
                                <input
                                  type="text"
                                  placeholder="Pekerjaan / Alumni ke-..."
                                  value={test.role}
                                  onChange={(e) => {
                                    const next = [...eCourseTestimonialsList];
                                    next[idx].role = e.target.value;
                                    setECourseTestimonialsList(next);
                                  }}
                                  className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none"
                                />
                                <textarea
                                  required
                                  placeholder="Isi Ulasan Testimoni..."
                                  value={test.content}
                                  onChange={(e) => {
                                    const next = [...eCourseTestimonialsList];
                                    next[idx].content = e.target.value;
                                    setECourseTestimonialsList(next);
                                  }}
                                  rows={2}
                                  className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none resize-y"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide">
                              <span>❓</span> Tanya Jawab (FAQ)
                            </h3>
                            {renderAIECourseButton('e_course_faq', isGeneratingECourseFaq)}
                          </div>
                          <div className="space-y-3">
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">
                              Daftar Pertanyaan & Jawaban
                            </label>
                            {eCourseFaqs.map((faq, idx) => (
                              <div key={idx} className="bg-theme-bg-muted rounded-xl p-3 border border-theme-border/40 space-y-2 relative">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-theme-text-sec">Tanya Jawab #{idx + 1}</span>
                                  {eCourseFaqs.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => setECourseFaqs(prev => prev.filter((_, i) => i !== idx))}
                                      className="text-[9px] font-bold text-red-400 hover:underline cursor-pointer"
                                    >
                                      Hapus
                                    </button>
                                  )}
                                </div>
                                <input
                                  type="text"
                                  required
                                  placeholder="Pertanyaan..."
                                  value={faq.question}
                                  onChange={(e) => {
                                    const next = [...eCourseFaqs];
                                    next[idx].question = e.target.value;
                                    setECourseFaqs(next);
                                  }}
                                  className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none"
                                />
                                <input
                                  type="text"
                                  required
                                  placeholder="Jawaban..."
                                  value={faq.answer}
                                  onChange={(e) => {
                                    const next = [...eCourseFaqs];
                                    next[idx].answer = e.target.value;
                                    setECourseFaqs(next);
                                  }}
                                  className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none"
                                />
                              </div>
                            ))}
                            <div className="flex gap-2">
                              {eCourseFaqs.length < 5 && (
                                <button
                                  type="button"
                                  onClick={() => setECourseFaqs(prev => [...prev, { question: '', answer: '' }])}
                                  className="text-[9px] font-bold text-theme-accent hover:underline cursor-pointer"
                                >
                                  + Tambah FAQ (Maksimal 5)
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Contact & Footer */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide">
                            <span>📞</span> Kontak & Footer
                          </h3>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Nomor WhatsApp Aktif (Gunakan Format 62xxxx) <span className="text-red-500 font-bold ml-0.5">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Contoh: 628123456789"
                              value={eCourseWhatsapp}
                              onChange={(e) => setECourseWhatsapp(e.target.value.replace(/\D/g, ''))}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Custom Checkout CTA URL (Opsional)
                            </label>
                            <input
                              type="text"
                              placeholder="Contoh: checkout.mycourse.com/pay"
                              value={eCourseCtaUrl}
                              onChange={(e) => setECourseCtaUrl(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Teks Copyright Footer (Opsional)
                            </label>
                            <input
                              type="text"
                              placeholder="Contoh: © 2026 Digital Academy. Hak Cipta Dilindungi."
                              value={eCourseCopyright}
                              onChange={(e) => setECourseCopyright(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Jasa Fields */}
                    {templateType === 'jasa' && (
                      <div className="space-y-5 border-t border-theme-border pt-4">

                        {/* Design Picker */}
                        <div>
                          <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">
                            Pilih Desain Tema
                          </label>
                          <div className="flex gap-3">
                            <div className="flex flex-col gap-1.5 flex-shrink-0 w-36">
                              <button
                                type="button"
                                onClick={() => handleSelectDesign('professional-navy')}
                                className={`w-full p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                                  designKey === 'professional-navy'
                                    ? 'border-theme-accent bg-theme-accent/10 text-theme-accent'
                                    : 'border-theme-border hover:border-theme-text-sec text-theme-text-muted bg-theme-bg'
                                }`}
                              >
                                <span className="text-xl">🏢</span>
                                <div className="text-[10px] font-black tracking-wide uppercase">Professional Navy</div>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewDesignKey('professional-navy')}
                                className="text-[9px] font-semibold text-theme-accent hover:underline text-center"
                              >
                                Lihat Contoh Desain
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Brand Info */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide">
                              <span>🏷️</span> Informasi Brand / Penyedia Jasa
                            </h3>
                            {renderAIJasaButton('jasa_tagline', isGeneratingJasaTagline)}
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Nama Brand / Perusahaan <span className="text-red-500 font-bold ml-0.5">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g., DigitalPro Agency"
                              value={jasaBrandName}
                              onChange={(e) => setJasaBrandName(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Tagline Brand <span className="text-red-500 font-bold ml-0.5">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g., Solusi Digital Terpercaya untuk Bisnis Anda"
                              value={jasaBrandTagline}
                              onChange={(e) => setJasaBrandTagline(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Deskripsi Layanan (Brief AI) <span className="text-red-500 font-bold ml-0.5">*</span>
                            </label>
                            <textarea
                              rows={3}
                              required
                              placeholder="Ceritakan layanan utama, keunggulan, dan target klien Anda. Ini akan menjadi acuan AI untuk generate konten."
                              value={jasaBrandDesc}
                              onChange={(e) => setJasaBrandDesc(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none resize-none leading-relaxed transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Logo Brand (Opsional)
                            </label>
                            <div className="flex gap-2 items-center">
                              {jasaBrandLogo && <img src={jasaBrandLogo} alt="Logo" className="h-10 w-10 object-contain rounded border border-theme-border bg-white/10" />}
                              <label className="flex-1 bg-theme-card hover:bg-theme-bg border border-theme-border text-theme-text-sec hover:text-theme-text text-[9px] font-bold py-1.5 px-2.5 rounded-xl text-center cursor-pointer transition-colors">
                                {isUploadingJasaBrandLogo ? 'Mengunggah...' : 'Upload Logo'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={isUploadingJasaBrandLogo}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUploadImage(file, 'jasaBrandLogo');
                                  }}
                                />
                              </label>
                              {jasaBrandLogo && <button type="button" onClick={() => {
                                if (jasaBrandLogo) handleDeleteImage(jasaBrandLogo);
                                setJasaBrandLogo('');
                              }} className="text-[9px] text-red-400 hover:underline">Hapus</button>}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-theme-border/30">
                            <div>
                              <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                                Teks Tombol Header (Navbar)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., Hubungi Kami"
                                value={jasaBrandCtaText}
                                onChange={(e) => setJasaBrandCtaText(e.target.value)}
                                className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                              />
                              <p className="text-[8px] text-theme-text-muted mt-1">Kosongkan untuk menyembunyikan tombol.</p>
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                                Link Tombol Header (Navbar)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., https://wa.me/... atau #"
                                value={jasaBrandCtaUrl}
                                onChange={(e) => setJasaBrandCtaUrl(e.target.value)}
                                className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                              />
                              <p className="text-[8px] text-theme-text-muted mt-1">Gunakan link kustom, default ke link utama.</p>
                            </div>
                          </div>
                        </div>

                        {/* Hero Section */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide">
                              <span>🚀</span> Hero / Banner Utama
                            </h3>
                            {renderAIJasaButton('jasa_hero', isGeneratingJasaHero)}
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Headline Utama <span className="text-red-500 font-bold ml-0.5">*</span>
                            </label>
                            <input type="text" required placeholder="e.g., Wujudkan Bisnis Digital Impian Anda Bersama Kami" value={jasaHeroHeadline} onChange={(e) => setJasaHeroHeadline(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">Sub-headline</label>
                            <textarea rows={2} placeholder="Deskripsi singkat yang menjelaskan nilai utama layanan Anda..." value={jasaHeroSubheadline} onChange={(e) => setJasaHeroSubheadline(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none resize-none transition-colors" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">Teks CTA Utama</label>
                              <input type="text" value={jasaHeroCtaText} onChange={(e) => setJasaHeroCtaText(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">Teks CTA Sekunder</label>
                              <input type="text" value={jasaHeroCtaSecondaryText} onChange={(e) => setJasaHeroCtaSecondaryText(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                            </div>
                          </div>
                          <ImagePickerField
                            checkboxId="generateJasaHeroImage"
                            checkboxLabel="Gunakan Foto Hero"
                            unsplashQuery="professional service,business,team,corporate"
                            imageUrl={jasaHeroImage}
                            onImageChange={(val) => {
                              if (!val && jasaHeroImage && jasaHeroImageSource === 'upload') {
                                handleDeleteImage(jasaHeroImage);
                              }
                              setJasaHeroImage(val);
                            }}
                            apiToken={session?.access_token}
                            apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
                            isEnabled={generateJasaHeroImage}
                            onEnabledChange={setGenerateJasaHeroImage}
                            source={jasaHeroImageSource}
                            onSourceChange={setJasaHeroImageSource}
                            onUpload={handleUploadImage}
                            uploadType="jasaHero"
                          />
                        </div>

                        {/* Stats / Social Proof */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide">
                            <span>📊</span> Statistik Bisnis
                          </h3>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: 'Jumlah Klien', value: jasaSocialClientCount, set: setJasaSocialClientCount, labelField: jasaSocialLabelClients, setLabel: setJasaSocialLabelClients, labelPh: 'Klien Puas' },
                              { label: 'Project Selesai', value: jasaSocialProjectCount, set: setJasaSocialProjectCount, labelField: jasaSocialLabelProjects, setLabel: setJasaSocialLabelProjects, labelPh: 'Project Selesai' },
                              { label: 'Produk/Layanan', value: jasaSocialProductCount, set: setJasaSocialProductCount, labelField: jasaSocialLabelProducts, setLabel: setJasaSocialLabelProducts, labelPh: 'Produk Aktif' },
                            ].map((stat, i) => (
                              <div key={i} className="space-y-1.5">
                                <label className="block text-[8px] font-bold text-theme-text-sec uppercase">{stat.label}</label>
                                <input type="text" placeholder="e.g. 100+" value={stat.value} onChange={(e) => stat.set(e.target.value)} className="block w-full px-2 py-1.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-lg text-[10px] text-theme-text focus:outline-none" />
                                <input type="text" placeholder={stat.labelPh} value={stat.labelField} onChange={(e) => stat.setLabel(e.target.value)} className="block w-full px-2 py-1.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-lg text-[10px] text-theme-text focus:outline-none" />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* How It Works */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide"><span>⚙️</span> Cara Kerja</h3>
                            {renderAIJasaButton('jasa_how_it_works', isGeneratingJasaHowItWorks)}
                          </div>
                          <input type="text" placeholder="Judul bagian..." value={jasaHowItWorksTitle} onChange={(e) => setJasaHowItWorksTitle(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                          <div className="space-y-2">
                            {jasaHowItWorksSteps.map((step, idx) => (
                              <div key={idx} className="bg-theme-bg-muted rounded-xl p-3 border border-theme-border/40 space-y-2">
                                <span className="text-[9px] font-bold text-theme-text-sec">Langkah #{idx + 1}</span>
                                <input type="text" placeholder="Judul langkah..." value={step.title} onChange={(e) => { const n = [...jasaHowItWorksSteps]; n[idx].title = e.target.value; setJasaHowItWorksSteps(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                                <input type="text" placeholder="Deskripsi singkat..." value={step.desc} onChange={(e) => { const n = [...jasaHowItWorksSteps]; n[idx].desc = e.target.value; setJasaHowItWorksSteps(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                              </div>
                            ))}
                            {jasaHowItWorksSteps.length < 5 && <button type="button" onClick={() => setJasaHowItWorksSteps(p => [...p, { title: '', desc: '' }])} className="text-[9px] font-bold text-theme-accent hover:underline">+ Tambah Langkah</button>}
                          </div>
                        </div>

                        {/* About */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide"><span>👥</span> Tentang Kami</h3>
                            {renderAIJasaButton('jasa_about', isGeneratingJasaAbout)}
                          </div>
                          <input type="text" placeholder="Judul bagian..." value={jasaAboutTitle} onChange={(e) => setJasaAboutTitle(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                          <textarea rows={3} placeholder="Ceritakan tentang perusahaan/tim Anda..." value={jasaAboutDesc} onChange={(e) => setJasaAboutDesc(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none resize-none transition-colors" />
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">Teks Tombol Portofolio</label>
                              <input type="text" value={jasaAboutCtaPortfolioText} onChange={(e) => setJasaAboutCtaPortfolioText(e.target.value)} className="block w-full px-3 py-2 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">Teks Tombol Order</label>
                              <input type="text" value={jasaAboutCtaOrderText} onChange={(e) => setJasaAboutCtaOrderText(e.target.value)} className="block w-full px-3 py-2 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                            </div>
                          </div>
                          {/* About Photo */}
                          <ImagePickerField
                            checkboxId="generateJasaAboutImage"
                            checkboxLabel="Gunakan Foto About"
                            unsplashQuery="business meeting,office,workspace,corporate team"
                            imageUrl={jasaAboutImage}
                            onImageChange={(val) => {
                              if (!val && jasaAboutImage && jasaAboutImageSource === 'upload') {
                                handleDeleteImage(jasaAboutImage);
                              }
                              setJasaAboutImage(val);
                            }}
                            apiToken={session?.access_token}
                            apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
                            isEnabled={generateJasaAboutImage}
                            onEnabledChange={setGenerateJasaAboutImage}
                            source={jasaAboutImageSource}
                            onSourceChange={setJasaAboutImageSource}
                            onUpload={handleUploadImage}
                            uploadType="jasaAbout"
                          />
                        </div>

                        {/* Services */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide"><span>🛠️</span> Daftar Layanan <span className="text-red-500 ml-0.5">*</span></h3>
                            {renderAIJasaButton('jasa_services', isGeneratingJasaServices)}
                          </div>
                          <input type="text" placeholder="Judul bagian layanan..." value={jasaServicesTitle} onChange={(e) => setJasaServicesTitle(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                          <div className="space-y-3">
                            {jasaServicesList.map((svc, idx) => (
                              <div key={idx} className="bg-theme-bg-muted rounded-xl p-3 border border-theme-border/40 space-y-2 relative">
                                {jasaServicesList.length > 1 && <button type="button" onClick={() => setJasaServicesList(p => p.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-[9px] text-red-400 hover:underline">Hapus</button>}
                                <span className="text-[9px] font-bold text-theme-text-sec">Layanan #{idx + 1} *</span>
                                <input type="text" required placeholder="Nama Layanan..." value={svc.name} onChange={(e) => { const n = [...jasaServicesList]; n[idx].name = e.target.value; setJasaServicesList(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                                <textarea rows={2} required placeholder="Deskripsi layanan..." value={svc.desc} onChange={(e) => { const n = [...jasaServicesList]; n[idx].desc = e.target.value; setJasaServicesList(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none resize-none" />
                                <div>
                                  <label className="text-[8px] font-bold text-theme-text-sec">Fitur/Checklist (pisahkan Enter)</label>
                                  <textarea rows={2} placeholder="Fitur 1&#10;Fitur 2&#10;Fitur 3" value={(svc.features || []).join('\n')} onChange={(e) => { const n = [...jasaServicesList]; n[idx].features = e.target.value.split('\n').filter(Boolean); setJasaServicesList(n); }} className="block w-full px-3 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none resize-none mt-1" />
                                </div>
                              </div>
                            ))}
                            {jasaServicesList.length < 4 && <button type="button" onClick={() => setJasaServicesList(p => [...p, { name: '', desc: '', features: [], image_url: '' }])} className="text-[9px] font-bold text-theme-accent hover:underline">+ Tambah Layanan</button>}
                          </div>
                        </div>

                        {/* Why Us */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide"><span>✅</span> Keunggulan Kami</h3>
                            {renderAIJasaButton('jasa_why_us', isGeneratingJasaWhyUs)}
                          </div>
                          <input type="text" placeholder="Judul bagian..." value={jasaWhyUsTitle} onChange={(e) => setJasaWhyUsTitle(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                          <div className="space-y-2">
                            {jasaWhyUsPoints.map((pt, idx) => (
                              <div key={idx} className="bg-theme-bg-muted rounded-xl p-3 border border-theme-border/40 space-y-2">
                                <div className="flex justify-between"><span className="text-[9px] font-bold text-theme-text-sec">Keunggulan #{idx + 1}</span>{jasaWhyUsPoints.length > 2 && <button type="button" onClick={() => setJasaWhyUsPoints(p => p.filter((_, i) => i !== idx))} className="text-[9px] text-red-400 hover:underline">Hapus</button>}</div>
                                <input type="text" placeholder="Judul keunggulan..." value={pt.title} onChange={(e) => { const n = [...jasaWhyUsPoints]; n[idx].title = e.target.value; setJasaWhyUsPoints(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                                <input type="text" placeholder="Deskripsi singkat..." value={pt.desc} onChange={(e) => { const n = [...jasaWhyUsPoints]; n[idx].desc = e.target.value; setJasaWhyUsPoints(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                              </div>
                            ))}
                            {jasaWhyUsPoints.length < 6 && <button type="button" onClick={() => setJasaWhyUsPoints(p => [...p, { title: '', desc: '' }])} className="text-[9px] font-bold text-theme-accent hover:underline">+ Tambah Keunggulan</button>}
                          </div>
                        </div>

                        {/* Deliverables */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide"><span>📦</span> Yang Anda Dapatkan</h3>
                            {renderAIJasaButton('jasa_deliverables', isGeneratingJasaDeliverables)}
                          </div>
                          <input type="text" placeholder="Judul bagian..." value={jasaDeliverablesTitle} onChange={(e) => setJasaDeliverablesTitle(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                          <div className="space-y-2">
                            {jasaDeliverablesList.map((del, idx) => (
                              <div key={idx} className="bg-theme-bg-muted rounded-xl p-3 border border-theme-border/40 space-y-2">
                                <div className="flex justify-between"><span className="text-[9px] font-bold text-theme-text-sec">Deliverable #{idx + 1}</span>{jasaDeliverablesList.length > 1 && <button type="button" onClick={() => setJasaDeliverablesList(p => p.filter((_, i) => i !== idx))} className="text-[9px] text-red-400 hover:underline">Hapus</button>}</div>
                                <input type="text" placeholder="Nama deliverable..." value={del.title} onChange={(e) => { const n = [...jasaDeliverablesList]; n[idx].title = e.target.value; setJasaDeliverablesList(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                                <input type="text" placeholder="Deskripsi singkat..." value={del.desc} onChange={(e) => { const n = [...jasaDeliverablesList]; n[idx].desc = e.target.value; setJasaDeliverablesList(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                              </div>
                            ))}
                            {jasaDeliverablesList.length < 5 && <button type="button" onClick={() => setJasaDeliverablesList(p => [...p, { title: '', desc: '' }])} className="text-[9px] font-bold text-theme-accent hover:underline">+ Tambah Deliverable</button>}
                          </div>
                        </div>

                        {/* Pricing Plans */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide"><span>💰</span> Paket Harga</h3>
                            {renderAIJasaButton('jasa_pricing', isGeneratingJasaPricing)}
                          </div>
                          <div className="space-y-2">
                            <input type="text" placeholder="Judul bagian harga..." value={jasaPricingTitle} onChange={(e) => setJasaPricingTitle(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                            <input type="text" placeholder="Subjudul bagian harga..." value={jasaPricingSubtitle} onChange={(e) => setJasaPricingSubtitle(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                            
                            <label className="flex items-center gap-2 text-xs font-medium text-theme-text cursor-pointer py-1 select-none">
                              <input type="checkbox" checked={jasaPricingCtaOnly} onChange={(e) => setJasaPricingCtaOnly(e.target.checked)} className="w-4 h-4 rounded text-theme-accent border-theme-border focus:ring-theme-accent" />
                              Hanya Tombol CTA (Tanpa Paket)
                            </label>
                          </div>

                          {jasaPricingCtaOnly ? (
                            <div className="bg-theme-bg-muted rounded-xl p-3 border border-theme-border/40 space-y-2">
                              <span className="text-[9px] font-bold text-theme-text-sec">Konfigurasi Tombol</span>
                              <input type="text" placeholder="Teks Tombol Aksi (e.g. Daftar Sekarang)" value={jasaPricingCtaText} onChange={(e) => setJasaPricingCtaText(e.target.value)} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {jasaPricingPlans.map((plan, idx) => (
                                <div key={idx} className={`bg-theme-bg-muted rounded-xl p-3 border space-y-2 ${plan.highlighted ? 'border-theme-accent/50 bg-theme-accent/5' : 'border-theme-border/40'}`}>
                                  <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-bold text-theme-text-sec">Paket #{idx + 1}</span>
                                    <div className="flex items-center gap-2">
                                      <label className="flex items-center gap-1 text-[8px] text-theme-text-sec cursor-pointer"><input type="checkbox" checked={plan.highlighted} onChange={(e) => { const n = [...jasaPricingPlans]; n[idx].highlighted = e.target.checked; setJasaPricingPlans(n); }} className="w-3 h-3 rounded" /> Highlight</label>
                                      {jasaPricingPlans.length > 1 && <button type="button" onClick={() => setJasaPricingPlans(p => p.filter((_, i) => i !== idx))} className="text-[9px] text-red-400 hover:underline">Hapus</button>}
                                    </div>
                                  </div>
                                  <input type="text" placeholder="Nama paket (e.g. Paket Gold)" value={plan.name} onChange={(e) => { const n = [...jasaPricingPlans]; n[idx].name = e.target.value; setJasaPricingPlans(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                                  <input type="text" placeholder="Badge (e.g. Terpopuler) - opsional" value={plan.badge || ''} onChange={(e) => { const n = [...jasaPricingPlans]; n[idx].badge = e.target.value; setJasaPricingPlans(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                                  <div className="grid grid-cols-2 gap-2">
                                    <input type="text" placeholder="Harga Normal (dicoret) - opsional" value={plan.original_price || ''} onChange={(e) => { const n = [...jasaPricingPlans]; n[idx].original_price = e.target.value; setJasaPricingPlans(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                                    <input type="text" placeholder="Harga Promo (aktif) - opsional" value={plan.sale_price || ''} onChange={(e) => { const n = [...jasaPricingPlans]; n[idx].sale_price = e.target.value; setJasaPricingPlans(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                                  </div>
                                  <input type="text" placeholder="Teks Tombol Aksi (e.g. Pesan Paket Ini)" value={plan.cta_text || ''} onChange={(e) => { const n = [...jasaPricingPlans]; n[idx].cta_text = e.target.value; setJasaPricingPlans(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                                  <textarea rows={2} placeholder="Fitur-fitur paket (satu per baris)" value={(plan.features || []).join('\n')} onChange={(e) => { const n = [...jasaPricingPlans]; n[idx].features = e.target.value.split('\n').filter(Boolean); setJasaPricingPlans(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none resize-none" />
                                </div>
                              ))}
                              {jasaPricingPlans.length < 4 && <button type="button" onClick={() => setJasaPricingPlans(p => [...p, { name: '', badge: '', original_price: '', sale_price: '', cta_text: '', features: [], highlighted: false }])} className="text-[9px] font-bold text-theme-accent hover:underline">+ Tambah Paket</button>}
                            </div>
                          )}
                        </div>

                        {/* Guarantee */}
                        <div className="space-y-3 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide"><span>🛡️</span> Garansi Kepuasan</h3>
                          <input type="text" placeholder="Judul garansi..." value={jasaGuaranteeTitle} onChange={(e) => setJasaGuaranteeTitle(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                          <textarea rows={2} placeholder="Deskripsi garansi..." value={jasaGuaranteeDesc} onChange={(e) => setJasaGuaranteeDesc(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none resize-none transition-colors" />
                        </div>

                        {/* Testimonials */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide"><span>💬</span> Testimoni Klien</h3>
                            {renderAIJasaButton('jasa_testimonials', isGeneratingJasaTestimonials)}
                          </div>
                          <input type="text" value={jasaTestimonialsTitle} onChange={(e) => setJasaTestimonialsTitle(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                          <div className="space-y-3">
                            {jasaTestimonialsList.map((tst, idx) => (
                              <div key={idx} className="bg-theme-bg-muted rounded-xl p-3 border border-theme-border/40 space-y-2">
                                <div className="flex justify-between"><span className="text-[9px] font-bold text-theme-text-sec">Klien #{idx + 1}</span>{jasaTestimonialsList.length > 1 && <button type="button" onClick={() => setJasaTestimonialsList(p => p.filter((_, i) => i !== idx))} className="text-[9px] text-red-400 hover:underline">Hapus</button>}</div>
                                <input type="text" placeholder="Nama klien..." value={tst.name} onChange={(e) => { const n = [...jasaTestimonialsList]; n[idx].name = e.target.value; setJasaTestimonialsList(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                                <input type="text" placeholder="Jabatan / Perusahaan (opsional)" value={tst.role || ''} onChange={(e) => { const n = [...jasaTestimonialsList]; n[idx].role = e.target.value; setJasaTestimonialsList(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                                <textarea rows={2} placeholder="Isi testimoni..." value={tst.content} onChange={(e) => { const n = [...jasaTestimonialsList]; n[idx].content = e.target.value; setJasaTestimonialsList(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none resize-y" />
                              </div>
                            ))}
                            {jasaTestimonialsList.length < 4 && <button type="button" onClick={() => setJasaTestimonialsList(p => [...p, { name: '', role: '', content: '', avatar_url: '' }])} className="text-[9px] font-bold text-theme-accent hover:underline">+ Tambah Testimoni</button>}
                          </div>
                        </div>

                        {/* FAQ */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide"><span>❓</span> FAQ</h3>
                            {renderAIJasaButton('jasa_faq', isGeneratingJasaFaq)}
                          </div>
                          <div className="space-y-3">
                            {jasaFaqs.map((faq, idx) => (
                              <div key={idx} className="bg-theme-bg-muted rounded-xl p-3 border border-theme-border/40 space-y-2 relative">
                                <div className="flex justify-between items-center"><span className="text-[9px] font-bold text-theme-text-sec">FAQ #{idx + 1}</span>{jasaFaqs.length > 1 && <button type="button" onClick={() => setJasaFaqs(p => p.filter((_, i) => i !== idx))} className="text-[9px] font-bold text-red-400 hover:underline">Hapus</button>}</div>
                                <input type="text" placeholder="Pertanyaan..." value={faq.question} onChange={(e) => { const n = [...jasaFaqs]; n[idx].question = e.target.value; setJasaFaqs(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                                <input type="text" placeholder="Jawaban..." value={faq.answer} onChange={(e) => { const n = [...jasaFaqs]; n[idx].answer = e.target.value; setJasaFaqs(n); }} className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text focus:outline-none" />
                              </div>
                            ))}
                            {jasaFaqs.length < 8 && <button type="button" onClick={() => setJasaFaqs(p => [...p, { question: '', answer: '' }])} className="text-[9px] font-bold text-theme-accent hover:underline">+ Tambah FAQ</button>}
                          </div>
                        </div>

                        {/* Contact */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide"><span>📞</span> Kontak & Footer</h3>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">Nomor WhatsApp <span className="text-red-500">*</span></label>
                            <input type="text" required placeholder="Contoh: 628123456789" value={jasaWhatsapp} onChange={(e) => setJasaWhatsapp(e.target.value.replace(/\D/g, ''))} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">Email (Opsional)</label>
                            <input type="email" placeholder="halo@bisnis.com" value={jasaEmail} onChange={(e) => setJasaEmail(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">Alamat (Opsional)</label>
                            <input type="text" placeholder="Jl. Contoh No. 1, Jakarta" value={jasaAddress} onChange={(e) => setJasaAddress(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">Custom CTA URL (Opsional)</label>
                            <input type="text" placeholder="https://wa.me/628..." value={jasaCtaUrl} onChange={(e) => setJasaCtaUrl(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">Copyright Footer (Opsional)</label>
                            <input type="text" placeholder="© 2026 DigitalPro Agency. Hak Cipta Dilindungi." value={jasaCopyright} onChange={(e) => setJasaCopyright(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                          </div>
                          {/* Closing CTA */}
                          <div className="pt-2 border-t border-theme-border">
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">Judul Closing CTA (Opsional)</label>
                            <input type="text" placeholder="Siap Memulai Project Bersama Kami?" value={jasaClosingTitle} onChange={(e) => setJasaClosingTitle(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">Teks Tombol Closing CTA (Opsional)</label>
                            <input type="text" placeholder="Konsultasi Gratis — Tanpa Komitmen" value={jasaClosingCtaText} onChange={(e) => setJasaClosingCtaText(e.target.value)} className="block w-full px-3.5 py-2.5 bg-theme-bg-muted border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors" />
                          </div>
                        </div>

                      </div>
                    )}

                    {/* CV Fields */}
                    {templateType === 'cv' && (
                      <div className="space-y-5 border-t border-theme-border pt-4">


                        {/* Design Picker */}
                        <div>
                          <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">
                            Pilih Desain Tema
                          </label>
                          <div className="flex gap-3">
                            <div className="flex flex-col gap-1.5 flex-shrink-0 w-36">
                              <button
                                type="button"
                                onClick={() => handleSelectDesign('professional-dark')}
                                className={`w-full p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                                  designKey === 'professional-dark'
                                    ? 'border-theme-accent bg-theme-accent/10 text-theme-accent'
                                    : 'border-theme-border bg-theme-bg/50 text-theme-text-sec'
                                }`}
                              >
                                <span className="text-lg">💼</span>
                                <span className="text-[10px] font-bold">Professional Dark</span>
                                <span className="text-[8px] opacity-70">ATS-Friendly</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewDesignKey('professional-dark')}
                                className="text-[9px] font-semibold text-theme-accent hover:underline text-center"
                              >
                                Lihat Contoh Desain
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* === PROFIL === */}
                        <div className="space-y-3">
                          <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider">1. Data Profil</div>

                          {/* Foto Profil CV */}
                          <div className="flex gap-2.5 items-center bg-theme-bg/30 p-2.5 rounded-xl border border-theme-border">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-theme-border bg-theme-surface flex-shrink-0 flex items-center justify-center text-[9px] text-theme-text-muted">
                              {cvPhotoUrl ? <img src={cvPhotoUrl} className="w-full h-full object-cover" alt="Foto Profil" /> : 'No Photo'}
                            </div>
                            <div className="flex-grow flex flex-col gap-1">
                              <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Foto Profil CV (Opsional)</label>
                              <div className="flex gap-1.5">
                                <label className="flex-1 bg-theme-card hover:bg-theme-bg border border-theme-border text-theme-text-sec hover:text-theme-text text-[9px] font-bold py-1.5 px-2.5 rounded-xl text-center cursor-pointer transition-colors">
                                  {isUploadingCvPhoto ? 'Mengunggah...' : 'Upload Foto Profil'}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleUploadImage(e.target.files[0], 'cv')}
                                  />
                                </label>
                                {cvPhotoUrl && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleDeleteImage(cvPhotoUrl);
                                      setCvPhotoUrl('');
                                    }}
                                    className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-[9px] font-bold py-1.5 px-2.5 rounded-xl transition-colors cursor-pointer"
                                  >
                                    Hapus
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Nama Lengkap *</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Budi Santoso"
                                value={cvName}
                                onChange={(e) => setCvName(e.target.value)}
                                className="block w-full px-3 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Jabatan / Posisi Dilamar *</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Frontend Engineer"
                                value={cvTitle}
                                onChange={(e) => setCvTitle(e.target.value)}
                                className="block w-full px-3 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-[8px] font-semibold text-theme-text-sec">Ringkasan Profesional *</label>
                              {renderAICVButton('cv_summary', isGeneratingCvSummary)}
                            </div>
                            <textarea
                              rows={3}
                              required
                              placeholder="Tulis ringkasan singkat tentang diri Anda, pengalaman, dan nilai yang Anda tawarkan..."
                              value={cvSummary}
                              onChange={(e) => setCvSummary(e.target.value)}
                              className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none resize-none leading-relaxed"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Email *</label>
                              <input
                                type="email"
                                required
                                placeholder="email@contoh.com"
                                value={cvEmail}
                                onChange={(e) => setCvEmail(e.target.value)}
                                className="block w-full px-3 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">No. Telepon / WhatsApp *</label>
                              <input
                                type="tel"
                                required
                                placeholder="e.g. 628123456789"
                                value={cvPhone}
                                onChange={(e) => setCvPhone(e.target.value)}
                                className="block w-full px-3 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Lokasi / Kota *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Jakarta, Indonesia"
                              value={cvLocation}
                              onChange={(e) => setCvLocation(e.target.value)}
                              className="block w-full px-3 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[8px] font-semibold text-theme-text-sec">Link Sosial / Portofolio (Opsional)</label>
                            <input
                              type="url"
                              placeholder="URL LinkedIn (https://linkedin.com/in/...)"
                              value={cvLinkedin}
                              onChange={(e) => setCvLinkedin(e.target.value)}
                              className="block w-full px-3 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
                            <input
                              type="url"
                              placeholder="URL GitHub (https://github.com/...)"
                              value={cvGithub}
                              onChange={(e) => setCvGithub(e.target.value)}
                              className="block w-full px-3 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
                            <input
                              type="url"
                              placeholder="URL Portofolio / Website"
                              value={cvPortfolio}
                              onChange={(e) => setCvPortfolio(e.target.value)}
                              className="block w-full px-3 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* === PENGALAMAN KERJA === */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider">2. Pengalaman Kerja</div>
                            <button
                              type="button"
                              onClick={() => setCvExperiences(prev => [...prev, { company: '', position: '', period: '', description: '' }])}
                              className="text-[9px] font-bold text-theme-accent hover:text-theme-accent-hover transition-colors"
                            >+ Tambah</button>
                          </div>
                          {cvExperiences.map((exp, idx) => (
                            <div key={idx} className="border border-theme-border/60 rounded-xl p-3 space-y-2 bg-theme-bg/40 relative">
                              {cvExperiences.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setCvExperiences(prev => prev.filter((_, i) => i !== idx))}
                                  className="absolute top-2 right-2 text-[9px] text-red-400 hover:text-red-300 font-bold transition-colors"
                                >✕</button>
                              )}
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Nama Perusahaan</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. PT Teknologi Maju"
                                    value={exp.company}
                                    onChange={(e) => setCvExperiences(prev => prev.map((x, i) => i === idx ? { ...x, company: e.target.value } : x))}
                                    className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Jabatan</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Frontend Developer"
                                    value={exp.position}
                                    onChange={(e) => setCvExperiences(prev => prev.map((x, i) => i === idx ? { ...x, position: e.target.value } : x))}
                                    className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Periode</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Jan 2023 – Sekarang"
                                  value={exp.period}
                                  onChange={(e) => setCvExperiences(prev => prev.map((x, i) => i === idx ? { ...x, period: e.target.value } : x))}
                                  className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                                />
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <label className="block text-[8px] font-semibold text-theme-text-sec">Deskripsi Singkat (Opsional)</label>
                                  {renderAICVButton('cv_experience_description', isGeneratingCvExperienceDesc[idx] || false, idx)}
                                </div>
                                <textarea
                                  rows={2}
                                  placeholder="Tanggung jawab utama dan pencapaian..."
                                  value={exp.description}
                                  onChange={(e) => setCvExperiences(prev => prev.map((x, i) => i === idx ? { ...x, description: e.target.value } : x))}
                                  className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text placeholder-theme-text-muted focus:outline-none resize-none leading-relaxed"
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* === PENDIDIKAN === */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider">3. Pendidikan *</div>
                            <button
                              type="button"
                              onClick={() => setCvEducations(prev => [...prev, { institution: '', degree: '', period: '', gpa: '' }])}
                              className="text-[9px] font-bold text-theme-accent hover:text-theme-accent-hover transition-colors"
                            >+ Tambah</button>
                          </div>
                          {cvEducations.map((edu, idx) => (
                            <div key={idx} className="border border-theme-border/60 rounded-xl p-3 space-y-2 bg-theme-bg/40 relative">
                              {cvEducations.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setCvEducations(prev => prev.filter((_, i) => i !== idx))}
                                  className="absolute top-2 right-2 text-[9px] text-red-400 hover:text-red-300 font-bold transition-colors"
                                >✕</button>
                              )}
                              <div>
                                <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Nama Institusi *</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Universitas Indonesia"
                                  value={edu.institution}
                                  onChange={(e) => setCvEducations(prev => prev.map((x, i) => i === idx ? { ...x, institution: e.target.value } : x))}
                                  className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Gelar / Program Studi *</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. S1 Teknik Informatika"
                                    value={edu.degree}
                                    onChange={(e) => setCvEducations(prev => prev.map((x, i) => i === idx ? { ...x, degree: e.target.value } : x))}
                                    className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Periode *</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. 2019 – 2023"
                                    value={edu.period}
                                    onChange={(e) => setCvEducations(prev => prev.map((x, i) => i === idx ? { ...x, period: e.target.value } : x))}
                                    className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">IPK / GPA (Opsional)</label>
                                <input
                                  type="text"
                                  placeholder="e.g. 3.80"
                                  value={edu.gpa || ''}
                                  onChange={(e) => setCvEducations(prev => prev.map((x, i) => i === idx ? { ...x, gpa: e.target.value } : x))}
                                  className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* === KEAHLIAN === */}
                        <div className="space-y-2">
                          <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider">4. Keahlian (Skills) *</div>
                          <p className="text-[8px] text-theme-text-muted">Ketik keahlian lalu tekan Enter atau koma untuk menambahkan.</p>
                          <div
                            className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-theme-bg border border-theme-border rounded-xl cursor-text"
                            onClick={() => document.getElementById('cv-skills-input')?.focus()}
                          >
                            {cvSkills.map((skill, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 text-[10px] font-semibold bg-theme-accent/15 text-theme-accent border border-theme-accent/25 px-2.5 py-0.5 rounded-full">
                                {skill}
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setCvSkills(prev => prev.filter((_, i) => i !== idx)); }}
                                  className="hover:text-red-400 transition-colors leading-none"
                                >✕</button>
                              </span>
                            ))}
                            <input
                              id="cv-skills-input"
                              type="text"
                              placeholder={cvSkills.length === 0 ? 'e.g. JavaScript, React, Node.js...' : ''}
                              value={cvSkillsInput}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val.endsWith(',')) {
                                  const newSkill = val.slice(0, -1).trim();
                                  if (newSkill && !cvSkills.includes(newSkill)) {
                                    setCvSkills(prev => [...prev, newSkill]);
                                  }
                                  setCvSkillsInput('');
                                } else if (val.includes(',')) {
                                  const parts = val.split(',').map(s => s.trim()).filter(Boolean);
                                  setCvSkills(prev => {
                                    const next = [...prev];
                                    parts.forEach(p => {
                                      if (!next.includes(p)) next.push(p);
                                    });
                                    return next;
                                  });
                                  setCvSkillsInput('');
                                } else {
                                  setCvSkillsInput(val);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && cvSkillsInput.trim()) {
                                  e.preventDefault();
                                  const newSkill = cvSkillsInput.trim();
                                  if (newSkill && !cvSkills.includes(newSkill)) {
                                    setCvSkills(prev => [...prev, newSkill]);
                                  }
                                  setCvSkillsInput('');
                                }
                                if (e.key === 'Backspace' && !cvSkillsInput && cvSkills.length > 0) {
                                  setCvSkills(prev => prev.slice(0, -1));
                                }
                              }}
                              onBlur={() => {
                                if (cvSkillsInput.trim()) {
                                  const newSkill = cvSkillsInput.trim().replace(/,$/, '');
                                  if (newSkill && !cvSkills.includes(newSkill)) setCvSkills(prev => [...prev, newSkill]);
                                  setCvSkillsInput('');
                                }
                              }}
                              className="flex-1 min-w-[100px] bg-transparent text-xs text-theme-text placeholder-theme-text-muted outline-none border-none"
                            />
                          </div>
                        </div>

                        {/* === BAHASA === */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider">5. Kemampuan Bahasa (Opsional)</div>
                            <button
                              type="button"
                              onClick={() => setCvLanguages(prev => [...prev, { language: '', level: '' }])}
                              className="text-[9px] font-bold text-theme-accent hover:text-theme-accent-hover transition-colors"
                            >+ Tambah</button>
                          </div>
                          {cvLanguages.map((lang, idx) => (
                            <div key={idx} className="flex gap-2 items-start">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  placeholder="Bahasa (e.g. Indonesia)"
                                  value={lang.language}
                                  onChange={(e) => setCvLanguages(prev => prev.map((x, i) => i === idx ? { ...x, language: e.target.value } : x))}
                                  className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                                />
                              </div>
                              <div className="flex-1">
                                <input
                                  type="text"
                                  placeholder="Level (e.g. Native)"
                                  value={lang.level}
                                  onChange={(e) => setCvLanguages(prev => prev.map((x, i) => i === idx ? { ...x, level: e.target.value } : x))}
                                  className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                                />
                              </div>
                              {cvLanguages.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setCvLanguages(prev => prev.filter((_, i) => i !== idx))}
                                  className="text-[9px] text-red-400 hover:text-red-300 font-bold mt-1.5 transition-colors flex-shrink-0"
                                >✕</button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* === SERTIFIKASI === */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider">6. Sertifikasi (Opsional)</div>
                            <button
                              type="button"
                              onClick={() => setCvCertifications(prev => [...prev, { name: '', issuer: '', year: '' }])}
                              className="text-[9px] font-bold text-theme-accent hover:text-theme-accent-hover transition-colors"
                            >+ Tambah</button>
                          </div>
                          {cvCertifications.map((cert, idx) => (
                            <div key={idx} className="border border-theme-border/60 rounded-xl p-2.5 space-y-1.5 bg-theme-bg/40 relative">
                              <button
                                type="button"
                                onClick={() => setCvCertifications(prev => prev.filter((_, i) => i !== idx))}
                                className="absolute top-2 right-2 text-[9px] text-red-400 hover:text-red-300 font-bold transition-colors"
                              >✕</button>
                              <div>
                                <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Nama Sertifikasi</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Google Cloud Professional"
                                  value={cert.name}
                                  onChange={(e) => setCvCertifications(prev => prev.map((x, i) => i === idx ? { ...x, name: e.target.value } : x))}
                                  className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Lembaga Penerbit</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Google"
                                    value={cert.issuer}
                                    onChange={(e) => setCvCertifications(prev => prev.map((x, i) => i === idx ? { ...x, issuer: e.target.value } : x))}
                                    className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Tahun</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. 2024"
                                    value={cert.year}
                                    onChange={(e) => setCvCertifications(prev => prev.map((x, i) => i === idx ? { ...x, year: e.target.value } : x))}
                                    className="block w-full px-2.5 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-lg text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* === PENGATURAN HALAMAN === */}
                        <div className="space-y-3 bg-theme-bg/30 border border-theme-border rounded-xl p-3.5 mt-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="cv-hide-footer"
                              checked={hideFooter}
                              onChange={(e) => setHideFooter(e.target.checked)}
                              className="w-3.5 h-3.5 text-theme-accent bg-theme-bg border-theme-border rounded focus:ring-theme-accent focus:ring-2 focus:ring-offset-0 focus:outline-none cursor-pointer"
                            />
                            <label htmlFor="cv-hide-footer" className="text-xs font-semibold text-theme-text-sec cursor-pointer select-none">
                              Sembunyikan Footer (Tanpa Branding)
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Dynamic Builder V2 Fields */}
                    {templateType === 'dynamic-builder' && (
                      <div className="space-y-4 border-t border-theme-border pt-4">
                        {/* Starter Kit & Global Theme Switcher Bar */}
                        <div className="bg-theme-bg border border-theme-border rounded-2xl p-4 space-y-3.5 shadow-sm">
                          <div className="flex flex-col sm:flex-row gap-2 justify-between sm:items-center border-b border-theme-border/60 pb-3">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-theme-accent" />
                              <div>
                                <h3 className="text-xs font-extrabold text-theme-text uppercase tracking-wide">
                                  Starter Kit & Tema Warna V2
                                </h3>
                                <p className="text-[9px] text-theme-text-sec">Pilih racikan preset tujuan atau ganti warna halaman</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsV2OnboardingOpen(true)}
                              className="text-xs font-bold px-3 py-1.5 bg-theme-accent/10 hover:bg-theme-accent/20 text-theme-accent rounded-xl border border-theme-accent/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <span>✨ Pilih Preset Starter Kit</span>
                            </button>
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">
                              Ubah Tema Warna Halaman (Global)
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { key: 'navy', label: '⚓ Navy Blue', bg: 'bg-slate-900 text-white' },
                                { key: 'emerald', label: '🌿 Emerald', bg: 'bg-emerald-950 text-emerald-300' },
                                { key: 'amber', label: '🌅 Amber', bg: 'bg-amber-950 text-amber-300' },
                                { key: 'purple', label: '🔮 Royal Purple', bg: 'bg-purple-950 text-purple-300' },
                                { key: 'rose', label: '🌹 Sunset Rose', bg: 'bg-rose-950 text-rose-300' },
                                { key: 'slate', label: '🌑 Clean Slate', bg: 'bg-slate-800 text-slate-200' }
                              ].map((themeItem) => (
                                <button
                                  key={themeItem.key}
                                  type="button"
                                  onClick={() => handleApplyGlobalTheme(themeItem.key)}
                                  className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${themeItem.bg} ${
                                    v2GlobalTheme === themeItem.key ? 'ring-2 ring-theme-accent border-theme-accent scale-105 shadow-md' : 'border-theme-border opacity-70 hover:opacity-100'
                                  }`}
                                >
                                  {themeItem.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Brief AI & Brand Info */}
                        <div className="space-y-3.5 bg-theme-bg border border-theme-border rounded-2xl p-4">
                          <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5 uppercase tracking-wide">
                            <span>🤖</span> Identitas Brand & Brief AI
                          </h3>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Nama Brand / Bisnis <span className="text-red-500 font-bold ml-0.5">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Contoh: Siluet Digital Agency"
                              value={v2BrandName}
                              onChange={(e) => setV2BrandName(e.target.value)}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">
                              Deskripsi Brief Bisnis (Konteks AI)
                            </label>
                            <textarea
                              placeholder="Jelaskan bisnis Anda, produk/jasa utama, serta target pelanggan untuk membantu AI merancang kata-kata penawaran..."
                              value={v2BrandBrief}
                              onChange={(e) => setV2BrandBrief(e.target.value)}
                              rows={3}
                              className="block w-full px-3.5 py-2.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none transition-colors resize-y"
                            />
                          </div>
                        </div>

                        {/* Section List Manager */}
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 justify-between items-start sm:items-center bg-theme-bg/60 p-3 rounded-2xl border border-theme-border">
                            <div>
                              <h4 className="text-xs font-bold text-theme-text uppercase tracking-wider">
                                Kelola Section ({v2Sections.length})
                              </h4>
                              <p className="text-[9px] text-theme-text-sec mt-0.5">Tambah, hapus, atau atur urutan tampilan section</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                              <button
                                type="button"
                                onClick={() => setIsV2VisualPickerOpen(true)}
                                className="w-full sm:w-auto bg-theme-accent text-theme-accent-text text-xs font-bold px-3 py-2.5 rounded-xl cursor-pointer hover:bg-theme-accent/90 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>+ Katalog Visual Section</span>
                              </button>
                            </div>
                          </div>

                          {v2Sections.length === 0 ? (
                            <div className="text-center py-10 px-4 bg-theme-bg border border-dashed border-theme-border rounded-2xl space-y-3">
                              <div className="w-12 h-12 rounded-2xl bg-theme-accent/10 text-theme-accent flex items-center justify-center mx-auto text-2xl font-bold">
                                ✨
                              </div>
                              <div>
                                <h4 className="text-xs font-extrabold text-theme-text uppercase tracking-wide">
                                  Belum Ada Section Terpasang
                                </h4>
                                <p className="text-[10px] text-theme-text-sec mt-1 max-w-xs mx-auto leading-relaxed">
                                  Pilih Preset Starter Kit sesuai tujuan Anda atau tambahkan section satu per satu via Katalog Visual.
                                </p>
                              </div>
                              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => setIsV2OnboardingOpen(true)}
                                  className="px-3.5 py-2 text-xs font-extrabold bg-theme-accent text-theme-accent-text rounded-xl shadow-sm hover:bg-theme-accent/90 transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <span>✨ Pilih Preset Starter Kit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setIsV2VisualPickerOpen(true)}
                                  className="px-3.5 py-2 text-xs font-extrabold bg-theme-surface border border-theme-border text-theme-text rounded-xl hover:bg-theme-bg transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <span>+ Katalog Visual Section</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            v2Sections.map((section, idx) => (
                              <div key={section.id} className="bg-theme-bg border border-theme-border rounded-2xl p-4 space-y-3">

                              <div className="flex justify-between items-center border-b border-theme-border/50 pb-2">
                                <span
                                  onClick={() => handleFocusSectionInPreview(section.id, section.type)}
                                  className="text-xs font-bold text-theme-text uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:text-theme-accent transition-colors"
                                  title="Klik untuk fokus posisi section di Live Preview"
                                >
                                  <span className="h-5 w-5 rounded-md bg-theme-accent/10 text-theme-accent flex items-center justify-center text-[10px]">
                                    {idx + 1}
                                  </span>
                                  <span className="flex items-center gap-1.5 truncate max-w-[220px] sm:max-w-[320px]">
                                    <span>{getSectionTypeIcon(section.type)}</span>
                                    <span>{getSectionDisplayTitle(section)}</span>
                                    <span className="text-[9px] font-semibold text-theme-text-sec bg-theme-surface px-1.5 py-0.5 rounded border border-theme-border/60 uppercase">
                                      {section.type}
                                    </span>
                                  </span>
                                  <span className="text-[8px] text-theme-text-muted font-normal hidden sm:inline">(Fokus Preview 👁️)</span>
                                </span>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveSection(section.id, 'up')}
                                    disabled={idx === 0}
                                    title="Geser Ke Atas"
                                    className="p-1 px-2 text-xs font-bold text-theme-text-sec hover:text-theme-text hover:bg-theme-card rounded-lg disabled:opacity-20"
                                  >
                                    ▲
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveSection(section.id, 'down')}
                                    disabled={idx === v2Sections.length - 1}
                                    title="Geser Ke Bawah"
                                    className="p-1 px-2 text-xs font-bold text-theme-text-sec hover:text-theme-text hover:bg-theme-card rounded-lg disabled:opacity-20"
                                  >
                                    ▼
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSection(section.id)}
                                    title="Hapus Section"
                                    className="p-1 px-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg ml-1"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>

                              <V2SectionFormDispatcher
                                section={section}
                                v2Sections={v2Sections}
                                v2BrandName={v2BrandName}
                                handleUpdateSectionContent={handleUpdateSectionContent}
                                renderSectionStylePicker={renderSectionStylePicker}
                                renderAIV2Button={renderAIV2Button}
                                session={session}
                                handleDeleteImage={handleDeleteImage}
                                handleUploadImage={handleUploadImage}
                              />
                            </div>
                          ))
                        )}
                        </div>
                      </div>
                    )}

                    {/* Prompt input */}
                    {templateType !== 'toko-online' && templateType !== 'campaign' && templateType !== 'cv' && templateType !== 'dynamic-builder' && (
                      <div>
                        <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">
                          {templateType === 'wedding' || templateType === 'birthday' ? 'Preferensi Kutipan / Doa (Optional)' : 'Prompt / Deskripsi Bisnis Anda'}
                        </label>
                        <textarea
                          required={templateType === 'store'}
                          rows={templateType === 'store' ? 5 : 3}
                          placeholder={templateType === 'wedding' || templateType === 'birthday' ? "Tulis ucapan/doa atau kata-kata pembuka secara kustom... (kosongkan untuk teks default)" : "Tuliskan produk Anda, keunggulan utama, target konsumen, dan nuansa yang diinginkan secara detail..."}
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          disabled={isGenerating || editMode}
                          className={`block w-full px-3.5 py-2.5 bg-theme-bg border border-theme-border rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none resize-none leading-relaxed ${editMode ? 'opacity-70 cursor-not-allowed' : 'focus:border-theme-accent'}`}
                        />
                        {editMode && (
                          <p className="text-[9px] text-theme-text-muted mt-1">
                            Kolom preferensi AI ini dikunci pada mode edit halaman aktif.
                          </p>
                        )}
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Desktop Submit Action Button embedded in Form Column */}
              <div className="hidden lg:flex flex-col gap-2 mt-auto pt-2">
                {editMode ? (
                  <button
                    type="submit"
                    form="generate-form"
                    disabled={isPublishing || (editCount >= maxProjectEdits && (profile?.balance ?? 0) < projectEditCost)}
                    title={editCount >= maxProjectEdits && (profile?.balance ?? 0) < projectEditCost ? 'Saldo credit tidak cukup untuk menyimpan edit berbayar' : ''}
                    className="w-full bg-theme-accent hover:bg-theme-accent-hover disabled:opacity-50 text-theme-accent-text font-black text-sm py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                  >
                    {isPublishing ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-theme-accent-text/20 border-t-theme-accent-text animate-spin"></div>
                        <span>Menyimpan Perubahan...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        {editCount < maxProjectEdits ? (
                          <span>Simpan Perubahan ({maxProjectEdits - editCount}/{maxProjectEdits})</span>
                        ) : (
                          <span>Simpan Perubahan ({projectEditCost} Credit)</span>
                        )}
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="generate-form"
                    disabled={isGenerating}
                    className="w-full bg-theme-accent hover:bg-theme-accent-hover disabled:opacity-50 text-theme-accent-text font-black text-sm py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-theme-accent-text/20 border-t-theme-accent-text animate-spin"></div>
                        <span>Sedang Merancang Halaman...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Generate Preview (Gratis)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Column 2: Live Sandbox Preview (Full width on mobile if activeTab === 'preview', 8-cols on lg desktop) */}
            <div className={`col-span-1 lg:col-span-8 flex flex-col h-full lg:sticky lg:top-24 ${!pageData && 'hidden lg:flex'} ${pageData && activeTab !== 'preview' ? 'hidden lg:flex' : 'flex'}`}>
              {!pageData ? (
                /* Empty Sandbox State for Desktop */
                <div className="flex flex-col items-center justify-center h-[580px] border-2 border-dashed border-theme-border rounded-3xl p-8 text-center bg-theme-card/10">
                  <div className="h-16 w-16 rounded-2xl bg-theme-accent/10 border border-theme-accent/20 flex items-center justify-center mb-4 text-theme-accent">
                    <Sparkles className="h-8 w-8 animate-pulse" />
                  </div>
                  <h4 className="text-base font-bold text-theme-text mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>Pratinjau Live Sandbox</h4>
                  <p className="text-xs text-theme-text-sec max-w-sm leading-relaxed mb-4">
                    Isi detail formulir di sebelah kiri dan klik <span className="font-bold text-theme-text">Generate Preview</span> untuk melihat hasil tampilan landing page secara otomatis di sini.
                  </p>
                </div>
              ) : (
                /* Live Preview Sandbox Container */
                <div className="flex flex-col space-y-4">
                  {/* Viewport Control Bar */}
                  <div className="bg-theme-card/60 border border-theme-border rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-xs font-bold text-theme-text" style={{ fontFamily: "'Sora', sans-serif" }}>Live Sandbox Preview</span>
                    </div>

                    {/* Device Simulator Toggle */}
                    <div className="flex items-center gap-1 bg-theme-bg p-1 rounded-xl border border-theme-border">
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('mobile')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          previewDevice === 'mobile'
                            ? 'bg-theme-accent text-theme-accent-text shadow'
                            : 'text-theme-text-sec hover:text-theme-text'
                        }`}
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                        <span>Mobile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('laptop')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          previewDevice === 'laptop'
                            ? 'bg-theme-accent text-theme-accent-text shadow'
                            : 'text-theme-text-sec hover:text-theme-text'
                        }`}
                      >
                        <Laptop className="h-3.5 w-3.5" />
                        <span>Desktop</span>
                      </button>
                    </div>
                  </div>

                  {/* Publish Coupon & Action Panel on Desktop */}
                  {pageData && (
                    <div className="bg-theme-card/40 border border-theme-border rounded-2xl p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-theme-border/50 pb-3">
                        <div>
                          <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider">
                            URL Slug Landing Page
                          </label>
                          {editMode ? (
                            <span className="text-xs font-bold text-theme-text">{slug}</span>
                          ) : (
                            <input
                              type="text"
                              required
                              placeholder="contoh-toko-saya"
                              value={slug}
                              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                              className="mt-1 px-3 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none"
                            />
                          )}
                        </div>

                        {!editMode && (
                          <button
                            type="button"
                            onClick={handlePublish}
                            disabled={isPublishing || !slug || (finalCost > 0 && (profile?.balance ?? 0) < finalCost)}
                            className="bg-[#c0623a] hover:bg-[#a8502d] disabled:opacity-50 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                          >
                            {isPublishing ? (
                              <span>Sedang Memproses...</span>
                            ) : (
                              <>
                                <Globe className="h-3.5 w-3.5" />
                                <span>{finalCost === 0 ? 'Publikasikan Sekarang (Gratis)' : `Publikasikan (${finalCost} Credit)`}</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Viewport Box */}
                  <div className={`border border-theme-border bg-slate-950 rounded-2xl overflow-hidden shadow-2xl relative transition-all duration-300 ${
                    previewDevice === 'mobile'
                      ? 'w-[375px] h-[640px] mx-auto border-4 border-slate-800 shadow-2xl rounded-3xl'
                      : 'w-full h-[calc(100vh-220px)] min-h-[660px]'
                  }`}>
                    {isGenerating && (
                      <div className="absolute inset-0 z-20 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                        <div className="relative mb-6">
                          <div className="absolute -inset-2 rounded-full bg-theme-accent/20 animate-ping"></div>
                          <div className="h-16 w-16 rounded-full border-4 border-theme-accent/10 border-t-theme-accent animate-spin relative flex items-center justify-center bg-slate-900 shadow-xl">
                            <span className="text-xl">✨</span>
                          </div>
                        </div>
                        
                        <h3 className="text-base font-bold text-white mb-1.5">
                          Merancang Landing Page Anda
                        </h3>
                        
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-accent/10 border border-theme-accent/20 text-[10px] text-theme-accent font-bold mb-4 uppercase tracking-wider">
                          <span className="h-1.5 w-1.5 rounded-full bg-theme-accent animate-pulse"></span>
                          {aiProgressStatus || 'queued'}
                        </div>
                        
                        <p className="text-xs text-theme-text-muted max-w-[240px] leading-relaxed min-h-[36px] flex items-center justify-center">
                          {aiProgressDetail || 'Menghubungkan ke server AI...'}
                        </p>
                      </div>
                    )}

                    {(templateType === 'wedding' || templateType === 'birthday' || templateType === 'toko-online' || templateType === 'campaign' || templateType === 'cv' || templateType === 'e-course' || templateType === 'jasa' || templateType === 'dynamic-builder') ? (
                      <iframe
                        ref={iframeRef}
                        src="/preview/index.html"
                        className="w-full h-full border-0 bg-transparent"
                        title="Live Preview"
                        onLoad={() => {
                          setIframeReady(true);
                          if (iframeRef.current && pageData) {
                            iframeRef.current.contentWindow.postMessage({
                              type: 'UPDATE_PREVIEW',
                              pageData: pageData
                            }, '*');
                          }
                        }}
                      />
                    ) : (
                      renderPreview()
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tracking Pixel Banner — read-only info, user edits in /profile */}
        {!editMode && (() => {
          const hasFb  = !!trackingConfig?.facebook_pixel_id;
          const hasGa  = !!trackingConfig?.google_analytics_id;
          const hasAds = !!trackingConfig?.google_ads_id;
          const hasTt  = !!trackingConfig?.tiktok_pixel_id;
          const anyActive = hasFb || hasGa || hasAds || hasTt;
          return (
            <div className="relative md:fixed md:bottom-[72px] left-0 right-0 max-w-md mx-auto px-4 z-10 mb-3 lg:hidden">
              <div className="bg-theme-surface/90 backdrop-blur-sm border border-theme-border rounded-xl px-3 py-2 flex items-center justify-between text-xs shadow-lg">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-theme-text-muted font-medium mr-0.5">Pixel:</span>
                  <span className={hasFb  ? 'text-green-400' : 'text-theme-text-muted/40'} title="Facebook Pixel">FB {hasFb  ? '✓' : '○'}</span>
                  <span className={hasGa  ? 'text-green-400' : 'text-theme-text-muted/40'} title="Google Analytics">GA {hasGa  ? '✓' : '○'}</span>
                  <span className={hasAds ? 'text-green-400' : 'text-theme-text-muted/40'} title="Google Ads">Ads {hasAds ? '✓' : '○'}</span>
                  <span className={hasTt  ? 'text-green-400' : 'text-theme-text-muted/40'} title="TikTok Pixel">TT {hasTt  ? '✓' : '○'}</span>
                </div>
                <a href="/profile#tracking" className="text-theme-accent hover:underline font-semibold whitespace-nowrap ml-2">Edit →</a>
              </div>
            </div>
          );
        })()}
 
        {/* Mobile-only Action Bar at the Bottom */}
        <div className="fixed bottom-[84px] left-0 right-0 max-w-md mx-auto bg-theme-surface/95 border-t border-theme-border p-4 z-30 flex flex-col gap-2 shadow-lg transition-theme mt-auto lg:hidden">
          {editMode ? (
            <button
              type="submit"
              form="generate-form"
              disabled={isPublishing || (editCount >= maxProjectEdits && (profile?.balance ?? 0) < projectEditCost)}
              title={editCount >= maxProjectEdits && (profile?.balance ?? 0) < projectEditCost ? 'Saldo credit tidak cukup untuk menyimpan edit berbayar' : ''}
              className="w-full bg-theme-accent hover:bg-theme-accent-hover disabled:opacity-50 text-theme-accent-text font-black text-sm py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              {isPublishing ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-theme-accent-text/20 border-t-theme-accent-text animate-spin"></div>
                  <span>Menyimpan Perubahan...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  {editCount < maxProjectEdits ? (
                    <span>Simpan Perubahan ({maxProjectEdits - editCount}/{maxProjectEdits})</span>
                  ) : (
                    <span>Simpan Perubahan ({projectEditCost} Credit)</span>
                  )}
                </>
              )}
            </button>
          ) : (!pageData || activeTab === 'edit') ? (
            <button
              type="submit"
              form="generate-form"
              disabled={isGenerating}
              className="w-full bg-theme-accent hover:bg-theme-accent-hover disabled:opacity-50 text-theme-accent-text font-black text-sm py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-theme-accent-text/20 border-t-theme-accent-text animate-spin"></div>
                  <span>Sedang Merancang Halaman...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Preview (Gratis)</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing || !slug || (finalCost > 0 && (profile?.balance ?? 0) < finalCost)}
              className="w-full bg-[#c0623a] hover:bg-[#a8502d] disabled:opacity-50 text-white font-black text-sm py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              {isPublishing ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                  <span>Sedang Memproses...</span>
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  <span>
                    {finalCost === 0
                      ? 'Publikasikan Sekarang (Gratis)'
                      : `Publikasikan Sekarang (${finalCost} Credit)`}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </main>
      {/* Template Selection Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-theme-bg/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-theme-surface border border-theme-border rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] relative">

            {/* Modal Header */}
            <div className="p-6 border-b border-theme-border flex justify-between items-center bg-theme-surface/50 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-theme-text flex items-center gap-2">
                  <span>Galeri Template & Layanan</span>
                </h3>
                <p className="text-xs text-theme-text-muted mt-1">
                  Pilih tipe landing page yang ingin Anda rancang.
                </p>
              </div>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="p-2 text-theme-text-sec hover:text-theme-text bg-theme-bg/50 hover:bg-theme-bg rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Filters */}
            <div className="px-6 py-4 bg-theme-surface/20 border-b border-theme-border flex gap-2 overflow-x-auto scrollbar-none shrink-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === 'all' ? 'bg-theme-accent text-theme-accent-text' : 'bg-theme-card text-theme-text-sec hover:text-theme-text'
                  }`}
              >
                Semua Kategori
              </button>
              <button
                onClick={() => setSelectedCategory('Undangan')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === 'Undangan' ? 'bg-theme-accent text-theme-accent-text' : 'bg-theme-card text-theme-text-sec hover:text-theme-text'
                  }`}
              >
                Undangan
              </button>
              <button
                onClick={() => setSelectedCategory('Toko')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === 'Toko' ? 'bg-theme-accent text-theme-accent-text' : 'bg-theme-card text-theme-text-sec hover:text-theme-text'
                  }`}
              >
                E-Commerce / Toko
              </button>
              <button
                onClick={() => setSelectedCategory('Campaign')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === 'Campaign' ? 'bg-theme-accent text-theme-accent-text' : 'bg-theme-card text-theme-text-sec hover:text-theme-text'
                  }`}
              >
                Campaign & Promo
              </button>
            </div>

            {/* Modal Content - Product Cards Grid */}
            {(() => {
              const filteredProducts = displayProducts.filter(p => {
                if (selectedCategory === 'all') return true;
                return p.unit === selectedCategory;
              });

              return (
                <>
                  <div
                    onScroll={(e) => {
                      if (e.currentTarget.scrollTop > 20) {
                        setShowScrollIndicator(false);
                      }
                    }}
                    className="p-6 overflow-y-auto space-y-4 flex-grow bg-theme-surface/30"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredProducts.map(product => {
                        const isSelected = templateType === product.id;
                        const isActive = product.is_active;

                        return (
                          <div
                            key={product.id}
                            onClick={() => {
                              if (isActive) {
                                setTemplateType(product.id);
                                setIsTemplateModalOpen(false);
                                // Clear page data when changing template types to refresh state
                                setPageData(null);
                                // Reset designKey and version based on product type
                                if (product.id === 'toko-online') {
                                   setDesignKey('modern-clean');
                                   setDesignVersion(TEMPLATE_LATEST_VERSIONS['modern-clean'] || 1);
                                 } else if (product.id === 'wedding') {
                                   setDesignKey('sage-green');
                                   setDesignVersion(TEMPLATE_LATEST_VERSIONS['sage-green'] || 1);
                                 } else if (product.id === 'birthday') {
                                   setDesignKey('cute-balloon');
                                   setDesignVersion(TEMPLATE_LATEST_VERSIONS['cute-balloon'] || 1);
                                 } else if (product.id === 'campaign') {
                                   setDesignKey('neon-conversion');
                                   setDesignVersion(TEMPLATE_LATEST_VERSIONS['neon-conversion'] || 1);
                                 } else if (product.id === 'cv') {
                                   setDesignKey('professional-dark');
                                   setDesignVersion(TEMPLATE_LATEST_VERSIONS['professional-dark'] || 1);
                                 } else if (product.id === 'e-course') {
                                   setDesignKey('purple-academy');
                                   setDesignVersion(TEMPLATE_LATEST_VERSIONS['purple-academy'] || 1);
                                 } else if (product.id === 'jasa') {
                                   setDesignKey('professional-navy');
                                   setDesignVersion(TEMPLATE_LATEST_VERSIONS['professional-navy'] || 1);
                                 }
                              }
                            }}
                            className={`group border rounded-2xl p-5 flex flex-col justify-between text-left transition-all duration-300 relative overflow-hidden ${!isActive
                              ? 'bg-theme-surface/40 border-theme-border opacity-60 cursor-not-allowed select-none'
                              : isSelected
                                ? 'bg-theme-accent/10 border-theme-accent shadow-lg shadow-theme-accent/5 cursor-pointer scale-[1.01]'
                                : 'bg-theme-bg border-theme-border hover:border-theme-accent hover:bg-theme-surface/10 cursor-pointer hover:scale-[1.01]'
                              }`}
                          >
                            {/* Glow effect on hover if active */}
                            {isActive && (
                              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl -z-10 transition-opacity duration-300 ${isSelected ? 'bg-theme-accent/10 opacity-100' : 'bg-theme-accent/5 opacity-0 group-hover:opacity-100'
                                }`} />
                            )}

                            <div>
                              <div className="flex justify-between items-start mb-4">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-xl shadow-sm ${isSelected ? 'bg-theme-accent/20 text-theme-accent' : 'bg-theme-card text-theme-text-sec'
                                  }`}>
                                  {getProductIcon(product.id)}
                                </div>

                                {/* Inactive / Maintenance Badge */}
                                {!isActive ? (
                                  <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded">
                                    Pemeliharaan
                                  </span>
                                ) : (
                                  isSelected && (
                                    <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 bg-theme-accent/20 border border-theme-accent/30 text-theme-accent rounded">
                                      Selected
                                    </span>
                                  )
                                )}
                              </div>

                              <h4 className="text-sm font-bold text-theme-text group-hover:text-theme-accent transition-colors">
                                {product.name}
                              </h4>
                              <p className="text-xs text-theme-text-muted mt-1.5 leading-relaxed">
                                {product.description || getProductDefaultDescription(product.id)}
                              </p>
                            </div>

                            {/* Price Info */}
                            <div className="mt-6 pt-4 border-t border-theme-border flex justify-between items-center">
                              <span className="text-[10px] text-theme-text-muted uppercase tracking-wider font-semibold">Biaya Publikasi</span>
                              <span className="text-xs font-bold text-theme-text">
                                {product.cost?.toLocaleString('id-ID') || '100'} Credit
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scroll indicator overlay */}
                  {showScrollIndicator && filteredProducts.length > 2 && (
                    <div className="absolute bottom-[92px] left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-bounce">
                      <div className="bg-theme-accent/95 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-2xl border border-white/10 flex items-center gap-1.5 text-xs font-bold transition-all duration-300">
                        <span>Lihat Pilihan Lain</span>
                        <span>⬇</span>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            {/* Modal Footer */}
            <div className="p-6 border-t border-theme-border bg-theme-bg flex justify-end shrink-0">
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="px-5 py-2.5 bg-theme-card hover:bg-theme-surface text-theme-text rounded-xl text-xs font-semibold transition-colors"
              >
                Tutup Galeri
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Design Theme Preview Modal */}
      {previewDesignKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-theme-bg/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-theme-surface border border-theme-border rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col h-[85vh]">

            {/* Modal Header */}
            <div className="p-4 border-b border-theme-border flex justify-between items-center bg-theme-surface/50">
              <div>
                <h3 className="text-sm font-bold text-theme-text">
                  Contoh Tema: {
                    previewDesignKey === 'sage-green' ? 'Sage Green 🌿' :
                      previewDesignKey === 'floral-pink' ? 'Floral Pink 🌸' :
                        previewDesignKey === 'classic-love' ? 'Classic Love 🌹' :
                        previewDesignKey === 'javanese-traditional' ? 'Javanese Traditional 🤎' :
                          previewDesignKey === 'cute-balloon' ? 'Cute Balloon 🎈' :
                            previewDesignKey === 'elegant-gold' ? 'Elegant Gold ✨' :
                              previewDesignKey === 'modern-clean' ? 'Modern Clean 🛍️' :
                                previewDesignKey === 'midnight-dark' ? 'Midnight Dark 👑' :
                                  previewDesignKey === 'neon-conversion' ? 'Neon Conversion ⚡' :
                                    previewDesignKey === 'clean-trust' ? 'Clean Trust 🛡️' :
                                      previewDesignKey === 'purple-academy' ? 'Purple Academy 💜' : 'Theme'
                  }
                </h3>
                <p className="text-[10px] text-theme-text-muted mt-0.5">Contoh tampilan landing page</p>
              </div>
              <button
                onClick={closePreviewModal}
                className="p-2 text-theme-text-sec hover:text-theme-text bg-theme-bg/50 hover:bg-theme-bg rounded-xl transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content - Iframe Viewport */}
            <div className="flex-grow bg-slate-950 p-2 flex items-center justify-center relative">
              <iframe
                src="/preview/index.html"
                className="w-full h-full border-0 bg-transparent rounded-2xl"
                title="Design Live Preview"
                onLoad={(e) => {
                  const iframe = e.target;
                  const isBirthday = ['cute-balloon', 'elegant-gold'].includes(previewDesignKey);
                  const isTokoOnline = ['modern-clean', 'midnight-dark'].includes(previewDesignKey);
                  const isCampaign = ['neon-conversion', 'clean-trust'].includes(previewDesignKey);
                  const isCv = previewDesignKey === 'professional-dark';
                  const isECourse = previewDesignKey === 'purple-academy';
                  const isJasa = previewDesignKey === 'professional-navy';
                  const isGold = previewDesignKey === 'elegant-gold';
                  const isMidnight = previewDesignKey === 'midnight-dark';

                  let mockData;
                  if (isBirthday) {
                    mockData = {
                      meta: {
                        title: `Contoh Undangan - Tema ${isGold ? 'Elegant Gold' : 'Cute Balloon'}`,
                        template_type: 'birthday',
                        design_key: previewDesignKey,
                        template_version: TEMPLATE_LATEST_VERSIONS[previewDesignKey] || 1
                      },
                      content: {
                        celebrant: isGold ? {
                          name: 'Kayla Amanda',
                          nickname: 'Kayla',
                          age: 'Sweet 17',
                          parent_name: 'Bpk. Hendra & Ibu Rini',
                          image_url: DEFAULT_BRIDE_AVATAR,
                          gender: 'female'
                        } : {
                          name: 'Rafa Al-Fatih',
                          nickname: 'Rafa',
                          age: '5',
                          parent_name: 'Bpk. Hendra & Ibu Siska',
                          image_url: DEFAULT_GROOM_AVATAR,
                          gender: 'male'
                        },
                        event: {
                          date: '2026-08-15',
                          time: '15:00 - 17:30 WIB',
                          location: 'McDonalds Kemang, Jakarta',
                          maps_url: 'https://maps.google.com'
                        },
                        gift: {
                          bank_name: 'Bank BCA',
                          account_number: '9876543210',
                          account_holder: 'Hendra Wijaya'
                        },
                        quote: 'Puji syukur kepada Tuhan YME atas bertambahnya usia putra kami tercinta. Kehadiran dan doa dari teman-teman semua akan melengkapi kebahagiaan di hari istimewa Rafa!'
                      }
                    };
                  } else if (isTokoOnline) {
                    mockData = {
                      meta: {
                        title: `Toko Contoh - Tema ${isMidnight ? 'Midnight Dark' : 'Modern Clean'}`,
                        template_type: 'toko-online',
                        design_key: previewDesignKey,
                        template_version: TEMPLATE_LATEST_VERSIONS[previewDesignKey] || 1
                      },
                      content: {
                        store: {
                          name: isMidnight ? 'Luxor Timepieces' : 'Serasi Gadget Store',
                          tagline: isMidnight ? 'Arloji Mewah & Berkelas Dunia' : 'Gadget Orisinal & Bergaransi Resmi',
                          description: isMidnight
                            ? 'Kami menghadirkan koleksi jam tangan mewah original terkurasi untuk menunjang penampilan eksekutif Anda. Setiap transaksi bergaransi internasional 2 tahun.'
                            : 'Pusat belanja gadget terpercaya di Indonesia. Kami menyediakan smartphone, laptop, dan tablet original dengan cicilan 0% dan gratis ongkir se-Indonesia.',
                          logo_url: null,
                          banner_url: null
                        },
                        products: [
                          {
                            name: isMidnight ? 'Submariner Gold Edition' : 'UltraBook Pro 14"',
                            price: isMidnight ? '245000000' : '15999000',
                            description: isMidnight
                              ? 'Model premium dengan bezel emas 18 karat, dial hitam berkilau, dan ketahanan air hingga 300 meter. Sangat ikonik.'
                              : 'Dilengkapi prosesor M4 terbaru, RAM 16GB, storage 512GB SSD, layar Liquid Retina, dan daya tahan baterai hingga 18 jam.',
                            image_url: null
                          },
                          {
                            name: isMidnight ? 'Chronograph Carbon Black' : 'Smart Earbuds Pro 2',
                            price: isMidnight ? '98000000' : '2499000',
                            description: isMidnight
                              ? 'Desain sporty tangguh dengan casing serat karbon ultra ringan, dial hitam matte, dan strap karet berkualitas tinggi.'
                              : 'Fitur Active Noise Cancelling (ANC) tingkat lanjut, audio spasial personal, pengisian daya cepat, dan tahan cipratan air IPX4.',
                            image_url: null
                          }
                        ],
                        contact: {
                          whatsapp: '6281234567890',
                          instagram: isMidnight ? '@luxor.watches' : '@serasi.gadget',
                          shopee_url: 'https://shopee.co.id',
                          tokopedia_url: 'https://tokopedia.com',
                          address: 'Kuningan City Mall, Lantai Dasar No. 12, Jakarta Selatan'
                        },
                        quote: isMidnight
                          ? 'Waktu adalah kemewahan sejati. Hargai setiap detik perjalanan hidup Anda dengan arloji terbaik.'
                          : 'Teknologi terbaik untuk menunjang produktivitas dan kreativitas tanpa batas setiap hari.'
                      }
                    };
                  } else if (isCampaign) {
                    mockData = {
                      meta: {
                        title: `Contoh Campaign - Tema ${previewDesignKey === 'neon-conversion' ? 'Neon Conversion' : 'Clean Trust'}`,
                        template_type: 'campaign',
                        design_key: previewDesignKey,
                        template_version: TEMPLATE_LATEST_VERSIONS[previewDesignKey] || 1
                      },
                      content: {
                        hero: {
                          headline: 'Tulis Copywriting Landing Page yang Menghasilkan Penjualan dalam 10 Menit 🚀',
                          subheadline: 'Dapatkan formula prompts AI & video panduan praktis yang telah teruji mendatangkan ribuan pembeli, tanpa sewa copywriter mahal.',
                          cta_text: 'Dapatkan Blueprint Sekarang!'
                        },
                        problems: {
                          title: 'Hambatan Utama Jualan Online Anda 😰',
                          list: [
                            'Sudah bayar iklan mahal tapi pengunjung pergi tanpa membeli.',
                            'Bingung memikirkan kata-kata penawaran yang menarik dan persuasif.',
                            'Tidak punya budget besar untuk menyewa copywriter profesional.'
                          ]
                        },
                        solutions: {
                          title: 'Solusi Terbaik Untuk Anda 💡',
                          intro: 'Memperkenalkan AI Copywriting Blueprint — Formula rahasia menyulap kata-kata menjadi mesin uang otomatis untuk bisnis Anda.',
                          benefits: [
                            {
                              title: 'Tulis Instan ⚡',
                              desc: 'Akses 100+ template promosi siap pakai tinggal copy-paste dan sesuaikan dengan produk Anda.'
                            },
                            {
                              title: 'Dongkrak Konversi 📈',
                              desc: 'Alur tulisan disusun menggunakan formula psikologi konsumen AIDA (Attention, Interest, Desire, Action).'
                            },
                            {
                              title: 'Integrasi Prompts AI 🤖',
                              desc: 'Panduan lengkap cara perintah ChatGPT/Claude agar menghasilkan teks iklan yang natural.'
                            }
                          ]
                        },
                        social_proof: {
                          testimonials: [
                            {
                              name: 'Andi Prasetya',
                              role: 'Pemilik Toko Online',
                              content: 'Awalnya ragu beli blueprint seharga 99rb ini. Tapi setelah dipraktikkan, conversion rate jualan naik dari 1% jadi 4.5%! Luar biasa.'
                            },
                            {
                              name: 'Siti Rahma',
                              role: 'Solo-preneur Kuliner',
                              content: 'Sangat membantu buat saya yang gaptek menulis. Templatenya tinggal dicontek, bahasa iklan jadi hidup dan tidak kaku lagi.'
                            }
                          ],
                          guarantee: '🛡️ Jaminan 100% Garansi Kepuasan 7 Hari — Jika isi blueprint tidak memberikan manfaat bagi bisnis Anda, hubungi kami dan uang kembali utuh.'
                        },
                        closing: {
                          urgency: '🔥 Penawaran Terbatas! Diskon 70% khusus untuk 100 pembeli pertama hari ini. Harga akan kembali normal ke Rp 330.000.',
                          cta_text: 'Ambil Diskon 70% & Download Sekarang! 📥'
                        },
                        contact: {
                          whatsapp: '6281234567890'
                        }
                      }
                    };
                  } else if (isCv) {
                    mockData = {
                      meta: {
                        title: 'CV — Rian Prasetya',
                        theme: 'professional-dark',
                        template_type: 'cv',
                        design_key: 'professional-dark',
                        template_version: TEMPLATE_LATEST_VERSIONS['professional-dark'] || 1
                      },
                      content: {
                        profile: {
                          name: 'Rian Prasetya',
                          title: 'Senior Fullstack Engineer',
                          summary: 'Highly skilled and results-driven Fullstack Developer with expertise in building robust web applications using Node.js, Express, React, and TypeScript. Proven ability to deliver scalable backend solutions and dynamic, responsive frontend user interfaces.',
                          photo_url: null,
                          email: 'rian.prasetya@example.com',
                          phone: '6281234567890',
                          location: 'Jakarta, Indonesia',
                          linkedin_url: 'https://linkedin.com/in/rianprasetya',
                          github_url: 'https://github.com/rianprasetya',
                          portfolio_url: 'https://rian.dev'
                        },
                        experiences: [
                          {
                            company: 'PT Tech Solution',
                            position: 'Backend Developer',
                            period: '2023 - Present',
                            description: 'Developed and maintained robust RESTful APIs using Express.js and PostgreSQL, facilitating seamless data exchange and application functionality.\nDesigned and implemented efficient database schemas in PostgreSQL to support high-volume transactions and ensure data integrity.'
                          }
                        ],
                        educations: [
                          {
                            institution: 'Institut Teknologi Bandung',
                            degree: 'S1 Teknik Informatika',
                            period: '2019 - 2023',
                            gpa: '3.85'
                          }
                        ],
                        skills: ['Node.js', 'Express', 'React', 'TypeScript', 'PostgreSQL', 'ATS Optimization'],
                        languages: [
                          { language: 'Bahasa Indonesia', level: 'Native' },
                          { language: 'English', level: 'Professional' }
                        ],
                        certifications: [
                          {
                            name: 'Google Cloud Professional Cloud Architect',
                            issuer: 'Google Cloud',
                            year: '2024'
                          }
                        ]
                      }
                    };
                  } else if (isJasa) {
                    mockData = {
                      meta: {
                        title: 'Siluet Agency — Jasa Profesional',
                        theme: 'professional-navy',
                        template_type: 'jasa',
                        design_key: 'professional-navy',
                        template_version: TEMPLATE_LATEST_VERSIONS['professional-navy'] || 1
                      },
                      content: {
                        brand: {
                          name: 'Siluet Agency',
                          tagline: 'Solusi Digital Kreatif & Terpercaya',
                          description: 'Agensi kreatif yang membantu bisnis Anda tumbuh pesat di era digital.',
                          logo_url: '',
                          cta_text: 'Hubungi Kami',
                          cta_url: ''
                        },
                        hero: {
                          headline: 'Akselerasi Bisnis Anda dengan Solusi Digital Kreatif 🚀',
                          subheadline: 'Web design, digital branding, dan strategi marketing premium untuk meningkatkan omzet dan kredibilitas bisnis Anda.',
                          cta_text: 'Konsultasi Gratis Sekarang',
                          cta_secondary_text: 'Lihat Layanan Kami',
                          image_url: ''
                        },
                        social_proof: {
                          client_count: '150+',
                          project_count: '320+',
                          product_count: '45+',
                          label_clients: 'Klien Puas',
                          label_projects: 'Project Selesai',
                          label_products: 'Brand Partner'
                        },
                        how_it_works: {
                          title: 'Cara Kerja Kami',
                          steps: [
                            { title: 'Diskusi & Konsultasi', desc: 'Kami mempelajari bisnis Anda, kompetitor, serta target audiens secara mendalam.' },
                            { title: 'Desain & Strategi', desc: 'Tim kami merancang konsep visual dan menyusun roadmap eksekusi yang terukur.' },
                            { title: 'Peluncuran & Support', desc: 'Proyek diluncurkan tepat waktu dengan jaminan optimasi dan dukungan teknis penuh.' }
                          ]
                        },
                        about: {
                          title: 'Tentang Siluet Agency',
                          desc: 'Siluet Agency berdiri sejak 2020 dengan misi mendemokrasikan teknologi bagi pelaku bisnis. Kami percaya setiap brand memiliki cerita unik, dan tugas kami adalah mengemas cerita tersebut menjadi identitas digital yang profesional dan menghasilkan konversi.',
                          image_url: '',
                          cta_portfolio_text: 'Lihat Portofolio',
                          cta_order_text: 'Pesan Sekarang'
                        },
                        services: {
                          title: 'Layanan Utama Kami',
                          list: [
                            { name: 'Pembuatan Website', desc: 'Website company profile, e-commerce, atau landing page custom berkecepatan tinggi.', features: ['Responsive Design', 'SEO-Friendly', 'Integrasi Analytics'], image_url: '' },
                            { name: 'Branding & Identitas', desc: 'Logo, visual guidelines, dan marketing collateral untuk memperkuat identitas brand.', features: ['Desain Logo Custom', 'Brand Guidelines', 'Social Media Kit'], image_url: '' }
                          ]
                        },
                        why_us: {
                          title: 'Mengapa Klien Memilih Kami?',
                          points: [
                            { title: 'Tepat Waktu', desc: 'Setiap milestone diselesaikan sesuai timeline yang disepakati tanpa kompromi.' },
                            { title: 'Orientasi Hasil', desc: 'Setiap elemen desain yang kami buat ditargetkan untuk meningkatkan penjualan.' },
                            { title: 'Harga Transparan', desc: 'Tanpa biaya tersembunyi. Anda mendapatkan update berkala selama pengerjaan.' },
                            { title: 'Dukungan Penuh', desc: 'Tim support siap membantu Anda bahkan setelah project selesai diluncurkan.' }
                          ]
                        },
                        deliverables: {
                          title: 'Apa yang Anda Dapatkan',
                          list: [
                            { title: 'Aset Digital Eksklusif', desc: 'Semua file desain master dan source code menjadi hak milik penuh Anda.' },
                            { title: 'Dokumentasi & Panduan', desc: 'Video tutorial praktis cara mengoperasikan dan mengupdate konten website secara mandiri.' },
                            { title: 'Maintenance 30 Hari', desc: 'Support gratis berupa backup data dan perbaikan bug selama satu bulan penuh.' }
                          ]
                        },
                        pricing: {
                          title: 'Pilih Paket Investasi Anda',
                          plans: [
                            { name: 'Paket Starter', badge: '', original_price: 'Rp 2.500.000', sale_price: 'Rp 1.490.000', features: ['Landing Page 1 Halaman', 'Responsive Design', 'Free Domain & Hosting 1 Th', 'Revisi 2x'], highlighted: false },
                            { name: 'Paket Growth', badge: 'Terpopuler', original_price: 'Rp 5.000.000', sale_price: 'Rp 3.490.000', features: ['Multi-Page (Up to 5)', 'Desain Custom Premium', 'Free Domain & Hosting 1 Th', 'Revisi 5x', 'Basic SEO Setup'], highlighted: true },
                            { name: 'Paket Enterprise', badge: '', original_price: 'Rp 10.000.000', sale_price: 'Rp 7.490.000', features: ['Full Custom Web App', 'Sistem Admin Panel', 'Integrasi API', 'Revisi Unlimited', 'Support 24/7'], highlighted: false }
                          ]
                        },
                        guarantee: {
                          title: 'Garansi Kepuasan 100%',
                          desc: 'Kami menjamin kualitas setiap project yang kami kerjakan. Jika hasil tidak sesuai brief awal yang disepakati, kami siap melakukan revisi intensif demi kepuasan kerja sama yang terbaik.'
                        },
                        testimonials: {
                          title: 'Ulasan Klien Kami',
                          list: [
                            { name: 'Budi Hartono', role: 'Owner Kuliner Hits', content: 'Website yang dibuat Siluet Agency sangat meningkatkan kredibilitas brand kami di mata investor. Sangat profesional!', avatar_url: '' },
                            { name: 'Santi Wijaya', role: 'Founder Fashionista', content: 'Sejak landing page baru diluncurkan, konversi iklan berbayar kami naik 42%. Terima kasih atas rekomendasinya!', avatar_url: '' }
                          ]
                        },
                        faqs: [
                          { question: 'Apakah saya bisa mengedit isi website sendiri?', answer: 'Ya! Kami menyertakan panduan video lengkap sehingga Anda bisa mengupdate teks, gambar, atau produk secara mandiri dengan mudah.' },
                          { question: 'Apakah domain dan hosting sudah termasuk?', answer: 'Ya, semua paket sudah termasuk domain .com/.id dan hosting performa tinggi gratis selama 1 tahun pertama.' }
                        ],
                        contact: {
                          whatsapp: '6281234567890',
                          email: 'halo@siluet.web.id',
                          address: 'SCBD, Jakarta Selatan',
                          copyright: '© 2026 Siluet Agency. Seluruh hak cipta dilindungi.'
                        },
                        closing_cta: {
                          title: 'Siap Memulai Project Bersama Kami?',
                          cta_text: 'Konsultasi Gratis — Tanpa Komitmen'
                        }
                      }
                    };
                  } else if (isECourse) {
                    mockData = {
                      meta: {
                        title: 'E-Course: Digital Marketing Mastery',
                        theme: 'purple-academy',
                        template_type: 'e-course',
                        design_key: 'purple-academy',
                        template_version: TEMPLATE_LATEST_VERSIONS['purple-academy'] || 1
                      },
                      content: {
                        courseName: 'Digital Marketing Mastery',
                        courseBrief: 'Kelas online terlengkap cara jualan dan iklan digital mendatangkan pembeli berlimpah.',
                        hero: {
                          headline: 'Kuasai Iklan Digital & Naikkan Omzet Bisnis 10x Lipat! 🚀',
                          subheadline: 'Belajar taktik jualan laris di Facebook, Instagram, Google, & TikTok Ads dibimbing langsung oleh praktisi berpengalaman.',
                          cta_text: 'Amankan Slot Belajar Sekarang!'
                        },
                        problems: {
                          title: 'Kendala Utama Pebisnis Online 😰',
                          list: [
                            'Iklan boncos terus menerus tanpa mendatangkan konversi.',
                            'Bingung cara menentukan target audiens yang spesifik.',
                            'Belum punya strategi funneling yang teruji menghasilkan penjualan.'
                          ]
                        },
                        solutions: {
                          title: 'Metode Belajar Terstruktur 💡',
                          intro: 'Kelas ini dirancang khusus untuk memandu Anda dari nol sampai mandiri beriklan.',
                          list: [
                            'Materi video e-learning interaktif 50+ modul lengkap.',
                            'Tugas praktik langsung dan studi kasus real-world.',
                            'Bimbingan langsung via webinar rutin setiap minggu.'
                          ]
                        },
                        audience: {
                          title: 'Siapa Yang Wajib Ikut Kelas Ini? 🎯',
                          list: [
                            'Pebisnis UMKM yang ingin ekspansi ke digital.',
                            'Karyawan swasta yang ingin belajar side income.',
                            'Freelancer & Mahasiswa yang ingin membuka jasa iklan.'
                          ]
                        },
                        mentor: {
                          name: 'Rian Prasetya',
                          role: 'Digital Marketing Lead at Serasi Tech',
                          desc: 'Pengalaman 8+ tahun mengelola budget iklan digital senilai miliaran rupiah dan membantu ratusan UMKM naik kelas.'
                        },
                        curriculum: {
                          title: 'Kurikulum & Modul Belajar 📖',
                          modules: [
                            { title: 'Modul 01: Fondasi Mindset Beriklan', desc: 'Memahami dasar marketing funneling, psikologi pembeli, dan riset pasar kompetitor.' },
                            { title: 'Modul 02: Praktek Setup FB & IG Ads', desc: 'Langkah demi langkah mendaftar Business Manager, pasang Pixel tracking, dan riset audiens.' },
                            { title: 'Modul 03: Optimasi Skala Iklan (Scaling)', desc: 'Cara membaca metrik iklan, optimasi budget CBO/ABO, dan teknik retargeting conversion.' }
                          ]
                        },
                        benefits: {
                          title: 'Fasilitas Belajar Premium ⭐',
                          list: [
                            { title: 'Akses Selamanya 🌐', desc: 'Dapatkan update materi e-course gratis selamanya tanpa biaya bulanan lagi.' },
                            { title: 'Grup Komunitas Eksklusif 👥', desc: 'Bergabung dengan ribuan alumni lainnya untuk diskusi dan networking.' },
                            { title: 'Sertifikat Kelulusan Resmi 🎓', desc: 'Klaim sertifikat digital resmi setelah menyelesaikan seluruh modul kelas.' }
                          ]
                        },
                        bonuses: {
                          title: 'Bonus Spesial Hari Ini 🎁',
                          list: [
                            { title: 'Template Copywriting Siap Pakai 📝', desc: 'Kumpulan kata-kata promosi konversi tinggi untuk berbagai jenis industri produk.' },
                            { title: '100+ Ide Prompts AI Chatbot 🤖', desc: 'Gunakan kecerdasan buatan untuk merancang materi promosi dalam hitungan detik.' }
                          ]
                        },
                        pricing: {
                          title: 'Investasi Belajar Sekali Seumur Hidup 💰',
                          original_price: 'Rp 999.000',
                          discounted_price: 'Rp 199.000',
                          cta_text: 'Daftar & Gabung Kelas Hari Ini',
                          features: [
                            'Akses 50+ Modul Video HD',
                            'Gabung Grup Komunitas Telegram',
                            'Webinar Tanya Jawab Mingguan',
                            'Free Update Materi Selamanya'
                          ]
                        },
                        testimonials: {
                          title: 'Ulasan Jujur Dari Alumni 💬',
                          list: [
                            { name: 'Andi Setiawan', role: 'UMKM Fashion Solo', content: 'Materi modul FB Ads-nya sangat gampang dipahami pemula. Setelah praktek sebulan, omzet saya naik hampir 3 kali lipat!' },
                            { name: 'Dewi Lestari', role: 'Ibu Rumah Tangga', content: 'Sangat recommended! Sekarang saya bisa punya penghasilan sendiri dari rumah dengan membuka jasa setup iklan toko online.' }
                          ]
                        },
                        faqs: [
                          { question: 'Apakah pemula total bisa mengikuti kelas ini?', answer: 'Ya tentu saja! Kurikulum dirancang dari fondasi dasar beriklan hingga taktik tingkat lanjut.' },
                          { question: 'Berapa lama masa akses materi e-course?', answer: 'Anda mendapatkan akses selamanya, termasuk update materi gratis di masa mendatang.' }
                        ],
                        contact: {
                          whatsapp: '6281234567890'
                        }
                      }
                    };
                  } else {
                    mockData = {
                      meta: {
                        title: `Contoh Undangan - Tema ${previewDesignKey === 'sage-green' ? 'Sage Green' : previewDesignKey === 'floral-pink' ? 'Floral Pink' : previewDesignKey === 'classic-love' ? 'Classic Love' : 'Javanese Traditional'}`,
                        template_type: 'wedding',
                        design_key: previewDesignKey,
                        template_version: TEMPLATE_LATEST_VERSIONS[previewDesignKey] || 1
                      },
                      content: {
                        groom: {
                          name: 'Rian Adiputra, S.T.',
                          nickname: 'Rian',
                          father: 'Bpk. Ir. H. Ahmad Sudrajat',
                          mother: 'Ibu Hj. Siti Aminah',
                          image_url: '/groom-avatar.jpg'
                        },
                        bride: {
                          name: 'Adinda Saraswati, M.B.A.',
                          nickname: 'Dinda',
                          father: 'Bpk. Prof. Dr. Budi Santoso',
                          mother: 'Ibu Dr. Rini Kartika',
                          image_url: '/bride-avatar.jpg'
                        },
                        story: [
                          { year: '2021', title: 'Pertama Bertemu', desc: 'Kami diperkenalkan oleh seorang teman baik di sebuah acara sosial, di mana kami menemukan banyak kesamaan minat.' },
                          { year: '2023', title: 'Menyatakan Komitmen', desc: 'Setelah dua tahun tumbuh bersama dalam persahabatan dan kecocokan, kami berkomitmen untuk melangkah ke arah masa depan bersama.' },
                          { year: '2025', title: 'Pertunangan', desc: 'Di hadapan keluarga besar, Rian melamar Dinda untuk membangun keluarga bahagia dan abadi bersama.' }
                        ],
                        gallery: [
                          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
                          'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600',
                          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600'
                        ],
                        akad: {
                          date: '2026-10-10',
                          time: '09:00 - 11:00 WIB',
                          location: 'Masjid Raya Pondok Indah',
                          maps_url: 'https://maps.google.com'
                        },
                        resepsi: {
                          date: '2026-10-10',
                          time: '11:00 - 14:00 WIB',
                          location: 'Hotel Mulia Senayan, Jakarta',
                          maps_url: 'https://maps.google.com'
                        },
                        gift: {
                          bank_name: 'Bank BCA',
                          account_number: '1234567890',
                          account_holder: 'Rian Adiputra'
                        },
                        quote: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir. (QS. Ar-Rum: 21)'
                      }
                    };
                  }

                  // Wait a brief moment to ensure iframe listener is registered
                  setTimeout(() => {
                    if (iframe.contentWindow) {
                      iframe.contentWindow.postMessage({
                        type: 'UPDATE_PREVIEW',
                        pageData: mockData
                      }, '*');
                    }
                  }, 150);
                }}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-theme-border bg-theme-bg flex justify-between items-center">
              <span className="text-[10px] text-theme-text-muted">Desain responsif untuk HP & Desktop</span>
              <button
                onClick={closePreviewModal}
                className="px-4 py-2 bg-theme-card hover:bg-theme-surface text-theme-text rounded-xl text-xs font-semibold transition-colors"
              >
                Tutup Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* V2 Visual Catalog Section Picker Modal */}
      <V2VisualSectionPickerModal

        isOpen={isV2VisualPickerOpen}
        onClose={() => setIsV2VisualPickerOpen(false)}
        onSelectSection={handleAddSection}
        existingSections={v2Sections}
      />

      {/* V2 Starter Kit Onboarding Preset Modal */}
      {isV2OnboardingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-theme-card border border-theme-border rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-theme-border flex justify-between items-center bg-theme-bg/60">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">✨</span>
                <div>
                  <h3 className="text-base font-extrabold text-theme-text">Pilih Preset Starter Kit V2</h3>
                  <p className="text-xs text-theme-text-sec mt-0.5">Mulai dengan racikan susunan section terbukti paling efektif sesuai tujuan Anda</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsV2OnboardingOpen(false)}
                className="p-2 text-theme-text-sec hover:text-theme-text hover:bg-theme-bg rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {V2_STARTER_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectV2Preset(preset.id)}
                    className="group p-5 bg-theme-bg hover:bg-theme-bg/90 border border-theme-border hover:border-theme-accent rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-lg hover:shadow-theme-accent/5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{preset.icon}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-theme-accent/10 text-theme-accent border border-theme-accent/20">
                          {preset.badge}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-theme-text group-hover:text-theme-accent transition-colors">
                        {preset.name}
                      </h4>
                      <p className="text-xs text-theme-text-sec leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-theme-border/40 flex items-center justify-between">
                      <span className="text-[10px] text-theme-text-muted font-bold">
                        {preset.sections.length} Section Terpasang
                      </span>
                      <span className="text-xs font-extrabold text-theme-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Gunakan Preset</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<Loading fullScreen={true} text="Memuat Modul AI..." size="lg" />}>
      <GenerateContent />
    </Suspense>
  );
}
