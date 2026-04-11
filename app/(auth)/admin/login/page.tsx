"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useScrollToFirstError } from "@/hooks/useScrollToFirstError";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import Link from "next/link";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth.schema";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] text-zinc-900 shadow-sm outline-none transition-[border-color,box-shadow,background-color] placeholder:text-zinc-400 md:text-sm";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, setAuthenticated, clearAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const redirectParam = searchParams.get("redirect");
    if (redirectParam) {
      if (isAuthenticated) clearAuth();
      return;
    }
    if (isAuthenticated) {
      router.replace("/admin/dashboard");
    }
  }, [isAuthenticated, router, searchParams, clearAuth]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useScrollToFirstError(errors);

  async function onSubmit(data: LoginFormData) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error ?? "Login failed");
        return;
      }

      setAuthenticated(result.email ?? data.email);
      toast.success("Welcome back!");
      const redirectTo = searchParams.get("redirect") || "/admin/dashboard";
      router.replace(
        redirectTo.startsWith("/admin") ? redirectTo : "/admin/dashboard",
      );
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleSubmit(onSubmit)(e);
  };

  if (!mounted) return null;

  if (isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-brand-charcoal">
        <div className="flex flex-col items-center gap-4 text-center text-white">
          <Loader2 className="h-10 w-10 animate-spin text-brand-gold" />
          <p className="text-sm font-medium tracking-wide">Signing you in…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] bg-zinc-100">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(183,147,84,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_100%_100%,rgba(26,26,26,0.06),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(183,147,84,0.08),transparent_60%)]" />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        <div className="relative flex flex-1 flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8 lg:px-12 lg:py-10">
          <main className="flex flex-1 flex-col justify-center">
            <div className="mx-auto w-full max-w-[440px]">
              <div className="relative overflow-hidden rounded-[1.35rem] border border-transparent bg-transparent py-8 sm:py-9 lg:py-10">
                <div className="relative">
                  <Link
                    href="/"
                    className="group mb-8 inline-flex items-center gap-3 rounded-2xl outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-brand-gold/40"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-zinc-200/60 bg-zinc-50/70 shadow-sm ring-1 ring-black/[0.03] transition group-hover:border-zinc-300/80 group-hover:bg-zinc-100/80 group-hover:shadow-md">
                      <Image
                        src="/logo-icon-bg.png"
                        alt=""
                        width={40}
                        height={40}
                        className="h-8 w-8 object-contain"
                      />
                    </span>
                    <span className="flex flex-col justify-center font-heading text-[13px] font-bold uppercase leading-[1.15] tracking-[0.12em] text-zinc-900 sm:text-sm">
                      <span>The Real</span>
                      <span>Business</span>
                    </span>
                  </Link>

                  <header className="mb-8 space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold">
                      Secure sign-in
                    </p>
                    <h1 className="font-heading text-3xl font-bold tracking-tight text-zinc-900 sm:text-[2rem] sm:leading-tight">
                      Welcome back
                    </h1>
                    <p className="max-w-sm text-[15px] leading-relaxed text-zinc-500">
                      Use your admin email and password to continue to the
                      dashboard.
                    </p>
                  </header>

                  <form
                    onSubmit={onFormSubmit}
                    className="space-y-5"
                    noValidate
                  >
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-zinc-800"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        autoComplete="email"
                        {...register("email")}
                        className={cn(
                          inputBase,
                          errors.email
                            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border-zinc-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20",
                        )}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600" role="alert">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-zinc-800"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          {...register("password")}
                          className={cn(
                            inputBase,
                            "pr-12",
                            errors.password
                              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                              : "border-zinc-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20",
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 md:h-10 md:w-10"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" aria-hidden />
                          ) : (
                            <Eye className="h-5 w-5" aria-hidden />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-600" role="alert">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "relative mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold shadow-lg transition",
                        "bg-brand-gold text-brand-gold-foreground",
                        "hover:brightness-[1.05] hover:shadow-xl hover:shadow-brand-gold/15",
                        "active:scale-[0.99] active:brightness-[0.98]",
                        "disabled:pointer-events-none disabled:opacity-55",
                      )}
                    >
                      {isSubmitting && (
                        <Loader2
                          className="h-5 w-5 shrink-0 animate-spin"
                          aria-hidden
                        />
                      )}
                      {isSubmitting ? "Signing in…" : "Sign in"}
                    </button>
                  </form>

                  <p className="mt-8 text-center">
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-zinc-500 transition hover:text-brand-gold"
                    >
                      <ArrowLeft className="h-4 w-4 opacity-70" aria-hidden />
                      Back to site
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
