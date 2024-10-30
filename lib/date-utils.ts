import { SupportedLanguage } from '@/lib/types';

const dateTimeFormats = {
  en: {
    template: 'I would like to select {datetime}'
  },
  zh: {
    template: '我想選擇 {datetime}'
  },
  ja: {
    template: '{datetime}を選択したいです'
  },
  ko: {
    template: '{datetime}를 선택하고 싶습니다'
  },
  es: {
    template: 'Me gustaría seleccionar {datetime}'
  },
  fr: {
    template: 'Je voudrais sélectionner {datetime}'
  }
} as const;

export function formatDateTime(date: Date, language: SupportedLanguage): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: language === 'en' ? 'numeric' : '2-digit',
    day: language === 'en' ? 'numeric' : '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: language === 'en'
  };

  const formatter = new Intl.DateTimeFormat(
    language === 'en' ? 'en-US' :
    language === 'zh' ? 'zh-TW' :
    language === 'ja' ? 'ja-JP' :
    language === 'ko' ? 'ko-KR' :
    language === 'es' ? 'es-ES' : 'fr-FR',
    options
  );

  const formattedDateTime = formatter.format(date);
  return dateTimeFormats[language].template.replace('{datetime}', formattedDateTime);
}