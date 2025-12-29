/**
 * Custom React Hooks for API Data Fetching
 * Handles loading, error, and data states
 */

import { useState, useEffect } from "react";
import { apiGet } from "./api";

export interface UseFetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

/**
 * Generic useFetch hook for any API endpoint
 */
export function useFetch<T>(
    url: string | null,
    options?: { retry?: boolean; cache?: boolean }
): UseFetchState<T> {
    const [state, setState] = useState<UseFetchState<T>>({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        if (!url) {
            setState({ data: null, loading: false, error: null });
            return;
        }

        const fetchData = async () => {
            setState({ data: null, loading: true, error: null });

            const response = await apiGet<T>(url);

            if (response.success && response.data) {
                setState({ data: response.data, loading: false, error: null });
            } else {
                setState({ data: null, loading: false, error: response.error || "Failed to fetch" });
            }
        };

        fetchData();
    }, [url]);

    return state;
}

/**
 * Hook for fetching deals
 */
export function useDeals(url: string) {
    return useFetch(url);
}

/**
 * Hook for fetching flights
 */
export function useFlights(url: string) {
    return useFetch(url);
}

/**
 * Hook for fetching airports
 */
export function useAirports(url: string) {
    return useFetch(url);
}
