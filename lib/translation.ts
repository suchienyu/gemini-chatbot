// translations.ts
export type SupportedLanguage = 'en' | 'zh' | 'ja' | 'ko' | 'es' | 'fr';

interface TranslationConfig {
  dateFormat: string;
  timeFormat: string;
  template: string;
}

interface BookingTranslations {
  firstQuestion: string;
  selectTime: string;
  selectTeacher: string;
  bookingConfirmed: string;
  teacherSelected: string;
  trialLesson: string;
  regularLesson: string;
  emailConfirmation: string;
}

export const dateTimeFormats: Record<SupportedLanguage, TranslationConfig> = {
  en: {
    dateFormat: 'M/D/YYYY',
    timeFormat: 'h:mm A',
    template: 'I would like to select {datetime}'
  },
  zh: {
    dateFormat: 'YYYY年MM月DD日',
    timeFormat: 'HH:mm',
    template: '我想選擇 {datetime}'
  },
  ja: {
    dateFormat: 'YYYY年MM月DD日',
    timeFormat: 'HH:mm',
    template: '{datetime}を選択したいです'
  },
  ko: {
    dateFormat: 'YYYY년 MM월 DD일',
    timeFormat: 'HH:mm',
    template: '{datetime}를 선택하고 싶습니다'
  },
  es: {
    dateFormat: 'D/M/YYYY',
    timeFormat: 'HH:mm',
    template: 'Me gustaría seleccionar {datetime}'
  },
  fr: {
    dateFormat: 'D/M/YYYY',
    timeFormat: 'HH:mm',
    template: 'Je voudrais sélectionner {datetime}'
  }
};

export const bookingTranslations: Record<SupportedLanguage, BookingTranslations> = {
  en: {
    firstQuestion: "Would you like a trial or regular lesson?",
    selectTime: "Please select a time.",
    selectTeacher: "Please select a teacher.",
    bookingConfirmed: "Your booking is confirmed.",
    teacherSelected: "You have selected teacher {name}",
    trialLesson: "Trial Lesson",
    regularLesson: "Regular Lesson",
    emailConfirmation: "Booking confirmation has been sent to your email."
  },
  zh: {
    firstQuestion: "您想要預約體驗課還是正式課程？",
    selectTime: "請選擇時間。",
    selectTeacher: "請選擇老師。",
    bookingConfirmed: "您的預約已確認。",
    teacherSelected: "您已選擇 {name} 老師",
    trialLesson: "體驗課",
    regularLesson: "正式課程",
    emailConfirmation: "預約確認已發送至您的信箱。"
  },
  ja: {
    firstQuestion: "体験レッスンと通常レッスン、どちらをご希望ですか？",
    selectTime: "時間を選択してください。",
    selectTeacher: "講師を選択してください。",
    bookingConfirmed: "ご予約が確定しました。",
    teacherSelected: "{name}先生を選択しました",
    trialLesson: "体験レッスン",
    regularLesson: "通常レッスン",
    emailConfirmation: "予約確認メールを送信しました。"
  },
  ko: {
    firstQuestion: "체험 수업과 정규 수업 중 어떤 것을 원하시나요?",
    selectTime: "시간을 선택해 주세요.",
    selectTeacher: "선생님을 선택해 주세요.",
    bookingConfirmed: "예약이 확정되었습니다.",
    teacherSelected: "{name} 선생님을 선택하셨습니다",
    trialLesson: "체험 수업",
    regularLesson: "정규 수업",
    emailConfirmation: "예약 확인 이메일을 보냈습니다."
  },
  es: {
    firstQuestion: "¿Desea una clase de prueba o una clase regular?",
    selectTime: "Por favor, seleccione una hora.",
    selectTeacher: "Por favor, seleccione un profesor.",
    bookingConfirmed: "Su reserva está confirmada.",
    teacherSelected: "Has seleccionado al profesor {name}",
    trialLesson: "Clase de prueba",
    regularLesson: "Clase regular",
    emailConfirmation: "La confirmación de la reserva ha sido enviada a su correo."
  },
  fr: {
    firstQuestion: "Souhaitez-vous une leçon d'essai ou une leçon régulière ?",
    selectTime: "Veuillez choisir une heure.",
    selectTeacher: "Veuillez choisir un professeur.",
    bookingConfirmed: "Votre réservation est confirmée.",
    teacherSelected: "Vous avez sélectionné le professeur {name}",
    trialLesson: "Leçon d'essai",
    regularLesson: "Leçon régulière",
    emailConfirmation: "La confirmation de réservation a été envoyée à votre email."
  }
};

// 翻譯輔助函數
export function translate(key: keyof BookingTranslations, language: SupportedLanguage, params: Record<string, string> = {}): string {
  let text = bookingTranslations[language][key];
  
  // 替換所有參數
  Object.entries(params).forEach(([key, value]) => {
    text = text.replace(`{${key}}`, value);
  });
  
  return text;
}

// 格式化日期時間
export function formatDateTime(date: Date, language: SupportedLanguage): string {
  const format = dateTimeFormats[language];
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
  return format.template.replace('{datetime}', formattedDateTime);
}