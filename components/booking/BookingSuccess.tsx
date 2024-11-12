import React from 'react';

import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type SupportedLanguage = 'en' | 'zh' | 'ja' | 'ko' | 'es' | 'fr';
type LessonType = 'trial' | 'regular';
interface BookingSuccessProps {
  booking: {
    teacherName: string;
    lessonDateTime: string;
    lessonType: LessonType;
    classroomLink: string;
    emailSent?: boolean;
  };
  language: SupportedLanguage;
  onClose?: () => void;
  isPaymentSuccess?: boolean;
}

const bookingTranslations = {
  title: {
    en: 'Booking Confirmed!',
    zh: '預約確認！',
    ja: '予約確定！',
    ko: '예약 확정!',
    es: '¡Reserva Confirmada!',
    fr: 'Réservation Confirmée !'
  },
  subtitle: {
    en: 'Your lesson has been successfully booked',
    zh: '您的課程已成功預約',
    ja: 'レッスンの予約が完了しました',
    ko: '수업이 성공적으로 예약되었습니다',
    es: 'Su clase ha sido reservada con éxito',
    fr: 'Votre cours a été réservé avec succès'
  },
  teacher: {
    en: 'Teacher',
    zh: '老師',
    ja: '講師',
    ko: '선생님',
    es: 'Profesor',
    fr: 'Professeur'
  },
  classTime: {
    en: 'Class Time',
    zh: '上課時間',
    ja: '授業時間',
    ko: '수업 시간',
    es: 'Hora de Clase',
    fr: 'Heure du Cours'
  },
  lessonType: {
    en: 'Lesson Type',
    zh: '課程類型',
    ja: 'レッスンタイプ',
    ko: '수업 유형',
    es: 'Tipo de Clase',
    fr: 'Type de Cours'
  },
  lessonTypeText: {
    trial: {
      en: 'Trial Lesson',
      zh: '試聽課程',
      ja: '体験レッスン',
      ko: '체험 수업',
      es: 'Clase de Prueba',
      fr: 'Cours d\'Essai'
    },
    regular: {
      en: 'Regular Lesson',
      zh: '正式課程',
      ja: '通常レッスン',
      ko: '정규 수업',
      es: 'Clase Regular',
      fr: 'Cours Régulier'
    }
  },
  preparationTips: {
    en: 'Preparation Tips',
    zh: '準備事項',
    ja: '準備のヒント',
    ko: '준비 사항',
    es: 'Consejos de Preparación',
    fr: 'Conseils de Préparation'
  },
  tips: {
    en: [
      'Test your camera and microphone',
      'Find a quiet environment',
      'Join 5 minutes early',
      'Prepare any questions'
    ],
    zh: [
      '測試攝影機和麥克風',
      '找一個安靜的環境',
      '提前5分鐘進入',
      '準備好問題'
    ],
    ja: [
      'カメラとマイクをテストする',
      '静かな環境を用意する',
      '5分前に入室する',
      '質問を準備する'
    ],
    ko: [
      '카메라와 마이크 테스트',
      '조용한 환경 찾기',
      '5분 일찍 참여하기',
      '질문 준비하기'
    ],
    es: [
      'Pruebe su cámara y micrófono',
      'Encuentre un ambiente tranquilo',
      'Únase 5 minutos antes',
      'Prepare sus preguntas'
    ],
    fr: [
      'Testez votre caméra et microphone',
      'Trouvez un environnement calme',
      'Rejoignez 5 minutes en avance',
      'Préparez vos questions'
    ]
  },
  classroom: {
    en: 'Your virtual classroom link:',
    zh: '您的線上教室連結：',
    ja: 'オンライン教室のリンク：',
    ko: '온라인 교실 링크:',
    es: 'Su enlace al aula virtual:',
    fr: 'Votre lien vers la classe virtuelle :'
  },
  enterClassroom: {
    en: 'Enter Classroom',
    zh: '進入教室',
    ja: '教室に入る',
    ko: '교실 입장',
    es: 'Entrar al Aula',
    fr: 'Entrer dans la Classe'
  },
  copyLink: {
    en: 'Copy Link',
    zh: '複製連結',
    ja: 'リンクをコピー',
    ko: '링크 복사',
    es: 'Copiar Enlace',
    fr: 'Copier le Lien'
  },
  close: {
    en: 'Close',
    zh: '關閉',
    ja: '閉じる',
    ko: '닫기',
    es: 'Cerrar',
    fr: 'Fermer'
  },
  paymentSuccess: {
    en: 'Payment Successful!',
    zh: '付款成功！',
    ja: '支払い完了！',
    ko: '결제 성공!',
    es: '¡Pago Exitoso!',
    fr: 'Paiement Réussi !'
  },
  paymentComplete: {
    en: 'Your payment has been processed successfully',
    zh: '您的付款已成功處理',
    ja: 'お支払いが正常に処理されました',
    ko: '결제가 성공적으로 처리되었습니다',
    es: 'Su pago ha sido procesado exitosamente',
    fr: 'Votre paiement a été traité avec succès'
  },
  bookingConfirmed: {
    en: 'Your booking has been confirmed',
    zh: '您的預約已確認',
    ja: 'ご予約が確定しました',
    ko: '예약이 확정되었습니다',
    es: 'Su reserva ha sido confirmada',
    fr: 'Votre réservation a été confirmée'
  },
  reviewDetails: {
    en: 'Please review your booking details',
    zh: '請確認您的預約詳情',
    ja: '予約内容をご確認ください',
    ko: '예약 정보를 확인해 주세요',
    es: 'Por favor revise los detalles de su reserva',
    fr: 'Veuillez vérifier les détails de votre réservation'
  }
};

export default function BookingSuccess({ booking, language, onClose, isPaymentSuccess = false }: BookingSuccessProps) {
  console.log('Booking:', booking);
  console.log('Language:', language);
  console.log('Lesson type:', booking?.lessonType);
  const t = bookingTranslations;

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: language === 'en' // 只有英文使用 12 小時制
    };

    const locale =
      language === 'en' ? 'en-US' :
        language === 'zh' ? 'zh-TW' :
          language === 'ja' ? 'ja-JP' :
            language === 'ko' ? 'ko-KR' :
              language === 'es' ? 'es-ES' : 'fr-FR';

    try {
      return new Intl.DateTimeFormat(locale, options).format(date);
    } catch (error) {
      console.error('Date formatting error:', error);
      return date.toLocaleString();
    }
  };

  // 獲取課程類型的翻譯
  const getLessonTypeText = (type: 'trial' | 'regular'): string => {
    return bookingTranslations.lessonTypeText[type][language];
  };


  return (
    <Card className="p-6 w-full max-w-xl mx-auto bg-white">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center size-12 rounded-full bg-green-100 mb-4">
          <Check className="size-6 text-green-600" />
        </div>

        <h2 className="text-2xl font-semibold mb-2">
          {booking.lessonType === 'regular'
            ? (isPaymentSuccess
              ? bookingTranslations.paymentSuccess[language]
              : bookingTranslations.reviewDetails[language])
            : bookingTranslations.title[language]
          }
        </h2>

        <p className="text-gray-600 mb-6">
          {booking.lessonType === 'regular'
            ? bookingTranslations.paymentComplete[language]  // 正式課程只顯示付款完成訊息
            : bookingTranslations.subtitle[language]         // 試聽課程顯示一般的成功訊息
          }
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center border-b pb-2">
            <div className="text-left">
              <p className="text-sm text-gray-500">
                {bookingTranslations.teacher[language]}
              </p>
              <p className="font-medium">{booking.teacherName}</p>
            </div>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <div className="text-left">
              <p className="text-sm text-gray-500">
                {bookingTranslations.classTime[language]}
              </p>
              <p className="font-medium">
                {formatDateTime(booking.lessonDateTime)}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <div className="text-left">
              <p className="text-sm text-gray-500">
                {t.lessonType[language]}
              </p>
              <p className="font-medium">
                {booking.lessonType && t.lessonTypeText[booking.lessonType]
                  ? t.lessonTypeText[booking.lessonType][language]
                  : 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        {booking.classroomLink && (
          <div className="text-left mb-6">
            <p className="text-sm text-gray-600 mb-2">
              {bookingTranslations.classroom[language]}
            </p>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-[#F9E9E9] hover:bg-[#D4B5B5] text-pink-700"
                onClick={() => window.open(booking.classroomLink, '_blank')}
              >
                {bookingTranslations.enterClassroom[language]}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(booking.classroomLink)}
              >
                {bookingTranslations.copyLink[language]}
              </Button>
            </div>
          </div>
        )}
        {/* 新增準備事項部分 */}
      <div className="text-left mt-8">
        <h3 className="text-lg font-medium mb-4">
          {bookingTranslations.preparationTips[language]}
        </h3>
        <ul className="space-y-2">
          {bookingTranslations.tips[language].map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="size-5 text-pink-500 mt-0.5 shrink-0" />
              <span className="text-gray-600">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 可以再加入一些溫馨提醒 */}
      <div className="mt-6 p-4 bg-[#F9E9E9] rounded-lg">
        <p className="text-sm text-pink-700">
          {language === 'en' ? 'Remember to check your email for lesson confirmation and important details.' :
           language === 'zh' ? '請記得查看您的電子信箱以獲取課程確認信和重要資訊。' :
           language === 'ja' ? 'レッスン確認と重要な詳細についてメールをご確認ください。' :
           language === 'ko' ? '수업 확인 및 중요 세부 사항에 대한 이메일을 확인해 주세요.' :
           language === 'es' ? 'Recuerde revisar su correo electrónico para la confirmación de la clase y detalles importantes.' :
           'Pensez à vérifier votre email pour la confirmation du cours et les détails importants.'}
        </p>
      </div>
      </div>
    </Card>
  );
}