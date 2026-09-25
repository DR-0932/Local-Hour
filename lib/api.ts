// api.ts

export type Event = {
  id: string;
  title: string;
  description: string;
  dateOfEvent: string;
  venue: string;
  venueLink?: string | null;
  numberOfParticipants?: number;
  slotsLeft?: number | null;
  image?: string | null;
  registrationFee?: number | null;
  isArchived?: boolean;
  registrationCount?: number;
  registrations?: Array<{ id: string }>;
};

export type User = {
  id: string;
  username: string;
  name?: string | null;
  email: string;
  gender: "Male" | "Female" | "Other";  
};

const BASE = "http://localhost:8080";

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...opts,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${res.statusText} - ${text}`);
  }

  return (await res.json()) as T;
}

// ---------- Auth ----------

export async function signup(payload: {
  username: string;
  password: string;
  name: string;
  email: string;
  gender: string;
}) {
  return request<{ userdata: User }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: { loginIdentifier: string; password: string }) {
  return request<{userdata: User }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ---------- Business (public) ----------

export async function getEvents(): Promise<Event[]> {
  return request<Event[]>("/api/business/event");
}

export async function getEventById(id: string): Promise<Event> {
  return request<Event>(`/api/business/event/${id}`);
}

export async function registerForFreeEvent(payload: {
  contact_number: string;
  full_name: string;
  email: string;
  userId?: string | null;
  eventId?: string;
}) {
  return request<{ message: string }>("/api/business/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ---------- Admin (protected) ----------

export async function createEvent(payload: Partial<Event>) {
  return request<{ message: string; event: Event }>("/api/admin/createEvent", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function rescheduleEvent(id: string, dateOfEvent: string) {
  return request<{ message: string; event: Event }>(`/api/admin/reschedule/${id}`, {
    method: "PUT",
    body: JSON.stringify({ dateOfEvent }),
  });
}

export async function hideEvent(id: string) {
  return request<{ message: string }>(`/api/admin/delete`, {
    method: "PATCH",
    body: JSON.stringify({ id }),
  });
}

export async function deleteEvent(id: string) {
  return request<{ message: string }>(`/api/admin/event/${id}`, {
    method: "DELETE",
  });
}