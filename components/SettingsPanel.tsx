import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { X, Palette, Type, Check, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { UserPreferences } from '../types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ThemeOption {
  id: UserPreferences['theme'];
  name: string;
  tagline: string;
  badge: string;
  previewBg: string;
  colors: string[];
}

const THEMES: ThemeOption[] = [
  {
    id: 'light',
    name: 'Neurova Monochrome Luxury (Light Minimal)',
    tagline: 'โทนสว่างขาว-ดำ-เทาเงิน เรียบหรู สะอาดตา สไตล์สตูดิโอยุคใหม่',
    badge: 'DEFAULT',
    previewBg: 'bg-[#F4F4F4]',
    colors: ['#F4F4F4', '#FFFFFF', '#111111', '#36A66A']
  },
  {
    id: 'charcoal',
    name: 'Frosted Matte Dark Studio',
    tagline: 'โทนมืดกระจกด้านสีเทาหม่น สำหรับทำงานในห้องมืด',
    badge: 'DARK',
    previewBg: 'bg-[#0b0d12]',
    colors: ['#0b0d12', '#161b24', '#f1f3f5', '#94a3b8']
  },
  {
    id: 'midnight',
    name: 'Midnight Cyber Studio',
    tagline: 'โทนน้ำเงินเข้มห้องอัดเสียง',
    badge: 'STUDIO',
    previewBg: 'bg-[#080c14]',
    colors: ['#080c14', '#151d30', '#38bdf8', '#818cf8']
  }
];

const FONT_SIZES = [
  { id: 'small', name: 'กะทัดรัด (14px)' },
  { id: 'medium', name: 'มาตรฐาน (16px)' },
  { id: 'large', name: 'สบายตา (18px)' },
] as const;

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, fontSize, setFontSize } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="w-full max-w-lg bg-white border border-[#E8E8E8] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#111111]"
          >
            <div className="p-5 border-b border-[#E8E8E8] flex items-center justify-between bg-[#F8F8F8]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#111111] text-white">
                  <Sliders size={18} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#111111]">
                    ตั้งค่าการแสดงผล & ขนาดตัวอักษร
                  </h2>
                  <p className="text-xs text-[#777777]">ปรับแต่งหน้าจอ MIX AI SONG Studio</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#E8E8E8] text-[#777777] hover:text-[#111111] border border-[#E8E8E8] flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar flex-1">
              <section className="space-y-2.5">
                <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                  <Palette size={14} />
                  เลือกโทนสีสตูดิโอ
                </h3>

                <div className="space-y-2">
                  {THEMES.map((t) => {
                    const isSelected = theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={clsx(
                          "w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer",
                          isSelected
                            ? "bg-white border-2 border-[#111111] shadow-sm"
                            : "bg-[#F8F8F8] hover:bg-white border-[#E8E8E8]"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-[#111111]">{t.name}</h4>
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-[#111111] text-white">
                                {t.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#777777] mt-0.5">{t.tagline}</p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0">
                              <Check size={12} />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                  <Type size={14} />
                  ขนาดตัวอักษร
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {FONT_SIZES.map((size) => {
                    const isSelected = fontSize === size.id;
                    return (
                      <button
                        key={size.id}
                        onClick={() => setFontSize(size.id)}
                        className={clsx(
                          "py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition cursor-pointer",
                          isSelected
                            ? "bg-[#111111] border-[#111111] text-white"
                            : "bg-[#F8F8F8] border-[#E8E8E8] text-[#111111] hover:bg-white"
                        )}
                      >
                        {size.name}
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="p-4 bg-[#F8F8F8] border-t border-[#E8E8E8] flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#111111] text-white font-bold text-xs cursor-pointer"
              >
                บันทึก & ปิดหน้าต่าง
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
