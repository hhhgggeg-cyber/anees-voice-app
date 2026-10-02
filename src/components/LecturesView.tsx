import { useState } from 'react';
import { ChevronLeft, BookOpen, Moon, Heart, Play, Volume2 } from 'lucide-react';
import {
  lectures,
  lectureCategories,
  type LectureCategory,
  type LectureCategoryInfo,
  type Lecture,
} from '@/data/lectures';
import { useTTS } from '@/hooks/useTTS';

interface LecturesViewProps {
  onBack: () => void;
  onSelectLecture: (lecture: Lecture) => void;
  initialCategory?: LectureCategory | null;
}

const categoryIconMap: Record<LectureCategoryInfo['icon'], typeof BookOpen> = {
  book: BookOpen,
  moon: Moon,
  heart: Heart,
};

export function LecturesView({ onBack, onSelectLecture, initialCategory = null }: LecturesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<LectureCategory | null>(initialCategory);
  const { speak, stop } = useTTS();

  const handleCategorySelect = (cat: LectureCategory) => {
    setSelectedCategory(cat);
    const info = lectureCategories.find((c) => c.id === cat);
    speak(info?.titleDiacritics ?? '');
  };

  const handleLectureSelect = (lecture: Lecture) => {
    stop();
    speak(lecture.descriptionDiacritics, {
      onEnd: () => onSelectLecture(lecture),
    });
  };

  const filteredLectures = selectedCategory
    ? lectures.filter((l) => l.category === selectedCategory)
    : [];

  return (
    <div className="flex flex-col min-h-[70vh] px-6 py-8 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between mb-8">
        <button
          onClick={() => {
            stop();
            if (selectedCategory) {
              setSelectedCategory(null);
            } else {
              onBack();
            }
          }}
          className="touch-target w-12 h-12 rounded-xl bg-emerald-800/50 hover:bg-emerald-700 flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-cream-100" />
        </button>
        <h2 className="text-2xl font-cairo font-bold text-gold-gradient">
          {selectedCategory ? lectureCategories.find((c) => c.id === selectedCategory)?.titleDiacritics : 'مَكْتَبَةُ الشَّيْخِ ابْنِ عُثَيْمِين'}
        </h2>
        <div className="w-12" />
      </div>

      {/* Category list */}
      {!selectedCategory && (
        <div className="w-full max-w-md mx-auto space-y-4">
          {lectureCategories.map((cat) => {
            const Icon = categoryIconMap[cat.icon];
            const count = lectures.filter((l) => l.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="w-full glass-panel rounded-2xl p-6 text-right hover:bg-emerald-800/30 transition-colors active:scale-[0.98] group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-600/20 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600/30 transition-colors">
                    <Icon className="w-7 h-7 text-gold-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-cairo font-bold text-cream-100 mb-1">
                      {cat.titleDiacritics}
                    </h3>
                    <p className="text-sm font-cairo text-cream-200/50">
                      {count} دُرُوس
                    </p>
                  </div>
                  <ChevronLeft className="w-6 h-6 text-cream-200/30 mt-4 rotate-180" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Lecture list within category */}
      {selectedCategory && (
        <div className="w-full max-w-md mx-auto space-y-4">
          {filteredLectures.map((lecture) => (
            <button
              key={lecture.id}
              onClick={() => handleLectureSelect(lecture)}
              className="w-full glass-panel rounded-2xl p-6 text-right hover:bg-emerald-800/30 transition-colors active:scale-[0.98] group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gold-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/25 transition-colors">
                  <Play className="w-7 h-7 text-gold-400" fill="currentColor" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-cairo font-bold text-cream-100 mb-1">
                    {lecture.titleDiacritics}
                  </h3>
                  <p className="text-sm font-cairo text-cream-200/60 leading-relaxed mb-2">
                    {lecture.descriptionDiacritics}
                  </p>
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-cairo text-emerald-300">
                      {lecture.speaker}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
