import React, { useState, useRef, useEffect } from 'react';
import { SongInput, Genre, SongLength, LanguageMode, EnglishMixRatio, SongwritingMode, GeneratedLyric, PresetSyncPayload, SunoModelTier } from '../types';
import { GENRE_GROUPS, MOOD_GROUPS, GENRES, MOODS, THEME_SUGGESTIONS, ARTIST_STYLES } from '../constants';
import { VIRAL_CASE_STUDIES, SUNO_V6_MODELS } from '../data/viralMusicKnowledge';
import { DEFAULT_STRUCTURE_SECTIONS } from '../services/songArchitectureRules';
import {
  Sparkles, Dices, Sliders, Check, X, Music, Lightbulb, Wand2,
  Upload, RefreshCw, SlidersHorizontal, Flame, Heart, Plus, ChevronDown, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LyricFormProps {
  onGenerate: (input: SongInput) => void;
  isGenerating: boolean;
  externalTheme?: string;
  selectedGenreTrigger?: string;
  externalPreset?: PresetSyncPayload | null;
  tuneSongData?: GeneratedLyric | null;
  onResetTune?: () => void;
  onOpenStyleModal?: () => void;
  onOpenInspirationModal?: () => void;
  onOpenViralModal?: () => void;
  selectedLanguage?: LanguageMode;
  englishMixRatio?: EnglishMixRatio;
  onLanguageChange?: (lang: LanguageMode) => void;
  onMixRatioChange?: (ratio: EnglishMixRatio) => void;
}

const TUNE_PRESET_INSTRUCTIONS = [
  'สแกนและแทนที่คำกวีเชยๆ ทั้งหมดด้วยภาษาพูดร่วมสมัย พร้อมแสดงตารางเปรียบเทียบคำเดิม -> คำใหม่',
  'ปรับบรรทัดแรกตามกฎ 7 วินาทีแรก (Stop-Scroll Hook) และตัดคำสปอยล์ฮุกออกจาก 2 บรรทัดท้ายของ Verse/Pre-Chorus (No Verse-Chorus Echo)',
  'จัดระเบียบแท็กช่องเสียง [Chest Voice]/[Belting], [Silence] กันเสียงร้องจม และ (Vocal Ad-libs) ตามไวยากรณ์ Suno v6',
  'ปรับคำท้ายวรรคท่อนฮุกให้เป็นเสียงสระเปิด และจัดสมมาตรพยางค์หรือสัมผัสเลือน/สัมผัสโอบ ABBA ให้เข้าปากนักร้อง',
  'เติมท่อนที่ขาดหาย และยกระดับ [Final Chorus] แบบ Arrangement Lift หรือ Intentional Lyric Variation ให้สมบูรณ์'
];

const SONGWRITING_MODE_OPTIONS: { id: SongwritingMode; label: string; desc: string }[] = [
  { id: 'auto', label: 'AI วิเคราะห์อัตโนมัติ (แนะนำ)', desc: 'เลือกโหมดตามแนวเพลงและอารมณ์' },
  { id: 'storytelling', label: 'Storytelling (เน้นเล่าเรื่อง)', desc: 'เดินเรื่อง 4 องก์ตามเส้นเวลาและฉากจริง' },
  { id: 'emotional', label: 'Emotional / Vibe (เน้นอารมณ์)', desc: 'ใช้ประสาทสัมผัสทั้ง 5 และช่องไฟดนตรี' },
  { id: 'hybrid', label: 'Hybrid (ผสมผสาน)', desc: 'เล่าเรื่องฉากจริงใน Verse + ฮุกอารมณ์กว้าง' },
];

const POPULAR_GENRE_CARDS = [
  { name: 'Pop', desc: 'จังหวะติดหู เข้าใจง่าย' },
  { name: 'R&B', desc: 'นุ่มละมุน มีอารมณ์' },
  { name: 'Hip-hop', desc: 'จังหวะหนัก เท่' },
  { name: 'T-Pop Dance', desc: 'ป๊อปแดนซ์ร่วมสมัย' },
  { name: 'Luk Thung', desc: 'ลูกทุ่งร่วมสมัย' },
  { name: 'Modern Trap', desc: 'บีททันสมัย ไหลลื่น' },
  { name: 'City Pop', desc: 'ซิตี้ป๊อปอบอุ่น' },
  { name: 'Indie Rock', desc: 'ดนตรีอิสระ มีสไตล์' },
];

const POPULAR_MOODS = [
  'เศร้า (Sad)',
  'อกหัก (Broken Heart)',
  'โหยหา (Nostalgic)',
  'คลั่งรัก (In Love)',
  'แอบรัก (Crush)',
  'อบอุ่น (Warm)',
  'สดใส (Bright)',
  'สบายๆ (Chill)',
];

const ALL_STRUCTURE_OPTIONS = [
  'อินโทร (Intro)',
  'เนื้อเพลงหลัก (Verse)',
  'พรีคอรัส (Pre-Chorus)',
  'คอรัส (Highlight)',
  'โพสต์คอรัส (Post-Chorus)',
  'บริดจ์ (Bridge)',
  'โซโล่ดนตรี (Instrumental Break)',
  'เอาท์โทร (Outro)'
];

export const LyricForm: React.FC<LyricFormProps> = ({
  onGenerate,
  isGenerating,
  externalTheme,
  selectedGenreTrigger,
  externalPreset,
  tuneSongData,
  onOpenStyleModal,
  onOpenInspirationModal,
  onOpenViralModal,
  selectedLanguage,
  englishMixRatio,
  onLanguageChange,
  onMixRatioChange
}) => {
  const [mode, setMode] = useState<'create' | 'tune' | 'complete'>('create');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showStructureMenu, setShowStructureMenu] = useState(false);
  const [showAllGenresModal, setShowAllGenresModal] = useState(false);
  const [activeGenreTab, setActiveGenreTab] = useState<string>('all');
  const [showAllMoodsModal, setShowAllMoodsModal] = useState(false);
  const [activeMoodTab, setActiveMoodTab] = useState<string>('all');
  const [keywordDraft, setKeywordDraft] = useState('');
  const [formValidationError, setFormValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState<SongInput>({
    title: '',
    artist: ARTIST_STYLES[0],
    genre: 'Pop, Hip-hop' as Genre,
    moods: ['สดใส (Bright)', 'มีความหวัง (Hopeful)'],
    length: '3-4 min' as SongLength,
    theme: externalTheme || 'ในวันที่เหนื่อยล้า ยังมีเสียงเพลงพาเราเดินต่อไปข้างหน้า',
    language: selectedLanguage || ('Thai Only' as LanguageMode),
    englishMixRatio: englishMixRatio || 25,
    songwritingMode: 'auto',
    keywords: [],
    vocalGender: 'Not specified',
    weirdness: 35,
    styleInfluence: 75,
    excludeStyles: '',
    mode: 'create',
    originalLyrics: '',
    instructions: TUNE_PRESET_INSTRUCTIONS[0],
    desiredOutcome: '',
    sunoModel: 'v6',
    structureSections: ['คอรัส (Highlight)', 'เนื้อเพลงหลัก (Verse)', 'พรีคอรัส (Pre-Chorus)', 'บริดจ์ (Bridge)'],
    customStylePrompt: ''
  });

  // Sync language & englishMixRatio from Left Sidebar card
  useEffect(() => {
    if (selectedLanguage) {
      setInput(prev => (prev.language !== selectedLanguage ? { ...prev, language: selectedLanguage } : prev));
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (englishMixRatio) {
      setInput(prev => (prev.englishMixRatio !== englishMixRatio ? { ...prev, englishMixRatio } : prev));
    }
  }, [englishMixRatio]);

  // Fix Critical Bug #1: Properly sync tuneSongData (GeneratedLyric) using .content and .input
  useEffect(() => {
    if (tuneSongData) {
      setMode('tune');
      setFormValidationError(null);
      const nextLang = tuneSongData.input?.language || input.language;
      const nextRatio = tuneSongData.input?.englishMixRatio || input.englishMixRatio || 25;
      onLanguageChange?.(nextLang);
      onMixRatioChange?.(nextRatio);
      setInput(prev => ({
        ...prev,
        mode: 'tune',
        originalLyrics: tuneSongData.content || prev.originalLyrics,
        title: tuneSongData.title ? `${tuneSongData.title} (Fine-Tuned)` : prev.title,
        genre: (tuneSongData.input?.genre || prev.genre) as Genre,
        moods: tuneSongData.input?.moods && tuneSongData.input.moods.length > 0
          ? tuneSongData.input.moods
          : prev.moods,
        artist: tuneSongData.input?.artist || prev.artist,
        vocalGender: tuneSongData.vocalGender || tuneSongData.input?.vocalGender || prev.vocalGender,
        length: tuneSongData.input?.length || prev.length,
        language: nextLang,
        englishMixRatio: nextRatio,
        weirdness: typeof tuneSongData.weirdness === 'number' ? tuneSongData.weirdness : prev.weirdness,
        styleInfluence: typeof tuneSongData.styleInfluence === 'number' ? tuneSongData.styleInfluence : prev.styleInfluence,
        excludeStyles: tuneSongData.excludeStyles || prev.excludeStyles,
        sunoModel: tuneSongData.sunoModelRecommended || tuneSongData.input?.sunoModel || prev.sunoModel,
        structureSections: tuneSongData.input?.structureSections || prev.structureSections
      }));
    }
  }, [tuneSongData]);

  // Fix Critical Bug #3: Sync full preset payload from Style Modal, Inspiration Modal, Viral Case Study Modal
  useEffect(() => {
    if (externalPreset) {
      setFormValidationError(null);
      if (externalPreset.mode) {
        setMode(externalPreset.mode);
      }
      if (externalPreset.language) {
        onLanguageChange?.(externalPreset.language);
      }
      if (externalPreset.englishMixRatio) {
        onMixRatioChange?.(externalPreset.englishMixRatio);
      }
      setInput(prev => ({
        ...prev,
        mode: externalPreset.mode || prev.mode,
        genre: (externalPreset.genre || prev.genre) as Genre,
        moods: externalPreset.moods && externalPreset.moods.length > 0 ? externalPreset.moods : prev.moods,
        artist: externalPreset.artist || prev.artist,
        theme: externalPreset.theme || prev.theme,
        language: externalPreset.language || prev.language,
        englishMixRatio: externalPreset.englishMixRatio || prev.englishMixRatio || 25,
        sunoModel: externalPreset.sunoModel || prev.sunoModel,
        weirdness: typeof externalPreset.weirdness === 'number' ? externalPreset.weirdness : prev.weirdness,
        styleInfluence: typeof externalPreset.styleInfluence === 'number' ? externalPreset.styleInfluence : prev.styleInfluence,
        customStylePrompt: externalPreset.customStylePrompt ?? prev.customStylePrompt,
        originalLyrics: externalPreset.originalLyrics ?? prev.originalLyrics
      }));
    }
  }, [externalPreset]);

  // Sync external theme string
  useEffect(() => {
    if (externalTheme) {
      setInput(prev => ({ ...prev, theme: externalTheme }));
    }
  }, [externalTheme]);

  // Sync genre trigger from sidebar
  useEffect(() => {
    if (selectedGenreTrigger) {
      const cleanGenre = selectedGenreTrigger.split('::')[0].trim();
      if (cleanGenre) {
        setInput(prev => {
          const current = prev.genre
            ? prev.genre.split(', ').map(s => s.trim()).filter(Boolean)
            : [];
          if (!current.includes(cleanGenre)) {
            const next = [...current, cleanGenre];
            return { ...prev, genre: next.join(', ') as Genre };
          }
          return prev;
        });
      }
    }
  }, [selectedGenreTrigger]);

  const selectedGenresArray = input.genre
    ? input.genre.split(', ').map(s => s.trim()).filter(Boolean)
    : [];

  const toggleGenre = (genreName: string) => {
    let current = [...selectedGenresArray];
    if (current.includes(genreName)) {
      current = current.filter(g => g !== genreName);
    } else {
      current.push(genreName);
    }
    const newGenreString = current.length > 0 ? current.join(', ') : 'Pop';
    setInput(prev => ({ ...prev, genre: newGenreString as Genre }));
  };

  const toggleMood = (moodName: string) => {
    setInput(prev => {
      const current = [...prev.moods];
      if (current.includes(moodName)) {
        const filtered = current.filter(m => m !== moodName);
        return { ...prev, moods: filtered };
      } else {
        return { ...prev, moods: [...current, moodName] };
      }
    });
  };

  const toggleStructureSection = (sectionName: string) => {
    setInput(prev => {
      const current = prev.structureSections || DEFAULT_STRUCTURE_SECTIONS;
      if (current.includes(sectionName)) {
        const next = current.filter(s => s !== sectionName);
        return { ...prev, structureSections: next.length > 0 ? next : ['เนื้อเพลงหลัก (Verse)', 'คอรัส (Highlight)'] };
      } else {
        return { ...prev, structureSections: [...current, sectionName] };
      }
    });
  };

  const handleAddKeyword = () => {
    const trimmed = keywordDraft.trim();
    if (!trimmed) return;
    if (!input.keywords.includes(trimmed)) {
      setInput(prev => ({ ...prev, keywords: [...prev.keywords, trimmed] }));
    }
    setKeywordDraft('');
  };

  const handleRemoveKeyword = (kw: string) => {
    setInput(prev => ({ ...prev, keywords: prev.keywords.filter(k => k !== kw) }));
  };

  const handleRandomTheme = () => {
    const random = THEME_SUGGESTIONS[Math.floor(Math.random() * THEME_SUGGESTIONS.length)];
    setInput(prev => ({ ...prev, theme: random }));
  };

  const handleApplyViralFormula = (studyId: string) => {
    const study = VIRAL_CASE_STUDIES.find(s => s.id === studyId);
    if (!study) return;
    const viralMoodMap: Record<string, string[]> = {
      'case-die-with-a-smile': ['โรแมนติก (Romantic)', 'โหยหา (Nostalgic)', 'อบอุ่น (Warm)'],
      'case-birds-of-a-feather': ['ชวนฝัน (Ethereal)', 'คลั่งรัก (In Love)', 'นุ่มนวล (Gentle)'],
      'case-apt': ['สนุกสนาน (Energetic)', 'ติดหู (Catchy)', 'ตื่นเต้น (Excited)'],
      'case-back-to-friends': ['โหยหา (Nostalgic)', 'เสียดาย (Regretful)', 'ลืมไม่ลง (Unforgettable)'],
      'case-pretty-little-baby': ['อบอุ่น (Warm)', 'ใจฟู (Heart-warming)', 'วินเทจ (Vintage)'],
    };
    setInput(prev => ({
      ...prev,
      genre: study.genre.split('/')[0].trim() as Genre,
      moods: viralMoodMap[studyId] || prev.moods,
      theme: `${study.title} Style (${study.emotionalAtmosphere}): ${study.thaiApplicationStrategy}`,
      weirdness: study.recommendedSliders.weirdness,
      styleInfluence: study.recommendedSliders.styleInfluence,
      artist: study.artist,
      sunoModel: study.recommendedSunoModel,
      customStylePrompt: study.samplePrompt,
      viralFormulaId: study.id
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setInput(prev => ({ ...prev, originalLyrics: text }));
          setFormValidationError(null);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormValidationError(null);

    if ((mode === 'tune' || mode === 'complete') && (!input.originalLyrics || !input.originalLyrics.trim()) && (!input.theme || !input.theme.trim())) {
      setFormValidationError('กรุณาวางเนื้อเพลงเดิมหรือระบุท่อนเพลงตั้งต้นที่ต้องการให้ระบบปรับแต่ง/รีมิกซ์');
      return;
    }

    const finalMoods = input.moods.length > 0 ? input.moods : ['สดใส (Bright)'];
    const finalGenre = selectedGenresArray.length > 0 ? selectedGenresArray.join(', ') : 'Pop';

    onGenerate({
      ...input,
      genre: finalGenre as Genre,
      moods: finalMoods,
      mode,
      sunoModel: input.sunoModel || 'v6'
    });
  };

  const currentSunoModel = input.sunoModel || 'v6';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* 3-TAB MODE NAVIGATION BAR (Matches Reference Design) */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => {
            setMode('create');
            setFormValidationError(null);
            setInput(prev => ({ ...prev, mode: 'create' }));
          }}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
            mode === 'create'
              ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
              : 'bg-white text-[#111111] border-[#E8E8E8] hover:border-[#BDBDBD]'
          }`}
        >
          <Sparkles size={14} className={mode === 'create' ? 'text-white' : 'text-[#111111]'} />
          <span className="truncate">สร้างเพลงด้วย Prompt</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('tune');
            setFormValidationError(null);
            setInput(prev => ({ ...prev, mode: 'tune' }));
          }}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
            mode === 'tune'
              ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
              : 'bg-white text-[#111111] border-[#E8E8E8] hover:border-[#BDBDBD]'
          }`}
        >
          <SlidersHorizontal size={14} />
          <span className="truncate">ปรับแต่งเพลง (Fine-Tune)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('complete');
            setFormValidationError(null);
            setInput(prev => ({ ...prev, mode: 'complete' }));
          }}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
            mode === 'complete'
              ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
              : 'bg-white text-[#111111] border-[#E8E8E8] hover:border-[#BDBDBD]'
          }`}
        >
          <RefreshCw size={13} />
          <span className="truncate">รีมิกซ์ / Remaster</span>
        </button>
      </div>

      {formValidationError && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center justify-between">
          <span>⚠️ {formValidationError}</span>
          <button type="button" onClick={() => setFormValidationError(null)} className="text-red-500 hover:text-red-800 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ================= STEP 1: GENRE & MULTI-MOOD SELECTOR ================= */}
      <div className="bg-white border border-[#E8E8E8] p-3.5 rounded-2xl space-y-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        {/* Step 1 Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#111111] text-white flex items-center justify-center text-[11px] font-bold">
              1
            </span>
            <h3 className="text-xs font-bold text-[#111111]">
              เลือกประเภทเพลง และอารมณ์ที่ต้องการ
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAllGenresModal(true)}
            className="text-[11px] text-[#555555] hover:text-[#111111] transition cursor-pointer font-semibold flex items-center gap-1"
          >
            <Flame size={12} className="text-[#555555]" />
            <span>คู่แนะนำยอดนิยม ({GENRES.length})</span>
          </button>
        </div>

        {/* Selected Genre Chips Bar */}
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#F4F4F4] border border-[#E8E8E8] rounded-xl items-center">
          {selectedGenresArray.map(g => (
            <span
              key={g}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white text-[#111111] border border-[#E8E8E8] shadow-xs"
            >
              <span>{g}</span>
              <button
                type="button"
                onClick={() => toggleGenre(g)}
                className="text-[#777777] hover:text-[#111111] transition cursor-pointer"
                title="ลบแนวเพลงนี้"
              >
                <X size={11} />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => setShowAllGenresModal(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#555555] hover:text-[#111111] hover:bg-white/80 transition cursor-pointer"
          >
            <Plus size={12} />
            <span>เพิ่มแนวเพลง</span>
          </button>
        </div>

        {/* 8-Card Popular Genre Grid (Matches Reference Image) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {POPULAR_GENRE_CARDS.map(item => {
            const isSelected = selectedGenresArray.includes(item.name);
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => toggleGenre(item.name)}
                className={`p-2.5 rounded-xl text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-2 border-[#111111] text-[#111111] shadow-xs'
                    : 'bg-[#F8F8F8] border border-[#E8E8E8] text-[#111111] hover:bg-white hover:border-[#BDBDBD]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold truncate">{item.name}</span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0">
                      <Check size={10} strokeWidth={3} />
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#777777] mt-0.5 truncate">{item.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Multi-Mood Selector Compact Bar */}
        <div className="pt-1.5 border-t border-[#E8E8E8] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#111111] flex items-center gap-1.5">
              <Heart size={12} className="text-[#111111]" />
              <span>อารมณ์ที่ต้องการสื่อ (เลือกได้มากกว่า 1):</span>
            </span>
            <button
              type="button"
              onClick={() => setShowAllMoodsModal(true)}
              className="text-[11px] text-[#555555] hover:text-[#111111] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>+ ดูครบทุกหมวดหมู่ ({MOODS.length})</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#F4F4F4] border border-[#E8E8E8] rounded-xl items-center">
            {input.moods.map(mood => (
              <span
                key={mood}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#111111] text-white shadow-xs"
              >
                <span>{mood.split(' (')[0]}</span>
                <button
                  type="button"
                  onClick={() => toggleMood(mood)}
                  className="text-white/70 hover:text-white transition cursor-pointer"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
            {POPULAR_MOODS.filter(m => !input.moods.includes(m)).slice(0, 5).map(mood => (
              <button
                key={mood}
                type="button"
                onClick={() => toggleMood(mood)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white text-[#555555] border border-[#E8E8E8] hover:border-[#111111] hover:text-[#111111] transition cursor-pointer"
              >
                <Plus size={10} />
                <span>{mood.split(' (')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= STEP 2: STRUCTURE & THEME / FINE-TUNE DETAILS ================= */}
      <div className="bg-white border border-[#E8E8E8] p-3.5 rounded-2xl space-y-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#111111] text-white flex items-center justify-center text-[11px] font-bold">
              2
            </span>
            <h3 className="text-xs font-bold text-[#111111]">
              รายละเอียดโครงสร้าง & เนื้อหาเพลง (เลือกได้มากกว่า 1)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAllMoodsModal(true)}
            className="text-[11px] text-[#555555] hover:text-[#111111] transition cursor-pointer font-semibold flex items-center gap-1"
          >
            <Heart size={12} className="text-[#555555]" />
            <span>คู่ผสมยอดนิยม ({MOODS.length})</span>
          </button>
        </div>

        {/* Structure Chips Bar (Matches Reference Image Step 2) */}
        <div className="relative">
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#F4F4F4] border border-[#E8E8E8] rounded-xl items-center">
            {(input.structureSections || DEFAULT_STRUCTURE_SECTIONS).map(sec => (
              <span
                key={sec}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white text-[#111111] border border-[#E8E8E8] shadow-xs"
              >
                <span>{sec}</span>
                <button
                  type="button"
                  onClick={() => toggleStructureSection(sec)}
                  className="text-[#777777] hover:text-[#111111] transition cursor-pointer"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => setShowStructureMenu(!showStructureMenu)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#555555] hover:text-[#111111] hover:bg-white transition cursor-pointer"
            >
              <Plus size={12} />
              <span>เพิ่มส่วน</span>
            </button>
          </div>

          {showStructureMenu && (
            <div className="mt-1.5 p-2 bg-white border border-[#E8E8E8] rounded-xl shadow-lg flex flex-wrap gap-1.5 z-20">
              {ALL_STRUCTURE_OPTIONS.map(sec => {
                const active = (input.structureSections || []).includes(sec);
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => toggleStructureSection(sec)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer flex items-center gap-1 ${
                      active
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-[#F8F8F8] text-[#555555] border-[#E8E8E8] hover:border-[#111111]'
                    }`}
                  >
                    <span>{sec}</span>
                    {active && <Check size={10} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Songwriting Architecture Mode Selector (Auto / Storytelling / Emotional-Vibe / Hybrid) */}
        <div className="pt-1 border-t border-[#E8E8E8] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#111111] flex items-center gap-1.5">
              <BookOpen size={12} className="text-[#111111]" />
              <span>โหมดสถาปัตยกรรมการแต่งเพลง (Hitmaker Mode):</span>
            </span>
            <span className="text-[10px] text-[#777777] font-medium">
              {SONGWRITING_MODE_OPTIONS.find(m => m.id === (input.songwritingMode || 'auto'))?.desc}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {SONGWRITING_MODE_OPTIONS.map(opt => {
              const isSelected = (input.songwritingMode || 'auto') === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setInput(prev => ({ ...prev, songwritingMode: opt.id }))}
                  className={`py-1.5 px-2 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                      : 'bg-[#F8F8F8] text-[#111111] border-[#E8E8E8] hover:bg-white hover:border-[#BDBDBD]'
                  }`}
                >
                  <span className="text-[10px] font-extrabold truncate">{opt.label}</span>
                  <span className={`text-[9px] truncate mt-0.5 ${isSelected ? 'text-white/75' : 'text-[#777777]'}`}>
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode-specific Content Input */}
        {mode === 'create' ? (
          <div className="space-y-2">
            <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-2.5 focus-within:border-[#111111] focus-within:bg-white transition">
              <textarea
                value={input.theme}
                onChange={e => setInput(prev => ({ ...prev, theme: e.target.value }))}
                placeholder="พิมพ์เรื่องราว เหตุการณ์ หรือความรู้สึกที่ต้องการสื่อ... (ระบบจะเปิดด้วยกฎ 7 วินาทีแรก ใช้ภาษาพูดร่วมสมัย ปลอดคำกวีโบราณ 100%)"
                rows={2}
                className="w-full bg-transparent text-[#111111] text-xs font-medium leading-relaxed border-none outline-none resize-none placeholder:text-[#777777]"
              />
              <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1.5 border-t border-[#E8E8E8]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={handleRandomTheme}
                    className="text-[10px] font-semibold text-[#555555] hover:text-[#111111] bg-white px-2 py-0.5 rounded-lg border border-[#E8E8E8] flex items-center gap-1 cursor-pointer"
                  >
                    <Dices size={11} />
                    <span>สุ่มหัวข้อ</span>
                  </button>
                  {onOpenInspirationModal && (
                    <button
                      type="button"
                      onClick={onOpenInspirationModal}
                      className="text-[10px] font-semibold text-[#555555] hover:text-[#111111] bg-white px-2 py-0.5 rounded-lg border border-[#E8E8E8] flex items-center gap-1 cursor-pointer"
                    >
                      <Lightbulb size={11} />
                      <span>120 ไอเดีย</span>
                    </button>
                  )}
                  {onOpenStyleModal && (
                    <button
                      type="button"
                      onClick={onOpenStyleModal}
                      className="text-[10px] font-semibold text-[#555555] hover:text-[#111111] bg-white px-2 py-0.5 rounded-lg border border-[#E8E8E8] flex items-center gap-1 cursor-pointer"
                    >
                      <Wand2 size={11} />
                      <span>120 สไตล์</span>
                    </button>
                  )}
                  {onOpenViralModal && (
                    <button
                      type="button"
                      onClick={onOpenViralModal}
                      className="text-[10px] font-semibold text-[#555555] hover:text-[#111111] bg-white px-2 py-0.5 rounded-lg border border-[#E8E8E8] flex items-center gap-1 cursor-pointer"
                    >
                      <Flame size={11} />
                      <span>5 สูตรเพลงฮิต</span>
                    </button>
                  )}
                </div>

                {/* Language Quick Pills & Mix Ratio */}
                <div className="flex flex-wrap items-center gap-1">
                  {[
                    { id: 'Thai Only', label: 'ไทย' },
                    { id: 'Thai-English Mix', label: 'ไทย-อังกฤษ' },
                    { id: 'English Only', label: 'อังกฤษ' },
                  ].map(lang => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => {
                        const nextLang = lang.id as LanguageMode;
                        setInput(prev => ({ ...prev, language: nextLang }));
                        onLanguageChange?.(nextLang);
                      }}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                        input.language === lang.id
                          ? 'bg-[#111111] text-white'
                          : 'bg-white text-[#777777] border border-[#E8E8E8] hover:text-[#111111]'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}

                  {input.language === 'Thai-English Mix' && (
                    <div className="flex items-center gap-0.5 pl-1 border-l border-[#E8E8E8]">
                      {([25, 50, 75] as EnglishMixRatio[]).map(ratio => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => {
                            setInput(prev => ({ ...prev, englishMixRatio: ratio }));
                            onMixRatioChange?.(ratio);
                          }}
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                            (input.englishMixRatio || 25) === ratio
                              ? 'bg-[#111111] text-white'
                              : 'bg-white text-[#777777] border border-[#E8E8E8] hover:text-[#111111]'
                          }`}
                          title={`ผสม ไทย ${100 - ratio}% · อังกฤษ ${ratio}%`}
                        >
                          {ratio}%
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* FINE-TUNE ('tune') & REMIX/REMASTER ('complete') DUAL INPUT WORKFLOW */
          <div className="space-y-3 pt-1">
            {/* Box 1: ช่องใส่เนื้อเพลงเดิม (Original Lyrics Input) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#111111] flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#111111] text-white text-[10px] font-bold flex items-center justify-center">
                    ก
                  </span>
                  <span>
                    {mode === 'tune'
                      ? 'ช่องใส่เนื้อเพลงเดิม (Original Lyrics ที่ต้องการนำมาปรับแต่ง):'
                      : 'ช่องใส่เนื้อเพลง / ดราฟต์ตั้งต้นที่ต้องการรีมิกซ์:'}
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".txt,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] font-semibold text-[#111111] bg-[#F4F4F4] hover:bg-[#E8E8E8] px-2.5 py-1 rounded-lg border border-[#E8E8E8] flex items-center gap-1 cursor-pointer"
                  >
                    <Upload size={11} />
                    <span>อัปโหลดไฟล์ .txt</span>
                  </button>
                  {input.originalLyrics && (
                    <button
                      type="button"
                      onClick={() => setInput(prev => ({ ...prev, originalLyrics: '' }))}
                      className="text-[10px] text-red-600 hover:underline font-semibold cursor-pointer"
                    >
                      ล้างเนื้อเพลง
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={input.originalLyrics || ''}
                onChange={e => setInput(prev => ({ ...prev, originalLyrics: e.target.value }))}
                placeholder="วางเนื้อเพลงเดิมของคุณที่นี่... ระบบจะสแกนหาคำกวีล้าสมัย แปลงเป็นภาษาพูดร่วมสมัยที่เข้าปาก และจัดระเบียบแท็ก [] กับ () สำหรับ Suno v6"
                rows={3}
                className="w-full bg-[#F8F8F8] border border-[#E8E8E8] focus:border-[#111111] focus:bg-white rounded-xl p-2.5 text-xs text-[#111111] font-mono leading-relaxed outline-none resize-y"
              />
            </div>

            {/* Box 2: ช่องใส่ผลลัพธ์ที่ต้องการ (Desired Outcome & Target Direction Input) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#111111] flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#111111] text-white text-[10px] font-bold flex items-center justify-center">
                    ข
                  </span>
                  <span>ช่องใส่ผลลัพธ์ที่ต้องการ (Desired Outcome &amp; โจทย์การปรับแก้):</span>
                </span>
                {input.desiredOutcome && (
                  <button
                    type="button"
                    onClick={() => setInput(prev => ({ ...prev, desiredOutcome: '' }))}
                    className="text-[10px] text-[#777777] hover:text-[#111111] font-semibold cursor-pointer"
                  >
                    ล้างคำสั่ง
                  </button>
                )}
              </div>

              <textarea
                value={input.desiredOutcome || ''}
                onChange={e => setInput(prev => ({ ...prev, desiredOutcome: e.target.value }))}
                placeholder="ระบุผลลัพธ์ที่ต้องการ เช่น อยากให้แก้คำกวีเชยๆ ออกทั้งหมด ปรับท่อนฮุกให้ติดหูเอาไปตั้งแคปชันได้ เปลี่ยนอารมณ์ให้เป็น R&B ตอนขับรถกลางคืน หรือเพิ่มท่อน Bridge..."
                rows={2}
                className="w-full bg-[#F8F8F8] border border-[#E8E8E8] focus:border-[#111111] focus:bg-white rounded-xl p-2.5 text-xs text-[#111111] font-medium leading-relaxed outline-none resize-y"
              />

              <div className="space-y-1">
                <span className="text-[10px] text-[#777777] font-semibold block">
                  คลิกตัวช่วยด้านล่างเพื่อกำหนดหรือเติมผลลัพธ์ที่ต้องการ:
                </span>
                <div className="flex flex-wrap gap-1">
                  {TUNE_PRESET_INSTRUCTIONS.map(instr => {
                    const isSelected = input.instructions === instr || (input.desiredOutcome || '').includes(instr);
                    return (
                      <button
                        key={instr}
                        type="button"
                        onClick={() =>
                          setInput(prev => {
                            const currentOutcome = (prev.desiredOutcome || '').trim();
                            const nextOutcome = currentOutcome
                              ? currentOutcome.includes(instr)
                                ? currentOutcome
                                : `${currentOutcome} | ${instr}`
                              : instr;
                            return { ...prev, instructions: instr, desiredOutcome: nextOutcome };
                          })
                        }
                        className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#111111] text-white'
                            : 'bg-[#F4F4F4] text-[#555555] hover:text-[#111111] border border-[#E8E8E8]'
                        }`}
                      >
                        + {instr}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= STEP 3: SUNO MODEL & VERSION SETTINGS ================= */}
      <div className="bg-white border border-[#E8E8E8] p-3.5 rounded-2xl space-y-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#111111] text-white flex items-center justify-center text-[11px] font-bold">
              3
            </span>
            <h3 className="text-xs font-bold text-[#111111]">
              ตั้งค่าโมเดลและเวอร์ชัน Suno
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[11px] text-[#555555] hover:text-[#111111] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Sliders size={12} />
            <span>{showAdvanced ? 'ซ่อนพารามิเตอร์ละเอียด' : 'ตั้งค่าเสียงร้อง & สไลเดอร์'}</span>
          </button>
        </div>

        {/* 3-Card Model & Quality Row (Matches Reference Image Step 3) */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'v6' as SunoModelTier, label: 'เวอร์ชัน', title: 'v6', sub: 'แนะนำล่าสุด' },
            { id: 'v6-wild' as SunoModelTier, label: 'คุณภาพ', title: 'v6-wild', sub: 'คมชัด รายละเอียดสูง' },
            { id: 'v6-mini' as SunoModelTier, label: 'ความยาว', title: 'v6-mini', sub: 'เร็ว ประหยัดทรัพยากร' },
          ].map(card => {
            const isSelected = currentSunoModel === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setInput(prev => ({ ...prev, sunoModel: card.id }))}
                className={`p-2.5 rounded-xl text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-2 border-[#111111] text-[#111111] shadow-xs'
                    : 'bg-[#F8F8F8] border border-[#E8E8E8] text-[#111111] hover:bg-white hover:border-[#BDBDBD]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] text-[#777777] font-semibold">{card.label}</span>
                  <ChevronDown size={12} className="text-[#777777]" />
                </div>
                <div className="text-sm font-extrabold text-[#111111] leading-tight my-0.5">
                  {card.title}
                </div>
                <span className="text-[10px] text-[#777777] truncate w-full">{card.sub}</span>
              </button>
            );
          })}
        </div>

        {/* Expanded Vocal, Length, Keywords, Weirdness, Style Influence & Exclude Controls */}
        {showAdvanced && (
          <div className="p-3 bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Vocal Character */}
              <div>
                <label className="text-[10px] font-bold text-[#555555] block mb-1">คาแรกเตอร์เสียงร้อง (Artist Style)</label>
                <select
                  value={input.artist}
                  onChange={e => setInput(prev => ({ ...prev, artist: e.target.value }))}
                  className="w-full bg-white border border-[#E8E8E8] rounded-lg px-2.5 py-1.5 text-xs text-[#111111] font-medium outline-none focus:border-[#111111]"
                >
                  {ARTIST_STYLES.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              {/* Vocal Gender */}
              <div>
                <label className="text-[10px] font-bold text-[#555555] block mb-1">เพศนักร้อง (Vocal Gender)</label>
                <select
                  value={input.vocalGender || 'Not specified'}
                  onChange={e => setInput(prev => ({ ...prev, vocalGender: e.target.value }))}
                  className="w-full bg-white border border-[#E8E8E8] rounded-lg px-2.5 py-1.5 text-xs text-[#111111] font-medium outline-none focus:border-[#111111]"
                >
                  <option value="Not specified">อัตโนมัติ (ตามแนวเพลง)</option>
                  <option value="Male">เสียงร้องชาย (Male Vocal)</option>
                  <option value="Female">เสียงร้องหญิง (Female Vocal)</option>
                  <option value="Duet">ร้องคู่ ชาย-หญิง (Duet)</option>
                  <option value="Group">ร้องกลุ่ม / แบรนด์ (Group)</option>
                </select>
              </div>

              {/* Song Length */}
              <div>
                <label className="text-[10px] font-bold text-[#555555] block mb-1">ความยาวเพลง (Song Length)</label>
                <select
                  value={input.length}
                  onChange={e => setInput(prev => ({ ...prev, length: e.target.value as SongLength }))}
                  className="w-full bg-white border border-[#E8E8E8] rounded-lg px-2.5 py-1.5 text-xs text-[#111111] font-medium outline-none focus:border-[#111111]"
                >
                  <option value="2-3 min">2–3 นาที (กระชับ ไวรัล)</option>
                  <option value="3-4 min">3–4 นาที (มาตรฐานซิงเกิล)</option>
                  <option value="4-5 min">4–5 นาที (Full Arrangement)</option>
                </select>
              </div>
            </div>

            {/* Song Title & Keywords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-[#555555] block mb-1">ชื่อเพลงที่ต้องการ (เว้นว่างให้ AI ตั้งให้ได้)</label>
                <input
                  type="text"
                  value={input.title || ''}
                  onChange={e => setInput(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="ระบุชื่อเพลง (ถ้ามี)..."
                  className="w-full bg-white border border-[#E8E8E8] rounded-lg px-2.5 py-1.5 text-xs text-[#111111] outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#555555] block mb-1">คำสำคัญที่ต้องมีในเนื้อเพลง (Keywords)</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={keywordDraft}
                    onChange={e => setKeywordDraft(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    placeholder="พิมพ์คำสำคัญแล้วกด +"
                    className="flex-1 bg-white border border-[#E8E8E8] rounded-lg px-2.5 py-1.5 text-xs text-[#111111] outline-none focus:border-[#111111]"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="px-2.5 py-1.5 bg-[#111111] text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
                {input.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {input.keywords.map(kw => (
                      <span key={kw} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-[#E8E8E8] text-[10px] font-semibold">
                        <span>{kw}</span>
                        <button type="button" onClick={() => handleRemoveKeyword(kw)} className="text-[#777777] hover:text-[#111111]">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sliders: Weirdness & Style Influence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#555555] font-semibold">Weirdness (ความแปลกใหม่):</span>
                  <span className="font-mono font-bold text-[#111111]">{input.weirdness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={input.weirdness ?? 35}
                  onChange={e => setInput(prev => ({ ...prev, weirdness: parseInt(e.target.value) }))}
                  className="w-full accent-[#111111] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#555555] font-semibold">Style Influence (ความยึดโยงสไตล์):</span>
                  <span className="font-mono font-bold text-[#111111]">{input.styleInfluence}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={input.styleInfluence ?? 75}
                  onChange={e => setInput(prev => ({ ...prev, styleInfluence: parseInt(e.target.value) }))}
                  className="w-full accent-[#111111] cursor-pointer"
                />
              </div>
            </div>

            {/* Exclude Styles */}
            <div>
              <label className="text-[10px] font-bold text-[#555555] block mb-1">
                Exclude Styles (สไตล์เสียงที่ไม่ต้องการ — เว้นว่างให้ระบบตั้งตามแนวเพลงอัตโนมัติ)
              </label>
              <input
                type="text"
                value={input.excludeStyles || ''}
                onChange={e => setInput(prev => ({ ...prev, excludeStyles: e.target.value }))}
                placeholder="เช่น screaming, harsh distortion, muddy mix, robotic voice"
                className="w-full bg-white border border-[#E8E8E8] rounded-lg px-2.5 py-1.5 text-xs text-[#111111] font-mono outline-none focus:border-[#111111]"
              />
            </div>

            {/* Viral Formula Quick Selector */}
            <div className="pt-1 border-t border-[#E8E8E8]">
              <span className="text-[10px] font-bold text-[#555555] block mb-1">
                สูตรโครงสร้างเพลงไวรัล (คลิกเพื่อใช้ค่าพารามิเตอร์ต้นแบบ):
              </span>
              <div className="flex flex-wrap gap-1">
                {VIRAL_CASE_STUDIES.map(vf => (
                  <button
                    key={vf.id}
                    type="button"
                    onClick={() => handleApplyViralFormula(vf.id)}
                    className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-white hover:bg-[#111111] text-[#111111] hover:text-white border border-[#E8E8E8] transition cursor-pointer"
                  >
                    {vf.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Primary CTA Button (Matches Reference Image) */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-3.5 px-4 rounded-2xl neurova-btn-primary font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw size={16} className="animate-spin text-white" />
              <span>กำลังแต่งเนื้อร้องร่วมสมัย & ประกอบ Prompt สำหรับ Suno {currentSunoModel}...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} className="text-white fill-white" />
              <span>
                {mode === 'tune'
                  ? `ปรับแต่งเนื้อร้อง & โครงสร้างด้วย Suno ${currentSunoModel}`
                  : mode === 'complete'
                  ? `รีมิกซ์ & ขยายโครงสร้างเพลงด้วย Suno ${currentSunoModel}`
                  : `สร้างเพลงเลยด้วย Suno ${currentSunoModel}`}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Modal: Select All Genres */}
      <AnimatePresence>
        {showAllGenresModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white border border-[#E8E8E8] rounded-3xl w-full max-w-2xl p-5 space-y-4 shadow-2xl max-h-[88vh] flex flex-col text-[#111111]"
            >
              <div className="flex justify-between items-center border-b border-[#E8E8E8] pb-3 shrink-0">
                <div>
                  <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                    <Music size={16} />
                    <span>เลือกแนวเพลงทั้งหมด ({GENRES.length} แนวเพลง)</span>
                  </h3>
                  <p className="text-[11px] text-[#777777]">เลือกผสมได้มากกว่า 1 แนวเพื่อกำหนดทิศทางดนตรีและกฎการเขียนเนื้อเพลง</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllGenresModal(false)}
                  className="p-1.5 text-[#777777] hover:text-[#111111] rounded-full hover:bg-[#F4F4F4] transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex gap-1.5 overflow-x-auto custom-scrollbar pb-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveGenreTab('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    activeGenreTab === 'all'
                      ? 'bg-[#111111] text-white'
                      : 'bg-[#F4F4F4] text-[#555555] hover:text-[#111111]'
                  }`}
                >
                  ทั้งหมด ({GENRES.length})
                </button>
                {GENRE_GROUPS.map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setActiveGenreTab(g.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                      activeGenreTab === g.id
                        ? 'bg-[#111111] text-white'
                        : 'bg-[#F4F4F4] text-[#555555] hover:text-[#111111]'
                    }`}
                  >
                    <span>{g.icon}</span>
                    <span>{g.categoryName.split('&')[0]}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-3 overflow-y-auto custom-scrollbar p-1 flex-1">
                {GENRE_GROUPS.filter(g => activeGenreTab === 'all' || activeGenreTab === g.id).map(group => (
                  <div key={group.id} className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                        <span>{group.icon}</span>
                        <span>{group.categoryName}</span>
                      </h4>
                      <span className="text-[10px] text-[#777777]">{group.description}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {group.items.map(g => {
                        const isSelected = selectedGenresArray.includes(g);
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => toggleGenre(g)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border text-left transition flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-[#111111] border-[#111111] text-white shadow-xs'
                                : 'bg-white border-[#E8E8E8] text-[#111111] hover:border-[#BDBDBD]'
                            }`}
                          >
                            <span className="truncate">{g}</span>
                            {isSelected && <Check size={13} className="text-white shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[#E8E8E8] shrink-0">
                <span className="text-xs text-[#777777] font-medium">เลือกแล้ว: {selectedGenresArray.length} แนวเพลง</span>
                <button
                  type="button"
                  onClick={() => setShowAllGenresModal(false)}
                  className="px-5 py-2 bg-[#111111] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  เสร็จสิ้น
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Select All Moods (Multi-Select) */}
      <AnimatePresence>
        {showAllMoodsModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white border border-[#E8E8E8] rounded-3xl w-full max-w-2xl p-5 space-y-4 shadow-2xl max-h-[88vh] flex flex-col text-[#111111]"
            >
              <div className="flex justify-between items-center border-b border-[#E8E8E8] pb-3 shrink-0">
                <div>
                  <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                    <Heart size={16} />
                    <span>เลือกอารมณ์ที่ต้องการสื่อ (เลือกได้มากกว่า 1 อารมณ์)</span>
                  </h3>
                  <p className="text-[11px] text-[#777777]">ผสมผสานหลายอารมณ์เพื่อให้ AI กำหนดทิศทางคำร้องและซาวด์ดนตรีให้มีมิติ</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllMoodsModal(false)}
                  className="p-1.5 text-[#777777] hover:text-[#111111] rounded-full hover:bg-[#F4F4F4] transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#F4F4F4] border border-[#E8E8E8] rounded-xl shrink-0 max-h-24 overflow-y-auto custom-scrollbar items-center">
                {input.moods.length === 0 ? (
                  <span className="text-[11px] text-[#777777] italic">คลิกเลือกอารมณ์ด้านล่างได้มากกว่า 1 รายการ</span>
                ) : (
                  input.moods.map(mood => (
                    <span
                      key={mood}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#111111] text-white"
                    >
                      <span>{mood}</span>
                      <button
                        type="button"
                        onClick={() => toggleMood(mood)}
                        className="text-white/70 hover:text-white transition ml-0.5 cursor-pointer"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))
                )}
              </div>

              <div className="flex gap-1.5 overflow-x-auto custom-scrollbar pb-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveMoodTab('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    activeMoodTab === 'all'
                      ? 'bg-[#111111] text-white'
                      : 'bg-[#F4F4F4] text-[#555555] hover:text-[#111111]'
                  }`}
                >
                  ทั้งหมด ({MOODS.length})
                </button>
                {MOOD_GROUPS.map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setActiveMoodTab(g.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                      activeMoodTab === g.id
                        ? 'bg-[#111111] text-white'
                        : 'bg-[#F4F4F4] text-[#555555] hover:text-[#111111]'
                    }`}
                  >
                    <span>{g.icon}</span>
                    <span>{g.categoryName.split('&')[0]}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-3 overflow-y-auto custom-scrollbar p-1 flex-1">
                {MOOD_GROUPS.filter(g => activeMoodTab === 'all' || activeMoodTab === g.id).map(group => (
                  <div key={group.id} className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                        <span>{group.icon}</span>
                        <span>{group.categoryName}</span>
                      </h4>
                      <span className="text-[10px] text-[#777777]">{group.description}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {group.items.map(m => {
                        const isSelected = input.moods.includes(m);
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => toggleMood(m)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border text-left transition flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-[#111111] border-[#111111] text-white shadow-xs'
                                : 'bg-white border-[#E8E8E8] text-[#111111] hover:border-[#BDBDBD]'
                            }`}
                          >
                            <span className="truncate">{m}</span>
                            {isSelected && <Check size={13} className="text-white shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[#E8E8E8] shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#777777] font-medium">เลือกแล้ว: {input.moods.length} อารมณ์</span>
                  {input.moods.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setInput(prev => ({ ...prev, moods: [] }))}
                      className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                    >
                      ล้างทั้งหมด
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllMoodsModal(false)}
                  className="px-5 py-2 bg-[#111111] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  เสร็จสิ้น
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default LyricForm;
