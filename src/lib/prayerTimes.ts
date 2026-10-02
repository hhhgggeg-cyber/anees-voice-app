/**
 * Prayer Times Calculation using the standard astronomical formulas.
 * Based on the Umm al-Qura calculation method (widely used in the Arab world).
 * Angles: Fajr 18.5°, Isha 90 min after Maghrib, Asr factor 1 (Shafi).
 */

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTime {
  name: PrayerName;
  displayName: string;
  displayNameDiacritics: string;
  time: Date;
}

export interface PrayerTimesResult {
  prayers: PrayerTime[];
  nextPrayer: PrayerTime | null;
  timeUntilNext: { hours: number; minutes: number; seconds: number } | null;
}

interface CalcParams {
  fajrAngle: number;
  ishaInterval: number; // minutes after maghrib
  asrFactor: number; // 1 = Shafi, 2 = Hanafi
}

const UMM_AL_QURA: CalcParams = {
  fajrAngle: 18.5,
  ishaInterval: 90,
  asrFactor: 1,
};

function degToRad(d: number): number {
  return (d * Math.PI) / 180;
}

function radToDeg(r: number): number {
  return (r * 180) / Math.PI;
}

function sin(d: number): number {
  return Math.sin(degToRad(d));
}

function cos(d: number): number {
  return Math.cos(degToRad(d));
}

function tan(d: number): number {
  return Math.tan(degToRad(d));
}

function arcsin(x: number): number {
  return radToDeg(Math.asin(x));
}

function arccos(x: number): number {
  return radToDeg(Math.acos(x));
}

function arctan2(y: number, x: number): number {
  return radToDeg(Math.atan2(y, x));
}

function arccot(x: number): number {
  return radToDeg(Math.atan(1 / x));
}

/**
 * Julian Day Number for a given date.
 */
function julianDay(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5
  );
}

/**
 * Compute sun declination and equation of time for a given Julian day.
 */
function sunPosition(jd: number): { declination: number; equationOfTime: number } {
  const D = jd - 2451545.0;
  const G = (357.529 + 0.98560028 * D) % 360;
  const Q = (280.459 + 0.98564736 * D) % 360;
  const L = (Q + 1.915 * sin(G) + 0.020 * sin(2 * G)) % 360;
  const E = 23.439 - 0.00000036 * D;
  const RA = arctan2(cos(E) * sin(L), cos(L)) / 15;
  const declination = arcsin(sin(E) * sin(L));
  const eqt = (Q / 15 - RA) * 60; // in minutes
  return { declination, equationOfTime: eqt };
}

/**
 * Compute the time of a prayer angle.
 */
function computeTime(angle: number, lat: number, decl: number, eqt: number, fajrOrIsha: boolean): number {
  const cosArg = (sin(fajrOrIsha ? -angle : angle) - sin(lat) * sin(decl)) / (cos(lat) * cos(decl));
  if (cosArg > 1 || cosArg < -1) return NaN; // Sun never rises/sets
  const T = arccos(cosArg) / 15;
  return fajrOrIsha ? 12 - T - eqt / 60 : 12 + T - eqt / 60;
}

/**
 * Compute Asr time based on shadow factor.
 */
function computeAsr(factor: number, lat: number, decl: number, eqt: number): number {
  const angle = arccot(factor + tan(Math.abs(lat - decl)));
  const T = arccos((sin(angle) - sin(lat) * sin(decl)) / (cos(lat) * cos(decl))) / 15;
  return 12 + T - eqt / 60;
}

/**
 * Convert decimal hours (0-24) to a Date object for a given base date.
 */
function hoursToDate(hours: number, base: Date): Date | null {
  if (isNaN(hours)) return null;
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  d.setMilliseconds(Math.round(hours * 3600 * 1000));
  return d;
}

/**
 * Calculate all prayer times for a given location and date.
 */
export function calculatePrayerTimes(
  latitude: number,
  longitude: number,
  date: Date = new Date()
): PrayerTimesResult {
  const jd = julianDay(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate() - longitude / (15 * 24)
  );

  const { declination, equationOfTime } = sunPosition(jd);
  const lat = latitude;
  const params = UMM_AL_QURA;

  // Dhuhr = 12 + eqt + longitude/15 (simplified, no adjustment)
  const dhuhrHours = 12 + equationOfTime / 60 + longitude / 15;

  const fajrHours = computeTime(params.fajrAngle, lat, declination, equationOfTime, true);
  const asrHours = computeAsr(params.asrFactor, lat, declination, equationOfTime);
  const maghribHours = computeTime(0.833, lat, declination, equationOfTime, false);
  const ishaHours = maghribHours + params.ishaInterval / 60;

  const prayerNames: { name: PrayerName; displayName: string; displayNameDiacritics: string }[] = [
    { name: 'fajr', displayName: 'الفجر', displayNameDiacritics: 'الفَجْر' },
    { name: 'dhuhr', displayName: 'الظهر', displayNameDiacritics: 'الظُّهْر' },
    { name: 'asr', displayName: 'العصر', displayNameDiacritics: 'العَصْر' },
    { name: 'maghrib', displayName: 'المغرب', displayNameDiacritics: 'المَغْرِب' },
    { name: 'isha', displayName: 'العشاء', displayNameDiacritics: 'العِشَاء' },
  ];

  const hoursMap: Record<PrayerName, number> = {
    fajr: fajrHours,
    dhuhr: dhuhrHours,
    asr: asrHours,
    maghrib: maghribHours,
    isha: ishaHours,
  };

  const prayers: PrayerTime[] = prayerNames
    .map((pn) => ({
      name: pn.name,
      displayName: pn.displayName,
      displayNameDiacritics: pn.displayNameDiacritics,
      time: hoursToDate(hoursMap[pn.name], date)!,
    }))
    .filter((p) => p.time !== null);

  // Find next prayer
  const now = date.getTime();
  let nextPrayer: PrayerTime | null = null;

  for (const prayer of prayers) {
    if (prayer.time.getTime() > now) {
      nextPrayer = prayer;
      break;
    }
  }

  // If all prayers have passed today, next is Fajr tomorrow
  if (!nextPrayer && prayers.length > 0) {
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowResult = calculatePrayerTimes(latitude, longitude, tomorrow);
    nextPrayer = tomorrowResult.nextPrayer || tomorrowResult.prayers[0] || null;
  }

  // Calculate time until next prayer
  let timeUntilNext: { hours: number; minutes: number; seconds: number } | null = null;
  if (nextPrayer) {
    const diff = nextPrayer.time.getTime() - now;
    if (diff > 0) {
      const totalSeconds = Math.floor(diff / 1000);
      timeUntilNext = {
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      };
    }
  }

  return { prayers, nextPrayer, timeUntilNext };
}

/**
 * Format a prayer time as HH:MM in Arabic-friendly format.
 */
export function formatPrayerTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const h12 = hours % 12 || 12;
  const period = hours >= 12 ? 'م' : 'ص';
  return `${h12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Generate spoken text for remaining time until next prayer.
 * Returns text with full diacritics for TTS.
 */
export function getPrayerCountdownText(
  nextPrayer: PrayerTime,
  timeUntil: { hours: number; minutes: number; seconds: number }
): string {
  const prayerName = nextPrayer.displayNameDiacritics;
  const h = timeUntil.hours;
  const m = timeUntil.minutes;

  let timePhrase: string;
  if (h > 0 && m > 0) {
    timePhrase = `ساعةٌ وَاحِدَةٌ${h > 1 ? ` وَ${h} سَاعَاتٍ` : ''} وَ${m} دَقِيقَةً`;
    if (h === 1 && m === 0) timePhrase = 'سَاعَةٌ وَاحِدَةٌ';
    if (h === 1 && m > 0) timePhrase = `سَاعَةٌ وَاحِدَةٌ وَ${m} دَقِيقَةً`;
    if (h > 1 && m === 0) timePhrase = `${h} سَاعَات`;
    if (h === 0) timePhrase = `${m} دَقِيقَة`;
  } else if (h > 0) {
    timePhrase = h === 1 ? 'سَاعَةٌ وَاحِدَةٌ' : `${h} سَاعَات`;
  } else if (m > 0) {
    timePhrase = m === 1 ? 'دَقِيقَةٌ وَاحِدَة' : m === 2 ? 'دَقِيقَتَان' : `${m} دَقِيقَة`;
  } else {
    timePhrase = 'أَقَلَّ مِنْ دَقِيقَة';
  }

  return `الصَّلَاةُ القَادِمَةُ هِيَ صَلَاةُ ${prayerName}. بَقِيَ عَلَيْهَا ${timePhrase}.`;
}
