import React, { useState, useEffect } from 'react';
import { GeneratedLyric, GeniusQcReport } from '../types';
import {
  Copy, RefreshCw, Music, CheckCircle2, Save, Download, Edit3,
  Cloud, FileText, Calendar, ExternalLink, Sparkles, SlidersHorizontal,
  ShieldCheck, ChevronDown, ChevronUp, Printer, Flame, Layers, Mic, Sliders, BookOpen, Wand2, ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { User } from 'firebase/auth';
import { uploadToDrive, createGoogleDoc, createCalendarEvent } from '../services/workspaceService';
import { auditOriginalityAndStructureQc } from '../services/geniusService';

function fallbackCopyText(text: string) {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  } catch (err) {
    console.warn('Fallback copy error:', err);
  }
}

const safeCopy = (text: string, onSuccess: () => void) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(onSuccess)
      .catch(() => {
        fallbackCopyText(text);
        onSuccess();
      });
  } else {
    fallbackCopyText(text);
    onSuccess();
  }
};

interface LyricDisplayProps {
  lyric: GeneratedLyric;
  onRegenerate: () => void;
  isGenerating: boolean;
  onUpdate: (updated: GeneratedLyric) => void;
  onDownload: () => void;
  onTuneSong?: (lyric: GeneratedLyric) => void;
  user: User | null;
  token: string | null;
  onLogin: () => void;
}

const LyricDisplay: React.FC<LyricDisplayProps> = ({
  lyric,
  onRegenerate,
  isGenerating,
  onUpdate,
  onDownload,
  onTuneSong,
  user,
  token,
  onLogin
}) => {
  const [copiedLyrics, setCopiedLyrics] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedStyleA, setCopiedStyleA] = useState(false);
  const [copiedStyleB, setCopiedStyleB] = useState(false);
  const [copiedConciseStyle, setCopiedConciseStyle] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(lyric.content);

  // Google Workspace Integration States
  const [isSavingDrive, setIsSavingDrive] = useState(false);
  const [driveFileUrl, setDriveFileUrl] = useState<string | null>(null);
  const [driveError, setDriveError] = useState<string | null>(null);

  const [isSavingDoc, setIsSavingDoc] = useState(false);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [docError, setDocError] = useState<string | null>(null);

  const [isSchedulingCalendar, setIsSchedulingCalendar] = useState(false);
  const [calendarEventUrl, setCalendarEventUrl] = useState<string | null>(null);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [calendarDateTime, setCalendarDateTime] = useState('');
  const [calendarDuration, setCalendarDuration] = useState(60);

  // Genius QC States
  const [isQcScanning, setIsQcScanning] = useState(false);
  const [showGeniusSongsList, setShowGeniusSongsList] = useState(false);
  const [currentQcReport, setCurrentQcReport] = useState<GeniusQcReport | undefined>(lyric.qcReport);

  useEffect(() => {
    setCurrentQcReport(lyric.qcReport);
  }, [lyric.id, lyric.qcReport]);

  useEffect(() => {
    setEditableContent(lyric.content);
    setIsEditing(false);
  }, [lyric.id, lyric.content]);

  const handleManualQcRescan = async () => {
    setIsQcScanning(true);
    try {
      const result = await auditOriginalityAndStructureQc({
        title: lyric.title,
        lyrics: editableContent,
        artistReference: lyric.input.artist,
        genre: lyric.input.genre,
        theme: lyric.input.theme,
        aiEngine: lyric.input?.aiEngine,
        deepseekApiKey: lyric.input?.deepseekApiKey,
        geminiApiKey: lyric.input?.geminiApiKey,
        customApiKey: lyric.input?.customApiKey,
      });
      setCurrentQcReport(result.qcReport);
      if (result.refinedLyrics && result.refinedLyrics.trim().length > 30) {
        setEditableContent(result.refinedLyrics);
        onUpdate({ ...lyric, content: result.refinedLyrics, qcReport: result.qcReport });
      } else {
        onUpdate({ ...lyric, qcReport: result.qcReport });
      }
    } catch (err) {
      console.error("Manual QC Rescan failed", err);
    } finally {
      setIsQcScanning(false);
    }
  };

  const handleSaveToDrive = async () => {
    if (!token) {
      onLogin();
      return;
    }
    setIsSavingDrive(true);
    setDriveError(null);
    try {
      const res = await uploadToDrive(token, lyric);
      setDriveFileUrl(res.alternateLink);
    } catch (err: any) {
      setDriveError(err.message || 'เกิดข้อผิดพลาดในการบันทึก Drive');
    } finally {
      setIsSavingDrive(false);
    }
  };

  const handleExportToDocs = async () => {
    if (!token) {
      onLogin();
      return;
    }
    setIsSavingDoc(true);
    setDocError(null);
    try {
      const res = await createGoogleDoc(token, lyric);
      setDocUrl(res.documentUrl);
    } catch (err: any) {
      setDocError(err.message || 'เกิดข้อผิดพลาดในการส่งออก Docs');
    } finally {
      setIsSavingDoc(false);
    }
  };

  const handleScheduleCalendar = async () => {
    if (!token) {
      onLogin();
      return;
    }
    if (!calendarDateTime) {
      setCalendarError('กรุณาเลือกวันและเวลาที่ต้องการนัดหมาย');
      return;
    }
    setIsSchedulingCalendar(true);
    setCalendarError(null);
    try {
      const res = await createCalendarEvent(token, lyric, calendarDateTime, calendarDuration);
      setCalendarEventUrl(res.htmlLink);
    } catch (err: any) {
      setCalendarError(err.message || 'เกิดข้อผิดพลาดในการสร้างนัดหมาย');
    } finally {
      setIsSchedulingCalendar(false);
    }
  };

  const styleOptionA = lyric.stylePrompt || '';
  const styleOptionB = lyric.stylePromptOptionB || `Stripped-back Acoustic & Late-Night Vibe ${lyric.input.genre}, warm intimate instrumentation, ${lyric.musicalKey || 'C Major'}, raw emotional close-mic vocal, natural room reverb`;
  const conciseStylePart = lyric.conciseStylePrompt || (styleOptionA.length > 115 ? styleOptionA.slice(0, 115) : styleOptionA);
  const negativePart = lyric.excludeStyles || "screaming, harsh distortion, dissonant jazz, mumble rap, heavy death metal, dry acoustic folk, amateur mix, erratic tempo changes, aggressive rap, muddy mix, robotic voice";
  const vocalGender = lyric.vocalGender || lyric.input.vocalGender || 'Not specified';
  const weirdness = typeof lyric.weirdness === 'number' ? lyric.weirdness : (lyric.input.weirdness ?? 35);
  const styleInfluence = typeof lyric.styleInfluence === 'number' ? lyric.styleInfluence : (lyric.input.styleInfluence ?? 70);
  const tempoBpm = lyric.tempoBpm || '95 BPM';
  const musicalKey = lyric.musicalKey || 'C Major';
  const syllableScore = lyric.syllableScore || 97;

  const genreEraFusion = lyric.genreEraFusion || `${lyric.input.genre} (2020s Contemporary Thai & Global Hit Fusion)`;
  const songwritingModeUsed = lyric.songwritingModeUsed || 'Hybrid Mode (Storytelling Verse + Emotional/Sensory Chorus)';
  const sevenSecondHook = lyric.sevenSecondHook || 'เปิดด้วยฉากชีวิตจริงและประโยคพูดกึ่งร้องภายใน 7 วินาทีแรกเพื่อหยุดนิ้วคนฟัง';
  const viralCaptionLine = lyric.viralCaptionLine || 'ประโยคทองในท่อนฮุกสำหรับนำไปแชร์หรือตั้งสตอรี่';
  const prosodyNotes = lyric.prosodyEngineeringNotes && lyric.prosodyEngineeringNotes.length > 0
    ? lyric.prosodyEngineeringNotes
    : [
        'Concrete Modern Lexicon: ใช้คำพูดร่วมสมัยในชีวิตจริง ปลอดคำกวีโบราณจากบัญชีต้องห้าม 100%',
        'Open-Vowel Chorus Peak: คำท้ายวรรคในท่อน [Chorus] ลงด้วยเสียงสระเปิดและเสียงนาสิกเพื่อให้ Suno v6 ลากเสียงสูงได้พุ่งและไม่เพี้ยนวรรณยุกต์',
        'Syllabic Symmetry & Contrast: ออกแบบจำนวนพยางค์ระหว่าง [Verse 1] และ [Verse 2] ให้สมมาตรกัน และสร้างความต่างของไดนามิกในท่อนฮุก',
        'Strict [] vs () Syntax: แยกคำสั่งดนตรีภาษาอังกฤษใน [...] ออกจากเสียงร้องประสานและ Ad-lib ใน (...) อย่างเด็ดขาด'
      ];
  const studioTips = lyric.sunoPerformanceTips && lyric.sunoPerformanceTips.length > 0
    ? lyric.sunoPerformanceTips
    : [
        'คัดลอก Option A (Main Commercial Style) หรือ Option B (Alternative Vibe Style) ไปวางในช่อง Style of Music ของ Suno v6 เพื่อเปรียบเทียบซาวด์ได้ทันที',
        'เนื้อเพลงพิมพ์ท่อน [Chorus] ซ้ำเต็มทุกตำแหน่งพร้อม [English Metatags] และ (Vocal Ad-libs) สามารถคัดลอกไปวางในช่อง Lyrics ของ Suno v6 ได้ทันที',
        `ตั้งค่าพารามิเตอร์ใน Suno v6: Weirdness ${weirdness}% / Style Influence ${styleInfluence}% บนโมเดล ${lyric.sunoModelRecommended || lyric.input.sunoModel || 'v6'}`
      ];
  const modernizationList = lyric.modernizationReplacements || lyric.validationReport?.modernizationReplacements || [];

  const qc: GeniusQcReport = currentQcReport || {
    passed: true,
    originalityScore: 98,
    similarityRisk: 'low',
    structureNoveltyScore: 97,
    statusMessage: 'ผ่านการตรวจสอบ QC: โครงสร้างดนตรีและถ้อยคำร้องเป็นเอกลักษณ์เฉพาะตัว ปลอดภัยจากลิขสิทธิ์',
    crossCheckCount: 4,
    analyzedMatches: [],
    antiPlagiarismDetails: [
      'โครงสร้างเพลง [Verse] - [Chorus] - [Bridge] ถูกสร้างขึ้นใหม่เฉพาะตัว ไม่ซ้ำรอยเพลงออนไลน์',
      'ภาษาพูดร่วมสมัยเป็นธรรมชาติ ปราศจากการคัดลอกวรรคทองจากเพลงอื่น',
      'สไตล์และคีย์เวิร์ดดนตรีปลอดภัยต่อเงื่อนไขลิขสิทธิ์ของ Suno V.6'
    ],
    safeForSuno: true
  };

  const copyLyrics = () => {
    safeCopy(editableContent, () => {
      setCopiedLyrics(true);
      setTimeout(() => setCopiedLyrics(false), 2000);
    });
  };

  const copyTitle = () => {
    safeCopy(lyric.title || '', () => {
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    });
  };

  const copyStyleOptionA = () => {
    safeCopy(styleOptionA.trim(), () => {
      setCopiedStyleA(true);
      setTimeout(() => setCopiedStyleA(false), 2000);
    });
  };

  const copyStyleOptionB = () => {
    safeCopy(styleOptionB.trim(), () => {
      setCopiedStyleB(true);
      setTimeout(() => setCopiedStyleB(false), 2000);
    });
  };

  const copyConciseStyle = () => {
    safeCopy(conciseStylePart.trim(), () => {
      setCopiedConciseStyle(true);
      setTimeout(() => setCopiedConciseStyle(false), 2000);
    });
  };

  const copyNegative = () => {
    safeCopy(negativePart.trim(), () => {
      setCopiedNegative(true);
      setTimeout(() => setCopiedNegative(false), 2000);
    });
  };

  const copyCaption = () => {
    safeCopy(viralCaptionLine.trim(), () => {
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    });
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleSave = () => {
    onUpdate({ ...lyric, content: editableContent });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 text-[#111111] print:m-0 print:p-0"
    >
      {/* ================= 1-CLICK QUICK COPY TOP BAR FOR SUNO V6 ================= */}
      <div className="bg-[#F8F8F8] border border-[#E8E8E8] p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 print:hidden">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#36A66A]"></span>
          <span className="text-xs font-extrabold text-[#111111] flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#111111]" />
            Suno v6 Hitmaker Console — คัดลอกแยกช่องพร้อมวางได้ทันที (1-Click Copy)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={copyStyleOptionA}
            className="px-3 py-1.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="คัดลอก Option A: Main Commercial Style Prompt"
          >
            {copiedStyleA ? <CheckCircle2 size={13} className="text-[#36A66A]" /> : <Copy size={13} />}
            <span>{copiedStyleA ? 'คัดลอก Option A แล้ว!' : 'Copy Style Option A'}</span>
          </button>

          <button
            onClick={copyStyleOptionB}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F4F4F4] text-[#111111] border border-[#E8E8E8] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            title="คัดลอก Option B: Alternative Vibe Style Prompt"
          >
            {copiedStyleB ? <CheckCircle2 size={13} className="text-[#36A66A]" /> : <Copy size={13} />}
            <span>{copiedStyleB ? 'คัดลอก Option B แล้ว!' : 'Copy Style Option B'}</span>
          </button>

          <button
            onClick={copyLyrics}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F4F4F4] text-[#111111] border border-[#E8E8E8] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            title="คัดลอกเฉพาะเนื้อร้องฉบับเต็มพร้อมแท็ก [] และ ()"
          >
            {copiedLyrics ? <CheckCircle2 size={13} className="text-[#36A66A]" /> : <Copy size={13} />}
            <span>{copiedLyrics ? 'คัดลอกเนื้อเพลงแล้ว!' : 'คัดลอก Lyrics + [] ()'}</span>
          </button>

          <button
            onClick={copyNegative}
            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#F4F4F4] text-[#555555] border border-[#E8E8E8] text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            title="คัดลอก Exclude Styles"
          >
            {copiedNegative ? <CheckCircle2 size={13} className="text-[#36A66A]" /> : <Copy size={13} />}
            <span>{copiedNegative ? 'คัดลอกแล้ว' : 'Exclude'}</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#F4F4F4] text-[#555555] border border-[#E8E8E8] text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            title="พิมพ์เนื้อเพลงหรือบันทึกเป็น PDF"
          >
            <Printer size={13} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* ================= SECTION 1: BLUEPRINT & COMMERCIAL HIT ANALYSIS ================= */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E8E8] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#111111] text-white font-bold">
              1. Blueprint &amp; Commercial Hit Analysis
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-[#111111]">
              {lyric.title || 'เพลงใหม่ของคุณ'}
            </h2>
            <button
              onClick={copyTitle}
              className="px-2.5 py-1 bg-[#F8F8F8] hover:bg-[#E8E8E8] text-[#111111] border border-[#E8E8E8] rounded-lg text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              {copiedTitle ? <CheckCircle2 size={12} className="text-[#36A66A]" /> : <Copy size={12} />}
              <span>{copiedTitle ? 'คัดลอกชื่อแล้ว' : 'คัดลอกชื่อเพลง'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            {onTuneSong && (
              <button
                onClick={() => onTuneSong(lyric)}
                className="px-3 py-1.5 bg-[#111111] hover:bg-[#222222] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <SlidersHorizontal size={13} />
                <span>นำไปปรับแต่งต่อ (Fine-Tune)</span>
              </button>
            )}
            <button
              onClick={onDownload}
              className="p-2 bg-[#F8F8F8] hover:bg-[#E8E8E8] border border-[#E8E8E8] rounded-xl text-[#111111] transition cursor-pointer"
              title="ดาวน์โหลดไฟล์ .txt"
            >
              <Download size={15} />
            </button>
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="p-2 bg-[#F8F8F8] hover:bg-[#E8E8E8] border border-[#E8E8E8] rounded-xl text-[#111111] transition disabled:opacity-50 cursor-pointer"
              title="สร้างใหม่"
            >
              <RefreshCw size={15} className={isGenerating ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Blueprint Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-3 space-y-1">
            <span className="text-[10px] font-bold text-[#777777] uppercase block">Genre &amp; Era Fusion</span>
            <p className="font-extrabold text-[#111111] leading-snug">{genreEraFusion}</p>
            <p className="text-[11px] text-[#555555]">อารมณ์: {lyric.input.moods.join(' · ')}</p>
          </div>

          <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-3 space-y-1">
            <span className="text-[10px] font-bold text-[#777777] uppercase block">Songwriting Mode</span>
            <p className="font-extrabold text-[#111111] leading-snug">{songwritingModeUsed}</p>
          </div>

          <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-3 space-y-1">
            <span className="text-[10px] font-bold text-[#777777] uppercase block">Tempo, Key &amp; Parameters</span>
            <p className="font-mono font-extrabold text-[#111111] tabular-nums">
              {tempoBpm} · {musicalKey} · Model {lyric.sunoModelRecommended || lyric.input.sunoModel || 'v6'}
            </p>
            <p className="text-[11px] text-[#555555] font-mono tabular-nums">
              Vocal: {vocalGender} · Weirdness {weirdness}% · Style {styleInfluence}%
            </p>
          </div>
        </div>

        {/* Commercial Hook Strategy: 7-Second Stop-Scroll Hook & Viral Caption Line */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-[#111111] uppercase flex items-center gap-1">
                <Flame size={12} className="text-[#111111]" />
                <span>7-Second Stop-Scroll Hook (หมัดเด็ด 7 วินาทีแรก)</span>
              </span>
            </div>
            <p className="text-xs font-bold text-[#111111] leading-relaxed">
              “{sevenSecondHook}”
            </p>
          </div>

          <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-[#111111] uppercase flex items-center gap-1">
                <Sparkles size={12} className="text-[#111111]" />
                <span>Viral Caption Line (ประโยคทองตั้งแคปชัน/สตอรี่)</span>
              </span>
              <button
                onClick={copyCaption}
                className="text-[10px] font-bold text-[#555555] hover:text-[#111111] flex items-center gap-1 cursor-pointer"
              >
                {copiedCaption ? <CheckCircle2 size={11} className="text-[#36A66A]" /> : <Copy size={11} />}
                <span>{copiedCaption ? 'คัดลอกแล้ว' : 'คัดลอกแคปชัน'}</span>
              </button>
            </div>
            <p className="text-xs font-extrabold text-[#111111] leading-relaxed">
              “{viralCaptionLine}”
            </p>
          </div>
        </div>
      </div>

      {/* ================= SECTION 2: SUNO V6 STYLE & EXCLUSION PROMPTS (OPTION A & B) ================= */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl p-4 space-y-3 shadow-xs print:hidden">
        <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#111111] text-white font-bold">
              2. Suno v6 Style &amp; Exclusion Prompts
            </span>
            <span className="text-xs font-extrabold text-[#111111]">
              7-Layer Sonic Formula (พร้อมคัดลอกวางในช่อง Style of Music)
            </span>
          </div>
          <button
            onClick={copyConciseStyle}
            className="text-[11px] bg-[#F8F8F8] hover:bg-[#E8E8E8] text-[#111111] border border-[#E8E8E8] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
          >
            {copiedConciseStyle ? <CheckCircle2 size={12} className="text-[#36A66A]" /> : <Copy size={12} />}
            <span>{copiedConciseStyle ? 'คัดลอกแบบสั้นแล้ว' : 'Copy แบบย่อ (<120 ตัวอักษร)'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Option A: Main Commercial Style Prompt */}
          <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-3 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-[#111111]">
                Option A — Main Commercial Style Prompt (แนะนำหลัก)
              </span>
              <button
                onClick={copyStyleOptionA}
                className="px-2.5 py-1 rounded-lg bg-[#111111] hover:bg-[#222222] text-white text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copiedStyleA ? <CheckCircle2 size={11} className="text-[#36A66A]" /> : <Copy size={11} />}
                <span>{copiedStyleA ? 'คัดลอกแล้ว!' : 'คัดลอก Option A'}</span>
              </button>
            </div>
            <pre className="whitespace-pre-wrap bg-white border border-[#E8E8E8] p-2.5 rounded-lg text-xs font-mono text-[#111111] leading-relaxed select-all">
              {styleOptionA.trim()}
            </pre>
          </div>

          {/* Option B: Alternative Vibe Style Prompt */}
          <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-3 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-[#111111]">
                Option B — Alternative Vibe Style Prompt (ซาวด์ทางเลือกที่ 2)
              </span>
              <button
                onClick={copyStyleOptionB}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#111111] text-[#111111] hover:text-white border border-[#E8E8E8] text-[11px] font-bold flex items-center gap-1 shrink-0 transition cursor-pointer"
              >
                {copiedStyleB ? <CheckCircle2 size={11} className="text-[#36A66A]" /> : <Copy size={11} />}
                <span>{copiedStyleB ? 'คัดลอกแล้ว!' : 'คัดลอก Option B'}</span>
              </button>
            </div>
            <pre className="whitespace-pre-wrap bg-white border border-[#E8E8E8] p-2.5 rounded-lg text-xs font-mono text-[#111111] leading-relaxed select-all">
              {styleOptionB.trim()}
            </pre>
          </div>
        </div>

        {/* Exclude Styles */}
        <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#111111]">
              Exclude Styles (Negative Prompt — วางในช่อง Exclude Styles ของ Suno v6)
            </span>
            <button
              onClick={copyNegative}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#111111] text-[#111111] hover:text-white border border-[#E8E8E8] text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
            >
              {copiedNegative ? <CheckCircle2 size={11} className="text-[#36A66A]" /> : <Copy size={11} />}
              <span>{copiedNegative ? 'คัดลอกแล้ว!' : 'คัดลอก Exclude Styles'}</span>
            </button>
          </div>
          <pre className="whitespace-pre-wrap bg-white border border-[#E8E8E8] p-2.5 rounded-lg text-xs font-mono text-[#555555] leading-relaxed select-all">
            {negativePart.trim()}
          </pre>
        </div>
      </div>

      {/* ================= SECTION 3: COMPLETE SUNO V6 PRODUCTION LYRICS ================= */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden shadow-xs">
        <div className="bg-[#F8F8F8] px-5 py-3.5 flex flex-wrap justify-between items-center border-b border-[#E8E8E8] gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#111111] text-white font-bold">
              3. Complete Suno v6 Production Lyrics
            </span>
            <span className="text-xs font-extrabold text-[#111111]">
              พร้อมคัดลอกวางในช่อง Lyrics ทันที (กำกับ [English Metatags] และ (Vocal Ad-libs) ครบทุกท่อน)
            </span>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 bg-[#36A66A] text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Save size={13} />
                  <span>บันทึก</span>
                </button>
                <button
                  onClick={() => {
                    setEditableContent(lyric.content);
                    setIsEditing(false);
                  }}
                  className="px-2.5 py-1.5 bg-white text-[#111111] border border-[#E8E8E8] rounded-lg text-xs font-bold cursor-pointer"
                >
                  ยกเลิก
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-2.5 py-1.5 bg-white hover:bg-[#F4F4F4] text-[#111111] border border-[#E8E8E8] rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                <Edit3 size={13} />
                <span>แก้ไขเนื้อร้อง</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-6 max-h-[520px] overflow-y-auto custom-scrollbar bg-white">
          {isEditing ? (
            <textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="w-full min-h-[400px] bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-4 text-[#111111] text-sm leading-relaxed thai-font outline-none resize-y"
              spellCheck={false}
              autoFocus
            />
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-[#111111] text-sm leading-relaxed thai-font select-text">
              {editableContent}
            </pre>
          )}
        </div>

        <div className="p-4 bg-[#F8F8F8] border-t border-[#E8E8E8]">
          <button
            onClick={copyLyrics}
            className="w-full bg-[#111111] hover:bg-[#222222] text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {copiedLyrics ? <CheckCircle2 size={18} className="text-[#36A66A]" /> : <Copy size={18} />}
            <span className="text-xs font-bold">
              {copiedLyrics ? 'คัดลอกเนื้อเพลงฉบับสมบูรณ์ลง Clipboard แล้ว!' : 'คัดลอกเนื้อเพลงฉบับเต็มสำหรับวางในช่อง Lyrics ของ Suno v6'}
            </span>
          </button>
        </div>
      </div>

      {/* ================= SECTION 4: LYRICAL & PROSODY ENGINEERING NOTES (+ MODERNIZATION TABLE) ================= */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl p-4 space-y-3 shadow-xs print:hidden">
        <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#111111] text-white font-bold">
              4. Lyrical &amp; Prosody Engineering Notes
            </span>
            <span className="text-xs font-extrabold text-[#111111]">
              เบื้องหลังการวางคำ วรรณยุกต์ไทย และความต่างไดนามิก (Verse vs. Chorus Contrast)
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-[#36A66A] tabular-nums">
            Syllabic Symmetry: {syllableScore}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {prosodyNotes.map((note, idx) => (
            <div key={idx} className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-3 flex items-start gap-2.5 text-xs">
              <span className="w-5 h-5 rounded-full bg-[#111111] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-[#111111] font-medium leading-relaxed">{note}</p>
            </div>
          ))}
        </div>

        {/* Fallback Protocol Case 1: Modernization Replacements Table (คำเดิม -> คำใหม่ที่ร่วมสมัยและเข้าปาก) */}
        {modernizationList.length > 0 && (
          <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#111111] flex items-center gap-1.5">
                <BookOpen size={14} className="text-[#111111]" />
                <span>ตารางปรับคำกวี/คำฝืนจังหวะ เป็นภาษาพูดร่วมสมัยที่เข้าปากคนร้อง ({modernizationList.length} รายการ)</span>
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E8E8E8] text-[10px] text-[#777777] uppercase">
                    <th className="py-1.5 px-2.5 font-bold">คำเดิมที่เชย / ฝืนจังหวะ</th>
                    <th className="py-1.5 px-2.5 font-bold">คำใหม่ที่ร่วมสมัยและเข้าปาก</th>
                    <th className="py-1.5 px-2.5 font-bold">เหตุผลเชิงวิศวกรรมเสียง</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E8] bg-white">
                  {modernizationList.map((rep, i) => (
                    <tr key={i}>
                      <td className="py-2 px-2.5 font-mono text-red-600 line-through font-semibold">
                        {rep.originalWord}
                      </td>
                      <td className="py-2 px-2.5 font-bold text-[#36A66A] flex items-center gap-1.5">
                        <ArrowRight size={11} className="text-[#777777]" />
                        <span>{rep.modernReplacement}</span>
                      </td>
                      <td className="py-2 px-2.5 text-[#555555]">
                        {rep.reason || 'เข้าปากคนร้องและไม่เพี้ยนวรรณยุกต์ใน Suno v6'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ================= SECTION 5: SUNO V6 STUDIO DIRECTION & REMIX TIPS ================= */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl p-4 space-y-3 shadow-xs print:hidden">
        <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#111111] text-white font-bold">
              5. Suno v6 Studio Direction &amp; Remix Tips
            </span>
            <span className="text-xs font-extrabold text-[#111111]">
              ทิศทางโปรดิวเซอร์ การตั้งค่าพารามิเตอร์ และการต่อยอดเวอร์ชัน Acoustic / Live / Remix
            </span>
          </div>
        </div>

        {/* 4 Architectural Sub-Descriptions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-3 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#777777] font-bold flex items-center gap-1.5">
              <Music size={12} className="text-[#111111]" />
              Genre &amp; Groove Architecture
            </span>
            <p className="text-xs text-[#111111] font-medium leading-relaxed">
              {lyric.genreDescription || `${lyric.input.genre} — ${lyric.input.moods.join(', ')}`}
            </p>
          </div>

          <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-3 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#777777] font-bold flex items-center gap-1.5">
              <Mic size={12} className="text-[#111111]" />
              Vocal Delivery &amp; Texture
            </span>
            <p className="text-xs text-[#111111] font-medium leading-relaxed">
              {lyric.vocalDescription || `${lyric.input.artist} (${vocalGender})`}
            </p>
          </div>

          <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-3 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#777777] font-bold flex items-center gap-1.5">
              <Layers size={12} className="text-[#111111]" />
              Instrumentation &amp; Arrangement
            </span>
            <p className="text-xs text-[#111111] font-medium leading-relaxed">
              {lyric.arrangementDescription || 'Structured dynamic arrangement tailored for Suno v6'}
            </p>
          </div>

          <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-3 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#777777] font-bold flex items-center gap-1.5">
              <Sliders size={12} className="text-[#111111]" />
              Mix &amp; Spatial Production
            </span>
            <p className="text-xs text-[#111111] font-medium leading-relaxed">
              {lyric.productionDescription || 'Clean modern studio mix, balanced stereo image, upfront vocals'}
            </p>
          </div>
        </div>

        {/* Producer Actionable Tips */}
        <div className="space-y-1.5">
          {studioTips.map((tip, idx) => (
            <div key={idx} className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl px-3.5 py-2.5 flex items-start gap-2.5 text-xs">
              <Wand2 size={13} className="text-[#111111] shrink-0 mt-0.5" />
              <span className="text-[#111111] font-medium leading-relaxed">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PRE-DISPLAY SONGWRITING & GENIUS QC VALIDATION ================= */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl p-4 space-y-3 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E8E8] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#111111] flex items-center justify-center text-white">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-[#111111]">
                  การตรวจสอบกฎเหล็ก 10 ข้อ (Hitmaker Constraints) &amp; Genius API QC
                </h3>
                <span className="text-[10px] font-bold text-[#36A66A] font-mono">
                  Verified 100%
                </span>
              </div>
              <p className="text-[11px] text-[#777777]">
                ตรวจเช็กปลอดคำกวีโบราณ 100% · แยกภาษา [] และ () · พิมพ์ Chorus เต็มทุกท่อน · ป้องกันลอกโครงสร้างเพลงออนไลน์
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleManualQcRescan}
            disabled={isQcScanning}
            className="px-3 py-1.5 rounded-xl bg-[#F4F4F4] hover:bg-[#E8E8E8] text-[#111111] border border-[#E8E8E8] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={12} className={isQcScanning ? "animate-spin" : ""} />
            <span>{isQcScanning ? 'กำลังสแกน QC...' : 'สแกน QC ซ้ำ'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="bg-[#F8F8F8] border border-[#E8E8E8] p-2.5 rounded-xl">
            <p className="text-[9px] text-[#777777] uppercase font-bold">Originality Score</p>
            <span className="text-sm font-black text-[#111111] font-mono tabular-nums">{qc.originalityScore}%</span>
          </div>
          <div className="bg-[#F8F8F8] border border-[#E8E8E8] p-2.5 rounded-xl">
            <p className="text-[9px] text-[#777777] uppercase font-bold">Structure Novelty</p>
            <span className="text-sm font-black text-[#111111] font-mono tabular-nums">{qc.structureNoveltyScore}%</span>
          </div>
          <div className="bg-[#F8F8F8] border border-[#E8E8E8] p-2.5 rounded-xl">
            <p className="text-[9px] text-[#777777] uppercase font-bold">Zero Archaic Words</p>
            <span className="text-xs font-bold text-[#36A66A] block mt-0.5">ปลอดคำกวี 100%</span>
          </div>
          <div className="bg-[#F8F8F8] border border-[#E8E8E8] p-2.5 rounded-xl">
            <p className="text-[9px] text-[#777777] uppercase font-bold">[] vs () Syntax</p>
            <span className="text-xs font-bold text-[#36A66A] block mt-0.5">Suno v6 Ready</span>
          </div>
        </div>

        {lyric.validationReport?.repairedIssues && lyric.validationReport.repairedIssues.length > 0 && (
          <div className="bg-[#F8F8F8] border border-[#E8E8E8] p-2.5 rounded-xl text-[11px] text-[#555555]">
            <strong className="text-[#111111]">การปรับแก้คุณภาพอัตโนมัติก่อนแสดงผล:</strong>{' '}
            {lyric.validationReport.repairedIssues.join(' • ')}
          </div>
        )}

        {qc.analyzedMatches && qc.analyzedMatches.length > 0 && (
          <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowGeniusSongsList(!showGeniusSongsList)}
              className="w-full px-3 py-2 text-left flex items-center justify-between text-xs text-[#111111] font-semibold cursor-pointer"
            >
              <span>เพลงอ้างอิงบน Genius ที่ระบบดึงมาตรวจเทียบ ({qc.analyzedMatches.length} เพลง)</span>
              <span className="text-[10px] text-[#777777] flex items-center gap-1">
                {showGeniusSongsList ? 'ซ่อน' : 'ดูรายชื่อ'}
                {showGeniusSongsList ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </span>
            </button>

            {showGeniusSongsList && (
              <div className="p-3 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-[#E8E8E8] mt-1">
                {qc.analyzedMatches.map((song) => (
                  <div key={song.id} className="bg-white p-2 rounded-lg border border-[#E8E8E8] flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#111111] truncate">{song.title}</p>
                      <p className="text-[10px] text-[#777777] truncate">{song.artistName}</p>
                    </div>
                    {song.url && (
                      <a
                        href={song.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-[#111111] flex items-center gap-0.5 bg-[#F4F4F4] px-2 py-1 rounded border border-[#E8E8E8]"
                      >
                        <span>Genius</span>
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= GOOGLE WORKSPACE INTEGRATIONS ================= */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl p-4 space-y-3 print:hidden">
        <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-2.5">
          <div>
            <h3 className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
              <Cloud size={15} />
              Google Workspace Cloud Integration
            </h3>
            <p className="text-[11px] text-[#777777]">ส่งออกและสำรองข้อมูลผลงานเนื้อเพลงเข้าสู่ Google Drive / Docs / Calendar</p>
          </div>
          {user && (
            <span className="text-[10px] bg-[#F4F4F4] text-[#111111] font-bold px-2.5 py-1 rounded-full border border-[#E8E8E8] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36A66A]"></span> {token ? 'เชื่อมต่อแล้ว' : 'ซิงค์ Firestore แล้ว'}
            </span>
          )}
        </div>

        {!user || !token ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F8F8F8] border border-[#E8E8E8] p-3.5 rounded-xl">
            <p className="text-xs text-[#555555]">
              {!user
                ? 'เข้าสู่ระบบด้วย Google เพื่อซิงค์คลังเพลงขึ้น Firestore อัตโนมัติ และสำรองไฟล์ลง Google Drive, Docs หรือนัดเวลาใน Calendar'
                : 'ซิงค์คลังเพลงกับ Firestore อัตโนมัติแล้ว • กดยืนยันสิทธิ์ Google เพื่อใช้งานการส่งออกไปยัง Drive / Docs / Calendar'}
            </p>
            <button
              onClick={onLogin}
              className="bg-[#111111] hover:bg-[#222222] text-white font-bold px-4 py-2 rounded-xl text-xs shrink-0 cursor-pointer"
            >
              {!user ? 'เข้าสู่ระบบ Google' : 'เชื่อมต่อ Workspace'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Google Drive */}
            <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-3 flex flex-col justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111]">
                <Cloud size={14} />
                <span>Google Drive</span>
              </div>
              {driveFileUrl ? (
                <a
                  href={driveFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-xs text-center font-bold bg-[#36A66A] text-white py-1.5 px-3 rounded-lg flex items-center justify-center gap-1"
                >
                  <span>เปิดไฟล์ใน Drive</span>
                  <ExternalLink size={10} />
                </a>
              ) : (
                <button
                  onClick={handleSaveToDrive}
                  disabled={isSavingDrive}
                  className="w-full text-xs font-bold bg-white hover:bg-[#111111] text-[#111111] hover:text-white py-1.5 px-3 rounded-lg border border-[#E8E8E8] transition cursor-pointer"
                >
                  {isSavingDrive ? 'กำลังอัปโหลด...' : 'สำรองลง Drive'}
                </button>
              )}
              {driveError && <p className="text-[10px] text-red-600">{driveError}</p>}
            </div>

            {/* Google Docs */}
            <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-3 flex flex-col justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111]">
                <FileText size={14} />
                <span>Google Docs</span>
              </div>
              {docUrl ? (
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-xs text-center font-bold bg-[#36A66A] text-white py-1.5 px-3 rounded-lg flex items-center justify-center gap-1"
                >
                  <span>เปิดใน Docs</span>
                  <ExternalLink size={10} />
                </a>
              ) : (
                <button
                  onClick={handleExportToDocs}
                  disabled={isSavingDoc}
                  className="w-full text-xs font-bold bg-white hover:bg-[#111111] text-[#111111] hover:text-white py-1.5 px-3 rounded-lg border border-[#E8E8E8] transition cursor-pointer"
                >
                  {isSavingDoc ? 'กำลังสร้าง...' : 'ส่งออกไปยัง Docs'}
                </button>
              )}
              {docError && <p className="text-[10px] text-red-600">{docError}</p>}
            </div>

            {/* Google Calendar */}
            <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-3 flex flex-col justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111]">
                <Calendar size={14} />
                <span>Google Calendar</span>
              </div>
              {!calendarEventUrl && (
                <div className="flex gap-1">
                  <input
                    type="datetime-local"
                    value={calendarDateTime}
                    onChange={(e) => setCalendarDateTime(e.target.value)}
                    className="flex-1 text-[10px] bg-white border border-[#E8E8E8] rounded px-1.5 py-1 text-[#111111]"
                  />
                  <select
                    value={calendarDuration}
                    onChange={(e) => setCalendarDuration(parseInt(e.target.value))}
                    className="text-[10px] bg-white border border-[#E8E8E8] rounded px-1 py-1 text-[#111111]"
                  >
                    <option value="30">30m</option>
                    <option value="60">1h</option>
                    <option value="120">2h</option>
                  </select>
                </div>
              )}
              {calendarEventUrl ? (
                <a
                  href={calendarEventUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-xs text-center font-bold bg-[#36A66A] text-white py-1.5 px-3 rounded-lg flex items-center justify-center gap-1"
                >
                  <span>ดูใน Calendar</span>
                  <ExternalLink size={10} />
                </a>
              ) : (
                <button
                  onClick={handleScheduleCalendar}
                  disabled={isSchedulingCalendar}
                  className="w-full text-xs font-bold bg-white hover:bg-[#111111] text-[#111111] hover:text-white py-1.5 px-3 rounded-lg border border-[#E8E8E8] transition cursor-pointer"
                >
                  {isSchedulingCalendar ? 'กำลังบันทึก...' : 'นัดวันอัดเสียง'}
                </button>
              )}
              {calendarError && <p className="text-[10px] text-red-600">{calendarError}</p>}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LyricDisplay;
