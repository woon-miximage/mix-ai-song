import React, { useState, useEffect, useRef } from 'react';
import { AiEngineId, SongInput, GeneratedLyric, AppState, ViralCaseStudy, PresetSyncPayload, LanguageMode, EnglishMixRatio } from './types';
import LyricForm from './components/LyricForm';
import LyricDisplay from './components/LyricDisplay';
import { SongStyleModal } from './components/SongStyleModal';
import { InspirationModal } from './components/InspirationModal';
import { ViralKnowledgeModal } from './components/ViralKnowledgeModal';
import { SongStylePreset, InspirationPreset } from './data/presetData';
import { generateThaiLyrics } from './services/geminiService';
import { SettingsPanel } from './components/SettingsPanel';
import PinLoginScreen from './components/PinLoginScreen';
import { playAudioPreview, stopAudioPreview } from './services/audioService';
import {
  Music, Sparkles, History, Cpu, HelpCircle, ChevronRight,
  LogOut, Play, Pause, MoreHorizontal, Folder,
  ArrowRight, X, Download, Trash2, Youtube, Facebook, ExternalLink,
  SlidersHorizontal, Flame, Star, BarChart2, Mic, Heart, Headphones,
  LayoutGrid, Lightbulb, Bell, Monitor, Shuffle, AudioWaveform, CheckCircle2, Globe, Cloud,
  Key, Eye, EyeOff, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout } from './services/googleAuthService';
import { useTheme } from './contexts/ThemeContext';
import {
  clearUserSongs,
  deleteSongProject,
  KnowledgeVaultRecord,
  saveKnowledgeVaultItem,
  saveSongProject,
  subscribeToUserKnowledgeVault,
  subscribeToUserProfile,
  subscribeToUserSongs,
  syncExtractedPdfKnowledgeToCloud,
  syncLocalHistoryToCloud,
  updateSongProject,
  upsertUserProfile,
} from './services/firestoreService';
import {
  GOLDEN_BLUEPRINT_SONG,
  SUNO_DAILY_ARCHIVES_2026,
  VIRAL_CASE_STUDIES,
  ZERODAY_DSP_CALIBRATION_STANDARDS,
} from './data/viralMusicKnowledge';

const SAMPLE_RECENT_SONGS = [
  { id: 'sample-1', title: 'หัวใจไม่เคยหยุด', genre: 'Pop, Hip-hop', duration: '03:28' },
  { id: 'sample-2', title: 'Time Slip Love', genre: 'R&B, Pop', duration: '03:54' },
  { id: 'sample-3', title: 'เพียงเธอในวันเดิม', genre: 'Pop', duration: '03:14' },
  { id: 'sample-4', title: 'Broken but Strong', genre: 'Hip-hop', duration: '03:26' },
  { id: 'sample-5', title: 'Dreams in Tokyo', genre: 'Lo-fi, Chill', duration: '03:56' },
];

const SAMPLE_LYRICS = [
  "ในวันที่เหนื่อยล้า ยังมีเสียงเพลงพาเราเดินต่อไป...",
  "ความทรงจำบางอย่าง ไม่เคยหายไป แม้เวลาจะผ่านนานแค่ไหน...",
  "เริ่มต้นใหม่อีกครั้ง พร้อมบทเรียนที่ทำให้เราเข้มแข็งกว่าเดิม...",
  "ข้อความสุดท้ายที่พิมพ์ค้างไว้ในแชต แต่ไม่กล้ากดส่งออกไปหาเธอ",
  "กาแฟแก้วเดิมบนโต๊ะทำงาน กับเรื่องราวที่เราเคยคุยกันเมื่อปีก่อน"
];

const POPULAR_SIDEBAR_GENRES = [
  { name: 'Pop', thai: 'ป๊อป', icon: Star },
  { name: 'Luk Thung', thai: 'ลูกทุ่ง', icon: Music },
  { name: 'Modern Trap', thai: 'โมเดิร์นแทรป', icon: BarChart2 },
  { name: 'Hip-hop', thai: 'ฮิปฮอป', icon: Mic },
  { name: 'R&B', thai: 'อาร์แอนด์บี', icon: Heart },
  { name: 'City Pop', thai: 'ซิตี้ป๊อป', icon: Headphones },
];

const App: React.FC = () => {
  const { theme, fontSize, hydratePreferences } = useTheme();
  const [isPinAuthenticated, setIsPinAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('mix_studio_authenticated') === 'true' ||
        sessionStorage.getItem('mix_studio_authenticated') === 'true'
      );
    }
    return false;
  });

  const handlePinLogout = () => {
    try {
      localStorage.removeItem('mix_studio_authenticated');
      sessionStorage.removeItem('mix_studio_authenticated');
    } catch {}
    setIsPinAuthenticated(false);
  };

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [cloudSyncError, setCloudSyncError] = useState<string | null>(null);

  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [activeTrackMenuId, setActiveTrackMenuId] = useState<string | null>(null);
  const [activeThemeInput, setActiveThemeInput] = useState<string>('');
  const [genreTrigger, setGenreTrigger] = useState<string>('');
  const [externalPreset, setExternalPreset] = useState<PresetSyncPayload | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageMode>('Thai Only');
  const [englishMixRatio, setEnglishMixRatio] = useState<EnglishMixRatio>(25);

  const [selectedAiEngine, setSelectedAiEngine] = useState<AiEngineId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mix_ai_engine');
      if (saved === 'deepseek-v4-pro' || saved === 'gemini-3.8-flash') return saved;
    }
    return 'deepseek-v4-pro';
  });
  const [draftAiEngine, setDraftAiEngine] = useState<AiEngineId>(selectedAiEngine);
  const [aiEngineStatus, setAiEngineStatus] = useState<{ geminiReady: boolean; deepseekReady: boolean } | null>(null);
  const [aiEngineSavedNotice, setAiEngineSavedNotice] = useState<string | null>(null);
  const [deepseekApiKey, setDeepseekApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mix_deepseek_api_key') || '';
    }
    return '';
  });
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mix_gemini_api_key') || '';
    }
    return '';
  });
  const [showDeepseekKey, setShowDeepseekKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showSecondaryKeyInput, setShowSecondaryKeyInput] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLyricModalOpen, setIsLyricModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isIdeasOpen, setIsIdeasOpen] = useState(false);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  const [isViralModalOpen, setIsViralModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [tuneSongData, setTuneSongData] = useState<GeneratedLyric | null>(null);

  const [cloudKnowledgeVault, setCloudKnowledgeVault] = useState<KnowledgeVaultRecord[]>([]);

  // Fix Critical Bug #3: Pass full preset payload (genre, moods, artist, sliders, sunoModel, samplePrompt)
  const handleApplyViralCaseStudy = (study: ViralCaseStudy) => {
    const viralMoodMap: Record<string, string[]> = {
      'case-beer-fourth-glass': ['อกหัก (Broken Heart)', 'ตัดพ้อ (Sarcastic)', 'โหยหา (Nostalgic)'],
      'case-die-with-a-smile': ['โรแมนติก (Romantic)', 'โหยหา (Nostalgic)', 'อบอุ่น (Warm)'],
      'case-birds-of-a-feather': ['ชวนฝัน (Ethereal)', 'คลั่งรัก (In Love)', 'นุ่มนวล (Gentle)'],
      'case-apt': ['สนุกสนาน (Energetic)', 'ติดหู (Catchy)', 'ตื่นเต้น (Excited)'],
      'case-ordinary': ['โรแมนติก (Romantic)', 'ทรงพลัง (Powerful)', 'ซึ้งกินใจ (Touching)'],
      'case-back-to-friends': ['โหยหา (Nostalgic)', 'เสียดาย (Regretful)', 'ลืมไม่ลง (Unforgettable)'],
      'case-luther': ['โรแมนติก (Romantic)', 'เท่ (Cool)', 'อบอุ่น (Warm)'],
      'case-thats-so-true': ['ตัดพ้อ (Sarcastic)', 'เจ็บปวด (Painful)', 'มั่นใจ (Confident)'],
      'case-pretty-little-baby': ['อบอุ่น (Warm)', 'ใจฟู (Heart-warming)', 'วินเทจ (Vintage)'],
      'case-katseye-gnarly': ['มั่นใจ (Confident)', 'สนุกสนาน (Energetic)', 'เท่ (Cool)'],
    };
    setExternalPreset({
      id: study.id,
      genre: study.genre.split('/')[0].trim(),
      moods: viralMoodMap[study.id] || ['สดใส (Bright)'],
      artist: study.artist,
      theme: `${study.title} Style (${study.emotionalAtmosphere}): ${study.thaiApplicationStrategy}`,
      sunoModel: study.recommendedSunoModel,
      weirdness: study.recommendedSliders.weirdness,
      styleInfluence: study.recommendedSliders.styleInfluence,
      customStylePrompt: study.samplePrompt,
      mode: 'create',
      timestamp: Date.now()
    });
  };

  const handleApplyStyle = (preset: SongStylePreset) => {
    setExternalPreset({
      id: preset.id,
      genre: preset.genre,
      moods: preset.moods && preset.moods.length > 0 ? preset.moods : undefined,
      artist: preset.artist,
      theme: preset.description || preset.title,
      customStylePrompt: preset.stylePrompt,
      mode: 'create',
      timestamp: Date.now()
    });
  };

  const handleApplyInspiration = (preset: InspirationPreset) => {
    setExternalPreset({
      id: preset.id,
      genre: preset.recommendedGenre,
      moods: preset.mood ? [preset.mood] : undefined,
      theme: `${preset.title}: ${preset.story}`,
      mode: 'create',
      timestamp: Date.now()
    });
  };

  const [state, setState] = useState<AppState>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('lyrics_history') : null;
    let history: GeneratedLyric[] = [];
    if (saved) {
      try {
        history = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
    return {
      currentLyric: null,
      history,
      isGenerating: false,
      error: null,
    };
  });

  const historyRef = useRef<GeneratedLyric[]>(state.history);
  useEffect(() => {
    historyRef.current = state.history;
  }, [state.history]);

  const formatCloudError = (err: unknown): string => {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Quota exceeded')) {
      return 'ใช้งานโควตา Firestore ฟรีประจำวันครบแล้ว ระบบจะรีเซ็ตโควตาในวันถัดไป';
    }
    return 'เกิดข้อผิดพลาดในการซิงค์ข้อมูล Firestore';
  };

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken || null);
        setIsAuthReady(true);
      },
      () => {
        setUser(null);
        setToken(null);
        setCloudSyncStatus('idle');
        setCloudSyncError(null);
        setIsAuthReady(true);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let active = true;
    const fetchAiStatus = async () => {
      try {
        const res = await fetch('/api/ai/status', { headers: { Accept: 'application/json' } });
        if (!res.ok) return;
        const data = await res.json();
        if (active && data?.ok && data?.engines) {
          setAiEngineStatus({
            geminiReady: Boolean(data.engines['gemini-3.8-flash']?.ready),
            deepseekReady: Boolean(data.engines['deepseek-v4-pro']?.ready),
          });
        }
      } catch {
        // Ignore transient status check errors
      }
    };
    void fetchAiStatus();
    return () => {
      active = false;
    };
  }, []);

  const handleSelectAiEngine = (engine: AiEngineId) => {
    setSelectedAiEngine(engine);
    setDraftAiEngine(engine);
    try {
      localStorage.setItem('mix_ai_engine', engine);
    } catch {
      // ignore storage errors
    }
  };

  const handleDeepseekKeyChange = (val: string) => {
    setDeepseekApiKey(val);
    try {
      localStorage.setItem('mix_deepseek_api_key', val.trim());
    } catch {
      // ignore storage errors
    }
  };

  const handleGeminiKeyChange = (val: string) => {
    setGeminiApiKey(val);
    try {
      localStorage.setItem('mix_gemini_api_key', val.trim());
    } catch {
      // ignore storage errors
    }
  };

  const handleSaveAiEngine = () => {
    setSelectedAiEngine(draftAiEngine);
    try {
      localStorage.setItem('mix_ai_engine', draftAiEngine);
      localStorage.setItem('mix_deepseek_api_key', deepseekApiKey.trim());
      localStorage.setItem('mix_gemini_api_key', geminiApiKey.trim());
    } catch {
      // ignore storage errors
    }
    setIsLyricModalOpen(false);
    setTuneSongData(null);
    const label = draftAiEngine === 'deepseek-v4-pro' ? 'DeepSeek-V4-Pro (หลัก)' : 'Gemini 3.8 Flash (สำรอง)';
    const keyDetail = draftAiEngine === 'deepseek-v4-pro'
      ? (deepseekApiKey.trim() ? 'พร้อมคีย์ DeepSeek ส่วนตัว' : 'ใช้คีย์ระบบ')
      : (geminiApiKey.trim() ? 'พร้อมคีย์ Gemini ส่วนตัว' : 'ใช้คีย์ระบบ');
    setAiEngineSavedNotice(`✓ บันทึก ${label} • ${keyDetail} เรียบร้อย พร้อมใช้งานทันที`);
    setTimeout(() => {
      setAiEngineSavedNotice(null);
    }, 3500);
  };

  useEffect(() => {
    if (!isAuthReady || !user) return;

    let cancelled = false;
    let unsubProfile: (() => void) | undefined;
    let unsubSongs: (() => void) | undefined;
    let unsubKnowledgeVault: (() => void) | undefined;

    const setupCloudSync = async () => {
      setCloudSyncStatus('syncing');
      setCloudSyncError(null);
      try {
        // 1. Ensure parent users/{uid} document exists before accessing /songs or /knowledge_vault subcollections
        const cloudPrefs = await upsertUserProfile(user, { theme, fontSize });
        if (cancelled) return;
        hydratePreferences(cloudPrefs);

        // 2. Push any local-only songs to Firestore before attaching realtime snapshot
        await syncLocalHistoryToCloud(user.uid, historyRef.current);
        if (cancelled) return;

        // 3. Seed & sync core extracted knowledge database from the 5 PDFs to Firestore knowledge_vault
        const extractedSeedRecords: Omit<KnowledgeVaultRecord, 'ownerId'>[] = [
          {
            id: GOLDEN_BLUEPRINT_SONG.id,
            category: 'golden-blueprint',
            title: GOLDEN_BLUEPRINT_SONG.title,
            sourceDoc: 'SunoSong System Blueprint v2.6',
            summary: `${GOLDEN_BLUEPRINT_SONG.subtitle} | Hook: ${GOLDEN_BLUEPRINT_SONG.earwormHook}`,
            stylePrompt: GOLDEN_BLUEPRINT_SONG.stylePrompt,
            sampleLyrics: GOLDEN_BLUEPRINT_SONG.fullLyrics,
            tags: [GOLDEN_BLUEPRINT_SONG.genre, GOLDEN_BLUEPRINT_SONG.bpm, GOLDEN_BLUEPRINT_SONG.musicalKey],
          },
          ...VIRAL_CASE_STUDIES.map((cs) => ({
            id: `vault_${cs.id}`,
            category: 'viral-case-study' as const,
            title: `${cs.title} (${cs.artist})`,
            sourceDoc: 'Suno v6 Pro Viral Music Report 2025-2026',
            summary: `${cs.hookSecret} | กลยุทธ์ไทย: ${cs.thaiApplicationStrategy}`,
            stylePrompt: cs.samplePrompt,
            tags: [cs.genre, cs.sunoMvVisual],
          })),
          ...ZERODAY_DSP_CALIBRATION_STANDARDS.map((dsp) => ({
            id: `dsp_${dsp.id}`,
            category: 'dsp-mastering' as const,
            title: `${dsp.formatName} (${dsp.targetLufs})`,
            sourceDoc: 'ZeroDay Mastering DSP Engine v2.6',
            summary: `${dsp.useCase} | Ceiling: ${dsp.ceilingDbTp} | Dither: ${dsp.ditherMode} | ${dsp.technicalNote}`,
            stylePrompt: `${dsp.formatName}, Ceiling ${dsp.ceilingDbTp}, Target ${dsp.targetLufs}`,
            tags: [dsp.formatName, dsp.targetLufs, dsp.dynamicRange],
          })),
          ...SUNO_DAILY_ARCHIVES_2026.map((arch) => ({
            id: `archive_doc_${arch.docNumber}`,
            category: 'daily-archive' as const,
            title: `${arch.date}: ${arch.title}`,
            sourceDoc: arch.compendiumPart,
            summary: arch.summary,
            stylePrompt: arch.readyPrompt,
            tags: arch.keyTags.slice(0, 10),
          })),
        ];

        await syncExtractedPdfKnowledgeToCloud(user.uid, extractedSeedRecords);
        if (cancelled) return;

        unsubProfile = subscribeToUserProfile(
          user.uid,
          (prefs) => {
            hydratePreferences(prefs);
          },
          (errMsg) => {
            setCloudSyncStatus('error');
            setCloudSyncError(formatCloudError(errMsg));
          }
        );

        unsubSongs = subscribeToUserSongs(
          user.uid,
          (cloudSongs) => {
            setState((prev) => ({
              ...prev,
              history: cloudSongs,
            }));
            setCloudSyncStatus('synced');
          },
          (errMsg) => {
            setCloudSyncStatus('error');
            setCloudSyncError(formatCloudError(errMsg));
          }
        );

        unsubKnowledgeVault = subscribeToUserKnowledgeVault(
          user.uid,
          (vaultItems) => {
            setCloudKnowledgeVault(vaultItems);
          },
          (errMsg) => {
            console.warn('Knowledge Vault subscription warning:', errMsg);
          }
        );
      } catch (err) {
        if (!cancelled) {
          setCloudSyncStatus('error');
          setCloudSyncError(formatCloudError(err));
          console.error('Firestore setup error:', err);
        }
      }
    };

    void setupCloudSync();

    return () => {
      cancelled = true;
      unsubProfile?.();
      unsubSongs?.();
      unsubKnowledgeVault?.();
    };
  }, [isAuthReady, user?.uid, hydratePreferences]);

  const handleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken || null);
      }
    } catch (err: any) {
      console.error("Google login failed", err);
      setState(prev => ({ ...prev, error: `Google Sign-In failed: ${err.message || err}` }));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setCloudSyncStatus('idle');
      setCloudSyncError(null);
      setIsUserMenuOpen(false);
    } catch (err: any) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('lyrics_history', JSON.stringify(state.history));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  }, [state.history]);

  const handleTogglePlaySong = (songId: string) => {
    if (playingSongId === songId) {
      stopAudioPreview();
      setPlayingSongId(null);
    } else {
      setPlayingSongId(songId);
      playAudioPreview(songId, () => {
        setPlayingSongId(null);
      });
    }
  };

  const handleGenerate = async (input: SongInput) => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const finalInput: SongInput = {
        ...input,
        language: input.language || selectedLanguage,
        englishMixRatio: input.englishMixRatio || englishMixRatio,
        aiEngine: selectedAiEngine,
        deepseekApiKey: deepseekApiKey.trim() || undefined,
        geminiApiKey: geminiApiKey.trim() || undefined,
        customApiKey: (selectedAiEngine === 'deepseek-v4-pro' ? deepseekApiKey : geminiApiKey).trim() || undefined,
      };
      const generated = await generateThaiLyrics(finalInput);
      const newLyric: GeneratedLyric = {
        id: Date.now().toString(),
        title: generated.title,
        stylePrompt: generated.stylePrompt,
        stylePromptOptionB: generated.stylePromptOptionB,
        conciseStylePrompt: generated.conciseStylePrompt,
        genreDescription: generated.genreDescription,
        vocalDescription: generated.vocalDescription,
        arrangementDescription: generated.arrangementDescription,
        productionDescription: generated.productionDescription,
        excludeStyles: generated.excludeStyles,
        vocalGender: generated.vocalGender,
        weirdness: generated.weirdness,
        styleInfluence: generated.styleInfluence,
        tempoBpm: generated.tempoBpm,
        musicalKey: generated.musicalKey,
        syllableScore: generated.syllableScore,
        sunoPerformanceTips: generated.sunoPerformanceTips,
        genreEraFusion: generated.genreEraFusion,
        songwritingModeUsed: generated.songwritingModeUsed,
        sevenSecondHook: generated.sevenSecondHook,
        viralCaptionLine: generated.viralCaptionLine,
        prosodyEngineeringNotes: generated.prosodyEngineeringNotes,
        modernizationReplacements: generated.modernizationReplacements,
        content: generated.content,
        timestamp: Date.now(),
        input: finalInput,
        qcReport: generated.qcReport,
        validationReport: generated.validationReport,
        sunoModelRecommended: generated.sunoModelRecommended,
        tiktokLane: generated.tiktokLane,
        sunoMvVisualRecommended: generated.sunoMvVisualRecommended,
        aiEngineUsed: generated.aiEngineUsed,
        aiFallbackApplied: generated.aiFallbackApplied,
      };

      setState(prev => ({
        ...prev,
        currentLyric: newLyric,
        history: [newLyric, ...prev.history],
        isGenerating: false,
      }));
      setIsLyricModalOpen(true);

      if (user) {
        void saveSongProject(user.uid, newLyric).catch((err) => {
          setCloudSyncStatus('error');
          setCloudSyncError(formatCloudError(err));
        });
      }
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: err.message || "เกิดข้อผิดพลาดในการแต่งเพลง กรุณาลองใหม่อีกครั้ง",
      }));
    }
  };

  const updateCurrentLyric = (updated: GeneratedLyric) => {
    setState(prev => ({
      ...prev,
      currentLyric: updated,
      history: prev.history.map(item => item.id === updated.id ? updated : item)
    }));
    if (user) {
      void updateSongProject(user.uid, updated).catch((err) => {
        setCloudSyncStatus('error');
        setCloudSyncError(formatCloudError(err));
      });
    }
  };

  const downloadTxtFile = (lyric: GeneratedLyric) => {
    const langLabel =
      lyric.input.language === 'Thai-English Mix'
        ? `ไทย-อังกฤษ (ไทย ${100 - (lyric.input.englishMixRatio || 25)}% : อังกฤษ ${lyric.input.englishMixRatio || 25}%)`
        : lyric.input.language === 'English Only'
        ? 'อังกฤษล้วน (100%)'
        : 'ไทยล้วน (100%)';

    const modernizationLines = (lyric.modernizationReplacements || [])
      .map(item => `  - "${item.originalWord}" -> "${item.modernReplacement}" (${item.reason || ''})`)
      .join('\n');

    const element = document.createElement("a");
    const file = new Blob([
      `================ 1. Blueprint & Commercial Hit Analysis ================\n`,
      `ชื่อเพลง: ${lyric.title || 'ไม่มีชื่อเพลง'}\n`,
      `Genre & Era Fusion: ${lyric.genreEraFusion || `${lyric.input.genre} • Modern Hit Fusion`}\n`,
      `Songwriting Mode: ${lyric.songwritingModeUsed || 'Auto Hitmaker'}\n`,
      `ภาษาเนื้อเพลง: ${langLabel}\n`,
      `Tempo & Key: ${lyric.tempoBpm || '115 BPM'} | ${lyric.musicalKey || 'C Major'}\n`,
      `7-Second Stop-Scroll Hook: ${lyric.sevenSecondHook || ''}\n`,
      `Viral Caption Line: ${lyric.viralCaptionLine || ''}\n\n`,
      `================ 2. Suno v6 Style & Exclusion Prompts ================\n`,
      `Option A (Main Commercial Style Prompt):\n${lyric.stylePrompt}\n\n`,
      `Option B (Alternative Vibe Style Prompt):\n${lyric.stylePromptOptionB || lyric.conciseStylePrompt || ''}\n\n`,
      `Concise Style (<120 chars):\n${lyric.conciseStylePrompt || ''}\n\n`,
      `Exclude Styles:\n${lyric.excludeStyles}\n\n`,
      `================ 3. Complete Suno v6 Production Lyrics ================\n\n`,
      `${lyric.content}\n\n`,
      `================ 4. Lyrical & Prosody Engineering Notes ================\n`,
      `${(lyric.prosodyEngineeringNotes || []).map(n => `- ${n}`).join('\n')}\n`,
      modernizationLines ? `\nModernization Replacements:\n${modernizationLines}\n\n` : '\n',
      `================ 5. Suno v6 Studio Direction & Remix Tips ================\n`,
      `${(lyric.sunoPerformanceTips || []).map(t => `- ${t}`).join('\n')}\n`
    ], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${lyric.title || 'thai_lyrics'}_suno.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const deleteFromHistory = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setState(prev => ({
      ...prev,
      history: prev.history.filter(item => item.id !== id),
      currentLyric: prev.currentLyric?.id === id ? null : prev.currentLyric
    }));
    if (user) {
      void deleteSongProject(user.uid, id).catch((err) => {
        setCloudSyncStatus('error');
        setCloudSyncError(formatCloudError(err));
      });
    }
  };

  const applySampleLyric = (snippet: string) => {
    setActiveThemeInput(snippet);
    setExternalPreset({
      id: `snippet-${Date.now()}`,
      theme: snippet,
      mode: 'create',
      timestamp: Date.now()
    });
  };

  const handleTuneSong = (lyric: GeneratedLyric) => {
    setTuneSongData(lyric);
    setIsLyricModalOpen(false);
    setIsHistoryOpen(false);
    setActiveTrackMenuId(null);
  };

  const recentTracks = state.history.length > 0
    ? state.history.slice(0, 5).map(item => ({
        id: item.id,
        title: item.title,
        genre: item.input.genre,
        duration: item.input.length === '1:30 min' ? '01:30'
          : item.input.length === '2:30 min' || item.input.length === '2-3 min' ? '02:30'
          : item.input.length === '4:30 min' || item.input.length === '4-5 min' ? '04:30'
          : item.input.length === '6:00 min' ? '06:00'
          : '03:30',
        rawItem: item as GeneratedLyric | undefined
      }))
    : SAMPLE_RECENT_SONGS.map(s => ({ ...s, rawItem: undefined as GeneratedLyric | undefined }));

  if (!isPinAuthenticated) {
    return <PinLoginScreen onSuccess={() => setIsPinAuthenticated(true)} />;
  }

  return (
    <div className="min-h-dvh lg:h-dvh w-screen bg-[#F4F4F4] text-[#111111] flex flex-col lg:overflow-hidden font-sans select-none">

      {/* ================= TOP HEADER BAR (Matches Reference Design) ================= */}
      <header className="flex-none bg-white border-b border-[#E8E8E8] px-4 sm:px-6 py-2.5 z-40 grid grid-cols-2 lg:grid-cols-3 items-center">
        {/* Left: Brand Identity */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setIsLyricModalOpen(false)}
        >
          <div className="w-11 h-11 rounded-xl bg-[#111111] flex items-center justify-center shadow-xs shrink-0 overflow-hidden p-1 border border-[#E8E8E8]">
            <img
              src="/logo.png"
              alt="MIX"
              className="w-full h-full object-contain filter contrast-125"
              onError={(e) => {
                // Fallback to icon if logo not available
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-[#111111] uppercase">
                MIX AI SONG
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#777777] text-white font-bold">
                Beta v6.0 Pro
              </span>
            </div>
            <p className="text-[11px] text-[#777777] -mt-0.5 font-medium">
              Prompt &amp; Song Structure Architect
            </p>
          </div>
        </div>

        {/* Center: Studio Title */}
        <div className="hidden lg:flex items-center justify-center">
          <span className="text-sm sm:text-base font-extrabold tracking-wider text-[#111111] uppercase">
            MUSIC AI GEN BY MIX
          </span>
        </div>

        {/* Right: Pill Action Controls & Profile */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => {
              setExternalPreset({
                id: `remix-switch-${Date.now()}`,
                mode: 'complete',
                timestamp: Date.now()
              });
            }}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4F4F4] hover:bg-[#E8E8E8] border border-[#E8E8E8] text-xs font-bold text-[#111111] transition cursor-pointer"
            title="เข้าสู่โหมดรีมิกซ์ / Remaster"
          >
            <Shuffle size={13} />
            <span>Remix</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4F4F4] hover:bg-[#E8E8E8] border border-[#E8E8E8] text-xs font-bold text-[#111111] transition cursor-pointer"
            title="ตั้งค่าการแสดงผล & อุปกรณ์"
          >
            <Monitor size={13} />
            <span>Device</span>
          </button>

          <button
            onClick={handlePinLogout}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4F4F4] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-[#E8E8E8] text-xs font-bold text-[#444444] transition cursor-pointer"
            title="ล็อกหน้าจอ PIN"
          >
            <Lock size={13} />
            <span>Lock</span>
          </button>

          <button
            onClick={() => setIsHelpOpen(true)}
            className="w-9 h-9 rounded-full bg-[#F4F4F4] hover:bg-[#E8E8E8] border border-[#E8E8E8] flex items-center justify-center text-[#111111] transition cursor-pointer"
            title="คู่มือการใช้งาน & กฎการแต่งเพลง"
          >
            <Bell size={15} />
          </button>

          {/* MIX Profile / Google Auth Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-9 h-9 rounded-full bg-[#111111] text-white font-extrabold text-[11px] flex items-center justify-center shadow-xs cursor-pointer overflow-hidden"
              title={user ? user.displayName || 'MIX Profile' : 'บัญชีผู้ใช้ & Google Cloud'}
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="MIX" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span>MIX</span>
              )}
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white border border-[#E8E8E8] rounded-2xl shadow-xl p-2 z-50 space-y-1 text-xs"
                onClick={() => setIsUserMenuOpen(false)}
              >
                {user ? (
                  <>
                    <div className="px-3 py-2 border-b border-[#E8E8E8]">
                      <p className="font-bold text-[#111111] truncate">{user.displayName || 'MIX Studio User'}</p>
                      <p className="text-[10px] text-[#777777] truncate">{user.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            cloudSyncStatus === 'error'
                              ? 'bg-red-500'
                              : cloudSyncStatus === 'syncing'
                              ? 'bg-amber-500 animate-pulse'
                              : 'bg-[#36A66A]'
                          }`}
                        />
                        <span className="text-[#555555]">
                          {cloudSyncStatus === 'error'
                            ? 'ซิงค์ Firestore ขัดข้อง'
                            : cloudSyncStatus === 'syncing'
                            ? 'กำลังซิงค์คลังเพลง...'
                            : 'ซิงค์ Firestore อัตโนมัติแล้ว'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F4F4F4] text-red-600 font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>ออกจากระบบ</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F4F4F4] text-[#111111] font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px]">G</span>
                    <span>เชื่อมต่อบัญชี Google</span>
                  </button>
                )}
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F4F4F4] text-[#111111] font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Monitor size={14} />
                  <span>ตั้งค่าการแสดงผล</span>
                </button>
                <button
                  onClick={() => setIsHelpOpen(true)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F4F4F4] text-[#111111] font-medium flex items-center gap-2 cursor-pointer"
                >
                  <HelpCircle size={14} />
                  <span>คู่มือการใช้งาน</span>
                </button>
                <button
                  onClick={handlePinLogout}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2 cursor-pointer border-t border-[#F0F0F0] mt-1 pt-2"
                >
                  <Lock size={14} />
                  <span>ล็อกหน้าจอ PIN</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= MAIN 3-COLUMN STUDIO WORKSPACE (24% / 50% / 26%) ================= */}
      <main className="flex-1 min-h-0 px-3 sm:px-5 py-3 grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:overflow-hidden">

        {/* COLUMN 1: LEFT SIDEBAR (Span 3 -> ~25%) */}
        <aside className="lg:col-span-3 flex flex-col gap-3 min-h-0 lg:overflow-y-auto custom-scrollbar">
          <div className="bg-white border border-[#E8E8E8] rounded-3xl p-3.5 space-y-3 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              {/* Primary Black Action Card: สร้างเพลงใหม่ */}
              <button
                onClick={() => {
                  setIsLyricModalOpen(false);
                  setTuneSongData(null);
                  setExternalPreset({
                    id: `new-${Date.now()}`,
                    mode: 'create',
                    theme: '',
                    timestamp: Date.now()
                  });
                }}
                className="w-full py-3.5 px-4 rounded-2xl neurova-btn-primary text-left flex items-center justify-center gap-3 cursor-pointer"
              >
                <Music size={20} className="text-white shrink-0" />
                <div>
                  <span className="text-sm font-extrabold text-white block leading-tight">สร้างเพลงใหม่</span>
                  <span className="text-[11px] text-white/75 font-medium block">เริ่มต้นโปรเจกต์เพลง</span>
                </div>
              </button>

              {/* 2x2 Quick Navigation Grid */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsViralModalOpen(true)}
                  className="neurova-subcard p-3 rounded-2xl flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#E8E8E8] flex items-center justify-center text-[#111111] shrink-0">
                    <Flame size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#111111] truncate">ฐานเพลงฮิต</p>
                    <p className="text-[10px] text-[#777777] truncate">เทรนด์ยอดนิยม</p>
                  </div>
                </button>

                <button
                  onClick={() => setIsStyleModalOpen(true)}
                  className="neurova-subcard p-3 rounded-2xl flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#E8E8E8] flex items-center justify-center text-[#111111] shrink-0">
                    <LayoutGrid size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#111111] truncate">สไตล์เพลง</p>
                    <p className="text-[10px] text-[#777777] truncate">กว่า 20 หมวด</p>
                  </div>
                </button>

                <button
                  onClick={() => setIsIdeasOpen(true)}
                  className="neurova-subcard p-3 rounded-2xl flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#E8E8E8] flex items-center justify-center text-[#111111] shrink-0">
                    <Lightbulb size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#111111] truncate">แรงบันดาลใจ</p>
                    <p className="text-[10px] text-[#777777] truncate">ไอเดีย &amp; คำศัพท์</p>
                  </div>
                </button>

                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="neurova-subcard p-3 rounded-2xl flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#E8E8E8] flex items-center justify-center text-[#111111] shrink-0">
                    <Folder size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#111111] truncate">โปรเจกต์ของฉัน</p>
                    <p className="text-[10px] text-[#777777] truncate">จัดการและต่อยอด</p>
                  </div>
                </button>
              </div>

              {/* Popular Genres 3x2 Grid */}
              <div className="pt-1 space-y-2">
                <div className="flex justify-between items-center px-0.5">
                  <span className="text-xs font-extrabold text-[#111111]">แนวเพลงยอดนิยม</span>
                  <button
                    onClick={() => setIsStyleModalOpen(true)}
                    className="text-[11px] text-[#777777] hover:text-[#111111] font-semibold transition cursor-pointer"
                  >
                    ดูทั้งหมด
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {POPULAR_SIDEBAR_GENRES.map(g => {
                    const Icon = g.icon;
                    return (
                      <button
                        key={g.name}
                        onClick={() => setGenreTrigger(`${g.name}::${Date.now()}`)}
                        className="neurova-subcard rounded-2xl p-2.5 text-center flex flex-col items-center justify-center gap-1 cursor-pointer"
                      >
                        <Icon size={15} className="text-[#111111]" />
                        <span className="text-[11px] font-extrabold text-[#111111] leading-tight truncate w-full">
                          {g.name}
                        </span>
                        <span className="text-[9px] text-[#777777] truncate w-full">{g.thai}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Engine Selector Card (DeepSeek-V4-Pro หลัก & Gemini 3.8 Flash สำรอง + Custom API Input Bar) */}
              <div className="neurova-subcard p-3 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-[#111111] flex items-center gap-1.5">
                    <Cpu size={14} className="text-[#111111]" />
                    ตั้งค่า AI Engine
                  </span>
                  <span className="text-[10px] font-bold text-[#111111] bg-white border border-[#E8E8E8] px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#36A66A]" />
                    {selectedAiEngine === 'deepseek-v4-pro' ? 'DeepSeek-V4-Pro (หลัก)' : 'Gemini 3.8 Flash (สำรอง)'}
                  </span>
                </div>

                {/* Model Selector Buttons */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectAiEngine('deepseek-v4-pro')}
                    className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                      draftAiEngine === 'deepseek-v4-pro'
                        ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                        : 'bg-white text-[#111111] border-[#E8E8E8] hover:border-[#CCCCCC]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="text-[11px] font-extrabold leading-tight">DeepSeek-V4-Pro</div>
                      <span className={`text-[8px] font-extrabold px-1 py-0.2 rounded ${
                        draftAiEngine === 'deepseek-v4-pro' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        หลัก
                      </span>
                    </div>
                    <div
                      className={`text-[9px] mt-1 flex items-center gap-1 ${
                        draftAiEngine === 'deepseek-v4-pro' ? 'text-white/80' : 'text-[#777777]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          deepseekApiKey.trim() || aiEngineStatus?.deepseekReady ? 'bg-[#36A66A]' : 'bg-amber-400'
                        }`}
                      />
                      {deepseekApiKey.trim()
                        ? 'ใช้คีย์ส่วนตัว'
                        : aiEngineStatus?.deepseekReady
                        ? 'คีย์ระบบพร้อมใช้'
                        : 'กดเพื่อใส่คีย์'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectAiEngine('gemini-3.8-flash')}
                    className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                      draftAiEngine === 'gemini-3.8-flash'
                        ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                        : 'bg-white text-[#111111] border-[#E8E8E8] hover:border-[#CCCCCC]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="text-[11px] font-extrabold leading-tight">Gemini 3.8 Flash</div>
                      <span className={`text-[8px] font-extrabold px-1 py-0.2 rounded ${
                        draftAiEngine === 'gemini-3.8-flash' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        สำรอง
                      </span>
                    </div>
                    <div
                      className={`text-[9px] mt-1 flex items-center gap-1 ${
                        draftAiEngine === 'gemini-3.8-flash' ? 'text-white/80' : 'text-[#777777]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          geminiApiKey.trim() || aiEngineStatus?.geminiReady ? 'bg-[#36A66A]' : 'bg-amber-400'
                        }`}
                      />
                      {geminiApiKey.trim()
                        ? 'ใช้คีย์ส่วนตัว'
                        : aiEngineStatus?.geminiReady
                        ? 'คีย์ระบบพร้อมใช้'
                        : 'กดเพื่อใส่คีย์'}
                    </div>
                  </button>
                </div>

                {/* API Key Input Drawer for the Selected Model */}
                <div className="bg-white border border-[#E8E8E8] rounded-xl p-2.5 space-y-2 shadow-2xs">
                  {draftAiEngine === 'deepseek-v4-pro' ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-extrabold text-[#111111] flex items-center gap-1">
                          <Key size={12} className="text-[#36A66A]" />
                          DeepSeek API Key (สำหรับโมเดลหลัก)
                        </label>
                        <span className="text-[9px] text-[#777777]">
                          {deepseekApiKey.trim() ? 'คีย์ส่วนตัว' : (aiEngineStatus?.deepseekReady ? 'ใช้คีย์ระบบ' : 'จำเป็น')}
                        </span>
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type={showDeepseekKey ? 'text' : 'password'}
                          value={deepseekApiKey}
                          onChange={(e) => handleDeepseekKeyChange(e.target.value)}
                          placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full bg-[#F8F8F8] border border-[#E0E0E0] focus:border-[#111111] focus:bg-white text-[11px] font-mono rounded-lg pl-2.5 pr-8 py-1.5 outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowDeepseekKey(!showDeepseekKey)}
                          className="absolute right-2 text-[#888888] hover:text-[#111111] cursor-pointer"
                          title={showDeepseekKey ? 'ซ่อนคีย์' : 'แสดงคีย์'}
                        >
                          {showDeepseekKey ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                      <p className="text-[9px] text-[#777777] leading-tight">
                        {deepseekApiKey.trim() ? (
                          <span className="text-[#36A66A] font-bold">✓ ใช้คีย์ส่วนตัวนี้ในการประมวลผลโมเดลหลัก</span>
                        ) : aiEngineStatus?.deepseekReady ? (
                          'มีคีย์เซิร์ฟเวอร์พร้อมใช้งาน (หรือระบุคีย์ส่วนตัวที่นี่เพื่อใช้โควต้าตนเอง)'
                        ) : (
                          <span className="text-amber-600 font-bold">⚠️ ยังไม่มีคีย์ในระบบ กรุณาใส่ API Key ของคุณเพื่อเริ่มงาน</span>
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-extrabold text-[#111111] flex items-center gap-1">
                          <Key size={12} className="text-[#3A56D4]" />
                          Gemini API Key (สำหรับโมเดลสำรอง)
                        </label>
                        <span className="text-[9px] text-[#777777]">
                          {geminiApiKey.trim() ? 'คีย์ส่วนตัว' : (aiEngineStatus?.geminiReady ? 'ใช้คีย์ระบบ' : 'จำเป็น')}
                        </span>
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type={showGeminiKey ? 'text' : 'password'}
                          value={geminiApiKey}
                          onChange={(e) => handleGeminiKeyChange(e.target.value)}
                          placeholder="AIzaSyxxxxxxxxxxxxxxxxxxxx"
                          className="w-full bg-[#F8F8F8] border border-[#E0E0E0] focus:border-[#111111] focus:bg-white text-[11px] font-mono rounded-lg pl-2.5 pr-8 py-1.5 outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowGeminiKey(!showGeminiKey)}
                          className="absolute right-2 text-[#888888] hover:text-[#111111] cursor-pointer"
                          title={showGeminiKey ? 'ซ่อนคีย์' : 'แสดงคีย์'}
                        >
                          {showGeminiKey ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                      <p className="text-[9px] text-[#777777] leading-tight">
                        {geminiApiKey.trim() ? (
                          <span className="text-[#36A66A] font-bold">✓ ใช้คีย์ส่วนตัวนี้ในการประมวลผล</span>
                        ) : aiEngineStatus?.geminiReady ? (
                          'มีคีย์เซิร์ฟเวอร์พร้อมใช้งาน (หรือระบุคีย์ส่วนตัวที่นี่เพื่อใช้โควต้าตนเอง)'
                        ) : (
                          <span className="text-amber-600 font-bold">⚠️ ยังไม่มีคีย์ในระบบ กรุณาใส่ API Key ของคุณเพื่อเริ่มงาน</span>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Secondary Key Expandable Section */}
                  <div className="pt-1 border-t border-[#F0F0F0]">
                    <button
                      type="button"
                      onClick={() => setShowSecondaryKeyInput(!showSecondaryKeyInput)}
                      className="text-[9px] font-bold text-[#555555] hover:text-[#111111] flex items-center gap-1 cursor-pointer transition"
                    >
                      <span>{showSecondaryKeyInput ? '▼ ซ่อนการตั้งค่าคีย์อีกโมเดล' : `▶ ตั้งค่าคีย์ ${draftAiEngine === 'deepseek-v4-pro' ? 'Gemini 3.8 Flash (สำรอง)' : 'DeepSeek-V4-Pro (หลัก)'}`}</span>
                    </button>

                    {showSecondaryKeyInput && (
                      <div className="mt-1.5 pt-1.5 border-t border-dashed border-[#E8E8E8] space-y-1">
                        <label className="text-[9px] font-bold text-[#444444] flex items-center gap-1">
                          <Key size={11} className="text-[#777777]" />
                          {draftAiEngine === 'deepseek-v4-pro' ? 'Gemini API Key (สำรอง):' : 'DeepSeek API Key (หลัก):'}
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type={draftAiEngine === 'deepseek-v4-pro' ? (showGeminiKey ? 'text' : 'password') : (showDeepseekKey ? 'text' : 'password')}
                            value={draftAiEngine === 'deepseek-v4-pro' ? geminiApiKey : deepseekApiKey}
                            onChange={(e) => draftAiEngine === 'deepseek-v4-pro' ? handleGeminiKeyChange(e.target.value) : handleDeepseekKeyChange(e.target.value)}
                            placeholder={draftAiEngine === 'deepseek-v4-pro' ? 'AIzaSyxxxxxxxxxxxxxxxxxxxx' : 'sk-xxxxxxxxxxxxxxxxxxxxxxxx'}
                            className="w-full bg-[#F8F8F8] border border-[#E0E0E0] focus:border-[#111111] focus:bg-white text-[10px] font-mono rounded-lg pl-2 pr-7 py-1 outline-none transition"
                          />
                          <button
                            type="button"
                            onClick={() => draftAiEngine === 'deepseek-v4-pro' ? setShowGeminiKey(!showGeminiKey) : setShowDeepseekKey(!showDeepseekKey)}
                            className="absolute right-2 text-[#888888] hover:text-[#111111] cursor-pointer"
                          >
                            {(draftAiEngine === 'deepseek-v4-pro' ? showGeminiKey : showDeepseekKey) ? <EyeOff size={11} /> : <Eye size={11} />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveAiEngine}
                  className="w-full py-2 px-3 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <CheckCircle2 size={13} />
                  <span>
                    {draftAiEngine !== selectedAiEngine || deepseekApiKey || geminiApiKey
                      ? 'บันทึกและเริ่มงานทันที'
                      : 'บันทึกตั้งค่า • พร้อมเริ่มงานทันที'}
                  </span>
                </button>

                {aiEngineSavedNotice ? (
                  <p className="text-[10px] font-bold text-[#36A66A] text-center leading-snug">
                    {aiEngineSavedNotice}
                  </p>
                ) : (
                  <p className="text-[9px] text-[#777777] leading-snug">
                    หลัก: <span className="font-bold text-[#111111]">DeepSeek-V4-Pro</span> | สำรอง: <span className="font-bold text-[#111111]">Gemini 3.8 Flash</span> (สลับสำรองอัตโนมัติหาก DeepSeek ขัดข้อง)
                  </p>
                )}
              </div>
            </div>

            {/* Bottom-Left Card: ภาษาเนื้อร้อง & สัดส่วนภาษา (ไทย / ไทย-อังกฤษ / อังกฤษ + 25% 50% 75%) */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#F8F8F8] to-[#ECECEC] border border-[#E8E8E8] p-3 space-y-2.5">
              {/* Subtle Monochrome Abstract Wave Background */}
              <svg
                viewBox="0 0 400 90"
                className="absolute inset-x-0 bottom-0 w-full h-14 object-cover pointer-events-none opacity-45"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#999999" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#111111" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#777777" stopOpacity="0.5" />
                  </linearGradient>
                  <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#CCCCCC" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#555555" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <path d="M0,55 C90,15 170,85 270,35 C330,5 370,45 400,25 L400,90 L0,90 Z" fill="url(#waveGrad2)" />
                <path d="M0,70 C110,30 200,80 310,40 C355,22 385,50 400,40 L400,90 L0,90 Z" fill="url(#waveGrad1)" />
              </svg>

              {/* Card Content */}
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-extrabold text-[#111111] flex items-center gap-1.5">
                    <Globe size={13} className="text-[#111111]" />
                    <span>ภาษาเนื้อเพลง</span>
                  </span>
                  <span className="text-[10px] font-bold text-[#555555]">
                    {selectedLanguage === 'Thai Only'
                      ? 'ไทย 100%'
                      : selectedLanguage === 'English Only'
                      ? 'อังกฤษ 100%'
                      : `ไทย ${100 - englishMixRatio}% · อังกฤษ ${englishMixRatio}%`}
                  </span>
                </div>

                {/* 3 Language Mode Buttons: ไทย | ไทย-อังกฤษ | อังกฤษ */}
                <div className="grid grid-cols-3 gap-1.5 bg-white/85 p-1 rounded-xl border border-[#E8E8E8]">
                  {[
                    { id: 'Thai Only' as LanguageMode, label: 'ไทย' },
                    { id: 'Thai-English Mix' as LanguageMode, label: 'ไทย-อังกฤษ' },
                    { id: 'English Only' as LanguageMode, label: 'อังกฤษ' },
                  ].map(item => {
                    const isActive = selectedLanguage === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedLanguage(item.id)}
                        className={`py-1.5 px-1.5 rounded-lg text-[11px] font-extrabold transition cursor-pointer truncate ${
                          isActive
                            ? 'bg-[#111111] text-white shadow-xs'
                            : 'text-[#555555] hover:text-[#111111] hover:bg-[#F4F4F4]'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                {/* Percentage Mix Selector when ไทย-อังกฤษ is selected: 25% | 50% | 75% */}
                {selectedLanguage === 'Thai-English Mix' && (
                  <div className="bg-white/90 border border-[#E8E8E8] rounded-xl p-2 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-[#555555]">เลือกสัดส่วนผสม:</span>
                      <span className="font-extrabold text-[#111111]">
                        ไทย {100 - englishMixRatio}% · อังกฤษ {englishMixRatio}%
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {([
                        { ratio: 25 as EnglishMixRatio, title: '25%', sub: 'ไทย 75 · EN 25' },
                        { ratio: 50 as EnglishMixRatio, title: '50%', sub: 'ไทย 50 · EN 50' },
                        { ratio: 75 as EnglishMixRatio, title: '75%', sub: 'ไทย 25 · EN 75' },
                      ]).map(opt => {
                        const isRatioSelected = englishMixRatio === opt.ratio;
                        return (
                          <button
                            key={opt.ratio}
                            type="button"
                            onClick={() => setEnglishMixRatio(opt.ratio)}
                            className={`py-1.5 px-1 rounded-lg border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                              isRatioSelected
                                ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                                : 'bg-[#F8F8F8] text-[#111111] border-[#E8E8E8] hover:border-[#111111]'
                            }`}
                          >
                            <span className="text-[11px] font-black leading-tight">{opt.title}</span>
                            <span className={`text-[9px] leading-tight mt-0.5 ${isRatioSelected ? 'text-white/80' : 'text-[#777777]'}`}>
                              {opt.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Visual Proportion Bar */}
                    <div className="w-full h-1.5 rounded-full bg-[#E8E8E8] overflow-hidden flex">
                      <div
                        style={{ width: `${100 - englishMixRatio}%` }}
                        className="h-full bg-[#111111] transition-all duration-300"
                        title={`ภาษาไทย ${100 - englishMixRatio}%`}
                      />
                      <div
                        style={{ width: `${englishMixRatio}%` }}
                        className="h-full bg-[#888888] transition-all duration-300"
                        title={`ภาษาอังกฤษ ${englishMixRatio}%`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* COLUMN 2: CENTER WORKSPACE (Span 6 -> 50%) */}
        <section id="lyrics-section" className="lg:col-span-6 flex flex-col gap-3 min-h-0 lg:overflow-y-auto custom-scrollbar pr-0.5">

          {/* HERO BANNER WITH 3D MONOCHROME WAVE & AUDIO WAVEFORM PLAYER */}
          <div className="relative rounded-3xl border border-[#E8E8E8] bg-gradient-to-r from-[#EAEAEA] via-[#F3F3F3] to-[#DADADA] p-5 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] shrink-0">
            {/* Right Decorative 3D Monochrome Ribbon Wave SVG */}
            <div className="absolute right-0 top-0 bottom-0 w-3/5 pointer-events-none overflow-hidden flex items-center justify-end">
              <svg viewBox="0 0 500 220" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="chromeRibbon1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                    <stop offset="35%" stopColor="#888888" stopOpacity="0.75" />
                    <stop offset="70%" stopColor="#1E1E1E" stopOpacity="0.88" />
                    <stop offset="100%" stopColor="#D8D8D8" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="chromeRibbon2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#222222" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#CCCCCC" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#555555" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <path
                  d="M40,190 C130,180 160,30 260,35 C350,40 340,175 430,155 C475,145 495,70 520,40 L520,220 L40,220 Z"
                  fill="url(#chromeRibbon2)"
                />
                <path
                  d="M90,210 C175,165 205,10 305,25 C395,38 380,190 465,145 C490,130 505,85 520,65"
                  fill="none"
                  stroke="url(#chromeRibbon1)"
                  strokeWidth="28"
                  strokeLinecap="round"
                />
                <path
                  d="M15,175 C115,145 175,55 275,65 C365,75 375,195 470,135"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="6"
                  strokeOpacity="0.75"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Left Hero Content */}
            <div className="relative z-10 max-w-xs space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
                MIX AI SONG
              </h2>
              <p className="text-xs font-extrabold text-[#111111]">
                Generate • Compose • Remix
              </p>
              <p className="text-xs text-[#555555] font-medium">
                สร้างเพลงด้วยพลัง AI รุ่นล่าสุด
              </p>

              {/* Waveform Pill Player */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-3 bg-[#777777]/80 backdrop-blur-md pl-3.5 pr-1.5 py-1.5 rounded-full border border-white/40 shadow-sm">
                  <div className="flex items-center gap-[3px] h-4">
                    {[40, 75, 55, 95, 60, 100, 70, 45, 85, 60, 90, 50, 80, 65, 95, 55, 75, 45].map((h, i) => (
                      <span
                        key={i}
                        style={{ height: `${playingSongId === 'hero-preview' ? Math.max(30, (h + i * 17) % 100) : h}%` }}
                        className={`w-[2px] rounded-full bg-white transition-all ${
                          playingSongId === 'hero-preview' ? 'animate-pulse' : 'opacity-90'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePlaySong('hero-preview')}
                    className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center hover:scale-105 transition cursor-pointer"
                    title={playingSongId === 'hero-preview' ? 'หยุดฟังเสียงตัวอย่าง' : 'ฟังเสียงตัวอย่าง'}
                  >
                    {playingSongId === 'hero-preview' ? <Pause size={12} /> : <Play size={12} className="ml-0.5 fill-white" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN WORKFLOW FORM */}
          <div className="flex-1">
            <LyricForm
              onGenerate={handleGenerate}
              isGenerating={state.isGenerating}
              externalTheme={activeThemeInput}
              selectedGenreTrigger={genreTrigger}
              externalPreset={externalPreset}
              tuneSongData={tuneSongData}
              onResetTune={() => setTuneSongData(null)}
              onOpenStyleModal={() => setIsStyleModalOpen(true)}
              onOpenInspirationModal={() => setIsIdeasOpen(true)}
              onOpenViralModal={() => setIsViralModalOpen(true)}
              selectedLanguage={selectedLanguage}
              englishMixRatio={englishMixRatio}
              onLanguageChange={setSelectedLanguage}
              onMixRatioChange={setEnglishMixRatio}
            />

            {state.error && (
              <div className="mt-3 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-semibold whitespace-pre-line leading-relaxed shadow-xs">
                ⚠️ {state.error}
              </div>
            )}
          </div>
        </section>

        {/* COLUMN 3: RIGHT SIDEBAR (Span 3 -> ~26%) */}
        <aside className="lg:col-span-3 flex flex-col gap-3 min-h-0 lg:overflow-y-auto custom-scrollbar">

          {/* Card 1: เพลย์ลิสต์ล่าสุด */}
          <div className="bg-white border border-[#E8E8E8] p-3.5 rounded-3xl space-y-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center px-0.5">
              <span className="text-xs font-extrabold text-[#111111]">เพลย์ลิสต์ล่าสุด</span>
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="text-[11px] text-[#777777] hover:text-[#111111] font-semibold transition cursor-pointer"
              >
                ดูทั้งหมด
              </button>
            </div>

            <div className="space-y-1.5">
              {recentTracks.map(track => {
                const isPlaying = playingSongId === track.id;
                const isMenuOpen = activeTrackMenuId === track.id;
                return (
                  <div
                    key={track.id}
                    className="relative bg-[#F8F8F8] hover:bg-white border border-[#E8E8E8] hover:border-[#BDBDBD] p-2 rounded-2xl flex items-center justify-between transition cursor-pointer group"
                    onClick={() => {
                      if (track.rawItem) {
                        setState(prev => ({ ...prev, currentLyric: track.rawItem! }));
                        setIsLyricModalOpen(true);
                      } else {
                        handleTogglePlaySong(track.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePlaySong(track.id);
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition shrink-0 cursor-pointer border ${
                          isPlaying
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'bg-white text-[#111111] border-[#E8E8E8] group-hover:bg-[#111111] group-hover:text-white'
                        }`}
                        title={isPlaying ? "หยุดฟัง" : "ฟังเพลงตัวอย่าง"}
                      >
                        {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5 fill-current" />}
                      </button>

                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-[#111111] truncate">{track.title}</p>
                        <p className="text-[10px] text-[#777777] truncate">
                          {track.genre} • <span className="font-mono">{track.duration}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTrackMenuId(isMenuOpen ? null : track.id);
                      }}
                      className="p-1.5 text-[#777777] hover:text-[#111111] rounded-full hover:bg-[#F4F4F4] transition cursor-pointer"
                    >
                      <MoreHorizontal size={15} />
                    </button>

                    {isMenuOpen && (
                      <div
                        className="absolute right-2 top-11 w-44 bg-white border border-[#E8E8E8] rounded-xl shadow-xl p-1.5 z-30 space-y-1 text-[11px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {track.rawItem ? (
                          <>
                            <button
                              onClick={() => handleTuneSong(track.rawItem!)}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F4F4F4] text-[#111111] font-semibold flex items-center gap-1.5 cursor-pointer"
                            >
                              <SlidersHorizontal size={12} />
                              <span>นำไปปรับแต่ง (Fine-Tune)</span>
                            </button>
                            <button
                              onClick={() => {
                                downloadTxtFile(track.rawItem!);
                                setActiveTrackMenuId(null);
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F4F4F4] text-[#111111] font-semibold flex items-center gap-1.5 cursor-pointer"
                            >
                              <Download size={12} />
                              <span>ดาวน์โหลด .txt</span>
                            </button>
                            <button
                              onClick={(e) => {
                                deleteFromHistory(track.id, e);
                                setActiveTrackMenuId(null);
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-50 text-red-600 font-semibold flex items-center gap-1.5 cursor-pointer"
                            >
                              <Trash2 size={12} />
                              <span>ลบโปรเจกต์</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setExternalPreset({
                                id: `use-sample-${track.id}`,
                                genre: track.genre,
                                theme: `แต่งเพลงสไตล์ "${track.title}" (${track.genre})`,
                                mode: 'create',
                                timestamp: Date.now()
                              });
                              setActiveTrackMenuId(null);
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F4F4F4] text-[#111111] font-semibold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Sparkles size={12} />
                            <span>ใช้แนวเพลงนี้เป็นต้นแบบ</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsHistoryOpen(true)}
              className="w-full py-2.5 bg-[#F8F8F8] hover:bg-[#111111] border border-[#E8E8E8] hover:border-[#111111] rounded-2xl text-xs font-extrabold text-[#111111] hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Folder size={14} />
              <span>ไฟล์ที่จัดเก็บ ({state.history.length})</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 2: ไอเดียเนื้อร้องล่าสุด */}
          <div className="bg-white border border-[#E8E8E8] p-3.5 rounded-3xl space-y-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex-1">
            <div className="flex justify-between items-center px-0.5">
              <span className="text-xs font-extrabold text-[#111111]">ไอเดียเนื้อร้องล่าสุด</span>
              <button
                onClick={() => setIsIdeasOpen(true)}
                className="text-[11px] text-[#777777] hover:text-[#111111] font-semibold transition cursor-pointer"
              >
                ดูทั้งหมด (3)
              </button>
            </div>

            <div className="space-y-2">
              {SAMPLE_LYRICS.slice(0, 3).map((snippet, idx) => (
                <div
                  key={idx}
                  className="bg-[#F8F8F8] border border-[#E8E8E8] p-2.5 rounded-2xl flex items-center justify-between gap-2"
                >
                  <p className="text-[11px] text-[#111111] font-medium leading-snug line-clamp-2">
                    “{snippet}”
                  </p>
                  <button
                    onClick={() => applySampleLyric(snippet)}
                    className="px-3 py-1.5 bg-[#E8E8E8] hover:bg-[#111111] text-[#111111] hover:text-white font-bold text-[10px] rounded-full transition shrink-0 cursor-pointer"
                  >
                    ใช้ไอเดียนี้
                  </button>
                </div>
              ))}
            </div>
          </div>

        </aside>
      </main>

      {/* ================= BOTTOM FOOTER BAR (Matches Reference Design) ================= */}
      <footer className="flex-none bg-white border-t border-[#E8E8E8] py-2 px-6 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#111111] font-semibold items-center">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border border-[#111111] flex items-center justify-center">
            <AudioWaveform size={11} className="text-[#111111]" />
          </div>
          <span className="font-extrabold tracking-tight text-[#111111]">MIX IMAGE ART&amp;AUDIO</span>
        </div>

        <a
          href="https://www.facebook.com/MixNattanon"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-[#555555] hover:text-[#111111] hover:underline transition cursor-pointer"
        >
          <Facebook size={14} className="text-[#111111]" />
          <span>Facebook: MixNattanont</span>
          <ExternalLink size={11} className="text-[#777777]" />
        </a>

        <a
          href="https://www.youtube.com/@MIXNATTANON"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-[#555555] hover:text-[#111111] hover:underline transition cursor-pointer"
        >
          <Youtube size={15} className="text-[#111111]" />
          <span>YouTube: @MIXNATTANON</span>
          <ExternalLink size={11} className="text-[#777777]" />
        </a>

        <div className="flex items-center justify-end gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#36A66A]"></span>
          <span className="font-bold text-[#111111]">100% : ระบบพร้อมใช้งาน</span>
        </div>
      </footer>

      {/* ================= SONG LYRICS OUTPUT MODAL ================= */}
      <AnimatePresence>
        {isLyricModalOpen && state.currentLyric && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white border border-[#E8E8E8] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
            >
              <div className="px-6 py-4 bg-[#F8F8F8] border-b border-[#E8E8E8] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#111111] flex items-center gap-2">
                    <Sparkles size={16} />
                    <span>{state.currentLyric.title || 'เนื้อเพลงที่สร้างเสร็จแล้ว'}</span>
                  </h3>
                  <p className="text-[11px] text-[#777777] line-clamp-1">
                    Style Prompt: {state.currentLyric.conciseStylePrompt || state.currentLyric.stylePrompt}
                  </p>
                </div>

                <button
                  onClick={() => setIsLyricModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#E8E8E8] text-[#777777] hover:text-[#111111] transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <LyricDisplay
                  lyric={state.currentLyric}
                  onRegenerate={() => handleGenerate(state.currentLyric!.input)}
                  isGenerating={state.isGenerating}
                  onUpdate={updateCurrentLyric}
                  onDownload={() => downloadTxtFile(state.currentLyric!)}
                  onTuneSong={handleTuneSong}
                  user={user}
                  token={token}
                  onLogin={handleLogin}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: HELP & GUIDE ================= */}
      <AnimatePresence>
        {isHelpOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white border border-[#E8E8E8] rounded-3xl w-full max-w-xl p-6 space-y-4 shadow-2xl text-[#111111]"
            >
              <div className="flex justify-between items-center border-b border-[#E8E8E8] pb-3">
                <h3 className="text-sm font-extrabold text-[#111111] flex items-center gap-2">
                  <HelpCircle size={18} />
                  <span>คู่มือการใช้งาน MIX AI SONG (Suno v6 Pro)</span>
                </h3>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="p-1 text-[#777777] hover:text-[#111111] transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#555555] leading-relaxed max-h-96 overflow-y-auto custom-scrollbar">
                <div className="bg-[#F8F8F8] p-3.5 rounded-2xl border border-[#E8E8E8]">
                  <strong className="text-[#111111] block mb-1">1. เลือกประเภทเพลงและอารมณ์ได้มากกว่า 1 รายการ</strong>
                  <p>ผสมผสานแนวเพลง (เช่น Pop + Hip-hop) และเลือกอารมณ์ที่ต้องการสื่อได้หลายอารมณ์ ระบบจะนำทุกค่าไปคำนวณโครงสร้างเพลงตามลำดับความสำคัญ</p>
                </div>

                <div className="bg-[#F8F8F8] p-3.5 rounded-2xl border border-[#E8E8E8]">
                  <strong className="text-[#111111] block mb-1">2. กฎการแต่งเพลงไทยร่วมสมัย (Natural Spoken Thai)</strong>
                  <p>ระบบบังคับใช้ภาษาพูดที่เป็นธรรมชาติ ตัดคำกวีโบราณและคำเปรียบเทียบสำเร็จรูป เปิดบรรทัดแรกด้วยเหตุการณ์หรือการกระทำจริง และปูบริบทครบภายใน 4 บรรทัดแรก</p>
                </div>

                <div className="bg-[#F8F8F8] p-3.5 rounded-2xl border border-[#E8E8E8]">
                  <strong className="text-[#111111] block mb-1">3. แยกข้อมูล 8 ส่วนชัดเจน พร้อมใช้ใน Suno v6</strong>
                  <p>ผลลัพธ์จะแยกเนื้อเพลงล้วนออกจากคำอธิบายแนวเพลง เสียงร้อง ดนตรี การโปรดักชัน และค่าพารามิเตอร์ทางเทคนิค เพื่อให้นำไปวางใน Suno.com ได้ทันที</p>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-[#E8E8E8]">
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="px-5 py-2 bg-[#111111] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  เข้าใจแล้ว
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= HISTORY / SAVED PROJECTS DRAWER ================= */}
      <AnimatePresence>
        {isHistoryOpen && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            className="fixed right-0 top-0 h-full w-80 sm:w-96 bg-white border-l border-[#E8E8E8] z-[60] p-6 overflow-y-auto custom-scrollbar shadow-2xl flex flex-col justify-between text-[#111111]"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
                <div>
                  <h3 className="text-sm font-extrabold text-[#111111] flex items-center gap-2">
                    <History size={16} />
                    <span>โปรเจกต์และไฟล์ที่จัดเก็บ ({state.history.length})</span>
                  </h3>
                  {user && (
                    <p className="text-[10px] text-[#36A66A] font-bold flex items-center gap-1 mt-0.5">
                      <Cloud size={11} />
                      <span>
                        {cloudSyncStatus === 'error'
                          ? cloudSyncError || 'ซิงค์ Firestore ไม่สำเร็จ'
                          : cloudSyncStatus === 'syncing'
                          ? 'กำลังซิงค์ข้อมูลกับ Firestore...'
                          : 'ซิงค์ข้อมูลกับ Firestore แล้ว'}
                      </span>
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsHistoryOpen(false)}
                  className="p-1.5 hover:bg-[#F4F4F4] rounded-full text-[#777777] hover:text-[#111111] transition cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="space-y-2.5 max-h-[75vh] overflow-y-auto custom-scrollbar pr-1">
                {state.history.length === 0 && (
                  <p className="text-[#777777] text-center py-10 text-xs">
                    ยังไม่มีโปรเจกต์เพลงที่บันทึกไว้
                  </p>
                )}
                {state.history.map((l) => (
                  <div
                    key={l.id}
                    className="p-3.5 rounded-2xl border border-[#E8E8E8] bg-[#F8F8F8] hover:bg-white hover:border-[#111111] transition cursor-pointer space-y-1 relative group"
                    onClick={() => {
                      setState(prev => ({ ...prev, currentLyric: l }));
                      setIsLyricModalOpen(true);
                      setIsHistoryOpen(false);
                    }}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-extrabold text-[#111111] truncate">{l.title}</h4>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTuneSong(l);
                          }}
                          className="p-1 text-[#777777] hover:text-[#111111] transition cursor-pointer"
                          title="นำไปปรับแต่งด้วย AI"
                        >
                          <SlidersHorizontal size={13} />
                        </button>
                        <button
                          onClick={(e) => deleteFromHistory(l.id, e)}
                          className="p-1 text-[#777777] hover:text-red-600 transition cursor-pointer"
                          title="ลบออก"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-[#777777]">
                      {l.input.genre} • {new Date(l.timestamp).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {state.history.length > 0 && (
              <button
                onClick={() => {
                  const idsToDelete = state.history.map((h) => h.id);
                  setState(prev => ({ ...prev, history: [], currentLyric: null }));
                  if (user) {
                    void clearUserSongs(user.uid, idsToDelete).catch((err) => {
                      setCloudSyncStatus('error');
                      setCloudSyncError(formatCloudError(err));
                    });
                  }
                }}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition cursor-pointer mt-4"
              >
                ล้างประวัติทั้งหมด
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <SongStyleModal
        isOpen={isStyleModalOpen}
        onClose={() => setIsStyleModalOpen(false)}
        onApplyStyle={handleApplyStyle}
      />

      <InspirationModal
        isOpen={isIdeasOpen}
        onClose={() => setIsIdeasOpen(false)}
        onApplyInspiration={handleApplyInspiration}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ViralKnowledgeModal
        isOpen={isViralModalOpen}
        onClose={() => setIsViralModalOpen(false)}
        onApplyCaseStudy={handleApplyViralCaseStudy}
        cloudKnowledgeItems={cloudKnowledgeVault}
        isUserLoggedIn={Boolean(user)}
        onSaveToCloudVault={
          user
            ? async (item) => {
                await saveKnowledgeVaultItem(user.uid, item);
              }
            : undefined
        }
      />
    </div>
  );
};

export default App;
