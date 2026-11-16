import React, { useState, useEffect } from 'react';
import { INSPIRATION_PRESETS, InspirationPreset, getRandomFive } from '../data/presetData';
import { X, Sparkles, Dices, Copy, Check, Search, ArrowRight, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

interface InspirationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyInspiration: (preset: InspirationPreset) => void;
}

export const InspirationModal: React.FC<InspirationModalProps> = ({
  isOpen,
  onClose,
  onApplyInspiration,
}) => {
  const [displayedIdeas, setDisplayedIdeas] = useState<InspirationPreset[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('All');

  useEffect(() => {
    if (isOpen) {
      setDisplayedIdeas(getRandomFive(INSPIRATION_PRESETS));
      setSearchTerm('');
      setSelectedMood('All');
    }
  }, [isOpen]);

  const handleReshuffle = () => {
    let source = INSPIRATION_PRESETS;
    if (selectedMood !== 'All') {
      source = INSPIRATION_PRESETS.filter(i => i.mood.toLowerCase().includes(selectedMood.toLowerCase()) || i.theme.toLowerCase().includes(selectedMood.toLowerCase()));
      if (source.length < 5) source = INSPIRATION_PRESETS;
    }
    setDisplayedIdeas(getRandomFive(source));
  };

  const handleCopySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const moodsList = ['All', 'รัก', 'เหงา', 'คิดถึง', 'อกหัก', 'อีสาน', 'สนุกสนาน', 'อบอุ่น', 'กวนๆ'];

  const filteredAll = INSPIRATION_PRESETS.filter(i => {
    const matchesSearch = searchTerm === '' ||
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.story.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.sampleLyrics.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMood = selectedMood === 'All' ||
      i.mood.toLowerCase().includes(selectedMood.toLowerCase()) ||
      i.theme.toLowerCase().includes(selectedMood.toLowerCase());

    return matchesSearch && matchesMood;
  });

  const listToShow = searchTerm ? filteredAll.slice(0, 5) : displayedIdeas;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="bg-white border border-[#E8E8E8] rounded-3xl w-full max-w-3xl p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col text-[#111111]"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#E8E8E8] pb-3 flex-none">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#111111] text-white">
              <Lightbulb size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#111111]">
                คลังแรงบันดาลใจ & พรอมต์ไอเดีย (120 ไอเดีย)
              </h3>
              <p className="text-[11px] text-[#777777]">
                คลิก "ใช้ไอเดียนี้" เพื่อส่งหัวข้อ เรื่องราว อารมณ์ และแนวเพลงแนะนำเข้าสู่ฟอร์มแต่งเพลง
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#777777] hover:text-[#111111] hover:bg-[#F4F4F4] rounded-full transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Controls */}
        <div className="space-y-2.5 flex-none">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 max-w-full">
              {moodsList.map(m => (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedMood(m);
                    setSearchTerm('');
                    let source = INSPIRATION_PRESETS;
                    if (m !== 'All') {
                      source = INSPIRATION_PRESETS.filter(i => i.mood.toLowerCase().includes(m.toLowerCase()) || i.theme.toLowerCase().includes(m.toLowerCase()));
                      if (source.length === 0) source = INSPIRATION_PRESETS;
                    }
                    setDisplayedIdeas(getRandomFive(source));
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                    selectedMood === m
                      ? 'bg-[#111111] text-white'
                      : 'bg-[#F4F4F4] text-[#555555] hover:text-[#111111] border border-[#E8E8E8]'
                  }`}
                >
                  {m === 'All' ? 'ทั้งหมด (120)' : m}
                </button>
              ))}
            </div>

            <button
              onClick={handleReshuffle}
              className="px-3 py-1.5 bg-[#F4F4F4] hover:bg-[#E8E8E8] text-[#111111] border border-[#E8E8E8] rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Dices size={15} />
              <span>สุ่ม 5 ไอเดียใหม่</span>
            </button>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input
              type="text"
              placeholder="ค้นหาไอเดีย เช่น รถไฟฟ้า, คิดฮอดบ้าน, อกหัก, คาเฟ่, เพื่อน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl pl-9 pr-8 py-2 text-xs text-[#111111] placeholder-[#777777] focus:outline-none focus:border-[#111111] focus:bg-white transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#111111] text-xs cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Ideas List */}
        <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1 flex-1 min-h-0">
          {listToShow.length === 0 ? (
            <div className="text-center py-8 text-[#777777] text-xs">
              ไม่พบไอเดียที่ตรงกับการค้นหา ลองค้นหาด้วยคำอื่น
            </div>
          ) : (
            listToShow.map((item) => (
              <div
                key={item.id}
                className="bg-[#F8F8F8] border border-[#E8E8E8] p-3.5 rounded-2xl space-y-2.5 hover:border-[#BDBDBD] transition"
              >
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                        <Sparkles size={13} />
                        {item.title}
                      </span>
                      <span className="text-[10px] bg-white text-[#111111] px-2 py-0.5 rounded-full font-bold border border-[#E8E8E8]">
                        {item.mood}
                      </span>
                      <span className="text-[10px] bg-white text-[#555555] px-2 py-0.5 rounded-full font-semibold border border-[#E8E8E8]">
                        {item.recommendedGenre}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#111111] font-semibold mt-1">
                      ธีม: {item.theme}
                    </p>
                    <p className="text-[11px] text-[#555555] mt-0.5 leading-relaxed">
                      {item.story}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onApplyInspiration(item);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#222222] text-white font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>ใช้ไอเดียนี้</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="bg-white border border-[#E8E8E8] p-2.5 rounded-xl flex items-center justify-between gap-2">
                  <div className="text-[11px] text-[#555555] italic truncate py-0.5">
                    "{item.sampleLyrics}"
                  </div>
                  <button
                    onClick={() => handleCopySnippet(item.id, item.sampleLyrics)}
                    className="px-2.5 py-1 bg-[#F4F4F4] hover:bg-[#E8E8E8] text-[#111111] border border-[#E8E8E8] rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer shrink-0 transition"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check size={12} className="text-[#36A66A]" />
                        <span>คัดลอกแล้ว</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>คัดลอก</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-[#E8E8E8] text-[11px] text-[#777777] flex-none">
          <span>แสดง 5 จากทั้งหมด {INSPIRATION_PRESETS.length} รายการ</span>
          <button
            onClick={handleReshuffle}
            className="text-[#111111] hover:underline flex items-center gap-1 cursor-pointer font-bold"
          >
            <Dices size={12} />
            <span>สุ่มอีก 5 ไอเดีย</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
