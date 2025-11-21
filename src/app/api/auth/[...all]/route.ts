// app/api/auth/[...all]/route.ts
// Create this file at: app/api/auth/[...all]/route.ts

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// This handles all auth API requests (GET and POST)
export const { POST, GET } = toNextJsHandler(auth);

// Explicitly handle OPTIONS for CORS preflight if needed
export const OPTIONS = async (request: Request) => {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
};