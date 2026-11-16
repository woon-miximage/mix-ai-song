import { ViralCaseStudy, PlatformMasteringSpec } from '../types';

/**
 * DEEP RESEARCH REPORT & COMPLETE KNOWLEDGE DATABASE (2025–2026)
 * ผสานข้อมูลครบทั้ง 5 เอกสารต้นฉบับ:
 * 1) การถอดรหัสเพลงไวรัลยุค 2025–2026 และเทคนิคเชิงลึกการใช้ Suno v6 Pro (MIX NATTANONT - ZERODAY)
 * 2) การวิเคราะห์เทคนิค Suno Pro และเทรนด์เพลงไวรัล (ฉบับอ้างอิงงานวิจัย)
 * 3) The Complete Suno AI Compendium 2026 (30 ก.ย. – 18 ต.ค. 2026) & Anthology (19 ต.ค. – 13 พ.ย. 2026)
 * 4) SunoSong Studio Pro Proposal (UX & LUFS Streaming Standards)
 * 5) พิมพ์เขียวระบบสถาปัตยกรรม SunoSong Studio Pro & ZeroDay Mastering DSP Engine (v2.6)
 */

export interface SunoModelProfile {
  id: 'v6' | 'v6-wild' | 'v6-mini';
  name: string;
  tagline: string;
  bestFor: string;
  accuracy: string;
  description: string;
  recommendedPromptingStyle: string;
}

export const SUNO_V6_MODELS: SunoModelProfile[] = [
  {
    id: 'v6',
    name: 'Suno v6 (Core Model)',
    tagline: 'แม่นยำสูง ตรงตามสไตล์ที่กำหนด เสถียรที่สุด',
    bestFor: 'เพลงซิงเกิลที่จะปล่อยจริง, เพลงโฆษณา, เพลงแบรนด์, งานที่มี Reference ชัดเจน',
    accuracy: 'ความแม่นยำสูงสุด (High Precision)',
    description: 'โมเดลหลักที่ออกแบบมาเพื่อความแม่นยำสูงและจัดเรียงเพลงเข้ากับสไตล์ที่กำหนดอย่างสม่ำเสมอ ลดความเสี่ยงที่ผลลัพธ์จะหลุดกรอบจาก Prompt รองรับเพลงความยาวสูงสุดประมาณ 8 นาทีในการสร้างครั้งเดียว',
    recommendedPromptingStyle: 'ใช้โครงสร้างแท็ก [Verse], [Pre-Chorus], [Chorus], [Bridge], [Outro] ชัดเจน พร้อมคุมสไลเดอร์ Weirdness 15-35% และ Style Influence 80-95%'
  },
  {
    id: 'v6-wild',
    name: 'Suno v6-wild (Creative Explorer)',
    tagline: 'หลากหลาย คาดเดายาก ผสม Genre แปลกใหม่',
    bestFor: 'สำรวจไอเดีย, สร้าง Sound เฉพาะตัว, ทดลองผสมหลาย Reference ข้ามวัฒนธรรม',
    accuracy: 'เน้นความคิดสร้างสรรค์สูง (High Exploration)',
    description: 'เปิดพื้นที่ให้ผลลัพธ์แปลกใหม่และคาดเดายาก เหมาะกับการค้นหา Signature Sound หรือการทดลองฟิวชันข้ามแนว เช่น หมอลำ + Trap หรือ K-Pop + Retro Funk',
    recommendedPromptingStyle: 'ดัน Weirdness สไลเดอร์ขึ้น (40-75%) ลด Reference-driven ลง แล้วนำผลงานที่ชอบไปขัดเกลาต่อใน Song Editor'
  },
  {
    id: 'v6-mini',
    name: 'Suno v6-mini (Fast Demo Runner)',
    tagline: 'เร็ว เบา ใช้เครดิตน้อย เหมาะสำหรับทำ Demo เปรียบเทียบ',
    bestFor: 'ทดสอบ Prompt หลายเวอร์ชัน, ทำ Demo เปรียบเทียบ Groove/BPM ก่อนสร้างจริงด้วย v6',
    accuracy: 'เน้นความเร็วและการทดสอบทิศทาง (Rapid Prototyping)',
    description: 'รุ่นประหยัดและรวดเร็วสำหรับทดสอบไอเดียหลายทิศทาง เช่น เทียบเวอร์ชัน Ballad-pop vs Indie-pop หรือสลับ BPM ก่อนนำไอเดียที่ดีที่สุดไปรันด้วยโมเดล v6 หลัก',
    recommendedPromptingStyle: 'ใช้คีย์เวิร์ด Compact Mode (8-12 แท็ก) และปรับ Variety slider เพื่อฟังผลลัพธ์หลายแนวทางในเวลาอันสั้น'
  }
];

export const VIRAL_CASE_STUDIES: ViralCaseStudy[] = [
  {
    id: 'case-beer-fourth-glass',
    title: 'เบียร์แก้วที่สี่ (น้ำแข็งละลายหมดแล้ว)',
    artist: 'SunoSong Studio Pro — Golden Blueprint v2.6',
    streamsOrViews: 'ต้นแบบมาสเตอร์พีซ 0-AI Slop & Earworm Catchphrase Hook',
    genre: 'Indie / Dream Pop',
    emotionalAtmosphere: 'อกหักประชดประชัน เจ็บลึกแต่พูดด้วยภาษาคนจริง (Sarcastic Heartbreak)',
    structureBlueprint: '[Intro: Clean electric guitar riff, vintage chorus, steady bass pulse] -> [Verse 1: Intimate raspy vocal, sparse drums] (ทองหล่อซอยเดิม / ร้านส้มตำแย่งปีกไก่) -> [Pre-Chorus: Snare build-up] -> [Chorus: Explosive hook, full band] ("บอกยินดีด้วยปาก แต่หัวใจฝากคำแช่งไปในเพลง") -> [Post-Chorus] -> [Verse 2: Melodic speak-sing] (โอมากาเสะ vs ขับเวฟ) -> [Bridge: Half-time beat] -> [Final Chorus] -> [Outro: Guitar echo]',
    tiktokLane: 'คลิปนั่งร้านเหล้า, สตอรี่ประชดแฟนเก่า, ขับรถกลางคืน, POV อกหักแบบคนเมือง',
    hookSecret: 'Earworm Catchphrase Hook ที่ขัดแย้งกันอย่างคมคาย: "บอกยินดีด้วยปาก แต่หัวใจฝากคำแช่งไปในเพลง" ผสมคำศัพท์ชีวิตจริง 0-AI Slop (ทองหล่อ, ร้านส้มตำ, โอมากาเสะ, ขับเวฟ)',
    recommendedSunoModel: 'v6',
    recommendedSliders: { weirdness: 40, styleInfluence: 60 },
    sunoMvVisual: 'VHS Glitch Retro / LoFi Bedroom',
    samplePrompt: 'Thai Indie Pop, Dream Pop, 108 BPM, D Major, clean electric guitar with vintage analog chorus, warm melodic bassline, punchy live drums, emotional raspy male vocal, intimate close-mic verse to wide anthemic chorus, warm tape saturation',
    thaiApplicationStrategy: 'ใช้คำพูดประชดประชันในชีวิตจริงแทนคำกวี วางฉากสถานที่จริงในกรุงเทพฯ และใช้ท่อนฮุกที่มีคำคมสองวรรคตัดกันเพื่อทำแผ่นเสียงไวรัลบน TikTok'
  },
  {
    id: 'case-die-with-a-smile',
    title: 'Die With A Smile',
    artist: 'Lady Gaga & Bruno Mars',
    streamsOrViews: 'อันดับ 1 Spotify ทั่วโลกปี 2025 (1.72+ พันล้านสตรีม)',
    genre: 'Ballad / Retro Soul 70s',
    emotionalAtmosphere: 'โรแมนติกอบอุ่น ทุ่มเทสุดหัวใจ แฝงความเศร้าหวาน (70s Soul Cinematic Romance)',
    structureBlueprint: '[Intro: Slow 6/8 time signature, clean reverberated electric guitar, vintage Rhodes piano] -> [Verse 1: Smooth soulful male vocal, intimate and warm] -> [Pre-Chorus: Tension building, lush cinematic strings enter] -> [Chorus: Explosive vocal duet, male and female harmonizing, soaring high notes] -> [Verse 2: Powerful raspy female vocal] -> [Bridge: Dramatic key change] -> [Outro: Soft acoustic guitar fade out]',
    tiktokLane: 'คลิปคู่รัก, พรีเวดดิ้ง, แต่งงาน, โมเมนต์ความทรงจำ, ร้องคัฟเวอร์โชว์พลังเสียง',
    hookSecret: 'ใช้จังหวะ 6/8 Time Signature ย้อนยุค 70s เปิดด้วยคำถามสมมติที่ยิ่งใหญ่ ("ถ้าโลกกำลังจะแตกสลาย...") แล้วขมวดเข้า Signature Phrase สั้นๆ ที่ร้องตามได้ทั่วโลก',
    recommendedSunoModel: 'v6',
    recommendedSliders: { weirdness: 20, styleInfluence: 85 },
    sunoMvVisual: 'Cozy Healing / Studio Ghibli Aesthetic',
    samplePrompt: '1970s soul pop ballad, slow 6/8 waltz groove, duet male and female vocals, warm Fender Rhodes, weeping pedal steel guitar, lush cinematic orchestral strings, powerful emotional chorus belt, analog tape warmth, 76 bpm',
    thaiApplicationStrategy: 'ใช้จังหวะ 6/8 (ล็อกคำร้อง 6 พยางค์ต่อวรรค) เปิดด้วยประโยคสมมติ เช่น "ถ้าคืนนี้เป็นคืนสุดท้ายของโลกใบนี้" และใช้แท็ก [Chorus: Duet Harmony, Male and Female Together] ในท่อนฮุก'
  },
  {
    id: 'case-birds-of-a-feather',
    title: 'BIRDS OF A FEATHER',
    artist: 'Billie Eilish',
    streamsOrViews: 'อันดับ 2 Spotify ทั่วโลกปี 2025 (1.42+ พันล้านสตรีม)',
    genre: 'Indie / Dreamy Soft Pop',
    emotionalAtmosphere: 'เปราะบาง ชวนฝัน แต่บีตสดใสคลั่งรักลึกซึ้ง (Bright Groove + Vulnerable Vocal)',
    structureBlueprint: '[Intro: Upbeat acoustic drum loop, bright synth pluck] -> [Verse 1: Whispery intimate female chest voice, close-mic] -> [Pre-Chorus: Layered airy harmonies] -> [Chorus: Soaring head voice mixed with belt, full warm bass] -> [Bridge: Emotional vocal ad-libs] -> [Outro: Shimmering guitar fade]',
    tiktokLane: 'Aesthetic Vlog, ท่องเที่ยว, แฟชั่น, คลิปเพื่อนสนิท/คนรัก/สัตว์เลี้ยง',
    hookSecret: 'ความขัดแย้งที่ลงตัวระหว่างบีตจังหวะ 105 BPM ที่สดใสชวนขยับตัว กับเสียงร้องกระซิบใกล้ไมค์ที่ค่อยๆ ไต่ขึ้นไปแตะโน้ตสูงในท่อนฮุก',
    recommendedSunoModel: 'v6',
    recommendedSliders: { weirdness: 30, styleInfluence: 80 },
    sunoMvVisual: 'LoFi Bedroom / Studio Ghibli Aesthetic',
    samplePrompt: 'dreamy indie-pop, intimate breathy female vocal, upbeat acoustic drum loop, warm synth pads, clean melodic bass sits below kick, close-miked dry vocal with airy harmonies, 105 bpm',
    thaiApplicationStrategy: 'แต่งเนื้อเพลงไทยคลั่งรักแบบพูดคุยสบายๆ ใช้ซาวด์กลองจังหวะเดินหน้า 105 BPM คู่กับเสียงร้องกระซิบใกล้ไมค์ [Close-Mic Whisper] สลับเสียงเต็มในท่อนฮุก'
  },
  {
    id: 'case-apt',
    title: 'APT.',
    artist: 'ROSÉ & Bruno Mars',
    streamsOrViews: 'อันดับ 3 Spotify ทั่วโลกปี 2025 (1.32+ พันล้านสตรีม)',
    genre: 'T-Pop Dance / Pop-Punk New Wave',
    emotionalAtmosphere: 'สนุกสนาน กวนๆ เต็มไปด้วยพลังปาร์ตี้ (Playful, Addictive Party Chants)',
    structureBlueprint: '[Cold Open: Rhythmic spoken chant] -> [Intro: Driving pop-punk drums, handclaps] -> [Verse 1: Sassy female vocal, funky bass] -> [Pre-Chorus: Melodic soaring build-up] -> [Chorus: Repetitive catchy chant hook, gang vocals] -> [Bridge: Brass stabs & drum breakdown] -> [Final Chorus: Full party energy]',
    tiktokLane: 'TikTok Dance Challenge, ปาร์ตี้แก๊งเพื่อน, คลิปเปลี่ยนชุด Transition',
    hookSecret: 'นำคำเรียกเกมวงเหล้าเกาหลีมาทำเป็น Rhythmic Chant ซ้ำๆ ตั้งแต่วินาทีแรก ตัดกับ Pre-Chorus ที่มีเมโลดี้ไพเราะกว้างใหญ่ก่อนดรอปเข้า Chant',
    recommendedSunoModel: 'v6-wild',
    recommendedSliders: { weirdness: 45, styleInfluence: 80 },
    sunoMvVisual: 'K-Pop High Budget MV / Y2K Chrome Metallic',
    samplePrompt: 'energetic pop-punk dance, new wave surf rock influence, rhythmic chant hook, driving live drums, handclaps, slap funk bass, charismatic female and male duet, 149 bpm',
    thaiApplicationStrategy: 'ใช้คำพูดติดปากวัยรุ่นไทยหรือเกมปาร์ตี้มาทำเป็น [Post-Chorus: Catchy Vocal Chant, Gang Vocals] สั้นๆ ย้ำซ้ำๆ เพื่อให้ทำท่าเต้นตามได้ทันทีใน 10 วินาที'
  },
  {
    id: 'case-ordinary',
    title: 'Ordinary',
    artist: 'Alex Warren',
    streamsOrViews: 'อันดับ 4 Spotify ทั่วโลกปี 2025 (1.28+ พันล้านสตรีม)',
    genre: 'Ballad / Folk-Pop Chamber Anthem',
    emotionalAtmosphere: 'เทิดทูนความรักอย่างยิ่งใหญ่ เปลี่ยนสิ่งธรรมดาให้วิเศษ (Cinematic Devotion)',
    structureBlueprint: '[Intro: Fingerpicked acoustic guitar] -> [Verse 1: Raw emotional male baritone] -> [Pre-Chorus: Stomp-clap rhythm enters] -> [Chorus: Massive chamber pop choir, booming orchestral drums, soaring belt] -> [Outro: Acoustic guitar resolution]',
    tiktokLane: 'คลิปงานแต่งงาน, เปิดตัวคนรัก, คลิปครอบครัวซึ้งๆ, Cinematic Travel',
    hookSecret: 'การไล่ไดนามิกจากกีตาร์โปร่งตัวเดียวใน Verse พุ่งสู่ท่อน Chorus ที่มีเสียงกลองใหญ่และคอรัสประสานเหมือนเพลงในโบสถ์ (Chamber Pop Anthem)',
    recommendedSunoModel: 'v6',
    recommendedSliders: { weirdness: 20, styleInfluence: 85 },
    sunoMvVisual: 'Cinematic Drone Landscape / Cozy Healing',
    samplePrompt: 'anthemic folk-pop chamber ballad, fingerpicked acoustic guitar building to massive orchestral drums, gospel choir backing harmonies, passionate gritty male baritone vocal, concert hall climax, 84 bpm',
    thaiApplicationStrategy: 'เริ่มเพลงด้วยกีตาร์โปร่งแห้งๆ ใกล้ไมค์ แล้วใช้แท็ก [Layered Crescendo] ส่งเข้าท่อนฮุกที่เติมกลองใหญ่และเสียงประสานเต็มวงเพื่อเล่าเรื่องคนที่เข้ามาเปลี่ยนชีวิตธรรมดาให้มีความหมาย'
  },
  {
    id: 'case-back-to-friends',
    title: 'back to friends',
    artist: 'sombr',
    streamsOrViews: 'อันดับ 6 Spotify (1.06B+) & เพลงที่ถูกกดเซฟสูงสุดบน TikTok ปี 2025 (7.7M คลิป)',
    genre: 'Indie / Lo-Fi Bedroom Rock',
    emotionalAtmosphere: 'โหยหา อึดอัดใจ ไม่ยอมรับการลดสถานะกลับไปเป็นเพื่อน (Bittersweet Denial)',
    structureBlueprint: '[Intro: Melancholic lo-fi electric guitar riff with heavy chorus effect, slow steady drum beat] -> [Verse 1: Breathy emotional young male vocal, bedroom pop aesthetic] -> [Pre-Chorus: Bassline becomes more prominent, drums add snare rolls] -> [Chorus: Anthemic indie rock chorus, layered emotional vocals, washed-out reverb guitars] -> [Outro: Fading guitar chords]',
    tiktokLane: 'Heartbreak POV, คลิปขับรถตอนดึก, ย้อนความทรงจำ, สเตตัสคนไม่มูฟออน',
    hookSecret: 'ตั้งคำถามตรงไปตรงมาที่แทงใจคนทั่วโลก ("เราจะกลับไปเป็นเพื่อนกันได้ยังไง ในเมื่อเราผ่านอะไรลึกซึ้งมาขนาดนั้น") พร้อมซาวด์กีตาร์ Chorus ชวนฝันแต่เศร้า',
    recommendedSunoModel: 'v6',
    recommendedSliders: { weirdness: 30, styleInfluence: 80 },
    sunoMvVisual: 'VHS Glitch Retro / Dreamcore Liminal / LoFi Bedroom',
    samplePrompt: 'lo-fi indie rock, bedroom pop aesthetic, clean electric guitar with heavy analog chorus effect, prominent warm bassline, breathy emotional male vocal, anthemic washed-out chorus, 94 bpm',
    thaiApplicationStrategy: 'ใช้ประโยคคำถามภาษาพูดในท่อนฮุก เช่น "จะให้กลับไปเป็นเพื่อนกันได้ยังไง" คู่กับซาวด์กีตาร์คลีนใส่ Chorus Pedal และเสียงร้องที่เหมือนอัดในห้องนอนตอนตีสอง'
  },
  {
    id: 'case-luther',
    title: 'luther',
    artist: 'Kendrick Lamar & SZA',
    streamsOrViews: 'อันดับ 7 Spotify ทั่วโลกปี 2025 (1.02+ พันล้านสตรีม)',
    genre: 'R&B / Hip-Hop Soul Sample Duet',
    emotionalAtmosphere: 'นุ่มลึก เท่ โรแมนติกแบบผู้ใหญ่ มีเสน่ห์ดึงดูด (Classic Soul Sample + Melodic Rap)',
    structureBlueprint: '[Intro: Warm vintage 70s soul vocal sample, dusty vinyl crackle] -> [Verse 1: Articulate rhythmic male rap flow, deep 808 sub] -> [Chorus: Silky melodic duet, male and female trading lines, lush strings] -> [Verse 2: Airy soulful female R&B vocal] -> [Outro: Smooth orchestral soul fade]',
    tiktokLane: 'คู่รักสายแฟชั่น, คลิปแต่งตัว OOTD, ขับรถยามค่ำคืน, Vibe เท่ๆ',
    hookSecret: 'การสลับท่อนร้อง (Turn-Taking Duet) ระหว่างแร็ปเปอร์ชายเสียงคมชัดกับนักร้องหญิงสาย R&B เสียงพริ้วไหว บนบีตที่มีกลิ่นอายเพลงโซลยุคคลาสสิก',
    recommendedSunoModel: 'v6',
    recommendedSliders: { weirdness: 30, styleInfluence: 85 },
    sunoMvVisual: '90s Wong Kar-Wai Film / Cyberpunk Neon City',
    samplePrompt: 'melodic hip-hop and contemporary R&B duet, vintage 70s soul string sample, deep 808 bass sits below kick, articulate male rap verse, silky airy female R&B chorus, warm tape saturation, 92 bpm',
    thaiApplicationStrategy: 'ใช้แท็ก [Verse 1: Male Lead] แร็ปเล่ามุมมองผู้ชาย สลับกับ [Verse 2: Female Lead] ร้อง R&B นุ่มๆ และประสานเสียงคู่กันใน [Chorus: Duet Harmony, Male and Female Together]'
  },
  {
    id: 'case-thats-so-true',
    title: "That's So True",
    artist: 'Gracie Abrams',
    streamsOrViews: 'อันดับ 8 Spotify ทั่วโลกปี 2025 (1.01+ พันล้านสตรีม)',
    genre: 'Pop / Acoustic Folk-Pop',
    emotionalAtmosphere: 'ประชดประชันตัวเอง คิดมาก หึงหวงแบบวัยรุ่นยุคใหม่ (Fast-Paced Confessional)',
    structureBlueprint: '[Intro: Fast strummed acoustic guitar] -> [Verse 1: Conversational intimate female vocal] -> [Chorus: Catchy melodic hook] -> [Bridge: Rapid-fire breathless storytelling build-up, drums pounding] -> [Final Chorus: Shout-along climax]',
    tiktokLane: 'คลิป लिปซิงค์ท่อน Bridge รัวๆ, เล่าเรื่องดราม่าความรัก, POV เพื่อนเตือนสติ',
    hookSecret: 'ท่อน Bridge ที่รัวคำร้องเร็วและแน่นเหมือนคนระบายความในใจให้เพื่อนฟังแบบไม่พักหายใจ จนกลายเป็นชาเลนจ์ลิปซิงค์ทั่ว TikTok',
    recommendedSunoModel: 'v6',
    recommendedSliders: { weirdness: 25, styleInfluence: 85 },
    sunoMvVisual: 'LoFi Bedroom / Cottagecore Meadow',
    samplePrompt: 'upbeat acoustic folk-pop, fast strummed steel-string guitar, driving kick drum, intimate conversational female vocal, breathless rapid-fire emotional bridge, anthemic sing-along outro, 108 bpm',
    thaiApplicationStrategy: 'ออกแบบท่อน [Bridge] ให้มีจังหวะคำถี่ขึ้น (8-10 พยางค์) เล่าความในใจแบบรัวๆ ประชดแฟนเก่า แล้วใส่ [Silence] สั้นๆ ก่อนระเบิดเข้า Final Chorus'
  },
  {
    id: 'case-pretty-little-baby',
    title: 'Pretty Little Baby (Resurgence)',
    artist: 'Connie Francis (ต้นฉบับ 1962 - แชมป์ TikTok ปี 2025)',
    streamsOrViews: 'อันดับ 1 เพลงที่ถูกใช้มากที่สุดบน TikTok ปี 2025 (28.4M คลิป, 68.6B ยอดดู)',
    genre: 'Pop / Vintage 60s Wholesome Pop',
    emotionalAtmosphere: 'อบอุ่น ใจฟู น่ารัก ไร้เดียงสา (Wholesome, Heartwarming Nostalgia)',
    structureBlueprint: '[Intro: Vintage 60s pizzicato strings, cheerful brass] -> [Verse: Sweet innocent female vocal] -> [Chorus: Bouncy sing-along retro melody, doo-wop backing harmonies] -> [Outro: Warm analog fade]',
    tiktokLane: 'คลิปสัตว์เลี้ยง (หมา/แมว), ลูกน้อย, ครอบครัว, ทำอาหาร/จัดสวนแสนสุข',
    hookSecret: 'เมโลดี้คลาสสิกยุค 60s ที่ฟังแล้วโลกสดใสทันที กลายเป็นแผ่นเสียงมาตรฐานระดับโลกสำหรับคอนเทนต์แนวฮีลใจและสัตว์เลี้ยง',
    recommendedSunoModel: 'v6',
    recommendedSliders: { weirdness: 15, styleInfluence: 90 },
    sunoMvVisual: 'Cozy Healing / Studio Ghibli Aesthetic / Cottagecore Meadow',
    samplePrompt: 'vintage 1960s wholesome pop, pizzicato strings, cheerful muted brass, doo-wop backing vocal harmonies, sweet innocent female lead vocal, warm analog mono-style mix, 115 bpm',
    thaiApplicationStrategy: 'ทำเพลงป๊อปวินเทจจังหวะโยกเบาๆ ใช้คำร้องน่ารักสดใสสำหรับประกอบคลิปลูกแมว สัตว์เลี้ยง หรือคาเฟ่โฮมมี่'
  },
  {
    id: 'case-katseye-gnarly',
    title: 'Gnarly & Gabriela',
    artist: 'KATSEYE (TikTok Global Artist of the Year 2025)',
    streamsOrViews: 'ศิลปินแห่งปีบน TikTok 2025 (ยอดวิวชาเลนจ์เต้นหลายพันล้านวิว)',
    genre: 'T-Pop Dance / Hyper-Pop & Latin-Pop Crossover',
    emotionalAtmosphere: 'มั่นใจ เฉียบคม ท่าเต้นแข็งแรงระดับโกลบอล (Fierce Global Girl Group Energy)',
    structureBlueprint: '[Intro: Hard-hitting synth bass & rhythmic vocal chop] -> [Verse 1: Confident attitude delivery] -> [Pre-Chorus: Latin acoustic guitar flair / Ascending pitch] -> [Chorus: Explosive bass drop, sharp dance rhythm] -> [Dance Break: Heavy percussion & synth stabs]',
    tiktokLane: 'Dance Challenge, เปลี่ยนลุค Makeup Transition, เดินสับโชว์ความมั่นใจ',
    hookSecret: 'ออกแบบบีตให้มีจุดกระแทกจังหวะ (Hit Points) ที่ชัดเจนทุกๆ 2 ห้องดนตรี เพื่อให้ครีเอเตอร์สายเต้นล็อกท่าเต้นตามบีตได้คมกริบ',
    recommendedSunoModel: 'v6',
    recommendedSliders: { weirdness: 35, styleInfluence: 85 },
    sunoMvVisual: 'K-Pop High Budget MV / Y2K Chrome Metallic',
    samplePrompt: 'global girl group dance pop, fierce hyper-pop bass drop with latin nylon guitar accents, crisp punchy drums, confident female vocal harmonies, dance break percussion stabs, 124 bpm',
    thaiApplicationStrategy: 'เหมาะกับเพลง T-Pop Girl Group ที่ต้องการท่อน [Instrumental Drop: Dance Break] ชัดเจน และท่อนฮุกผสมคำภาษาอังกฤษสั้นๆ ที่ฟังแล้วอยากลุกขึ้นมาเต้น'
  }
];

export interface CaseStudyStepByStepWorkflow {
  id: string;
  targetSong: string;
  targetStyle: string;
  recommendedModel: string;
  weirdness: number;
  styleInfluence: number;
  part1StylePrompt: string;
  part1EnglishLyrics: string;
  part1ThaiLyrics: string;
  part2ExtendTimestamp: string;
  part2ExtendStylePrompt: string;
  part2ExtendLyrics: string;
  tiktok30sEditGuide: string;
}

export const STEP_BY_STEP_REPLICATION_WORKFLOWS: CaseStudyStepByStepWorkflow[] = [
  {
    id: 'workflow-die-with-a-smile',
    targetSong: 'Die With A Smile (Lady Gaga & Bruno Mars)',
    targetStyle: '1970s Retro Soul Ballad Duet (จังหวะ 6/8)',
    recommendedModel: 'Suno v6 (Core Model)',
    weirdness: 20,
    styleInfluence: 85,
    part1StylePrompt: '1970s soul pop ballad, slow 6/8 waltz groove, duet male and female vocals, warm Fender Rhodes, weeping pedal steel guitar, lush cinematic orchestral strings, powerful emotional chorus belt, analog tape warmth, 76 bpm',
    part1EnglishLyrics: `[Intro: Slow 6/8 time signature, clean reverberated electric guitar, vintage Rhodes piano]

[Verse 1: Smooth soulful male vocal, intimate and warm]
Yesterday was just a normal day
We laughed over coffee, let the hours fade away
Didn't think about tomorrow, didn't care about the rain
Just holding your hand in the quiet lane

[Pre-Chorus: Tension building, lush cinematic strings enter, drum fill]
[Audible Inhale]
Nobody knows when the curtain's gonna fall
If we lose it all tonight, I won't regret a single call

[Chorus: Explosive vocal duet, male and female harmonizing, soaring high notes]
If the world was ending, I'd wanna be next to you!
If the party was over and our time on Earth was through!
I'd hold you close for one last while
And die... with a smile.`,
    part1ThaiLyrics: `[Intro: Slow 6/8 time signature, clean reverberated electric guitar, vintage Rhodes piano]

[Verse 1: Smooth soulful male vocal, intimate and warm]
เมื่อวานยังเป็นแค่เพียง วันธรรมดา
นั่งจิบกาแฟหัวเราะกันไป ไม่ทันได้มองเวลา
ไม่ได้คิดถึงวันพรุ่งนี้ ไม่ได้กลัวว่าฝนจะมา
แค่มีมือเธอจับไว้ ในซอยเดิมที่คุ้นตา

[Pre-Chorus: Tension building, lush cinematic strings enter, drum fill]
[Audible Inhale]
ไม่มีใครรู้เลย ว่าฉากสุดท้ายจะมาเมื่อไหร่
แต่ถ้าคืนนี้ทุกอย่างพังลง ฉันจะไม่เสียดายอะไร

[Chorus: Duet Harmony, Male and Female Together, Soaring Belting]
ถ้าโลกใบนี้ต้องจบลง ฉันก็อยากยืนข้างเธอ!
ถ้างานเลี้ยงต้องเลิกลา และไม่มีวันพรุ่งนี้ให้เจอ!
ขอกอดเธอไว้ให้นานที่สุด...
แล้วยิ้ม... จนนาทีสุดท้าย`,
    part2ExtendTimestamp: '01:25 – 01:40 (กด Extend ทันทีหลังจบโน้ตสุดท้ายของ Chorus แรก)',
    part2ExtendStylePrompt: '1970s soul pop ballad, duet male and female vocals, key change up half step, massive orchestral climax, gospel choir backing, guitar solo, soft acoustic outro, 76 bpm',
    part2ExtendLyrics: `[Guitar Solo: Weeping vintage electric guitar with heavy vibrato]

[Transition: Dominant 7th Chord Build]
[Final Chorus: Key Change (+1 Semitone), Duet Harmony, Full Belt]
ถ้าโลกใบนี้ต้องจบลง ฉันก็อยากยืนข้างเธอ!
(อยากยืนข้างเธอ...)
ขอกอดเธอไว้ให้นานที่สุด...
แล้วยิ้ม... จนนาทีสุดท้าย

[Outro: Gradual Decrescendo, Soft Rhodes Piano Only]
ยิ้มข้างเธอ... จนนาทีสุดท้าย
[Fade Out]
[Final Chord]
[End]`,
    tiktok30sEditGuide: 'ใช้ Suno Studio ตัดเฉพาะช่วง [Pre-Chorus] วินาทีสุดท้ายที่กลองส่ง (Drum Fill) เข้าสู่ [Chorus] เต็ม 25–30 วินาที แล้วปรับความดังเป็น -10 LUFS เพื่อให้เสียงร้องคู่พุ่งทะลุลำโพงมือถือทันที'
  },
  {
    id: 'workflow-back-to-friends',
    targetSong: 'back to friends (sombr)',
    targetStyle: 'Lo-Fi Bedroom Indie Rock (94 BPM)',
    recommendedModel: 'Suno v6 (Core Model)',
    weirdness: 30,
    styleInfluence: 80,
    part1StylePrompt: 'lo-fi indie rock, bedroom pop aesthetic, clean electric guitar with heavy analog chorus effect, prominent warm bassline, breathy emotional male vocal, anthemic washed-out chorus, 94 bpm',
    part1EnglishLyrics: `[Intro: Melancholic lo-fi electric guitar riff with heavy chorus effect, slow steady drum beat]

[Verse 1: Breathy emotional young male vocal, bedroom pop aesthetic]
Your jacket's still hanging on the back of my chair
2 AM streetlights flickering through the cold air
You texted me asking if we're still cool
Like we're strangers again in the hallway at school

[Pre-Chorus: Bassline becomes more prominent, drums add snare rolls]
You draw a line on the floor like it's easy to do
After everything I gave up just to stay close to you

[Chorus: Anthemic indie rock chorus, layered emotional vocals, washed-out reverb guitars]
How can we go back to friends
When we just shared a bed?
How can you look at me and pretend
I'm someone you've never met?`,
    part1ThaiLyrics: `[Intro: Melancholic lo-fi electric guitar riff with heavy chorus effect, slow steady drum beat]

[Verse 1: Breathy emotional young male vocal, close-mic bedroom pop]
เสื้อคลุมเธอยังพาดอยู่ บนเก้าอี้ตัวเดิม
ไฟถนนตอนตีสอง ส่องผ่านม่านเหมือนวันเริ่ม
เธอทักแชตมาถามว่า เรายังเป็นเพื่อนกันได้ไหม
ทำเหมือนคนไม่เคยรักกัน ทั้งที่เพิ่งกอดกันไป

[Pre-Chorus: Bassline becomes more prominent, Ascending Melody, Snare Roll]
เธอขีดเส้นคำว่าเพื่อน เหมือนมันง่ายนิดเดียว
ทั้งที่ใจฉันยังติดอยู่ ในห้องเดิมคนเดียว

[Chorus: Anthemic indie rock chorus, Wide Stereo Spread, Emotional Belt]
จะให้กลับไปเป็นเพื่อนกันได้ยังไง
ในเมื่อคืนนั้นเรายังนอนกอดกันอยู่เลย?
เธอมองตาฉันแล้วแกล้งลืมได้ยังไง
เหมือนเราเป็นคนแปลกหน้า ที่ไม่เคยคุ้นเคย?`,
    part2ExtendTimestamp: '01:15 – 01:30 (กด Extend หลังจบท่อน Chorus แรก)',
    part2ExtendStylePrompt: 'lo-fi indie rock, bedroom pop, half-time dreamy bridge, shoegaze guitar wall of sound, emotional vocal climax, fading chorus guitar outro, 94 bpm',
    part2ExtendLyrics: `[Bridge: Half-time beat, Dreamy Shoegaze Guitars, Head Voice]
ลบแชตลบได้... แต่ลบคืนนั้นไม่ได้หรอก
(ลบไม่ได้หรอก...)

[Final Chorus: Arrangement Lift, Full Band Wall of Sound, Octave Vocal Doubling]
จะให้กลับไปเป็นเพื่อนกันได้ยังไง
ในเมื่อคืนนั้นเรายังนอนกอดกันอยู่เลย!
เธอมองตาฉันแล้วแกล้งลืมได้ยังไง
เหมือนเราเป็นคนแปลกหน้า ที่ไม่เคยคุ้นเคย...

[Outro: Clean Chorus Guitar Riff Only, Natural Room Decay]
กลับไปเป็นเพื่อน... ไม่ได้หรอก
[Fade Out]
[End]`,
    tiktok30sEditGuide: 'ตัดตั้งแต่วินาทีสุดท้ายของ [Pre-Chorus] ที่เบสกับสแนร์รัวส่งเข้าประโยคคำถาม "จะให้กลับไปเป็นเพื่อนกันได้ยังไง..." ใช้เป็นแผ่นเสียงสำหรับคลิปขับรถตอนกลางคืนหรือสตอรี่คนไม่มูฟออน'
  }
];

export const PLATFORM_MASTERING_SPECS: PlatformMasteringSpec[] = [
  {
    platform: 'TikTok',
    lufs: '-9 ถึง -12 LUFS',
    truePeak: '-0.5 dBTP',
    purpose: 'สำหรับเสียงประกอบคลิปสั้น (TikTok / Reels / Shorts Soundtrack)',
    recommendations: [
      'ความดังต้องพุ่งและหนักแน่น (Punchy & Energetic) เพื่อให้ได้ยินชัดเจนผ่านลำโพงมือถือ',
      'ออกแบบท่อนฮุกให้เด่นในช่วง 7-30 วินาทีแรก (7-Second Stop-Scroll & Hook First)',
      'เน้นเสียงร้องย่านกลาง-แหลม (+2 dB @ 3200Hz) และบีตกลองที่ชัดเพื่อให้เต้นหรือจับจังหวะง่าย',
      'ตัดเสียงเวอร์ชัน TikTok Edit (30-45 วินาที) โดยใช้ Song Editor หรือ Extend ของ Suno'
    ]
  },
  {
    platform: 'Spotify',
    lufs: '-14 LUFS',
    truePeak: '-1.0 dBTP',
    purpose: 'สำหรับสตรีมมิงเพลงเต็มคุณภาพสูง (Standard Streaming Master)',
    recommendations: [
      'Spotify ปรับ Normalization มาตรฐานไว้ที่ -14 LUFS หากทำมาดังกว่านี้เสียงจะถูกลดความดังอัตโนมัติ',
      'รักษาระดับไดนามิก (Dynamic Range 96 dB บน 16-Bit PCM) ให้มีความโปร่ง สบายหู ฟังสตรีมซ้ำๆ ได้ไม่ล้าหู',
      'ตั้งค่า True Peak ไว้ที่ -1.0 dBTP เพื่อป้องกันเสียงแตกจากการแปลงไฟล์ Lossy Codec (Ogg Vorbis/AAC)'
    ]
  },
  {
    platform: 'Apple Music',
    lufs: '-16 LUFS',
    truePeak: '-1.0 dBTP',
    purpose: 'สำหรับ Apple Digital Masters & Spatial Audio',
    recommendations: [
      'Apple Music ใช้ Sound Check ที่ -16 LUFS ทำให้เปิดพื้นที่ไดนามิกสูงกว่าแพลตฟอร์มอื่น',
      'เหมาะกับเพลงแนว Ballad, Indie และ Acoustic ที่ต้องการความโปร่งและความลึกของเวทีเสียง (Soundstage)',
      'แนะนำส่งออกเป็น 24-Bit PCM WAV (Ceiling -0.3 ถึง -1.0 dBTP, Dynamic Range 144 dB)'
    ]
  },
  {
    platform: 'YouTube',
    lufs: '-14 LUFS',
    truePeak: '-1.0 dBTP',
    purpose: 'สำหรับ Music Video / Lyric Video & Amazon Music Streaming',
    recommendations: [
      'YouTube และ Amazon Music ปรับความดังมาตรฐานไว้ที่ -14 LUFS',
      'จับคู่กับภาพและวิดีโอจาก SunoMV (ครบ 22 Viral Styles) หรือ Visualizer ความละเอียดสูง',
      'บาลานซ์เสียงเบส (Low Shelf -1.5 dB @ 90Hz) และเสียงร้องให้สมดุลเพื่อการรับชมบนทีวีและคอมพิวเตอร์'
    ]
  }
];

export interface ZeroDayDspFormatSpec {
  id: string;
  formatName: string;
  useCase: string;
  ceilingDbTp: string;
  ditherMode: string;
  dynamicRange: string;
  targetLufs: string;
  technicalNote: string;
}

export const ZERODAY_DSP_CALIBRATION_STANDARDS: ZeroDayDspFormatSpec[] = [
  {
    id: 'pcm-16bit',
    formatName: '16-Bit PCM WAV',
    useCase: 'Streaming & CD Standard (Spotify / YouTube / DistroKid)',
    ceilingDbTp: '-1.0 dBTP',
    ditherMode: 'TPDF Active (Triangular Probability Density Function)',
    dynamicRange: '96 dB',
    targetLufs: '-14 LUFS',
    technicalNote: 'เปิด TPDF Dither เสมอเมื่อลดบิตจาก 32-bit ลงมาเป็น 16-bit เพื่อป้องกัน Quantization Distortion ในหางเสียง Reverb'
  },
  {
    id: 'pcm-24bit',
    formatName: '24-Bit PCM WAV',
    useCase: 'Studio Hi-Res / Apple Digital Masters / Tidal Master',
    ceilingDbTp: '-0.3 dBTP (หรือ -1.0 dBTP สำหรับ Lossy Encoding)',
    ditherMode: 'Off (Pure 24-Bit Integer)',
    dynamicRange: '144 dB',
    targetLufs: '-12 ถึง -14 LUFS',
    technicalNote: 'มาตรฐานหลักสำหรับส่งผู้จัดจำหน่ายเพลงดิจิทัลยุคใหม่ (TuneCore, DistroKid, Landr) ให้รายละเอียดเสียงร้องและฮาร์โมนิกครบถ้วน'
  },
  {
    id: 'float-32bit',
    formatName: '32-Bit Float WAV',
    useCase: 'DAW Archive & Mix Workstation (Pro Tools / Logic / Ableton)',
    ceilingDbTp: '+3 dBFS Soft Headroom (IEEE 754 Float)',
    ditherMode: 'Zero Hard Clip (Unclipped Floating Point)',
    dynamicRange: '1528 dB',
    targetLufs: 'Pre-Master / Stem Archive',
    technicalNote: 'เหมาะที่สุดสำหรับเก็บไฟล์ Stems ที่แยกจาก Suno Studio DAW เพื่อนำไปมิกซ์และทำ Sidechain ต่อโดยไม่มีวันเสียงแตก (Zero Clipping)'
  }
];

export interface ZeroDayDspChainStage {
  stageOrder: number;
  moduleName: string;
  parameterValue: string;
  sonicPurpose: string;
}

export const ZERODAY_LIVE_DSP_CHAIN: ZeroDayDspChainStage[] = [
  {
    stageOrder: 1,
    moduleName: 'Input Gain Stage',
    parameterValue: '-3.0 dB',
    sonicPurpose: 'สร้าง Headroom ปลอดภัยก่อนเข้าสู่กระบวนการปรับแต่ง EQ และ Compressor'
  },
  {
    stageOrder: 2,
    moduleName: 'High-Pass Filter (HPF)',
    parameterValue: '35 Hz (12 dB/oct)',
    sonicPurpose: 'ตัดย่านความถี่ต่ำลึกเกินจำเป็น (Sub-rumble) ที่ทำให้มิกซ์จาก AI ขุ่นมัวและกินพลังงาน Limiter'
  },
  {
    stageOrder: 3,
    moduleName: 'Low Shelf EQ',
    parameterValue: '-1.5 dB @ 90 Hz',
    sonicPurpose: 'ลดอาการเบสบวมทับกระเดื่อง (Muddy Low-End) ช่วยให้เบสและ Kick แยกชั้นกันชัดเจน'
  },
  {
    stageOrder: 4,
    moduleName: 'Mid Bell EQ (Vocal Presence)',
    parameterValue: '+2.0 dB @ 3200 Hz (Q = 1.0)',
    sonicPurpose: 'ดันความชัดเจนของคำร้องภาษาไทยและเสียงพยัญชนะให้พุ่งทะลุลำโพงสมาร์ตโฟน'
  },
  {
    stageOrder: 5,
    moduleName: 'High Shelf EQ (Air & Shimmer)',
    parameterValue: '+2.5 dB @ 10000 Hz',
    sonicPurpose: 'เติมประกายความใส (Air) ให้เสียงลมหายใจ กีตาร์โปร่ง และฉาบมีความโปร่งระดับสตูดิโอ'
  },
  {
    stageOrder: 6,
    moduleName: 'VCA Glue Compressor',
    parameterValue: 'Threshold -18 dB | Ratio 2.2:1',
    sonicPurpose: 'หลอมรวมเสียงร้องและดนตรีให้เป็นเนื้อเดียวกัน (Mix Glue) แก้ปัญหาความดังแกว่งระหว่าง Verse กับ Chorus'
  },
  {
    stageOrder: 7,
    moduleName: 'Compressor Attack & Makeup',
    parameterValue: 'Attack 30 ms | Makeup Gain +3.0 dB',
    sonicPurpose: 'ปล่อยให้หัวเสียงกลอง (Transients) ผ่านออกไปได้ 30ms ก่อนบีบอัด ทำให้เพลงยังคงความเด้งและ Punchy'
  },
  {
    stageOrder: 8,
    moduleName: 'True-Peak Brickwall Limiter',
    parameterValue: 'Ceiling -1.0 dBTP',
    sonicPurpose: 'ล็อกเพดานสัญญาณสูงสุดไม่ให้เกิด Inter-sample Peaks เมื่ออัปโหลดขึ้น Spotify, Apple Music และ YouTube'
  }
];

export const SUNOMV_VIRAL_STYLES = [
  { id: 'lofi-bedroom', name: '1. LoFi Bedroom', lane: 'Indie Chill / Study / Midnight Vibe', color: 'from-amber-500/20 to-purple-500/20' },
  { id: 'makoto-shinkai', name: '2. Makoto Shinkai Anime', lane: 'Emotional Ballad / Sky / Cloud / First Love', color: 'from-blue-500/20 to-cyan-500/20' },
  { id: 'studio-ghibli', name: '3. Studio Ghibli Aesthetic', lane: 'Wholesome / Nature / Cozy Healing / Acoustic', color: 'from-emerald-500/20 to-teal-500/20' },
  { id: 'kpop-mv', name: '4. K-Pop High Budget MV', lane: 'Dance Pop / Energetic / Glamour / Fashion', color: 'from-pink-500/20 to-rose-500/20' },
  { id: 'vhs-glitch', name: '5. VHS Glitch Retro', lane: 'Nostalgia / City Pop / 90s Vintage / Emo Lo-fi', color: 'from-violet-500/20 to-fuchsia-500/20' },
  { id: 'y2k-chrome', name: '6. Y2K Chrome Metallic', lane: 'Hyperpop / Modern Trap / Futuristic Dance', color: 'from-indigo-500/20 to-cyan-500/20' },
  { id: 'dreamcore-liminal', name: '7. Dreamcore Liminal', lane: 'Dream Pop / Ambient / Surreal Mystery', color: 'from-neutral-500/20 to-slate-500/20' },
  { id: 'cozy-healing', name: '8. Cozy Healing', lane: 'Romantic Ballad / Family / Pet Moments', color: 'from-orange-500/20 to-amber-500/20' },
  { id: 'cyberpunk-neon', name: '9. Cyberpunk Neon City', lane: 'Synthwave / EDM / Melodic Trap / Night Drive', color: 'from-fuchsia-500/20 to-blue-500/20' },
  { id: 'anime-sadgirl', name: '10. Anime Sadgirl Rain', lane: 'Sad R&B / Emo Acoustic / Heartbreak Story', color: 'from-slate-500/20 to-indigo-500/20' },
  { id: 'cottagecore-meadow', name: '11. Cottagecore Meadow', lane: 'Indie Folk / Acoustic Pop / Spring Romance', color: 'from-lime-500/20 to-emerald-500/20' },
  { id: 'wong-kar-wai', name: '12. 90s Wong Kar-Wai Film', lane: 'Late-Night R&B / Hong Kong Neon / Moody Soul', color: 'from-red-500/20 to-amber-500/20' },
  { id: 'vaporwave-sunset', name: '13. Vaporwave Sunset Grid', lane: '80s City Pop / Retro Synth / Beach Cruise', color: 'from-pink-500/20 to-purple-500/20' },
  { id: 'dark-academia', name: '14. Dark Academia Library', lane: 'Chamber Pop / Piano & Cello Ballad / Classical', color: 'from-stone-500/20 to-amber-700/20' },
  { id: 'pixel-art-16bit', name: '15. Pixel Art 16-Bit Nostalgia', lane: 'Chiptune Pop / Cute T-Pop / Gaming Vibe', color: 'from-cyan-500/20 to-emerald-500/20' },
  { id: 'retro-80s-citypop', name: '16. Retro 80s Anime City Pop', lane: 'Tokyo-Bangkok City Pop / Funk Bass Groove', color: 'from-rose-500/20 to-indigo-500/20' },
  { id: 'cinematic-drone', name: '17. Cinematic Drone Landscape', lane: 'Epic Anthem / Post-Rock / Travel Vlog', color: 'from-sky-500/20 to-teal-500/20' },
  { id: 'minimal-typography', name: '18. Minimalist Lyric Typography', lane: 'Viral Caption Song / Spoken Word / Acoustic', color: 'from-zinc-500/20 to-neutral-500/20' },
  { id: 'streetwear-camcorder', name: '19. Streetwear Skate Camcorder', lane: '90s Boom Bap / Pop-Punk / Hip-Hop Crew', color: 'from-yellow-500/20 to-orange-500/20' },
  { id: 'surreal-pastel', name: '20. Surreal Pastel Cloudscape', lane: 'Shoegaze / Dreampop / Ethereal Falsetto', color: 'from-purple-400/20 to-pink-400/20' },
  { id: 'gothic-neon-noir', name: '21. Gothic Neon Noir', lane: 'Dark Trap / Alternative Rock / Industrial', color: 'from-red-600/20 to-zinc-800/20' },
  { id: 'thai-retro-cassette', name: '22. Thai Retro 90s Cassette', lane: '90s Thai Indie / Luk Thung Pop / Nostalgic Band', color: 'from-amber-600/20 to-orange-600/20' }
];

export const SUNO_V6_PRO_RULES = {
  sectionTags: [
    '[Intro: Clean electric guitar riff, vintage chorus, steady bass pulse]',
    '[Verse 1: Intimate raspy vocal, sparse drums]',
    '[Pre-Chorus: Ascending Melody, Pitch Climbs, Snare build-up]',
    '[Chorus: Explosive hook, full band, emotional vocal belt]',
    '[Post-Chorus: Catchy Vocal Chant, Gang Vocals, syncopated groove]',
    '[Verse 2: Melodic speak-sing, active bassline]',
    '[Pre-Chorus: Rising dynamic, heavy crashes]',
    '[Chorus: Full band drop, wide stereo spread]',
    '[Bridge: Instrumental breakdown, half-time beat]',
    '[Transition: Dominant 7th Chord Build]',
    '[Final Chorus: Key Change (+1 Semitone), Full band, octave vocal doubling]',
    '[Outro: Gradual Decrescendo, guitar echo]',
    '[Fade Out]',
    '[Final Chord]',
    '[End]'
  ],
  standardExcludeStyles: 'heavy reverb, screaming, harsh distortion, dissonant jazz, mumble rap, heavy death metal, dry acoustic folk, amateur mix, erratic tempo changes, aggressive rap, muddy mix, robotic voice',
  antiDeadVerseDirective: 'active verses, full-band energy throughout, stable loudness and tonal balance, separation as density rises, complete every lyric before a short instrumental outro and final hard stop',
  structuredStyleBlueprintOrder: [
    '1. Genre(s) & Era (วางแนวเพลงหลักไว้คำแรกสุดเสมอ)',
    '2. Vocals (เพศ, ช่องเสียง, เนื้อเสียง และการคุมความดังคงที่)',
    '3. Drums & Rhythm (จังหวะ BPM, Time Signature และคาแรคเตอร์กลอง)',
    '4. Instruments (เจาะจงรุ่นกีตาร์ คีย์บอร์ด เบส หรือเครื่องดนตรีไทย)',
    '5. Arrangement (การไล่ไดนามิกจาก Verse สู่ Chorus)',
    '6. Production & Mix Physics (ฟิสิกส์ไมค์ เวทีเสียง และความสัมพันธ์ของมิกซ์)',
    '7. Ending (รูปแบบการจบเพลง เช่น final hard stop หรือ acoustic fade out)'
  ],
  creativeSlidersGuide: {
    mainstreamFormula: {
      structured: 'High (70-90%)',
      referenceDriven: 'High (85-95%)',
      weirdness: 'Low (15-25%)',
      note: 'ใช้สำหรับเพลงป๊อปกระแสหลักและเพลง комเมอร์เชียลที่ต้องการความเสถียรตามสูตรเพลงฮิต'
    },
    signatureSoundFormula: {
      structured: 'Medium (50-65%)',
      referenceDriven: 'Medium-High (60-80%)',
      weirdness: 'Medium-High (30-55%)',
      note: 'ใช้สำหรับเพลงอินดี้ฟิวชัน (เช่น เบียร์แก้วที่สี่ หรือ หมอลำไซเคเดลิก) ที่ต้องการเอกลักษณ์เฉพาะตัว'
    }
  },
  stemSeparationTips: [
    'Suno Studio DAW รองรับการแยก Stems 4 ถึง 12+ แทร็ก (Vocals, Backing Vocals, Drums, Bass, Guitars, Keys, Synths, FX)',
    'ใช้เทคนิค Vocal Ducking (กดย่าน 1–4 kHz ของเครื่องดนตรีลง -2 ถึง -3 dB เฉพาะตอนที่มีเสียงร้อง) เพื่อให้คำร้องไทยชัดเจน',
    'ทำ Kick-Bass Sidechain Separation เพื่อให้กระเดื่องกลองและเบส 808 ไม่ตีกันในย่านความถี่ต่ำ',
    'ส่งออก Stems เป็น 32-Bit Float WAV เพื่อนำไปมิกซ์ต่อใน DAW โดยไม่สูญเสีย Headroom'
  ],
  extendFunctionRules: [
    'คิดแบบ Section: สร้างเพลงหลักให้ได้ท่อนฮุกที่ถูกใจก่อน แล้วใช้ Extend ต่อเติม Bridge, Key Change หรือ Outro',
    'ในคำสั่ง Extend ให้ระบุชัดเจนว่า "ต่อไปควรเกิดอะไรขึ้น" และระบุสิ่งที่ "ห้ามเปลี่ยน" (เช่น same vocal, same key)',
    'ตัวอย่างคำสั่ง Extend มาตรฐาน: Continue with a short outro, same female vocal, same key, acoustic piano only, fade out, no new instruments (ห้ามใส่เครื่องหมายคำพูด " ใน Style Prompt)',
    'แก้เพลงจบห้วน (Premature Cutoff): ต่อท้ายด้วยโซ่คำสั่ง [Outro: Gradual Decrescendo] -> [Fade Out] -> [Final Chord] -> [End]',
    'ทำ Sibling Mashup: นำ 2 แทร็กที่สร้างจากพรอมต์เดียวกันมาผสานด้วย Mashup เพื่อรวม Verse ของแทร็กหนึ่งกับ Chorus ของอีกแทร็ก'
  ],
  copyrightSafetyChecklist: [
    '1. ห้ามใส่ชื่อศิลปินที่มีชีวิตหรือชื่อเพลงที่มีลิขสิทธิ์ลงในช่อง Style Prompt หรือ Lyrics เด็ดขาด ให้แปลงเป็นคุณลักษณะทางดนตรีแทน',
    '2. ตรวจสอบคำร้องด้วยระบบ Genius API QC Audit เพื่อไม่ให้มีประโยคที่ซ้ำกับเพลงดังในตลาด',
    '3. ใช้เมโลดี้ที่ได้จากการประมวลผลใหม่และปรับแต่งท่อนด้วย Replace Section หรือ Song Editor เพื่อสร้างเอกลักษณ์เฉพาะตัว',
    '4. ต้องสร้างเพลงภายใต้แพ็กเกจ Suno Pro หรือ Premier เพื่อถือครองสิทธิ์เชิงพาณิชย์ (Commercial Rights) 100%',
    '5. เก็บไฟล์โปรเจกต์ Stems และประวัติพรอมต์ไว้ใน Cloud Firestore เพื่อใช้เป็นหลักฐานการสร้างสรรค์ผลงานต้นฉบับ'
  ],
  marketTestingLoop: [
    'ขั้นที่ 1 (Rapid Demo): ใช้ Suno v6-mini รันทดสอบ 3 ทิศทาง (เช่น Acoustic vs Synth-pop vs Indie Rock)',
    'ขั้นที่ 2 (Hook Validation): ตัดท่อนฮุก 15–30 วินาทีแรกไปทดสอบเป็นแผ่นเสียงบน TikTok / Reels',
    'ขั้นที่ 3 (Retention Check): ดูอัตราการฟังจบคลิป (Completion Rate) และจำนวนคนกด Save แผ่นเสียง',
    'ขั้นที่ 4 (v6 Core Production): นำเวอร์ชันที่คนชอบที่สุดมารันเต็มเพลงด้วย Suno v6 Core Model พร้อมฝัง Metatags ละเอียด',
    'ขั้นที่ 5 (Stem Polish & DSP): แยก Stems ใน Suno Studio และปรับความดังตามมาตรฐาน (-10 LUFS สำหรับ TikTok / -14 LUFS สำหรับ Spotify)',
    'ขั้นที่ 6 (Global Distribution): ส่งออกไฟล์ 24-Bit PCM WAV ขึ้นแพลตฟอร์มสตรีมมิงทั่วโลกพร้อมปล่อย MV จาก SunoMV'
  ]
};

export interface GoldenBlueprintSong {
  id: string;
  title: string;
  subtitle: string;
  genre: string;
  mood: string;
  bpm: string;
  musicalKey: string;
  mode: string;
  weirdness: number;
  styleInfluence: number;
  earwormHook: string;
  stylePrompt: string;
  excludeStyles: string;
  fullLyrics: string;
  zeroAiSlopVocabulary: { word: string; context: string }[];
}

export const GOLDEN_BLUEPRINT_SONG: GoldenBlueprintSong = {
  id: 'golden-beer-fourth-glass',
  title: 'เบียร์แก้วที่สี่ (น้ำแข็งละลายหมดแล้ว)',
  subtitle: 'System Blueprint v2.6 — ต้นแบบเพลงไทย 0-AI Slop & Earworm Catchphrase Hook',
  genre: 'Thai Indie / Dream Pop',
  mood: 'อกหักประชดประชัน (Sarcastic Heartbreak)',
  bpm: '108 BPM',
  musicalKey: 'D Major',
  mode: 'Hybrid Mode (เล่าเรื่องฉากจริงใน Verse + ขยี้คำคมใน Chorus)',
  weirdness: 40,
  styleInfluence: 60,
  earwormHook: 'บอกยินดีด้วยปาก แต่หัวใจฝากคำแช่งไปในเพลง',
  stylePrompt: 'Thai Indie Pop, Dream Pop, 108 BPM, D Major, clean electric guitar with vintage analog chorus, warm melodic bassline sits below kick, punchy live drums, emotional raspy male vocal, close-miked dry verse to wide stereo chorus, warm tape saturation',
  excludeStyles: 'screaming, harsh distortion, dissonant jazz, mumble rap, heavy death metal, dry acoustic folk, amateur mix, erratic tempo changes, heavy reverb',
  fullLyrics: `[Intro: Clean electric guitar riff, vintage chorus, steady bass pulse]

[Verse 1: Intimate raspy vocal, sparse drums, Chest Voice]
เบียร์แก้วที่สี่ น้ำแข็งละลายหมดแล้ว
นั่งมองไฟท้ายรถเธอ ค่อยๆ ลับไปจากทองหล่อซอยเดิม
เพื่อนถามว่าไหวไหม ได้แต่พยักหน้ายิ้มเจื่อนๆ
เลื่อนดูสตอรี่เธอเช็กอินร้านใหม่... กับคนที่ดูดีกว่าฉันทุกตรง

[Pre-Chorus: Ascending Melody, Snare build-up, bass driving forward]
[Audible Inhale]
ไหนบอกไม่ชอบคนรวย ไหนบอกชอบกินส้มตำข้างทาง
วันที่แย่งปีกไก่กันวันนั้น... วันนี้เธอนั่งกินโอมากาเสะสบายใจ

[Chorus: Explosive hook, full band, emotional vocal belt, Wide Stereo Spread]
ขอให้รักกันนานๆ นะคนดี!
ส่วนฉันจะนั่งตรงนี้ จนกว่าร้านจะปิดไฟ
บอกยินดีด้วยปาก แต่หัวใจฝากคำแช่งไปในเพลง!
ถ้าวันไหนเขาทำเธอพัง... อย่าลืมคนที่ขับเวฟไปส่งเธอวันนั้นก็แล้วกัน

[Post-Chorus: Syncopated guitar groove, call-and-response]
(ยินดีด้วยนะ... ยินดีด้วยจริงๆ)
น้ำแข็งละลายหมดแล้ว... แต่ใจยังไม่หายชาเลย

[Verse 2: Melodic speak-sing, light beat, active bassline]
ตีสองสิบห้า พนักงานเริ่มเก็บเก้าอี้ขึ้นโต๊ะ
เสื้อคลุมตัวเดิมยังมีกลิ่นน้ำหอมเธอติดอยู่ตรงปก
กดซ่อนสตอรี่เธอไว้ เพราะไม่อยากเห็นตอนเขามารับ
จ่ายบิลแล้วเดินเซๆ ออกมารับลมหนาวหน้าปากซอย

[Bridge: Instrumental breakdown, half-time beat, Head Voice]
ไม่ได้โกรธที่เธอเลือกทางที่ดีกว่า
แค่ตลกตัวเอง... ที่เคยเชื่อคำว่าตลอดไปของเธอ
[Silence]

[Final Chorus: Arrangement Lift, Full band, octave vocal doubling, dynamic swell]
ขอให้รักกันนานๆ นะคนดี!
ส่วนฉันจะนั่งตรงนี้ จนกว่าร้านจะปิดไฟ
บอกยินดีด้วยปาก แต่หัวใจฝากคำแช่งไปในเพลง!
ถ้าวันไหนเขาทำเธอพัง... ก็ไม่ต้องกลับมาหาคนที่เธอทิ้งไป

[Outro: Gradual Decrescendo, guitar echo]
เบียร์แก้วที่สี่... จืดสนิทเหมือนคำสัญญาเธอเลย
[Fade Out]
[Final Chord]
[End]`,
  zeroAiSlopVocabulary: [
    { word: 'เบียร์แก้วที่สี่ น้ำแข็งละลายหมดแล้ว', context: 'ใช้สิ่งของตรงหน้าบอกเวลาที่ผ่านไปและความรู้สึกที่จืดชืดแทนคำว่า "กาลเวลาผ่านไป"' },
    { word: 'ทองหล่อซอยเดิม', context: 'ระบุสถานที่จริงในกรุงเทพฯ เพื่อสร้างภาพจำทันทีตั้งแต่วินาทีแรก' },
    { word: 'ร้านส้มตำแย่งปีกไก่ vs โอมากาเสะ', context: 'สร้างความเปรียบต่างทางชนชั้นและไลฟ์สไตล์ที่เห็นภาพชัดโดยไม่ต้องอธิบายอ้อมค้อม' },
    { word: 'คนที่ขับเวฟไปส่งเธอวันนั้น', context: 'รายละเอียดชีวิตจริงของคนธรรมดาที่สร้างความทัชใจและเข้าถึงผู้ฟังในวงกว้าง' },
    { word: 'บอกยินดีด้วยปาก แต่หัวใจฝากคำแช่งไปในเพลง', context: 'Earworm Catchphrase Hook ที่มีความย้อนแย้งคมคาย เหมาะสำหรับนำไปตั้งแคปชันและแผ่นเสียง TikTok' }
  ]
};

export interface SunoDailyArchiveEntry {
  docNumber: number;
  date: string;
  compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)' | 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)';
  title: string;
  category: string;
  keyTags: string[];
  summary: string;
  readyPrompt: string;
}

export const SUNO_DAILY_ARCHIVES_2026: SunoDailyArchiveEntry[] = [
  // ================= PART 1: 30 ก.ย. – 18 ต.ค. 2026 (19 บันทึกจาก The Complete Suno AI Compendium) =================
  {
    docNumber: 0,
    date: '30 ก.ย. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'อัปเดตฟีเจอร์ Create: Speech (beta), Personas, Voices & Albums',
    category: 'แพลตฟอร์ม & โมเดล',
    keyTags: ['Speech (beta)', 'Personas', 'Voices', 'Albums', 'Inspo'],
    summary: 'เปิดตัวโหมด Speech (beta) สำหรับสร้างเสียงพูดพอดแคสต์/สปอตโฆษณา, การบันทึกคาแรคเตอร์นักร้องด้วย Personas & Voices และการจัดกลุ่มเพลงเป็น Albums',
    readyPrompt: 'Warm Thai Podcast Storytelling, intimate close-mic spoken word, gentle lo-fi Rhodes background pad, calm and articulate voice, 80 BPM'
  },
  {
    docNumber: 1,
    date: '1 ต.ค. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'โครงสร้างพรอมต์แบบมีลำดับชั้น (Structured Style Blueprint)',
    category: 'วิศวกรรมพรอมต์',
    keyTags: ['Genre(s)', 'Vocals', 'Drums', 'Instruments', 'Arrangement', 'Production', 'Ending'],
    summary: 'การจัดเรียง Style Prompt ตามลำดับความสำคัญ 7 ชั้น หรือโหมด Compact (8-15 แท็ก) โดยวางแนวเพลงหลัก (Dominant Genre) ไว้คำแรกสุดเสมอ',
    readyPrompt: 'Thai Indie Pop, emotional male vocal, tight live drums 105 BPM, clean chorus electric guitar, warm bassline, dynamic lift into wide chorus, clean studio mix, short instrumental outro with final hard stop'
  },
  {
    docNumber: 2,
    date: '2 ต.ค. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'การควบคุมตัวเลื่อนสร้างสรรค์ (Weirdness & Style Influence Sliders)',
    category: 'พารามิเตอร์',
    keyTags: ['Weirdness 15-25%', 'Weirdness 30-55%', 'Style Influence 85-95%'],
    summary: 'กำหนดสูตรสไลเดอร์: เพลงป๊อปฮิตติดชาร์ตใช้ Weirdness 15-25% คู่กับ Style Influence 85-95% ส่วนเพลงอินดี้ฟิวชันใช้ Weirdness 30-55%',
    readyPrompt: 'Modern T-Pop Chart Hit, bright female vocal, bouncy synth bass, crisp drums, radio-friendly hook, stable loudness, 118 BPM'
  },
  {
    docNumber: 3,
    date: '3 ต.ค. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'วิศวกรรมเนื้อเพลงและความสมดุลจำนวนบรรทัด (Line Count & Melodic Weight)',
    category: 'ฉันทลักษณ์ & เนื้อร้อง',
    keyTags: ['Verse 4-6 lines', 'Chorus 2-4 lines', 'Melodic Weight Rule'],
    summary: 'คุมความยาว Verse ที่ 4-6 บรรทัด (ไม่เกิน 8) และ Chorus 2-4 บรรทัด พร้อมกฎ Melodic Weight Rule: วางคำฮุกที่แข็งแรงที่สุดไว้ในบรรทัดแรกของ Chorus เสมอ',
    readyPrompt: 'Thai Emotional Pop Ballad, soaring female vocal, warm grand piano, cinematic strings, powerful first-line chorus hook, 76 BPM'
  },
  {
    docNumber: 4,
    date: '4 ต.ค. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'การซ้อนเมทาแท็ก (Tag Stacking: [Structure] + [Delivery])',
    category: 'เมทาแท็ก',
    keyTags: ['[Verse 1: Whispered, Intimate]', '[Chorus: Powerful, Belting]', '[Pre-Chorus: Building Intensity]'],
    summary: 'เทคนิคการรวมแท็กโครงสร้างและอารมณ์การร้องไว้ในบรรทัดเดียวกันเพื่อป้องกัน AI สับสนและบังคับเปลี่ยนไดนามิกทันที',
    readyPrompt: 'Thai Alternative Pop Rock, dynamic vocal contrast from whispered intimate verse to belted anthemic chorus, driving guitars, 122 BPM'
  },
  {
    docNumber: 5,
    date: '5 ต.ค. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'การควบคุม BPM และสัดส่วนจังหวะ (3/4 Waltz & 6/8 Time Signatures)',
    category: 'จังหวะ & BPM',
    keyTags: ['3/4 time signature', 'Waltz meter', '6/8 time signature', 'Half-time feel'],
    summary: 'การล็อกจังหวะ 3/4 Waltz และ 6/8 โดยต้องเขียนคำร้องให้ลงจังหวะ 3 หรือ 6 พยางค์ต่อวรรคอย่างเคร่งครัดเพื่อให้ดนตรีโยกตามสัดส่วนจริง',
    readyPrompt: 'Romantic Thai Waltz Ballad, 3/4 time signature, Waltz meter, warm acoustic guitar, accordion accents, sweet female vocal, 84 BPM'
  },
  {
    docNumber: 6,
    date: '6 ต.ค. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'การสร้างเพลงร้องโต้ตอบชาย-หญิง (Duet Turn-Taking Architecture)',
    category: 'เสียงร้อง & ฮาร์โมนี',
    keyTags: ['[Verse 1: Male Lead]', '[Verse 2: Female Lead]', '[Chorus: Duet Harmony, Male and Female Together]'],
    summary: 'วิธีแยกเสียงนักร้องชายและหญิงไม่ให้ปนกันมั่ว โดยระบุ Duet, Male and Female Vocals ใน Style Prompt และใช้แท็กสลับท่อนชัดเจน',
    readyPrompt: 'Romantic Thai Pop Duet, Male and Female Vocals, warm acoustic piano, lush strings, turn-taking verses into harmonized duet chorus, 80 BPM'
  },
  {
    docNumber: 7,
    date: '7 ต.ค. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'การออกแบบท่อนส่งก่อนฮุก (Pre-Chorus Lift & Rhyme Acceleration AABB)',
    category: 'ฉันทลักษณ์ & เนื้อร้อง',
    keyTags: ['[Pre-Chorus: Ascending Melody, Pitch Climbs]', 'Rhyme Acceleration AABB', 'Snare Roll Build'],
    summary: 'เร่งความถี่ของคำสัมผัสในท่อน Pre-Chorus เป็นแบบชิดกัน (AABB) คู่กับแท็กไต่ระดับโน้ตสูงขึ้นเพื่อสร้างแรงส่งเข้าท่อน Chorus',
    readyPrompt: 'Upbeat T-Pop, ascending pre-chorus melody with snare build-up, explosive catchy chorus, bright synths, crisp female vocal, 120 BPM'
  },
  {
    docNumber: 8,
    date: '8 ต.ค. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'การสร้างความเปรียบต่างด้วยจังหวะกลอง (Half-Time Chorus & Stop Time)',
    category: 'การเรียบเรียงดนตรี',
    keyTags: ['[Drum Fill]', '[Stop Time]', '[Bass Run]', '[Turnaround]', '[Bridge: Half-Time Feel]'],
    summary: 'ใช้แท็กหยุดดนตรี 1 จังหวะ [Stop Time] หรือกลองส่ง [Drum Fill] ก่อนเข้าฮุก และการปรับจังหวะกลองเป็น Half-Time เพื่อเพิ่มความหนักแน่น',
    readyPrompt: 'Thai Groovy Pop Rock, tight drum fills and stop-time breaks before chorus, punchy bass runs, charismatic male vocal, 116 BPM'
  },
  {
    docNumber: 9,
    date: '9 ต.ค. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'การฝังเสียงบรรยากาศและเอฟเฟกต์พิเศษ (SFX & Micro-Arrangement)',
    category: 'โปรดักชัน & มิกซ์',
    keyTags: ['[Sound Effect: Vinyl crackle]', '[Sound Effect: Tape stop]', '[Sound Effect: Gentle rain]', '[Sound Effect: Crowd cheering]'],
    summary: 'การเพิ่มมิติสมจริงด้วยเอฟเฟกต์เสียงแผ่นเสียงเก่า เสียงฝนตก หรือเสียงเทปหยุดหมุนก่อนเข้าท่อนดรอป',
    readyPrompt: 'Lo-Fi Thai R&B, dusty vinyl crackle intro, gentle rain atmosphere, mellow Rhodes piano, tape stop transition into smooth chorus, 78 BPM'
  },
  {
    docNumber: 10,
    date: '10 ต.ค. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'สูตรสร้างท่อนดรอป EDM 4 ขั้นตอน (4-Step EDM Drop Engineering)',
    category: 'การเรียบเรียงดนตรี',
    keyTags: ['[Pre-Chorus: Tension Build]', '[Riser: Snare Roll]', '[Short Silence]', '[Drop: Hard Drop, Heavy Sidechain, Sub-Bass Impact]'],
    summary: 'ลำดับคำสั่ง 4 ขั้นตอนเพื่อสร้างท่อน Drop ที่กระแทกทรงพลัง: บิลด์อารมณ์ -> สแนร์รัว -> เงียบสั้นๆ -> ดรอปเบสหนักพร้อม Sidechain',
    readyPrompt: 'Festival EDM T-Pop, tension build riser with snare roll, short silence before hard drop, heavy sidechain pumping, sub-bass impact, 128 BPM'
  },
  {
    docNumber: 11,
    date: '11 ต.ค. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'การเปลี่ยนคีย์ยกอารมณ์ท่อนฮุกสุดท้าย (Key Modulation +1 Semitone)',
    category: 'การเรียบเรียงดนตรี',
    keyTags: ['[Transition: Dominant 7th Chord Build]', '[Chorus: Key Change (+1 Semitone), Modulate Up Half-Step, Full Belt]'],
    summary: 'การสั่งให้ Suno เปลี่ยนคีย์สูงขึ้นครึ่งเสียงในท่อน Final Chorus โดยปูด้วยคอร์ดส่ง Dominant 7th ก่อนเสมอ',
    readyPrompt: 'Dramatic Thai Power Ballad, grand piano and full orchestra, dominant 7th build into final chorus key change up half-step, soaring vocal belt, 74 BPM'
  },
  {
    docNumber: 12,
    date: '12 ต.ค. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'การสั่งเอื้อนลูกคอและแอดลิบขั้นสูง (Virtuosic Melisma & Vocal Runs)',
    category: 'เสียงร้อง & ฮาร์โมนี',
    keyTags: ['[Vocal Ad-libs: Virtuosic Melisma, Soulful Gospel Runs]', 'โฮ~โอ~โอ~', 'ฮา~อา~อา~'],
    summary: 'ใช้การลากสระด้วยเครื่องหมายตัวหนอน (~) คู่กับแท็ก Melisma เพื่อให้ AI เอื้อนลูกคอ R&B หรือลูกทุ่งได้อย่างเป็นธรรมชาติ',
    readyPrompt: 'Thai Soul R&B Ballad, passionate male vocal with virtuosic melisma and gospel vocal runs, warm organ and Rhodes, 82 BPM'
  },
  {
    docNumber: 13,
    date: '13 ต.ค. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'การควบคุมตอนจบเพลงไม่ให้โดนตัดห้วน (Anti-Premature Cutoff Outro Chain)',
    category: 'การเรียบเรียงดนตรี',
    keyTags: ['[Outro: Gradual Decrescendo]', '[Fade Out]', '[Final Chord]', '[End]'],
    summary: 'การวางลำดับแท็ก 4 ชั้นในช่วงท้ายเพลงเพื่อบังคับให้ AI ร้องครบทุกคำและค่อยๆ ผ่อนดนตรีลงจนจบสมบูรณ์',
    readyPrompt: 'Thai Acoustic Indie Pop, warm fingerpicked guitar, complete every lyric before a short instrumental outro, gradual decrescendo and final chord, 92 BPM'
  },
  {
    docNumber: 14,
    date: '14 ต.ค. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'การฟิวชันดนตรีไทย-อีสานยุคใหม่ (Modern Molam & Pentatonic Groove)',
    category: 'แนวเพลง & ฟิวชัน',
    keyTags: ['Thai Psychedelic Funk', 'Modern Molam', 'Pentatonic Riffs', 'Phin & Khaen Accents', 'Punchy Bass'],
    summary: 'สูตรผสมดนตรีหมอลำและลูกทุ่งเข้ากับ Psychedelic Funk, City Pop และ Trap โดยล็อกบันไดเสียงเพนทาโทนิกและเสียงพิณ/แคน',
    readyPrompt: 'Thai Psychedelic Funk, Modern Molam, Pentatonic Riffs, Electrifying Phin & Khaen Accents, Punchy Slap Bass, Groovy Live Drums, 110 BPM'
  },
  {
    docNumber: 15,
    date: '15 ต.ค. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'การสร้างเพลงร้องประสานเสียงสดไร้ดนตรี (Pure A Cappella & Vocal Choir)',
    category: 'เสียงร้อง & ฮาร์โมนี',
    keyTags: ['A cappella, Pure Vocal Only', 'Multi-part Vocal Harmony', 'Vocal Percussion Beatbox'],
    summary: 'การสั่งสร้างเพลงหรือท่อนแยกที่มีเฉพาะเสียงมนุษย์ประสานกันหลายแนวโดยใส่ Drums, Instruments ใน Exclude Styles',
    readyPrompt: 'A cappella, Pure Vocal Only, multi-part Thai vocal harmony, warm bass vocal foundation, crisp vocal percussion, intimate room acoustics, 96 BPM'
  },
  {
    docNumber: 16,
    date: '16 ต.ค. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'การแก้ปัญหาท่อน Verse พลังตกและเสียงไม่สม่ำเสมอ (Anti-Dead Verse Directive)',
    category: 'โปรดักชัน & มิกซ์',
    keyTags: ['active verses', 'full-band energy throughout', 'stable loudness and tonal balance', 'keep vocal tone and loudness stable'],
    summary: 'ชุดคำสั่งบังคับให้กลองและเบสทำงานต่อเนื่องในท่อน Verse ไม่ให้เพลงเนือยหรือดรอปความดังลงหลังจบอินโทร',
    readyPrompt: 'Modern Thai Pop Rock, active verses, full-band energy throughout, stable loudness and tonal balance, separation as density rises, 120 BPM'
  },
  {
    docNumber: 17,
    date: '17 ต.ค. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'เวิร์กโฟลว์ Suno Studio DAW, Stem Separation & Sidechain Mixing',
    category: 'แพลตฟอร์ม & โมเดล',
    keyTags: ['12+ Stems Separation', 'Vocal Ducking -3dB', 'Kick-Bass Sidechain', 'Clip Stretching'],
    summary: 'การแยก Stems 12 แทร็กใน Suno Studio, การทำ Vocal Ducking ย่าน 1-4 kHz และการจัดระเบียบ Kick กับ Sub-Bass',
    readyPrompt: 'Clean Studio Master Pop, clear frequency separation between kick and sub-bass, upfront dry lead vocals, wide stereo synth pads, 115 BPM'
  },
  {
    docNumber: 18,
    date: '18 ต.ค. 2026',
    compendiumPart: 'Part 1 (30 ก.ย. - 18 ต.ค. 2026)',
    title: 'กฎเหล็ก 7 ข้อสำหรับสมองกลแต่งเพลง (The 7 Iron Rules Master Prompt)',
    category: 'วิศวกรรมพรอมต์',
    keyTags: ['7 Iron Rules', 'No Lyric Bleed', 'Strict English Metatags', 'Full Chorus Print'],
    summary: 'สรุปกฎเหล็ก 7 ข้อ: แยก Style/Lyrics เด็ดขาด, ห้ามใส่ " ใน Style Prompt, แท็ก [...] อังกฤษล้วน, พิมพ์ Chorus เต็มทุกครั้ง และคุมพยางค์ตาม BPM',
    readyPrompt: 'Chart-Ready Thai Urban Pop, close-miked expressive vocals, warm Fender Rhodes, punchy bass sits below kick, wide anthemic chorus, 112 BPM'
  },

  // ================= PART 2: 19 ต.ค. – 13 พ.ย. 2026 (26 บันทึกจาก Suno AI Anthology) =================
  {
    docNumber: 19,
    date: '19 ต.ค. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'การกำกับช่องเสียงร้องและอวัจนภาษา (Vocal Registers & Non-Verbal Cues)',
    category: 'เสียงร้อง & ฮาร์โมนี',
    keyTags: ['[Chest Voice]', '[Mixed Voice]', '[Head Voice]', '[Belting]', '[Audible Inhale]', 'light vocal fry at onset'],
    summary: 'แยกช่องเสียงตามท่อนเพลง: Chest Voice ใน Verse, Mixed Voice ใน Pre-Chorus, Belting ใน Chorus พร้อมเสียงสูดลมหายใจจริงก่อนท่อนสำคัญ',
    readyPrompt: 'Thai Late-Night R&B, Breathy Female Vocal with Light Vocal Fry at Onset, Chest Voice Verse to Belted Chorus, Warm Rhodes Piano, 68 BPM'
  },
  {
    docNumber: 20,
    date: '20 ต.ค. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'ฟิสิกส์ไมโครโฟนและระยะห่างนักร้อง (Close-Mic & Proximity Physics)',
    category: 'โปรดักชัน & มิกซ์',
    keyTags: ['Close mic presence', 'Proximity effect (extra low end)', 'close-miked and dry', 'warm tape saturation'],
    summary: 'ใช้คำบรรยายกายภาพการอัดเสียงแทนคำคุณศัพท์กว้างๆ อย่าง radio-ready เพื่อดึงเสียงร้องให้ชัดคมอยู่หน้ามิกซ์',
    readyPrompt: 'Intimate Thai Acoustic Ballad, close-miked and dry vocal with proximity effect extra low end, warm tape saturation, fingerpicked guitar, 76 BPM'
  },
  {
    docNumber: 21,
    date: '21 ต.ค. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'การออกแบบเวทีเสียงและมิติสเตอริโอ (Mono-to-Wide Stereo Staging)',
    category: 'โปรดักชัน & มิกซ์',
    keyTags: ['[Mono Centered Verse]', '[Wide Stereo Spread]', 'Tight Studio Booth', 'Concert Hall Space'],
    summary: 'บีบเวทีเสียงในท่อน Verse ให้อยู่ตรงกลางแบบห้องอัดแคบ แล้วขยายออกซ้าย-ขวากว้างเต็มมิติเมื่อเข้าท่อน Chorus',
    readyPrompt: 'Modern Thai Indie Pop, tight studio booth mono centered verse expanding to wide stereo spread chorus, shimmering guitars, 108 BPM'
  },
  {
    docNumber: 22,
    date: '22 ต.ค. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'การแก้ปัญหาเสียงร้องจมใน Suno v6 (Mix Hierarchy & Vocal Unmasking)',
    category: 'โปรดักชัน & มิกซ์',
    keyTags: ['vocals forward and dry', 'bass sits below kick', 'cymbals washed in background', '[Silence]'],
    summary: 'จัดลำดับชั้นความดังด้วยคำสั่งความสัมพันธ์ของมิกซ์ เติม [Silence] หลังท่อนร้องรัว และใส่ Heavy Reverb ในช่อง Exclude Styles',
    readyPrompt: 'Thai Melodic Hip-Hop, vocals forward and dry, 808 bass sits below kick, cymbals washed in background, crisp snare crack, 96 BPM'
  },
  {
    docNumber: 23,
    date: '23 ต.ค. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'การตั้งสายกีตาร์โปร่งและการใช้คาโป้ (DADGAD, High-Capo 7 & 12-String)',
    category: 'เครื่องดนตรี',
    keyTags: ['DADGAD tuning', 'High-Capo Acoustic Guitar (Capo 7)', '12-String Shimmer', 'Fingerstyle'],
    summary: 'กำหนดคาแรคเตอร์กีตาร์โปร่งให้ใสกังวานระดับห้องอัดด้วยการระบุการทาบคาโป้เฟรต 7 หรือตั้งสายเปิด DADGAD',
    readyPrompt: 'Thai Indie Folk, High-Capo Acoustic Guitar Capo 7 chimey strumming, 12-string acoustic shimmer, warm upright bass, honest male vocal, 90 BPM'
  },
  {
    docNumber: 24,
    date: '24 ต.ค. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'การเลือกรุ่นกีตาร์ไฟฟ้าและตำแหน่งปิ๊กอัป + อัปเดต iOS AirPlay',
    category: 'เครื่องดนตรี',
    keyTags: ['Fender Telecaster bridge pickup', 'Stratocaster position 4', 'Gibson Les Paul neck humbucker'],
    summary: 'แยกรุ่นกีตาร์ไฟฟ้าตามแนวเพลง: Telecaster เสียงพุ่งคมสำหรับ Funk/Rock, Strat Position 4 เสียงเด้งใสสำหรับ Pop/R&B, Les Paul เสียงหนาอุ่น',
    readyPrompt: 'Thai Funk Pop, Stratocaster position 4 glassy rhythm guitar, Fender Telecaster bridge twang riffs, slap bass groove, 116 BPM'
  },
  {
    docNumber: 25,
    date: '25 ต.ค. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'ตระกูลเปียโนไฟฟ้าและออร์แกนวินเทจ (Rhodes, Wurlitzer, Clavinet, Hammond B3)',
    category: 'เครื่องดนตรี',
    keyTags: ['Fender Rhodes', 'Wurlitzer 200A', 'Hohner Clavinet D6', 'Hammond B3 Organ with Leslie'],
    summary: 'เลือกคีย์บอร์ดให้ตรงอารมณ์: Rhodes นุ่มชวนฝัน, Wurlitzer สากอุ่นยุค 70s, Clavinet ดีดเด้งฟังก์ และ Hammond B3 หมุนวนทรงพลัง',
    readyPrompt: 'Thai Neo-Soul R&B, warm Fender Rhodes chords, Wurlitzer 200A solo accents, Hammond B3 Leslie swells in chorus, silky female vocal, 86 BPM'
  },
  {
    docNumber: 26,
    date: '26 ต.ค. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'สถาปัตยกรรมเบสสังเคราะห์และเบสสด (808 Glide, Reese, Slap Funk, Upright)',
    category: 'เครื่องดนตรี',
    keyTags: ['808 sub bass glide', 'Reese bass', 'Slap funk bass solo pocket', 'Upright acoustic bass thump'],
    summary: 'แยกประเภทเสียงเบสให้ตรงแนวเพลง: 808 Glide สำหรับ Trap, Reese Bass สำหรับ Electronic มืดลึก, Slap Bass สำหรับ City Pop/Funk',
    readyPrompt: '80s Thai City Pop, slap funk bass solo pocket, sparkling synth brass, Stratocaster rhythm, breezy female vocal, 114 BPM'
  },
  {
    docNumber: 27,
    date: '27 ต.ค. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'คณิตศาสตร์พยางค์ไทยและการป้องกันคำร้องล้นห้องดนตรี',
    category: 'ฉันทลักษณ์ & เนื้อร้อง',
    keyTags: ['4/4 (6-8 พยางค์)', 'Ballad (5-7 พยางค์)', '3/4 & 6/8 (6 พยางค์เป๊ะ)', 'Metric Symmetry Box (7-7-7-7)'],
    summary: 'ล็อกจำนวนพยางค์ต่อวรรคให้ตรงกับ Time Signature และใช้กล่องสมมาตรพยางค์ 7-7-7-7 ในท่อนฮุกเพื่อให้เมโลดี้จำง่ายที่สุด',
    readyPrompt: 'Catchy Thai Mass Pop, symmetric 7-syllable chorus phrasing, clean electric guitar, warm synth pads, clear male vocal, 112 BPM'
  },
  {
    docNumber: 28,
    date: '28 ต.ค. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'การใช้วรรคตอนควบคุมจังหวะหายใจและช่องไฟ (Punctuation Prosody Control)',
    category: 'ฉันทลักษณ์ & เนื้อร้อง',
    keyTags: [', (พัก 1/8 ห้อง)', '. (หยุดเด็ดขาด)', '— (ชะงักกะทันหัน)', '... (ลากสระยาว)', 'เว้น 1 บรรทัดว่าง'],
    summary: 'ใช้เครื่องหมายวรรคตอนกำกับจังหวะการเว้นวรรคหายใจของ AI ป้องกันอาการร้องรวบคำข้ามบรรทัด',
    readyPrompt: 'Emotional Thai Indie Ballad, natural breathing pauses, intimate close-mic vocal, soft piano and cello, 74 BPM'
  },
  {
    docNumber: 29,
    date: '29 ต.ค. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'กฎห้ามสปอยล์คำฮุกในท่อนเกริ่น (No Verse-Chorus Echo Rule)',
    category: 'ฉันทลักษณ์ & เนื้อร้อง',
    keyTags: ['No Verse-Chorus Echo', 'Chorus Impact Reservation', 'Contrast Release'],
    summary: 'ห้ามนำคำสำคัญหรือภาพหลักของท่อน Chorus ไปใส่ใน 2 บรรทัดสุดท้ายของ Verse หรือ Pre-Chorus เพื่อรักษาแรงกระแทกอารมณ์ตอนเข้าฮุก',
    readyPrompt: 'Anthemic Thai Pop Rock, restrained tension in pre-chorus exploding into high-impact chorus hook, full live band, 124 BPM'
  },
  {
    docNumber: 30,
    date: '30 ต.ค. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'ฉันทลักษณ์สัมผัสไทยยุคใหม่: สัมผัสเลือน สัมผัสไขว้ และสัมผัสโอบ ABBA',
    category: 'ฉันทลักษณ์ & เนื้อร้อง',
    keyTags: ['Slant Rhymes (สัมผัสเลือน)', 'Internal Cross Rhyme A-B-A-B', 'Envelope Rhyme ABBA (สัมผัสโอบ)'],
    summary: 'ลดความเชยของกลอนแปดด้วยสัมผัสเลือน (เปียก-เงียบ) ในเพลงอินดี้, สัมผัสไขว้ในบรรทัดเดียวเพื่อเร่งโฟลว์ และสัมผัสโอบ ABBA',
    readyPrompt: 'Thai Alternative Shoegaze Indie, slant rhyme conversational lyrics, shimmering chorus guitars, airy vocal, 96 BPM'
  },
  {
    docNumber: 31,
    date: '31 ต.ค. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'เปิดตัว Suno MCP beta & Suno Studio Auto-Stretch / Fine Pitch',
    category: 'แพลตฟอร์ม & โมเดล',
    keyTags: ['Suno MCP beta', 'Auto-stretch BPM', 'Fine Pitch (Cents)', 'Shift+H Track Hide'],
    summary: 'เชื่อมต่อ Suno กับระบบ AI ผ่าน Model Context Protocol (MCP) และฟีเจอร์ยืดหดไฟล์เสียงให้ตรง BPM อัตโนมัติพร้อมจูนพิทช์ระดับเซนต์',
    readyPrompt: 'Precision Produced Electronic Pop, pitch-accurate vocal harmonies, tight tempo-locked groove, modern synth production, 122 BPM'
  },
  {
    docNumber: 32,
    date: '1 พ.ย. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'การสร้างเสียงร้องสอดประสานและแอดลิบซ้อน (Interlocking Vocals)',
    category: 'เสียงร้อง & ฮาร์โมนี',
    keyTags: ['Interlocking Vocals', '... (เว้นช่องไฟ 1-2 วินาที)', '(spoken, soft: ...)', 'Octave Vocal Doubling'],
    summary: 'เว้นจุดไข่ปลา (...) ท้ายวรรคเพื่อให้เสียงร้องประสานในวงเล็บ (...) แทรกขึ้นมาตอบโต้กับนักร้องนำโดยไม่ทับคำกัน',
    readyPrompt: 'Thai Contemporary R&B, interlocking lead and backing vocals, call-and-response ad-libs, warm Rhodes and sub bass, 88 BPM'
  },
  {
    docNumber: 33,
    date: '2 พ.ย. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'เทคนิคตัดเสียงร้องกระตุกและดัดฟอร์แมนต์ (Stutter Chops & Formant Shift)',
    category: 'เสียงร้อง & ฮาร์โมนี',
    keyTags: ['[Stutter Gate Break: 16th-note gate]', 'Stutter vocal chop accents', 'Pitched-down Formant Shift'],
    summary: 'สร้างลูกเล่นเสียงร้องกระตุก 16th-note ก่อนเข้าท่อน Drop หรือดัดเสียงทุ้มต่ำเป็นเลเยอร์ซ้อนในเพลง Trap และ Electronic',
    readyPrompt: 'Future T-Pop Dance, stutter vocal chop accents, 16th-note gate break before chorus drop, heavy synth bass, 126 BPM'
  },
  {
    docNumber: 34,
    date: '3 พ.ย. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'การจำลองซาวด์กลองวินเทจและการอัดไมค์ห้อง (Room-Micd Drums & SP-1200)',
    category: 'เครื่องดนตรี',
    keyTags: ['drums sound room-micd', 'fat snare crack', 'SP-1200 12-bit drum crunch', 'overhead cymbal shimmer'],
    summary: 'สั่งให้กลองมีมิติของห้องอัดจริงด้วย room-micd drums หรือใช้ซาวด์แซมเพลอร์ 12-bit SP-1200 สำหรับเพลง Boom-Bap และ Lo-Fi',
    readyPrompt: '90s Thai Boom-Bap Hip-Hop, SP-1200 12-bit drum crunch, room-micd fat snare crack, jazzy Rhodes loop, confident rap flow, 92 BPM'
  },
  {
    docNumber: 35,
    date: '4 พ.ย. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'การสั่งงานซินธิไซเซอร์และเอฟเฟกต์กวาดความถี่ (Acid 303, Supersaw & Filter Sweep)',
    category: 'เครื่องดนตรี',
    keyTags: ['Acid 303 squelch', 'Lush supersaw leads', 'Resonance cutoff filter sweeps', '[Breakdown: High-pass filter sweep]'],
    summary: 'การระบุคาแรคเตอร์ซินธ์และการกวาด High-pass filter sweep ในท่อน Breakdown ก่อนปลดปล่อยย่านเบสเต็มสูบในท่อนฮุก',
    readyPrompt: 'Melodic Synthwave Pop, lush supersaw leads, resonance cutoff filter sweeps, high-pass filter breakdown into wide drop, 120 BPM'
  },
  {
    docNumber: 36,
    date: '5 พ.ย. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'การผสมเครื่องสายคลาสสิกและขลุ่ยไทย (Legato Cello, String Quartet & Khlui)',
    category: 'เครื่องดนตรี',
    keyTags: ['Intimate string quartet counterpoint', 'Warm legato cello solo', 'Traditional bamboo flute (Khlui tone)'],
    summary: 'เติมความละเมียดละไมให้เพลงบัลลาดไทยด้วยเสียงเชลโลลากยาว (Legato Cello) และเสียงขลุ่ยไม้ไผ่ไทยที่มีลมหายใจธรรมชาติ',
    readyPrompt: 'Cinematic Thai Ballad, warm grand piano, intimate string quartet, weeping legato cello solo, subtle bamboo flute Khlui melody, 74 BPM'
  },
  {
    docNumber: 37,
    date: '6 พ.ย. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'การวางคอร์ดแจ๊สและนีโอโซลใน Style Prompt (Dm7 - G7 - Cmaj7 & Lush 9th Chords)',
    category: 'การเรียบเรียงดนตรี',
    keyTags: ['Dm7 - G7 - Cmaj7 jazz chord voicings', 'Lush 9th Chords', 'Neo-Soul harmonic progression'],
    summary: 'ระบุทางเดินคอร์ด ii-V-I และคอร์ด 9th ลงใน Style Prompt โดยตรงเพื่อให้ AI สร้างฮาร์โมนีที่หรูหราซับซ้อนแบบเพลง R&B/Neo-Soul',
    readyPrompt: 'Thai Neo-Soul R&B, Dm7 - G7 - Cmaj7 jazz chord voicings, Lush 9th Chords, warm Fender Rhodes, smooth laid-back vocal, 85 BPM'
  },
  {
    docNumber: 38,
    date: '7 พ.ย. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'เปิดตัวฟีเจอร์ Daily Song Challenge & Library Calendar View',
    category: 'แพลตฟอร์ม & โมเดล',
    keyTags: ['Daily Song Challenge', 'Calendar View Library', 'Pin Track to Date'],
    summary: 'เพิ่มโจทย์แต่งเพลงรายวันบนหน้าแรกของ Suno และมุมมองปฏิทินในคลังเพลงเพื่อติดตามสถิติการสร้างสรรค์ผลงานรายวัน',
    readyPrompt: 'Feelgood Thai Acoustic Pop, bright strumming guitar, cheerful whistle hook, warm male vocal, daily vlog soundtrack, 108 BPM'
  },
  {
    docNumber: 39,
    date: '8 พ.ย. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'การออกแบบจุดหักมุมด้วยความเงียบฉับพลัน ([False Ending] & [Vocal Break])',
    category: 'การเรียบเรียงดนตรี',
    keyTags: ['[Vocal Break: Solo voice held in air]', '[False Ending: Sudden Silence]', '[Surprise Explosive Climax]'],
    summary: 'สั่งให้ดนตรีหยุดกึกหลอกว่าเพลงจบ [False Ending] ทิ้งเสียงร้องลอยค้างกลางอากาศ 1 วินาที ก่อนอัดดนตรีกลับเข้ามาเต็มวง',
    readyPrompt: 'Dramatic Thai Pop Rock, false ending sudden silence before final chorus, solo vocal break held in air, explosive full band climax, 126 BPM'
  },
  {
    docNumber: 40,
    date: '9 พ.ย. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'การควบคุมความเร็วตามอารมณ์และการจบเพลง 5 รูปแบบ ([Ritardando] & [Fermata])',
    category: 'การเรียบเรียงดนตรี',
    keyTags: ['[Ritardando]', '[Accelerando]', '[Fermata: Sustained final chord]', '[A cappella Outro: Natural room decay]', '[Vamp: Repeating groove]'],
    summary: 'การหน่วงจังหวะช้าลงท้ายเพลง [Ritardando], การแช่คอร์ดสุดท้ายกังวานยาว [Fermata] และการจบด้วยเสียงร้องเปล่าในห้องธรรมชาติ',
    readyPrompt: 'Soulful Thai Acoustic Ballad, ritardando in final lines, fermata sustained piano chord, a cappella outro with natural room decay, 72 BPM'
  },
  {
    docNumber: 41,
    date: '10 พ.ย. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'กลยุทธ์ 3 รูปแบบสำหรับท่อนฮุกสุดท้าย (3 Final Chorus Archetypes)',
    category: 'ฉันทลักษณ์ & เนื้อร้อง',
    keyTags: ['1. Strict Repeat (Double Chorus)', '2. Arrangement Lift', '3. Intentional Final Lyric Variation'],
    summary: 'เลือกวิธีปิดท่อน Final Chorus 3 รูปแบบตามเรื่องราว: ร้องซ้ำเป๊ะตอกย้ำวลีฮิต, คงเนื้อเดิมแต่โหมเครื่องดนตรี หรือบิดบรรทัดสุดท้ายเพื่อหักมุม',
    readyPrompt: 'Emotional Thai Hit Ballad, arrangement lift in final chorus with octave vocal doubling and full string orchestra, 78 BPM'
  },
  {
    docNumber: 42,
    date: '11 พ.ย. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'การป้องกันบั๊ก Lyric Bleed (ห้ามใส่เครื่องหมายคำพูด " ใน Style Prompt)',
    category: 'วิศวกรรมพรอมต์',
    keyTags: ['No Double Quotes in Style Prompt', 'Prevent Lyric Bleed', 'Sanitized Prompt Syntax'],
    summary: 'ห้ามใส่เครื่องหมายคำพูด (") ในช่อง Style Prompt เด็ดขาด เพราะเอ็นจิ้น Suno v6 จะเข้าใจผิดและดึงคำในเครื่องหมายคำพูดไปร้องออกไมค์',
    readyPrompt: 'Modern Thai Urban Pop, clean Stratocaster guitar, warm Rhodes chords, close-miked vocals forward and dry, 110 BPM'
  },
  {
    docNumber: 43,
    date: '12 พ.ย. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'กฎคำเป็นเสียงสระเปิดบนโน้ตสูงและข้อควรระวังวรรณยุกต์ไทยใน Suno v6',
    category: 'ฉันทลักษณ์ & เนื้อร้อง',
    keyTags: ['Open-Vowel Chorus Peak (อา, ออ, ไอ, เอา)', 'ห้ามลงท้ายคำตายเสียงสั้น', 'เลี่ยงคำเพี้ยนวรรณยุกต์ (ใกล้ -> ข้างๆ)'],
    summary: 'คำท้ายวรรคฮุกต้องเป็นคำเป็นเสียงสระเปิดเพื่อให้ลากโน้ตสูงได้กังวาน และเลี่ยงคำวรรณยุกต์โท/ตรีที่เสี่ยงเพี้ยนเมื่อลากเสียงยาว',
    readyPrompt: 'Soaring Thai Pop Ballad, open-vowel high note chorus peak, crystal clear Thai pronunciation, warm piano and strings, 76 BPM'
  },
  {
    docNumber: 44,
    date: '13 พ.ย. 2026',
    compendiumPart: 'Part 2 (19 ต.ค. - 13 พ.ย. 2026)',
    title: 'การสังเคราะห์พิมพ์เขียว 7-Layer Sonic Formula ฉบับสมบูรณ์สำหรับ Suno v6',
    category: 'วิศวกรรมพรอมต์',
    keyTags: ['7-Layer Sonic Formula', 'Describe the Recording Not a Verdict', 'Complete v6 Architecture'],
    summary: 'รวมทุกองค์ประกอบเข้าเป็นสมการ 7 ชั้น: Genre + Vocal Register + Mic Physics + Specific Instrument Models + Mix Hierarchy + Stereo Staging + Ending',
    readyPrompt: 'Thai Indie Dream Pop, intimate chest-to-mixed male vocal with light vocal fry, close-miked dry verse to wide stereo chorus, Fender Telecaster with analog chorus, warm bass sits below kick, tape saturation, final chord decay, 108 BPM'
  }
];

export interface SunoPlatformReleaseItem {
  date: string;
  tier: string;
  feature: string;
  details: string;
}

export const SUNO_OFFICIAL_RELEASES_2026: SunoPlatformReleaseItem[] = [
  {
    date: '30 ก.ย. 2026',
    tier: 'Suno Create',
    feature: 'Speech (beta), Personas, Voices & Albums',
    details: 'เปิดตัวโหมดสร้างเสียงพูด Speech (beta), การบันทึกเอกลักษณ์เสียงร้องด้วย Personas & Voices และการจัดหมวดหมู่เพลงเป็น Albums'
  },
  {
    date: '17 ต.ค. 2026',
    tier: 'Suno Studio DAW',
    feature: '12+ Stems Separation & Shareable Workspaces',
    details: 'แยกแทร็กเสียง Stems สูงสุดกว่า 12 แทร็ก พร้อม Clip Stretching, Fade Curves, Wavetable Synth และการแชร์โปรเจกต์ทำงานร่วมกันแบบเรียลไทม์'
  },
  {
    date: '24 ต.ค. 2026',
    tier: 'iOS v1.93+',
    feature: 'AirPlay & iPhone Duo',
    details: 'รองรับการแสดงผล 2 หน้าจอบน iPhone Duo และเพิ่มปุ่ม AirPlay มุมขวาบนของเครื่องเล่นเพลงเพื่อสตรีมเช็กมิกซ์ออกลำโพงสตูดิโอได้ทันที'
  },
  {
    date: '31 ต.ค. 2026',
    tier: 'Suno MCP beta',
    feature: 'Model Context Protocol',
    details: 'เชื่อมต่อ Suno เข้ากับไคลเอนต์ AI ภายนอกได้โดยตรงผ่านโปรโตคอล MCP ตามคู่มือ Suno MCP Help Center'
  },
  {
    date: '31 ต.ค. 2026',
    tier: 'Suno Studio',
    feature: 'Auto-stretch & Fine Pitch',
    details: 'เพิ่ม Auto-stretch ปรับไฟล์เสียงภายนอกให้ตรง BPM อัตโนมัติ, ปรับจูนพิทช์ละเอียดระดับเซนต์ (เช่น 2.38) และคีย์ลัด Shift+H ซ่อนแทร็ก'
  },
  {
    date: '7 พ.ย. 2026',
    tier: 'ทุกแพ็กเกจ',
    feature: 'Daily Song Challenge & Calendar View',
    details: 'เพิ่มโจทย์แต่งเพลงรายวันบนหน้าแรกทั้งเว็บ iOS และ Android พร้อมระบบ Calendar View ใน Library สำหรับปักหมุดติดตามผลงานตามปฏิทิน'
  }
];

export interface SunoV6CheatSheetRow {
  category: string;
  keywords: string[];
  sonicOutcome: string;
  samplePrompt: string;
}

export const SUNO_V6_MASTER_CHEATSHEET: SunoV6CheatSheetRow[] = [
  {
    category: 'ช่องเสียงและเนื้อเสียง (Vocal Registers & Timbre)',
    keywords: ['[Chest Voice]', '[Mixed Voice]', '[Head Voice]', '[Belting]', 'light vocal fry at onset', 'Raspy Baritone', 'Airy Soprano', 'keep vocal tone and loudness stable'],
    sonicOutcome: 'คุมความหนัก-เบาของเสียงร้องตามช่วงท่อนเพลง ป้องกันเสียงแกว่ง และเพิ่มความใกล้ชิดแนบหูแบบสตูดิโอ',
    samplePrompt: 'Thai Late-Night R&B, Breathy Female Vocal with Light Vocal Fry at Onset, Warm Rhodes Piano, Soft 808 Bass Sits Below Kick, Vocals Forward and Dry, Cymbals Washed in Background, 68 BPM'
  },
  {
    category: 'ฟิสิกส์ไมค์และมิกซ์ (Mic Physics & Mix Hierarchy)',
    keywords: ['Close mic presence', 'Proximity effect', 'warm tape saturation', 'bass sits below kick', 'vocals forward and dry', 'active verses, full-band energy throughout'],
    sonicOutcome: 'บรรยายสภาพกายภาพการอัดเสียงแทนคำกว้างๆ อย่าง radio-ready เพื่อดันเสียงร้องอยู่หน้ามิกซ์ชัดคม แก้ปัญหาท่อน Verse พลังตกและเสียงจมใน v6',
    samplePrompt: 'Thai Neo-Soul R&B, Dm7 - G7 - Cmaj7 jazz chord voicings, Lush 9th Chords, Warm Fender Rhodes, Close-miked and dry verse, Wide chorus, Warm tape saturation, 86 BPM'
  },
  {
    category: 'กีตาร์โปร่งและไฟฟ้า (Guitar Tunings & Pickup Models)',
    keywords: ['DADGAD tuning', 'High-Capo 7', '12-String Shimmer', 'Telecaster bridge', 'Stratocaster position 4', 'Les Paul neck'],
    sonicOutcome: 'กำหนดย่านความถี่และคาแรคเตอร์สายกีตาร์ให้ตรงแนว Folk, Funk, Dream Pop หรือ Rock อย่างแม่นยำ',
    samplePrompt: 'Thai Funk Rock, Fender Telecaster Bridge Pickup Twang, Biting Single-Coil Crunch, Slap Bass Solo Breakdown, ABBA Lyric Rhymes, Tight Punchy Horns, Powerful Male Vocals, 116 BPM'
  },
  {
    category: 'คีย์บอร์ดและออร์แกน (Vintage Keys & Rotary Speaker)',
    keywords: ['Fender Rhodes', 'Wurlitzer 200A', 'Hohner Clavinet D6', 'Hammond B3 Leslie'],
    sonicOutcome: 'แยกโทนเสียงหวานละมุน (Rhodes), สากอุ่น 70s (Wurlitzer), ดีดเด้งฟังก์ (Clavinet) หรือหมุนวนสเตอริโอ (Hammond B3) ได้แม่นยำ',
    samplePrompt: 'Thai Soulful Pop, Hammond B3 Organ, Leslie Rotary Speaker Growl, Fast Leslie Tremolo Swells, Stutter Vocal Chops, Punchy Live Drums, Soulful Male Vocals, 94 BPM'
  },
  {
    category: 'การเปลี่ยนท่อน ดรอป และตอนจบ (Drops, Key Change & Endings)',
    keywords: ['[Vocal Break]', '[False Ending]', '[Key Change (+1 Semitone)]', '[Drop: Hard Drop, Heavy Sidechain]', '[Fermata]', '[A cappella Outro]'],
    sonicOutcome: 'สร้างจุดพีคกลางเพลง เปลี่ยนคีย์ขึ้นครึ่งเสียงในฮุกสุดท้าย หักมุมด้วยความเงียบฉับพลัน หรือปิดท้ายด้วยเสียงกังวานธรรมชาติไม่โดนตัดจบห้วน',
    samplePrompt: 'Thai Acoustic Indie, Bluegrass Pop, Mandolin Chop Chords, Rapid Tremolo Picking, Fingerpicked Banjo Rolls, Upright Bass Thump, Close-mic Dry Vocals, A cappella Outro, 120 BPM'
  }
];

export const THAI_LYRIC_ENGINEERING_2026 = {
  syllableMath: [
    { meter: 'จังหวะ 4/4 (Pop / Indie / Funk)', count: '6–8 พยางค์', note: 'ใช้ Metric Symmetry Box (เช่น 7-7-7-7) ในท่อนฮุก หรือสลับ 8–10 กับ 4–5 พยางค์' },
    { meter: 'เพลงช้า Ballad (65–78 BPM)', count: '5–7 พยางค์', note: 'เปิดพื้นที่ให้คำสระเปิดลากเสียงสูงใน Chorus ได้ชัด' },
    { meter: 'จังหวะ 3/4 Waltz หรือ 6/8', count: '6 พยางค์เป๊ะ (หรือ 3+3)', note: 'ล็อกจังหวะโยกสามจังหวะให้ลงตัวทุกวรรค ไม่รวบคำ' },
    { meter: 'ท่อน Rap / Melodic Trap (130–155 BPM)', count: '8–12 พยางค์', note: 'ต้องวางสัมผัสใน 2–3 จุดต่อบรรทัด และใส่ [Silence] ท้ายท่อนที่ร้องรัว' }
  ],
  punctuationControl: [
    { symbol: ', (จุลภาค)', effect: 'พักสั้น 1/8 ห้อง เพื่อคุมจังหวะหายใจ' },
    { symbol: '. (มหัพภาค)', effect: 'หยุดเด็ดขาด กัน AI ร้องรวบคำเข้าประโยคถัดไป' },
    { symbol: '— (Em Dash)', effect: 'ชะงักกะทันหัน สร้างแรงกระแทกทางอารมณ์' },
    { symbol: '... หรือ -', effect: 'ลากเสียงสระยาว หรือเว้นช่องให้คอรัสแทรกแบบ Interlocking Vocals' },
    { symbol: '~ (Tilde)', effect: 'ลากเอื้อนลูกคอ Melisma / Vocal Runs เช่น โฮ~โอ~โอ~' },
    { symbol: 'เว้น 1 บรรทัดว่าง', effect: 'หยุดร้อง 1–2 วินาที ให้ดนตรีและ Reverb ทำงาน' }
  ],
  rhymeAndChorusRules: [
    'Melodic Weight Rule: วางคำฮุกหรือประโยคหมัดเด็ดที่แข็งแรงที่สุดไว้ในบรรทัดแรกของท่อน [Chorus] เสมอ',
    'No Verse-Chorus Echo: ห้ามนำคำฮุกหรือภาพหลักของท่อน Chorus ไปใส่ใน 2 บรรทัดสุดท้ายของ Verse หรือ Pre-Chorus เพื่อกันการสปอยล์อารมณ์',
    'Pre-Chorus Rhyme Acceleration (AABB): เร่งความถี่สัมผัสในท่อน Pre-Chorus ให้ชิดกันพร้อมแท็ก [Pre-Chorus: Ascending Melody, Pitch Climbs]',
    'สัมผัสเลือน (Slant Rhymes): จับคู่คำสระใกล้เคียงหรือมาตราตัวสะกดเดียวกัน (เช่น เปียก-เงียบ, วัน-จันทร์) ลดความแข็งทื่อในเพลงอินดี้และ R&B',
    'สัมผัสไขว้ภายใน (A-B-A-B): วางสัมผัสไขว้ภายในบรรทัดเดียวกันเพื่อเร่งโฟลว์คำร้องโดยไม่ต้องเพิ่ม BPM',
    'สัมผัสโอบ (ABBA Envelope Rhymes): จับคู่สระบรรทัด 1–4 โอบบรรทัด 2–3 เพื่อสร้างอารมณ์สุขุมลุ่มลึก',
    '3 รูปแบบ Final Chorus: (1) Strict Repeat ร้องซ้ำเป๊ะ / Double Chorus Climax, (2) Arrangement Lift คงเนื้อแต่เติมเครื่องดนตรีเต็มวง, (3) Intentional Final Lyric Variation เปลี่ยนบรรทัดสุดท้ายเพื่อสรุปเรื่อง',
    'ป้องกัน Lyric Bleed: ห้ามใส่เครื่องหมายคำพูด " ในช่อง Style Prompt เด็ดขาด เพราะ Suno v6 จะตีความเป็นคำร้อง'
  ]
};
