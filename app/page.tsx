import { getScheduleForWeek } from "@/actions/actions";
import { ScheduleClient } from "@/components/schedule-client";

import { db } from "@/drizzle/client";
import { demoSchedules } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const revalidate = 0;

export default async function HomePage() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const currentWeek = Math.floor(
    (now.getTime() - startOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  // const scheduleData = await getScheduleForWeek(currentWeek);
  const scheduleData = await cache(
    async () =>
      await db
        .select()
        .from(demoSchedules)
        .where(eq(demoSchedules.week, currentWeek))
  )();

  console.log("scheduleData", scheduleData);

  return (
    <div className="bg-background text-foreground p-6 rounded-lg shadow-lg">
      <ScheduleClient
        initialSchedule={scheduleData}
        currentWeek={currentWeek}
      />
    </div>
  );
}
