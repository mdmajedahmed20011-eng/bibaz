/**
 * BIBAZ — Mobile Filter Drawer
 * Bottom sheet / slide-up filter panel for mobile
 * SOP §২ — Frontend Plan F3.3
 */

"use client";

import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CollectionFilters } from "./collection-filters";

export function MobileFilterDrawer() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-4 overflow-y-auto h-full pb-20">
          <CollectionFilters />
        </div>
      </SheetContent>
    </Sheet>
  );
}
