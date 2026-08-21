export default function AdminLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="იტვირთება">
      <div className="h-10 w-48 animate-pulse rounded-md bg-black/[0.06]" />
      <div className="h-4 w-72 animate-pulse rounded-md bg-black/[0.04]" />
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="h-24 animate-pulse rounded-xl bg-black/[0.04]" />
        <div className="h-24 animate-pulse rounded-xl bg-black/[0.04]" />
        <div className="h-24 animate-pulse rounded-xl bg-black/[0.04]" />
      </div>
      <div className="mt-4 h-64 animate-pulse rounded-xl bg-black/[0.04]" />
    </div>
  );
}
