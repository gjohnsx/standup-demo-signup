"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  addDemoSlot,
  removeDemoSlot,
  getScheduleForWeek,
} from "@/actions/actions";

interface DemoSchedule {
  id: number;
  week: number;
  day: string;
  name: string;
  demoTitle: string | null;
}

function getWeekDateRange(weekNumber: number): string {
  const now = new Date();
  const currentWeek = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) /
      (7 * 24 * 60 * 60 * 1000)
  );
  const diffWeeks = currentWeek - weekNumber;
  const startDate = new Date(
    now.getTime() - diffWeeks * 7 * 24 * 60 * 60 * 1000
  );
  startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Set to Monday
  const endDate = new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000); // Friday

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

function getDateForDay(weekNumber: number, dayIndex: number): string {
  const now = new Date();
  const currentWeek = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) /
      (7 * 24 * 60 * 60 * 1000)
  );
  const diffWeeks = currentWeek - weekNumber;
  const startDate = new Date(
    now.getTime() - diffWeeks * 7 * 24 * 60 * 60 * 1000
  );
  startDate.setDate(startDate.getDate() - startDate.getDay() + 1 + dayIndex); // Set to the correct day of the week
  return startDate.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
  });
}

export function ScheduleClient({
  initialSchedule,
  currentWeek,
}: {
  initialSchedule: DemoSchedule[];
  currentWeek: number;
}) {
  const [schedule, setSchedule] = useState<DemoSchedule[]>(initialSchedule);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [name, setName] = useState("");
  const [demoTitle, setDemoTitle] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      const updatedSchedule = await getScheduleForWeek(currentWeek);
      setSchedule(updatedSchedule);
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [currentWeek]);

  useEffect(() => {
    const fetchSchedule = async () => {
      const newSchedule = await getScheduleForWeek(selectedWeek);
      setSchedule(newSchedule);
    };
    fetchSchedule();
  }, [selectedWeek]);

  const handleAddDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    const newDemo = await addDemoSlot(
      currentWeek,
      selectedDay,
      name,
      demoTitle
    );
    setSchedule([...schedule, newDemo]);
    setName("");
    setDemoTitle("");
  };

  const handleRemoveDemo = async (id: number) => {
    await removeDemoSlot(id);
    setSchedule(schedule.filter((demo) => demo.id !== id));
  };

  const weekOptions = Array.from({ length: 10 }, (_, i) => currentWeek - i);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Demo Schedule</h2>
        <Select
          value={selectedWeek.toString()}
          onValueChange={(value) => setSelectedWeek(parseInt(value))}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select week" />
          </SelectTrigger>
          <SelectContent>
            {weekOptions.map((week) => (
              <SelectItem key={week} value={week.toString()}>
                {getWeekDateRange(week)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
          (day, index) => (
            <div key={day} className="bg-card p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">
                {day} {getDateForDay(selectedWeek, index)}
              </h3>
              <div className="flex flex-col gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      onClick={() => setSelectedDay(day)}
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add Demo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Demo Slot</DialogTitle>
                      <DialogDescription>
                        Add your name and demo title for {selectedDay}.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddDemo}>
                      <div className="grid gap-4 py-4">
                        <div className="grid items-center grid-cols-4 gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            required
                          />
                        </div>
                        <div className="grid items-center grid-cols-4 gap-4">
                          <Label htmlFor="demo-title" className="text-right">
                            Demo Title
                          </Label>
                          <Input
                            id="demo-title"
                            value={demoTitle}
                            onChange={(e) => setDemoTitle(e.target.value)}
                            className="col-span-3"
                            placeholder="(optional)"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <div className="space-y-2">
                  {schedule
                    .filter((demo) => demo.day === day)
                    .map((demo) => (
                      <div
                        key={demo.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarFallback>
                              {demo.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{demo.name}</p>
                            <p className="text-muted-foreground text-sm">
                              Demo: {demo.demoTitle || "Untitled"}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveDemo(demo.id)}
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
