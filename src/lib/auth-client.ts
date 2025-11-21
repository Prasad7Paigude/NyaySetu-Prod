// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

// Create the auth client with email OTP plugin
export const authClient = createAuthClient({
  // Use environment variable or fallback
  // On client-side, NEXT_PUBLIC_ vars are available
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  
  // Add email OTP client plugin
  plugins: [
    emailOTPClient(),
  ],
});

// Export individual methods for easier imports
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  emailOtp,
} = authClient;