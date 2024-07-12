import { ScheduleServer } from "@/components/schedule-server";

export default function HomePage() {
  return (
    <div className="bg-background text-foreground p-6 rounded-lg shadow-lg">
      <ScheduleServer />
    </div>
  );
}
