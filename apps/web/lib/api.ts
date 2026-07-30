"use client";

function getAdminPasskey(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("adminAuth") || "";
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `API Error: ${res.status}`);
  }

  return res.json();
}

export function fetchQuestions() {
  return apiFetch<Array<{
    qId: string;
    qNumber: number;
    question: string;
    options: { a: string; b: string; c: string; d: string };
  }>>("/api/questions");
}

export function submitQuiz(payload: {
  playerName: string;
  answers: Record<string, string>;
  timeElapsedMs: number;
}) {
  return apiFetch<{
    score: number;
    totalQuestions: number;
    timeElapsedMs: number;
    rank: number;
    totalPlayers: number;
  }>("/api/submit", { method: "POST", body: payload });
}

export function adminCreateQuestion(payload: {
  qNumber: number;
  question: string;
  options: { a: string; b: string; c: string; d: string };
  correctAnswer: string;
}) {
  return apiFetch<{ success: boolean; qId: string }>(
    "/api/admin/questions",
    {
      method: "POST",
      body: payload,
      headers: {
        "x-admin-passkey": getAdminPasskey(),
      },
    }
  );
}

export function adminFetchAllQuestions() {
  return apiFetch<Array<{
    qId: string;
    qNumber: number;
    question: string;
    options: { a: string; b: string; c: string; d: string };
    correctAnswer: string;
  }>>("/api/admin/questions");
}

export function adminDeleteQuestion(qId: string) {
  return apiFetch<{ success: boolean }>(
    `/api/admin/questions?qId=${encodeURIComponent(qId)}`,
    {
      method: "DELETE",
      headers: {
        "x-admin-passkey": getAdminPasskey(),
      },
    }
  );
}

export function fetchLeaderboard() {
  return apiFetch<Array<{
    rank: number;
    playerName: string;
    score: number;
    timeElapsedMs: number;
    submittedAt: string;
  }>>("/api/admin/leaderboard");
}

export function checkPlayerName(name: string) {
  return apiFetch<{ exists: boolean }>(
    `/api/check-player?name=${encodeURIComponent(name)}`
  );
}

export function checkParticipantEmail(email: string) {
  return apiFetch<{ exists: boolean }>(
    `/api/check-participant?email=${encodeURIComponent(email)}`
  );
}

export function adminClearData() {
  return apiFetch<{ success: boolean; questionsCleared: number; submissionsCleared: number }>(
    "/api/admin/clear-data",
    {
      method: "POST",
      headers: {
        "x-admin-passkey": getAdminPasskey(),
      },
    }
  );
}

export function adminLogin(payload: { username: string; passkey: string }) {
  return apiFetch<{ success: boolean; username?: string; message?: string }>(
    "/api/admin/login",
    {
      method: "POST",
      body: payload,
    }
  );
}
