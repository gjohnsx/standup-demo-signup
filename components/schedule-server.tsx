import { getScheduleForWeek } from "@/actions/actions";
import { ScheduleClient } from "@/components/schedule-client";

export async function ScheduleServer() {
  const currentWeek = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)); // Current week number
  const scheduleData = await getScheduleForWeek(currentWeek);

  return (
    <ScheduleClient initialSchedule={scheduleData} currentWeek={currentWeek} />
  );
}
