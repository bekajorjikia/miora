import Link from "next/link";

import { logoutAction } from "@/app/admin/actions/auth";

const nav = [
  { href: "/admin", label: "მიმოხილვა", exact: true },
  { href: "/admin/items", label: "კერძები" },
  { href: "/admin/categories", label: "კატეგორიები" },
];

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email?: string;
}) {
  return (
    <div className="min-h-full bg-[#f4f3ef] text-[#1a1a18]">
      <header className="border-b border-black/10 bg-[#fdfcf9]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display text-2xl font-semibold tracking-wide">
              MIORA ადმინი
            </Link>
            <nav className="flex flex-wrap gap-1" aria-label="ადმინი">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-[#55554d] transition-colors hover:bg-black/[0.04] hover:text-[#1a1a18]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/menu"
              target="_blank"
              className="text-sm font-semibold text-[#626e2b] hover:underline"
            >
              მენიუს ნახვა
            </Link>
            {email ? (
              <span className="hidden text-xs text-[#77776e] sm:inline">{email}</span>
            ) : null}
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-black/[0.03]"
              >
                გასვლა
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
