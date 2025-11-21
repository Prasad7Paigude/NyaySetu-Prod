// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session
    const getSession = async () => {
      try {
        const { data: session } = await authClient.getSession();
        
        if (session?.user) {
          setUser(session.user);
        } else {
          // No session, redirect to login
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Session error:", error);
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#171717] rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">
              Welcome to Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="bg-black/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-cyan-500 mb-4">
              User Information
            </h2>
            
            <div className="space-y-3">
              <div className="flex">
                <span className="text-gray-400 w-24">Name:</span>
                <span className="text-white">{user?.name || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="text-gray-400 w-24">Email:</span>
                <span className="text-white">{user?.email || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="text-gray-400 w-24">Verified:</span>
                <span className={user?.emailVerified ? "text-green-500" : "text-red-500"}>
                  {user?.emailVerified ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex">
                <span className="text-gray-400 w-24">User ID:</span>
                <span className="text-gray-500 text-sm">{user?.id || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-500/10 border border-green-500/50 rounded-xl">
            <p className="text-green-500 text-center">
              🎉 Authentication is working! You are successfully logged in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}