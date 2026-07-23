import type { Metadata } from "next";
import { ExchangeService } from "@/services";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConverterCard } from "@/components/converter/converter-card";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — USD to BDT`,
  description: siteConfig.description,
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rateInfo = await ExchangeService.getCurrentRate();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
        {/* Decorative gradient background */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-[400px] w-[400px] rounded-full bg-brand-secondary/5 blur-3xl" />
        </div>

        {/* Hero text */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-gradient">USD ↔ BDT</span>
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Real-time currency conversion between US Dollar and Bangladeshi Taka
          </p>
        </div>

        {/* Converter card */}
        <ConverterCard rateInfo={rateInfo} />

        {/* Disclaimer */}
        <p className="mt-6 max-w-sm text-center text-xs text-muted-foreground/60">
          Rates are for informational purposes only and may differ from bank
          rates. Not financial advice.
        </p>
      </main>

      <Footer />
    </div>
  );
}
