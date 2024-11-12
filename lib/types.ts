// types.ts
import { CoreMessage, CoreToolMessage, Message } from "ai";
import { ClassValue } from "clsx";

import { Chat } from "@/db/schema";
// 基礎類型定義
export type SupportedLanguage = 'en' | 'zh' | 'ja' | 'ko' | 'es' | 'fr';
export const DEFAULT_LANGUAGE: SupportedLanguage = 'zh';

// 預約系統相關介面
export interface TimeSlot {
  startTime: string;
  endTime: string;
  userLanguage: string;
}
export type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};
export interface Teacher {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string;
  introduction: string;
  videoUrl: string;
  teachingStyle: string;
  languages: string[];
  yearsOfExperience: number;
  hourlyRate: number;
}

// 預約相關請求和回應介面
export interface BookingResponse {
  id: string;
  teacherName: string;
  lessonDateTime: string;
  lessonType: 'trial' | 'regular';
  classroomLink: string;
  status: 'success' | 'error';
  showBookingSuccess: boolean;
  emailSent?: boolean;
  studentEmail?: string;
  studentName?: string;
}

export interface CreateBookingRequest {
  teacherId: string;
  lessonDateTime: string;
  lessonType: 'trial' | 'regular';
  teacherName:string;
}

export interface TeacherAvailabilityRequest {
  selectedDate: string;
}

export interface TeacherSelectionRequest {
  teacherId: string;
  teacherName: string;
  selectedTime: string;
}

export interface ConfirmationEmailData {
  to: string;
  bookingDetails: {
    studentName: string;
    teacherName: string;
    lessonDateTime: Date;
    lessonType: 'trial' | 'regular';
    language: SupportedLanguage;
  };
  classroomLink: string;
}

// 系統配置常量
export const BOOKING_CONFIG = {
  AVAILABLE_TIME_RANGE: ["09:00", "10:00", "11:00", "12:00", "13:00"],
  BASE_HOURLY_RATE: 500,
  RATE_INCREMENT: 100,
  BASE_EXPERIENCE_YEARS: 5,
  MAX_TEACHERS: 3
} as const;

// 統一的翻譯系統
export interface TranslationMessages {
  restartBooking: string;
  bookingConfirmed: string;
  teacherSelected: string;
  timeSelected: string;
  bookingSuccess: string;
  yearsExperience: string;
  courseFee: string;
  appointmentTime: string;
  selectTeacher: string;
  noTeachers: string;
  trialLesson: string;
  regularLesson: string;
  selectPaymentMethod: string;
  
}

export const translations: Record<SupportedLanguage, TranslationMessages> = {
  en: {
    bookingConfirmed: "Your booking is confirmed",
    teacherSelected: "Teacher selected: {name}",
    timeSelected: "Time selected: {time}",
    bookingSuccess: "Booking successful! A confirmation email has been sent to your inbox.",
    yearsExperience: "years of experience",
    courseFee: "Course fee: ${fee} NTD/hour",
    appointmentTime: "Appointment time: {time}",
    selectTeacher: "Select Teacher",
    noTeachers: "No teachers available",
    trialLesson: "Trial Lesson",
    regularLesson: "Regular Lesson",
    restartBooking: "Restart Booking",
    selectPaymentMethod:"Please select a payment method."
  },
  zh: {
    bookingConfirmed: "您的預約已確認",
    teacherSelected: "已選擇老師：{name}",
    timeSelected: "已選擇時間：{time}",
    bookingSuccess: "預約成功！確認郵件已發送至您的信箱。",
    yearsExperience: "年教學經驗",
    courseFee: "課程費用：{fee} 元/小時",
    appointmentTime: "預約時間：{time}",
    selectTeacher: "選擇老師",
    noTeachers: "目前沒有可用的老師",
    trialLesson: "體驗課",
    regularLesson: "正式課程",
    restartBooking: "重新預約",
    selectPaymentMethod:"請選擇付款方式。"
  },
  ja: {
    bookingConfirmed: "ご予約が確定しました",
    teacherSelected: "選択された講師：{name}",
    timeSelected: "選択された時間：{time}",
    bookingSuccess: "予約が完了しました！確認メールが送信されました。",
    yearsExperience: "年の指導経験",
    courseFee: "授業料：{fee}台湾ドル/時間",
    appointmentTime: "予約時間：{time}",
    selectTeacher: "講師を選択",
    noTeachers: "現在利用可能な講師がいません",
    trialLesson: "体験レッスン",
    regularLesson: "通常レッスン",
    restartBooking: "再起動予約",
    selectPaymentMethod:"お支払い方法を選択してください。"
  },
  ko: {
    bookingConfirmed: "예약이 확정되었습니다",
    teacherSelected: "선택된 선생님: {name}",
    timeSelected: "선택된 시간: {time}",
    bookingSuccess: "예약이 완료되었습니다! 확인 이메일이 발송되었습니다.",
    yearsExperience: "년 교육 경력",
    courseFee: "수업료: {fee}NT$/시간",
    appointmentTime: "예약 시간: {time}",
    selectTeacher: "선생님 선택",
    noTeachers: "현재 이용 가능한 선생님이 없습니다",
    trialLesson: "체험 수업",
    regularLesson: "정규 수업",
    restartBooking: "재시작예약",
    selectPaymentMethod:"결제 방법을 선택해 주세요."
  },
  es: {
    bookingConfirmed: "Su reserva está confirmada",
    teacherSelected: "Profesor seleccionado: {name}",
    timeSelected: "Hora seleccionada: {time}",
    bookingSuccess: "¡Reserva exitosa! Se ha enviado un correo de confirmación.",
    yearsExperience: "años de experiencia",
    courseFee: "Tarifa: {fee} NTD/hora",
    appointmentTime: "Hora de la cita: {time}",
    selectTeacher: "Seleccionar profesor",
    noTeachers: "No hay profesores disponibles",
    trialLesson: "Clase de prueba",
    regularLesson: "Clase regular",
    restartBooking: "reiniciarReserva",
    selectPaymentMethod:"Por favor, seleccione un método de pago."
  },
  fr: {
    bookingConfirmed: "Votre réservation est confirmée",
    teacherSelected: "Professeur sélectionné : {name}",
    timeSelected: "Horaire sélectionné : {time}",
    bookingSuccess: "Réservation réussie ! Un email de confirmation a été envoyé.",
    yearsExperience: "ans d'expérience",
    courseFee: "Tarif : {fee} NTD/heure",
    appointmentTime: "Heure du rendez-vous : {time}",
    selectTeacher: "Choisir le professeur",
    noTeachers: "Aucun professeur disponible",
    trialLesson: "Leçon d'essai",
    regularLesson: "Leçon régulière",
    restartBooking: "redémarrerRéservation",
    selectPaymentMethod:"Veuillez choisir un mode de paiement."
  }
};

// 翻譯輔助函數
export function getTranslation(
  language: SupportedLanguage,
  key: keyof TranslationMessages,
  params: Record<string, string | number> = {}
): string {
  let text = translations[language][key];
  
  // 替換所有參數
  Object.entries(params).forEach(([key, value]) => {
    text = text.replace(`{${key}}`, String(value));
  });
  
  return text;
}

// 語言檢測功能
export function detectLanguage(text: string): SupportedLanguage {
  if (!text) return DEFAULT_LANGUAGE;
  
  const patterns = {
    ko: /[\u3131-\u314e\u314f-\u3163\uac00-\ud7a3]/,
    zh: /[\u4e00-\u9fff]/,
    ja: /[\u3040-\u309f\u30a0-\u30ff]/,
    es: /[áéíóúüñ¿¡]/i,
    fr: /[àâçéèêëîïôûùüÿœæ]/i,
    en: /^[a-zA-Z\s\d.,!?'"()-]+$/
  };

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) {
      return lang as SupportedLanguage;
    }
  }

  return DEFAULT_LANGUAGE;
}

// 日期時間格式化配置
export const dateTimeFormats: Record<SupportedLanguage, Intl.DateTimeFormatOptions> = {
  en: { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true },
  zh: { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: false },
  ja: { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: false },
  ko: { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: false },
  es: { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: false },
  fr: { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: false }
};