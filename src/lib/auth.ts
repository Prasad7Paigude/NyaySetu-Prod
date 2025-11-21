// lib/auth.ts
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { Resend } from "resend";

// ============================================
// MONGODB CONNECTION
// ============================================
const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db(process.env.DB_NAME || "nyaysetu");

// ============================================
// EMAIL SERVICE (RESEND)
// ============================================
const resend = new Resend(process.env.RESEND_API_KEY);

// ============================================
// BETTER AUTH CONFIGURATION
// ============================================
export const auth = betterAuth({
  database: mongodbAdapter(db),
  
  // Base URL - must match your deployment
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  
  // Secret for signing tokens
  secret: process.env.BETTER_AUTH_SECRET,
  
  // Trusted origins for CORS
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://nyay-setu-prod.vercel.app",
    process.env.BETTER_AUTH_URL || "",
    process.env.NEXT_PUBLIC_APP_URL || "",
  ].filter(Boolean),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 6,
    autoSignIn: false,
  },

  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: false,
        input: true,
      },
      lastName: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      sendVerificationOnSignUp: true,

      async sendVerificationOTP({ email, otp, type }) {
        let subject = "";
        let message = "";

        if (type === "email-verification") {
          subject = "Verify your email - Nyaysetu AI";
          message = "Please use this code to verify your email address.";
        } else if (type === "sign-in") {
          subject = "Sign in OTP - Nyaysetu AI";
          message = "Please use this code to sign in to your account.";
        } else if (type === "forget-password") {
          subject = "Reset your password - Nyaysetu AI";
          message = "Please use this code to reset your password.";
        }

        console.log(`📧 Attempting to send OTP to: ${email}`);
        console.log(`📧 OTP Code: ${otp}`); // Remove in production

        try {
          const emailResponse = await resend.emails.send({
            from: "Nyaysetu AI <NyaysetuAI@shivrajtaware.in>",
            to: email,
            subject: subject,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #000000; padding: 40px 20px;">
                  <div style="max-width: 500px; margin: 0 auto; background-color: #171717; border-radius: 16px; padding: 40px;">
                    <h1 style="color: #0891b2; margin: 0 0 10px 0; font-size: 24px;">Nyaysetu AI</h1>
                    <p style="color: #d1d5db; margin: 0 0 30px 0; font-size: 14px;">${message}</p>
                    
                    <div style="background-color: #000000; border-radius: 12px; padding: 30px; text-align: center; margin: 20px 0;">
                      <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your verification code</p>
                      <p style="color: #0891b2; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0;">${otp}</p>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 12px; margin: 20px 0 0 0;">
                      This code expires in 5 minutes. If you didn't request this code, please ignore this email.
                    </p>
                  </div>
                </body>
              </html>
            `,
          });
          console.log(`✅ OTP sent successfully to ${email}`, emailResponse);
        } catch (error) {
          console.error("❌ Failed to send OTP email:", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;