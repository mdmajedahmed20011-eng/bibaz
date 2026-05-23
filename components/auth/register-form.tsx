/**
 * BIBAZ — Register Form Component
 * Name, Email, Phone, Password, Confirm Password with luxury visual guidelines.
 * SOP §৪A — Authentication + client validation
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    else if (formData.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      newErrors.email = "Enter a valid email address";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^(\+880|0)1[3-9]\d{8}$/.test(formData.phone.trim()))
      newErrors.phone = "Enter a valid Bangladesh phone number";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setServerError("Registration is currently unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Server Error */}
      {serverError && (
        <div className="p-3.5 bg-sale/5 border border-sale/25 text-xs text-sale font-bold uppercase tracking-wider">
          {serverError}
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-[10px] uppercase tracking-wider text-foreground font-semibold">
          Full Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="w-full h-11 px-4 border border-border/60 bg-transparent text-sm transition-all focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground bg-[#f8f5f0]/10 hover:bg-[#f8f5f0]/30 rounded-none placeholder:text-muted-foreground/30 text-foreground font-medium"
          placeholder="First & Last Name"
          autoComplete="name"
          disabled={isLoading}
        />
        {errors.name && <p className="text-[10px] text-sale font-bold uppercase tracking-wider mt-1">{errors.name}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="reg-email" className="text-[10px] uppercase tracking-wider text-foreground font-semibold">
          Email Address *
        </label>
        <input
          id="reg-email"
          type="email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="w-full h-11 px-4 border border-border/60 bg-transparent text-sm transition-all focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground bg-[#f8f5f0]/10 hover:bg-[#f8f5f0]/30 rounded-none placeholder:text-muted-foreground/30 text-foreground font-medium"
          placeholder="your@email.com"
          autoComplete="email"
          disabled={isLoading}
        />
        {errors.email && <p className="text-[10px] text-sale font-bold uppercase tracking-wider mt-1">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <label htmlFor="phone" className="text-[10px] uppercase tracking-wider text-foreground font-semibold">
          Phone Number *
        </label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          className="w-full h-11 px-4 border border-border/60 bg-transparent text-sm transition-all focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground bg-[#f8f5f0]/10 hover:bg-[#f8f5f0]/30 rounded-none placeholder:text-muted-foreground/30 text-foreground font-medium"
          placeholder="01XXXXXXXXX"
          autoComplete="tel"
          disabled={isLoading}
        />
        {errors.phone && <p className="text-[10px] text-sale font-bold uppercase tracking-wider mt-1">{errors.phone}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="reg-password" className="text-[10px] uppercase tracking-wider text-foreground font-semibold">
          Password *
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => updateField("password", e.target.value)}
            className="w-full h-11 px-4 pr-11 border border-border/60 bg-transparent text-sm transition-all focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground bg-[#f8f5f0]/10 hover:bg-[#f8f5f0]/30 rounded-none placeholder:text-muted-foreground/30 text-foreground font-medium"
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-[10px] text-sale font-bold uppercase tracking-wider mt-1">{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label htmlFor="confirm-password" className="text-[10px] uppercase tracking-wider text-foreground font-semibold">
          Confirm Password *
        </label>
        <input
          id="confirm-password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => updateField("confirmPassword", e.target.value)}
          className="w-full h-11 px-4 border border-border/60 bg-transparent text-sm transition-all focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground bg-[#f8f5f0]/10 hover:bg-[#f8f5f0]/30 rounded-none placeholder:text-muted-foreground/30 text-foreground font-medium"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-[10px] text-sale font-bold uppercase tracking-wider mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Terms Agreement */}
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider leading-relaxed">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-foreground font-bold">
          Terms & Conditions
        </Link>{" "}
        and{" "}
        <Link href="/refund-policy" className="underline hover:text-foreground font-bold">
          Refund Policy
        </Link>
        .
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-foreground text-background font-bold text-xs uppercase tracking-[0.2em] hover:bg-foreground/90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 rounded-none cursor-pointer"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? "Creating account..." : "Create Account"}
      </button>

      {/* Guest Notice */}
      <p className="text-center text-[10px] uppercase tracking-wider text-muted-foreground pt-2">
        Alternatively, you can{" "}
        <Link href="/collections/new-arrivals" className="underline hover:text-foreground font-bold">
          Shop As Guest
        </Link>
      </p>
    </form>
  );
}
