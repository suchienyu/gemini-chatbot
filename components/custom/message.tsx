"use client";

import { useState, useEffect, SetStateAction, useCallback } from "react";
import { useChat } from "ai/react";
import { Attachment, ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { BotIcon, UserIcon } from "./icons";
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
import WeeklyCalendar from "@/components/booking/WeeklyCalendar";
import TeacherCard from "@/components/booking/TeacherCard";
import BookingSuccess from "@/components/booking/BookingSuccess";
import PaymentFlow from "@/components/booking/Payment"
import { BookingResponse, translations } from "@/lib/types";
import { generateUUID } from "@/lib/utils";
type SupportedLanguage = 'en' | 'zh' | 'ja' | 'ko' | 'es' | 'fr';

export interface MessageProps {
  chatId: string;
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
  // messages?: Array<ChatMessage>;
  messages?: any;

}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolInvocations?: Array<ToolInvocation>;
}

interface BookingData {
  id: string;
  teacherName: string;
  lessonDateTime: string;
  lessonType: 'trial' | 'regular';
  classroomLink: string;
  emailSent?: boolean;
  studentEmail?: string;
  studentName?: string;
  language?: SupportedLanguage;
}

export function Message({
  chatId,
  role,
  content,
  toolInvocations,
  attachments,
  messages = []
}: MessageProps) {
  const { append } = useChat({
    id: chatId,
    body: { id: chatId },
    maxSteps: 5,
  });

  const [userLanguage, setUserLanguage] = useState<SupportedLanguage>('en');
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [paymentProcessed, setPaymentProcessed] = useState<boolean>(false);
  const [processedBookingId, setProcessedBookingId] = useState<string | null>(null);

  // 語言檢測
  const detectLanguage = useCallback((text: string): SupportedLanguage => {
    if (!text) return 'en';
    if (/^[a-zA-Z\s\d.,!?'"()-]+$/.test(text)) return 'en';
    if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';
    if (/[\uAC00-\uD7AF]/.test(text)) return 'ko';
    if (/[áéíóúüñ¿¡]/i.test(text)) return 'es';
    if (/[àâçéèêëîïôûùüÿœæ]/i.test(text)) return 'fr';
    return 'en';
  }, []);
  console.log('in Message component ', messages)
  // 獲取用戶語言


  // 在組件載入時檢測語言
  useEffect(() => {
    console.log('~~~messages: ', messages)
    const firstUserMessage = messages.find((msg: { role: string; }) => msg.role === 'user')?.content || '';
    console.log('~~~firstUserMessage: ', firstUserMessage)

    const detectedLanguage = detectLanguage(firstUserMessage);
    console.log('Detected language:', detectedLanguage);
    setUserLanguage(detectedLanguage);
  }, [messages]);


  // 格式化日期時間
  const formatDateTime = (date: Date): string => {
    const locale =
      userLanguage === 'en' ? 'en-US' :
        userLanguage === 'zh' ? 'zh-TW' :
          userLanguage === 'ja' ? 'ja-JP' :
            userLanguage === 'ko' ? 'ko-KR' :
              userLanguage === 'es' ? 'es-ES' : 'fr-FR';

    return date.toLocaleString(locale);
  };

  // 處理時間選擇訊息
  const getTimeSelectionMessage = (time: Date): string => {
    const messages = {
      en: `I would like to select ${formatDateTime(time)}`,
      zh: `我想選擇 ${formatDateTime(time)}`,
      ja: `${formatDateTime(time)} を選択します`,
      ko: `${formatDateTime(time)}를 선택합니다`,
      es: `Me gustaría seleccionar ${formatDateTime(time)}`,
      fr: `Je voudrais sélectionner ${formatDateTime(time)}`
    };
    return messages[userLanguage];
  };

  // 處理教師選擇訊息
  const getTeacherSelectionMessage = (teacherName: string): string => {
    const messages = {
      en: `I would like to select teacher ${teacherName}`,
      zh: `我要選擇 ${teacherName} 老師`,
      ja: `${teacherName} 先生を選択します`,
      ko: `${teacherName} 선생님을 선택합니다`,
      es: `Me gustaría seleccionar al profesor ${teacherName}`,
      fr: `Je voudrais sélectionner le professeur ${teacherName}`
    };
    return messages[userLanguage];
  };

  const handlePaymentSuccess = useCallback((bookingData: BookingResponse) => {
    console.log('Payment success handler:', bookingData.id);
    
    setPaymentProcessed(true);
    setProcessedBookingId(bookingData.id);
    
    append({
      role: 'assistant',
      content: translations[userLanguage].bookingConfirmed
    });
  }, [userLanguage, append]);

  const createBookingResponse = useCallback((result: any, bookingId: string): BookingResponse => {
    const isTrialLesson = result.lessonType === 'trial';
    const isRegularAndPaid = result.lessonType === 'regular' && 
                            bookingId === processedBookingId && 
                            paymentProcessed;
  
    return {
      id: bookingId,
      teacherName: result.teacherName,
      lessonDateTime: result.lessonDateTime,
      lessonType: result.lessonType,
      classroomLink: result.classroomLink,
      status: 'success',
      emailSent: isTrialLesson || isRegularAndPaid,
      studentEmail: result.studentEmail,
      studentName: result.studentName,
      showBookingSuccess: isTrialLesson || isRegularAndPaid  // 加回這個屬性
    };
  }, [processedBookingId, paymentProcessed]);

  useEffect(() => {
    if (!toolInvocations) return;

    const createBookingTool = toolInvocations.find(
      tool => tool.state === "result" && tool.toolName === "createBooking"
    );

    if (createBookingTool?.state === "result" && createBookingTool.result) {
      const bookingId = createBookingTool.result.id || generateUUID();
      if (currentBookingId !== bookingId) {
        setCurrentBookingId(bookingId);
      }
    }
  }, [toolInvocations, currentBookingId]);
  // 處理工具調用結果
  const renderToolResult = useCallback((toolInvocation: ToolInvocation) => {
    if (toolInvocation.state !== "result") return null;

    const { result, toolName } = toolInvocation;
    console.log('Tool invocation:', toolName, result);
    console.log('result: ', result)
    switch (toolName) {
      case "generateCalendar":
        return (
          <WeeklyCalendar
            availableSlots={result}
            onSelectTime={(time) => {
              append({
                role: 'user',
                content: getTimeSelectionMessage(time)
              });
            }}
            language={result[0].userLanguage}
          />
        );

      case "checkTeacherAvailability":
        return (
          <TeacherCard
            teachers={result}
            onSelect={(teacher) => {
              // 只發送選擇老師的訊息
              append({
                role: 'user',
                content: getTeacherSelectionMessage(teacher.name),
              });
            }}
            selectedTime={result.selectedTime}
            language={userLanguage}
            lessonType={result.lessonType}
          />
        );

        case "createBooking": {
          if (!result) return null;
        
          const bookingId = result.id || generateUUID();
          const bookingData = createBookingResponse(result, bookingId);
        
          console.log('Booking Debug:', {
            bookingId,
            currentBookingId,
            processedBookingId,
            paymentProcessed,
            lessonType: bookingData.lessonType
          });
        
          // 試聽課程
          if (bookingData.lessonType === 'trial') {
            return (
              <BookingSuccess
                booking={bookingData}  // 不需要額外修改 booking 物件
                language={userLanguage}
                isPaymentSuccess={false}
              />
            );
          }
        
          // 正式課程
          if (bookingData.lessonType === 'regular') {
            // 檢查是否已付款
            if (paymentProcessed) {
              console.log('Payment processed, showing success page');
              const successBookingData = {
                ...bookingData,
                emailSent: true,
                showBookingSuccess: true
              };
              
              return (
                <BookingSuccess
                  booking={successBookingData}
                  language={userLanguage}
                  isPaymentSuccess={true}
                />
              );
            }
        
            // 未付款，顯示付款流程
            console.log('Showing payment flow');
            return (
              <PaymentFlow
                bookingDetails={bookingData}
                language={userLanguage}
                onPaymentComplete={() => {
                  console.log('Payment completing for:', bookingId);
                  handlePaymentSuccess(bookingData);
                }}
                onBack={() => {
                  setCurrentBookingId(null);
                  setPaymentProcessed(false);
                  append({
                    role: 'user',
                    content: translations[userLanguage].restartBooking
                  });
                }}
              />
            );
          }
        
          return null;
        }
  
        default:
          return null;
    }
  }, [
    userLanguage,
    currentBookingId,
    processedBookingId,
    paymentProcessed,
    append,
    getTimeSelectionMessage,
    getTeacherSelectionMessage,
    handlePaymentSuccess,
    createBookingResponse
  ]);
  return (
    <motion.div
      className="flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] border rounded-sm p-1 flex flex-col justify-center items-center shrink-0 text-zinc-500">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-2 w-full">
        {content && typeof content === "string" && (
          <div className="text-zinc-800 dark:text-zinc-300">
            <Markdown>{content}</Markdown>
          </div>
        )}

        {toolInvocations && (
          <div className="flex flex-col gap-4">
            {toolInvocations.map((toolInvocation) => (
              <div key={toolInvocation.toolCallId}>
                {renderToolResult(toolInvocation)}
              </div>
            ))}
          </div>
        )}

        {attachments?.map((attachment) => (
          <PreviewAttachment key={attachment.url} attachment={attachment} />
        ))}
      </div>
    </motion.div>
  );
}
export default Message;