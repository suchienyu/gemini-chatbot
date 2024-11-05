import { convertToCoreMessages, Message, streamText, ToolInvocation } from "ai";
import { z } from "zod";
import { openaiModel } from "@/ai";
import { auth } from "@/app/(auth)/auth";
import { translate } from '@/lib/translation';
import {
  createBooking,
  deleteChatById,
  getChatById,
  saveChat,
  sendConfirmationEmail
} from "@/db/queries";
import { generateUUID } from "@/lib/utils";
import { generateMockTeachers, TEACHER_CONFIG } from '@/data/teachers';
import { SYSTEM_PROMPT, detectLanguage, generateWeeklyCalendar, generateClassroomLink } from '@/components/booking/utils';
import {
  ApiResponse,
  ConfirmationEmailData,
  TimeSlot,
  TeacherAvailabilityRequest,
  TeacherSelectionRequest,
  CreateBookingRequest,
  Teacher,
  SupportedLanguage
} from '@/lib/types';
//import { formatBookingMessage } from '@/lib/booking-messages';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolInvocations?: Array<ToolInvocation>;
}
interface RequestData {
  id: string;
  messages: ChatMessage[];
  selectedTime?: string;
}

function getLanguageFromMessage(message: ChatMessage): SupportedLanguage {
  const content = message.content || '';

  if (/[\u4e00-\u9fa5]/.test(content)) return 'zh';
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(content)) return 'ja';
  if (/[\uAC00-\uD7AF]/.test(content)) return 'ko';
  if (/[áéíóúüñ¿¡]/i.test(content)) return 'es';
  if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) return 'fr';
  return 'en';
}

function getFirstUserMessage(messages: ChatMessage[]): string {
  return messages.find(
    (message: ChatMessage) => message.role === 'user'
  )?.content || '';
}

export async function POST(request: Request) {
  try {
    const { id, messages, selectedTime } = await request.json();

    const firstUserMessage = getFirstUserMessage(messages);
    const userLanguage = detectLanguage(firstUserMessage);
    console.log('Detected user language:', userLanguage);
    const session = await auth();
    if (!session?.user) {
      throw new Error('Unauthorized');
    }
    //const userLanguage = detectLanguage(firstUserMessage);
    console.log('User initial language:', userLanguage);
    // 處理時間選擇，立即返回教師列表
    if (selectedTime) {
      const availableTeachers = generateMockTeachers(
        TEACHER_CONFIG.TEACHER_COUNT,
        userLanguage  // 使用檢測到的語言
      );

      return new Response(
        JSON.stringify({
          success: true,
          data: { availableTeachers },
          language: userLanguage  // 返回語言信息
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
    const responseMessages = {
      selectTeacher: {
        en: "Please select a teacher.",
        zh: "請選擇老師。",
        ja: "講師を選択してください。",
        ko: "선생님을 선택해 주세요.",
        es: "Por favor, seleccione un profesor.",
        fr: "Veuillez choisir un professeur."
      },
      bookingConfirmed: {
        en: "Your booking is confirmed.",
        zh: "您的預約已確認。",
        ja: "ご予約が確定しました。",
        ko: "예약이 확정되었습니다.",
        es: "Su reserva está confirmada.",
        fr: "Votre réservation est confirmée."
      },
      teacherSelected: {
        en: "You have selected teacher {name}",
        zh: "您已選擇 {name} 老師",
        ja: "{name}先生を選択しました",
        ko: "{name} 선생님을 선택하셨습니다",
        es: "Has seleccionado al profesor {name}",
        fr: "Vous avez sélectionné le professeur {name}"
      }
    };

    const coreMessages = convertToCoreMessages(messages).filter(
      message => message.content.length > 0
    );

    const teacherSelectionMessages = {
      en: 'You have selected teacher {name}',
      zh: '您已選擇 {name} 老師',
      ja: '{name}先生を選択しました',
      ko: '{name} 선생님을 선택하셨습니다',
      es: 'Has seleccionado al profesor {name}',
      fr: 'Vous avez sélectionné le professeur {name}'
    } as const;

    // AI 工具定義
    const tools = {
      generateCalendar: {
        description: "Generate available time slots",
        parameters: z.object({
          startDate: z.string().describe("Start date in ISO format"),
          endDate: z.string().describe("End date in ISO format")
        }),
        execute: async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
          return generateWeeklyCalendar(startDate, endDate,userLanguage);
        }
      },
      checkTeacherAvailability: {
        description: "Show available teachers after time selection",
        parameters: z.object({
          selectedDate: z.string().describe("Selected date and time")
        }),
        execute: async ({ selectedDate }: TeacherAvailabilityRequest) => {
          const userMessage = getFirstUserMessage(messages);
          const userLanguage = detectLanguage(userMessage);
          console.log('Generating teachers for language:', userLanguage);

          const teachers = generateMockTeachers(TEACHER_CONFIG.TEACHER_COUNT, userLanguage);
          console.log('Generated teachers language:', teachers[0].languages);
          return teachers;
        }
      },
      selectTeacher: {
        description: "Process teacher selection",
        parameters: z.object({
          teacherId: z.string(),
          teacherName: z.string(),
          selectedTime: z.string()
        }),
        execute: async ({ teacherId, teacherName, selectedTime }: TeacherSelectionRequest) => {
          const userMessage = getFirstUserMessage(messages);
          const userLanguage = detectLanguage(userMessage);
          // const teacherSelectedMessage = translate('teacherSelected', userLanguage, { name: teacherName });
          // const bookingConfirmedMessage = translate('bookingConfirmed', userLanguage);

          return {
            status: 'success',
            showBookingSuccess: true,  // 確保這個標記存在
            bookingDetails: {
              teacherId,
              teacherName,
              lessonDateTime: selectedTime,
              lessonType: 'trial' as const
            }
          };
        }
      },
      createBooking: {
        description: "Create final booking",
        parameters: z.object({
          teacherId: z.string(),
          teacherName: z.string(),  // 添加這個
          lessonDateTime: z.string(),
          lessonType: z.enum(["trial", "regular"])
        }),
        execute: async (bookingDetails: CreateBookingRequest) => {
          try {
            const userMessage = getFirstUserMessage(messages);
            const userLanguage = detectLanguage(userMessage);
            const classroomLink = generateClassroomLink(generateUUID());
      
            // 從 selectTeacher 傳來的教師資訊
            const booking = {
              teacherName: bookingDetails.teacherName,  // 使用傳入的教師名稱
              lessonDateTime: bookingDetails.lessonDateTime,
              lessonType: bookingDetails.lessonType,
              classroomLink,
              status: 'success' as const,
              showBookingSuccess: true
            };
      
            // 處理郵件
            if (session.user?.email) {
              const confirmationEmail: ConfirmationEmailData = {
                to: session.user.email,
                bookingDetails: {
                  studentName: session.user.name || session.user.email,
                  teacherName: booking.teacherName,
                  lessonDateTime: new Date(bookingDetails.lessonDateTime),
                  lessonType: bookingDetails.lessonType,
                  language: userLanguage
                },
                classroomLink
              };
      
              await sendConfirmationEmail(confirmationEmail).catch(error => {
                console.error('Error sending confirmation email:', error);
              });
            }
      
            return booking;
      
          } catch (error) {
            console.error('Error in createBooking:', error);
            throw error;
          }
        }
      }
    };
    const systemPrompt = `
${SYSTEM_PROMPT}
CURRENT_LANGUAGE: ${userLanguage}
MAINTAIN_LANGUAGE: true
`;

    const result = await streamText({
      model: openaiModel,
      system: systemPrompt,
      messages: coreMessages,
      tools,
      temperature: 0.3,
    });

    // 保存對話記錄
    if (session.user?.id) {
      await saveChat({
        id,
        userLanguage,
        messages: coreMessages.map(msg => ({ ...msg, globalUserLang: userLanguage})),
        userId: session.user.id,
      }).catch(error => {
        console.error("Failed to save chat", error);
      });
    }

    return result.toDataStreamResponse({
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Route error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error"
      }),
      { status: 500 }
    );
  }
}