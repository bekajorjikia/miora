import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  ADMIN_USER_EMAIL_HEADER,
  ADMIN_USER_ID_HEADER,
} from "@/lib/admin/constants";

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  // Never trust client-supplied identity headers.
  requestHeaders.delete(ADMIN_USER_ID_HEADER);
  requestHeaders.delete(ADMIN_USER_EMAIL_HEADER);

  let pendingCookies: { name: string; value: string; options?: object }[] = [];

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      request.nextUrl.pathname !== "/admin/login"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "missing-config");
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl.replace(/\/+$/, ""), supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        pendingCookies = cookiesToSet;
        supabaseResponse = NextResponse.next({
          request: { headers: requestHeaders },
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isLogin = path === "/admin/login";
  const isAdmin = path.startsWith("/admin");

  if (isAdmin && !isLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (isLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (user) {
    requestHeaders.set(ADMIN_USER_ID_HEADER, user.id);
    if (user.email) {
      requestHeaders.set(ADMIN_USER_EMAIL_HEADER, user.email);
    }
  }

  // Rebuild so Server Components see the final identity headers.
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
