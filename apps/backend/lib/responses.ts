interface ApiResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

export function success(data: unknown): ApiResponse {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(data),
  };
}

export function created(data: unknown): ApiResponse {
  return {
    statusCode: 201,
    headers: CORS_HEADERS,
    body: JSON.stringify(data),
  };
}

export function badRequest(message: string): ApiResponse {
  return {
    statusCode: 400,
    headers: CORS_HEADERS,
    body: JSON.stringify({ message }),
  };
}

export function unauthorized(message: string): ApiResponse {
  return {
    statusCode: 401,
    headers: CORS_HEADERS,
    body: JSON.stringify({ message }),
  };
}

export function serverError(message: string): ApiResponse {
  return {
    statusCode: 500,
    headers: CORS_HEADERS,
    body: JSON.stringify({ message }),
  };
}
