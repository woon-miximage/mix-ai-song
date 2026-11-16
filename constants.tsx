
import React from 'react';

export const ARTIST_STYLES = [
  'Warm Acoustic Male (อบอุ่น นุ่มนวล)',
  'Ethereal Neo-Soul Female (เสียงร้องมีเสน่ห์)',
  'Luk Thung Isan Vocalist (ลูกทุ่งอีสาน / หมอลำทรงพลัง)',
  'Modern Luk Thung Pop (ลูกทุ่งป๊อปสมัยใหม่)',
  '80s City Pop Synthesizer Diva (สดใสยุค 80s)',
  'Gravely Alternative Rocker (เข้ม ดุดัน)',
  'Breathy Bedroom Pop Vocalist (กระซิบ ฟุ้งฝัน)',
  'Melancholic Ballad Tenor (เสียงสูง โศกเศร้า)',
  'Modern Trap Auto-Tuned Rapper (จังหวะแน่น แร็ปจูน)',
  'Groovy Soul & R&B Vocal (ร้องหลบพริ้วไหว)',
  'Sultry Jazz Chanteuse (ทุ้มลึก คลาสสิก)',
  'Indie Folk Acoustic Storyteller (เล่าเรื่องฟังสบาย)',
  'Grand Symphonic Choir & Tenor (ออร์เคสตรา / คลาสสิกทรงพลัง)',
  'Traditional Thai Chant Vocalist (เอื้อนเสภา / เพลงไทยเดิมดั้งเดิม)',
  'Traditional Japanese Min\'yo Vocalist (เสียงร้องญี่ปุ่นดั้งเดิม Min\'yo)',
  'Operatic Dramatic Soprano (โอเปร่าทรงพลัง)',
  'Bossa Nova Gentle Vocalist (บอสซาโนวานุ่มนวล)',
  'Celtic Folk Enchanting Vocal (เสียงร้องสไตล์เคลติกฝันหวาน)'
];

export interface CategoryGroup<T = string> {
  id: string;
  categoryName: string;
  icon: string;
  description: string;
  colorClass: string;
  items: T[];
}

export const GENRE_GROUPS: CategoryGroup[] = [
  {
    id: 'thai-isan',
    categoryName: 'ดนตรีไทย & ลูกทุ่งอีสาน',
    icon: '🇹🇭',
    description: 'เอกลักษณ์ดนตรีไทยเดิม หมอลำ และลูกทุ่งอินดี้',
    colorClass: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300',
    items: [
      'Luk Thung (ลูกทุ่ง)',
      'Molam (หมอลำ)',
      'Isan Indie',
      'Traditional Thai (ดนตรีไทยโบราณ / เดิม)',
    ]
  },
  {
    id: 'pop-modern',
    categoryName: 'ป๊อป & T-Pop & ซิตี้ป๊อป',
    icon: '✨',
    description: 'เพลงป๊อปติดหู เมโลดี้สดใส และแนวร่วมสมัย',
    colorClass: 'border-amber-500/30 bg-amber-950/20 text-amber-300',
    items: [
      'Pop',
      'City Pop',
      'Ballad',
      'Dreampop',
      'Indie'
    ]
  },
  {
    id: 'hiphop-rnb',
    categoryName: 'ฮิปฮอป & อาร์แอนด์บี & โซล',
    icon: '🔥',
    description: 'จังหวะแน่น บีทแทร็ป กรูฟสเน่ห์สไตล์ R&B/Soul',
    colorClass: 'border-orange-500/30 bg-orange-950/20 text-orange-300',
    items: [
      'Hip-hop',
      'Trap',
      'R&B',
      'Soul',
      'Funk'
    ]
  },
  {
    id: 'rock-alternative',
    categoryName: 'ร็อค & อัลเทอร์เนทีฟ & เมทัล',
    icon: '🎸',
    description: 'เสียงกีตาร์จัดจ้าน พลังดนตรีหนักแน่นทรงพลัง',
    colorClass: 'border-red-500/30 bg-red-950/20 text-red-300',
    items: [
      'Rock',
      'Alternative',
      'Heavy Metal (เฮฟวี่เมทัล)'
    ]
  },
  {
    id: 'acoustic-chill',
    categoryName: 'อคูสติก & แจ๊ส & ชิลล์',
    icon: '☕',
    description: 'ฟังสบาย ผ่อนคลาย อบอุ่น สไตล์ร้านกาแฟ',
    colorClass: 'border-teal-500/30 bg-teal-950/20 text-teal-300',
    items: [
      'Acoustic',
      'Jazz',
      'Bossa Nova (บอสซาโนวา)',
      'Lo-fi',
      'Reggae & Ska (เร็กเก้ / สกา)'
    ]
  },
  {
    id: 'electronic-synth',
    categoryName: 'อิเล็กทรอนิกส์ & ซินธ์เวฟ & แดนซ์',
    icon: '⚡',
    description: 'เสียงซินธ์ล้ำยุค บีทแดนซ์ EDM สนุกเร้าใจ',
    colorClass: 'border-purple-500/30 bg-purple-950/20 text-purple-300',
    items: [
      'Electronic',
      'Synthwave',
      'Disco'
    ]
  },
  {
    id: 'orchestra-cinematic',
    categoryName: 'ออร์เคสตรา & มหากาพย์ & เวิลด์มิวสิค',
    icon: '🎻',
    description: 'ซิมโฟนี่อลังการ มหากาพย์ภาพยนตร์ ดนตรีนานาชาติ',
    colorClass: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-300',
    items: [
      'Epic Cinematic (มหากาพย์ภาพยนตร์)',
      'Symphony & Orchestra (ซิมโฟนี่ / ออร์เคสตรา)',
      'Classical Opera (โอเปร่า / คลาสสิก)',
      'Celtic & Folk (เคลติก / โฟล์คสากล)',
      'Traditional Japanese (ดนตรีญี่ปุ่นดั้งเดิม)',
      'Traditional Chinese (ดนตรีจีนดั้งเดิม)',
      'Ambient & New Age (แอมเบียนต์ / นิวเอจ)'
    ]
  }
];

export const GENRES = GENRE_GROUPS.flatMap(g => g.items);

export const MOOD_GROUPS: CategoryGroup[] = [
  {
    id: 'sad-heartbreak',
    categoryName: 'เศร้า & อกหัก & โหยหา',
    icon: '💔',
    description: 'อารมณ์ตัดพ้อ เจ็บปวด เสียดาย และคิดถึงคนรักเก่า',
    colorClass: 'border-blue-500/30 bg-blue-950/20 text-blue-300',
    items: [
      'เศร้า (Sad)',
      'เหงา (Lonely)',
      'อกหัก (Broken Heart)',
      'โหยหา (Nostalgic)',
      'เสียดาย (Regretful)',
      'เจ็บปวด (Painful)',
      'ตัดพ้อ (Sarcastic)',
      'เหงาจับใจ (Deep Loneliness)',
      'หม่นหมอง (Gloomy)',
      'ผิดหวัง (Disappointed)',
      'ลืมไม่ลง (Unforgettable)',
      'อ้างว้าง (Solitary)'
    ]
  },
  {
    id: 'romantic-love',
    categoryName: 'รักหวาน & แอบรัก & อบอุ่น',
    icon: '💖',
    description: 'ความรักที่สมหวัง คลั่งรัก ใจฟู และความผูกพัน',
    colorClass: 'border-pink-500/30 bg-pink-950/20 text-pink-300',
    items: [
      'รักแรก (First Love)',
      'คลั่งรัก (In Love)',
      'แอบรัก (Crush)',
      'ฝันหวาน (Dreamy)',
      'อบอุ่น (Warm)',
      'ใจฟู (Heart-warming)',
      'ห่วงใย (Caring)',
      'คิดถึง (Missing You)',
      'โรแมนติก (Romantic)',
      'นุ่มนวล (Gentle)',
      'พรหมลิขิต (Destiny)'
    ]
  },
  {
    id: 'positive-energy',
    categoryName: 'สดใส & พลังบวก & สนุกสนาน',
    icon: '⚡',
    description: 'พลังขับเคลื่อนชีวิต กำลังใจ มั่นใจ และความหวัง',
    colorClass: 'border-yellow-500/30 bg-yellow-950/20 text-yellow-300',
    items: [
      'สดใส (Bright)',
      'มีความหวัง (Hopeful)',
      'สนุกสนาน (Energetic)',
      'ร่าเริง (Cheerful)',
      'ตื่นเต้น (Excited)',
      'มั่นใจ (Confident)',
      'เข้มแข็ง (Strong)',
      'เร้าใจ (Thrilling)',
      'ทรงพลัง (Powerful)',
      'อิสระ (Free-spirited)'
    ]
  },
  {
    id: 'vibe-style',
    categoryName: 'ชิลล์ & สไตล์ & มิติอารมณ์',
    icon: '🌙',
    description: 'บรรยากาศเท่ๆ น่าค้นหา ฟุ้งฝัน ชวนเคลิบเคลิ้ม',
    colorClass: 'border-purple-500/30 bg-purple-950/20 text-purple-300',
    items: [
      'สบายๆ (Chill)',
      'เท่ (Cool)',
      'เซ็กซี่ (Sexy)',
      'ลึกลับ (Mysterious)',
      'กวนๆ (Playful)',
      'ปล่อยวาง (Peaceful)',
      'เคลิ้ม (Trance)',
      'หรูหรา (Elegant)',
      'ล้ำสมัย (Futuristic)',
      'วินเทจ (Vintage)',
      'มืดมน (Dark)',
      'หลอน (Eerie)',
      'ชวนฝัน (Ethereal)',
      'ติดหู (Catchy)',
      'ฟุ้งซ่าน (Distracted)',
      'เหว่ว้า (Desolate)'
    ]
  }
];

export const MOODS = MOOD_GROUPS.flatMap(g => g.items);

export const THEME_SUGGESTIONS = [
  'ฝนที่ตกไม่หยุด',
  'โลกคู่ขนาน',
  'เบอร์ที่ไม่มีคนรับ',
  'ร้านกาแฟที่เคยไปบ่อยๆ',
  'ข้อความที่ไม่ได้กดส่ง',
  'ความฝันในตอนกลางวัน',
  'สถานีรถไฟตอนเที่ยงคืน',
  'เงาในกระจก',
  'จดหมายจากอดีต',
  'แสงสุดท้ายของวัน',
  'วงกลมที่ไม่มีจุดจบ',
  'กลิ่นหอมที่คุ้นเคย'
];

export const KEYWORD_SUGGESTIONS: Record<string, string[]> = {
  'Sad': ['น้ำตา', 'เงา', 'จากลา', 'ความทรงจำ', 'เจ็บ', 'คืนที่เหน็บหนาว'],
  'Lonely': ['ดวงดาว', 'ท้องฟ้า', 'โทรศัพท์', 'นาฬิกา', 'เสียงเงียบ', 'รอคอย'],
  'In Love': ['รอยยิ้ม', 'หัวใจ', 'ความสุข', 'พรหมลิขิต', 'โชคดี', 'ตลอดไป'],
};
