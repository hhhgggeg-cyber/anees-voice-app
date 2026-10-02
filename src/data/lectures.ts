export type LectureCategory = 'prayer' | 'fasting' | 'dhikr';

export interface Lecture {
  id: string;
  title: string;
  titleDiacritics: string;
  speaker: string;
  description: string;
  descriptionDiacritics: string;
  audioUrl: string;
  category: LectureCategory;
  /** Keywords that trigger this lecture via voice (normalized, no diacritics) */
  voiceKeywords: string[];
}

export interface LectureCategoryInfo {
  id: LectureCategory;
  title: string;
  titleDiacritics: string;
  icon: 'book' | 'moon' | 'heart';
  voiceKeywords: string[];
}

export const lectureCategories: LectureCategoryInfo[] = [
  {
    id: 'prayer',
    title: 'أحكام الصلاة',
    titleDiacritics: 'أَحْكَامُ الصَّلَاة',
    icon: 'book',
    voiceKeywords: ['الصلاه', 'الصلاة', 'احكام الصلاه', 'احكام الصلاة', 'دروس الصلاه', 'دروس الصلاة', 'كيفية الصلاه', 'كيفية الصلاة', 'الصلوه'],
  },
  {
    id: 'fasting',
    title: 'أحكام الصوم',
    titleDiacritics: 'أَحْكَامُ الصَّوْم',
    icon: 'moon',
    voiceKeywords: ['الصوم', 'الصيام', 'احكام الصوم', 'احكام الصيام', 'فضائل الصيام', 'فضائل الصوم', 'دروس الصوم', 'دروس الصيام', 'رمضان', 'الصوم'],
  },
  {
    id: 'dhikr',
    title: 'فضل ذكر الله',
    titleDiacritics: 'فَضْلُ ذِكْرِ اللَّه',
    icon: 'heart',
    voiceKeywords: ['الذكر', 'ذكر الله', 'فضل الذكر', 'فضل ذكر الله', 'الاذكار', 'الأذكار', 'الدعاء', 'الدعاء', 'الدعاء'],
  },
];

export const lectures: Lecture[] = [
  // Prayer category
  {
    id: 'p1',
    title: 'فرائض الصلاة وأركانها',
    titleDiacritics: 'فَرَائِضُ الصَّلَاةِ وَأَرْكَانُهَا',
    speaker: 'الشيخ ابن عثيمين',
    description: 'شرح مبسّط لفرائض الصلاة وأركانها وما يجب على المصلي معرفته',
    descriptionDiacritics: 'شَرْحٌ مُبَسَّطٌ لِفَرَائِضِ الصَّلَاةِ وَأَرْكَانِهَا وَمَا يَجِبُ عَلَى المُصَلِّي مَعْرِفَتُهُ',
    audioUrl: 'https://archive.org/download/ibnuthaimeen_201808/01_faraaid_alsala.mp3',
    category: 'prayer',
    voiceKeywords: ['الفرائض', 'الاركان', 'اركان الصلاه', 'اركان الصلاة'],
  },
  {
    id: 'p2',
    title: 'شروط الصلاة',
    titleDiacritics: 'شُرُوطُ الصَّلَاة',
    speaker: 'الشيخ ابن عثيمين',
    description: 'بيان شروط الصلاة التي يجب توفرها قبل الدخول فيها',
    descriptionDiacritics: 'بَيَانُ شُرُوطِ الصَّلَاةِ الَّتِي يَجِبُ تَوَفُّرُهَا قَبْلَ الدُّخُولِ فِيهَا',
    audioUrl: 'https://archive.org/download/ibnuthaimeen_201808/02_shorout_alsala.mp3',
    category: 'prayer',
    voiceKeywords: ['شروط الصلاه', 'شروط الصلاة', 'الشروط'],
  },
  {
    id: 'p3',
    title: 'مبطلات الصلاة',
    titleDiacritics: 'مُبْطِلَاتُ الصَّلَاة',
    speaker: 'الشيخ ابن عثيمين',
    description: 'ما يبطل الصلاة وما يجب على المصلي اجتنابه',
    descriptionDiacritics: 'مَا يُبْطِلُ الصَّلَاةَ وَمَا يَجِبُ عَلَى المُصَلِّي اجْتِنَابُهُ',
    audioUrl: 'https://archive.org/download/ibnuthaimeen_201808/03_mubtilat_alsala.mp3',
    category: 'prayer',
    voiceKeywords: ['مبطلات الصلاه', 'مبطلات الصلاة', 'المبطلات'],
  },

  // Fasting category
  {
    id: 'f1',
    title: 'فضائل الصيام وآدابه',
    titleDiacritics: 'فَضَائِلُ الصِّيَامِ وَآدَابُهُ',
    speaker: 'الشيخ ابن عثيمين',
    description: 'بيان فضائل الصيام وآدابه وما ينبغي للصائم مراعاته',
    descriptionDiacritics: 'بَيَانُ فَضَائِلِ الصِّيَامِ وَآدَابِهِ وَمَا يَنْبَغِي لِلصَّائِمِ مُرَاعَاتُهُ',
    audioUrl: 'https://archive.org/download/ibnuthaimeen_201808/04_fadaail_alsyam.mp3',
    category: 'fasting',
    voiceKeywords: ['فضائل الصيام', 'فضائل الصوم', 'آداب الصيام', 'اداب الصيام'],
  },
  {
    id: 'f2',
    title: 'ما يفطر الصائم وما لا يفطره',
    titleDiacritics: 'مَا يُفْطِرُ الصَّائِمَ وَمَا لَا يُفْطِرُهُ',
    speaker: 'الشيخ ابن عثيمين',
    description: 'توضيح ما يفطر الصائم وما لا يفطره من الأشياء',
    descriptionDiacritics: 'تَوْضِيحُ مَا يُفْطِرُ الصَّائِمَ وَمَا لَا يُفْطِرُهُ مِنَ الأَشْيَاء',
    audioUrl: 'https://archive.org/download/ibnuthaimeen_201808/05_yufthir_alsyaim.mp3',
    category: 'fasting',
    voiceKeywords: ['ما يفطر', 'مفطرات', 'الافطار', 'الإفطار', 'يفطر'],
  },
  {
    id: 'f3',
    title: 'أحكام الزكاة والصوم',
    titleDiacritics: 'أَحْكَامُ الزَّكَاةِ وَالصَّوْم',
    speaker: 'الشيخ ابن عثيمين',
    description: 'أحكام متعلقة بالزكاة والصوم وأوجب الواجبات على المسلم',
    descriptionDiacritics: 'أَحْكَامٌ مُتَعَلِّقَةٌ بِالزَّكَاةِ وَالصَّوْمِ وَأَوْجَبُ الوَاجِبَاتِ عَلَى المُسْلِم',
    audioUrl: 'https://archive.org/download/ibnuthaimeen_201808/06_zakat_syam.mp3',
    category: 'fasting',
    voiceKeywords: ['الزكاة', 'الزكاه', 'احكام الصوم'],
  },

  // Dhikr category
  {
    id: 'd1',
    title: 'فضل الذكر والدعاء',
    titleDiacritics: 'فَضْلُ الذِّكْرِ وَالدُّعَاء',
    speaker: 'الشيخ ابن عثيمين',
    description: 'بيان فضل الذكر والدعاء وأثره في حياة المسلم',
    descriptionDiacritics: 'بَيَانُ فَضْلِ الذِّكْرِ وَالدُّعَاءِ وَأَثَرِهِ فِي حَيَاةِ المُسْلِم',
    audioUrl: 'https://archive.org/download/ibnuthaimeen_201808/07_fadl_alzthikr.mp3',
    category: 'dhikr',
    voiceKeywords: ['فضل الذكر', 'فضل الدعاء', 'الدعاء', 'الدعاء'],
  },
  {
    id: 'd2',
    title: 'أدعية النبي ﷺ',
    titleDiacritics: 'أَدْعِيَةُ النَّبِيِّ ﷺ',
    speaker: 'الشيخ ابن عثيمين',
    description: 'مجموعة من أدعية النبي صلى الله عليه وسلم المستحبة',
    descriptionDiacritics: 'مَجْمُوعَةٌ مِنْ أَدْعِيَةِ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ المُسْتَحْبَّة',
    audioUrl: 'https://archive.org/download/ibnuthaimeen_201808/08_ad3iyat_nabawi.mp3',
    category: 'dhikr',
    voiceKeywords: ['ادعية النبي', 'أدعية النبي', 'ادعيه', 'أدعيه', 'الادعيه', 'الأدعيه'],
  },
  {
    id: 'd3',
    title: 'الذكر في الصباح والمساء',
    titleDiacritics: 'الذِّكْرُ فِي الصَّبَاحِ وَالمَسَاء',
    speaker: 'الشيخ ابن عثيمين',
    description: 'أهمية الذكر في الصباح والمساء وأثره على المسلم',
    descriptionDiacritics: 'أَهَمِّيَّةُ الذِّكْرِ فِي الصَّبَاحِ وَالمَسَاءِ وَأَثَرُهُ عَلَى المُسْلِم',
    audioUrl: 'https://archive.org/download/ibnuthaimeen_201808/09_zthikr_sabah_masaa.mp3',
    category: 'dhikr',
    voiceKeywords: ['الذكر في الصباح', 'الذكر في المساء', 'ذكر الصباح', 'ذكر المساء'],
  },
];

/**
 * The safety audio fallback message for complex/unrecorded fatwa requests.
 * With full diacritics for precise TTS pronunciation.
 */
export const SAFETY_FALLBACK_TEXT = 'هَذِهِ المَسْأَلَةُ تَحْتَاجُ إِلَى تَفْصِيلٍ شَرْعِيٍّ دَقِيق. لِضَمَانِ صِحَّةِ الفَتْوَى، يُرْجَى التَّوَاصُلُ مُبَاشَرَةً مَعَ دَارِ الإِفْتَاء.';

/**
 * Check if the user's voice request seems like a fatwa/complex question
 * (starts with question words or asks about rulings).
 */
export function isComplexFatwaRequest(text: string): boolean {
  const normalized = text
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
    .replace(/[إأآا]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim();

  const fatwaIndicators = [
    'ما حكم', 'ما الحكم', 'هل يجوز', 'ما راي', 'ما رأي',
    'افتى', 'أفتى', 'الفتوى', 'الفتوى', 'حلال', 'حرام',
    'نواقض', 'كفارة', 'الكفاره', 'الكفارة', 'مفسد', 'مفسدات',
    'ما قولكم', 'استفتي', 'سؤال', 'السؤال',
  ];

  return fatwaIndicators.some((ind) => normalized.includes(ind.replace(/[إأآا]/g, 'ا').replace(/ة/g, 'ه')));
}

/**
 * Find a lecture category by voice keyword.
 */
export function findLectureCategoryByText(text: string): LectureCategory | null {
  const normalized = text
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
    .replace(/[إأآا]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim();

  for (const cat of lectureCategories) {
    for (const kw of cat.voiceKeywords) {
      const normKw = kw
        .replace(/[إأآا]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه');
      if (normalized.includes(normKw)) {
        return cat.id;
      }
    }
  }
  return null;
}

/**
 * Find a specific lecture by voice keyword.
 */
export function findLectureByText(text: string): Lecture | null {
  const normalized = text
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
    .replace(/[إأآا]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim();

  for (const lecture of lectures) {
    for (const kw of lecture.voiceKeywords) {
      const normKw = kw
        .replace(/[إأآا]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه');
      if (normalized.includes(normKw)) {
        return lecture;
      }
    }
  }
  return null;
}
