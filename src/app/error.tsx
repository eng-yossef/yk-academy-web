"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Something went wrong
        </h1>
        <p className="max-w-md text-muted-foreground">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-electricBlue to-cyan px-8 text-sm font-medium text-white shadow-lg shadow-electricBlue/25 transition-all hover:shadow-xl hover:shadow-electricBlue/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-electricBlue/30 bg-transparent px-8 text-sm font-medium text-electricBlue transition-all hover:bg-electricBlue/5 active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
