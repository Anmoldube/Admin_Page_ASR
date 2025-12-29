/**
 * API Client Utilities
 * Handles all HTTP requests with proper error handling and response formatting
 */

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    status: number;
}

export interface FetchOptions extends RequestInit {
    timeout?: number;
}

/**
 * Generic API fetch wrapper
 * Handles errors, timeouts, and response parsing
 */
export async function apiCall<T>(
    url: string,
    options: FetchOptions = {}
): Promise<ApiResponse<T>> {
    const { timeout = 10000, ...fetchOptions } = options;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            return {
                success: false,
                error: `HTTP ${response.status}: ${response.statusText}`,
                status: response.status,
            };
        }

        const data = await response.json();

        return {
            success: true,
            data: data as T,
            status: response.status,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return {
            success: false,
            error: errorMessage,
            status: 500,
        };
    }
}

/**
 * GET Request
 */
export function apiGet<T>(url: string, options?: FetchOptions) {
    return apiCall<T>(url, {
        method: "GET",
        ...options,
    });
}

/**
 * POST Request
 */
export function apiPost<T>(url: string, data: any, options?: FetchOptions) {
    return apiCall<T>(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        body: JSON.stringify(data),
        ...options,
    });
}

/**
 * PUT Request
 */
export function apiPut<T>(url: string, data: any, options?: FetchOptions) {
    return apiCall<T>(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        body: JSON.stringify(data),
        ...options,
    });
}

/**
 * DELETE Request
 */
export function apiDelete<T>(url: string, options?: FetchOptions) {
    return apiCall<T>(url, {
        method: "DELETE",
        ...options,
    });
}
