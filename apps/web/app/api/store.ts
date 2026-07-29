export interface StoredQuestion {
  qId: string;
  qNumber: number;
  question: string;
  options: { a: string; b: string; c: string; d: string };
  correctAnswer: string;
}

const questions: Map<string, StoredQuestion> = new Map();

export function getAllQuestions(): StoredQuestion[] {
  return Array.from(questions.values()).sort((a, b) => a.qNumber - b.qNumber);
}

export function getQuestion(qId: string): StoredQuestion | undefined {
  return questions.get(qId);
}

export function setQuestion(q: StoredQuestion): void {
  questions.set(q.qId, q);
}

export function deleteQuestion(qId: string): boolean {
  return questions.delete(qId);
}

export interface AdminUser {
  username: string;
  passkey: string;
}

/**
 * Performs constant-time comparison to prevent timing attacks.
 */
function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) {
    let dummy = 0;
    for (let i = 0; i < a.length; i++) dummy |= a.charCodeAt(i) ^ a.charCodeAt(i);
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Guards against SQL Injections, NoSQL Injections, SSRF, XSS, and parameter tampering.
 */
function isSecurityViolation(input: unknown): boolean {
  if (typeof input !== "string") return true;
  if (input.length < 3 || input.length > 100) return true;
  // Prevent SQLi, NoSQLi, SSRF, and XSS patterns
  const dangerousRegex = /(['";\=\#\\`\/\*]|\-\-|\$ne|\$gt|\$regex|\$where|http:|https:|file:|localhost|169\.254|<script>)/i;
  return dangerousRegex.test(input);
}

// Admin verification uses environment variables without hardcoded email strings in source.
// Production and local paths are strictly mutually exclusive via NODE_ENV.
export function verifyAdminUser(username: string, passkey: string): boolean {
  if (isSecurityViolation(username) || typeof passkey !== "string" || passkey.length < 3 || passkey.length > 100) {
    return false;
  }

  const normalized = username.trim().toLowerCase();
  // Must be a valid email address
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
  if (!emailRegex.test(normalized)) {
    return false;
  }

  const isDev = process.env.NODE_ENV === "development";

  // ── PRODUCTION PATH ──────────────────────────────────────────────────────────
  // Only runs in production (NODE_ENV !== "development").
  // Reads ADMIN_EMAIL / ADMIN_PASSKEY — these are blanked in .env.local so they
  // can never be used locally, even if .env still defines them.
  if (!isDev) {
    const envEmails = (process.env.ADMIN_EMAIL || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const envPasskey = process.env.ADMIN_PASSKEY || "";
    if (envEmails.length > 0 && envEmails.includes(normalized) && envPasskey) {
      return timingSafeEqualString(passkey, envPasskey);
    }
    return false; // Hard-stop: no dev fallback in production
  }

  // ── LOCAL DEV PATH ───────────────────────────────────────────────────────────
  // Only runs when NODE_ENV=development.
  // Reads NEXT_PUBLIC_DEV_ADMIN_* from .env.local (gitignored).
  // Production ADMIN_EMAIL / ADMIN_PASSKEY are blanked in .env.local so they
  // cannot be used here either.
  const devEmail = (process.env.NEXT_PUBLIC_DEV_ADMIN_EMAIL || "").trim().toLowerCase();
  const devpassKey = process.env.NEXT_PUBLIC_DEV_ADMIN_PASSKEY || "";
  if (devEmail && devpassKey && normalized === devEmail) {
    return timingSafeEqualString(passkey, devpassKey);
  }

  return false;
}
