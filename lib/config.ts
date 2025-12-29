/**
 * Centralized Configuration Management
 * All API endpoints and URLs are managed from here
 */

// ============================================
// API BASE URLS
// ============================================
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const BOOKING_BASE = process.env.NEXT_PUBLIC_BOOKING_BASE || "http://localhost:3001";

// ============================================
// API ENDPOINTS
// ============================================
export const API_ENDPOINTS = {
    deals: {
        list: `${API_BASE}/deals`,
        detail: (id: string) => `${API_BASE}/deals/${id}`,
    },
    flights: {
        search: `${API_BASE}/flights/search`,
        list: `${API_BASE}/flights`,
    },
    bookings: {
        create: `${BOOKING_BASE}/bookings`,
        list: `${BOOKING_BASE}/bookings`,
        detail: (id: string) => `${BOOKING_BASE}/bookings/${id}`,
    },
    airports: {
        list: `${API_BASE}/airports`,
    },
};

// ============================================
// INTERNAL PAGES & ROUTES
// ============================================
export const INTERNAL_ROUTES = {
    home: "/",
    fleet: "/fleet",
    taxi: "/taxi",
    about: "/about",
    contact: "/contact",
    login: "/login",
};

// ============================================
// BOOKING CONFIGURATION
// ============================================
export const BOOKING_CONFIG = {
    destinationBase: process.env.NEXT_PUBLIC_BOOKING_DESTINATION || "http://localhost:3001",
};

// ============================================
// ENVIRONMENT CONFIGURATION
// ============================================
export const APP_CONFIG = {
    env: process.env.NEXT_PUBLIC_ENV || "development",
    isDevelopment: process.env.NEXT_PUBLIC_ENV === "development",
    isProduction: process.env.NEXT_PUBLIC_ENV === "production",
};

// ============================================
// EXPORT ALL CONFIG
// ============================================
export const config = {
    api: API_ENDPOINTS,
    routes: INTERNAL_ROUTES,
    booking: BOOKING_CONFIG,
    app: APP_CONFIG,
};

export default config;
