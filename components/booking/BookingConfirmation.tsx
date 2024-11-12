import { Check, Calendar, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { detectLanguage, translations, SupportedLanguage } from '@/lib/types';

interface BookingConfirmationProps {
  booking: {
    teacherName: string;
    lessonDateTime: Date;
    lessonType: 'trial' | 'regular';
    classroomLink: string;
    title?: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
  language?: SupportedLanguage;
}

interface BookingConfirmationTranslations {
  title: string;
  pleaseConfirm: string;
  teacher: string;
  time: string;
  lessonType: string;
  trial: string;
  regular: string;
  cancel: string;
  confirm: string;
}
const translation: Record<SupportedLanguage, BookingConfirmationTranslations> = {
  en: {
    title: "Booking Confirmation",
    pleaseConfirm: "Please confirm your booking details",
    teacher: "Teacher",
    time: "Time",
    lessonType: "Lesson Type",
    trial: "Trial Lesson",
    regular: "Regular Lesson",
    cancel: "Cancel",
    confirm: "Confirm"
  },
  zh: {
    title: "預約確認",
    pleaseConfirm: "請確認您的預約詳情",
    teacher: "老師",
    time: "時間",
    lessonType: "課程類型",
    trial: "體驗課",
    regular: "正式課程",
    cancel: "取消",
    confirm: "確認"
  },
  ja: {
    title: "予約確認",
    pleaseConfirm: "予約内容をご確認ください",
    teacher: "講師",
    time: "時間",
    lessonType: "レッスン種類",
    trial: "体験レッスン",
    regular: "通常レッスン",
    cancel: "キャンセル",
    confirm: "確認"
  },
  ko: {
    title: "예약 확인",
    pleaseConfirm: "예약 내용을 확인해 주세요",
    teacher: "선생님",
    time: "시간",
    lessonType: "수업 유형",
    trial: "체험 수업",
    regular: "정규 수업",
    cancel: "취소",
    confirm: "확인"
  },
  es: {
    title: "Confirmación de Reserva",
    pleaseConfirm: "Por favor, confirme los detalles de su reserva",
    teacher: "Profesor",
    time: "Hora",
    lessonType: "Tipo de Clase",
    trial: "Clase de Prueba",
    regular: "Clase Regular",
    cancel: "Cancelar",
    confirm: "Confirmar"
  },
  fr: {
    title: "Confirmation de Réservation",
    pleaseConfirm: "Veuillez confirmer les détails de votre réservation",
    teacher: "Professeur",
    time: "Horaire",
    lessonType: "Type de Cours",
    trial: "Cours d'Essai",
    regular: "Cours Régulier",
    cancel: "Annuler",
    confirm: "Confirmer"
  }
};
const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onConfirm,
  onCancel,
  language = 'en'
}) => {
  const t = translation[language];
  
  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">{t.title}</h3>
          <p className="text-gray-600">{t.pleaseConfirm}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="size-5 text-gray-500" />
            <div>
              <p className="font-medium">{t.teacher}</p>
              <p className="text-gray-600">{booking.teacherName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="size-5 text-gray-500" />
            <div>
              <p className="font-medium">{t.time}</p>
              <p className="text-gray-600">
                {booking.lessonDateTime.toLocaleString(
                  language === 'en' ? 'en-US' : 
                  language === 'zh' ? 'zh-TW' : 
                  language === 'ja' ? 'ja-JP' : 
                  language === 'ko' ? 'ko-KR' : 
                  language === 'es' ? 'es-ES' : 'fr-FR'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Check className="size-5 text-gray-500" />
            <div>
              <p className="font-medium">{t.lessonType}</p>
              <p className="text-gray-600">
                {booking.lessonType === 'trial' ? 
                  t.trial : t.regular}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end mt-6">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            {t.cancel}
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            className="bg-green-500 hover:bg-green-600"
          >
            {t.confirm}
          </Button>
        </div>
        </div>
    </Card>
  );
};

export default BookingConfirmation;