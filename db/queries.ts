import "server-only";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { desc, eq, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { createTransport } from "nodemailer";

import { 
  user, 
  chat, 
  User, 
  reservation,
  teachers,
  teacherSchedules,
  bookings,
  lessons,
  type Teacher,
  type TeacherSchedule
} from "./schema";

export const client = postgres(`${process.env.POSTGRES_URL!}`);
export const db = drizzle(client, { 
  schema: {
    teachers,
    teacherSchedules,
    bookings,
    lessons,
    user,
    chat,
    reservation
  }
});

// User Authentication Related Queries
export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error("Failed to get user from database",error);
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  try {
    return await db.insert(user).values({ email, password: hash });
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}

// Chat Related Queries
export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  messages: any;
  userId: string;
  userLanguage: string
}) {
  try {
    // 檢查消息格式並轉換
    const processedMessages = Array.isArray(messages) 
      ? messages 
      : typeof messages === 'string' 
        ? JSON.parse(messages) 
        : messages;

    const chatData = {
      id,
      createdAt: new Date(),
      messages: processedMessages,
      userId,
    };

    const selectedChats = await db.select().from(chat).where(eq(chat.id, id));

    if (selectedChats.length > 0) {
      return await db
        .update(chat)
        .set({
          messages: processedMessages,
        })
        .where(eq(chat.id, id));
    }

    return await db.insert(chat).values(chatData);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to save chat in database:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Failed to save chat in database:", error);
    }
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error("Failed to get chats by user from database");
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

// Original Reservation Related Queries
export async function createReservation({
  id,
  userId,
  details,
}: {
  id: string;
  userId: string;
  details: any;
}) {
  return await db.insert(reservation).values({
    id,
    createdAt: new Date(),
    userId,
    hasCompletedPayment: false,
    details: JSON.stringify(details),
  });
}

export async function getReservationById({ id }: { id: string }) {
  const [selectedReservation] = await db
    .select()
    .from(reservation)
    .where(eq(reservation.id, id));

  return selectedReservation;
}

export async function updateReservation({
  id,
  hasCompletedPayment,
}: {
  id: string;
  hasCompletedPayment: boolean;
}) {
  return await db
    .update(reservation)
    .set({
      hasCompletedPayment,
    })
    .where(eq(reservation.id, id));
}

// New Course Booking Related Queries
export async function getTeacherProfile(teacherId: string) {
  try {
    const teacher = await db.query.teachers.findFirst({
      where: eq(teachers.id, teacherId),
      with: {
        schedules: true
      }
    });
    
    if (!teacher) {
      throw new Error('Teacher not found');
    }
    
    return teacher;
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    throw error;
  }
}

export async function getTeacherSchedule({ 
  date, 
  type 
}: { 
  date: string; 
  type: 'trial' | 'regular' 
}) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await db.query.teacherSchedules.findMany({
      where: and(
        eq(teacherSchedules.lessonType, type),
        eq(teacherSchedules.isAvailable, true),
        gte(teacherSchedules.startTime, startOfDay),
        lte(teacherSchedules.endTime, endOfDay)
      ),
      with: {
        teacher: true
      }
    });
  } catch (error) {
    console.error('Error fetching teacher schedules:', error);
    throw error;
  }
}

export async function createBooking({
  studentId,
  teacherId,
  lessonDateTime,
  lessonType
}: {
  studentId: string;
  teacherId: string;
  lessonDateTime: string;
  lessonType: 'trial' | 'regular';
}) {
  try {
    return await db.transaction(async (tx) => {
      // 1. 找到相應的 schedule
      const [schedule] = await tx
        .select()
        .from(teacherSchedules)
        .where(and(
          eq(teacherSchedules.teacherId, teacherId),
          eq(teacherSchedules.startTime, new Date(lessonDateTime)),
          eq(teacherSchedules.isAvailable, true)
        ));

      if (!schedule) {
        throw new Error('No available schedule found');
      }

      // 2. Create booking
      const [booking] = await tx
        .insert(bookings)
        .values({
          studentId,
          teacherId,
          scheduleId: schedule.id, // 添加 scheduleId
          lessonType,
          status: 'confirmed',
          classroomLink: `https://meet.example.com/${generateUUID()}`
        })
        .returning();

      // 3. Update teacher schedule
      await tx
        .update(teacherSchedules)
        .set({ isAvailable: false })
        .where(eq(teacherSchedules.id, schedule.id));

      // 4. Create lesson record
      const [lesson] = await tx
        .insert(lessons)
        .values({
          bookingId: booking.id,
          status: 'scheduled',
          classroomLink: booking.classroomLink
        })
        .returning();

      return { ...booking, lesson };
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function generateLessonsList(bookingId: string) {
  try {
    return await db.query.lessons.findMany({
      where: eq(lessons.bookingId, bookingId),
      orderBy: (lessons, { asc }) => [asc(lessons.createdAt)]
    });
  } catch (error) {
    console.error('Error generating lessons list:', error);
    throw error;
  }
}

// Utility function
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface ConfirmationEmailData {
  to: string;
  bookingDetails: {
    studentName: string;
    teacherName: string;
    lessonDateTime: Date;
    lessonType: 'trial' | 'regular';
  };
  classroomLink: string;
}

export async function sendConfirmationEmail(data: ConfirmationEmailData): Promise<void> {
  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: data.to,
      subject: `課程預約確認 - ${data.bookingDetails.lessonType === 'trial' ? '免費體驗' : '正式課程'}`,
      html: `
        <h1>課程預約確認</h1>
        <p>親愛的 ${data.bookingDetails.studentName}：</p>
        <p>您的課程預約已確認！</p>
        <p>課程詳情：</p>
        <ul>
          <li>老師：${data.bookingDetails.teacherName}</li>
          <li>時間：${data.bookingDetails.lessonDateTime.toLocaleString()}</li>
          <li>類型：${data.bookingDetails.lessonType === 'trial' ? '免費體驗' : '正式課程'}</li>
        </ul>
        <p>教室連結：<a href="${data.classroomLink}">${data.classroomLink}</a></p>
      `
    });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    throw error;
  }
}