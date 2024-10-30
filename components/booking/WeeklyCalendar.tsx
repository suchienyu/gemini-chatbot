import { useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { Locale,enUS, zhTW,ja, ko, es, fr } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SupportedLanguage } from '@/lib/types';

interface WeeklyCalendarProps {
  availableSlots: Array<{
    startTime: string;
    endTime: string;
  }>;
  onSelectTime: (date: Date) => void;
  language: SupportedLanguage;
}

const locales: Record<SupportedLanguage, Locale> = {
  en: enUS,
  zh: zhTW,
  ja: ja,
  ko: ko,
  es: es,
  fr: fr
};

const translations = {
  available: {
    en: 'Available',
    zh: '可預約',
    ja: '予約可能',
    ko: '예약 가능',
    es: 'Disponible',
    fr: 'Disponible'
  },
  unavailable: {
    en: 'Unavailable',
    zh: '未開放',
    ja: '予約不可',
    ko: '예약 불가',
    es: 'No disponible',
    fr: 'Indisponible'
  }
};

const WeeklyCalendar = ({ availableSlots = [], onSelectTime, language }: WeeklyCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const currentLocale = locales[language] || locales.en;
  const dateFormat = language === 'zh' || language === 'ja' || language === 'ko'
    ? 'MM月dd日'
    : 'MM/dd';
  // 可预订时间段
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00",
  ];

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // 判断时段是否可用
  const isSlotAvailable = (day: Date, time: string) => {
    const today = new Date();
    // 过滤掉过去的日期
    if (day < today) return false;

    // 未来的所有时段都可用
    return true;
  };

  return (
    <Card className="max-w-5xl mx-auto rounded-xl bg-white shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div 
          onClick={() => setCurrentWeek(prev => addDays(prev, -7))}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800">
          {format(weekStart, dateFormat, { locale: currentLocale })} - {
            format(addDays(weekStart, 6), dateFormat, { locale: currentLocale })
          }
        </h3>
        
        <div 
          onClick={() => setCurrentWeek(prev => addDays(prev, 7))}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </div>
      </div>

      <div className="grid grid-cols-8 gap-3 bg-gray-50 rounded-xl p-4">
        {/* 时间列 */}
        <div className="sticky left-2">
          <div className="h-14 mb-4"></div>
          {timeSlots.map(time => (
            <div key={time} className="h-12 flex items-center justify-end pr-2 text-gray-600 font-medium">
              {time}
            </div>
          ))}
        </div>

        {/* 日期和时段 */}
        {days.map(day => (
          <div key={day.toISOString()} className="flex flex-col">
            <div className="h-12 mb-2 flex flex-col items-center justify-center">
              <div className="text-sm text-gray-400">
              {format(day, 'EEE', { locale: currentLocale })}
              </div>
              <div className="text-lg font-semibold text-gray-800">
              {format(day, 'dd', { locale: currentLocale })}
              </div>
            </div>
            
            {timeSlots.map(time => {
              const isAvailable = isSlotAvailable(day, time);
              return (
                <button 
                  key={`${day.toISOString()}-${time}`}
                  onClick={() => {
                    if (isAvailable) {
                      const selectedTime = new Date(day);
                      selectedTime.setHours(parseInt(time.split(':')[0]), 0, 0);
                      onSelectTime(selectedTime);
                    }
                  }}
                  className={`
                    h-12 w-11 mb-2 rounded-lg flex items-center justify-center
                    text-sm font-medium transition-all duration-200
                    ${isAvailable 
                      ? 'bg-[#F2E5E4] text-[#B48A84] hover:bg-[#E3D1D1]' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                  `}
                  disabled={!isAvailable} // 禁用不可用的按钮
                >
                  {isAvailable 
                    ? (language === 'en' ? "✔︎" : "✔︎")
                    : "－"}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WeeklyCalendar;
