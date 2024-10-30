import { Message } from "ai";
import { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  boolean,
  text,
  decimal,
  integer,
  primaryKey
} from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

// 原有的用户表
export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: text("name"),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export type User = InferSelectModel<typeof user>;




// 原有的聊天表
export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  messages: json("messages").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
});

export type Chat = Omit<InferSelectModel<typeof chat>, "messages"> & {
  messages: Array<Message>;
};

// 原有的预订表
export const reservation = pgTable("Reservation", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  details: json("details").notNull(),
  hasCompletedPayment: boolean("hasCompletedPayment").notNull().default(false),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
});

export type Reservation = InferSelectModel<typeof reservation>;

// 新增的教师表
export const teachers = pgTable("Teacher", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  profileImageUrl: text("profileImageUrl"),
  introduction: text("introduction"),
  videoUrl: text("videoUrl"),
  teachingStyle: text("teachingStyle"),
  languages: json("languages").$type<string[]>(),
  yearsOfExperience: integer("yearsOfExperience"),
  hourlyRate: decimal("hourlyRate", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type Teacher = InferSelectModel<typeof teachers>;

// 新增的教师课程时间表
export const teacherSchedules = pgTable("TeacherSchedule", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  teacherId: uuid("teacherId")
    .notNull()
    .references(() => teachers.id),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime").notNull(),
  isAvailable: boolean("isAvailable").notNull().default(true),
  lessonType: varchar("lessonType", { length: 20 }),  // 'trial' or 'regular'
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type TeacherSchedule = InferSelectModel<typeof teacherSchedules>;

// 新增的课程预订表
export const bookings = pgTable("Booking", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  studentId: uuid("studentId")
    .notNull()
    .references(() => user.id),
  teacherId: uuid("teacherId")
    .notNull()
    .references(() => teachers.id),
  scheduleId: uuid("scheduleId")
    .notNull()
    .references(() => teacherSchedules.id),
  lessonType: varchar("lessonType", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default('pending'),
  classroomLink: text("classroomLink"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type Booking = InferSelectModel<typeof bookings>;

export interface BookingDetails {
  studentName: string;
  teacherName: string;
  lessonDateTime: Date;
  classroomLink: string;
  lessonType: 'trial' | 'regular';
}

// 修改 createBooking 函數的返回類型
interface BookingResponse {
  id: string;
  studentEmail: string;
  studentName: string;
  teacherName: string;
  lessonDateTime: Date;
  lessonType: 'trial' | 'regular';
  classroomLink: string;
}

// 新增的课程记录表
export const lessons = pgTable("Lesson", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  bookingId: uuid("bookingId")
    .notNull()
    .references(() => bookings.id),
  classroomLink: text("classroomLink"),
  materialsLink: text("materialsLink"),
  status: varchar("status", { length: 20 }).notNull().default('scheduled'),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type Lesson = InferSelectModel<typeof lessons>;

// 定义表关系
export const teacherRelations = relations(teachers, ({ many }) => ({
  schedules: many(teacherSchedules),
  bookings: many(bookings)
}));

export const teacherScheduleRelations = relations(teacherSchedules, ({ one }) => ({
  teacher: one(teachers, {
    fields: [teacherSchedules.teacherId],
    references: [teachers.id]
  })
}));

export const bookingRelations = relations(bookings, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [bookings.teacherId],
    references: [teachers.id]
  }),
  schedule: one(teacherSchedules, {
    fields: [bookings.scheduleId],
    references: [teacherSchedules.id]
  }),
  lessons: many(lessons)
}));

export const lessonRelations = relations(lessons, ({ one }) => ({
  booking: one(bookings, {
    fields: [lessons.bookingId],
    references: [bookings.id]
  })
}));
