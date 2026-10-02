import { surahs, surahAliases, surahNumberKeywords, type Surah } from '@/data/surahs';
import {
  lectures,
  lectureCategories,
  findLectureByText,
  findLectureCategoryByText,
  isComplexFatwaRequest,
  type LectureCategory,
} from '@/data/lectures';

export type Intent =
  | { type: 'quran'; surah: Surah }
  | { type: 'athkar_morning' }
  | { type: 'athkar_evening' }
  | { type: 'athkar_auto' }
  | { type: 'qibla' }
  | { type: 'lecture_category'; category: LectureCategory }
  | { type: 'lecture_specific'; lectureId: string }
  | { type: 'lecture_list' }
  | { type: 'prayer_times' }
  | { type: 'fatwa_fallback' }
  | { type: 'back' }
  | { type: 'help' }
  | { type: 'unknown'; raw: string };

export function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
    .replace(/[إأآا]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getAutoAthkarMode(date: Date = new Date()): 'morning' | 'evening' {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const timeInHours = hour + minute / 60;
  if (timeInHours >= 5 && timeInHours < 15.5) {
    return 'morning';
  }
  return 'evening';
}

function findSurahByText(raw: string): Surah | null {
  const normalized = normalizeArabic(raw);

  for (const [alias, num] of Object.entries(surahAliases)) {
    const normAlias = normalizeArabic(alias);
    if (normalized.includes(normAlias)) {
      const surah = surahs.find((s) => s.number === num);
      if (surah) return surah;
    }
  }

  for (const surah of surahs) {
    const normName = normalizeArabic(surah.name);
    if (normalized.includes(normName)) {
      return surah;
    }
  }

  const numMatch = normalized.match(/(\d+)/);
  if (numMatch) {
    const num = parseInt(numMatch[1], 10);
    if (num >= 1 && num <= 114) {
      const surah = surahs.find((s) => s.number === num);
      if (surah) return surah;
    }
  }

  for (const [word, num] of Object.entries(surahNumberKeywords)) {
    const normWord = normalizeArabic(word);
    if (normalized.includes(normWord)) {
      const surah = surahs.find((s) => s.number === num);
      if (surah) return surah;
    }
  }

  return null;
}

export function parseCommand(rawInput: string): Intent {
  const normalized = normalizeArabic(rawInput);

  if (!normalized) {
    return { type: 'unknown', raw: rawInput };
  }

  // Navigation: back
  if (normalized.includes('رجوع') || normalized.includes('الرئيسيه') || normalized.includes('الرئيسية') || normalized.includes('رجع') || normalized.includes('خروج') || normalized.includes('الغاء') || normalized.includes('إلغاء')) {
    return { type: 'back' };
  }

  // Prayer times — check before qibla since both may mention "صلاة"
  if (
    normalized.includes('متى الصلاه') || normalized.includes('متى الصلاة') ||
    normalized.includes('وقت الصلاه') || normalized.includes('وقت الصلاة') ||
    normalized.includes('مواقيت الصلاه') || normalized.includes('مواقيت الصلاة') ||
    normalized.includes('كم بقي') || normalized.includes('كم باقي') || normalized.includes('كم بقى') ||
    normalized.includes('الصلاه القادمه') || normalized.includes('الصلاة القادمة') ||
    normalized.includes('الصلاه القادمه') || normalized.includes('وقت الصلاه القادمه') ||
    normalized.includes('مواعيد الصلاه') || normalized.includes('مواعيد الصلاة') ||
    normalized.includes('مواقيت') || normalized.includes('الاذان') || normalized.includes('الأذان')
  ) {
    return { type: 'prayer_times' };
  }

  // Quran — check before general surah
  if (normalized.includes('قران') || normalized.includes('قرآن') || normalized.includes('سوره') || normalized.includes('سورة')) {
    const surah = findSurahByText(rawInput);
    if (surah) {
      return { type: 'quran', surah };
    }
  }

  const surah = findSurahByText(rawInput);
  if (surah) {
    return { type: 'quran', surah };
  }

  // Athkar
  if (normalized.includes('اذكار') || normalized.includes('أذكار') || normalized.includes('الاذكار') || normalized.includes('الأذكار')) {
    if (normalized.includes('صباح')) {
      return { type: 'athkar_morning' };
    }
    if (normalized.includes('مساء')) {
      return { type: 'athkar_evening' };
    }
    return { type: 'athkar_auto' };
  }

  // Qibla
  if (normalized.includes('قبله') || normalized.includes('قبلة') || normalized.includes('كعبه') || normalized.includes('كعبة') || normalized.includes('اتجاه القبله') || normalized.includes('اتجاه القبلة')) {
    return { type: 'qibla' };
  }

  // Check for complex fatwa request first (safety fallback)
  if (isComplexFatwaRequest(rawInput)) {
    return { type: 'fatwa_fallback' };
  }

  // Lectures — topic routing
  if (
    normalized.includes('محاضره') || normalized.includes('محاضرة') ||
    normalized.includes('دروس') || normalized.includes('درس') ||
    normalized.includes('عظه') || normalized.includes('عظة') ||
    normalized.includes('حديث') || normalized.includes('احاديث') || normalized.includes('أحاديث') ||
    normalized.includes('الشيخ') || normalized.includes('ابن عثيمين') || normalized.includes('عثيمين')
  ) {
    // Try specific lecture
    const specific = findLectureByText(rawInput);
    if (specific) {
      return { type: 'lecture_specific', lectureId: specific.id };
    }

    // Try category
    const category = findLectureCategoryByText(rawInput);
    if (category) {
      return { type: 'lecture_category', category };
    }

    // Just show the list
    return { type: 'lecture_list' };
  }

  // Also check lecture keywords even without explicit "lecture" word
  const category = findLectureCategoryByText(rawInput);
  if (category) {
    return { type: 'lecture_category', category };
  }

  const specificLecture = findLectureByText(rawInput);
  if (specificLecture) {
    return { type: 'lecture_specific', lectureId: specificLecture.id };
  }

  // Help
  if (normalized.includes('مساعده') || normalized.includes('مساعدة') || normalized.includes('ماذا') || normalized.includes('شنو') || normalized.includes('ايش') || normalized.includes('أيش') || normalized.includes('ساعدني') || normalized.includes('الاوامر') || normalized.includes('الأوامر')) {
    return { type: 'help' };
  }

  return { type: 'unknown', raw: rawInput };
}

export function getSurahAudioUrl(surahNumber: number): string {
  const padded = String(surahNumber).padStart(3, '0');
  return `https://server8.mp3quran.net/afs/${padded}.mp3`;
}

export function getSurahAudioUrlSudais(surahNumber: number): string {
  const padded = String(surahNumber).padStart(3, '0');
  return `https://server11.mp3quran.net/sds/${padded}.mp3`;
}

export { lectures, lectureCategories };
