/**
 * BIBAZ — Storefront Loading State
 * Shows while page content is loading
 */

export default function StorefrontLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero skeleton */}
      <div className="w-full h-[300px] md:h-[400px] rounded-xl bg-muted animate-pulse mb-12" />

      {/* Section heading skeleton */}
      <div className="space-y-2 mb-8">
        <div className="h-7 w-48 rounded bg-muted animate-pulse" />
        <div className="h-4 w-72 rounded bg-muted animate-pulse" />
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3 animate-pulse">
            <div className="aspect-[3/4] rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-3 w-16 rounded bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-4 w-20 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
