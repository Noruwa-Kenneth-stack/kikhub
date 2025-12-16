"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // adjust path

export default function DashboardPageWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/"); // redirect to login if not authenticated
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return <div>Loading...</div>;

  return <>{children}</>;
}
