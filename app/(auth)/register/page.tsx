/**
 * BIBAZ — Register Page
 * SOP §২ — Frontend Plan PAGE 6
 *
 * Route: /register
 * Features: Name, Email, Phone, Password, Confirm Password — Zod validated
 */

import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your BIBAZ account for a better shopping experience.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block text-3xl font-bold tracking-tight">
            BIBAZ
          </Link>
          <h1 className="text-xl font-semibold">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Join BIBAZ for a personalized shopping experience
          </p>
        </div>

        {/* Register Form */}
        <RegisterForm />

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
