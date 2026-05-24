import { getAbandonedCarts } from "@/actions/cart.actions";
import { AbandonedCartsTable } from "@/components/admin/abandoned-carts-table";
import { ShoppingCart } from "lucide-react";

export const metadata = {
  title: "Abandoned Carts | BIBAZ Admin",
  description: "Manage and recover abandoned carts",
};

export default async function AbandonedCartsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const result = await getAbandonedCarts(page, 20);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const carts = (result.carts || []) as any[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100">
            <ShoppingCart className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Abandoned Carts</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Track and recover incomplete checkouts
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        <AbandonedCartsTable carts={carts} />
      </div>
    </div>
  );
}
