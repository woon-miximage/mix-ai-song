import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Flame,
  Radio,
  Check,
  Copy,
  ShieldCheck,
  BookOpen,
  Layers,
  Volume2,
  Video,
  Cpu,
  Calendar,
  Award,
  Cloud,
  Search
} from 'lucide-react';
import {
  VIRAL_CASE_STUDIES,
  SUNO_V6_MODELS,
  PLATFORM_MASTERING_SPECS,
  SUNOMV_VIRAL_STYLES,
  SUNO_V6_PRO_RULES,
  SUNO_OFFICIAL_RELEASES_2026,
  SUNO_V6_MASTER_CHEATSHEET,
  THAI_LYRIC_ENGINEERING_2026,
  GOLDEN_BLUEPRINT_SONG,
  STEP_BY_STEP_REPLICATION_WORKFLOWS,
  SUNO_DAILY_ARCHIVES_2026,
  ZERODAY_DSP_CALIBRATION_STANDARDS,
  ZERODAY_LIVE_DSP_CHAIN
} from '../data/viralMusicKnowledge';
import { ViralCaseStudy } from '../types';
import { KnowledgeVaultRecord } from '../services/firestoreService';

interface ViralKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCaseStudy?: (study: ViralCaseStudy) => void;
  cloudKnowledgeItems?: KnowledgeVaultRecord[];
  onSaveToCloudVault?: (item: Omit<KnowledgeVaultRecord, 'ownerId'>) => Promise<void>;
  isUserLoggedIn?: boolean;
}

export const ViralKnowledgeModal: React.FC<ViralKnowledgeModalProps> = ({
  isOpen,
  onClose,
  onApplyCaseStudy,
  cloudKnowledgeItems = [],
  onSaveToCloudVault,
  isUserLoggedIn = false
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'case-studies'
    | 'golden-blueprint'
    | 'daily-archives'
    | 'v6-nov2026'
    | 'v6-models'
    | 'mastering'
    | 'sunomv'
    | 'workflow'
  >('case-studies');
  const [selectedCase, setSelectedCase] = useState<ViralCaseStudy>(VIRAL_CASE_STUDIES[0]);
  const [archiveFilterPart, setArchiveFilterPart] = useState<'all' | 'part1' | 'part2'>('all');
  const [archiveSearchQuery, setArchiveSearchQuery] = useState('');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [savedVaultId, setSavedVaultId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleSaveVaultItem = async (item: Omit<KnowledgeVaultRecord, 'ownerId'>) => {
    if (!onSaveToCloudVault) return;
    await onSaveToCloudVault(item);
    setSavedVaultId(item.id);
    setTimeout(() => setSavedVaultId(null), 2000);
  };

  const filteredDailyArchives = SUNO_DAILY_ARCHIVES_2026.filter(entry => {
    const matchesPart =
      archiveFilterPart === 'all'
        ? true
        : archiveFilterPart === 'part1'
        ? entry.compendiumPart.startsWith('Part 1')
        : entry.compendiumPart.startsWith('Part 2');
    const q = archiveSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      entry.title.toLowerCase().includes(q) ||
      entry.summary.toLowerCase().includes(q) ||
      entry.category.toLowerCase().includes(q) ||
      entry.keyTags.some(t => t.toLowerCase().includes(q));
    return matchesPart && matchesSearch;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-white border border-[#E8E8E8] rounded-3xl shadow-2xl overflow-hidden text-[#111111]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E8] bg-[#F8F8F8]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#111111] text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-[#111111]">
                    คลังฐานข้อมูล Suno v6 Pro &amp; ZeroDay DSP (ครบทั้ง 5 เอกสารวิจัย)
                  </h2>
                  <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#111111] text-white">
                    Complete 2025–2026 Database
                  </span>
                  {isUserLoggedIn && (
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#36A66A]/15 text-[#36A66A] flex items-center gap-1">
                      <Cloud className="w-3 h-3" />
                      <span>Cloud Vault ({cloudKnowledgeItems.length} รายการ)</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#777777]">
                  โดย MIX NATTANONT - ZERODAY · รวมบันทึกเทคนิค 45 วัน (30 ก.ย. – 13 พ.ย. 2026), Case Studies, พิมพ์เขียวเบียร์แก้วที่สี่ และ DSP Mastering
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#777777] hover:text-[#111111] hover:bg-[#E8E8E8] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 px-6 py-2.5 bg-white border-b border-[#E8E8E8] overflow-x-auto text-xs">
            {[
              { id: 'case-studies', label: '10 Case Studies & เทรนด์ไวรัล', icon: Flame },
              { id: 'golden-blueprint', label: 'พิมพ์เขียว เบียร์แก้วที่สี่ & เวิร์กโฟลว์', icon: Award },
              { id: 'daily-archives', label: 'คลังเทคนิครายวันครบ 45 วัน (30 ก.ย.–13 พ.ย.)', icon: Calendar },
              { id: 'v6-nov2026', label: 'สรุปสูตร v6 & ฉันทลักษณ์ไทย', icon: Cpu },
              { id: 'mastering', label: 'ZeroDay DSP (16/24/32-Bit & EQ Chain)', icon: Volume2 },
              { id: 'sunomv', label: 'SunoMV ครบ 22 สไตล์ภาพ', icon: Video },
              { id: 'v6-models', label: 'โมเดล v6 / wild / mini', icon: Radio },
              { id: 'workflow', label: 'Extend, Stems & ลิขสิทธิ์', icon: Layers }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold transition whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#111111] text-white'
                      : 'bg-[#F4F4F4] text-[#555555] hover:text-[#111111]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
            {/* TAB 1: 10 CASE STUDIES */}
            {activeTab === 'case-studies' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-1 space-y-2 max-h-[68vh] overflow-y-auto pr-1 custom-scrollbar">
                  <h3 className="text-[11px] font-bold tracking-wider text-[#777777] uppercase mb-2">
                    เลือกเพลงศึกษา (Spotify &amp; TikTok Global Hits)
                  </h3>
                  {VIRAL_CASE_STUDIES.map(study => (
                    <button
                      key={study.id}
                      onClick={() => setSelectedCase(study)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition flex flex-col gap-1 cursor-pointer ${
                        selectedCase.id === study.id
                          ? 'bg-[#111111] border-[#111111] text-white shadow-sm'
                          : 'bg-[#F8F8F8] border-[#E8E8E8] text-[#111111] hover:bg-white hover:border-[#BDBDBD]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm truncate">{study.title}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                            selectedCase.id === study.id
                              ? 'bg-white/20 text-white'
                              : 'bg-white text-[#555555] border border-[#E8E8E8]'
                          }`}
                        >
                          {study.genre.split('/')[0]}
                        </span>
                      </div>
                      <span
                        className={`text-xs truncate ${
                          selectedCase.id === study.id ? 'text-white/80' : 'text-[#777777]'
                        }`}
                      >
                        {study.artist}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="md:col-span-2 bg-[#F8F8F8] border border-[#E8E8E8] rounded-2xl p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E8E8E8]">
                    <div>
                      <h4 className="text-lg font-extrabold text-[#111111] flex items-center gap-2">
                        <span>{selectedCase.title}</span>
                        <span className="text-xs font-medium text-[#777777]">({selectedCase.artist})</span>
                      </h4>
                      <p className="text-xs text-[#555555] font-semibold">{selectedCase.streamsOrViews}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isUserLoggedIn && onSaveToCloudVault && (
                        <button
                          onClick={() =>
                            handleSaveVaultItem({
                              id: `vault_${selectedCase.id}`,
                              category: 'viral-case-study',
                              title: `${selectedCase.title} (${selectedCase.artist})`,
                              sourceDoc: 'Suno v6 Pro Viral Music Report 2025-2026',
                              summary: `${selectedCase.hookSecret} | กลยุทธ์ไทย: ${selectedCase.thaiApplicationStrategy}`,
                              stylePrompt: selectedCase.samplePrompt,
                              tags: [selectedCase.genre, selectedCase.sunoMvVisual]
                            })
                          }
                          className="px-3 py-2 rounded-xl bg-white border border-[#E8E8E8] hover:border-[#111111] text-[#111111] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          {savedVaultId === `vault_${selectedCase.id}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#36A66A]" />
                              <span>ซิงค์ขึ้น Cloud แล้ว</span>
                            </>
                          ) : (
                            <>
                              <Cloud className="w-3.5 h-3.5" />
                              <span>เก็บเข้า Cloud</span>
                            </>
                          )}
                        </button>
                      )}

                      {onApplyCaseStudy && (
                        <button
                          onClick={() => {
                            onApplyCaseStudy(selectedCase);
                            onClose();
                          }}
                          className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#222222] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> ใช้สูตรนี้ในห้องแต่งเพลง
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-[#E8E8E8]">
                      <span className="text-[#777777] block font-semibold mb-1">หมวดหมู่อารมณ์:</span>
                      <span className="text-[#111111] font-bold">{selectedCase.emotionalAtmosphere}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#E8E8E8]">
                      <span className="text-[#777777] block font-semibold mb-1">TikTok Viral Lane:</span>
                      <span className="text-[#36A66A] font-bold">{selectedCase.tiktokLane}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-[#777777] font-bold">ความลับของท่อนฮุก (Hook Secret):</span>
                    <div className="p-3 rounded-xl bg-white border border-[#E8E8E8] text-[#111111] leading-relaxed">
                      {selectedCase.hookSecret}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-[#777777] font-bold">โครงสร้างเพลงพิมพ์เขียว (Blueprint Structure):</span>
                    <div className="p-3 rounded-xl bg-white border border-[#E8E8E8] text-[#111111] font-mono text-[11px] leading-relaxed">
                      {selectedCase.structureBlueprint}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-[#777777] font-bold">กลยุทธ์การประยุกต์ใช้ในตลาดเพลงไทย:</span>
                    <div className="p-3 rounded-xl bg-white border border-[#E8E8E8] text-[#111111] leading-relaxed">
                      {selectedCase.thaiApplicationStrategy}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-[#E8E8E8] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#111111] font-bold">
                        Suno v6 Style Prompt (Weirdness {selectedCase.recommendedSliders.weirdness}% · Style Influence {selectedCase.recommendedSliders.styleInfluence}%):
                      </span>
                      <button
                        onClick={() => handleCopyPrompt(selectedCase.samplePrompt, selectedCase.id)}
                        className="text-[#111111] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedPromptId === selectedCase.id ? (
                          <Check className="w-3.5 h-3.5 text-[#36A66A]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        {copiedPromptId === selectedCase.id ? 'คัดลอกแล้ว' : 'คัดลอก Prompt'}
                      </button>
                    </div>
                    <p className="text-xs font-mono text-[#555555] bg-[#F8F8F8] p-2.5 rounded-lg border border-[#E8E8E8]">
                      {selectedCase.samplePrompt}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GOLDEN BLUEPRINT ("เบียร์แก้วที่สี่") & STEP-BY-STEP WORKFLOWS */}
            {activeTab === 'golden-blueprint' && (
              <div className="space-y-6 text-xs">
                {/* Golden Blueprint Card */}
                <div className="p-5 rounded-3xl bg-[#F8F8F8] border border-[#E8E8E8] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8E8E8]">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#111111] text-white">
                        GOLDEN EXAMPLE BLUEPRINT v2.6
                      </span>
                      <h3 className="text-lg font-extrabold text-[#111111] mt-1">
                        {GOLDEN_BLUEPRINT_SONG.title}
                      </h3>
                      <p className="text-[#555555]">
                        {GOLDEN_BLUEPRINT_SONG.genre} · {GOLDEN_BLUEPRINT_SONG.bpm} | {GOLDEN_BLUEPRINT_SONG.musicalKey} · Weirdness {GOLDEN_BLUEPRINT_SONG.weirdness}% / Style Influence {GOLDEN_BLUEPRINT_SONG.styleInfluence}%
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyPrompt(GOLDEN_BLUEPRINT_SONG.fullLyrics, 'golden-lyrics')}
                        className="px-3.5 py-2 rounded-xl bg-white border border-[#E8E8E8] hover:border-[#111111] font-bold text-[#111111] flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedPromptId === 'golden-lyrics' ? (
                          <Check className="w-3.5 h-3.5 text-[#36A66A]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedPromptId === 'golden-lyrics' ? 'คัดลอกเนื้อเพลงแล้ว' : 'คัดลอกเนื้อเพลงเต็ม'}</span>
                      </button>
                      {onApplyCaseStudy && (
                        <button
                          onClick={() => {
                            onApplyCaseStudy(VIRAL_CASE_STUDIES[0]);
                            onClose();
                          }}
                          className="px-4 py-2 rounded-xl bg-[#111111] text-white font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>โหลดพิมพ์เขียวเข้าห้องแต่งเพลง</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#E8E8E8]">
                    <span className="text-[#777777] font-bold block mb-1">Earworm Catchphrase Hook (ประโยคทองไวรัล):</span>
                    <p className="text-sm font-extrabold text-[#111111]">
                      “{GOLDEN_BLUEPRINT_SONG.earwormHook}”
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="font-extrabold text-[#111111] block">
                        เนื้อเพลงต้นฉบับพร้อม Metatags มาตรฐาน Suno v6:
                      </span>
                      <pre className="p-4 rounded-2xl bg-white border border-[#E8E8E8] font-sans text-xs text-[#111111] whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto custom-scrollbar">
                        {GOLDEN_BLUEPRINT_SONG.fullLyrics}
                      </pre>
                    </div>

                    <div className="space-y-3">
                      <span className="font-extrabold text-[#111111] block">
                        การวิเคราะห์คำศัพท์ชีวิตจริง 0-AI Slop (Zero Cliché Engineering):
                      </span>
                      <div className="space-y-2">
                        {GOLDEN_BLUEPRINT_SONG.zeroAiSlopVocabulary.map((item, i) => (
                          <div key={i} className="p-3 rounded-xl bg-white border border-[#E8E8E8]">
                            <span className="font-extrabold text-[#111111] block">“{item.word}”</span>
                            <span className="text-[#555555] text-[11px] leading-relaxed">{item.context}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E8E8E8] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#111111]">Style Prompt:</span>
                          <button
                            onClick={() => handleCopyPrompt(GOLDEN_BLUEPRINT_SONG.stylePrompt, 'golden-style')}
                            className="font-bold text-[#111111] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            {copiedPromptId === 'golden-style' ? <Check className="w-3 h-3 text-[#36A66A]" /> : <Copy className="w-3 h-3" />}
                            <span>คัดลอก</span>
                          </button>
                        </div>
                        <p className="font-mono text-[11px] text-[#555555]">{GOLDEN_BLUEPRINT_SONG.stylePrompt}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Replication Workflows (Die With A Smile & back to friends) */}
                <div className="space-y-4">
                  <h4 className="text-sm font-extrabold text-[#111111]">
                    เวิร์กโฟลว์จำลองโครงสร้างเพลงฮิต Step-by-Step (Part 1 Create + Part 2 Extend + 30s TikTok Edit)
                  </h4>
                  {STEP_BY_STEP_REPLICATION_WORKFLOWS.map(wf => (
                    <div key={wf.id} className="p-5 rounded-3xl bg-[#F8F8F8] border border-[#E8E8E8] space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E8E8] pb-2.5">
                        <div>
                          <h5 className="text-sm font-extrabold text-[#111111]">{wf.targetSong}</h5>
                          <p className="text-[11px] text-[#555555]">
                            {wf.targetStyle} · {wf.recommendedModel} · Weirdness {wf.weirdness}% / Style Influence {wf.styleInfluence}%
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopyPrompt(wf.part1StylePrompt, `${wf.id}-style`)}
                          className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E8E8] hover:border-[#111111] font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedPromptId === `${wf.id}-style` ? <Check className="w-3 h-3 text-[#36A66A]" /> : <Copy className="w-3 h-3" />}
                          <span>คัดลอก Style Prompt</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 rounded-2xl bg-white border border-[#E8E8E8] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#111111]">Part 1: แม่แบบภาษาไทย</span>
                            <button
                              onClick={() => handleCopyPrompt(wf.part1ThaiLyrics, `${wf.id}-th`)}
                              className="text-[11px] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              {copiedPromptId === `${wf.id}-th` ? <Check className="w-3 h-3 text-[#36A66A]" /> : <Copy className="w-3 h-3" />}
                              <span>คัดลอก</span>
                            </button>
                          </div>
                          <pre className="font-sans text-[11px] text-[#555555] whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto custom-scrollbar">
                            {wf.part1ThaiLyrics}
                          </pre>
                        </div>

                        <div className="p-3 rounded-2xl bg-white border border-[#E8E8E8] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#111111]">Part 1: แม่แบบภาษาอังกฤษ</span>
                            <button
                              onClick={() => handleCopyPrompt(wf.part1EnglishLyrics, `${wf.id}-en`)}
                              className="text-[11px] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              {copiedPromptId === `${wf.id}-en` ? <Check className="w-3 h-3 text-[#36A66A]" /> : <Copy className="w-3 h-3" />}
                              <span>คัดลอก</span>
                            </button>
                          </div>
                          <pre className="font-sans text-[11px] text-[#555555] whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto custom-scrollbar">
                            {wf.part1EnglishLyrics}
                          </pre>
                        </div>

                        <div className="p-3 rounded-2xl bg-white border border-[#E8E8E8] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#111111]">Part 2: คำสั่ง Extend ต่อท่อนจบ</span>
                            <button
                              onClick={() => handleCopyPrompt(wf.part2ExtendLyrics, `${wf.id}-ext`)}
                              className="text-[11px] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              {copiedPromptId === `${wf.id}-ext` ? <Check className="w-3 h-3 text-[#36A66A]" /> : <Copy className="w-3 h-3" />}
                              <span>คัดลอก</span>
                            </button>
                          </div>
                          <p className="text-[11px] text-[#36A66A] font-bold">จุดกด Extend: {wf.part2ExtendTimestamp}</p>
                          <pre className="font-sans text-[11px] text-[#555555] whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">
                            {wf.part2ExtendLyrics}
                          </pre>
                          <div className="pt-2 border-t border-[#E8E8E8]">
                            <span className="font-bold text-[#111111] block">การตัดคลิป 30 วินาทีลง TikTok:</span>
                            <p className="text-[11px] text-[#555555]">{wf.tiktok30sEditGuide}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: COMPLETE 45 DAILY ARCHIVES (30 SEP – 13 NOV 2026) */}
            {activeTab === 'daily-archives' && (
              <div className="space-y-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F8F8F8] p-4 rounded-2xl border border-[#E8E8E8]">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all', label: `ทั้งหมด (${SUNO_DAILY_ARCHIVES_2026.length} วัน)` },
                      { id: 'part1', label: 'ฉบับที่ 1: 30 ก.ย. – 18 ต.ค. 2026 (19 วัน)' },
                      { id: 'part2', label: 'ฉบับที่ 2: 19 ต.ค. – 13 พ.ย. 2026 (26 วัน)' }
                    ].map(btn => (
                      <button
                        key={btn.id}
                        onClick={() => setArchiveFilterPart(btn.id as any)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                          archiveFilterPart === btn.id
                            ? 'bg-[#111111] text-white'
                            : 'bg-white text-[#555555] border border-[#E8E8E8] hover:border-[#111111]'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={archiveSearchQuery}
                      onChange={e => setArchiveSearchQuery(e.target.value)}
                      placeholder="ค้นหาวันที่, แท็ก, เทคนิค..."
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E8E8E8] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredDailyArchives.map(entry => (
                    <div
                      key={entry.docNumber}
                      className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#E8E8E8] flex flex-col justify-between space-y-2.5"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#111111] text-white font-mono font-bold text-[10px]">
                            Doc #{entry.docNumber} · {entry.date}
                          </span>
                          <span className="text-[10px] font-bold text-[#555555] bg-white px-2 py-0.5 rounded-full border border-[#E8E8E8]">
                            {entry.category}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-[#111111] text-sm">{entry.title}</h4>
                        <p className="text-[#555555] leading-relaxed">{entry.summary}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {entry.keyTags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-white border border-[#E8E8E8] font-mono text-[10px] text-[#111111]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-[#E8E8E8] flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] text-[#777777] truncate">
                          {entry.readyPrompt}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isUserLoggedIn && onSaveToCloudVault && (
                            <button
                              type="button"
                              onClick={() =>
                                handleSaveVaultItem({
                                  id: `archive_doc_${entry.docNumber}`,
                                  category: 'daily-archive',
                                  title: `${entry.date}: ${entry.title}`,
                                  sourceDoc: entry.compendiumPart,
                                  summary: entry.summary,
                                  stylePrompt: entry.readyPrompt,
                                  tags: entry.keyTags
                                })
                              }
                              className="px-2 py-1 rounded-lg bg-white border border-[#E8E8E8] hover:border-[#111111] text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              title="บันทึกลง Cloud Firestore"
                            >
                              {savedVaultId === `archive_doc_${entry.docNumber}` ? (
                                <Check className="w-3 h-3 text-[#36A66A]" />
                              ) : (
                                <Cloud className="w-3 h-3" />
                              )}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleCopyPrompt(entry.readyPrompt, `arch-${entry.docNumber}`)}
                            className="px-2.5 py-1 rounded-lg bg-[#111111] text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            {copiedPromptId === `arch-${entry.docNumber}` ? (
                              <Check className="w-3 h-3 text-[#36A66A]" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedPromptId === `arch-${entry.docNumber}` ? 'คัดลอกแล้ว' : 'คัดลอก Prompt'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SUMMARY V6 & THAI LYRIC ENGINEERING */}
            {activeTab === 'v6-nov2026' && (
              <div className="space-y-5 text-xs">
                <div className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#E8E8E8]">
                  <h3 className="font-extrabold text-sm text-[#111111] mb-1">
                    หลักการสำคัญของโมเดล Suno v6 (รวมฉบับ 30 ก.ย. – 13 พ.ย. 2026)
                  </h3>
                  <p className="text-[#555555] leading-relaxed">
                    โมเดล v6 ตอบสนองต่อคำบรรยายสภาพกายภาพของการบันทึกเสียงและความสัมพันธ์ของมิกซ์มากกว่าคำคุณศัพท์กว้างๆ อย่าง professional หรือ amazing พร้อมบังคับใช้กฎ Melodic Weight Rule (คำฮุกแรงสุดอยู่บรรทัดแรกของ Chorus), กฎ Anti-Dead Verse และกฎ No Verse-Chorus Echo
                  </p>
                </div>

                {/* Official Platform Updates */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-[#111111] text-sm">
                    ส่วนที่ 1: สรุปอัปเดตแพลตฟอร์ม Suno AI อย่างเป็นทางการ (ก.ย. – พ.ย. 2026)
                  </h4>
                  <div className="overflow-x-auto border border-[#E8E8E8] rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#111111] text-white text-[11px]">
                          <th className="py-2.5 px-3 font-bold whitespace-nowrap">วันที่ / รุ่น</th>
                          <th className="py-2.5 px-3 font-bold whitespace-nowrap">ฟีเจอร์ที่เปิดตัว</th>
                          <th className="py-2.5 px-3 font-bold">รายละเอียดและประโยชน์ต่อการผลิตเพลง</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E8E8] bg-white">
                        {SUNO_OFFICIAL_RELEASES_2026.map((rel, idx) => (
                          <tr key={idx} className="hover:bg-[#F8F8F8] transition">
                            <td className="py-2.5 px-3 align-top font-mono text-[11px] text-[#111111] whitespace-nowrap">
                              <span className="font-bold block">{rel.date}</span>
                              <span className="text-[#777777]">{rel.tier}</span>
                            </td>
                            <td className="py-2.5 px-3 align-top font-bold text-[#111111] whitespace-nowrap">
                              {rel.feature}
                            </td>
                            <td className="py-2.5 px-3 align-top text-[#555555] leading-relaxed">
                              {rel.details}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Master Reference Cheat Sheet */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-[#111111] text-sm">
                    ส่วนที่ 2: ตารางอ้างอิงเมทาแท็ก ฟิสิกส์ไมค์ และคาแรคเตอร์เครื่องดนตรี v6
                  </h4>
                  <div className="space-y-2.5">
                    {SUNO_V6_MASTER_CHEATSHEET.map((row, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#E8E8E8] space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-extrabold text-[#111111] text-sm">{row.category}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyPrompt(row.samplePrompt, `v6-cheat-${idx}`)}
                            className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E8E8] hover:border-[#111111] text-[11px] font-bold text-[#111111] flex items-center gap-1 cursor-pointer transition whitespace-nowrap"
                          >
                            {copiedPromptId === `v6-cheat-${idx}` ? <Check className="w-3 h-3 text-[#36A66A]" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedPromptId === `v6-cheat-${idx}` ? 'คัดลอกแล้ว' : 'คัดลอกตัวอย่าง Prompt'}</span>
                          </button>
                        </div>
                        <p className="text-[#555555] leading-relaxed">{row.sonicOutcome}</p>
                        <div className="text-[11px] font-mono text-[#111111] bg-white px-3 py-2 rounded-xl border border-[#E8E8E8]">
                          <span className="text-[#777777] font-sans font-semibold mr-1.5">คีย์เวิร์ดแนะนำ:</span>
                          {row.keywords.join(' · ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Thai Lyric Engineering */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#E8E8E8] space-y-2.5">
                    <h4 className="font-extrabold text-[#111111] text-sm">คณิตศาสตร์พยางค์ &amp; วรรคตอนคุมหายใจ</h4>
                    <div className="space-y-1.5">
                      {THAI_LYRIC_ENGINEERING_2026.syllableMath.map((item, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white border border-[#E8E8E8]">
                          <div className="flex items-center justify-between font-bold text-[#111111]">
                            <span>{item.meter}</span>
                            <span className="font-mono tabular-nums text-[11px]">{item.count}</span>
                          </div>
                          <p className="text-[11px] text-[#777777] mt-0.5">{item.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#E8E8E8] space-y-2.5">
                    <h4 className="font-extrabold text-[#111111] text-sm">ฉันทลักษณ์ร่วมสมัย &amp; 3 รูปแบบ Final Chorus</h4>
                    <ul className="space-y-1.5 text-[#555555] leading-relaxed">
                      {THAI_LYRIC_ENGINEERING_2026.rhymeAndChorusRules.map((rule, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#111111] font-bold">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 border-t border-[#E8E8E8] space-y-1">
                      <span className="font-bold text-[#111111] block">วรรคตอนคุมจังหวะร้อง:</span>
                      <div className="grid grid-cols-1 gap-1 text-[11px] text-[#555555]">
                        {THAI_LYRIC_ENGINEERING_2026.punctuationControl.map((p, i) => (
                          <div key={i}>
                            <span className="font-mono font-bold text-[#111111]">{p.symbol}</span> — {p.effect}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: ZERODAY DSP MASTERING & LUFS */}
            {activeTab === 'mastering' && (
              <div className="space-y-6 text-xs">
                {/* 3 WAV Formats Calibration */}
                <div className="space-y-2.5">
                  <h4 className="text-sm font-extrabold text-[#111111]">
                    มาตรฐานการส่งออกไฟล์เสียง ZeroDay True DSP Calibration Standards 2026 (16 / 24 / 32-Bit WAV)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {ZERODAY_DSP_CALIBRATION_STANDARDS.map(fmt => (
                      <div key={fmt.id} className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#E8E8E8] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-[#111111]">{fmt.formatName}</span>
                          <span className="px-2 py-0.5 rounded-md bg-[#111111] text-white font-mono font-bold text-[10px]">
                            {fmt.dynamicRange}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-[#555555]">{fmt.useCase}</p>
                        <div className="p-2.5 rounded-xl bg-white border border-[#E8E8E8] space-y-1 font-mono text-[11px]">
                          <div>Ceiling: <strong className="text-[#111111]">{fmt.ceilingDbTp}</strong></div>
                          <div>Dither: <strong className="text-[#111111]">{fmt.ditherMode}</strong></div>
                          <div>Target: <strong className="text-[#36A66A]">{fmt.targetLufs}</strong></div>
                        </div>
                        <p className="text-[11px] text-[#777777] leading-relaxed">{fmt.technicalNote}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 8-Stage Web Audio DSP Chain */}
                <div className="space-y-2.5">
                  <h4 className="text-sm font-extrabold text-[#111111]">
                    พารามิเตอร์ 8-Stage Web Audio API Live DSP Mastering Chain (SunoSong Studio Pro v2.6)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {ZERODAY_LIVE_DSP_CHAIN.map(stage => (
                      <div key={stage.stageOrder} className="p-3.5 rounded-2xl bg-[#F8F8F8] border border-[#E8E8E8] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#111111] text-white">
                            STAGE {stage.stageOrder}
                          </span>
                          <span className="font-mono font-extrabold text-[11px] text-[#36A66A]">
                            {stage.parameterValue}
                          </span>
                        </div>
                        <h5 className="font-extrabold text-[#111111] text-xs">{stage.moduleName}</h5>
                        <p className="text-[11px] text-[#555555] leading-relaxed">{stage.sonicPurpose}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform LUFS Specs */}
                <div className="space-y-2.5">
                  <h4 className="text-sm font-extrabold text-[#111111]">
                    เป้าหมายความดังแยกตามแพลตฟอร์มสตรีมมิง (Platform LUFS &amp; True Peak)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PLATFORM_MASTERING_SPECS.map(spec => (
                      <div key={spec.platform} className="p-5 rounded-2xl bg-[#F8F8F8] border border-[#E8E8E8] space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-[#E8E8E8]">
                          <div>
                            <h4 className="font-extrabold text-[#111111] text-base">{spec.platform}</h4>
                            <span className="text-xs text-[#777777]">{spec.purpose}</span>
                          </div>
                          <div className="text-right">
                            <span className="px-2.5 py-1 rounded-lg bg-[#111111] text-white font-mono font-bold text-xs">
                              {spec.lufs}
                            </span>
                            <span className="block text-[10px] text-[#777777] mt-1 font-mono">
                              Peak: {spec.truePeak}
                            </span>
                          </div>
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#555555]">
                          {spec.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#111111] font-bold">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: 22 SUNOMV VIRAL STYLES */}
            {activeTab === 'sunomv' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#E8E8E8] text-xs text-[#555555]">
                  รวมครบทั้ง <strong className="text-[#111111]">22 สไตล์ภาพไวรัลสำหรับ SunoMV &amp; Music Video AI</strong> จากรายงานวิจัย เพื่อจับคู่ภาพเคลื่อนไหวให้ตรงกับอารมณ์เพลงและกลุ่มเป้าหมายบน TikTok / YouTube Shorts
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {SUNOMV_VIRAL_STYLES.map(style => (
                    <div
                      key={style.id}
                      className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#E8E8E8] hover:border-[#111111] transition flex flex-col justify-between gap-2"
                    >
                      <div>
                        <h4 className="font-extrabold text-sm text-[#111111] mb-1">{style.name}</h4>
                        <p className="text-xs text-[#777777] leading-snug">{style.lane}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(`${style.name} aesthetic music video, ${style.lane}`, style.id)}
                        className="self-start text-[11px] font-bold text-[#111111] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedPromptId === style.id ? <Check className="w-3 h-3 text-[#36A66A]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedPromptId === style.id ? 'คัดลอกแล้ว' : 'คัดลอก Visual Prompt'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: V6 MODELS */}
            {activeTab === 'v6-models' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SUNO_V6_MODELS.map(model => (
                  <div key={model.id} className="p-5 rounded-2xl bg-[#F8F8F8] border border-[#E8E8E8] flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-extrabold text-[#111111] text-base">{model.name}</h4>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-[#111111] text-white">
                          {model.id}
                        </span>
                      </div>
                      <p className="text-xs text-[#111111] font-bold mb-2">{model.tagline}</p>
                      <p className="text-xs text-[#555555] leading-relaxed mb-3">{model.description}</p>
                    </div>
                    <div className="space-y-2 pt-3 border-t border-[#E8E8E8] text-xs">
                      <div>
                        <span className="text-[#777777] block font-bold">เหมาะที่สุดสำหรับ:</span>
                        <span className="text-[#111111]">{model.bestFor}</span>
                      </div>
                      <div>
                        <span className="text-[#777777] block font-bold">ทริคการเขียน Prompt:</span>
                        <span className="text-[#555555] italic">{model.recommendedPromptingStyle}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 8: WORKFLOW, STEMS, COPYRIGHT & MARKET TESTING LOOP */}
            {activeTab === 'workflow' && (
              <div className="space-y-4 text-xs text-[#555555]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#F8F8F8] border border-[#E8E8E8] space-y-2.5">
                    <h4 className="font-bold text-[#111111] text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> เทคนิคการใช้ฟังก์ชัน Extend &amp; โซ่คำสั่งจบเพลง
                    </h4>
                    <ul className="space-y-1.5">
                      {SUNO_V6_PRO_RULES.extendFunctionRules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#111111] font-bold">{idx + 1}.</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F8F8F8] border border-[#E8E8E8] space-y-2.5">
                    <h4 className="font-bold text-[#111111] text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4" /> Suno Studio DAW, 12+ Stems &amp; Vocal Ducking
                    </h4>
                    <ul className="space-y-1.5">
                      {SUNO_V6_PRO_RULES.stemSeparationTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#111111] font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#F8F8F8] border border-[#E8E8E8] space-y-2.5">
                    <h4 className="font-bold text-[#111111] text-sm">
                      6-Step Market Testing &amp; Viral Release Loop
                    </h4>
                    <ul className="space-y-1.5">
                      {SUNO_V6_PRO_RULES.marketTestingLoop.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#111111] font-bold">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#36A66A]/10 border border-[#36A66A]/30 text-[#111111] space-y-2.5">
                    <div className="flex items-center gap-2 font-bold text-[#36A66A] text-sm">
                      <ShieldCheck className="w-4 h-4" /> Checklist ความปลอดภัยด้านลิขสิทธิ์ 5 ข้อ (Copyright Safety)
                    </div>
                    <ul className="space-y-1.5 text-xs">
                      {SUNO_V6_PRO_RULES.copyrightSafetyChecklist.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-[#F8F8F8] border-t border-[#E8E8E8] text-xs text-[#777777]">
            <span>ฐานข้อมูลวิจัยฉบับสมบูรณ์ 5 เอกสาร · ซิงค์ร่วมกับ Cloud Firestore อัตโนมัติ</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#111111] text-white font-bold transition cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
