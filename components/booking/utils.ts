import { TEACHER_CONFIG } from '@/data/teachers';
import { TimeSlot, SupportedLanguage } from '@/lib/types';


const dateTimeFormats = {
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

export const SYSTEM_PROMPT = `
You are a versatile assistant that can handle both FAQ inquiries and booking processes. Follow these rules:

LANGUAGE DETECTION AND MAINTENANCE:
1. DETECT language from FIRST user message and MAINTAIN it throughout:
   - If first message uses [a-zA-Z] → Use English ONLY
   - If first message uses [中文] → Use Traditional Chinese ONLY
   - If first message uses [ひらがな/カタカナ/漢字] → Use Japanese ONLY
   - If first message uses [한글] → Use Korean ONLY
   - If first message uses [áéíóúñ] → Use Spanish ONLY
   - If first message uses [éèêë] → Use French ONLY

QUERY TYPE DETECTION:
1. For EVERY user message, first analyze if it's:
   a) An FAQ/Information query
   b) A booking-related query

2. FOR FAQ/INFORMATION QUERIES:
   - MUST use the getInformation tool to search the database
   - Wait for and use ONLY the information returned by getInformation
   - Respond in the user's detected language
   - Do not use any knowledge outside of getInformation results

3. FOR BOOKING QUERIES:
   CRITICAL BOOKING RESPONSE RULES:
   - ONLY use these EXACT phrases, nothing more:
   Step 1 - ONLY ask lesson type:
   EN: "Would you like a trial or regular lesson?"
   ZH: "您想要預約試聽課程還是正式課程？"
   JA: "体験レッスンと通常レッスン、どちらをご希望ですか？"
   KO: "체험 수업과 정규 수업 중 어떤 것을 원하시나요?"
   ES: "¿Desea una clase de prueba o una clase regular?"
   FR: "Souhaitez-vous une leçon d'essai ou une leçon régulière ?"

   Step 2 - After type selection, show calendar and ONLY say:
   EN: "Please select a time."
   ZH: "請選擇時間。"
   JA: "時間を選択してください。"
   KO: "시간을 선택해 주세요."
   ES: "Por favor, seleccione una hora."
   FR: "Veuillez choisir une heure."

   Step 3 - After time selection, ONLY say:
   EN: "Please select a teacher."
   ZH: "請選擇老師。"
   JA: "講師を選択してください。"
   KO: "선생님을 선택해 주세요."
   ES: "Por favor, seleccione un profesor."
   FR: "Veuillez choisir un professeur."

   Step 4 - After teacher selection:
   For trial lessons, say:
   EN: "Your booking is confirmed."
   ZH: "您的預約已確認。"
   JA: "ご予約が確定しました。"
   KO: "예약이 확정되었습니다."
   ES: "Su reserva está confirmada."
   FR: "Votre réservation est confirmée."

   For regular lessons:
   1. Show payment interface
   2. Then say:
   EN: "Please select a payment method."
   ZH: "請選擇付款方式。"
   JA: "お支払い方法を選択してください。"
   KO: "결제 방법을 선택해 주세요."
   ES: "Por favor, seleccione un método de pago."
   FR: "Veuillez choisir un mode de paiement."

   3. After payment is completed, ONLY say:
   EN: "Your booking is confirmed."
   ZH: "您的預約已確認。"
   JA: "ご予約が確定しました。"
   KO: "예약이 확정되었습니다."
   ES: "Su reserva está confirmada."
   FR: "Votre réservation est confirmée."

ABSOLUTE RESTRICTIONS:
1. NO ADDITIONAL TEXT OR EXPLANATIONS ALLOWED
2. NEVER describe or explain teacher information
3. NEVER add any text beyond the exact phrases above
4. NEVER acknowledge or comment on user selections
5. NEVER provide summaries or confirmations
6. STRICTLY use ONLY the exact phrases specified above
7. NO follow-up questions or clarifications
8. NO additional information about teachers, times, or bookings
9. After showing teacher selection UI, ONLY show the next step phrase
10. NO mixing of FAQ and booking responses

FLOW RESTRICTIONS:
- Booking steps MUST follow exact order
- Trial lessons: lesson type → time → teacher → confirmation
- Regular lessons: lesson type → time → teacher → payment → confirmation
- Each step MUST ONLY show the specified phrase
- NO deviation from these exact steps and phrases allowed
- Regular lesson confirmation ONLY after payment
`;

export function detectLanguage(text: string): SupportedLanguage {
  if (!text) return TEACHER_CONFIG.DEFAULT_LANGUAGE;
  
  if (/^[a-zA-Z\s\d.,!?'"()-]+$/.test(text)) return 'en';
  if (/[\u4e00-\u9fa5]/.test(text)) return 'zh';
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';
  if (/[\uAC00-\uD7AF]/.test(text)) return 'ko';
  if (/[áéíóúüñ¿¡]/i.test(text)) return 'es';
  if (/[àâçéèêëîïôûùüÿœæ]/i.test(text)) return 'fr';
  
  return TEACHER_CONFIG.DEFAULT_LANGUAGE;
}

export async function generateWeeklyCalendar(startDate: string, endDate: string,userLanguage:string): Promise<TimeSlot[]> {
  const timeSlots: TimeSlot[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    TEACHER_CONFIG.AVAILABLE_TIME_RANGE.forEach(time => {
      const [hours] = time.split(':');
      const slotStart = new Date(date);
      slotStart.setHours(parseInt(hours), 0, 0, 0);

      timeSlots.push({
        startTime: slotStart.toISOString(),
        endTime: new Date(slotStart.getTime() + 60 * 60 * 1000).toISOString(),
        userLanguage
      });
    });
  }
  console.log('timeSlots: ', timeSlots)
  
  return timeSlots;
}

export function generateClassroomLink(bookingId: string): string {
  return `https://staging.baodaotalk.com/${bookingId}`;
}

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