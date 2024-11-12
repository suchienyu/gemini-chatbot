import { useState } from 'react';

import { ChevronLeft, ChevronRight, Video, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';


type SupportedLanguage = 'en' | 'zh' | 'ja' | 'ko' | 'es' | 'fr';

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
  requirePayment?: boolean;
}

interface TeacherCardProps {
  teachers: Teacher[];
  onSelect: (teacher: Teacher) => void;
  selectedTime?: Date;
  language: SupportedLanguage;
  lessonType: 'trial' | 'regular';
}

// 擴展翻譯內容
const translations = {
  yearsExperience: {
    en: 'years of experience',
    zh: '年教學經驗',
    ja: '年の指導経験',
    ko: '년 교육 경력',
    es: 'años de experiencia',
    fr: 'ans d\'expérience'
  },
  courseFee: {
    en: 'Course fee: NT$ {amount}/hour',
    zh: '課程費用：NT$ {amount}/小時',
    ja: '授業料：NT$ {amount}/時間',
    ko: '수업료: NT$ {amount}/시간',
    es: 'Tarifa: NT$ {amount}/hora',
    fr: 'Tarif : NT$ {amount}/heure'
  },
  teachingStyle: {
    en: 'Teaching Style',
    zh: '教學風格',
    ja: '指導スタイル',
    ko: '교육 스타일',
    es: 'Estilo de enseñanza',
    fr: 'Style d\'enseignement'
  },
  watchVideo: {
    en: 'Watch Introduction Video',
    zh: '觀看介紹影片',
    ja: '紹介動画を見る',
    ko: '소개 영상 보기',
    es: 'Ver video de introducción',
    fr: 'Voir la vidéo d\'introduction'
  },
  emailTeacher: {
    en: 'Email Teacher',
    zh: '寄信給老師',
    ja: '講師にメール',
    ko: '선생님께 이메일',
    es: 'Enviar correo al profesor',
    fr: 'Envoyer un email au professeur'
  },
  languages: {
    en: 'Languages',
    zh: '授課語言',
    ja: '指導言語',
    ko: '교육 언어',
    es: 'Idiomas',
    fr: 'Langues'
  },
  selectTeacher: {
    en: 'Select Teacher',
    zh: '選擇老師',
    ja: '講師を選択',
    ko: '선생님 선택',
    es: 'Seleccionar profesor',
    fr: 'Choisir le professeur'
  },
  appointmentTime: {
    en: 'Appointment time: {time}',
    zh: '預約時間：{time}',
    ja: '予約時間：{time}',
    ko: '예약 시간: {time}',
    es: 'Hora de la cita: {time}',
    fr: 'Heure du rendez-vous : {time}'
  },
  noTeachers: {
    en: 'No teachers available',
    zh: '目前沒有可用的老師',
    ja: '現在利用可能な講師がいません',
    ko: '현재 이용 가능한 선생님이 없습니다',
    es: 'No hay profesores disponibles',
    fr: 'Aucun professeur disponible'
  },
  introduction: {
    en: 'Introduction',
    zh: '自我介紹',
    ja: '自己紹介',
    ko: '자기소개',
    es: 'Introducción',
    fr: 'Introduction'
  },
  selectPaymentMethod: {
    en: "Please select a payment method.",
    zh: "請選擇付款方式。",
    ja: "お支払い方法を選択してください。",
    ko: "결제 방법을 선택해 주세요.",
    es: "Por favor, seleccione un método de pago.",
    fr: "Veuillez choisir un mode de paiement."
  }
} as const;

// 語言名稱對照表
const languageNames = {
  en: { English: 'English', Spanish: 'Spanish', French: 'French', Chinese: 'Chinese', Japanese: 'Japanese', Korean: 'Korean' },
  zh: { English: '英語', Spanish: '西班牙語', French: '法語', Chinese: '中文', Japanese: '日語', Korean: '韓語' },
  ja: { English: '英語', Spanish: 'スペイン語', French: 'フランス語', Chinese: '中国語', Japanese: '日本語', Korean: '韓国語' },
  ko: { English: '영어', Spanish: '스페인어', French: '프랑스어', Chinese: '중국어', Japanese: '일본어', Korean: '한국어' },
  es: { English: 'Inglés', Spanish: 'Español', French: 'Francés', Chinese: 'Chino', Japanese: 'Japonés', Korean: 'Coreano' },
  fr: { English: 'Anglais', Spanish: 'Espagnol', French: 'Français', Chinese: 'Chinois', Japanese: 'Japonais', Korean: 'Coréen' }
};

export default function TeacherCard({ 
  teachers, 
  selectedTime, 
  onSelect,
  language,
  lessonType 
}: TeacherCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!teachers || teachers.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p>{translations.noTeachers[language]}</p>
      </Card>
    );
  }

  const handleTeacherSelect = () => {
    if (lessonType === 'trial') {
      // 試聽課程直接觸發選擇
      onSelect(currentTeacher);
    } else {
      // 正式課程先顯示付款資訊
      onSelect({
        ...currentTeacher,
        requirePayment: true  // 添加標記表示需要付款
      });
    }
  };

  const currentTeacher = teachers[currentIndex];

  // 格式化金額
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(
      language === 'en' ? 'en-US' : 
      language === 'zh' ? 'zh-TW' :
      language === 'ja' ? 'ja-JP' :
      language === 'ko' ? 'ko-KR' :
      language === 'es' ? 'es-ES' : 'fr-FR'
    ).format(amount);
  };

  // 翻譯語言名稱
  const translateLanguage = (lang: string) => {
    return languageNames[language][lang as keyof typeof languageNames.en] || lang;
  };

  // 處理導航
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % teachers.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + teachers.length) % teachers.length);
  };

  // 格式化日期時間
  const formatDateTime = (date: Date) => {
    return date.toLocaleString(
      language === 'en' ? 'en-US' : 
      language === 'zh' ? 'zh-TW' :
      language === 'ja' ? 'ja-JP' :
      language === 'ko' ? 'ko-KR' :
      language === 'es' ? 'es-ES' : 'fr-FR'
    );
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <Card className="p-6 overflow-hidden">
        <div className="absolute top-2 right-2 text-sm text-gray-500">
          {currentIndex + 1} / {teachers.length}
        </div>

        <div className="h-[500px] overflow-y-auto mb-12">
          <div className="space-y-4">
            {/* 教師照片 */}
            <div className="relative w-full h-48">
              <img
                src={currentTeacher.profileImageUrl}
                alt={currentTeacher.name}
                className="size-full object-cover rounded-lg"
              />
            </div>
            
            {/* 基本資訊 */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold">{currentTeacher.name}</h3>
              
              {/* 教學經驗 */}
              <p className="text-sm text-gray-600">
                {currentTeacher.yearsOfExperience} {translations.yearsExperience[language]}
              </p>

              {/* 教學風格 */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  {translations.teachingStyle[language]}
                </h4>
                <p className="text-sm text-gray-600">{currentTeacher.teachingStyle}</p>
              </div>

              {/* 自我介紹 */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  {translations.introduction[language]}
                </h4>
                <p className="text-sm text-gray-600">{currentTeacher.introduction}</p>
              </div>

              {/* 授課語言 */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  {translations.languages[language]}
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {currentTeacher.languages.map((lang) => (
                    <span key={lang} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {translateLanguage(lang)}
                    </span>
                  ))}
                </div>
              </div>

              {/* 課程費用 */}
              <p className="text-sm text-gray-600">
                {translations.courseFee[language].replace(
                  '{amount}',
                  formatCurrency(currentTeacher.hourlyRate)
                )}
              </p>

              {/* 預約時間 */}
              {selectedTime && (
                <p className="text-sm text-gray-600">
                  {translations.appointmentTime[language].replace(
                    '{time}',
                    formatDateTime(selectedTime)
                  )}
                </p>
              )}

              {/* 影片和郵件連結 */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => window.open(currentTeacher.videoUrl, '_blank')}
                >
                  <Video className="size-4" />
                  {translations.watchVideo[language]}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => window.open(`mailto:${currentTeacher.email}`)}
                >
                  <Mail className="size-4" />
                  {translations.emailTeacher[language]}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 導航和選擇按鈕 */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            className="rounded-full bg-white shadow-lg hover:bg-gray-50"
          >
            <ChevronLeft className="size-6" />
          </Button>

          <Button
            onClick={handleTeacherSelect}
            //onClick={() => onSelect(currentTeacher)}
            className="bg-[#C69B9B] text-white hover:bg-[#D4B5B5] px-6 rounded-full"
          >
            {translations.selectTeacher[language]}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="rounded-full bg-white shadow-lg hover:bg-gray-50"
          >
            <ChevronRight className="size-6" />
          </Button>
        </div>
      </Card>
    </div>
  );
}