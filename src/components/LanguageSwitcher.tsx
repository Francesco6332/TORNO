import { Languages } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import type { Language } from '@/i18n/translations';

const languages: Language[] = ['it', 'en'];

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
      <Languages className="w-4 h-4 text-gray-400 ml-1" aria-hidden />
      {languages.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          className={`px-2 py-1 rounded-md text-xs font-semibold uppercase transition-colors ${
            language === option
              ? 'bg-primary-600 text-white'
              : 'text-gray-400 hover:text-gray-100 hover:bg-white/10'
          }`}
          aria-label={t(`language.${option}`)}
          aria-pressed={language === option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
