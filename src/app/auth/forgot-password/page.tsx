"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-lightGray/50 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="mb-8 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-electricBlue to-cyan">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-navy">YK Academy</span>
          </Link>

          <div className="rounded-3xl border border-lightGray bg-white p-8 shadow-sm text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <MailCheck className="h-7 w-7 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-navy">Check Your Email</h1>
            <p className="mt-2 text-sm text-mediumGray">
              If an account exists with <span className="font-medium text-navy">{email}</span>,
              we&apos;ve sent a password reset link. The link expires in 1 hour.
            </p>
            <Button className="mt-6 w-full" size="lg" asChild>
              <Link href="/auth/signin">Back to Sign In</Link>
            </Button>
          </div>
        </motion.div>
    </main>
  );
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-lightGray/50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-electricBlue to-cyan">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-navy">YK Academy</span>
        </Link>

        <div className="rounded-3xl border border-lightGray bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-navy">Forgot Password?</h1>
            <p className="mt-1 text-sm text-mediumGray">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Send Reset Link
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-mediumGray">
          Remember your password?{" "}
          <Link
            href="/auth/signin"
            className="font-medium text-electricBlue hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
