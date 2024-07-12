import { getScheduleForWeek } from "@/actions/actions";
import { ScheduleClient } from "@/components/schedule-client";
import { ScheduleServer } from "@/components/schedule-server";

export default async function HomePage() {
  const currentWeek = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const scheduleData = await getScheduleForWeek(currentWeek);

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
