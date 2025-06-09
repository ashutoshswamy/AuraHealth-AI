import type { ReactNode } from "react";
import { AppSidebar } from "@/components/core/sidebar";
import { UserNav } from "@/components/core/user-nav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Leaf, PanelLeft } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { MobileNav } from "@/components/core/mobile-nav";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AppSidebar user={user} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="sm:max-w-xs bg-sidebar text-sidebar-foreground p-0"
            >
              <MobileNav />
            </SheetContent>
          </Sheet>
          <div className="relative ml-auto flex flex-1 md:grow-0">
            {/* Search bar can go here */}
          </div>
          <UserNav user={user} />
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 bg-background md:rounded-tl-xl">
          {children}
        </main>
      </div>
    </div>
  );
}
