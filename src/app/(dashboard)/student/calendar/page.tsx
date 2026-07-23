"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarDays, BookOpen, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  type: "class" | "assignment" | "exam";
  date: string;
  time?: string;
  courseName: string;
}

export default function StudentCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/student/calendar");
        if (res.ok) {
          const json = await res.json();
          setEvents(json.data);
        }
      } catch {
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth();
        setEvents([
          { id: "1", title: "React Live Session", type: "class", date: new Date(y, m, 24, 10, 0).toISOString(), time: "10:00 AM", courseName: "Advanced React Patterns" },
          { id: "2", title: "TypeScript Quiz #4", type: "assignment", date: new Date(y, m, 25, 23, 59).toISOString(), time: "11:59 PM", courseName: "TypeScript Mastery" },
          { id: "3", title: "Node.js Lab Session", type: "class", date: new Date(y, m, 26, 14, 0).toISOString(), time: "2:00 PM", courseName: "Node.js Backend" },
          { id: "4", title: "React Performance Project", type: "assignment", date: new Date(y, m, 28, 23, 59).toISOString(), time: "11:59 PM", courseName: "Advanced React Patterns" },
          { id: "5", title: "TypeScript Mid-term", type: "exam", date: new Date(y, m, 30, 9, 0).toISOString(), time: "9:00 AM", courseName: "TypeScript Mastery" },
          { id: "6", title: "React Live Session", type: "class", date: new Date(y, m, 17, 10, 0).toISOString(), time: "10:00 AM", courseName: "Advanced React Patterns" },
          { id: "7", title: "Node.js Assignment Due", type: "assignment", date: new Date(y, m, 20, 23, 59).toISOString(), time: "11:59 PM", courseName: "Node.js Backend" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    events.forEach((e) => {
      const d = new Date(e.date);
      if (d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear()) {
        const day = d.getDate();
        const existing = map.get(day) ?? [];
        existing.push(e);
        map.set(day, existing);
      }
    });
    return map;
  }, [events, currentMonth]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [events]);

  const typeConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    class: { color: "bg-electric-blue", icon: <BookOpen className="h-2.5 w-2.5 text-white" /> },
    assignment: { color: "bg-amber-500", icon: <FileText className="h-2.5 w-2.5 text-white" /> },
    exam: { color: "bg-red-500", icon: <CalendarDays className="h-2.5 w-2.5 text-white" /> },
  };

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        subtitle="View your schedule, classes, and upcoming deadlines"
        breadcrumbs={[{ label: "Student", href: "/student" }, { label: "Calendar" }]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-light-gray bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">
              {currentMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="rounded-lg p-2 text-navy hover:bg-light-gray">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="rounded-lg px-3 py-1 text-xs font-medium text-electric-blue hover:bg-electric-blue/5"
              >
                Today
              </button>
              <button onClick={nextMonth} className="rounded-lg p-2 text-navy hover:bg-light-gray">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px text-center text-xs font-medium text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[80px]" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = eventsByDay.get(day) ?? [];
              const isToday =
                day === new Date().getDate() &&
                currentMonth.getMonth() === new Date().getMonth() &&
                currentMonth.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={cn(
                    "min-h-[80px] rounded-lg border border-light-gray/50 p-1.5 transition-colors hover:bg-light-gray/30",
                    isToday && "bg-electric-blue/5 ring-1 ring-electric-blue/30"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                      isToday ? "bg-electric-blue text-white" : "text-navy"
                    )}
                  >
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "flex items-center gap-1 rounded px-1 py-0.5 text-[10px] text-white truncate",
                          typeConfig[event.type].color
                        )}
                        title={event.title}
                      >
                        {typeConfig[event.type].icon}
                        <span className="truncate">{event.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="block px-1 text-[10px] text-muted-foreground">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            {Object.entries(typeConfig).map(([type, config]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={cn("flex h-3 w-3 items-center justify-center rounded-full", config.color)}>
                  {config.icon}
                </div>
                <span className="capitalize">{type}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h3 className="text-sm font-semibold text-navy">Upcoming Events</h3>
          {upcomingEvents.length === 0 ? (
            <p className="rounded-xl border border-light-gray bg-white p-6 text-center text-sm text-muted-foreground shadow-sm">
              No upcoming events
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="rounded-xl border border-light-gray bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white",
                        typeConfig[event.type].color
                      )}
                    >
                      {typeConfig[event.type].icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-navy">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">{event.courseName}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                        {event.time && ` at ${event.time}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
