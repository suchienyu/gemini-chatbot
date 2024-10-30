import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Calendar, User } from 'lucide-react';
import { detectLanguage, translations, SupportedLanguage } from '@/lib/types';

interface BookingConfirmationProps {
  booking: {
    teacherName: string;
    lessonDateTime: Date;
    lessonType: 'trial' | 'regular';
    classroomLink: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
  language?: SupportedLanguage;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onConfirm,
  onCancel,
  language = 'en'
}) => {
  const t = translations.bookingConfirmation;
  
  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">{t.title[language]}</h3>
          <p className="text-gray-600">{t.pleaseConfirm[language]}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">{t.teacher[language]}</p>
              <p className="text-gray-600">{booking.teacherName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">{t.time[language]}</p>
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
            <Check className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">{t.lessonType[language]}</p>
              <p className="text-gray-600">
                {booking.lessonType === 'trial' ? 
                  t.trial[language] : t.regular[language]}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end mt-6">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            {t.cancel[language]}
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            className="bg-green-500 hover:bg-green-600"
          >
            {t.confirm[language]}
          </Button>
        </div>
        </div>
    </Card>
  );
};

export default BookingConfirmation;