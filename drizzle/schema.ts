import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const demoSchedules = sqliteTable("demo_schedules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  week: integer("week").notNull(),
  day: text("day").notNull(),
  name: text("name").notNull(),
  demoTitle: text("demo_title"),
});
