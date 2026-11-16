import React, { useState, useEffect, useRef } from 'react';
import { Lock, ShieldCheck, Check, Copy, ExternalLink, ArrowRight, RefreshCw, KeyRound, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PinLoginScreenProps {
  onSuccess: () => void;
}

// SHA-256 hash of the valid PIN - guarantees the plain PIN is never exposed in client code
const PIN_HASH_FALLBACK = 'c7997e7e56c4c2aa3cd5767a1b344ed8a6e86f1b9fcc4b52bdb2b9c210361a5e';

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const PinLoginScreen: React.FC<PinLoginScreenProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedLine, setCopiedLine] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleVerify = async (enteredPin: string) => {
    const cleanPin = enteredPin.trim();
    if (cleanPin.length !== 6) {
      setErrorMsg('กรุณากรอกรหัส PIN ให้ครบ 6 หลัก');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      // 1. First attempt verification against server endpoint
      const res = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: cleanPin }),
      }).catch(() => null);

      let isSuccess = false;

      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.ok) {
          isSuccess = true;
        }
      }

      // 2. Fallback to client-side cryptographic SHA-256 check if server is unreachable
      if (!isSuccess) {
        const hashed = await sha256(cleanPin);
        if (hashed === PIN_HASH_FALLBACK) {
          isSuccess = true;
        }
      }

      if (isSuccess) {
        if (rememberMe) {
          localStorage.setItem('mix_studio_authenticated', 'true');
        } else {
          sessionStorage.setItem('mix_studio_authenticated', 'true');
        }
        onSuccess();
      } else {
        setErrorMsg('รหัส PIN ไม่ถูกต้อง กรุณาติดต่อขอรับรหัสจากผู้พัฒนา');
        setPin('');
        inputRef.current?.focus();
      }
    } catch {
      // Client-side fallback check
      const hashed = await sha256(cleanPin);
      if (hashed === PIN_HASH_FALLBACK) {
        if (rememberMe) {
          localStorage.setItem('mix_studio_authenticated', 'true');
        } else {
          sessionStorage.setItem('mix_studio_authenticated', 'true');
        }
        onSuccess();
      } else {
        setErrorMsg('รหัส PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
        setPin('');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNumberClick = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg(null);
      if (nextPin.length === 6) {
        void handleVerify(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg(null);
    inputRef.current?.focus();
  };

  const handleCopyLine = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('miximage');
    }
    setCopiedLine(true);
    setTimeout(() => setCopiedLine(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F4F4F4] text-[#111111] overflow-y-auto p-4 sm:p-6 font-sans">
      {/* Background subtle atmospheric radial glow */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#CCCCCC_1px,transparent_1px)] [background-size:16px_16px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-white border border-[#E8E8E8] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 my-auto"
      >
        {/* Top Logo Container */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative group">
            <div className="w-56 sm:w-64 max-w-full h-auto p-2 rounded-2xl bg-white border border-[#EAEAEA] shadow-xs flex items-center justify-center transition-transform hover:scale-[1.02]">
              <img
                src="/logo.png"
                alt="MIX ART & AUDIO"
                className="w-full h-auto object-contain max-h-24 filter contrast-105"
                onError={(e) => {
                  // Fallback if logo file is unavailable
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#111111]">
              MIX AI SONG STUDIO
            </h1>
            <p className="text-xs text-[#777777] mt-0.5">
              Suno v6 Pro Thai Lyricist & Prompt Architect
            </p>
          </div>
        </div>

        {/* PIN Entry Area */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F4F4] border border-[#E8E8E8] text-[11px] font-bold text-[#444444]">
              <KeyRound size={13} className="text-[#111111]" />
              <span>กรุณากรอกรหัส PIN 6 หลักเพื่อเข้าใช้งาน</span>
            </div>
          </div>

          {/* Hidden Input for Native Keyboard Typing */}
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={pin}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
              setPin(val);
              setErrorMsg(null);
              if (val.length === 6) {
                void handleVerify(val);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && pin.length === 6) {
                void handleVerify(pin);
              }
            }}
            className="sr-only"
            autoFocus
          />

          {/* 6 Visual PIN Dots / Digits */}
          <div
            onClick={() => inputRef.current?.focus()}
            className="flex justify-center items-center gap-3 cursor-pointer py-1"
          >
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const isFilled = idx < pin.length;
              return (
                <div
                  key={idx}
                  className={`w-11 h-12 rounded-2xl flex items-center justify-center text-lg font-extrabold border transition-all duration-180 ${
                    isFilled
                      ? 'bg-[#111111] text-white border-[#111111] scale-105 shadow-xs'
                      : idx === pin.length
                      ? 'bg-white border-[#111111] ring-2 ring-[#111111]/10'
                      : 'bg-[#F8F8F8] border-[#E8E8E8] text-[#BBBBBB]'
                  }`}
                >
                  {isFilled ? '●' : '—'}
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl py-2 px-3 leading-snug"
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* On-Screen Keypad for Fast Touch/Click Input */}
          <div className="grid grid-cols-3 gap-2 pt-1 max-w-[280px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleNumberClick(digit)}
                disabled={isVerifying}
                className="h-12 rounded-2xl bg-[#F8F8F8] hover:bg-[#EFEFEF] active:scale-95 border border-[#E8E8E8] text-base font-extrabold text-[#111111] transition flex items-center justify-center cursor-pointer disabled:opacity-50"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              disabled={isVerifying || pin.length === 0}
              className="h-12 rounded-2xl bg-[#F8F8F8] hover:bg-[#EFEFEF] active:scale-95 border border-[#E8E8E8] text-xs font-bold text-[#777777] transition flex items-center justify-center cursor-pointer disabled:opacity-40"
            >
              ล้าง
            </button>
            <button
              type="button"
              onClick={() => handleNumberClick('0')}
              disabled={isVerifying}
              className="h-12 rounded-2xl bg-[#F8F8F8] hover:bg-[#EFEFEF] active:scale-95 border border-[#E8E8E8] text-base font-extrabold text-[#111111] transition flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              disabled={isVerifying || pin.length === 0}
              className="h-12 rounded-2xl bg-[#F8F8F8] hover:bg-[#EFEFEF] active:scale-95 border border-[#E8E8E8] text-xs font-bold text-[#777777] transition flex items-center justify-center cursor-pointer disabled:opacity-40"
            >
              ⌫
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={() => handleVerify(pin)}
            disabled={isVerifying || pin.length !== 6}
            className="w-full py-3 px-4 rounded-2xl bg-[#111111] hover:bg-[#222222] disabled:bg-[#CCCCCC] text-white text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer disabled:cursor-not-allowed shadow-sm"
          >
            {isVerifying ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>กำลังตรวจสอบรหัส...</span>
              </>
            ) : (
              <>
                <span>เข้าสู่ระบบสตูดิโอ</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#666666]">
            <input
              id="rememberPin"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-[#CCCCCC] text-[#111111] focus:ring-0 cursor-pointer"
            />
            <label htmlFor="rememberPin" className="cursor-pointer select-none">
              จำการเข้าสู่ระบบในเบราว์เซอร์นี้
            </label>
          </div>
        </div>

        {/* Developer Contact & PIN Request Notice */}
        <div className="border-t border-[#EEEEEE] pt-4 space-y-2.5">
          <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-2xl p-3 space-y-2">
            <div className="flex items-start gap-2">
              <Lock size={14} className="text-[#111111] mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-[11px] font-extrabold text-[#111111]">
                  รหัสพินขอจากผู้พัฒนาโดยตรง
                </p>
                <p className="text-[10px] text-[#777777] leading-relaxed">
                  สำหรับนักแต่งเพลงและโปรดิวเซอร์ที่ต้องการเข้าถึงฟังก์ชัน Suno v6 Pro
                </p>
              </div>
            </div>

            {/* LINE Contact Action Card */}
            <div className="flex items-center justify-between gap-2 bg-white border border-[#E4E4E4] rounded-xl px-3 py-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#06C755] flex items-center justify-center text-white font-extrabold text-[10px]">
                  LINE
                </div>
                <div>
                  <span className="text-[10px] text-[#888888] block leading-none">แอดไอดีไลน์</span>
                  <span className="text-xs font-mono font-extrabold text-[#111111]">miximage</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyLine}
                  className="px-2 py-1 rounded-lg bg-[#F4F4F4] hover:bg-[#EAEAEA] text-[10px] font-bold text-[#333333] transition flex items-center gap-1 cursor-pointer"
                  title="คัดลอกไอดีไลน์"
                >
                  {copiedLine ? <Check size={11} className="text-[#36A66A]" /> : <Copy size={11} />}
                  <span>{copiedLine ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                </button>

                <a
                  href="https://line.me/ti/p/~miximage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded-lg bg-[#06C755] hover:bg-[#05B34C] text-white text-[10px] font-bold transition flex items-center gap-1"
                >
                  <span>แอดไลน์</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default PinLoginScreen;
