'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
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

// Helper dinamis untuk ikon template
const getProductIcon = (id) => {
  switch (id) {
    case 'wedding': return '🌸';
    case 'birthday': return '🎂';
    case 'toko-online': return '🛍️';
    case 'campaign': return '⚡';
    case 'cv': return '📄';
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

function GenerateContent() {
  const { user, session, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('id');
  const editMode = searchParams.get('editMode') === 'true';
  const [editCount, setEditCount] = useState(0);
  const iframeRef = useRef(null);
  const [iframeReady, setIframeReady] = useState(false);

  // Input states
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [slug, setSlug] = useState('');
  const [templateType, setTemplateType] = useState('toko-online');
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
  const [previewDesignKey, setPreviewDesignKey] = useState(null);

  const closePreviewModal = () => {
    setPreviewDesignKey(null);
    if (typeof window !== 'undefined' && window.history.state?.isPreviewModal) {
      window.history.back();
    }
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
  const [campaignBrief, setCampaignBrief] = useState('');

  // Campaign AI loader states
  const [isGeneratingCampaignHero, setIsGeneratingCampaignHero] = useState(false);
  const [isGeneratingCampaignProblems, setIsGeneratingCampaignProblems] = useState(false);
  const [isGeneratingCampaignBenefits, setIsGeneratingCampaignBenefits] = useState(false);
  const [isGeneratingCampaignTestimonials, setIsGeneratingCampaignTestimonials] = useState(false);
  const [isGeneratingCampaignUrgency, setIsGeneratingCampaignUrgency] = useState(false);

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
 
  // CV AI loader states
  const [isGeneratingCvSummary, setIsGeneratingCvSummary] = useState(false);
  const [isGeneratingCvExperienceDesc, setIsGeneratingCvExperienceDesc] = useState({});

  // Toko Online upload & AI loader states
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingProductIndex, setIsUploadingProductIndex] = useState(null);
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
            setMaxPreweddingGenerations(result.systemSettings.max_prewedding_generations || 3);
          }
        }
      } catch (e) {
        // Non-critical: silently ignore
      }
    };
    fetchTrackingConfig();
  }, [session]);

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
            setPageData(pageConfig);

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
              setDesignKey(pageConfig.meta?.design_key || 'neon-conversion');
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
  }, [session, draftId]);

  // Auto-update pageData in editMode to refresh the iframe live preview in real-time
  useEffect(() => {
    if (!editMode || !projectId) return;

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
      metaTitle = campaignHeadline || 'Campaign Halaman';
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
          whatsapp: campaignWhatsapp
        }
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
    } else {
      metaTitle = 'Draft Page';
      assembledContent = {};
    }

    const assembledPageData = {
      meta: {
        template_type: templateType,
        design_key: designKey,
        title: metaTitle,
        theme: designKey
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
            setProducts(result.data);

            // Set the first active template as default ONLY if creating a new project (no draftId)
            if (!draftId) {
              const activeProducts = result.data.filter(p => p.is_active);
              if (activeProducts.length > 0) {
                setTemplateType(prev => {
                  const currentIsActive = activeProducts.some(p => p.id === prev);
                  return currentIsActive ? prev : activeProducts[0].id;
                });
              }
            }
          }
        }
      } catch (err) {
        console.error('Gagal mengambil daftar produk/template:', err);
      }
    };
    fetchProducts();
  }, [session, draftId]);

  const getDisplayProducts = () => {
    if (products && products.length > 0) {
      return products;
    }
    return [
      { id: 'toko-online', name: 'Toko Online', is_active: true, cost: 10000, description: 'Desain responsif komersial, katalog produk modern, dan CTA kontak WhatsApp.', unit: 'Toko' },
      { id: 'campaign', name: 'Campaign Landing Page', is_active: true, cost: 15000, description: 'Landing page satu halaman dengan struktur konversi tinggi untuk promosi produk atau penawaran digital.', unit: 'Campaign' },
      { id: 'wedding', name: 'Undangan Pernikahan', is_active: true, cost: 10000, description: 'Undangan digital premium dengan kelola RSVP, iringan musik, dan linimasa kisah kasih.', unit: 'Undangan' },
      { id: 'birthday', name: 'Undangan Ulang Tahun', is_active: true, cost: 19000, description: 'Desain ceria dan elegan untuk pesta ulang tahun anak maupun dewasa.', unit: 'Undangan' }
    ];
  };

  const displayProducts = getDisplayProducts();
  const currentProduct = displayProducts.find(p => p.id === templateType);
  const currentCost = currentProduct?.cost ?? 10000;

  const getFinalCost = () => {
    const baseCost = currentProduct?.cost ?? 10000;
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

  // Helper to validate the form before preview generate
  const isFormInvalid = () => {
    if (!name) return true;
    if (templateType === 'wedding') {
      return !groomName || !groomNickname || !groomFather || !groomMother ||
        !brideName || !brideNickname || !brideFather || !brideMother ||
        !akadDate || !akadTime || !akadLocation ||
        !resepsiDate || !resepsiTime || !resepsiLocation;
    }
    if (templateType === 'birthday') {
      return !celebrantName || !celebrantNickname || !celebrantAge ||
        !birthdayDate || !birthdayTime || !birthdayLocation;
    }
    if (templateType === 'toko-online') {
      return !storeName || !storeTagline || !tokoWhatsapp ||
        tokoProducts.length === 0 ||
        tokoProducts.some(p => !p.name || !p.price);
    }
    if (templateType === 'campaign') {
      return !campaignHeadline || !campaignSubheadline || !campaignWhatsapp ||
        campaignBenefits.some(b => !b.title || !b.desc) ||
        campaignTestimonials.some(t => !t.name || !t.content);
    }
    if (templateType === 'cv') {
      return !cvName || !cvTitle || !cvSummary || !cvEmail || !cvPhone || !cvLocation ||
        cvSkills.length === 0 ||
        cvEducations.length === 0 ||
        cvEducations.some(e => !e.institution || !e.degree || !e.period);
    }
    if (templateType === 'store') {
      return !prompt;
    }
    return false;
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

    let category = 'other';
    if (isGroom || isBride || isCelebrant) category = 'avatar';
    else if (isPrewedding || isCampaignHero || isBanner) category = 'background';
    else if (isGallery) category = 'gallery';
    else if (isStory) category = 'story';
    else if (isLogo) category = 'logo';
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
        throw new Error('Gagal mengunggah file langsung ke storage.');
      }

      console.log(`[Dashboard] Upload successful. Public URL: ${publicUrl}`);

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
      if (isProduct) {
        const oldProductImageUrl = tokoProducts[productIndex]?.image_url;
        if (oldProductImageUrl) handleDeleteImage(oldProductImageUrl);
        setTokoProducts(prev => {
          const next = [...prev];
          next[productIndex].image_url = publicUrl;
          return next;
        });
      }
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
      if (isCv) setIsUploadingCvPhoto(false);
    }
  };

  const handleDeleteImage = async (imageUrl) => {
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
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ path })
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
          params: { prompt: userPrompt }
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
        body: JSON.stringify({ fieldType, context }),
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

    const context = {
      campaignName: name,
      campaignBrief: campaignBrief
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/field`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ fieldType, context }),
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
    }
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
    if (isFormInvalid()) return;

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
        } else if (templateType === 'toko-online') {
          compiledPageData = {
            meta: {
              title: storeName || 'Toko Online',
              theme: designKey,
              template_type: 'toko-online',
              design_key: designKey,
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
              title: campaignHeadline || 'Campaign Halaman',
              theme: designKey,
              template_type: 'campaign',
              design_key: designKey,
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
                whatsapp: campaignWhatsapp || ''
              }
            }
          };
        } else if (templateType === 'wedding') {
          compiledPageData = {
            meta: {
              title: `Undangan Pernikahan ${groomNickname || 'Groom'} & ${brideNickname || 'Bride'}`,
              theme: designKey,
              template_type: 'wedding',
              design_key: designKey,
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
            if (!projectId) {
              setProjectId(saveResult.data.id || saveResult.data.projectId);
              setProjectStatus('draft');
            }
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

    setError('');
    setIsPublishing(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/edit-deployed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ name, pageData }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
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
    e.preventDefault();
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

  return (
    <div className="min-h-screen bg-theme-bg flex flex-col transition-theme">
      <Sidebar />

      {/* Main Content Area - Mobile Centered Column */}
      <main className="flex-grow p-4 flex flex-col min-h-screen pt-20 pb-48 md:pb-28 max-w-md mx-auto w-full bg-theme-surface border-x border-theme-border relative transition-theme">
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

        {/* Content Panels Mobile-First Layout */}
        <div className="flex-grow flex flex-col min-h-0 w-full">
          {/* Tab Switcher (Only shown if pageData exists) */}
          {pageData && (
            <div className="flex bg-theme-bg p-1 rounded-xl border border-theme-border mb-4 flex-shrink-0">
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

          {/* Tab 1: Edit Form */}
          {(!pageData || activeTab === 'edit') && (
            <div className="w-full flex-grow flex flex-col">
              <div className="bg-theme-card/40 border border-theme-border rounded-2xl p-5 flex flex-col md:overflow-y-auto shrink-0 mb-6 md:max-h-[62vh] scrollbar-thin">
                <div className="space-y-5">
                  <div className="pb-2 border-b border-theme-border">
                    <h3 className="text-sm font-bold text-theme-text tracking-wide" style={{ fontFamily: "'Sora', sans-serif" }}>Detail Landing Page</h3>
                    <p className="text-[10px] text-theme-text-sec mt-0.5">Lengkapi formulir untuk membuat pratinjau halaman Anda</p>
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
                         templateType === 'cv' ? 'Nama CV / Resume' : 'Nama Halaman / Acara'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={
                          templateType === 'wedding' ? 'Contoh: Pernikahan Budi & Riri' :
                          templateType === 'birthday' ? 'Contoh: Ulang Tahun Kayla - Ke-17' :
                          templateType === 'toko-online' ? 'Contoh: Serasi Gadget Store' :
                          templateType === 'campaign' ? 'Contoh: Blueprint Copywriting AI' :
                          templateType === 'cv' ? 'Contoh: CV Rian Prasetya - Senior Developer' : 'Contoh: Halaman Keren Saya'
                        }
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isGenerating}
                        className="block w-full px-3.5 py-2.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none transition-colors"
                      />
                    </div>

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
                                onClick={() => setDesignKey('sage-green')}
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
                                onClick={() => setDesignKey('floral-pink')}
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
                                onClick={() => setDesignKey('classic-love')}
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
                                onClick={() => setDesignKey('javanese-traditional')}
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
                        <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider pt-1">Detail Mempelai Pria</div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Nama Lengkap Pria"
                            value={groomName}
                            onChange={(e) => setGroomName(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Panggilan"
                            value={groomNickname}
                            onChange={(e) => setGroomNickname(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Nama Ayah Pria"
                            value={groomFather}
                            onChange={(e) => setGroomFather(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Nama Ibu Pria"
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
                        <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider pt-1">Detail Mempelai Wanita</div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Nama Lengkap Wanita"
                            value={brideName}
                            onChange={(e) => setBrideName(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Panggilan"
                            value={brideNickname}
                            onChange={(e) => setBrideNickname(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Nama Ayah Wanita"
                            value={brideFather}
                            onChange={(e) => setBrideFather(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Nama Ibu Wanita"
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
                        <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider pt-1">Acara Akad Nikah</div>
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
                          placeholder="Lokasi Akad (Masjid Agung Jambi)"
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
                        <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider pt-1">Acara Resepsi</div>
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
                          placeholder="Lokasi Resepsi (Gedung Serbaguna)"
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
                                onClick={() => setDesignKey('cute-balloon')}
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
                                onClick={() => setDesignKey('elegant-gold')}
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
                        <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider pt-1">Detail Yang Berulang Tahun</div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Nama Lengkap"
                            value={celebrantName}
                            onChange={(e) => setCelebrantName(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Nama Panggilan"
                            value={celebrantNickname}
                            onChange={(e) => setCelebrantNickname(e.target.value)}
                            className="block w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Umur (e.g. 5 atau Sweet 17)"
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
                        <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider pt-1">Acara Perayaan</div>
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
                          placeholder="Nama Tempat / Lokasi Acara"
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
                                onClick={() => setDesignKey('modern-clean')}
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
                                onClick={() => setDesignKey('midnight-dark')}
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
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Nama Toko</label>
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
                              <label className="block text-[8px] font-semibold text-theme-text-sec">Tagline Toko</label>
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
                          <span className="text-[9px] font-bold text-theme-accent uppercase tracking-wider">Katalog Produk ({tokoProducts.length}/6)</span>
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
                                <span className="text-[10px] font-bold text-theme-text-sec">Produk #{index + 1}</span>
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
                                  placeholder="Nama Produk"
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
                                  placeholder="Harga (e.g. 150000)"
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
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">WhatsApp Toko</label>
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
                                onClick={() => setDesignKey('neon-conversion')}
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
                                onClick={() => setDesignKey('clean-trust')}
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
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Headline Utama</label>
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
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Sub-headline</label>
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
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Teks Tombol CTA Utama</label>
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
                          <div className="text-[9px] font-bold text-theme-accent uppercase tracking-wider">2. Kontak WhatsApp</div>
                          <div>
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">WhatsApp Checkout (Format: 628xxx)</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 6281234567890"
                              value={campaignWhatsapp}
                              onChange={(e) => setCampaignWhatsapp(e.target.value)}
                              className="block w-full px-3 py-1.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none"
                            />
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
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Judul Bagian Solusi</label>
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
                            <label className="block text-[8px] font-semibold text-theme-text-sec">Poin-Poin Manfaat Utama (Max 3)</label>
                            {campaignBenefits.map((benefit, index) => (
                              <div key={index} className="bg-theme-bg/30 p-2.5 rounded-xl border border-theme-border space-y-1.5">
                                <input
                                  type="text"
                                  required
                                  placeholder={`Nama Manfaat #${index + 1}`}
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
                                  placeholder={`Penjelasan Manfaat #${index + 1}`}
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
                            <label className="block text-[8px] font-semibold text-theme-text-sec">Contoh Testimoni Pelanggan (Max 2)</label>
                            {campaignTestimonials.map((t, index) => (
                              <div key={index} className="bg-theme-bg/30 p-2.5 rounded-xl border border-theme-border space-y-1.5">
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    required
                                    placeholder={`Nama Testi #${index + 1}`}
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
                                  placeholder={`Isi Testi #${index + 1}`}
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
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Teks Urgensi / Kelangkaan (Scarcity)</label>
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
                            <label className="block text-[8px] font-semibold text-theme-text-sec mb-1">Teks Tombol CTA Penutup</label>
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
                                onClick={() => setDesignKey('professional-dark')}
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

                      </div>
                    )}

                    {/* Prompt input */}
                    {templateType !== 'toko-online' && templateType !== 'campaign' && templateType !== 'cv' && (
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
            </div>
          )}

          {/* Tab 2: Preview & Publish */}
          {pageData && activeTab === 'preview' && (
            <div className="w-full flex-grow flex flex-col">
              {/* Deployed Info or Draft Info */}
              <div className="bg-theme-card/40 border border-theme-border rounded-2xl p-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">
                      {editMode ? 'Undangan Aktif' : 'Proyek Terpilih'}
                    </div>
                    <div className="text-xs font-bold text-theme-text mt-0.5">{name}</div>
                    {editMode && (
                      <>
                        <div className="text-[10px] text-emerald-400 font-semibold mt-2.5">
                          Tautan: <a href={successUrl || `http://localhost:5000/?slug=${slug}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-300 inline-flex items-center gap-0.5">{slug} <ExternalLink className="h-2.5 w-2.5 inline" /></a>
                        </div>
                        <div className="text-[9px] text-theme-text-muted mt-1.5">
                          Kuota edit tersisa: {maxProjectEdits - editCount} dari {maxProjectEdits} kali
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!editMode) {
                        setPageData(null);
                      }
                      setActiveTab('edit');
                    }}
                    className="text-[10px] text-theme-accent hover:text-theme-accent-hover font-bold transition-colors"
                  >
                    ← Edit Baru
                  </button>
                </div>
              </div>

              {/* URL Customization - Only for draft publishing */}
              {!editMode && (
                <form id="publish-form" onSubmit={handlePublish} className="bg-theme-card/40 border border-theme-border rounded-2xl p-4 mb-4 space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">
                      Tentukan Custom Slug URL
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-theme-text-muted text-xs select-none">/p/</span>
                      <input
                        type="text"
                        required
                        placeholder="nama-toko-anda"
                        value={slug}
                        onChange={(e) => setSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, '')
                            .replace(/-+/g, '-')
                        )}
                        disabled={isPublishing}
                        className="block w-full pl-8 pr-3.5 py-2.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none transition-colors"
                      />
                    </div>
                    {slug && (
                      <p className="text-[10px] text-theme-text-muted mt-1.5 pl-1">
                        URL Anda:{' '}
                        <span className="font-mono text-theme-text-sec">
                          .../?slug={slug}-<span className="opacity-40">xxxxxx</span>
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Coupon Code Section */}
                  <div className="border-t border-theme-border/50 pt-3.5 space-y-2">
                    <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider">
                      Masukkan Kode Kupon (Opsional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Contoh: DISKON100"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={isPublishing || appliedCoupon}
                        className="block flex-grow px-3.5 py-2.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none transition-colors"
                      />
                      {appliedCoupon ? (
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          disabled={isPublishing}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 text-[10px] font-bold px-3 py-2.5 rounded-xl transition-colors active:scale-[0.98] cursor-pointer"
                        >
                          Hapus
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleValidateCoupon}
                          disabled={isPublishing || !couponCode.trim() || isValidatingCoupon}
                          className="bg-theme-accent hover:bg-theme-accent-hover disabled:opacity-50 text-theme-accent-text text-[10px] font-bold px-4 py-2.5 rounded-xl transition-colors active:scale-[0.98] cursor-pointer"
                        >
                          {isValidatingCoupon ? 'Memproses...' : 'Terapkan'}
                        </button>
                      )}
                    </div>
                    {couponError && (
                      <p className="text-[10px] text-red-400 font-medium pl-1">{couponError}</p>
                    )}
                    {couponSuccess && (
                      <p className="text-[10px] text-emerald-400 font-medium pl-1">{couponSuccess}</p>
                    )}
                  </div>

                  <div className="bg-theme-bg border border-theme-border rounded-xl p-3 flex flex-col gap-1.5 text-[10px] font-bold text-theme-text-sec">
                    <div className="flex justify-between items-center">
                      <span>Biaya Publikasi:</span>
                      <span>
                        {appliedCoupon ? (
                          <>
                            <span className="line-through text-theme-text-muted mr-1.5">{currentCost} Credit</span>
                            <span className="text-emerald-400">
                              {finalCost === 0 ? 'Gratis' : `${finalCost} Credit`}
                            </span>
                          </>
                        ) : (
                          `${currentCost} Credit`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-theme-border/50 pt-1.5">
                      <span>Saldo Anda:</span>
                      <span className={(profile?.balance ?? 0) < finalCost ? 'text-red-400' : 'text-emerald-400'}>
                        {(profile?.balance ?? 0).toLocaleString('id-ID')} Credit
                      </span>
                    </div>
                  </div>
                </form>
              )}

              {/* Viewport for preview */}
              <div className="border border-theme-border bg-slate-950 rounded-2xl overflow-hidden shadow-2xl h-[450px] relative flex-shrink-0 mb-4">
                {isGenerating && templateType === 'wedding' && (
                  <div className="absolute inset-0 z-20 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                    <div className="relative mb-6">
                      <div className="absolute -inset-2 rounded-full bg-theme-accent/20 animate-ping"></div>
                      <div className="h-16 w-16 rounded-full border-4 border-theme-accent/10 border-t-theme-accent animate-spin relative flex items-center justify-center bg-slate-900 shadow-xl">
                        <span className="text-xl">✨</span>
                      </div>
                    </div>
                    
                    <h3 className="text-base font-bold text-white mb-1.5">
                      Merancang Undangan Premium Anda
                    </h3>
                    
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-accent/10 border border-theme-accent/20 text-[10px] text-theme-accent font-bold mb-4 uppercase tracking-wider">
                      <span className="h-1.5 w-1.5 rounded-full bg-theme-accent animate-pulse"></span>
                      {aiProgressStatus || 'queued'}
                    </div>
                    
                    <p className="text-xs text-theme-text-muted max-w-[240px] leading-relaxed min-h-[36px] flex items-center justify-center">
                      {aiProgressDetail || 'Menghubungkan ke server AI...'}
                    </p>
                    
                    <div className="w-40 bg-white/5 border border-white/10 h-2 rounded-full mt-5 overflow-hidden p-0.5">
                      <div className="bg-gradient-to-r from-theme-accent to-pink-500 h-full rounded-full animate-[loading_1.5s_infinite_ease-in-out]" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                )}

                {(templateType === 'wedding' || templateType === 'birthday' || templateType === 'toko-online' || templateType === 'campaign' || templateType === 'cv') ? (
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

        {/* Tracking Pixel Banner — read-only info, user edits in /profile */}
        {!editMode && (() => {
          const hasFb  = !!trackingConfig?.facebook_pixel_id;
          const hasGa  = !!trackingConfig?.google_analytics_id;
          const hasAds = !!trackingConfig?.google_ads_id;
          const hasTt  = !!trackingConfig?.tiktok_pixel_id;
          const anyActive = hasFb || hasGa || hasAds || hasTt;
          return (
            <div className="relative md:fixed md:bottom-[72px] left-0 right-0 max-w-md mx-auto px-4 z-10 mb-3">
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
 
        {/* Action Bar at the Bottom */}
        <div className="fixed bottom-[84px] md:fixed md:bottom-0 left-0 right-0 max-w-md mx-auto bg-theme-surface/95 border-t border-theme-border p-4 z-30 flex flex-col gap-2 shadow-lg md:shadow-2xl transition-theme mt-auto">
          {editMode ? (
            <button
              type="submit"
              form="generate-form"
              disabled={isPublishing || isFormInvalid() || editCount >= maxProjectEdits}
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
                  <span>Simpan Perubahan ({maxProjectEdits - editCount}/{maxProjectEdits})</span>
                </>
              )}
            </button>
          ) : (!pageData || activeTab === 'edit') ? (
            <button
              type="submit"
              form="generate-form"
              disabled={isGenerating || isFormInvalid()}
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
              type="submit"
              form="publish-form"
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
                                // Reset designKey based on product type
                                if (product.id === 'toko-online') setDesignKey('modern-clean');
                                else if (product.id === 'wedding') setDesignKey('sage-green');
                                else if (product.id === 'birthday') setDesignKey('cute-balloon');
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
                                    previewDesignKey === 'clean-trust' ? 'Clean Trust 🛡️' : 'Theme'
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
                  const isGold = previewDesignKey === 'elegant-gold';
                  const isMidnight = previewDesignKey === 'midnight-dark';

                  let mockData;
                  if (isBirthday) {
                    mockData = {
                      meta: {
                        title: `Contoh Undangan - Tema ${isGold ? 'Elegant Gold' : 'Cute Balloon'}`,
                        template_type: 'birthday',
                        design_key: previewDesignKey
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
                        design_key: previewDesignKey
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
                        design_key: previewDesignKey
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
                        design_key: 'professional-dark'
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
                  } else {
                    mockData = {
                      meta: {
                        title: `Contoh Undangan - Tema ${previewDesignKey === 'sage-green' ? 'Sage Green' : previewDesignKey === 'floral-pink' ? 'Floral Pink' : previewDesignKey === 'classic-love' ? 'Classic Love' : 'Javanese Traditional'}`,
                        template_type: 'wedding',
                        design_key: previewDesignKey
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
