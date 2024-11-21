"use client";
import { ReactNode, useCallback, useEffect, useState } from "react";

import { Attachment, ToolInvocation } from "ai";
import { useChat } from "ai/react";
import { motion } from "framer-motion";

import BookingSuccess from "@/components/booking/BookingSuccess";
import PaymentFlow from "@/components/booking/Payment";
import TeacherCard from "@/components/booking/TeacherCard";
import WeeklyCalendar from "@/components/booking/WeeklyCalendar";
import { BookingResponse, translations } from "@/lib/types";
import { generateUUID } from "@/lib/utils";

import { BotIcon, UserIcon } from "./icons";
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";

type SupportedLanguage = 'en' | 'zh' | 'ja' | 'ko' | 'es' | 'fr';

export interface MessageProps {
  chatId: string;
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
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

  const processMarkdownContent = (content: string) => {
    console.log("Original content:", content);

    if (typeof content !== 'string') {
      console.log("Content is not a string:", content);
      return content;
    }

    if (content.includes('tool-result') || content.includes('getInformation')) {
      try {
        const parsed = JSON.parse(content);
        if (parsed.result) {
          content = parsed.result;
        }
      } catch (e) {
        // 如果不是 JSON，使用原始內容
      }
    }
  
    // 清理內容
    let cleanContent = content
      .replace(/^['"]|['"]$/g, '') // 移除首尾的引號
      .replace(/\\n/g, '\n')       // 處理換行符
      .replace(/\n\s*\+\s*\n/g, '\n') // 移除行間的 + 號
      .trim();
  
    console.log("After initial cleaning:", cleanContent);
  
    // 正確處理圖片標記
    const lines = cleanContent.split('\n');
    const processedLines = lines.map(line => {
      line = line.trim();
      // 特別處理圖片標記
      if (line.includes('![') && line.includes('](') && line.includes(')')) {
        return line; // 保持圖片標記的原始格式
      }
      return line;
    }).filter(Boolean);
  
    cleanContent = processedLines.join('\n\n');
    console.log("Final processed content:", cleanContent);
    return cleanContent;
  };

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'IMG') {
      if (!target.classList.contains('expanded')) {
        const overlay = document.createElement('div');
        overlay.className = 'image-overlay';
        document.body.appendChild(overlay);

        const clonedImg = target.cloneNode(true) as HTMLElement;
        clonedImg.classList.add('expanded');
        overlay.appendChild(clonedImg);

        overlay.onclick = () => {
          overlay.remove();
        };
      } else {
        const overlay = target.closest('.image-overlay');
        if (overlay) {
          overlay.remove();
        }
      }
    }
  };

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

  useEffect(() => {
    const firstUserMessage = messages.find((msg: { role: string; }) => msg.role === 'user')?.content || '';
    const detectedLanguage = detectLanguage(firstUserMessage);
    setUserLanguage(detectedLanguage);
  }, [messages, detectLanguage]);

  const formatDateTime = useCallback((date: Date): string => {
    const locales = {
      en: 'en-US',
      zh: 'zh-TW',
      ja: 'ja-JP',
      ko: 'ko-KR',
      es: 'es-ES',
      fr: 'fr-FR'
    } as const;

    return date.toLocaleString(locales[userLanguage]);
  }, [userLanguage]);

  const getTimeSelectionMessage = useCallback((time: Date): string => {
    const messages = {
      en: `I would like to select ${time}`,
      zh: `我想選擇 ${time}`,
      ja: `${time} を選択します`,
      ko: `${time}를 선택합니다`,
      es: `Me gustaría seleccionar ${time}`,
      fr: `Je voudrais sélectionner ${time}`
    };
    return messages[userLanguage];
  }, [userLanguage]);

  const getTeacherSelectionMessage = useCallback((teacherName: string): string => {
    const messages = {
      en: `I would like to select teacher ${teacherName}`,
      zh: `我要選擇 ${teacherName} 老師`,
      ja: `${teacherName} 先生を選択します`,
      ko: `${teacherName} 선생님을 선택합니다`,
      es: `Me gustaría seleccionar al profesor ${teacherName}`,
      fr: `Je voudrais sélectionner le professeur ${teacherName}`
    };
    return messages[userLanguage];
  }, [userLanguage]);

  const handlePaymentSuccess = useCallback((bookingData: BookingResponse) => {
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
      showBookingSuccess: isTrialLesson || isRegularAndPaid
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

  const renderToolResult = useCallback((toolInvocation: ToolInvocation) => {
    if (toolInvocation.state !== "result") return null;

    const { result, toolName } = toolInvocation;

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

        if (bookingData.lessonType === 'trial') {
          return (
            <BookingSuccess
              booking={bookingData}
              language={userLanguage}
              isPaymentSuccess={false}
            />
          );
        }

        if (bookingData.lessonType === 'regular') {
          if (paymentProcessed) {
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

          return (
            <PaymentFlow
              bookingDetails={bookingData}
              language={userLanguage}
              onPaymentComplete={() => {
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
    append,
    getTimeSelectionMessage,
    getTeacherSelectionMessage,
    createBookingResponse,
    handlePaymentSuccess,
    paymentProcessed
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
          <div
            className="text-zinc-800 dark:text-zinc-300 message-content"
            onClick={handleImageClick}
          >
            <Markdown key={content}>
              {processMarkdownContent(content)}
            </Markdown>
            <style jsx global>{`
              .message-content {
                position: relative;
                width: 100%;
              }

              .message-content img {
                max-width: 800px;
                width: 100%;
                height: auto;
                display: block;
                margin: 15px auto;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
                cursor: pointer;
              }
              
              .message-content img:hover {
                transform: scale(1.02);
              }
              
              .message-content img.expanded {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                max-width: 80vw;
                max-height: 80vh;
                width: auto;            /* 改為 auto */
                height: auto;
                z-index: 1001;
                margin: 0;
                object-fit: contain;
                border-radius: 4px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
              }
              
              .image-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.75);
                z-index: 1000;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              
              @media (max-width: 768px) {
                .message-content img {
                  max-width: 100%;
                }
                
                .message-content img.expanded {
                  width: auto;
                  height: auto;
                  max-width: 85vw;
                  max-height: 85vh;
                }
              }
            `}</style>
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