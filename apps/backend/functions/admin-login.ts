const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || "";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

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
  const dangerousRegex = /(['";\=\#\\`\/\*]|\-\-|\$ne|\$gt|\$regex|\$where|http:|https:|file:|localhost|169\.254|<script>)/i;
  return dangerousRegex.test(input);
}

export async function handler(event: any) {
  try {
    const method = event.requestContext?.http?.method;

    if (method === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: "",
      };
    }

    if (method !== "POST") {
      return {
        statusCode: 405,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Method not allowed" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const { username, passkey } = body;

    if (isSecurityViolation(username) || typeof passkey !== "string" || passkey.length < 3 || passkey.length > 100) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, message: "SECURITY VIOLATION // INVALID CREDENTIAL FORMAT OR INJECTION ATTEMPT BLOCKED" }),
      };
    }

    const normalized = String(username).trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
    const allowedEmails = String(ADMIN_EMAIL)
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const isDefaultUser = emailRegex.test(normalized) && allowedEmails.includes(normalized);
    const isPasskeyValid = timingSafeEqualString(passkey, ADMIN_PASSKEY);

    if (!isDefaultUser || !isPasskeyValid) {
      return {
        statusCode: 401,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, message: "INVALID USERNAME OR PASSKEY // ACCESS DENIED" }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, username }),
    };
  } catch (error) {
    console.error("Admin login error:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, message: "Internal server error" }),
    };
  }
}
