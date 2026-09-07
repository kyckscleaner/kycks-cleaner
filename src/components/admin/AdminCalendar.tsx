"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#7c3aed",
  DONE: "#16a34a",
  CANCELLED: "#525252",
};

type Event = {
  id: string;
  title: string;
  start: string;
  end: string;
  status: string;
};

const CALENDAR_DARK_VARS = {
  "--fc-border-color": "rgba(255,255,255,0.1)",
  "--fc-page-bg-color": "transparent",
  "--fc-neutral-bg-color": "rgba(255,255,255,0.05)",
  "--fc-list-event-hover-bg-color": "rgba(255,255,255,0.05)",
  "--fc-today-bg-color": "rgba(168,85,247,0.1)",
  "--fc-button-bg-color": "#7c3aed",
  "--fc-button-border-color": "#7c3aed",
  "--fc-button-hover-bg-color": "#a855f7",
  "--fc-button-hover-border-color": "#a855f7",
  "--fc-button-active-bg-color": "#a855f7",
  "--fc-button-active-border-color": "#a855f7",
} as React.CSSProperties;

export function AdminCalendar() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("/api/admin/appointments")
      .then((res) => res.json())
      .then(setEvents);
  }, []);

  return (
    <div
      className="rounded-2xl border border-white/10 bg-[#16141c] p-4 text-white"
      style={CALENDAR_DARK_VARS}
    >
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
          backgroundColor: STATUS_COLORS[e.status] ?? "#7c3aed",
          borderColor: STATUS_COLORS[e.status] ?? "#7c3aed",
        }))}
        eventClick={(info) => router.push(`/admin/rdv/${info.event.id}`)}
      />
    </div>
  );
}
