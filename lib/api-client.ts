import type { ApiResponse } from "@/types/common.types";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions {
  method?: HttpMethod;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

/**
 * Typed client-side fetch wrapper for internal API calls.
 * Handles JSON serialization, error extraction, and type safety.
 */
export async function apiClient<T>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, headers = {} } = options;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Request failed with status ${response.status}`,
      };
    }

    return {
      success: true,
      data: data.data ?? data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
    };
  }
}
