"use client";

import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import LogoLink from "./links/logo";
import NavBarSearch from "./search";

const NavigationBar = () => {
  const pathname = usePathname().toLowerCase();

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-muted/40 px-4 md:px-6">
      <nav className="hidden flex-col gap-6 font-medium text-lg md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <LogoLink />
        <div className="flex gap-4 lg:gap-6" />
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-4">
          <nav className="grid gap-6 font-medium text-lg">
            <LogoLink />
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div>
          <Suspense fallback={null}>
            <NavBarSearch />
          </Suspense>
        </div>

        <ModeToggle />
      </div>
    </header>
  );
};

export default NavigationBar;
