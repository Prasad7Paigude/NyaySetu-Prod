// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import LoggedNav from "@/components/navbar/DashNavbar";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-lg">Checking authentication...</p>
      </div>
    );
  }

  const user = session.user;

  return (
    <>
      <LoggedNav />

      <div className="min-h-screen bg-black pt-24 px-4 pb-12 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome, {user.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-gray-400 text-lg">
            Your personal dashboard for Nyaysetu AI.
          </p>
        </div>

        {/* Profile Card */}
        <NeonGradientCard className="w-full max-w-md !bg-[#171717] [&>*]:!bg-[#171717]">
          <div className="p-6 flex flex-col items-center">
            {/* User Name */}
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {user.name || "User"}
            </h2>

            {/* Account info */}
            <div className="space-y-2 w-full text-left">
              <div className="flex">
                <span className="text-gray-400 font-medium w-28">Name:</span>
                <span className="text-white">{user.name || "N/A"}</span>
              </div>

              <div className="flex">
                <span className="text-gray-400 font-medium w-28">Email:</span>
                <span className="text-white">{user.email}</span>
              </div>

              <div className="flex">
                <span className="text-gray-400 font-medium w-28">Email Status:</span>
                <span className={user.emailVerified ? "text-green-500" : "text-yellow-500"}>
                  {user.emailVerified ? "Verified ✓" : "Pending"}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              className="mt-8 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
            >
              Logout
            </Button>
          </div>
        </NeonGradientCard>

        {/* Success Message */}
        <div className="mt-8 p-4 bg-green-500/10 border border-green-500/50 rounded-xl max-w-md w-full">
          <p className="text-green-500 text-center">
            🎉 You are successfully logged in!
          </p>
        </div>
      </div>
    </>
  );
}