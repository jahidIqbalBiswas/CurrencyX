import type { Metadata } from "next";
import { ArrowLeftRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/login-form";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to the currency converter admin dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Theme toggle */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-brand shadow-lg">
          <ArrowLeftRight className="h-6 w-6 text-white" />
        </div>
        <p className="text-xl font-bold">{siteConfig.name}</p>
      </div>

      {/* Login card */}
      <Card className="w-full max-w-sm border-border/60 shadow-xl shadow-primary/5">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl">Admin Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-muted-foreground/60">
        &copy; {new Date().getFullYear()} {siteConfig.name}. Secured with JWT.
      </p>
    </div>
  );
}
