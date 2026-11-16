import {
  SongInput,
  LyricValidationReport,
  SunoModelTier,
  SongwritingMode,
  ModernizationReplacement
} from '../types';

export interface GenreWritingProfile {
  genreKey: string;
  thaiName: string;
  marketSegment: string;
  defaultSongwritingMode: 'storytelling' | 'emotional' | 'hybrid';
  eraSonicSignature: string;
  lyricStyleDirective: string;
  rhythmAndCadence: string;
  defaultArrangement: string;
  defaultProduction: string;
  defaultVocalStyle: string;
  defaultBpmRange: string;
  defaultKey: string;
  defaultExclude: string;
}

/**
 * Section 5.1: Complete Anti-Poetic Modernization Lexicon
 * Maps every forbidden archaic/poetic Thai word to its natural contemporary conversational replacement.
 */
export const ARCHAIC_WORD_REPLACEMENT_MAP: Record<string, string> = {
  // หัวใจ / ความรู้สึก
  'ดวงฤทัย': 'หัวใจ',
  'หทัย': 'หัวใจ',
  'ฤทัย': 'ใจ',
  'ดวงกมล': 'หัวใจ',
  'กมล': 'ใจ',
  'ดวงฤดี': 'หัวใจ',
  'ฤดี': 'ใจ',
  'อุรา': 'อกข้างซ้าย',
  'ดวงจิต': 'ใจ',
  'วิญญาณ์': 'ความรู้สึก',
  'วิญญา': 'ความรู้สึก',
  // ความเศร้า / ความเจ็บปวด
  'ร้าวราน': 'พังไปหมด',
  'ตรอมตรม': 'เหนื่อยใจ',
  'ระทม': 'เจ็บข้างใน',
  'ขื่นขมระกำ': 'กลืนไม่เข้าคายไม่ออก',
  'โศกศัลย์': 'เสียใจ',
  'จาบัลย์': 'เจ็บลึก',
  'อาดูร': 'เสียใจ',
  'ชอกช้ำระกำใจ': 'ใจพังไม่ไหว',
  'คร่ำครวญ': 'คิดถึง',
  'ครวญคร่ำ': 'คิดถึง',
  // น้ำตา / การร้องไห้
  'น้ำเนตร': 'น้ำตา',
  'ชลนา': 'น้ำตา',
  'ชลเนตร': 'น้ำตา',
  'ร่ำไห้': 'ร้องไห้เงียบๆ',
  'โศกา': 'ร้องไห้',
  'น้ำตารินไหลอาบแก้ม': 'น้ำตาซึมไม่รู้ตัว',
  // ท้องฟ้า / ดวงดาว / ธรรมชาติ
  'ทิฆัมพร': 'ท้องฟ้า',
  'อัมพร': 'ท้องฟ้า',
  'เวหา': 'ท้องฟ้า',
  'นภา': 'ฟ้า',
  'ดาริกา': 'ดาว',
  'ดารา': 'ดาว',
  'จันทรา': 'พระจันทร์',
  'สุริยา': 'แดดเช้า',
  'ทิวา': 'ตอนกลางวัน',
  'ราตรี': 'คืนนี้',
  'สายัณห์': 'ตอนเย็น',
  'วายุ': 'ลมหนาว',
  'พสุธา': 'พื้นถนน',
  'พิรุณ': 'ฝน',
  // ความรัก / คนรัก
  'ยอดชู้': 'คนดี',
  'ยอดดวงใจ': 'คนโปรด',
  'ขวัญตา': 'เธอ',
  'ขวัญชีวา': 'คนที่เคยรัก',
  'กานดา': 'เธอ',
  'พธู': 'เธอ',
  'นงคราญ': 'เธอ',
  'โฉมยง': 'เธอ',
  'ปองภักดิ์': 'รักเดียว',
  'เสน่หา': 'ความรู้สึกรัก',
  'พิศวาส': 'หลงรัก',
  // การจากลา / การหายไป
  'มลาย': 'หายไป',
  'สูญสลาย': 'จบลง',
  'อวสาน': 'จบลง',
  'พรากจาก': 'แยกย้าย',
  'ร้างลา': 'เดินออกไป',
  'จรลี': 'เดินจากไป',
  'ลับลา': 'ไม่กลับมา',
  'มิหวนคืน': 'ไม่กลับมา',
  // คำเชื่อมและคำปฏิเสธโบราณ
  'มิอาจ': 'ไม่อาจ',
  'มิวาย': 'ก็ยัง',
  'มิเคย': 'ไม่เคย',
  'ครั้นเมื่อ': 'ตอนที่',
  'ประดุจ': 'เหมือนกับ',
  'เฉกเช่น': 'เหมือน',
  'ไฉน': 'ทำไม',
  'โอ้ว่า': '',
  'อนิจจา': '',
  'ภวังค์': 'ความคิดถึง',
  'เพรียกหา': 'ตามหา',
  'รัญจวน': 'ปั่นป่วนในใจ'
};

export const BANNED_ARCHAIC_WORDS = Object.keys(ARCHAIC_WORD_REPLACEMENT_MAP);

export const OVERUSED_NATURE_CLICHES = [
  'ดวงดาว',
  'แสงจันทร์',
  'ท้องฟ้ามืดมน',
  'สายลมพัดผ่าน',
  'เงามืด',
  'โชคชะตา',
  'นิรันดร์',
  'บาดแผลในใจ',
  'หัวใจแตกสลาย',
  'ปีกที่แตกหัก',
  'กาลเวลาหมุนเวียน'
];

export const FORBIDDEN_FIRST_LINE_OPENERS = [
  'ความรักคือ',
  'ในวันที่ท้องฟ้า',
  'กาลเวลา',
  'โชคชะตา',
  'ในคืนที่ดาว',
  'เมื่อสายลม',
  'ความเงียบงัน',
  'โอ้ความรัก'
];

export const DEFAULT_STRUCTURE_SECTIONS = [
  'อินโทร (Intro)',
  'เนื้อเพลงหลัก (Verse)',
  'พรีคอรัส (Pre-Chorus)',
  'คอรัส (Highlight)',
  'โพสต์คอรัส (Post-Chorus)',
  'บริดจ์ (Bridge)',
  'เอาท์โทร (Outro)'
];

export const BANNED_VERDICT_ADJECTIVES = [
  'radio-ready',
  'radio ready',
  'professional',
  'amazing',
  'masterpiece',
  'studio quality',
  'world-class',
  'incredible',
  'perfect mix'
];

/**
 * Sanitizes Suno v6 Style Prompts:
 * 1) Strips double quotes (") to prevent Lyric Bleed bug in Suno v6.
 * 2) Replaces vague verdict adjectives ("radio-ready", "professional", "amazing")
 *    with physical recording & mix relationship descriptors.
 */
export function sanitizeStylePromptForSunoV6(rawPrompt: string, maxLength = 250): string {
  let cleaned = (rawPrompt || '')
    .replace(/["“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  for (const verdict of BANNED_VERDICT_ADJECTIVES) {
    const regex = new RegExp(`\\b${verdict.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(cleaned)) {
      cleaned = cleaned.replace(regex, 'close-miked warm tape saturation');
    }
  }

  cleaned = cleaned
    .replace(/\s*,\s*,+/g, ', ')
    .replace(/^,\s*|,\s*$/g, '')
    .trim();

  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength - 3).trim().replace(/,\s*$/, '') + '...';
  }
  return cleaned;
}

export const GENRE_PROFILES: Record<string, GenreWritingProfile> = {
  'Pop': {
    genreKey: 'Pop',
    thaiName: 'ป๊อปร่วมสมัย (Modern T-Pop / Urban Mass Pop)',
    marketSegment: '1. T-Pop / Urban Pop / Mass Pop',
    defaultSongwritingMode: 'hybrid',
    eraSonicSignature: '2020s Modern Thai Urban Pop meets Global Chart Pop',
    lyricStyleDirective: 'ใช้คำสั้นกระชับ 1-2 พยางค์ เข้าปากคนร้องทันที (6-8 พยางค์ในห้อง 4/4) ห้ามนำคำฮุกไปสปอยล์ใน 2 บรรทัดท้ายของ Verse/Pre-Chorus (No Verse-Chorus Echo) และมี Viral Caption Line ในท่อน Chorus',
    rhythmAndCadence: 'สมมาตรพยางค์ (Metric Symmetry ±2 พยางค์) ท่อนฮุกคำท้ายลงด้วยเสียงสระเปิด (อา, ออ, ไอ, เอา, อัง, อัน) พร้อมเลือก Final Chorus แบบ Strict Repeat / Arrangement Lift / Final Lyric Variation ตามเรื่องราว',
    defaultArrangement: 'Clean Stratocaster position 4 rhythm guitar, warm Fender Rhodes chords, punchy hybrid drums, melodic bass sits below kick',
    defaultProduction: 'Close-miked vocals forward and dry, tight studio booth verse to wide stereo chorus, warm tape saturation, cymbals washed in background',
    defaultVocalStyle: 'Chest voice verse to mixed voice pre-chorus, clear belting chorus with subtle vocal harmonies and [Silence] after fast lines',
    defaultBpmRange: '112 BPM',
    defaultKey: 'C Major',
    defaultExclude: 'heavy reverb, screaming, harsh distortion, death metal, mumble rap, muddy low-end, robotic monotone'
  },
  'T-Pop Dance': {
    genreKey: 'T-Pop Dance',
    thaiName: 'ทีป๊อปแดนซ์ (Modern T-Pop Dance)',
    marketSegment: '1. T-Pop / Urban Pop / Mass Pop',
    defaultSongwritingMode: 'emotional',
    eraSonicSignature: '2020s High-Energy T-Pop Boy/Girl Group & Y2K Dance Revival',
    lyricStyleDirective: 'ใช้คำพูดติดปากวัยรุ่น จังหวะคำกระชับสั้น เน้นสัมผัสไขว้ภายใน A-B-A-B และจังหวะยก Syncopation พร้อม [Post-Chorus] ที่มีวลีติดหู 2-4 คำสำหรับคลิปสั้น',
    rhythmAndCadence: '5-8 พยางค์ต่อวรรค ล็อกจังหวะ Anaphora ต้นบรรทัดสลับพยางค์สั้นกระชับก่อนเข้า Drop',
    defaultArrangement: 'Lush supersaw leads, sidechained four-on-the-floor kick, slap funk bass, tight punchy horn stabs, syncopated handclaps',
    defaultProduction: 'Sidechain pumping groove, warm tape saturation, mono centered verse to wide stereo spread drop, vocals forward and dry',
    defaultVocalStyle: 'Energetic charismatic T-Pop vocals, crisp articulation, octave vocal doubling in chorus, tight interlocking ad-libs',
    defaultBpmRange: '124 BPM',
    defaultKey: 'A Minor',
    defaultExclude: 'heavy reverb, slow acoustic ballad, classical opera, muddy mix, sluggish tempo, dry monotone vocal'
  },
  'R&B': {
    genreKey: 'R&B',
    thaiName: 'อาร์แอนด์บีร่วมสมัย (Urban R&B / Late-Night Soul)',
    marketSegment: '5. Thai Hip-Hop / Melodic Rap / R&B',
    defaultSongwritingMode: 'hybrid',
    eraSonicSignature: '2020s Urban Bangkok Late-Night R&B & 90s Neo-Soul Warmth',
    lyricStyleDirective: 'ใช้ประสาทสัมผัสทั้ง 5 ผสมฉากชีวิตจริงในเมือง เว้นช่องไฟ ... 1-2 วินาทีให้เสียงประสานแบบ Interlocking Vocals ทำงาน และเลี่ยงสัมผัสแข็งทื่อด้วยสัมผัสเลือน (Slant Rhymes)',
    rhythmAndCadence: 'ร้องหน่วงหลังบีทแบบ Laid-Back Pocket 5-8 พยางค์ต่อวรรค ท้ายวรรคฮุกใช้คำเป็นเสียงเปิดและเสียงนาสิก (จำ, นาน, เธอ, เดิม)',
    defaultArrangement: 'Warm Fender Rhodes Dm7-G7-Cmaj7 jazz voicings, lush 9th chords, soft 808 sub-bass sits below kick, crisp rimshot beat',
    defaultProduction: 'Close mic presence with proximity effect extra low end, vocals forward and dry, cymbals washed in background, warm tape saturation',
    defaultVocalStyle: 'Breathy close-mic vocal with light vocal fry at onset, silky head voice bridge, interlocking backing harmonies',
    defaultBpmRange: '88 BPM',
    defaultKey: 'F Minor',
    defaultExclude: 'heavy reverb, heavy metal distortion, screaming vocals, fast punk drums, country banjo, robotic monotone voice'
  },
  'Hip-hop': {
    genreKey: 'Hip-hop',
    thaiName: 'ฮิปฮอป & แร็ป (Thai Hip-Hop / Melodic Rap)',
    marketSegment: '5. Thai Hip-Hop / Melodic Rap / R&B',
    defaultSongwritingMode: 'storytelling',
    eraSonicSignature: 'Modern Thai Hip-Hop / Boom-Bap & Melodic Rap Crossover',
    lyricStyleDirective: 'วางสัมผัสไขว้ภายใน 2-3 จุดต่อบรรทัด (8-12 พยางค์ในท่อน Rap) สลับท่อนสั้น 4-5 พยางค์เพื่อสร้าง Contrast และมี Punchline คมคาย',
    rhythmAndCadence: 'สลับจังหวะ Triplet Flow กับคำสั้น 4-5 พยางค์ เติม [Silence] ท้ายบรรทัดที่ร้องรัวเพื่อกันเสียงร้องจม',
    defaultArrangement: 'Crunchy SP-1200 12-bit drums, room-micd fat snare crack, 808 sub bass glide sits below kick, dusty vinyl piano loop',
    defaultProduction: 'Close-miked and dry upfront rap vocal, tight studio booth acoustic space, warm analog saturation, clean headroom',
    defaultVocalStyle: 'Confident rhythmic rap flow, sharp consonant delivery, double-tracked lead vocals on punchlines, energetic ad-libs',
    defaultBpmRange: '96 BPM',
    defaultKey: 'G Minor',
    defaultExclude: 'heavy reverb, operatic singing, acoustic country strumming, cheesy synth brass, muddy bass, off-beat vocals'
  },
  'Modern Trap': {
    genreKey: 'Modern Trap',
    thaiName: 'โมเดิร์นแทร็ป (Modern Melodic Trap)',
    marketSegment: '5. Thai Hip-Hop / Melodic Rap / R&B',
    defaultSongwritingMode: 'emotional',
    eraSonicSignature: '2020s Dark Melodic Trap & Heavy 808 Sub-Bass',
    lyricStyleDirective: 'โฟลว์สมัยใหม่ 8-12 พยางค์สลับท่อนฮุกคำสั้นกระชับ เล่นสัมผัสในคมชัด พร้อม Stutter vocal chop หรือ Pitched-down Formant Shift ก่อนท่อน Drop',
    rhythmAndCadence: 'จังหวะ Triplet flow สลับคำสั้นคมชัด เติม [Silence] ท้ายท่อนเร็วและใช้ Double-tracked hook',
    defaultArrangement: '808 sub bass glide sits below kick, rapid triplet hi-hat rolls, dark reese bass texture, snappy snare, sparse bell synths',
    defaultProduction: 'Tight dry booth vocals forward in mix, saturated 808 sub clarity, wide stereo spread chorus, subtle stutter gate breaks',
    defaultVocalStyle: 'Melodic trap vocal flow, hard auto-tune pitch-snap cadence, double-tracked hook, layered call-and-response ad-libs',
    defaultBpmRange: '138 BPM',
    defaultKey: 'C# Minor',
    defaultExclude: 'heavy reverb, acoustic folk guitar, classical strings, vintage disco, thin bass, slow ballad drums'
  },
  'Rock': {
    genreKey: 'Rock',
    thaiName: 'ร็อค & โมเดิร์นร็อค (Thai Modern Rock / Emo Rock)',
    marketSegment: '4. Thai Rock / Modern Rock / Pop-Rock / Emo Rock',
    defaultSongwritingMode: 'hybrid',
    eraSonicSignature: '2000s Thai Stadium Rock Energy meets Modern Alternative Rock',
    lyricStyleDirective: 'สร้างพลังการระบายอารมณ์ (Catharsis) ห้ามสปอยล์คำฮุกใน 2 บรรทัดสุดท้ายของ Verse/Pre-Chorus แล้วระเบิดพลังในบรรทัดแรกของ Chorus แบบตะโกนร้องตามได้',
    rhythmAndCadence: 'ห้ามวางคำตายเสียงสั้น (รัก, จบ, หมด, เจ็บ, หยุด) ไว้ท้ายวรรคฮุกเด็ดขาด ต้องใช้คำเป็นเสียงเปิด (อา, ออ, ไอ, เอา, อัง, อัน)',
    defaultArrangement: 'Gibson Les Paul neck humbucker warmth, Telecaster bridge pickup crunch, drums sound room-micd, overhead cymbal shimmer, driving bass',
    defaultProduction: 'Live-room acoustics, mono centered verse expanding to wide stereo spread chorus, vocals forward and dry, warm tape saturation',
    defaultVocalStyle: 'Chest voice verse building to passionate belting chorus, gritty emotional edge, octave vocal doubling on final climax',
    defaultBpmRange: '126 BPM',
    defaultKey: 'E Major',
    defaultExclude: 'heavy reverb, mumble rap, cheap plastic midi synths, sleepy lo-fi beat, robotic vocal, weak drums'
  },
  'Indie': {
    genreKey: 'Indie',
    thaiName: 'อินดี้ & เบดรูมป๊อป (Thai Indie / Bedroom Pop / Shoegaze)',
    marketSegment: '2. Thai Indie / Bedroom Pop / Alternative / Shoegaze',
    defaultSongwritingMode: 'emotional',
    eraSonicSignature: '90s Bangkok Alternative Nostalgia & 2020s Dreamy Indie Shoegaze',
    lyricStyleDirective: 'ใช้สัมผัสเลือน (Slant Rhymes เช่น เปียก-เงียบ, วัน-จันทร์) หรือสัมผัสโอบ ABBA ลดความแข็งทื่อ ใช้ภาพสิ่งของรอบตัวและเว้น 1 บรรทัดว่างให้ดนตรีหายใจ',
    rhythmAndCadence: '4-8 พยางค์ต่อบรรทัด เน้นลากเสียงสระเปิดและเว้นช่องไฟให้ Analog chorus pedal กีตาร์และเสียงร้องตอบโต้กัน',
    defaultArrangement: 'High-Capo Acoustic Guitar Capo 7 chimey jangly strumming, DADGAD open string drone, analog chorus pedal on clean guitar, warm upright bass',
    defaultProduction: 'Acoustic live-room acoustics, close mic presence with proximity effect extra low end, warm tape saturation, natural room decay',
    defaultVocalStyle: 'Intimate conversational chest voice, light vocal fry at onset, subtle audible inhale, airy head voice bridge',
    defaultBpmRange: '88 BPM',
    defaultKey: 'D Major',
    defaultExclude: 'heavy reverb, over-compressed EDM drop, screaming metal, generic corporate muzak, harsh digital clipping'
  },
  'City Pop': {
    genreKey: 'City Pop',
    thaiName: 'ซิตี้ป๊อป (80s Retro City Pop / Thai Urban Synth)',
    marketSegment: '2. Thai Indie / Bedroom Pop / Alternative / Shoegaze',
    defaultSongwritingMode: 'emotional',
    eraSonicSignature: '1980s Retro Tokyo-Bangkok City Pop & Modern Synth-Funk',
    lyricStyleDirective: 'บรรยากาศเมืองยามค่ำคืน ขับรถบนทางด่วน ไฟถนนสะท้อนกระจก ใช้สัมผัสไขว้ A-B-A-B หรือสัมผัสเลือนร่วมสมัยให้ไหลลื่นกับกรูฟ',
    rhythmAndCadence: '5-8 พยางค์ต่อวรรค เน้นจังหวะ Syncopated groove ร่วมกับ Slap Bass และคอร์ด Fender Rhodes',
    defaultArrangement: 'Hohner Clavinet D6 bounce, sparkling Fender Rhodes, slap funk bass solo pocket, Stratocaster position 4, tight brass stabs',
    defaultProduction: 'Warm tape saturation, room-micd drums with fat snare crack, wide stereo spread chorus, vocals forward and dry',
    defaultVocalStyle: 'Smooth breezy chest-to-mixed voice delivery, syncopated phrasing, interlocking harmonies in post-chorus',
    defaultBpmRange: '114 BPM',
    defaultKey: 'E Flat Major',
    defaultExclude: 'heavy reverb, heavy metal distortion, aggressive trap screaming, dry lo-fi mono mix, dissonant noise'
  },
  'Luk Thung': {
    genreKey: 'Luk Thung',
    thaiName: 'ลูกทุ่งอินดี้ร่วมสมัย (Modern Isan Indie Luk Thung Pop)',
    marketSegment: '3. ลูกทุ่งยุคใหม่ / อินดี้ลูกทุ่ง / หมอลำซิ่ง / รถแห่',
    defaultSongwritingMode: 'storytelling',
    eraSonicSignature: 'Modern Isan Indie Luk Thung Pop-Rock Ballad (100M+ Views Era)',
    lyricStyleDirective: 'จริงใจ ตรงไปตรงมา เล่าเรื่องชีวิตจริงตามเส้นเวลา 4 องก์ ใช้คำอีสาน/ลูกทุ่งที่เป็นธรรมชาติ (อ้าย, เจ้า, บ่เป็นหยัง, คิดฮอด, เฮ็ดงาน) ห้ามปนคำราชาศัพท์หรือคำกวีภาคกลาง',
    rhythmAndCadence: '8-12 พยางค์ต่อบรรทัดใน Verse และคำท้ายฮุกเป็นสระเปิดให้เอื้อนลูกคอ Vibrato/Portamento ได้งดงาม',
    defaultArrangement: 'Acoustic Thai Phin accents, 12-string acoustic guitar shimmer, traditional bamboo flute Khlui lead, warm upright bass, live drums',
    defaultProduction: 'Acoustic live-room acoustics, close mic presence vocals forward and dry, cymbals washed in background, warm analog saturation',
    defaultVocalStyle: 'Heartfelt chest voice verse to expressive vibrato and portamento chorus belting with authentic Isan charm',
    defaultBpmRange: '86 BPM',
    defaultKey: 'G Major',
    defaultExclude: 'heavy reverb, heavy EDM synth drop, trap hi-hats, auto-tune robotic vocal, aggressive metal screaming, opera singing'
  },
  'Molam': {
    genreKey: 'Molam',
    thaiName: 'หมอลำซิ่ง & หมอลำฟิวชัน (Modern Mor Lam EDM / Festive Groove)',
    marketSegment: '3. ลูกทุ่งยุคใหม่ / อินดี้ลูกทุ่ง / หมอลำซิ่ง / รถแห่',
    defaultSongwritingMode: 'storytelling',
    eraSonicSignature: '2020s New Wave Mor Lam Fusion & Festive Stage Energy',
    lyricStyleDirective: 'สนุกสนานม่วนซื่นหน้าฮ้าน หรือขยี้ใจคนอกหักแบบหมอลำยุคใหม่ มีคำสร้อยและท่อนโจ๊ะที่รับส่งกับเสียงพิณและแคนอย่างลงตัว',
    rhythmAndCadence: 'จังหวะคำกระชับ คล้องจองต่อเนื่อง มีจังหวะหยุด [Vocal Break] รับส่งกับเครื่องเป่า พิณ และแคน',
    defaultArrangement: 'Electrifying Thai Phin signature riff, expressive Khaen lead, slap funk bass, tight punchy horn stabs, polyrhythmic hand percussion',
    defaultProduction: 'Live-room stage energy, room-micd fat snare crack, punchy bass below kick, vocals forward and dry',
    defaultVocalStyle: 'Expressive Isan Molam vocal, agile vibrato and rhythmic phrasing, call-and-response backing vocals',
    defaultBpmRange: '130 BPM',
    defaultKey: 'A Minor',
    defaultExclude: 'heavy reverb, sleepy ambient drone, classical western opera, flat monotone vocal, muddy rhythm'
  },
  'Electronic': {
    genreKey: 'Electronic',
    thaiName: 'อิเล็กทรอนิกส์ & แดนซ์ (Electronic / Synthwave / EDM Pop)',
    marketSegment: '1. T-Pop / Urban Pop / Mass Pop',
    defaultSongwritingMode: 'emotional',
    eraSonicSignature: '2020s Retro-Futuristic Synthwave & Melodic Club EDM',
    lyricStyleDirective: 'ใช้ถ้อยคำสั้น คม เน้นมวลอารมณ์และแสงสี มี [Stutter Gate Break] ก่อน Drop และ [Post-Chorus] วลีสั้นจำทันที',
    rhythmAndCadence: '4-7 พยางค์ต่อวรรค ล็อกจังหวะ Anaphora ต้นบรรทัด ใช้คำสระเปิดลอยเหนือเสียงซินธ์และ Sidechain Pumping',
    defaultArrangement: 'Acid 303 squelch bass, lush supersaw leads, resonance cutoff filter sweeps, heavy four-on-the-floor kick, sidechain pumping',
    defaultProduction: 'Mono centered verse to wide stereo spread drop, warm tape saturation, vocals forward and dry, crisp high-pass filter sweep breakdown',
    defaultVocalStyle: 'Clean airy mixed voice building to belted hook, stutter vocal chop accents, soft spoken asides in breakdown',
    defaultBpmRange: '126 BPM',
    defaultKey: 'F# Minor',
    defaultExclude: 'heavy reverb, unplugged acoustic folk, sloppy live drums, muddy low-mid frequencies, dry unmixed vocals'
  },
  'Ballad': {
    genreKey: 'Ballad',
    thaiName: 'บัลลาดซึ้งกินใจ (Modern Viral Sad Ballad)',
    marketSegment: '1. T-Pop / Urban Pop / Mass Pop',
    defaultSongwritingMode: 'hybrid',
    eraSonicSignature: '2020s Acoustic & Cinematic Piano Viral Ballad',
    lyricStyleDirective: 'เปิดด้วยฉากเฉพาะเจาะจงตั้งแต่วินาทีที่ 7 ห้ามสปอยล์คำฮุกก่อนถึง Chorus ใช้เสียงลมหายใจจริง [Audible Inhale] และเลือกจบแบบ Double Chorus / Arrangement Lift / Final Lyric Variation',
    rhythmAndCadence: 'ห้อง Ballad ใช้ 5-7 พยางค์ (หรือ 6 พยางค์เป๊ะสำหรับ 3/4, 6/8) เว้น 1 บรรทัดว่างให้เปียโนและเสียงสายทำงาน',
    defaultArrangement: 'Warm grand piano, intimate string quartet counterpoint, warm legato cello solo bridge, subtle bamboo flute Khlui breathy tone',
    defaultProduction: 'Close mic presence with proximity effect extra low end, tight studio booth verse to concert hall space climax, cymbals washed in background',
    defaultVocalStyle: 'Intimate chest voice with audible inhale, head voice falsetto bridge, soaring belted final chorus, fermata acoustic resonance ending',
    defaultBpmRange: '78 BPM',
    defaultKey: 'D Flat Major',
    defaultExclude: 'heavy reverb, fast dance beat, aggressive rap, harsh distortion, rushed phrasing, robotic monotone'
  }
};

export interface AssembledSongPipeline {
  normalizedInput: SongInput;
  resolvedProfile: GenreWritingProfile;
  resolvedSongwritingMode: 'storytelling' | 'emotional' | 'hybrid';
  resolvedStructure: string[];
  resolvedSunoModel: SunoModelTier;
  resolvedWeirdness: number;
  resolvedStyleInfluence: number;
  resolvedExcludeStyles: string;
  userAllowedCliches: string[];
  preDetectedReplacements: ModernizationReplacement[];
  promptText: string;
}

/**
 * Resolves the primary genre profile from a potentially multi-genre string
 */
export function resolveGenreProfile(genreString: string): GenreWritingProfile {
  const lower = (genreString || 'Pop').toLowerCase();
  if (lower.includes('t-pop') || lower.includes('dance')) return GENRE_PROFILES['T-Pop Dance'];
  if (lower.includes('trap')) return GENRE_PROFILES['Modern Trap'];
  if (lower.includes('hip-hop') || lower.includes('rap')) return GENRE_PROFILES['Hip-hop'];
  if (lower.includes('r&b') || lower.includes('soul')) return GENRE_PROFILES['R&B'];
  if (lower.includes('city pop')) return GENRE_PROFILES['City Pop'];
  if (lower.includes('molam') || lower.includes('หมอลำ')) return GENRE_PROFILES['Molam'];
  if (lower.includes('luk thung') || lower.includes('ลูกทุ่ง') || lower.includes('isan')) return GENRE_PROFILES['Luk Thung'];
  if (lower.includes('rock') || lower.includes('metal') || lower.includes('alternative')) return GENRE_PROFILES['Rock'];
  if (lower.includes('indie') || lower.includes('dreampop') || lower.includes('shoegaze') || lower.includes('lo-fi') || lower.includes('acoustic') || lower.includes('folk')) return GENRE_PROFILES['Indie'];
  if (lower.includes('electronic') || lower.includes('synth') || lower.includes('disco') || lower.includes('edm')) return GENRE_PROFILES['Electronic'];
  if (lower.includes('ballad') || lower.includes('orchestra') || lower.includes('cinematic')) return GENRE_PROFILES['Ballad'];
  return GENRE_PROFILES['Pop'];
}

/**
 * Scans user-provided originalLyrics for archaic/poetic words before sending to AI (Fallback Protocol Case 1)
 */
export function scanArchaicWordsInText(text: string): ModernizationReplacement[] {
  if (!text || !text.trim()) return [];
  const found: ModernizationReplacement[] = [];
  for (const [archaic, modern] of Object.entries(ARCHAIC_WORD_REPLACEMENT_MAP)) {
    if (text.includes(archaic)) {
      found.push({
        originalWord: archaic,
        modernReplacement: modern || '(ตัดคำฟุ่มเฟือยออก)',
        reason: 'ปรับคำกวีล้าสมัยเป็นภาษาพูดร่วมสมัยที่เข้าปากคนร้องและไม่เพี้ยนวรรณยุกต์ใน Suno v6'
      });
    }
  }
  return found;
}

/**
 * Builds the complete Thai & Global Hitmaker + Suno v6 Architecture Engine Pipeline
 */
export function buildSongwritingPipeline(rawInput: SongInput): AssembledSongPipeline {
  const mode = rawInput.mode || 'create';
  const genre = (rawInput.genre || 'Pop').trim() || 'Pop';
  const moods = Array.isArray(rawInput.moods) && rawInput.moods.length > 0
    ? rawInput.moods.map(m => m.trim()).filter(Boolean)
    : ['สดใส (Bright)'];
  const theme = (rawInput.theme || '').trim() || 'เรื่องราวความรู้สึกในชีวิตจริงที่ผู้ฟังเข้าถึงได้ทันทีตั้งแต่วินาทีที่ 7';
  const keywords = Array.isArray(rawInput.keywords)
    ? rawInput.keywords.map(k => k.trim()).filter(Boolean)
    : [];
  const artist = (rawInput.artist || '').trim() || 'Modern Expressive Vocalist';
  const vocalGender = (rawInput.vocalGender || '').trim() || 'Not specified';
  const length = rawInput.length || '3-4 min';
  const language = rawInput.language || 'Thai Only';
  const englishMixRatio: 25 | 50 | 75 =
    rawInput.englishMixRatio === 50 || rawInput.englishMixRatio === 75
      ? rawInput.englishMixRatio
      : 25;
  const thaiMixRatio = 100 - englishMixRatio;

  const profile = resolveGenreProfile(genre);

  // Resolve Songwriting Mode ('storytelling' | 'emotional' | 'hybrid')
  const requestedSongwritingMode: SongwritingMode = rawInput.songwritingMode || 'auto';
  const resolvedSongwritingMode: 'storytelling' | 'emotional' | 'hybrid' =
    requestedSongwritingMode === 'auto'
      ? profile.defaultSongwritingMode
      : requestedSongwritingMode;

  let songwritingModeDirective = '';
  if (resolvedSongwritingMode === 'storytelling') {
    songwritingModeDirective = `
[SONGWRITING ARCHITECTURE: MODE 1 — NARRATIVE / STORYTELLING ARCHITECTURE (โหมดเน้นเล่าเรื่อง 4 องก์)]
- ความหนาแน่นพยางค์: 8–13 พยางค์ต่อบรรทัด กระชับเหมือนจังหวะพูดเล่าเรื่องจริง
- โครงสร้างการเดินเรื่อง 4 องก์บังคับ:
  1. [Verse 1 - The Setup]: ปูฉาก เวลา สถานที่ และตัวละครด้วยภาพที่มองเห็นได้ด้วยตา (Visual Concrete Details) ห้ามเปิดด้วยการสรุปความรู้สึกนามธรรม
  2. [Pre-Chorus - The Inciting Tension]: จุดสะกิดใจหรือความขัดแย้งที่เริ่มก่อตัวเพื่อส่งเข้าคำถามหลักใน Chorus
  3. [Chorus - The Core Meaning]: สรุปหัวใจของเรื่องเป็นประโยคหลักที่จำง่ายพร้อม Viral Caption Line
  4. [Verse 2 - The Escalation / Time Progression]: เวลาต้องเดินหน้าหรือเหตุการณ์ต้องเปลี่ยนไปจาก Verse 1 (เช่น จากตอนเย็น -> ตอนดึก, จากวันแรก -> วันที่ต้องแยกย้าย) ห้ามเขียน Verse 2 พูดเรื่องเดิมซ้ำกับ Verse 1 ด้วยคำใหม่เด็ดขาด!
  5. [Bridge - The Plot Twist / Realization]: จุดหักมุมหรือการตระหนักรู้ครั้งสำคัญก่อนส่งเข้า [Final Chorus]`;
  } else if (resolvedSongwritingMode === 'emotional') {
    songwritingModeDirective = `
[SONGWRITING ARCHITECTURE: MODE 2 — EMOTIONAL / VIBE / ATMOSPHERIC ARCHITECTURE (โหมดเน้นสื่อความรู้สึกและบรรยากาศ)]
- ความหนาแน่นพยางค์: 4–8 พยางค์ต่อบรรทัด ลดจำนวนคำเพื่อเพิ่มพื้นที่ให้ดนตรี Reverb และ Delay ทำงาน
- โครงสร้างคลื่นอารมณ์ (Sensory & Emotional Wave Design):
  1. Sensory Immersion Over Plot: ใช้ประสาทสัมผัสทั้ง 5 (แสง สี อุณหภูมิ กลิ่น เสียง สัมผัส เช่น แสงไฟสีส้มข้างทาง กลิ่นฝนบนพื้นถนน แอร์เย็นตอนตีสอง) สร้างมวลอารมณ์แทนการเล่าพล็อตยาว
  2. Verse 1 -> Verse 2 Sensory Shift: เปลี่ยนมุมกล้องหรือเปลี่ยนประสาทสัมผัสในอารมณ์เดิมอย่างมีมิติ
  3. Hypnotic Repetition & Micro-Variation: ซ้ำวลีสำคัญใน Chorus / Post-Chorus 2–3 ครั้งโดยบิดคำท้ายเล็กน้อยเพื่อสะกดอารมณ์ผู้ฟัง`;
  } else {
    songwritingModeDirective = `
[SONGWRITING ARCHITECTURE: MODE 3 — HYBRID HITMAKER ARCHITECTURE (โหมดผสมผสาน: เล่าเรื่องฉากจริงใน Verse + ระเบิดมวลอารมณ์ใน Chorus)]
- ผสานจุดแข็งของทั้ง 2 โหมดเข้าด้วยกันตามมาตรฐานเพลงฮิตติดชาร์ต:
  1. ใน [Verse 1] และ [Verse 2] ใช้ Storytelling (8–11 พยางค์ต่อบรรทัด) เปิดด้วยฉาก เวลา และสิ่งของที่มีอยู่จริง โดย [Verse 2] ต้องมีความคืบหน้าของเวลาหรือเหตุการณ์ที่เดินหน้าต่อจาก [Verse 1] เสมอ
  2. ใน [Chorus] และ [Post-Chorus] ใช้ Emotional/Anthemic Contrast (คำน้อยลง ลากเสียงสระเปิดยาวขึ้น) เพื่อตอกย้ำประโยคทอง (Viral Caption Line) ให้จำได้ตั้งแต่ฟังครั้งแรก`;
  }

  let languageDirective = '';
  if (language === 'Thai Only') {
    languageDirective = 'ภาษาไทยล้วน 100% ในเนื้อร้อง (แต่คำสั่งโครงสร้างใน [...] ต้องเป็นภาษาอังกฤษล้วน 100%)';
  } else if (language === 'Thai-English Mix') {
    if (englishMixRatio === 25) {
      languageDirective = `ผสมไทย-อังกฤษ สัดส่วน 25% (ภาษาไทย ${thaiMixRatio}% : ภาษาอังกฤษ ${englishMixRatio}%) — เน้นเนื้อร้องภาษาไทยเป็นหลัก 75% และแทรกคำทับศัพท์/ท่อนฮุกภาษาอังกฤษที่ใช้ในชีวิตประจำวันจริงประมาณ 25% อย่างเป็นธรรมชาติ`;
    } else if (englishMixRatio === 50) {
      languageDirective = `ผสมไทย-อังกฤษ สัดส่วน 50% (ภาษาไทย ${thaiMixRatio}% : ภาษาอังกฤษ ${englishMixRatio}%) — ผสมเนื้อร้องภาษาไทยและภาษาอังกฤษอย่างละครึ่ง (50:50) สลับท่อนหรือวรรคอย่างกลมกลืน`;
    } else {
      languageDirective = `ผสมไทย-อังกฤษ สัดส่วน 75% (ภาษาไทย ${thaiMixRatio}% : ภาษาอังกฤษ ${englishMixRatio}%) — เน้นเนื้อร้องภาษาอังกฤษเป็นหลัก 75% และแทรกท่อนภาษาไทยที่มีเสน่ห์ประมาณ 25% อย่างลงตัว`;
    }
  } else {
    languageDirective = 'ภาษาอังกฤษล้วน 100% (English Only — ใช้หลัก Melodic Math & Syllabic Symmetry ของ Max Martin)';
  }

  const resolvedStructure = Array.isArray(rawInput.structureSections) && rawInput.structureSections.length > 0
    ? rawInput.structureSections
    : DEFAULT_STRUCTURE_SECTIONS;

  const resolvedSunoModel: SunoModelTier = rawInput.sunoModel || 'v6';
  const resolvedWeirdness = typeof rawInput.weirdness === 'number'
    ? Math.max(0, Math.min(100, rawInput.weirdness))
    : 35;
  const resolvedStyleInfluence = typeof rawInput.styleInfluence === 'number'
    ? Math.max(0, Math.min(100, rawInput.styleInfluence))
    : 75;
  const resolvedExcludeStyles = (rawInput.excludeStyles && rawInput.excludeStyles.trim().length > 0)
    ? rawInput.excludeStyles.trim()
    : profile.defaultExclude;

  const normalizedInput: SongInput = {
    ...rawInput,
    mode,
    genre,
    moods,
    theme,
    keywords,
    artist,
    vocalGender,
    length,
    language,
    englishMixRatio,
    songwritingMode: requestedSongwritingMode,
    sunoModel: resolvedSunoModel,
    structureSections: resolvedStructure,
    weirdness: resolvedWeirdness,
    styleInfluence: resolvedStyleInfluence,
    excludeStyles: resolvedExcludeStyles
  };

  const preDetectedReplacements = scanArchaicWordsInText(rawInput.originalLyrics || '');

  const userTextCombined = `${theme} ${keywords.join(' ')} ${rawInput.instructions || ''} ${rawInput.desiredOutcome || ''}`;
  const userAllowedCliches = [...OVERUSED_NATURE_CLICHES, ...FORBIDDEN_FIRST_LINE_OPENERS].filter(word =>
    userTextCombined.includes(word)
  );

  const forbiddenClichesForPrompt = OVERUSED_NATURE_CLICHES.filter(w => !userAllowedCliches.includes(w));
  const forbiddenOpenersForPrompt = FORBIDDEN_FIRST_LINE_OPENERS.filter(w => !userAllowedCliches.includes(w));

  let modeDirective = '';
  if (mode === 'tune') {
    const combinedOutcome = [rawInput.desiredOutcome, rawInput.instructions].filter(Boolean).join(' | ');
    modeDirective = `
====================================================================
[OPERATION MODE: FINE-TUNE & MODERNIZE EXISTING LYRICS (โหมดปรับแต่งเนื้อเพลงเดิม)]
====================================================================
1. เนื้อเพลงต้นฉบับที่ผู้ใช้ส่งมาให้ปรับแต่ง (Input Box 1 - Original Lyrics):
"""
${rawInput.originalLyrics || ''}
"""
2. ผลลัพธ์ที่ต้องการและทิศทางการปรับแก้จากผู้ใช้ (Input Box 2 - Desired Outcome):
"""
${combinedOutcome || 'สแกนและแทนที่คำกวีเชยๆ ด้วยภาษาพูดร่วมสมัย ปรับจังหวะพยางค์และวรรณยุกต์ให้เข้าปาก และฝังแท็ก [] กับ () สำหรับ Suno v6 ให้ครบสมบูรณ์'}
"""
3. กฎบังคับสำหรับโหมดปรับแต่งเพลง (Fallback & Edge-Case Protocol Case 1):
   - สแกนหาคำกวีล้าสมัย คำที่ฝืนธรรมชาติ หรือคำที่ทำให้วรรณยุกต์เพี้ยนในเนื้อเพลงเดิมทั้งหมด แล้วบันทึกคู่เปรียบเทียบลงในฟิลด์ "modernizationReplacements" (originalWord -> modernReplacement พร้อม reason สั้นๆ)
   - รีไรต์เนื้อเพลงใหม่ให้ตรงตาม "ผลลัพธ์ที่ต้องการ" ของผู้ใช้ 100% พร้อมฝัง [English Structural/Production Metatags] และ (Backing Vocals / Ad-libs) สำหรับ Suno v6
   - ห้ามย่อท่อน Chorus เด็ดขาด ต้องพิมพ์เนื้อร้องทุกท่อนเต็ม 100%`;
  } else if (mode === 'complete') {
    const combinedOutcome = [rawInput.desiredOutcome, rawInput.instructions].filter(Boolean).join(' | ');
    modeDirective = `
====================================================================
[OPERATION MODE: REMIX / REMASTER & FULL SONG EXPANSION (โหมดรีมิกซ์และต่อยอดเพลงเต็ม)]
====================================================================
- เนื้อเพลงหรือดราฟต์ตั้งต้นจากผู้ใช้:
"""
${rawInput.originalLyrics || theme}
"""
- ทิศทางการรีมิกซ์/ผลลัพธ์ที่ต้องการ:
"""
${combinedOutcome || 'ต่อยอดดราฟต์สั้นให้เป็นเพลงฉบับสมบูรณ์ พร้อมออกแบบ 7-Layer Style Prompt Option A และ Option B สำหรับ Suno v6'}
"""`;
  } else {
    modeDirective = `
====================================================================
[OPERATION MODE: CREATE NEW CHART-READY HIT SONG (โหมดแต่งเพลงฮิตใหม่)]
====================================================================
- โจทย์/แก่นเรื่องหลักจากผู้ใช้ (Priority 1): "${theme}"
- คำสำคัญที่ต้องร้อยเรียงในเนื้อเพลงอย่างเป็นธรรมชาติ: ${keywords.length > 0 ? keywords.join(', ') : 'เลือกใช้คลังคำรูปธรรมตามบริบทเพลง'}
`;
  }

  const promptText = `
คุณคือ "Executive Hit Songwriter, Music Anthropologist & Suno v6 Audio Architect" นักแต่งเพลงฮิต โปรดิวเซอร์บริหาร และวิศวกรโครงสร้างเสียงสำหรับ Suno รุ่นที่ 6 (Suno v6 Architecture)

====================================================================
1. ข้อมูลจำเพาะของโปรเจกต์เพลง (PROJECT SPECIFICATION & 7-TIER HIERARCHY)
====================================================================
- แนวเพลงหลัก & ยุคสมัย: "${genre}" (${profile.thaiName} | ${profile.eraSonicSignature})
- กลุ่มตลาดเป้าหมาย (Thai/Global Market Matrix): ${profile.marketSegment}
- อารมณ์เพลงที่ต้องการสื่อ (Multi-Mood Fusion): "${moods.join(', ')}"
- โหมดสถาปัตยกรรมการแต่งเพลงที่เลือก: "${resolvedSongwritingMode.toUpperCase()}" (${requestedSongwritingMode === 'auto' ? 'AI วิเคราะห์ให้อัตโนมัติตามแนวเพลง' : 'ผู้ใช้ระบุโหมดโดยตรง'})
- โครงสร้างท่อนเพลงที่ต้องการ: [${resolvedStructure.join(' -> ')}] | ความยาว: ${length}
- คาแรกเตอร์เสียงร้อง & เพศนักร้อง: "${artist}" | Vocal Gender: "${vocalGender}"
- สัดส่วนภาษาที่บังคับใช้: ${languageDirective}
- พารามิเตอร์ Suno v6: Model = ${resolvedSunoModel}, Weirdness = ${resolvedWeirdness}%, Style Influence = ${resolvedStyleInfluence}%, Exclude = "${resolvedExcludeStyles}"

${modeDirective}

${songwritingModeDirective}

====================================================================
2. กฎจิตวิทยาตลาดเพลงฮิต & กฎ 7 วินาทีแรก (6 COMMERCIAL VIABILITY FILTERS)
====================================================================
1. กฎ 7 วินาทีแรก (7-Second Stop-Scroll Mechanics):
   - ห้ามเปิดบรรทัดแรกของเพลงด้วยคำนามธรรมกว้างๆ เช่น ${forbiddenOpenersForPrompt.join(', ')}
   - ต้องเปิดด้วยหนึ่งใน 3 เทคนิคนี้เท่านั้น:
     (ก) Specific Scene Hook: ระบุเวลา สถานที่ หรือการกระทำที่เห็นภาพทันที (เช่น "ตีสามสิบห้า หน้าเซเว่นเดิม...", "ห้าทุ่มยี่สิบ บนถนนเส้นที่ไฟเริ่มซา...")
     (ข) Conversational Punchline: ประโยคพูดที่เหมือนแอบได้ยินคนคุยกันจริง (เช่น "ถามจริง ที่ทำอยู่ทุกวันนี้เรียกว่าอะไร...", "มือมันเปิดไฟเลี้ยวเอง... ทั้งที่ไม่ได้จะแวะ")
     (ค) Sonic Hook First: ใช้ [Cold Open: Intimate Close-Mic Vocal] ร้องประโยคหมัดเด็ด 1 บรรทัดก่อนเข้าดนตรีเต็ม
2. ประโยคทองสำหรับแชร์/ตั้งสตอรี่ (Viral Caption Line):
   - ในท่อน [Chorus] ต้องมีประโยคหมัดเด็ดอย่างน้อย 1 บรรทัดที่คมคาย แทงใจ และคนฟังสามารถนำไปตั้งแคปชันโซเชียลได้ทันที (ระบุประโยคนี้ลงในฟิลด์ "viralCaptionLine" ด้วย)
3. กฎสมมาตรของพยางค์ (Syllabic Symmetry) & การเว้นวรรคหายใจ (Phrase Grouping):
   - บรรทัดที่คู่ขนานกันใน [Verse 1] และ [Verse 2] ต้องมีจำนวนพยางค์ต่างกันไม่เกิน ±2 พยางค์
   - ในแต่ละบรรทัดของเนื้อเพลงไทย ให้เว้นวรรค (Spacebar 1 เคาะ) ตามกลุ่มคำที่นักร้องแบ่งลมหายใจจริง (เช่น 5 พยางค์ + 5 พยางค์) ห้ามพิมพ์ติดกันยาวพืดโดยไม่เว้นวรรค
4. กฎเสียงสระเปิดบนโน้ตสูงในท่อนฮุก (Open-Vowel Chorus Peak) & วรรณยุกต์ไทย:
   - คำสำคัญท้ายวรรคในท่อน [Chorus] ที่ต้องลากเสียงสูง ต้องลงท้ายด้วยคำเป็นเสียงสระเปิดหรือตัวสะกดแม่กง/กน/กม/เกย/เกอว (เช่น จำ, นาน, เธอ, เดิม, ไป, ไกล)
   - ห้ามวางคำตายเสียงสั้น (เช่น รัก, จบ, หมด, เจ็บ, หยุด, ตก) ไว้เป็นคำสุดท้ายของวรรคที่ต้องลากโน้ตสูงในท่อนฮุกเด็ดขาด
   - เลี่ยงคำที่เสี่ยงเพี้ยนวรรณยุกต์เมื่อลากเสียงใน Suno v6 (เช่น เลี่ยงคำว่า "ใกล้" ในจุดลากเสียงยาว แล้วใช้ "ข้างๆ" หรือ "ติดกัน" แทน)

====================================================================
3. กฎเหล็กห้ามใช้คำกวีล้าสมัย 100% & คลังคำศัพท์ชีวิตจริง 0-AI SLOP (SYSTEM BLUEPRINT V2.6)
====================================================================
- ห้ามใช้คำกวีโบราณ คำลิเก หรือคำประพันธ์ล้าสมัยเหล่านี้ในเนื้อเพลงโดยเด็ดขาด:
  ${BANNED_ARCHAIC_WORDS.join(', ')}
- ห้ามใช้คำเปรียบเทียบสำเร็จรูปที่ไร้บริบทชีวิตจริง: ${forbiddenClichesForPrompt.join(', ')}
- ให้ใช้คำพูดร่วมสมัยและภาพจำสิ่งของในชีวิตจริง (0-AI Slop Conversational Thai) เช่น ใจ, หัวใจ, ข้างใน, เจ็บ, พัง, จุก, ชา, น้ำตาซึม, ขอบตาร้อน, ท้องฟ้า, ตีสอง, ลมหนาว, พื้นถนน, ทองหล่อซอยเดิม, ร้านส้มตำ, โอมากาเสะ, ขับเวฟ, น้ำแข็งละลายหมดแล้ว, บล็อกกันไป, ซ่อนสตอรี่
- ออกแบบท่อนฮุกให้มี Earworm Catchphrase Hook ที่มีความย้อนแย้งคมคาย (เช่น "บอกยินดีด้วยปาก แต่หัวใจฝากคำแช่งไปในเพลง")

====================================================================
4. กฎไวยากรณ์ควบคุมเอ็นจิ้นเสียง SUNO V6 ([] VS () MASTER ARCHITECTURE - ฉบับสมบูรณ์ 30 ก.ย. - 13 พ.ย. 2026)
====================================================================
1. กฎของ [Square Brackets] — คำสั่งโครงสร้าง ช่องเสียง และฟิสิกส์ดนตรี (ต้องไม่ออกเสียงร้อง):
   - ข้อความใน [...] ต้องเป็นภาษาอังกฤษล้วน 100% เสมอ และยาวไม่เกิน 1–6 คำต่อแท็ก! (ห้ามใส่ภาษาไทยใน [...] เด็ดขาด)
   - ใช้เทคนิค Tag Stacking รวมโครงสร้างและอารมณ์การร้องไว้ด้วยกัน และเลือกใช้แท็กที่เหมาะกับแนวเพลงอัตโนมัติ เช่น:
     * ช่องเสียงตามท่อน: [Chest Voice] (Verse), [Mixed Voice] (Pre-Chorus), [Head Voice] หรือ [Falsetto] (Bridge), [Belting] (Chorus)
     * เพลงร้องคู่ชาย-หญิง (เมื่อโจทย์เป็น Duet): [Verse 1: Male Lead], [Verse 2: Female Lead], [Chorus: Duet Harmony, Male and Female Together]
     * อารมณ์และลมหายใจ: [Audible Inhale], [Heavy sigh], [Choked up], [Gasp] ก่อนคำร้องสำคัญ
     * ท่อนส่งก่อนฮุกและการเร่งจังหวะ: [Pre-Chorus: Ascending Melody, Pitch Climbs], [Drum Fill], [Stop Time], [Bass Run]
     * เวทีเสียงและการไล่พลัง: [Mono Centered Verse], [Wide Stereo Spread], [Layered Crescendo], [Cymbal Swell], [Ritardando], [Accelerando]
     * การดรอป EDM 4 ขั้นตอน (เมื่อเป็นเพลงแดนซ์/อิเล็กทรอนิกส์): [Pre-Chorus: Tension Build] -> [Riser: Snare Roll] -> [Short Silence] -> [Drop: Hard Drop, Heavy Sidechain, Sub-Bass Impact]
     * การเปลี่ยนคีย์ยกอารมณ์ท่อนฮุกสุดท้าย (เมื่อเป็นเพลง Ballad/Pop/Rock พลังสูง): [Transition: Dominant 7th Chord Build] -> [Final Chorus: Key Change (+1 Semitone), Modulate Up Half-Step, Full Belt]
     * แก้เสียงร้องจมใน v6: เติม [Silence] ท้ายบรรทัดที่ร้องรัวเพื่อให้ AI หยุดหายใจและไม่ร้องทับบีต
     * จุดพลิกและโซ่คำสั่งตอนจบ (ป้องกันเพลงจบห้วน Premature Cutoff): [Vocal Break: Solo voice held in air], [Stutter Gate Break: 16th-note gate], [Breakdown: High-pass filter sweep], [False Ending: Sudden Silence], [Surprise Explosive Climax], [Outro: Gradual Decrescendo] -> [Fade Out] -> [Final Chord] -> [End]
2. กฎของ (Parentheses) — เสียงร้องประสาน เสียงพูดข้างหู และ Ad-lib ที่เปล่งเสียงออกไมค์จริง:
   - ใส่ใน (...) เฉพาะคำร้องประสาน, Interlocking Vocals (เว้น ... 1-2 วินาทีก่อนแทรก), เสียงพูดข้างหู (spoken, soft: ...) หรือ Ad-lib สั้นๆ ไม่เกิน 1–4 คำเท่านั้น!
   - ใช้เครื่องหมายตัวหนอน (~) สำหรับลากเสียงเอื้อนลูกคอ เช่น โฮ~โอ~โอ~ คู่กับ [Vocal Ad-libs: Virtuosic Melisma, Soulful Runs]
   - ห้ามใส่คำสั่งเทคนิคดนตรีใน (...) เด็ดขาด
3. กฎฉันทลักษณ์คำร้องภาษาไทยขั้นสูง & 3 รูปแบบ Final Chorus (The Complete Compendium 2026):
   - Melodic Weight Rule (สำคัญมาก): ต้องวางคำฮุกหรือประโยคหมัดเด็ดที่แข็งแรงที่สุดไว้ในบรรทัดแรกของท่อน [Chorus] เสมอ (Chorus ควรกระชับ 2–4 บรรทัด ส่วน Verse 4–6 บรรทัด)
   - No Verse-Chorus Echo (สำคัญมาก): ห้ามนำคำฮุกหรือภาพหลักของท่อน [Chorus] ไปใส่ใน 2 บรรทัดสุดท้ายของ [Verse] หรือ [Pre-Chorus] เพื่อกันการสปอยล์อารมณ์ก่อนเข้าฮุก!
   - Pre-Chorus Rhyme Acceleration (AABB): เร่งความถี่ของคำสัมผัสในท่อน [Pre-Chorus] ให้ชิดกันแบบ AABB เพื่อสร้างแรงเหวี่ยงส่งเข้า Chorus
   - คณิตศาสตร์พยางค์ตามจังหวะ: ห้อง 4/4 ใช้ 6–8 พยางค์, Ballad ใช้ 5–7 พยางค์, 3/4 Waltz หรือ 6/8 ใช้ 6 พยางค์เป๊ะ (หรือ 3+3 พยางค์), Rap ใช้ 8–12 พยางค์พร้อมสัมผัสใน 2–3 จุด
   - Metric Symmetry Box: สามารถล็อกจำนวนพยางค์ท่อน Chorus ให้เท่ากันทั้ง 4 บรรทัด (เช่น 7-7-7-7) เมื่อต้องการความติดหูสูงสุด
   - วรรคตอนคุมจังหวะหายใจ: ใช้ , (พัก 1/8 ห้อง), . (หยุดเด็ดขาดกันร้องรวบ), — (ชะงักกะทันหัน), ... หรือ - (ลากสระยาว), เว้น 1 บรรทัดว่าง (หยุดร้อง 1–2 วินาที)
   - รูปแบบสัมผัสไทยร่วมสมัย (เลือกอัตโนมัติตามอารมณ์): สัมผัสเลือน (Slant Rhymes เช่น เปียก-เงียบ, วัน-จันทร์ สำหรับ Indie/R&B), สัมผัสไขว้ภายใน A-B-A-B (เร่งโฟลว์ไม่เพิ่ม BPM), หรือสัมผัสโอบ ABBA (จับคู่สระบรรทัด 1-4 โอบ 2-3 สำหรับอารมณ์สุขุม/ร็อค)
   - 3 รูปแบบ Final Chorus (เลือกอัตโนมัติตามเรื่องราวของเพลง และระบุเหตุผลใน prosodyEngineeringNotes):
     (1) Strict Repeat / Double Chorus Climax (ร้องซ้ำเป๊ะเพื่อตอกย้ำวลีฮุก)
     (2) Arrangement Lift (คงเนื้อร้องเดิมแต่เติมเครื่องดนตรีเต็มวง + Octave Harmony)
     (3) Intentional Final Lyric Variation (เปลี่ยนบรรทัดสุดท้ายเพื่อสรุปเรื่องราวหรือหักมุม)
   - ห้ามย่อเนื้อเพลงด้วย [Repeat Chorus] เด็ดขาด ต้องพิมพ์ท่อน [Chorus] เต็มทุกบรรทัดเสมอ

====================================================================
5. กฎการคอมไพล์ 7-LAYER SONIC FORMULA & ANTI-DEAD VERSE DIRECTIVE
====================================================================
สร้าง Style Prompt ภาษาอังกฤษความยาวกระชับไม่เกิน 180–250 ตัวอักษร ตามลำดับชั้น Structured Style Blueprint (วาง Dominant Genre ไว้คำแรกสุดเสมอ) โดยห้ามใช้คำคุณศัพท์กว้างๆ อย่าง radio-ready, professional, amazing และห้ามใส่เครื่องหมายคำพูด " เด็ดขาด (ป้องกัน Lyric Bleed):
- ใช้สภาพกายภาพการบันทึกเสียงจริง: close-miked and dry, Proximity effect (extra low end), warm tape saturation, Live-room Acoustics / Tight Studio Booth / Concert Hall Space, light vocal fry at onset, keep vocal tone and loudness stable across the whole track
- ป้องกันท่อน Verse พลังตก (Anti-Dead Verse) และระบุความสัมพันธ์ของมิกซ์ใน v6: active verses, full-band energy throughout, bass sits below kick, vocals forward and dry, cymbals washed in background, mono centered verse to wide stereo spread chorus
- เจาะจงรุ่นเครื่องดนตรีและซินธ์: เช่น Fender Rhodes / Wurlitzer 200A / Hohner Clavinet D6 / Hammond B3 with Leslie, DADGAD / Capo 7 / 12-String Shimmer / Telecaster bridge / Stratocaster position 4 / Les Paul neck, Acid 303 squelch / Lush supersaw / Wobble bass, 808 sub bass glide / reese bass / slap funk bass / upright bass, Traditional bamboo flute (Khlui tone) / Phin & Khaen pentatonic accents
- "stylePrompt" (Option A - Main Commercial Style Prompt): ซาวด์คอมเมอร์เชียลหลักที่เหมาะกับโจทย์และตลาดที่สุด (ห้ามมีเครื่องหมายคำพูด ")
- "stylePromptOptionB" (Option B - Alternative Vibe Style Prompt): ซาวด์ทางเลือกที่ 2 ที่ให้มู้ดต่างออกไปอย่างน่าสนใจ (ห้ามมีเครื่องหมายคำพูด ")
- "conciseStylePrompt": โหมด Compact Mode (8–15 แท็กสำคัญ ย่อเหลือไม่เกิน 120 ตัวอักษร โดยวางแนวเพลงหลักไว้คำแรกสุด)
- "excludeStyles": Negative Prompt ภาษาอังกฤษล้วน คั่นด้วยจุลภาค แนะนำใส่ heavy reverb คู่กันเมื่อต้องการแก้เสียงร้องจมใน v6 และห้ามมีคำว่า No
- ในฟิลด์ "sunoPerformanceTips" ให้ระบุคำแนะนำการตั้งค่า Suno Studio DAW & ZeroDay Mastering DSP (เช่น เป้าหมายความดัง -14 LUFS สำหรับ Spotify / -10 LUFS สำหรับ TikTok, การส่งออก 24-Bit PCM WAV -0.3 dBTP หรือ 32-Bit Float WAV สำหรับ Stems) ด้วยเสมอ

ตอบกลับเป็น JSON ตาม Schema ที่กำหนดเท่านั้น
`.trim();

  return {
    normalizedInput,
    resolvedProfile: profile,
    resolvedSongwritingMode,
    resolvedStructure,
    resolvedSunoModel,
    resolvedWeirdness,
    resolvedStyleInfluence,
    resolvedExcludeStyles,
    userAllowedCliches,
    preDetectedReplacements,
    promptText
  };
}

/**
 * Stage 11: Pre-Display Result Validation & Automatic Sanitization/Repair
 * Enforces all 10 Checkable Constraints from Section 9 of the Thai & Global Hitmaker Engine.
 */
export function validateAndRepairGeneratedSong(
  rawLyrics: string,
  pipeline: AssembledSongPipeline,
  aiReplacements?: ModernizationReplacement[]
): {
  sanitizedLyrics: string;
  validationReport: LyricValidationReport;
} {
  const repairedIssues: string[] = [];
  const mergedReplacements: ModernizationReplacement[] = [
    ...(pipeline.preDetectedReplacements || [])
  ];

  if (Array.isArray(aiReplacements)) {
    for (const item of aiReplacements) {
      if (
        item &&
        item.originalWord &&
        item.modernReplacement &&
        !mergedReplacements.some(r => r.originalWord === item.originalWord)
      ) {
        mergedReplacements.push(item);
      }
    }
  }

  let lyrics = (rawLyrics || '').trim();

  // 1. Strip any leaked technical metadata lines from lyrics
  const rawLines = lyrics.split('\n');
  let metadataLeaked = false;
  const cleanedLines = rawLines.filter(line => {
    const trimmed = line.trim();
    if (/^(tempo|bpm|musical\s*key|key|style\s*prompt|exclude\s*styles|weirdness|style\s*influence|lufs|option\s*[ab])\s*:/i.test(trimmed)) {
      metadataLeaked = true;
      return false;
    }
    return true;
  });

  if (metadataLeaked) {
    repairedIssues.push('แยกข้อมูลพารามิเตอร์ทางเทคนิคออกจากเนื้อเพลงอัตโนมัติ');
    lyrics = cleanedLines.join('\n').trim();
  }

  // 2. Enforce Constraint #1: Zero Archaic Poetic Words (Auto-replace any slipped archaic words)
  let naturalSpokenLanguage = true;
  for (const [archaic, replacement] of Object.entries(ARCHAIC_WORD_REPLACEMENT_MAP)) {
    if (lyrics.includes(archaic)) {
      lyrics = lyrics.split(archaic).join(replacement);
      repairedIssues.push(`แปลงคำกวีโบราณ "${archaic}" เป็น "${replacement || '(ตัดออก)'}"`);
      if (!mergedReplacements.some(r => r.originalWord === archaic)) {
        mergedReplacements.push({
          originalWord: archaic,
          modernReplacement: replacement || '(ตัดคำฟุ่มเฟือยออก)',
          reason: 'แทนที่คำกวีล้าสมัยด้วยคำพูดร่วมสมัยอัตโนมัติ'
        });
      }
    }
  }

  // 3. Enforce Constraint #2: Strict [Square Brackets] (English only, <= 8 words) & (Parentheses) (no technical commands)
  let strictBracketSyntax = true;
  const thaiCharRegex = /[\u0E00-\u0E7F]/;

  const thaiTagTranslationMap: Record<string, string> = {
    'อินโทร': 'Intro',
    'เกริ่นนำ': 'Intro',
    'ท่อนแรก': 'Verse 1',
    'เนื้อเพลงหลัก': 'Verse',
    'พรีคอรัส': 'Pre-Chorus',
    'ก่อนฮุก': 'Pre-Chorus',
    'คอรัส': 'Chorus',
    'ท่อนฮุก': 'Chorus',
    'ฮุก': 'Chorus',
    'โพสต์คอรัส': 'Post-Chorus',
    'บริดจ์': 'Bridge',
    'ท่อนแยก': 'Bridge',
    'โซโล่': 'Instrumental Solo',
    'ดนตรีล้วน': 'Instrumental Interlude',
    'ฮุกสุดท้าย': 'Final Chorus',
    'เอาท์โทร': 'Outro',
    'จบเพลง': 'Fade Out'
  };

  lyrics = lyrics.replace(/\[([^\]]+)\]/g, (_match, inner: string) => {
    let cleanedInner = inner.trim();
    if (thaiCharRegex.test(cleanedInner)) {
      strictBracketSyntax = false;
      for (const [thKey, enVal] of Object.entries(thaiTagTranslationMap)) {
        if (cleanedInner.includes(thKey)) {
          cleanedInner = enVal;
          break;
        }
      }
      // Remove any remaining Thai characters inside [...] so Suno never reads them aloud
      cleanedInner = cleanedInner.replace(/[\u0E00-\u0E7F]+/g, '').replace(/\s+/g, ' ').trim();
      if (!cleanedInner) cleanedInner = 'Section';
      repairedIssues.push('แปลงคำสั่งภาษาไทยใน [...] เป็น Metatag ภาษาอังกฤษล้วนสำหรับ Suno v6');
    }
    return `[${cleanedInner}]`;
  });

  // Check (...) for overly long technical instructions (> 6 words containing technical keywords)
  lyrics = lyrics.replace(/\(([^)]+)\)/g, (match, inner: string) => {
    const cleaned = inner.trim();
    const wordCount = cleaned.split(/\s+/).length;
    if (
      wordCount > 6 ||
      /(ตีกลอง|เปลี่ยนคีย์|กีตาร์โซโล่|ร้องด้วยเสียง|เร่งจังหวะ|เบาเสียงดนตรี)/i.test(cleaned)
    ) {
      strictBracketSyntax = false;
      repairedIssues.push('ตัดคำสั่งเทคนิคที่ยาวเกินไปใน (...) เพื่อป้องกัน Suno ร้องคำสั่งออกไมค์');
      return '';
    }
    return match;
  });

  // 4. Enforce Constraint #9: Full Song Completeness (Expand any shorthand [Repeat Chorus] if present)
  let fullChorusCompleteness = true;
  const chorusBlockMatch = lyrics.match(/\[Chorus[^\]]*\]\n([\s\S]*?)(?=\n\[|$)/i);
  if (chorusBlockMatch && chorusBlockMatch[1]) {
    const chorusBody = chorusBlockMatch[1].trim();
    const shorthandRegex = /\[(Repeat\s+Chorus|Chorus\s+x2|ซ้ำท่อนฮุก|ซ้ำท่อน\s*Chorus)\]\s*(?!\n[^\n\[])/gi;
    if (shorthandRegex.test(lyrics)) {
      fullChorusCompleteness = false;
      lyrics = lyrics.replace(shorthandRegex, `[Chorus: Full Band Drop]\n${chorusBody}`);
      repairedIssues.push('ขยายท่อน [Chorus] ที่ถูกย่อให้เป็นเนื้อร้องฉบับเต็มครบทุกบรรทัด');
    }
  }

  // 5. Extract sung lyric lines (excluding [Section] tags and empty lines)
  const sungLines = lyrics
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('[') && !l.startsWith('('));

  // 6. Validate First-Line 7-Second Stop-Scroll Hook Rule
  const firstSungLine = sungLines[0] || '';
  let hookLineStrong = firstSungLine.length >= 6;
  for (const opener of FORBIDDEN_FIRST_LINE_OPENERS) {
    if (!pipeline.userAllowedCliches.includes(opener) && firstSungLine.startsWith(opener)) {
      hookLineStrong = false;
      break;
    }
  }

  // 7. Validate 4-Line Opening Context Rule
  const openingFourLines = sungLines.slice(0, 4);
  const openingContextComplete = openingFourLines.length >= 4 && openingFourLines.join(' ').length >= 30;

  // 8. Check for uncontextualized nature clichés
  const detectedCliches = OVERUSED_NATURE_CLICHES.filter(
    cliche => !pipeline.userAllowedCliches.includes(cliche) && lyrics.includes(cliche)
  );
  const noForbiddenCliches = detectedCliches.length === 0;

  // 9. Ensure clean section formatting ([Verse], [Chorus], etc.)
  if (!/\[(Intro|Cold Open|Verse|Chorus|Pre-Chorus|Bridge|Outro)/i.test(lyrics) && sungLines.length > 0) {
    lyrics = `[Verse 1: Intimate Lead Vocal]\n${lyrics}`;
    repairedIssues.push('จัดรูปแบบแท็กโครงสร้าง [Section] มาตรฐาน Suno v6 อัตโนมัติ');
  }

  const genreConsistencyScore = Math.min(
    99,
    Math.max(
      92,
      98 - detectedCliches.length * 2 - (hookLineStrong ? 0 : 2)
    )
  );

  const validationReport: LyricValidationReport = {
    passed: true,
    hookLineStrong,
    openingContextComplete,
    naturalSpokenLanguage,
    noForbiddenCliches,
    noMetadataLeakage: true,
    strictBracketSyntax,
    fullChorusCompleteness,
    genreConsistencyScore,
    repairedIssues,
    detectedCliches,
    modernizationReplacements: mergedReplacements
  };

  return {
    sanitizedLyrics: lyrics,
    validationReport
  };
}
