import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, Schema } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

type AiEngineId = 'gemini-3.8-flash';

function isConfiguredSecret(val: string | undefined): boolean {
  return Boolean(val && val.trim() !== '' && val !== 'undefined' && val !== 'PLACEHOLDER_API_KEY');
}

function getGeminiClient(customApiKey?: string): GoogleGenAI {
  const apiKey = (customApiKey && isConfiguredSecret(customApiKey))
    ? customApiKey.trim()
    : process.env.GEMINI_API_KEY;
  if (!isConfiguredSecret(apiKey)) {
    throw new Error('ไม่พบ GEMINI_API_KEY ในระบบ กรุณาใส่ API Key ในช่องตั้งค่า หรือตรวจสอบ Secrets');
  }
  return new GoogleGenAI({
    apiKey: apiKey!,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function generateWithGeminiResilience(
  ai: GoogleGenAI,
  contents: string,
  responseSchema: Schema
): Promise<{ text: string; engineUsed: string }> {
  const customModel = process.env.GEMINI_MODEL?.trim();
  const modelsToTry = [
    ...(customModel ? [customModel] : []),
    'gemini-3.8-flash',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
  ].filter((m, idx, arr) => arr.indexOf(m) === idx);
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema,
        },
      });
      const text = (response.text || '').trim();
      if (text) {
        return { text, engineUsed: modelName };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[Server Gemini] Model ${modelName} failed, trying fallback if available:`, err?.message || err);
    }
  }

  throw lastError || new Error('ไม่สามารถเชื่อมต่อโมเดล Gemini ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง');
}

function buildJsonKeyHint(schema: Schema): string {
  const props = schema.properties || {};
  const keys = Object.entries(props).map(([key, def]: [string, any]) => {
    const desc = def?.description ? ` // ${def.description}` : '';
    return `"${key}": (${def?.type || 'STRING'})${desc}`;
  });
  return `Return strictly valid JSON object with these keys:\n{\n  ${keys.join('\n  ')}\n}`;
}

async function runAiGeneration(params: {
  aiEngine?: AiEngineId;
  contents: string;
  responseSchema: Schema;
  geminiApiKey?: string;
}): Promise<{ text: string; engineUsed: string; fallbackApplied: boolean; fallbackReason?: string }> {
  const ai = getGeminiClient(params.geminiApiKey);
  const geminiRes = await generateWithGeminiResilience(ai, params.contents, params.responseSchema);
  return {
    text: geminiRes.text,
    engineUsed: geminiRes.engineUsed,
    fallbackApplied: false,
  };
}

const LYRIC_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'Contemporary, memorable song title in Thai and/or English e.g. เลี้ยวเข้าซอยเดิม (Default Route)',
    },
    genreEraFusion: {
      type: Type.STRING,
      description: 'Section 1 Blueprint: Genre & Era Fusion description in Thai/English',
    },
    songwritingModeUsed: {
      type: Type.STRING,
      description: 'Section 1 Blueprint: Storytelling Mode, Emotional-Vibe Mode, or Hybrid Mode + 1-line psychological rationale in Thai',
    },
    sevenSecondHook: {
      type: Type.STRING,
      description: 'Section 1 Blueprint: 7-Second Stop-Scroll Hook (opening line or sonic hook that prevents listeners from skipping)',
    },
    viralCaptionLine: {
      type: Type.STRING,
      description: 'Section 1 Blueprint: Viral Caption Line (memorable punchline in the Chorus for social media sharing)',
    },
    stylePrompt: {
      type: Type.STRING,
      description: 'Section 2 Option A: Main Commercial 7-Layer English Style Prompt (<= 250 characters) for Suno v6',
    },
    stylePromptOptionB: {
      type: Type.STRING,
      description: 'Section 2 Option B: Alternative Vibe 7-Layer English Style Prompt (<= 250 characters) for Suno v6',
    },
    conciseStylePrompt: {
      type: Type.STRING,
      description: 'Condensed English style prompt strictly under 120 characters for Suno v6 quick input',
    },
    genreDescription: {
      type: Type.STRING,
      description: 'Clear description of the genre, sub-genre, groove, and rhythm feel in Thai',
    },
    vocalDescription: {
      type: Type.STRING,
      description: 'Clear description of the vocal character, tone, delivery, and dynamics in Thai',
    },
    arrangementDescription: {
      type: Type.STRING,
      description: 'Clear description of the musical instruments, chord progression feel, and section arrangement in Thai',
    },
    productionDescription: {
      type: Type.STRING,
      description: 'Clear description of mixing, stereo image, spatial reverb, and sound design in Thai',
    },
    excludeStyles: {
      type: Type.STRING,
      description: 'Section 2 Exclude Styles: Negative prompt in English only, comma-separated, no No or bullet dashes',
    },
    vocalGender: {
      type: Type.STRING,
      description: 'Male / Female / Duet / Group / Not specified',
    },
    weirdness: {
      type: Type.INTEGER,
      description: 'Weirdness percentage (0-100)',
    },
    styleInfluence: {
      type: Type.INTEGER,
      description: 'Style Influence percentage (0-100)',
    },
    tempoBpm: {
      type: Type.STRING,
      description: "Recommended BPM e.g. '90 BPM'",
    },
    musicalKey: {
      type: Type.STRING,
      description: "Recommended musical key e.g. 'F Minor'",
    },
    syllableScore: {
      type: Type.INTEGER,
      description: 'Syllable symmetry rating score (93-99)',
    },
    sunoModelRecommended: {
      type: Type.STRING,
      description: "Recommended Suno model: 'v6', 'v6-wild', or 'v6-mini'",
    },
    tiktokLane: {
      type: Type.STRING,
      description: 'Target TikTok / Reels viral lane description in Thai',
    },
    sunoMvVisualRecommended: {
      type: Type.STRING,
      description: 'Recommended visual aesthetic for MV',
    },
    prosodyEngineeringNotes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Section 4: 3-4 concise points in Thai explaining word choice, open-vowel chorus peaks, tonal alignment, and Verse-Chorus contrast',
    },
    modernizationReplacements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          originalWord: { type: Type.STRING, description: 'Original archaic or awkward phrase found in source lyrics' },
          modernReplacement: { type: Type.STRING, description: 'Modern natural conversational phrase used instead' },
          reason: { type: Type.STRING, description: 'Brief reason in Thai why it was modernized for Suno v6' },
        },
        required: ['originalWord', 'modernReplacement'],
      },
      description: 'Section 10 Fallback Case 1: List of archaic/awkward words replaced with modern conversational equivalents (especially in Fine-Tune mode)',
    },
    sunoPerformanceTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Section 5: 3-4 practical Suno v6 Studio Direction & Remix Tips in Thai (Acoustic/Live/Club Remix extensions & slider guidance)',
    },
    content: {
      type: Type.STRING,
      description: 'Section 3: Complete Suno v6 Production Lyrics from [Intro] to [Outro] with English [Metatags <=6 words] and (Vocal Ad-libs <=4 words). Full choruses written out completely.',
    },
  },
  required: [
    'title',
    'genreEraFusion',
    'songwritingModeUsed',
    'sevenSecondHook',
    'viralCaptionLine',
    'stylePrompt',
    'stylePromptOptionB',
    'conciseStylePrompt',
    'genreDescription',
    'vocalDescription',
    'arrangementDescription',
    'productionDescription',
    'excludeStyles',
    'vocalGender',
    'weirdness',
    'styleInfluence',
    'tempoBpm',
    'musicalKey',
    'syllableScore',
    'prosodyEngineeringNotes',
    'sunoPerformanceTips',
    'content',
  ],
};

const QC_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    passed: { type: Type.BOOLEAN, description: 'True if originality is verified and safe' },
    originalityScore: { type: Type.INTEGER, description: 'Percentage of lyrical originality (85-100)' },
    similarityRisk: { type: Type.STRING, enum: ['low', 'moderate', 'high'], description: 'Risk of similarity' },
    structureNoveltyScore: { type: Type.INTEGER, description: 'Percentage of structural uniqueness (85-100)' },
    statusMessage: { type: Type.STRING, description: 'Executive summary in Thai of the QC audit results' },
    antiPlagiarismDetails: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3-4 specific audit verification points in Thai',
    },
    safeForSuno: { type: Type.BOOLEAN, description: 'True if compliant with Suno V.6 policies' },
    refinedLyrics: { type: Type.STRING, description: 'Refined lyrics if changes were needed, or empty string if passed' },
  },
  required: [
    'passed',
    'originalityScore',
    'similarityRisk',
    'structureNoveltyScore',
    'statusMessage',
    'antiPlagiarismDetails',
    'safeForSuno',
  ],
};

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));

  // 0. PIN Authentication Endpoint (Protected App Access)
  const APP_PIN = (process.env.APP_PIN || '144990').trim();
  app.post('/api/auth/verify-pin', (req, res) => {
    try {
      const { pin } = req.body || {};
      if (!pin || typeof pin !== 'string') {
        res.status(400).json({ ok: false, error: 'กรุณากรอกรหัส PIN' });
        return;
      }
      if (pin.trim() === APP_PIN) {
        const token = Buffer.from(`mix_auth_${Date.now()}_${Math.random().toString(36).substring(2)}`).toString('base64');
        res.status(200).json({ ok: true, token });
        return;
      }
      res.status(401).json({ ok: false, error: 'รหัส PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: 'เกิดข้อผิดพลาดในการตรวจสอบรหัส PIN' });
    }
  });

  // 1. Genius Search Proxy Endpoint
  app.get('/api/genius/search', async (req, res) => {
    try {
      const q = (req.query.q as string) || '';
      const token = process.env.GENIUS_ACCESS_TOKEN || '';

      if (token && q) {
        const apiRes = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(q)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'MixAISongQC/1.0',
          },
        });
        if (apiRes.ok) {
          const data: any = await apiRes.json();
          const hits = (data?.response?.hits || []).map((h: any) => ({
            id: h.result?.id,
            title: h.result?.title,
            artistName: h.result?.primary_artist?.name,
            url: h.result?.url,
            songArtUrl: h.result?.song_art_image_thumbnail_url,
          }));
          res.json({ hits, source: 'genius-api' });
          return;
        }
      }

      res.json({ hits: [], source: 'fallback' });
    } catch (err: any) {
      res.json({ hits: [], error: err.message });
    }
  });

  // 1b. Server-Side AI Engine Status Endpoint (never exposes raw API keys)
  app.get('/api/ai/status', (_req, res) => {
    res.json({
      ok: true,
      defaultEngine: 'gemini-3.8-flash',
      engines: {
        'gemini-3.8-flash': {
          ready: isConfiguredSecret(process.env.GEMINI_API_KEY),
          label: 'Gemini 3.8 Flash (โมเดลหลัก)',
          provider: 'Google Gemini',
          role: 'primary',
        },
      },
      autoFallback: false,
    });
  });

  // 2. Server-Side AI Songwriting Endpoint (Gemini 3.8 Flash + User Key Injection)
  app.post('/api/gemini/generate-lyrics', async (req, res) => {
    try {
      const { promptText, geminiApiKey, customApiKey } = req.body || {};
      if (!promptText || typeof promptText !== 'string') {
        res.status(400).json({ error: 'ไม่พบข้อมูล Prompt สำหรับสร้างเนื้อเพลง' });
        return;
      }

      const effectiveGeminiKey = geminiApiKey || customApiKey;

      const result = await runAiGeneration({
        aiEngine: 'gemini-3.8-flash',
        contents: promptText,
        responseSchema: LYRIC_RESPONSE_SCHEMA,
        geminiApiKey: effectiveGeminiKey,
      });

      res.status(200).json({
        ok: true,
        text: result.text,
        engineUsed: result.engineUsed,
        fallbackApplied: false,
      });
    } catch (error: any) {
      console.error('[Server AI Generate Error]:', error);
      res.status(400).json({
        ok: false,
        error: error?.message || 'เกิดข้อผิดพลาดในการสร้างเนื้อเพลงจากเซิร์ฟเวอร์',
      });
    }
  });

  // 3. Server-Side AI QC & Originality Audit Endpoint (Gemini 3.8 Flash + User Key Injection)
  app.post('/api/gemini/qc-audit', async (req, res) => {
    try {
      const { auditPrompt, geminiApiKey, customApiKey } = req.body || {};
      if (!auditPrompt || typeof auditPrompt !== 'string') {
        res.status(400).json({ error: 'ไม่พบข้อมูลสำหรับตรวจสอบ QC' });
        return;
      }

      const effectiveGeminiKey = geminiApiKey || customApiKey;

      const result = await runAiGeneration({
        aiEngine: 'gemini-3.8-flash',
        contents: auditPrompt,
        responseSchema: QC_RESPONSE_SCHEMA,
        geminiApiKey: effectiveGeminiKey,
      });

      res.status(200).json({
        ok: true,
        text: result.text,
        engineUsed: result.engineUsed,
        fallbackApplied: result.fallbackApplied,
        fallbackReason: result.fallbackReason,
      });
    } catch (error: any) {
      console.error('[Server AI QC Error]:', error);
      res.status(400).json({
        ok: false,
        error: error?.message || 'เกิดข้อผิดพลาดในการตรวจสอบ QC',
      });
    }
  });

  // Mount Vite in development or static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MIX AI SONG Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
