import React, { useState, useEffect } from 'react';
import { SONG_STYLE_PRESETS, SongStylePreset, getRandomFive } from '../data/presetData';
import { X, Dices, Copy, Check, Music, Search, ArrowRight, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';

interface SongStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyStyle: (preset: SongStylePreset) => void;
}

export const SongStyleModal: React.FC<SongStyleModalProps> = ({
  isOpen,
  onClose,
  onApplyStyle,
}) => {
  const [displayedStyles, setDisplayedStyles] = useState<SongStylePreset[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    if (isOpen) {
      setDisplayedStyles(getRandomFive(SONG_STYLE_PRESETS));
      setSearchTerm('');
      setSelectedCategory('All');
    }
  }, [isOpen]);

  const handleReshuffle = () => {
    let source = SONG_STYLE_PRESETS;
    if (selectedCategory !== 'All') {
      source = SONG_STYLE_PRESETS.filter(s => s.genre.toLowerCase().includes(selectedCategory.toLowerCase()));
      if (source.length < 5) source = SONG_STYLE_PRESETS;
    }
    setDisplayedStyles(getRandomFive(source));
  };

  const handleCopyPrompt = (id: string, promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = ['All', 'Pop', 'Luk Thung', 'Molam', 'Isan Indie', 'R&B', 'Hip-hop', 'Rock', 'Electronic'];

  const filteredAll = SONG_STYLE_PRESETS.filter(s => {
    const matchesSearch = searchTerm === '' ||
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.stylePrompt.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' ||
      s.genre.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const listToShow = searchTerm ? filteredAll.slice(0, 5) : displayedStyles;

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
              <Wand2 size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#111111]">
                คลังตัวอย่างสไตล์ดนตรี (120 สไตล์)
              </h3>
              <p className="text-[11px] text-[#777777]">
                คลิก "ใช้สไตล์นี้" เพื่อส่งแนวเพลง อารมณ์ คาแรกเตอร์เสียงร้อง และ Style Prompt เข้าสู่ฟอร์มทันที
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
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSearchTerm('');
                    let source = SONG_STYLE_PRESETS;
                    if (cat !== 'All') {
                      source = SONG_STYLE_PRESETS.filter(s => s.genre.toLowerCase().includes(cat.toLowerCase()));
                      if (source.length === 0) source = SONG_STYLE_PRESETS;
                    }
                    setDisplayedStyles(getRandomFive(source));
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#111111] text-white'
                      : 'bg-[#F4F4F4] text-[#555555] hover:text-[#111111] border border-[#E8E8E8]'
                  }`}
                >
                  {cat === 'All' ? 'ทั้งหมด (120)' : cat}
                </button>
              ))}
            </div>

            <button
              onClick={handleReshuffle}
              className="px-3 py-1.5 bg-[#F4F4F4] hover:bg-[#E8E8E8] text-[#111111] border border-[#E8E8E8] rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Dices size={15} />
              <span>สุ่ม 5 รายการใหม่</span>
            </button>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input
              type="text"
              placeholder="ค้นหาสไตล์ดนตรี เช่น Luk Thung, City Pop, R&B, ชิลๆ..."
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

        {/* Style Cards List */}
        <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1 flex-1 min-h-0">
          {listToShow.length === 0 ? (
            <div className="text-center py-8 text-[#777777] text-xs">
              ไม่พบสไตล์ดนตรีที่ตรงกับการค้นหา ลองค้นด้วยคำอื่น
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
                        <Music size={13} />
                        {item.title}
                      </span>
                      <span className="text-[10px] bg-white text-[#111111] px-2 py-0.5 rounded-full font-bold border border-[#E8E8E8]">
                        {item.genre}
                      </span>
                      <span className="text-[10px] bg-white text-[#555555] px-2 py-0.5 rounded-full font-medium border border-[#E8E8E8]">
                        {item.artist}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#555555] mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onApplyStyle(item);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#222222] text-white font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>ใช้สไตล์นี้</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="bg-white border border-[#E8E8E8] p-2.5 rounded-xl flex items-center justify-between gap-2">
                  <div className="text-[11px] text-[#555555] font-mono overflow-x-auto custom-scrollbar py-0.5">
                    {item.stylePrompt}
                  </div>
                  <button
                    onClick={() => handleCopyPrompt(item.id, item.stylePrompt)}
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
          <span>แสดง 5 จากทั้งหมด {SONG_STYLE_PRESETS.length} รายการ</span>
          <button
            onClick={handleReshuffle}
            className="text-[#111111] hover:underline flex items-center gap-1 cursor-pointer font-bold"
          >
            <Dices size={12} />
            <span>สุ่มอีก 5 สไตล์</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
