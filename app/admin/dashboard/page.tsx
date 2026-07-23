import type { Metadata } from "next";
import Link from "next/link";
import { LogOut, ArrowLeftRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { RateControl } from "@/components/admin/rate-control";
import { ModeSwitch } from "@/components/admin/mode-switch";
import { HistoryTable } from "@/components/admin/history-table";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ExchangeService, HistoryService, AuthService } from "@/services";
import { siteConfig } from "@/config/site";
import { SettingsRepository } from "@/repositories/settings.repository";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

async function logout() {
  "use server";
  await AuthService.clearAuthCookie();
}

export default async function DashboardPage() {
  const [rateInfo, settings, historyData] = await Promise.all([
    ExchangeService.getCurrentRate(),
    SettingsRepository.getSettings(),
    HistoryService.getHistory(undefined, 20),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      {/* Dashboard header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label={`${siteConfig.name} home`}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-brand">
              <ArrowLeftRight className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold">{siteConfig.name}</span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              / Admin
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Site
            </Link>

            <ThemeToggle />

            {/* Logout form */}
            <form action={logout}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="gap-2"
                aria-label="Log out of admin dashboard"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage exchange rates and monitor API health
          </p>
        </div>

        {/* Stats grid */}
        <section aria-label="Dashboard statistics" className="mb-8">
          <DashboardStats rateInfo={rateInfo} />
        </section>

        <Separator className="mb-8 opacity-50" />

        {/* Rate controls */}
        <section aria-label="Rate controls" className="mb-8">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Rate Configuration</h2>
            <p className="text-sm text-muted-foreground">
              Update the manual rate or switch between rate sources
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Manual rate */}
            <Card className="border-border/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Manual Rate</CardTitle>
                <CardDescription>
                  Set a fixed exchange rate manually
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RateControl currentManualRate={settings.manualRate} />
              </CardContent>
            </Card>

            {/* Mode & live rate */}
            <Card className="border-border/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Rate Source</CardTitle>
                <CardDescription>
                  Switch between manual and live API rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ModeSwitch
                  currentMode={settings.mode}
                  currentLiveRate={settings.liveRate}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="mb-8 opacity-50" />

        {/* History table */}
        <section aria-label="Exchange rate history">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Change History</h2>
            <p className="text-sm text-muted-foreground">
              A log of all exchange rate changes
            </p>
          </div>
          <Card className="border-border/60">
            <CardContent className="p-6">
              <HistoryTable initialData={historyData} />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
