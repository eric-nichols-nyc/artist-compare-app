"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Footer } from "@/app/(admin)/admin/_components/footer";
import { Sidebar } from "@/app/(admin)/admin/_components/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { Toaster } from "@/components/ui/sonner";
import { ArtistProvider } from "@/context/artist-context";

export default function AdminPanelLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <ArtistProvider>
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
          {children}
        <Toaster />
      </main>
      <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <Footer />
      </footer>
      </ArtistProvider>
  );
}
