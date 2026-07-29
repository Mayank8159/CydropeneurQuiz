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

const adminUsers: Map<string, AdminUser> = new Map([
  ["admin@cydropreneur.com", { username: "admin@cydropreneur.com", passkey: process.env.ADMIN_PASSKEY || "Admin@15" }],
  ["admin@gmail.com", { username: "admin@gmail.com", passkey: process.env.ADMIN_PASSKEY || "Admin@15" }],
]);

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

export function verifyAdminUser(username: string, passkey: string): boolean {
  if (isSecurityViolation(username) || typeof passkey !== "string" || passkey.length < 3 || passkey.length > 100) {
    return false;
  }

  const normalized = username.trim().toLowerCase();
  // Must be an email address
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
  if (!emailRegex.test(normalized)) {
    return false;
  }

  const envEmail = (process.env.ADMIN_EMAIL || "admin@cydropreneur.com").trim().toLowerCase();
  const envPasskey = process.env.ADMIN_PASSKEY || "Admin@15";

  // Check env email admin if set
  if (envEmail && normalized === envEmail) {
    return timingSafeEqualString(passkey, envPasskey);
  }

  // Check store / database admin user
  const user = adminUsers.get(normalized);
  if (!user) return false;
  return timingSafeEqualString(passkey, user.passkey);
}
