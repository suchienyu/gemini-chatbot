import { SupportedLanguage } from '@/lib/types';

// 定義消息模板的類型
type MessageTemplate = Record<SupportedLanguage, string>;

interface BookingMessages {
  timeSelected: string;
  teacherSelected: string;
  bookingConfirmed: string;
  selectTime: string;
  selectTeacher: string;
  bookingSuccess: string;
}


export const bookingMessages: Record<SupportedLanguage, BookingMessages> = {
  en: {
    timeSelected: "Time selected: {time}",
    teacherSelected: "Teacher selected: {teacher}",
    bookingConfirmed: "Your booking is confirmed",
    selectTime: "Please select a time",
    selectTeacher: "Please select a teacher",
    bookingSuccess: "Booking successful! A confirmation email has been sent to your inbox."
  },
  zh: {
    timeSelected: "已選擇時間：{time}",
    teacherSelected: "已選擇老師：{teacher}",
    bookingConfirmed: "您的預約已確認",
    selectTime: "請選擇時間",
    selectTeacher: "請選擇老師",
    bookingSuccess: "預約成功！確認郵件已發送至您的信箱。"
  },
  ja: {
    timeSelected: "選択された時間：{time}",
    teacherSelected: "選択された講師：{teacher}",
    bookingConfirmed: "ご予約が確定しました",
    selectTime: "時間を選択してください",
    selectTeacher: "講師を選択してください",
    bookingSuccess: "予約が完了しました！確認メールが送信されました。"
  },
  ko: {
    timeSelected: "선택된 시간: {time}",
    teacherSelected: "선택된 선생님: {teacher}",
    bookingConfirmed: "예약이 확정되었습니다",
    selectTime: "시간을 선택해 주세요",
    selectTeacher: "선생님을 선택해 주세요",
    bookingSuccess: "예약이 완료되었습니다! 확인 이메일이 발송되었습니다."
  },
  es: {
    timeSelected: "Hora seleccionada: {time}",
    teacherSelected: "Profesor seleccionado: {teacher}",
    bookingConfirmed: "Su reserva está confirmada",
    selectTime: "Por favor, seleccione una hora",
    selectTeacher: "Por favor, seleccione un profesor",
    bookingSuccess: "¡Reserva exitosa! Se ha enviado un correo de confirmación."
  },
  fr: {
    timeSelected: "Horaire sélectionné : {time}",
    teacherSelected: "Professeur sélectionné : {teacher}",
    bookingConfirmed: "Votre réservation est confirmée",
    selectTime: "Veuillez choisir une heure",
    selectTeacher: "Veuillez choisir un professeur",
    bookingSuccess: "Réservation réussie ! Un email de confirmation a été envoyé."
  }
};

export function getBookingMessage(key: keyof BookingMessages, language: SupportedLanguage, params?: Record<string, string>): string {
  let message = bookingMessages[language][key];
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, value);
    });
  }
  return message;
}