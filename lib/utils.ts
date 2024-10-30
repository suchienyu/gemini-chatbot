import {
  CoreMessage,
  CoreToolMessage,
  generateId,
  Message,
  ToolInvocation,
} from "ai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Chat } from "@/db/schema";

// 原有的 utility 函數
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data.",
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function getLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(key) || "[]");
  }
  return [];
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: CoreToolMessage;
  messages: Array<Message>;
}): Array<Message> {
  return messages.map((message) => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map((toolInvocation) => {
          const toolResult = toolMessage.content.find(
            (tool) => tool.toolCallId === toolInvocation.toolCallId,
          );

          if (toolResult) {
            return {
              ...toolInvocation,
              state: "result",
              result: toolResult.result,
            };
          }

          return toolInvocation;
        }),
      };
    }

    return message;
  });
}

export function convertToUIMessages(
  messages: Array<CoreMessage>,
): Array<Message> {
  return messages.reduce((chatMessages: Array<Message>, message) => {
    if (message.role === "tool") {
      return addToolMessageToChat({
        toolMessage: message as CoreToolMessage,
        messages: chatMessages,
      });
    }

    let textContent = "";
    let toolInvocations: Array<ToolInvocation> = [];

    if (typeof message.content === "string") {
      textContent = message.content;
    } else if (Array.isArray(message.content)) {
      for (const content of message.content) {
        if (content.type === "text") {
          textContent += content.text;
        } else if (content.type === "tool-call") {
          toolInvocations.push({
            state: "call",
            toolCallId: content.toolCallId,
            toolName: content.toolName,
            args: content.args,
          });
        }
      }
    }

    chatMessages.push({
      id: generateId(),
      role: message.role,
      content: textContent,
      toolInvocations,
    });

    return chatMessages;
  }, []);
}

export function getTitleFromChat(chat: Chat) {
  const messages = convertToUIMessages(chat.messages as Array<CoreMessage>);
  const firstMessage = messages[0];

  if (!firstMessage) {
    return "Untitled";
  }

  return firstMessage.content;
}

// 新增語言相關功能
// =========================================

// 定義翻譯鍵值類型
export type TranslationKey =
  | 'booking.noTeachers'
  | 'booking.yearsExperience'
  | 'booking.hourlyRate'
  | 'booking.appointmentTime'
  | 'booking.available'
  | 'booking.unavailable'
  | 'booking.selectTimeHint'
  | 'booking.selectTimeMessage'
  | 'booking.selectTeacherMessage'
  | 'booking.confirmBooking'
  | 'booking.teacherSelected'
  | 'booking.bookingInfo'
  | 'booking.teacher'
  | 'booking.classTime'
  | 'booking.lessonType'
  | 'booking.trialLesson'
  | 'booking.regularLesson'
  | 'booking.confirmationPrompt';

// 支援的語言類型
export type Language = 'zh' | 'en';

// 預設語言
export const DEFAULT_LANGUAGE: Language = 'zh';

// 翻譯對照表
export const translations = {
  zh: {
    booking: {
      noTeachers: '目前沒有可用的老師',
      yearsExperience: '年教學經驗',
      hourlyRate: '課程費用：NT$ {rate} / 小時',
      appointmentTime: '預約時間：{time}',
      available: '可預約',
      unavailable: '－',
      selectTimeHint: '請點選您想要的時間或輸入「我要預約 [日期] [時間]」',
      selectTimeMessage: '我想選擇 {time} 這個時間',
      selectTeacherMessage: '我要選擇 {name} 老師',
      confirmBooking: '確認預約',
      teacherSelected: '已選擇老師',
      bookingInfo: '以下是您的預約資訊',
      teacher: '老師',
      classTime: '上課時間',
      lessonType: '課程類型',
      trialLesson: '免費體驗',
      regularLesson: '正式課程',
      confirmationPrompt: '請輸入「確認預約」來完成預約，或是「重新選擇」重新挑選老師'
    }
  },
  en: {
    booking: {
      noTeachers: 'No teachers available',
      yearsExperience: 'years of teaching experience',
      hourlyRate: 'Rate: NT$ {rate} / hour',
      appointmentTime: 'Appointment Time: {time}',
      available: 'Available',
      unavailable: '－',
      selectTimeHint: 'Please click on your preferred time or type "Book [date] [time]"',
      selectTimeMessage: 'I want to select {time}',
      selectTeacherMessage: 'I want to select teacher {name}',
      confirmBooking: 'Confirm Booking',
      teacherSelected: 'Teacher Selected',
      bookingInfo: 'Your Booking Information',
      teacher: 'Teacher',
      classTime: 'Class Time',
      lessonType: 'Lesson Type',
      trialLesson: 'Free Trial',
      regularLesson: 'Regular Course',
      confirmationPrompt: 'Please type "Confirm Booking" to proceed, or "Reselect" to choose another teacher'
    }
  }
} as const;

// 型別定義：翻譯參數
type TranslationParams = {
  rate?: string;
  time?: string;
  name?: string;
  [key: string]: string | undefined;
};

/**
 * 獲取翻譯文字
 * @param lang 語言
 * @param key 翻譯鍵值
 * @param params 替換參數
 * @returns 翻譯後的文字
 */
export function getTranslation(
  lang: Language,
  key: TranslationKey,
  params: TranslationParams = {}
): string {
  try {
    const keys = key.split('.');
    let value: any = translations[lang];
    
    for (const k of keys) {
      value = value[k];
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation key "${key}" not found for language "${lang}"`);
      return key;
    }

    let translation = value;
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      if (paramValue !== undefined) {
        translation = translation.replace(`{${paramKey}}`, paramValue);
      }
    });
    
    return translation;
  } catch (error) {
    console.error(`Error getting translation for key "${key}"`, error);
    return key;
  }
}

/**
 * 檢查是否為支援的語言
 * @param lang 要檢查的語言代碼
 * @returns boolean
 */
export function isSupportedLanguage(lang: string): lang is Language {
  return ['zh', 'en'].includes(lang);
}

/**
 * 獲取瀏覽器語言設定
 * @returns Language
 */
export function getBrowserLanguage(): Language {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }
  
  const browserLang = navigator.language.toLowerCase().split('-')[0];
  return isSupportedLanguage(browserLang) ? browserLang : DEFAULT_LANGUAGE;
}

/**
 * 格式化日期時間
 * @param date Date 物件或時間字串
 * @param lang 語言
 * @returns 格式化後的日期時間字串
 */
export function formatDateTime(date: Date | string, lang: Language): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString(lang === 'zh' ? 'zh-TW' : 'en-US');
}