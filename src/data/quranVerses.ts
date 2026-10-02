/**
 * Verse-by-verse text for short surahs commonly requested.
 * Each verse is keyed by surah number + ayah number.
 * Used for visual follow-along during audio recitation.
 */

export interface Verse {
  numberInSurah: number;
  text: string;
  /** Approximate duration in seconds for this verse in the full-surah audio */
  durationSec: number;
}

export const quranVerses: Record<number, Verse[]> = {
  // Al-Fatihah (7 ayahs)
  1: [
    { numberInSurah: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', durationSec: 3 },
    { numberInSurah: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', durationSec: 3 },
    { numberInSurah: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ', durationSec: 2.5 },
    { numberInSurah: 4, text: 'مَالِكِ يَوْمِ الدِّينِ', durationSec: 2.5 },
    { numberInSurah: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', durationSec: 3 },
    { numberInSurah: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', durationSec: 3 },
    { numberInSurah: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', durationSec: 6 },
  ],
  // Al-Ikhlas (4 ayahs)
  112: [
    { numberInSurah: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', durationSec: 3 },
    { numberInSurah: 2, text: 'اللَّهُ الصَّمَدُ', durationSec: 2.5 },
    { numberInSurah: 3, text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', durationSec: 3 },
    { numberInSurah: 4, text: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', durationSec: 3.5 },
  ],
  // Al-Falaq (5 ayahs)
  113: [
    { numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', durationSec: 3 },
    { numberInSurah: 2, text: 'مِن شَرِّ مَا خَلَقَ', durationSec: 2.5 },
    { numberInSurah: 3, text: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', durationSec: 3.5 },
    { numberInSurah: 4, text: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', durationSec: 3.5 },
    { numberInSurah: 5, text: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', durationSec: 3.5 },
  ],
  // An-Nas (6 ayahs)
  114: [
    { numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', durationSec: 3 },
    { numberInSurah: 2, text: 'مَلِكِ النَّاسِ', durationSec: 2.5 },
    { numberInSurah: 3, text: 'إِلَٰهِ النَّاسِ', durationSec: 2.5 },
    { numberInSurah: 4, text: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', durationSec: 3.5 },
    { numberInSurah: 5, text: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', durationSec: 4 },
    { numberInSurah: 6, text: 'مِنَ الْجِنَّةِ وَالنَّاسِ', durationSec: 3 },
  ],
  // Al-Kawthar (3 ayahs)
  108: [
    { numberInSurah: 1, text: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', durationSec: 4 },
    { numberInSurah: 2, text: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', durationSec: 3.5 },
    { numberInSurah: 3, text: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', durationSec: 4 },
  ],
  // Al-Asr (3 ayahs)
  103: [
    { numberInSurah: 1, text: 'وَالْعَصْرِ', durationSec: 2.5 },
    { numberInSurah: 2, text: 'إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ', durationSec: 4 },
    { numberInSurah: 3, text: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', durationSec: 7 },
  ],
  // Al-Nasr (3 ayahs)
  110: [
    { numberInSurah: 1, text: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ', durationSec: 5 },
    { numberInSurah: 2, text: 'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا', durationSec: 6 },
    { numberInSurah: 3, text: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا', durationSec: 6 },
  ],
  // Al-Fil (5 ayahs)
  105: [
    { numberInSurah: 1, text: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ', durationSec: 5 },
    { numberInSurah: 2, text: 'أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ', durationSec: 4 },
    { numberInSurah: 3, text: 'وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ', durationSec: 4.5 },
    { numberInSurah: 4, text: 'تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ', durationSec: 4 },
    { numberInSurah: 5, text: 'فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ', durationSec: 4 },
  ],
  // Quraysh (4 ayahs)
  106: [
    { numberInSurah: 1, text: 'لِإِيلَافِ قُرَيْشٍ', durationSec: 3 },
    { numberInSurah: 2, text: 'إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ', durationSec: 5 },
    { numberInSurah: 3, text: 'فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ', durationSec: 4 },
    { numberInSurah: 4, text: 'الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ', durationSec: 5 },
  ],
  // Al-Maun (7 ayahs)
  107: [
    { numberInSurah: 1, text: 'أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ', durationSec: 4 },
    { numberInSurah: 2, text: 'فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ', durationSec: 4 },
    { numberInSurah: 3, text: 'وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ', durationSec: 4 },
    { numberInSurah: 4, text: 'فَوَيْلٌ لِّلْمُصَلِّينَ', durationSec: 3 },
    { numberInSurah: 5, text: 'الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ', durationSec: 4 },
    { numberInSurah: 6, text: 'الَّذِينَ هُمْ يُرَاءُونَ', durationSec: 3 },
    { numberInSurah: 7, text: 'وَيَمْنَعُونَ الْمَاعُونَ', durationSec: 3.5 },
  ],
  // Al-Kafirun (6 ayahs)
  109: [
    { numberInSurah: 1, text: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ', durationSec: 4 },
    { numberInSurah: 2, text: 'لَا أَعْبُدُ مَا تَعْبُدُونَ', durationSec: 4 },
    { numberInSurah: 3, text: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ', durationSec: 4.5 },
    { numberInSurah: 4, text: 'وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ', durationSec: 4.5 },
    { numberInSurah: 5, text: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ', durationSec: 4.5 },
    { numberInSurah: 6, text: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ', durationSec: 4 },
  ],
  // Al-Ikhlas already at 112
  // Al-Masad (5 ayahs)
  111: [
    { numberInSurah: 1, text: 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ', durationSec: 4 },
    { numberInSurah: 2, text: 'مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ', durationSec: 4 },
    { numberInSurah: 3, text: 'سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ', durationSec: 4 },
    { numberInSurah: 4, text: 'وَامْرَأَتُهُ الْحَمَّالَةَ الْحَطَبَ', durationSec: 4 },
    { numberInSurah: 5, text: 'فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ', durationSec: 4 },
  ],
  // Ad-Duha (11 ayahs)
  93: [
    { numberInSurah: 1, text: 'وَالضُّحَىٰ', durationSec: 2.5 },
    { numberInSurah: 2, text: 'وَاللَّيْلِ إِذَا سَجَىٰ', durationSec: 3 },
    { numberInSurah: 3, text: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ', durationSec: 4 },
    { numberInSurah: 4, text: 'وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ', durationSec: 5 },
    { numberInSurah: 5, text: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', durationSec: 5 },
    { numberInSurah: 6, text: 'أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ', durationSec: 4.5 },
    { numberInSurah: 7, text: 'وَوَجَدَكَ ضَالًّا فَهَدَىٰ', durationSec: 4 },
    { numberInSurah: 8, text: 'وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ', durationSec: 4 },
    { numberInSurah: 9, text: 'فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ', durationSec: 4 },
    { numberInSurah: 10, text: 'وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ', durationSec: 4 },
    { numberInSurah: 11, text: 'وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ', durationSec: 4 },
  ],
  // Ash-Sharh (8 ayahs)
  94: [
    { numberInSurah: 1, text: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ', durationSec: 4 },
    { numberInSurah: 2, text: 'وَوَضَعْنَا عَنكَ وِزْرَكَ', durationSec: 3.5 },
    { numberInSurah: 3, text: 'الَّذِي أَنقَضَ ظَهْرَكَ', durationSec: 3.5 },
    { numberInSurah: 4, text: 'وَرَفَعْنَا لَكَ ذِكْرَكَ', durationSec: 3.5 },
    { numberInSurah: 5, text: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', durationSec: 4 },
    { numberInSurah: 6, text: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', durationSec: 4 },
    { numberInSurah: 7, text: 'فَإِذَا فَرَغْتَ فَانصَبْ', durationSec: 3.5 },
    { numberInSurah: 8, text: 'وَإِلَىٰ رَبِّكَ فَارْغَب', durationSec: 3.5 },
  ],
  // At-Tin (8 ayahs)
  95: [
    { numberInSurah: 1, text: 'وَالتِّينِ وَالزَّيْتُونِ', durationSec: 3 },
    { numberInSurah: 2, text: 'وَطُورِ سِينِينَ', durationSec: 3 },
    { numberInSurah: 3, text: 'وَهَٰذَا الْبَلَدِ الْأَمِينِ', durationSec: 4 },
    { numberInSurah: 4, text: 'لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ', durationSec: 5 },
    { numberInSurah: 5, text: 'ثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ', durationSec: 4 },
    { numberInSurah: 6, text: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ فَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ', durationSec: 6 },
    { numberInSurah: 7, text: 'فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ', durationSec: 4 },
    { numberInSurah: 8, text: 'أَلَيْسَ اللَّهُ بِأَحْكَمِ الْحَاكِمِينَ', durationSec: 4.5 },
  ],
};

/**
 * Get verse text for a surah, if available.
 * Returns null if we don't have verse-by-verse text for this surah.
 */
export function getVersesForSurah(surahNumber: number): Verse[] | null {
  return quranVerses[surahNumber] ?? null;
}
