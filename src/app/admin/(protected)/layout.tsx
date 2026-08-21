import { Suspense } from "react";
import { headers } from "next/headers";

import { AdminShell } from "@/components/admin/AdminShell";
import { ADMIN_USER_EMAIL_HEADER } from "@/lib/admin/constants";

function AdminContentFallback() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="h-10 w-48 animate-pulse rounded-md bg-black/[0.06]" />
      <div className="h-4 w-72 animate-pulse rounded-md bg-black/[0.04]" />
      <div className="mt-6 h-40 animate-pulse rounded-xl bg-black/[0.04]" />
    </div>
  );
}

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const email = (await headers()).get(ADMIN_USER_EMAIL_HEADER) ?? undefined;

  return (
    <AdminShell email={email}>
      <Suspense fallback={<AdminContentFallback />}>{children}</Suspense>
    </AdminShell>
  );
}
