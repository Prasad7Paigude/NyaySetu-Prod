// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Create handlers from Better Auth
const handlers = toNextJsHandler(auth);

// Export handlers
export const GET = handlers.GET;
export const POST = handlers.POST;