"use client";

import { useState, useEffect } from "react";
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
import { Teacher } from "@/components/booking/TeacherCard";

type SupportedLanguage = 'en' | 'zh' | 'ja' | 'ko' | 'es' | 'fr';

export interface MessageProps {
  chatId: string;
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
  messages?: Array<ChatMessage>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolInvocations?: Array<ToolInvocation>;
}

interface BookingData {
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

  // 語言檢測
  const detectLanguage = (text: string): SupportedLanguage => {
    if (!text) return 'en';

    if (/^[a-zA-Z\s\d.,!?'"()-]+$/.test(text)) return 'en';
    if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';
    if (/[\uAC00-\uD7AF]/.test(text)) return 'ko';
    if (/[áéíóúüñ¿¡]/i.test(text)) return 'es';
    if (/[àâçéèêëîïôûùüÿœæ]/i.test(text)) return 'fr';

    return 'en';
  };

  // 獲取用戶語言
  const [userLanguage, setUserLanguage] = useState<SupportedLanguage>('en');

  // 在組件載入時檢測語言
  useEffect(() => {
    const firstUserMessage = messages.find(msg => msg.role === 'user')?.content || '';
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

  // 處理工具調用結果
  const renderToolResult = (toolInvocation: ToolInvocation) => {
    if (toolInvocation.state !== "result") return null;

    const { result, toolName } = toolInvocation;
    console.log('Tool invocation:', toolName, result);

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
            language={userLanguage}
          />
        );

      case "checkTeacherAvailability":
        return (
          <TeacherCard
            teachers={result}
            onSelect={(teacher) => {
              append({
                role: 'user',
                content: getTeacherSelectionMessage(teacher.name)
              });
            }}
            selectedTime={result.selectedTime}
            language={userLanguage}
          />
        );

      case "createBooking":
        if (!result) return null;

        const bookingData: BookingData = {
          teacherName: result.teacherName,
          lessonDateTime: result.lessonDateTime,
          lessonType: result.lessonType,
          classroomLink: result.classroomLink,
          emailSent: result.emailSent,
          studentEmail: result.studentEmail,
          studentName: result.studentName
        };

        const handleClose = () => {
          console.log('Booking dialog closed');
          // 這裡可以添加任何需要的關閉處理邏輯
        };

        return (
          <BookingSuccess
            booking={{
              teacherName: result.teacherName,
              lessonDateTime: result.lessonDateTime,
              lessonType: result.lessonType,
              classroomLink: result.classroomLink
            }}
            language={userLanguage}
          />
        );

      default:
        return null;
    }
  };

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