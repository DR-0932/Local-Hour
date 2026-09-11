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
};

export type User = {
  id: string;
  username: string;
  name?: string | null;
  email: string;
  gender: "Male" | "Female" | "Other";
};

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

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
  return request<{ token: string; userdata: User }>("/api/auth/login", {
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

// ---------- Admin (protected) ----------

export async function createEvent(payload: Partial<Event>, token: string) {
  return request<{ message: string; event: Event }>("/api/admin/createEvent", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function rescheduleEvent(
  id: string,
  dateOfEvent: string,
  token: string
) {
  return request<{ message: string; event: Event }>(`/api/admin/reschedule/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ dateOfEvent }),
  });
}

export async function hideEvent(id: string, token: string) {
  return request<{ message: string }>(`/api/admin/delete`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ id }),
  });
}

export async function deleteEvent(id: string, token: string) {
  return request<{ message: string }>(`/api/admin/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ---------- useFetch hook ----------

import { useEffect, useState, useCallback } from "react";

type UseFetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = []
): UseFetchState<T> & { refetch: () => void } {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const run = useCallback(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: any) => {
        if (!cancelled)
          setState({ data: null, loading: false, error: err.message ?? "Something went wrong" });
      });

    return () => {
      cancelled = true;
    };
  }, deps);

  useEffect(() => {
    const cleanup = run();
    return cleanup;
  }, [run]);

  return { ...state, refetch: run };
}