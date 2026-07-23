import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <GraduationCap className="h-16 w-16 text-electricBlue" />
        <h1 className="text-gradient text-8xl font-bold tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-foreground">
          Page Not Found
        </h2>
        <p className="max-w-md text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have
          been moved or doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-electricBlue to-cyan px-8 text-sm font-medium text-white shadow-lg shadow-electricBlue/25 transition-all hover:shadow-xl hover:shadow-electricBlue/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
