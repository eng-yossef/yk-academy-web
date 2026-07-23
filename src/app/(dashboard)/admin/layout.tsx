"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LoadingPage } from "@/components/shared/loading-page";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") return <LoadingPage />;
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) return <LoadingPage />;

  return <>{children}</>;
}
