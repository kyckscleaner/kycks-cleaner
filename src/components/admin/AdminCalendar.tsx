"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#0b3d91",
  DONE: "#16a34a",
  CANCELLED: "#94a3b8",
};

type Event = {
  id: string;
  title: string;
  start: string;
  end: string;
  status: string;
};

export function AdminCalendar() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("/api/admin/appointments")
      .then((res) => res.json())
      .then(setEvents);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
        locale="fr"
        firstDay={1}
        slotMinTime="07:00:00"
        slotMaxTime="20:00:00"
        height="auto"
        events={events.map((e) => ({
          ...e,
          backgroundColor: STATUS_COLORS[e.status] ?? "#0b3d91",
          borderColor: STATUS_COLORS[e.status] ?? "#0b3d91",
        }))}
        eventClick={(info) => router.push(`/admin/rdv/${info.event.id}`)}
      />
    </div>
  );
}
