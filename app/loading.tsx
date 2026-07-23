import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function HomeLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="w-full max-w-md space-y-4 rounded-2xl border border-border/60 bg-card p-6 shadow-xl">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-14 w-full rounded-lg" />
          <div className="flex justify-center">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-14 w-full rounded-lg" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
