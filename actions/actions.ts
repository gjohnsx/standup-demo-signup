"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/drizzle/client";
import { demoSchedules } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getScheduleForWeek(week: number) {
  return db.select().from(demoSchedules).where(eq(demoSchedules.week, week));
}

export async function addDemoSlot(
  week: number,
  day: string,
  name: string,
  demoTitle: string
) {
  const result = await db
    .insert(demoSchedules)
    .values({ week, day, name, demoTitle })
    .returning();

  revalidatePath("/"); // Revalidate the home page
  return result[0];
}

export async function removeDemoSlot(id: number) {
  await db.delete(demoSchedules).where(eq(demoSchedules.id, id));
  revalidatePath("/"); // Revalidate the home page
}
