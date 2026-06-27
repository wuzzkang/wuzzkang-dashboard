'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import { Sparkles, ArrowRight, CheckCircle, ExternalLink, Globe, Layout, Smartphone, Laptop, AlertCircle, ChevronRight, X, Search, ShoppingBag, Heart } from 'lucide-react';
const DEFAULT_GROOM_AVATAR = 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/groom-avatar.jpg';
const DEFAULT_BRIDE_AVATAR = 'https://pggaknycbpjvsmmofnln.supabase.co/storage/v1/object/public/wuzzkang-bucket/defaults/bride-avatar.jpg';
import { supabase } from '@/lib/supabase';

const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
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
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Canvas to Blob failed'));
            }
          },
          'image/jpeg',
          quality
        );
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
  const iframeRef = useRef(null);
  const [iframeReady, setIframeReady] = useState(false);

  // Input states
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [slug, setSlug] = useState('');
  const [templateType, setTemplateType] = useState('store');
  const [products, setProducts] = useState([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
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
  const [designKey, setDesignKey] = useState('sage-green');
  const [groomImage, setGroomImage] = useState(DEFAULT_GROOM_AVATAR);
  const [brideImage, setBrideImage] = useState(DEFAULT_BRIDE_AVATAR);
  const [storyList, setStoryList] = useState([]);
  
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
  const [pageData, setPageData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState('');
  const [successUrl, setSuccessUrl] = useState('');
  
  // Preview mode (desktop vs mobile)
  const [previewDevice, setPreviewDevice] = useState('mobile');

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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
            const pageConfig = project.page_data;
            setPageData(pageConfig);
            
            // Deduce a clean default slug from project name
            const suggestedSlug = project.name
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
            
            // Set the first active template as default if templateType is not in the active products
            const activeProducts = result.data.filter(p => p.is_active);
            if (activeProducts.length > 0) {
              const currentIsActive = activeProducts.some(p => p.id === templateType);
              if (!currentIsActive) {
                setTemplateType(activeProducts[0].id);
              }
            }
          }
        }
      } catch (err) {
        console.error('Gagal mengambil daftar produk/template:', err);
      }
    };
    fetchProducts();
  }, [session]);

  // Fallback default mock products if API products is empty (e.g. table not created yet)
  const getDisplayProducts = () => {
    if (products && products.length > 0) {
      return products;
    }
    return [
      { id: 'store', name: 'Toko Online / Bisnis', is_active: true, cost: 10000, description: 'Desain responsif komersial, katalog produk modern, dan CTA kontak WhatsApp.' },
      { id: 'wedding', name: 'Undangan Pernikahan', is_active: true, cost: 10000, description: 'Undangan digital premium dengan kelola RSVP, iringan musik, dan linimasa kisah kasih.' }
    ];
  };

  const displayProducts = getDisplayProducts();
  const currentProduct = displayProducts.find(p => p.id === templateType);
  const currentCost = currentProduct?.cost ?? 10000;

  if (loading || (!user && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="h-12 w-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
      </div>
    );
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
    if (templateType === 'store') {
      return !prompt;
    }
    return false;
  };

  const handleUploadImage = async (file, target) => {
    if (!file) return;
    
    const isGroom = target === 'groom';
    const isBride = target === 'bride';
    const isStory = target === 'story';

    if (isGroom) setIsUploadingGroomImage(true);
    if (isBride) setIsUploadingBrideImage(true);
    if (isStory) setIsUploadingStoryImage(true);

    try {
      let fileToUpload = file;
      if (file.type.startsWith('image/')) {
        try {
          console.log(`[Dashboard] Compressing ${file.name} (${(file.size / 1024).toFixed(1)} KB)...`);
          fileToUpload = await compressImage(file);
          console.log(`[Dashboard] Compressed to ${(fileToUpload.size / 1024).toFixed(1)} KB`);
        } catch (compError) {
          console.error('[Dashboard] Compression failed, uploading original:', compError);
        }
      }

      const fileExt = fileToUpload.type === 'image/jpeg' ? 'jpg' : fileToUpload.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      console.log(`[Dashboard] Uploading file to storage: ${fileName}`);
      const { data, error } = await supabase.storage
        .from('wuzzkang-bucket')
        .upload(filePath, fileToUpload, { cacheControl: '3600', upsert: true });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('wuzzkang-bucket')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      if (isGroom) setGroomImage(publicUrl);
      if (isBride) setBrideImage(publicUrl);
      if (isStory) setNewStoryImage(publicUrl);
    } catch (err) {
      console.error('[Dashboard] File upload error:', err);
      setError('Gagal mengunggah foto: ' + err.message);
    } finally {
      if (isGroom) setIsUploadingGroomImage(false);
      if (isBride) setIsUploadingBrideImage(false);
      if (isStory) setIsUploadingStoryImage(false);
    }
  };

  const handleGenerateAIImage = async (target) => {
    const isGroom = target === 'groom';
    const isBride = target === 'bride';
    
    const defaultPrompt = isGroom 
      ? 'A cute 3D Pixar-style groom avatar, clean minimalist background, wedding theme, smiling, handsome'
      : 'A cute 3D Pixar-style bride avatar, clean minimalist background, wedding theme, smiling, beautiful';

    const userPrompt = window.prompt(`Masukkan deskripsi/prompt untuk avatar AI ${isGroom ? 'Pria' : 'Wanita'}:`, defaultPrompt);
    if (userPrompt === null) return;
    if (!userPrompt.trim()) return;

    if (isGroom) setIsGeneratingGroomImage(true);
    if (isBride) setIsGeneratingBrideImage(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        if (isGroom) setGroomImage(result.url);
        if (isBride) setBrideImage(result.url);
      } else {
        throw new Error(result.error || 'Gagal men-generate gambar.');
      }
    } catch (err) {
      console.error('[Dashboard] AI avatar error, falling back to default:', err);
      if (isGroom) setGroomImage(DEFAULT_GROOM_AVATAR);
      if (isBride) setBrideImage(DEFAULT_BRIDE_AVATAR);
      
      alert(`Gagal men-generate foto AI: ${err.message || 'Error'}\n\nSistem otomatis menggunakan avatar default untuk Anda.`);
    } finally {
      if (isGroom) setIsGeneratingGroomImage(false);
      if (isBride) setIsGeneratingBrideImage(false);
    }
  };

  // Handle generating preview from prompt
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (isFormInvalid()) return;

    setError('');
    setIsGenerating(true);
    setPageData(null);

    try {
      const payload = { name, prompt: prompt || '', template_type: templateType };
      if (projectId) {
        payload.projectId = projectId;
      }
      if (templateType === 'wedding') {
        payload.wedding_details = {
          design_key: designKey,
          groom: { name: groomName, nickname: groomNickname, father: groomFather, mother: groomMother, image_url: groomImage || null },
          bride: { name: brideName, nickname: brideNickname, father: brideFather, mother: brideMother, image_url: brideImage || null },
          story: storyList.length > 0 ? storyList : null,
          akad: { date: akadDate, time: akadTime, location: akadLocation, maps_url: akadMaps || null },
          resepsi: { date: resepsiDate, time: resepsiTime, location: resepsiLocation, maps_url: resepsiMaps || null },
          gift: giftBank && giftAccount ? { bank_name: giftBank, account_number: giftAccount, account_holder: giftHolder || '' } : null
        };
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setProjectId(result.data.projectId);
        setPageData(result.data.pageData);
        
        // Suggest slug based on name
        const suggestedSlug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        setSlug(suggestedSlug);
      } else {
        setError(result.error ? Object.values(result.error).flat().join(', ') : 'Gagal menghasilkan landing page.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle publishing landing page (deducts 10,000 balance)
  const handlePublish = async (e) => {
    e.preventDefault();
    if (!projectId || !slug) return;

    // Check balance first
    if ((profile?.balance ?? 0) < 10000) {
      setError('Saldo Anda tidak mencukupi untuk mempublikasikan halaman. Biaya: Rp 10.000. Silakan top up saldo terlebih dahulu.');
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
        body: JSON.stringify({ slug }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessUrl(result.liveUrl);
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

    const templateType = pageData.meta?.template_type || 'store';

    if (templateType === 'wedding') {
      const design = pageData.meta?.design_key || 'sage-green';
      const weddingThemes = {
        'sage-green': { primary: '#5A7C64', secondary: '#E8EFE9', text: '#2F3E33', bg: '#F4F7F4', name: 'Sage Green' },
        'floral-pink': { primary: '#D88C9A', secondary: '#F3E8EE', text: '#4E363C', bg: '#FFF9FA', name: 'Floral Pink' },
      };

      const colors = weddingThemes[design] || weddingThemes['sage-green'];

      const groom = pageData.content?.groom || {};
      const bride = pageData.content?.bride || {};
      const akad = pageData.content?.akad || {};
      const resepsi = pageData.content?.resepsi || {};
      const gift = pageData.content?.gift || {};
      const quote = pageData.content?.quote || '';
      const stories = pageData.content?.story || [];

      const defaultGroomAvatar = DEFAULT_GROOM_AVATAR;
      const defaultBrideAvatar = DEFAULT_BRIDE_AVATAR;

      return (
        <div 
          className="w-full h-full flex flex-col overflow-y-auto text-center px-6 py-8 select-none"
          style={{ backgroundColor: colors.bg, color: colors.text, fontFamily: "'Poppins', sans-serif" }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:wght@300;400;500;600;700&display=swap');
            .preview-cursive { font-family: 'Great Vibes', cursive; }
            .preview-serif { font-family: 'Playfair Display', serif; }
            .preview-sans { font-family: 'Poppins', sans-serif; }
          `}} />

          {/* Wedding Cover */}
          <div className="my-6 py-6 border-b border-dashed border-slate-200">
            <span className="text-[9px] tracking-widest uppercase font-semibold opacity-70" style={{ color: colors.primary }}>Walimatul 'Ursy</span>
            <h3 className="text-5xl preview-cursive my-4" style={{ color: colors.primary }}>{groom.nickname || 'Pria'} & {bride.nickname || 'Wanita'}</h3>
            <p className="text-[9px] text-slate-500 mb-2">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
            <div className="bg-white border border-slate-100 rounded-2xl px-4 py-1.5 inline-block shadow-sm">
              <div className="font-bold text-[11px]">Tamu Undangan</div>
            </div>
          </div>
          
          {/* Quote */}
          <div className="my-3 px-4 italic text-xs leading-relaxed opacity-80 preview-serif">
            "{quote}"
          </div>
          
          {/* Groom & Bride Details */}
          <div className="my-4 space-y-3 text-left">
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 flex-shrink-0">
                <img src={groom.image_url || defaultGroomAvatar} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-sm preview-serif">{groom.name || 'Nama Lengkap Pria'}</h4>
                <p className="text-[9px] text-slate-500 mt-0.5">Putra dari Bpk. {groom.father || '...'} & Ibu {groom.mother || '...'}</p>
              </div>
            </div>
            
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 flex-shrink-0">
                <img src={bride.image_url || defaultBrideAvatar} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-sm preview-serif">{bride.name || 'Nama Lengkap Wanita'}</h4>
                <p className="text-[9px] text-slate-500 mt-0.5">Putri dari Bpk. {bride.father || '...'} & Ibu {bride.mother || '...'}</p>
              </div>
            </div>
          </div>

          {/* Stories Timeline */}
          {stories && stories.length > 0 && (
            <div className="my-4 text-left">
              <h4 className="font-bold text-xs uppercase tracking-wider text-center mb-3 preview-serif" style={{ color: colors.primary }}>Cerita Cinta Kami</h4>
              <div className="space-y-3">
                {stories.map((s, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex gap-3">
                    {s.image_url && (
                      <img src={s.image_url} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] font-bold text-slate-400">{s.date}</div>
                      <div className="text-[10px] font-bold text-slate-800 preview-sans">{s.title}</div>
                      <div className="text-[9px] text-slate-500 leading-normal mt-0.5 break-words">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Event Cards */}
          <div className="my-4 space-y-3 bg-white/40 p-3 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-[10px] uppercase tracking-wider preview-serif" style={{ color: colors.primary }}>Waktu & Tempat</h4>
            <div className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-sm text-left">
              <h5 className="font-bold text-[11px] flex items-center gap-1 preview-serif" style={{ color: colors.primary }}>💍 Akad Nikah</h5>
              <div className="text-[9px] text-slate-600 mt-1 font-semibold">📅 {akad.date || 'Tanggal'}</div>
              <div className="text-[9px] text-slate-600">⏰ {akad.time || 'Waktu'}</div>
              <div className="text-[9px] text-slate-500 mt-1">📍 {akad.location || 'Tempat'}</div>
            </div>
            
            <div className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-sm text-left">
              <h5 className="font-bold text-[11px] flex items-center gap-1 preview-serif" style={{ color: colors.primary }}>🎉 Resepsi</h5>
              <div className="text-[9px] text-slate-600 mt-1 font-semibold">📅 {resepsi.date || 'Tanggal'}</div>
              <div className="text-[9px] text-slate-600">⏰ {resepsi.time || 'Waktu'}</div>
              <div className="text-[9px] text-slate-500 mt-1">📍 {resepsi.location || 'Tempat'}</div>
            </div>
          </div>
          
          {/* Gift Info */}
          {gift && gift.bank_name && gift.account_number && (
            <div className="my-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center">
              <div className="text-base">🎁</div>
              <h4 className="font-bold text-[11px] mt-1 preview-serif">Kado Digital</h4>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 mt-2">
                <div className="text-[9px] font-bold text-slate-500">{gift.bank_name}</div>
                <div className="font-mono font-bold text-xs my-0.5" style={{ color: colors.primary }}>{gift.account_number}</div>
                <div className="text-[9px] text-slate-600">a/n {gift.account_holder}</div>
              </div>
            </div>
          )}
          
          <div className="mt-6 text-[9px] opacity-50">WuzzKang Wedding Template • {colors.name}</div>
        </div>
      );
    }

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
        className={`w-full h-full flex flex-col overflow-y-auto transition-colors duration-300 select-none ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
        }`}
        style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}
      >
        {/* Navigation Bar Mockup */}
        <header className={`sticky top-0 border-b z-10 px-6 py-4 flex justify-between items-center backdrop-blur-md ${
          isDark ? 'bg-slate-950/80 border-slate-900' : 'bg-white/80 border-slate-200/60'
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
        <section className={`relative py-16 px-6 text-center overflow-hidden border-b ${
          isDark ? 'border-slate-900 bg-slate-950' : 'border-slate-100 bg-white'
        }`}>
          {/* Decorative background aura */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-48 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ backgroundColor: primaryColor }}
          ></div>
          
          <div className="max-w-xl mx-auto relative z-10">
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {pageData.content?.hero?.heading || 'Headline'}
            </h2>
            <p className={`text-sm md:text-base mt-4 leading-relaxed max-w-lg mx-auto ${
              isDark ? 'text-slate-400' : 'text-slate-600'
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
                className={`rounded-2xl p-5 border text-center transition-all ${
                  isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
                }`}
              >
                <div 
                  className="text-3xl mb-4 w-12 h-12 flex items-center justify-center rounded-xl mx-auto"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  {feature.icon || '✨'}
                </div>
                <h4 className={`text-sm font-bold tracking-tight mb-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {feature.title || 'Fitur'}
                </h4>
                <p className={`text-xs leading-relaxed ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {feature.desc || 'Deskripsi singkat mengenai keunggulan fitur.'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Mockup */}
        <footer className={`py-8 text-center text-xs mt-auto border-t ${
          isDark ? 'bg-slate-950 border-slate-900 text-slate-500' : 'bg-slate-100 border-slate-200/60 text-slate-400'
        }`}>
          <p>© {new Date().getFullYear()} {pageData.meta?.title || 'Brand'}. All Rights Reserved.</p>
        </footer>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-8 flex flex-col md:h-screen md:overflow-hidden min-h-screen overflow-y-auto pt-24 md:pt-8">
        {/* Title */}
        <div className="mb-6 flex-shrink-0">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Landing Page Generator</h1>
          <p className="text-slate-400 text-sm mt-1">Masukkan kata-kata Anda, biarkan AI merancang landing page dinamis</p>
        </div>

        {/* Success Modal Overlay */}
        {successUrl && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative">
              <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Halaman Siap!</h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Landing page Anda berhasil dipublikasikan secara instan dan kini dapat diakses oleh publik secara online!
              </p>
              
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 mb-6 flex items-center justify-between text-sm overflow-hidden gap-3">
                <span className="text-indigo-400 font-medium truncate select-all">{successUrl}</span>
                <a
                  href={successUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-slate-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="flex gap-3">
                <a
                  href={successUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-1"
                >
                  <span>Buka Halaman</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={() => {
                    setSuccessUrl('');
                    setPageData(null);
                    setProjectId(null);
                    setName('');
                    setPrompt('');
                    setSlug('');
                    router.push('/');
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-sm transition-all"
                >
                  Kembali ke Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Panels split screen */}
        <div className="flex-grow flex flex-col lg:flex-row gap-6 lg:overflow-hidden min-h-0 pb-8 lg:pb-0">
          
          {/* Left Input Panel */}
          <div className="w-full lg:w-1/3 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between overflow-y-auto shrink-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Detail Landing Page</h3>
                <p className="text-xs text-slate-500">Konfigurasi dasar untuk landing page baru Anda</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3.5 flex gap-2.5 items-start">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1 Generate Draft */}
              {!pageData ? (
                <form onSubmit={handleGenerate} className="space-y-4">
                  {/* Pilih Tipe Template (Visual Selector Trigger) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Tipe Layanan / Template
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsTemplateModalOpen(true)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/10 rounded-xl text-left transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                          {templateType === 'wedding' ? '🌸' : '🛍️'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {templateType === 'wedding' ? 'Undangan Pernikahan' : 'Toko Online / Bisnis'}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Klik untuk ganti tipe produk/template
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Nama Halaman / Acara
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={templateType === 'wedding' ? "Contoh: Pernikahan Budi & Riri" : "Contoh: Kopi Seru Nusantara"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isGenerating}
                      className="block w-full px-3.5 py-2 bg-slate-950 border border-slate-850 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                  </div>

                  {/* Wedding Details Input Form */}
                  {templateType === 'wedding' && (
                    <div className="space-y-4 border-t border-slate-800 pt-4 max-h-[300px] overflow-y-auto pr-1">
                      {/* Desain Template Picker */}
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Pilih Desain Template</div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDesignKey('sage-green')}
                          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                            designKey === 'sage-green' ? 'border-indigo-500 bg-indigo-950/20 text-white' : 'border-slate-800 bg-slate-950/50 text-slate-400'
                          }`}
                        >
                          <span className="text-lg">🌿</span>
                          <span className="text-[10px] font-semibold">Sage Green</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDesignKey('floral-pink')}
                          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                            designKey === 'floral-pink' ? 'border-indigo-500 bg-indigo-950/20 text-white' : 'border-slate-800 bg-slate-950/50 text-slate-400'
                          }`}
                        >
                          <span className="text-lg">🌸</span>
                          <span className="text-[10px] font-semibold">Floral Pink</span>
                        </button>
                      </div>

                      {/* Mempelai Pria */}
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider pt-2">Detail Mempelai Pria</div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Nama Lengkap Pria"
                          value={groomName}
                          onChange={(e) => setGroomName(e.target.value)}
                          className="block w-full px-3 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Panggilan"
                          value={groomNickname}
                          onChange={(e) => setGroomNickname(e.target.value)}
                          className="block w-full px-3 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Nama Ayah Pria"
                          value={groomFather}
                          onChange={(e) => setGroomFather(e.target.value)}
                          className="block w-full px-3 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Nama Ibu Pria"
                          value={groomMother}
                          onChange={(e) => setGroomMother(e.target.value)}
                          className="block w-full px-3 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {/* Foto Mempelai Pria */}
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-1.5">Foto Pria</div>
                      <div className="flex gap-2.5 items-center bg-slate-950 p-2.5 rounded-xl border border-slate-855">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-800 bg-slate-900 flex-shrink-0 flex items-center justify-center text-[10px] text-slate-500">
                          {groomImage ? <img src={groomImage} className="w-full h-full object-cover" /> : 'No image'}
                        </div>
                        <div className="flex-grow flex flex-col gap-1">
                          <div className="flex gap-1.5">
                            <label className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-semibold py-1 px-2 rounded text-center cursor-pointer transition-colors">
                              {isUploadingGroomImage ? 'Uploading...' : 'Upload'}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleUploadImage(e.target.files[0], 'groom')}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleGenerateAIImage('groom')}
                              disabled={isGeneratingGroomImage}
                              className="flex-1 bg-indigo-600/90 hover:bg-indigo-600 text-white text-[9px] font-semibold py-1 px-2 rounded transition-colors"
                            >
                              {isGeneratingGroomImage ? 'Generating...' : 'AI Avatar'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Mempelai Wanita */}
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider pt-2">Detail Mempelai Wanita</div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Nama Lengkap Wanita"
                          value={brideName}
                          onChange={(e) => setBrideName(e.target.value)}
                          className="block w-full px-3 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Panggilan"
                          value={brideNickname}
                          onChange={(e) => setBrideNickname(e.target.value)}
                          className="block w-full px-3 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Nama Ayah Wanita"
                          value={brideFather}
                          onChange={(e) => setBrideFather(e.target.value)}
                          className="block w-full px-3 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Nama Ibu Wanita"
                          value={brideMother}
                          onChange={(e) => setBrideMother(e.target.value)}
                          className="block w-full px-3 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {/* Foto Mempelai Wanita */}
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-1.5">Foto Wanita</div>
                      <div className="flex gap-2.5 items-center bg-slate-950 p-2.5 rounded-xl border border-slate-855">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-800 bg-slate-900 flex-shrink-0 flex items-center justify-center text-[10px] text-slate-500">
                          {brideImage ? <img src={brideImage} className="w-full h-full object-cover" /> : 'No image'}
                        </div>
                        <div className="flex-grow flex flex-col gap-1">
                          <div className="flex gap-1.5">
                            <label className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-semibold py-1 px-2 rounded text-center cursor-pointer transition-colors">
                              {isUploadingBrideImage ? 'Uploading...' : 'Upload'}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleUploadImage(e.target.files[0], 'bride')}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleGenerateAIImage('bride')}
                              disabled={isGeneratingBrideImage}
                              className="flex-1 bg-indigo-600/90 hover:bg-indigo-600 text-white text-[9px] font-semibold py-1 px-2 rounded transition-colors"
                            >
                              {isGeneratingBrideImage ? 'Generating...' : 'AI Avatar'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Kisah Cinta (Story) Builder */}
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider pt-2">Kisah Cinta (Timeline)</div>
                      {storyList.length > 0 && (
                        <div className="space-y-1 bg-slate-950 p-2 rounded-xl border border-slate-855 max-h-[120px] overflow-y-auto">
                          {storyList.map((story, sIdx) => (
                            <div key={sIdx} className="flex items-center justify-between bg-slate-900/60 px-2 py-1 rounded border border-slate-800 text-[10px]">
                              <span className="truncate text-slate-300 font-semibold">{story.date} - {story.title}</span>
                              <button
                                type="button"
                                onClick={() => setStoryList(storyList.filter((_, i) => i !== sIdx))}
                                className="text-red-400 hover:text-red-300 font-bold ml-2 text-[9px]"
                              >
                                Hapus
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-855 space-y-1.5">
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            placeholder="Tahun / Tanggal"
                            value={newStoryDate}
                            onChange={(e) => setNewStoryDate(e.target.value)}
                            className="block w-full px-2 py-1 bg-slate-950 border border-slate-855 rounded-lg text-[10px] text-white focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Judul Kejadian"
                            value={newStoryTitle}
                            onChange={(e) => setNewStoryTitle(e.target.value)}
                            className="block w-full px-2 py-1 bg-slate-950 border border-slate-855 rounded-lg text-[10px] text-white focus:outline-none"
                          />
                        </div>
                        <textarea
                          placeholder="Ceritakan singkat..."
                          value={newStoryDesc}
                          onChange={(e) => setNewStoryDesc(e.target.value)}
                          rows={2}
                          className="block w-full px-2 py-1 bg-slate-950 border border-slate-855 rounded-lg text-[10px] text-white focus:outline-none resize-none"
                        />
                        <div className="flex justify-between items-center gap-1.5">
                          <label className="bg-slate-800 hover:bg-slate-700 text-white text-[8px] font-semibold py-1 px-2 rounded cursor-pointer">
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
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[8px] font-bold py-1 px-2.5 rounded"
                          >
                            Tambah
                          </button>
                        </div>
                      </div>

                      {/* Acara Akad Nikah */}
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider pt-2">Acara Akad Nikah</div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          required
                          value={akadDate}
                          onChange={(e) => setAkadDate(e.target.value)}
                          className="block w-full px-3 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Jam Akad (09:00 - Selesai)"
                          value={akadTime}
                          onChange={(e) => setAkadTime(e.target.value)}
                          className="block w-full px-3 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Lokasi Akad (Masjid Agung Jambi, Jambi)"
                        value={akadLocation}
                        onChange={(e) => setAkadLocation(e.target.value)}
                        className="block w-full px-3 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Link Google Maps Akad (Opsional)"
                        value={akadMaps}
                        onChange={(e) => setAkadMaps(e.target.value)}
                        className="block w-full px-3 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />

                      {/* Acara Resepsi */}
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider pt-2">Acara Resepsi</div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          required
                          value={resepsiDate}
                          onChange={(e) => setResepsiDate(e.target.value)}
                          className="block w-full px-3 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Jam Resepsi (11:00 - 13:00)"
                          value={resepsiTime}
                          onChange={(e) => setResepsiTime(e.target.value)}
                          className="block w-full px-3 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Lokasi Resepsi (Gedung Serbaguna, Jambi)"
                        value={resepsiLocation}
                        onChange={(e) => setResepsiLocation(e.target.value)}
                        className="block w-full px-3 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Link Google Maps Resepsi (Opsional)"
                        value={resepsiMaps}
                        onChange={(e) => setResepsiMaps(e.target.value)}
                        className="block w-full px-3 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />

                      {/* Kado Digital */}
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider pt-2">Kado Digital (Opsional)</div>
                      <div className="grid grid-cols-3 gap-1.5">
                        <input
                          type="text"
                          placeholder="Bank (BCA)"
                          value={giftBank}
                          onChange={(e) => setGiftBank(e.target.value)}
                          className="block w-full px-2 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-[10px] text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          placeholder="No Rekening"
                          value={giftAccount}
                          onChange={(e) => setGiftAccount(e.target.value)}
                          className="block w-full px-2 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-[10px] text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          placeholder="Atas Nama"
                          value={giftHolder}
                          onChange={(e) => setGiftHolder(e.target.value)}
                          className="block w-full px-2 py-1.5 bg-slate-950 border border-slate-855 rounded-xl text-[10px] text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {templateType === 'wedding' ? 'Gaya Tema & Doa Pernikahan (Optional)' : 'Prompt / Deskripsi Bisnis Anda'}
                    </label>
                    <textarea
                      required={templateType !== 'wedding'}
                      rows={templateType === 'wedding' ? 3 : 5}
                      placeholder={templateType === 'wedding' ? "Contoh: Tema sage green elegan, berikan doa islami dengan kutipan QS Ar-Rum... (kosongkan untuk tema & doa default)" : "Tuliskan produk Anda, keunggulan utama, target konsumen, dan nuansa yang diinginkan secara detail..."}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={isGenerating}
                      className="block w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isGenerating || isFormInvalid()}
                    className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
                  >
                    {isGenerating ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                        <span>Sedang Merancang Halaman...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Generate Preview (Gratis)</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2 Publish with Slug */
                <form onSubmit={handlePublish} className="space-y-5">
                  <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4">
                    <div className="text-xs font-semibold text-slate-500 uppercase">Proyek Terpilih</div>
                    <div className="text-base font-bold text-white mt-1">{name}</div>
                    <button
                      type="button"
                      onClick={() => {
                        setPageData(null);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium mt-2 transition-colors"
                    >
                      ← Edit Prompt Ulang
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Tentukan Custom Slug URL
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-slate-500 text-sm select-none">/p/</span>
                      <input
                        type="text"
                        required
                        placeholder="nama-toko-anda"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                        disabled={isPublishing}
                        className="block w-full pl-8 pr-3.5 py-2 bg-slate-950 border border-slate-855 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                      URL Anda nantinya akan menjadi: <code className="text-indigo-400/80 font-mono">http://localhost:5000/?slug={slug || '...'}</code>
                    </p>
                  </div>

                   <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-xl p-4">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                      <span>Biaya Publikasi:</span>
                      <span className="text-white">Rp {currentCost.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mt-2">
                      <span>Saldo Anda Sekarang:</span>
                      <span className={ (profile?.balance ?? 0) < currentCost ? 'text-red-400' : 'text-emerald-400' }>
                        Rp {(profile?.balance ?? 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPublishing || !slug}
                    className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
                  >
                    {isPublishing ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                        <span>Sedang Memproses...</span>
                      </>
                    ) : (
                      <>
                        <Globe className="h-4 w-4" />
                        <span>Publikasikan Sekarang (Rp {currentCost.toLocaleString('id-ID')})</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="text-center text-[10px] text-slate-500 pt-6">
              WuzzKang SaaS Engine • Landing Page Instan
            </div>
          </div>

          {/* Right Preview Panel */}
          <div className="flex-grow w-full lg:w-2/3 min-h-[500px] lg:min-h-0 bg-slate-900/30 border border-slate-800 rounded-2xl flex flex-col overflow-hidden relative">
            
            {/* Preview Toolbar */}
            <div className="bg-slate-900/80 px-4 md:px-6 py-3.5 border-b border-slate-800/80 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 flex-shrink-0">
                  <div className="h-3.5 w-3.5 rounded-full bg-red-500/80"></div>
                  <div className="h-3.5 w-3.5 rounded-full bg-amber-500/80"></div>
                  <div className="h-3.5 w-3.5 rounded-full bg-emerald-500/80"></div>
                </div>
                <span className="text-xs text-slate-400 font-medium ml-2 md:ml-3 bg-slate-950 px-2 md:px-3 py-1 rounded-md border border-slate-850 truncate max-w-[120px] md:max-w-none">
                  {pageData ? `Preview: ${pageData.meta?.title || 'Draft Page'}` : 'Mode Preview'}
                </span>
                <span className="text-[9px] text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 animate-pulse hidden sm:inline-block">
                  ✨ Desain Web Aktif saat di-publish
                </span>
              </div>

              {/* Device Toggle */}
              {pageData && (
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-850">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-md transition-all ${
                      previewDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Laptop className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-md transition-all ${
                      previewDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Preview Viewport */}
            <div className="flex-grow flex items-center justify-center p-6 bg-slate-950/40 overflow-hidden">
              {pageData ? (
                <div 
                  className={`border border-slate-800 bg-slate-950 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
                    previewDevice === 'mobile' ? 'w-full max-w-[375px] h-[600px]' : 'w-full h-full'
                  }`}
                >
                  {templateType === 'wedding' ? (
                    <iframe
                      ref={iframeRef}
                      src="/preview/index.html"
                      className="w-full h-full border-0 bg-transparent"
                      title="Live Preview"
                      onLoad={() => {
                        // Mark iframe as ready so postMessage sync can start
                        setIframeReady(true);
                        // Also immediately send pageData if it's already available
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
              ) : (
                <div className="text-center p-8 max-w-md">
                  <Layout className="h-16 w-16 text-slate-700 mx-auto mb-4 animate-pulse" />
                  <h4 className="text-base font-bold text-slate-300">Belum Ada Preview</h4>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Tulis nama halaman dan prompt di panel kiri, kemudian klik "Generate Preview". Desain web buatan AI akan muncul secara visual di sini.
                  </p>
                </div>
              )}
            </div>
            
          </div>
          
        </div>
      </main>
      {/* Template Selection Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div>
                <h3 className="text-lg font-bold text-white">Galeri Template & Layanan</h3>
                <p className="text-xs text-slate-500 mt-1">Pilih tipe landing page yang ingin Anda rancang</p>
              </div>
              <button 
                onClick={() => setIsTemplateModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Filters */}
            <div className="px-6 py-4 bg-slate-900/20 border-b border-slate-850 flex gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Semua Kategori
              </button>
              <button
                onClick={() => setSelectedCategory('wedding')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === 'wedding' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Undangan
              </button>
              <button
                onClick={() => setSelectedCategory('store')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === 'store' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                E-Commerce / Toko
              </button>
            </div>

            {/* Modal Content - Product Cards Grid */}
            <div className="p-6 overflow-y-auto space-y-4 flex-grow bg-slate-900/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayProducts
                  .filter(p => {
                    if (selectedCategory === 'all') return true;
                    if (selectedCategory === 'wedding') return p.id === 'wedding';
                    if (selectedCategory === 'store') return p.id === 'store';
                    return true;
                  })
                  .map(product => {
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
                          }
                        }}
                        className={`group border rounded-2xl p-5 flex flex-col justify-between text-left transition-all duration-300 relative overflow-hidden ${
                          !isActive 
                            ? 'bg-slate-900/40 border-slate-850 opacity-60 cursor-not-allowed select-none'
                            : isSelected
                              ? 'bg-indigo-950/20 border-indigo-500 shadow-lg shadow-indigo-500/5 cursor-pointer scale-[1.01]'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/10 cursor-pointer hover:scale-[1.01]'
                        }`}
                      >
                        {/* Glow effect on hover if active */}
                        {isActive && (
                          <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl -z-10 transition-opacity duration-300 ${
                            isSelected ? 'bg-indigo-500/10 opacity-100' : 'bg-indigo-500/5 opacity-0 group-hover:opacity-100'
                          }`} />
                        )}

                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-xl shadow-sm ${
                              isSelected ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-300'
                            }`}>
                              {product.id === 'wedding' ? '🌸' : '🛍️'}
                            </div>
                            
                            {/* Inactive / Maintenance Badge */}
                            {!isActive ? (
                              <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded">
                                Pemeliharaan
                              </span>
                            ) : (
                              isSelected && (
                                <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded">
                                  Aktif
                                </span>
                              )
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            {product.description || (product.id === 'wedding' 
                              ? 'Undangan pernikahan digital premium dengan fitur interaktif.'
                              : 'Landing page e-commerce instan untuk katalog dagangan.')}
                          </p>
                        </div>

                        {/* Price Info */}
                        <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-between items-center">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Biaya Publikasi</span>
                          <span className="text-xs font-bold text-white">
                            Rp {product.cost?.toLocaleString('id-ID') || '10.000'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-800/80 bg-slate-950 flex justify-end">
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Tutup Galeri
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="h-12 w-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
      </div>
    }>
      <GenerateContent />
    </Suspense>
  );
}
