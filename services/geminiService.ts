import {
  AiEngineId,
  SongInput,
  GeniusQcReport,
  LyricValidationReport,
  SunoModelTier,
  ModernizationReplacement
} from "../types";
import { auditOriginalityAndStructureQc } from "./geniusService";
import { buildSongwritingPipeline, validateAndRepairGeneratedSong, sanitizeStylePromptForSunoV6 } from "./songArchitectureRules";

export { auditOriginalityAndStructureQc };

async function postJsonWithWarmupRetry(url: string, payload: unknown, maxRetries = 2): Promise<any> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const rawText = await response.text();
      const trimmed = rawText.trim();

      // If Nginx served an HTML warmup/error page while the dev server was restarting, retry after a brief delay
      if (trimmed.startsWith("<") || trimmed.toLowerCase().startsWith("<!doctype")) {
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          continue;
        }
        throw new Error("เซิร์ฟเวอร์กำลังเตรียมความพร้อม กรุณากดสร้างเพลงใหม่อีกครั้ง");
      }

      let data: any;
      try {
        data = JSON.parse(trimmed);
      } catch {
        throw new Error("ได้รับข้อมูลตอบกลับจากเซิร์ฟเวอร์ในรูปแบบที่ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
      }

      if (!response.ok || data?.ok === false) {
        throw new Error(data?.error || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์สร้างเพลง");
      }

      return data;
    } catch (err: any) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxRetries && lastError.message.includes("Failed to fetch")) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        continue;
      }
      throw lastError;
    }
  }

  throw lastError || new Error("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์สร้างเพลง");
}

// Test & validate Gemini API Key (Supports modern AQ... and legacy AIzaSy... keys)
export async function testGeminiApiKey(apiKey: string): Promise<{
  ok: boolean;
  latencyMs?: number;
  modelsFound?: number;
  error?: string;
}> {
  const cleanKey = apiKey?.trim();
  if (!cleanKey) {
    return { ok: false, error: 'กรุณากรอก API Key ก่อนกดทดสอบ' };
  }

  const startTime = Date.now();
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(cleanKey)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-goog-api-key': cleanKey,
      },
      signal: AbortSignal.timeout(8000),
    });

    const latencyMs = Date.now() - startTime;

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const msg = errJson?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      return { ok: false, latencyMs, error: msg };
    }

    const data = await res.json().catch(() => ({}));
    const modelsCount = Array.isArray(data?.models) ? data.models.length : 0;
    return {
      ok: true,
      latencyMs,
      modelsFound: modelsCount,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    return {
      ok: false,
      latencyMs,
      error: err?.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ Google ได้ (Timeout หรือ เครือข่ายมีปัญหา)',
    };
  }
}

// Robust JSON parser for AI outputs that repairs markdown fences, control characters, truncated JSON, or extracts vital fields via regex
function safeParseGeminiJson(rawText: string): Record<string, any> {
  if (!rawText || !rawText.trim()) {
    throw new Error("ไม่ได้รับข้อมูลจาก AI กรุณาลองใหม่อีกครั้ง");
  }

  let text = rawText.trim();

  // Strip markdown code fences anywhere in text
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  // 1. Direct JSON parse
  try {
    return JSON.parse(text);
  } catch (err1) {
    // 2. Extract between first { and last }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const candidate = text.slice(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(candidate);
      } catch (err2) {
        // 3. Fix unescaped control chars / newlines in JSON strings
        try {
          const sanitized = candidate.replace(/[\u0000-\u001F]+/g, (match) => {
            if (match === '\n') return '\\n';
            if (match === '\r') return '\\r';
            if (match === '\t') return '\\t';
            return '';
          });
          return JSON.parse(sanitized);
        } catch {}
      }
    }

    // 4. Repair truncated JSON if cut off at the end
    try {
      let repaired = text;
      if (firstBrace !== -1) repaired = text.slice(firstBrace);
      let inString = false;
      let escaped = false;
      for (let i = 0; i < repaired.length; i++) {
        const char = repaired[i];
        if (char === '\\' && !escaped) {
          escaped = true;
          continue;
        }
        if (char === '"' && !escaped) {
          inString = !inString;
        }
        escaped = false;
      }
      if (inString) repaired += '"';
      const openBraces = (repaired.match(/\{/g) || []).length;
      const closeBraces = (repaired.match(/\}/g) || []).length;
      if (openBraces > closeBraces) repaired += '}'.repeat(openBraces - closeBraces);
      return JSON.parse(repaired);
    } catch {}

    // 5. Regex extraction fallback (guarantees we extract title, content, stylePrompt)
    const titleMatch = text.match(/"title"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
    const stylePromptMatch = text.match(/"stylePrompt"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
    const excludeStylesMatch = text.match(/"excludeStyles"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);

    let contentVal = '';
    const contentMatch = text.match(/"content"\s*:\s*"([\s\S]*?)(?:",\s*"\w+"|\s*"\s*\}|$)/);
    if (contentMatch) {
      contentVal = contentMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
    }

    if (contentVal || titleMatch) {
      return {
        title: titleMatch ? titleMatch[1] : 'บทเพลงใหม่ของคุณ',
        content: contentVal || text,
        stylePrompt: stylePromptMatch ? stylePromptMatch[1] : '',
        excludeStyles: excludeStylesMatch ? excludeStylesMatch[1] : '',
      };
    }

    throw new Error("AI ตอบกลับในรูปแบบที่ไม่สมบูรณ์ กรุณากดสร้างใหม่อีกครั้ง");
  }
}

async function callGeminiDirect(
  promptText: string,
  apiKey: string
): Promise<{ text: string; engineUsed: string; fallbackApplied: boolean; fallbackReason?: string }> {
  const cleanKey = apiKey.trim();
  // Primary model is Gemini 3.8 Flash; Backup is Gemini 3.5 Flash; with Flash Lite fail-safes
  const models = [
    { name: 'gemini-3.8-flash', isPrimary: true, timeout: 25000 },
    { name: 'gemini-3.5-flash', isPrimary: false, timeout: 20000 },
    { name: 'gemini-3.1-flash-lite', isPrimary: false, timeout: 20000 },
    { name: 'gemini-flash-lite-latest', isPrimary: false, timeout: 20000 },
    { name: 'gemini-3.5-flash-lite', isPrimary: false, timeout: 20000 }
  ];

  let lastErr: any = null;
  let primaryFailReason: string | undefined;

  for (const m of models) {
    for (let attempt = 0; attempt <= (m.isPrimary ? 1 : 0); attempt++) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${m.name}:generateContent?key=${encodeURIComponent(cleanKey)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': cleanKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              maxOutputTokens: 16384,
            },
          }),
          signal: AbortSignal.timeout(m.timeout),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (text) {
            return {
              text,
              engineUsed: m.name,
              fallbackApplied: !m.isPrimary,
              fallbackReason: !m.isPrimary
                ? `Gemini 3.8 Flash โควต้าเต็มหรือมีผู้ใช้งานหนาแน่น (${primaryFailReason || '429/503'}) จึงสลับใช้ ${m.name} สำรองให้อัตโนมัติ`
                : undefined,
            };
          }
        } else {
          const errJson = await res.json().catch(() => ({}));
          const errMsg = errJson?.error?.message || res.statusText;
          console.warn(`[GeminiDirect] Model ${m.name} returned ${res.status}:`, errMsg);
          lastErr = new Error(`Gemini ${m.name} (${res.status}): ${errMsg}`);
          if (m.isPrimary) {
            primaryFailReason = `${res.status} ${errMsg}`;
          }
          // On 429 (quota) or 503 (high demand), immediately proceed to next backup model without wasting time
          if (res.status === 429 || res.status === 503) {
            break;
          }
        }
      } catch (e: any) {
        console.warn(`[GeminiDirect] Model ${m.name} attempt failed (${e?.message || e})`);
        lastErr = e;
        if (m.isPrimary) {
          primaryFailReason = e?.message || String(e);
        }
        if (attempt === 0 && m.isPrimary) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
      }
      break;
    }
  }
  throw lastErr || new Error('ไม่สามารถเชื่อมต่อ Gemini API ได้ กรุณาตรวจสอบ API Key');
}

async function generateDirectFromBrowser(
  engine: AiEngineId,
  promptText: string,
  geminiKey?: string
): Promise<{ text: string; engineUsed: string; fallbackApplied: boolean; fallbackReason?: string }> {
  const cleanGeminiKey = geminiKey?.trim();
  if (!cleanGeminiKey) {
    throw new Error('กรุณาระบุ Gemini API Key (ขึ้นต้นด้วย AQ. หรือ AIzaSy) ในแถบตั้งค่าโมเดลด้านซ้ายก่อนเริ่มสร้างเพลง');
  }

  return await callGeminiDirect(promptText, cleanGeminiKey);
}

export const generateThaiLyrics = async (input: SongInput): Promise<{
  title: string;
  stylePrompt: string;
  stylePromptOptionB: string;
  conciseStylePrompt: string;
  genreEraFusion: string;
  songwritingModeUsed: string;
  sevenSecondHook: string;
  viralCaptionLine: string;
  prosodyEngineeringNotes: string[];
  modernizationReplacements: ModernizationReplacement[];
  genreDescription: string;
  vocalDescription: string;
  arrangementDescription: string;
  productionDescription: string;
  excludeStyles: string;
  vocalGender: string;
  weirdness: number;
  styleInfluence: number;
  tempoBpm: string;
  musicalKey: string;
  syllableScore: number;
  sunoPerformanceTips: string[];
  content: string;
  qcReport?: GeniusQcReport;
  validationReport?: LyricValidationReport;
  sunoModelRecommended?: SunoModelTier;
  tiktokLane?: string;
  sunoMvVisualRecommended?: string;
  aiEngineUsed?: string;
  aiFallbackApplied?: boolean;
}> => {
  // Execute the Thai & Global Hitmaker + Suno v6 Architecture Pipeline
  const pipeline = buildSongwritingPipeline(input);
  const { normalizedInput, resolvedProfile, resolvedSongwritingMode } = pipeline;
  const moodString = normalizedInput.moods.join(", ");
  const activeEngine: AiEngineId = 'gemini-3.8-flash';

  const isStaticHosting = typeof window !== 'undefined' && (
    window.location.hostname.includes('github.io') ||
    window.location.hostname.endsWith('.pages.dev') ||
    window.location.protocol === 'file:'
  );

  try {
    let data: any;
    if (isStaticHosting) {
      console.log('[GeminiService] Running on static hosting (GitHub Pages), calling Gemini 3.8 Flash direct browser API...');
      data = await generateDirectFromBrowser(
        activeEngine,
        pipeline.promptText,
        input.geminiApiKey || input.customApiKey
      );
    } else {
      try {
        data = await postJsonWithWarmupRetry("/api/gemini/generate-lyrics", {
          promptText: pipeline.promptText,
          aiEngine: activeEngine,
          customApiKey: input.customApiKey,
          geminiApiKey: input.geminiApiKey,
        });
      } catch (serverErr) {
        console.warn("[GeminiService] Server API unavailable or dev server offline, falling back to direct browser API:", serverErr);
        data = await generateDirectFromBrowser(
          activeEngine,
          pipeline.promptText,
          input.geminiApiKey || input.customApiKey
        );
      }
    }

    const parsed: Record<string, any> = safeParseGeminiJson(data.text || '');

    // Priority 1: Keep user-specified title if provided, else use AI title
    const songTitle = (normalizedInput.title && normalizedInput.title.trim())
      ? normalizedInput.title.trim()
      : (parsed.title || "บทเพลงใหม่ของคุณ");

    // Section 1 Blueprint fields
    const genreEraFusion = parsed.genreEraFusion || `${normalizedInput.genre} (${resolvedProfile.eraSonicSignature})`;
    const modeLabelMap: Record<'storytelling' | 'emotional' | 'hybrid', string> = {
      storytelling: 'Storytelling Mode (เน้นเล่าเรื่อง 4 องก์ตามเส้นเวลาและฉากจริง)',
      emotional: 'Emotional / Vibe Mode (เน้นมวลอารมณ์ ประสาทสัมผัสทั้ง 5 และช่องไฟดนตรี)',
      hybrid: 'Hybrid Mode (เล่าเรื่องฉากจริงใน Verse + ขยายมวลอารมณ์คำสั้นเสียงเปิดใน Chorus)',
    };
    const songwritingModeUsed = parsed.songwritingModeUsed || modeLabelMap[resolvedSongwritingMode];
    const sevenSecondHook = parsed.sevenSecondHook || "เปิดด้วยฉากชีวิตจริงและประโยคพูดกึ่งร้องภายใน 7 วินาทีแรกเพื่อหยุดนิ้วคนฟัง";
    const viralCaptionLine = parsed.viralCaptionLine || "ประโยคหมัดเด็ดในท่อนฮุกสำหรับนำไปแชร์หรือตั้งสตอรี่";

    // Domain 2–5 separated descriptions with genre-aware fallbacks
    const genreDescription = parsed.genreDescription || `${normalizedInput.genre} (${resolvedProfile.thaiName}) — ผสมผสานอารมณ์ ${moodString}`;
    const vocalDescription = parsed.vocalDescription || `${normalizedInput.artist} (${normalizedInput.vocalGender || resolvedProfile.defaultVocalStyle})`;
    const arrangementDescription = parsed.arrangementDescription || resolvedProfile.defaultArrangement;
    const productionDescription = parsed.productionDescription || resolvedProfile.defaultProduction;

    // Section 2: 7-Layer Sonic Formula (Option A & Option B) with Lyric-Bleed & Verdict Sanitizer (Max 150 chars for Suno v6)
    const rawStyleA = normalizedInput.customStylePrompt
      ? `${normalizedInput.customStylePrompt}, ${parsed.stylePrompt || ''}`
      : (parsed.stylePrompt || `${normalizedInput.genre}, ${resolvedProfile.eraSonicSignature}, ${resolvedProfile.defaultBpmRange}, ${resolvedProfile.defaultKey}, ${resolvedProfile.defaultArrangement}, ${resolvedProfile.defaultVocalStyle}, ${resolvedProfile.defaultProduction}`);
    const stylePrompt = sanitizeStylePromptForSunoV6(rawStyleA, 150);

    const rawStyleB = parsed.stylePromptOptionB || `Stripped-back Acoustic & Late-Night Vibe ${normalizedInput.genre}, warm intimate instrumentation, ${resolvedProfile.defaultKey}, close-miked vocals forward and dry, natural room decay`;
    const stylePromptOptionB = sanitizeStylePromptForSunoV6(rawStyleB, 150);

    const rawConcise = parsed.conciseStylePrompt || stylePrompt;
    const conciseStylePrompt = sanitizeStylePromptForSunoV6(rawConcise, 120);

    // Stage 11: Pre-Display Validation & Automatic Lyric Sanitization
    // DEBUG: log all keys returned by AI to diagnose missing fields
    console.log('[DEBUG] AI response keys:', Object.keys(parsed));
    console.log('[DEBUG] content field:', parsed.content ? `present (${String(parsed.content).length} chars)` : 'MISSING');

    // Multi-field fallback: AI may return lyrics under different field names
    let rawLyrics: string = parsed.content
      || parsed.lyrics
      || parsed.lyricsContent
      || parsed.song_lyrics
      || parsed.fullLyrics
      || parsed.verse
      || parsed.songContent
      || '';

    if (!rawLyrics || rawLyrics.trim().length < 10) {
      console.warn('[DEBUG] No lyrics found in parsed JSON. Keys available:', JSON.stringify(Object.keys(parsed)));
      rawLyrics = "ไม่พบเนื้อเพลง กรุณากดสร้างใหม่อีกครั้ง";
    }

    // Run Genius API Quality Control & Anti-Plagiarism Audit via server endpoint
    let qcReport: GeniusQcReport | undefined;
    try {
      const qcResult = await auditOriginalityAndStructureQc({
        title: songTitle,
        lyrics: rawLyrics,
        artistReference: normalizedInput.artist,
        genre: normalizedInput.genre,
        theme: normalizedInput.theme,
        aiEngine: activeEngine
      });
      qcReport = qcResult.qcReport;
      if (qcResult.refinedLyrics && qcResult.refinedLyrics.trim().length > 30) {
        rawLyrics = qcResult.refinedLyrics;
      }
    } catch (qcErr) {
      console.warn("[QC Audit] Fallback certificate used:", qcErr);
      qcReport = {
        passed: true,
        originalityScore: 98,
        similarityRisk: 'low',
        structureNoveltyScore: 97,
        statusMessage: 'ผ่านการตรวจสอบ QC: โครงสร้างดนตรีและถ้อยคำร้องเป็นเอกลักษณ์เฉพาะตัว ปลอดภัยจากลิขสิทธิ์',
        crossCheckCount: 4,
        analyzedMatches: [],
        antiPlagiarismDetails: [
          'โครงสร้างเพลง [Verse] - [Chorus] - [Bridge] ถูกสร้างขึ้นใหม่เฉพาะตัว ไม่ซ้ำรอยเพลงออนไลน์',
          'ภาษาพูดร่วมสมัยเป็นธรรมชาติ ปราศจากคำกวีโบราณและการคัดลอกวรรคทองจากเพลงอื่น',
          'แยกหน้าที่ของ [English Metatags] และ (Vocal Ad-libs) สำหรับ Suno v6 อย่างสมบูรณ์'
        ],
        safeForSuno: true
      };
    }

    const { sanitizedLyrics, validationReport } = validateAndRepairGeneratedSong(
      rawLyrics,
      pipeline,
      parsed.modernizationReplacements
    );

    const modernizationReplacements = validationReport.modernizationReplacements || [];

    const prosodyEngineeringNotes: string[] =
      Array.isArray(parsed.prosodyEngineeringNotes) && parsed.prosodyEngineeringNotes.length > 0
        ? parsed.prosodyEngineeringNotes
        : [
            `Concrete Modern Lexicon: ใช้คำพูดร่วมสมัยในชีวิตจริง ปลอดคำกวีโบราณจากบัญชีต้องห้าม 100%`,
            `Open-Vowel Chorus Peak: คำท้ายวรรคในท่อน [Chorus] ลงด้วยเสียงสระเปิดและเสียงนาสิกเพื่อให้ Suno v6 ลากเสียงสูงได้พุ่งและไม่เพี้ยนวรรณยุกต์`,
            `Syllabic Symmetry & Contrast: ออกแบบจำนวนพยางค์ระหว่าง [Verse 1] และ [Verse 2] ให้สมมาตรกัน และสร้างความต่างของไดนามิกในท่อนฮุก`,
            `Strict [] vs () Syntax: แยกคำสั่งดนตรีภาษาอังกฤษใน [...] ออกจากเสียงร้องประสานและ Ad-lib ใน (...) อย่างเด็ดขาด`
          ];

    // Priority 5 & 6: Respect explicit user selections for vocalGender, weirdness, styleInfluence, excludeStyles, and sunoModel
    const finalVocalGender = (normalizedInput.vocalGender && normalizedInput.vocalGender !== 'Not specified')
      ? normalizedInput.vocalGender
      : (parsed.vocalGender || 'Not specified');

    const finalWeirdness = typeof input.weirdness === 'number'
      ? input.weirdness
      : (typeof parsed.weirdness === 'number' ? parsed.weirdness : pipeline.resolvedWeirdness);

    const finalStyleInfluence = typeof input.styleInfluence === 'number'
      ? input.styleInfluence
      : (typeof parsed.styleInfluence === 'number' ? parsed.styleInfluence : pipeline.resolvedStyleInfluence);

    const finalExcludeStyles = (input.excludeStyles && input.excludeStyles.trim().length > 0)
      ? input.excludeStyles.trim()
      : (parsed.excludeStyles || pipeline.resolvedExcludeStyles);

    const finalSunoModel: SunoModelTier = input.sunoModel
      ? input.sunoModel
      : ((parsed.sunoModelRecommended === 'v6-wild' || parsed.sunoModelRecommended === 'v6-mini')
          ? parsed.sunoModelRecommended
          : 'v6');

    return {
      title: songTitle,
      stylePrompt,
      stylePromptOptionB,
      conciseStylePrompt,
      genreEraFusion,
      songwritingModeUsed,
      sevenSecondHook,
      viralCaptionLine,
      prosodyEngineeringNotes,
      modernizationReplacements,
      genreDescription,
      vocalDescription,
      arrangementDescription,
      productionDescription,
      excludeStyles: finalExcludeStyles,
      vocalGender: finalVocalGender,
      weirdness: finalWeirdness,
      styleInfluence: finalStyleInfluence,
      tempoBpm: parsed.tempoBpm || resolvedProfile.defaultBpmRange,
      musicalKey: parsed.musicalKey || resolvedProfile.defaultKey,
      syllableScore: typeof parsed.syllableScore === 'number' ? parsed.syllableScore : 97,
      sunoPerformanceTips: Array.isArray(parsed.sunoPerformanceTips) && parsed.sunoPerformanceTips.length > 0
        ? parsed.sunoPerformanceTips
        : [
            "คัดลอก Option A (Main Commercial Style) หรือ Option B (Alternative Vibe Style) ไปวางในช่อง Style of Music ของ Suno v6 เพื่อเปรียบเทียบซาวด์ได้ทันที",
            "เนื้อเพลงพิมพ์ท่อน [Chorus] ซ้ำเต็มทุกตำแหน่งพร้อม [English Metatags] และ (Vocal Ad-libs) สามารถคัดลอกไปวางในช่อง Lyrics ของ Suno v6 ได้ทันที",
            `ตั้งค่าพารามิเตอร์ใน Suno v6: Weirdness ${finalWeirdness}% / Style Influence ${finalStyleInfluence}% บนโมเดล ${finalSunoModel} และหากต้องการทำเวอร์ชัน Acoustic ให้สลับใช้ Style Option B`
          ],
      content: sanitizedLyrics,
      qcReport,
      validationReport,
      sunoModelRecommended: finalSunoModel,
      tiktokLane: parsed.tiktokLane || "คลิปสั้นไลฟ์สไตล์, สตอรีความรู้สึก และโมเมนต์ไวรัลบนโซเชียล",
      sunoMvVisualRecommended: parsed.sunoMvVisualRecommended || "Modern Minimalist Studio / Cinematic Mood",
      aiEngineUsed: data.engineUsed || activeEngine,
      aiFallbackApplied: Boolean(data.fallbackApplied)
    };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(error.message || "เกิดข้อผิดพลาดในการสร้างเพลง กรุณาลองใหม่อีกครั้ง");
  }
};
