import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-brand-subtle">
        <Compass className="h-8 w-8 text-primary" />
      </div>
      <p className="text-7xl font-black tracking-tight text-gradient">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-3 max-w-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        aria-label="Go back to homepage"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Converter
      </Link>
    </div>
  );
}
