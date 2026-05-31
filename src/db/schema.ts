import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

/**
 * Stores New Year booking submissions from the reservation form.
 */
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  studentPhone: text("student_phone").notNull(),
  parentPhone: text("parent_phone").notNull(),
  gender: text("gender").notNull(),
  grade: text("grade").notNull(),
  price: integer("price").notNull().default(0),
  groupDay: text("group_day").notNull(),
  groupTime: text("group_time").notNull(),
  submittedAt: timestamp("submitted_at", { mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" })
    .defaultNow()
    .notNull(),
});
