export type Genre = 'Pop' | 'R&B' | 'Hip-hop' | 'Synthwave' | 'Ballad' | 'Rock' | 'City Pop' | 'Electronic' | string;
export type SongLength = '1:30 min' | '2:30 min' | '3:30 min' | '4:30 min' | '6:00 min' | '2-3 min' | '3-4 min' | '4-5 min';
export type LanguageMode = 'Thai Only' | 'Thai-English Mix' | 'English Only';
export type EnglishMixRatio = 25 | 50 | 75;
export type SunoModelTier = 'v6' | 'v6-wild' | 'v6-mini';
export type SongwritingMode = 'auto' | 'storytelling' | 'emotional' | 'hybrid';
export type AiEngineId = 'gemini-3.8-flash';

export interface SongLengthConfig {
  id: SongLength;
  label: string;
  duration: string;
  targetChars: string;
  suitableGenre: string;
  description: string;
}

export const SONG_LENGTH_OPTIONS: SongLengthConfig[] = [
  {
    id: '1:30 min',
    label: '1:30 นาที (สปีดสั้น)',
    duration: '01:30',
    targetChars: '2,500 - 3,500 ตัวอักษร',
    suitableGenre: 'คลิปสั้น TikTok, Reels, Shorts, Jingle โฆษณา',
    description: 'ท่อนฮุกกระชับ เปิดฉากไว จบเร็ว เหมาะสำหรับคลิปสั้นและคอนเทนต์ไวรัล'
  },
  {
    id: '2:30 min',
    label: '2:30 นาที (สตรีมมิ่งฮิต)',
    duration: '02:30',
    targetChars: '3,200 - 4,000 ตัวอักษร',
    suitableGenre: 'T-Pop ยุคใหม่, Hip-hop, Trap, Drill',
    description: 'บีตกระชับ ท่อนฮุกมาเร็วและจำง่าย ความยาวมาตรฐานของเพลงสตรีมมิ่งยุคปัจจุบัน'
  },
  {
    id: '3:30 min',
    label: '3:30 นาที (มาตรฐานซิงเกิล)',
    duration: '03:30',
    targetChars: '3,500 - 4,500 ตัวอักษร',
    suitableGenre: 'Commercial Pop, R&B, Pop-Rock, ลูกทุ่งอินดี้',
    description: 'มาตรฐานเพลงวิทยุสากล สมดุลครบทุกท่อน Verse, Pre-Chorus, Chorus, Bridge, Outro'
  },
  {
    id: '4:30 min',
    label: '4:30 นาที (Storytelling & Solo)',
    duration: '04:30',
    targetChars: '4,000 - 4,800 ตัวอักษร',
    suitableGenre: 'Indie Folk, Ballad ช้าซึ้ง, หมอลำเต้ยยาว, Rock มี Solo',
    description: 'เน้นการเล่าเรื่องลึกซึ้ง 4 องก์ พร้อมท่อนโซโล่เครื่องดนตรีและสะกดอารมณ์ผู้ฟัง'
  },
  {
    id: '6:00 min',
    label: '6:00 นาที (Epic Extended)',
    duration: '06:00',
    targetChars: '4,500 - 5,000 ตัวอักษร (เต็มพิกัด Suno v6)',
    suitableGenre: 'Epic Rock, Progressive, EDM Extended Club Mix, Concert Jam',
    description: 'เพลงมหากาพย์เต็มรูปแบบ แท็กจัดเต็มทุกจุดเปลี่ยนดนตรี ท่อนโซโล่คู่ และตอนจบอลังการ'
  }
];

export interface ModernizationReplacement {
  originalWord: string;
  modernReplacement: string;
  reason?: string;
}

export interface SongInput {
  title?: string;
  artist: string;
  genre: Genre;
  moods: string[];
  length: SongLength;
  theme: string;
  language: LanguageMode;
  englishMixRatio?: EnglishMixRatio;
  songwritingMode?: SongwritingMode;
  keywords: string[];
  vocalGender?: string;
  weirdness?: number;
  styleInfluence?: number;
  excludeStyles?: string;
  mode?: 'create' | 'tune' | 'complete';
  originalLyrics?: string;
  instructions?: string;
  desiredOutcome?: string;
  sunoModel?: SunoModelTier;
  structureSections?: string[];
  customStylePrompt?: string;
  viralFormulaId?: string;
  aiEngine?: AiEngineId;
  customApiKey?: string;
  geminiApiKey?: string;
}

export interface PresetSyncPayload {
  id: string;
  genre?: string;
  moods?: string[];
  artist?: string;
  theme?: string;
  language?: LanguageMode;
  englishMixRatio?: EnglishMixRatio;
  songwritingMode?: SongwritingMode;
  sunoModel?: SunoModelTier;
  weirdness?: number;
  styleInfluence?: number;
  customStylePrompt?: string;
  mode?: 'create' | 'tune' | 'complete';
  originalLyrics?: string;
  desiredOutcome?: string;
  timestamp: number;
}

export interface GeniusSongMatch {
  id: number;
  title: string;
  artistName: string;
  url?: string;
  songArtUrl?: string;
}

export interface GeniusQcReport {
  passed: boolean;
  originalityScore: number;
  similarityRisk: 'low' | 'moderate' | 'high';
  structureNoveltyScore: number;
  statusMessage: string;
  crossCheckCount: number;
  analyzedMatches: GeniusSongMatch[];
  antiPlagiarismDetails: string[];
  safeForSuno: boolean;
}

export interface LyricValidationReport {
  passed: boolean;
  hookLineStrong: boolean;
  openingContextComplete: boolean;
  naturalSpokenLanguage: boolean;
  noForbiddenCliches: boolean;
  noMetadataLeakage: boolean;
  strictBracketSyntax: boolean;
  fullChorusCompleteness: boolean;
  genreConsistencyScore: number;
  repairedIssues: string[];
  detectedCliches: string[];
  modernizationReplacements?: ModernizationReplacement[];
}

export interface PlatformMasteringSpec {
  platform: 'TikTok' | 'Spotify' | 'Apple Music' | 'YouTube';
  lufs: string;
  truePeak: string;
  purpose: string;
  recommendations: string[];
}

export interface ViralCaseStudy {
  id: string;
  title: string;
  artist: string;
  streamsOrViews: string;
  genre: string;
  emotionalAtmosphere: string;
  structureBlueprint: string;
  tiktokLane: string;
  hookSecret: string;
  recommendedSunoModel: SunoModelTier;
  recommendedSliders: { weirdness: number; styleInfluence: number };
  sunoMvVisual: string;
  samplePrompt: string;
  thaiApplicationStrategy: string;
}

export interface GeneratedLyric {
  id: string;
  title: string;
  stylePrompt: string;
  stylePromptOptionB?: string;
  conciseStylePrompt?: string;
  genreEraFusion?: string;
  songwritingModeUsed?: string;
  sevenSecondHook?: string;
  viralCaptionLine?: string;
  prosodyEngineeringNotes?: string[];
  modernizationReplacements?: ModernizationReplacement[];
  genreDescription?: string;
  vocalDescription?: string;
  arrangementDescription?: string;
  productionDescription?: string;
  excludeStyles: string;
  vocalGender: string;
  weirdness: number;
  styleInfluence: number;
  tempoBpm?: string;
  musicalKey?: string;
  syllableScore?: number;
  sunoPerformanceTips?: string[];
  content: string;
  timestamp: number;
  input: SongInput;
  qcReport?: GeniusQcReport;
  validationReport?: LyricValidationReport;
  sunoModelRecommended?: SunoModelTier;
  tiktokLane?: string;
  sunoMvVisualRecommended?: string;
  aiEngineUsed?: string;
  aiFallbackApplied?: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'charcoal' | 'midnight' | 'sunset' | 'neon' | 'emerald';
  fontSize: 'small' | 'medium' | 'large';
}

export interface AppState {
  currentLyric: GeneratedLyric | null;
  history: GeneratedLyric[];
  isGenerating: boolean;
  error: string | null;
}
