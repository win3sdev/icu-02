import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";
import { optimizePageRuntime, handleStaticJs } from "@/lib/middlewareHandlers";

export default async function middleware(request: NextRequestWithAuth) {
  const pathname = request.nextUrl.pathname;
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  const pageResponse = await optimizePageRuntime(request);
  if (pageResponse) return pageResponse;

  const staticResponse = handleStaticJs(pathname);
  if (staticResponse) return staticResponse;

  // Public paths that don't require authentication
  const isPublicPath = request.nextUrl.pathname === "/login";

  // Redirect authenticated users away from public paths
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to login page
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Configure protected routes
export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/_next/static/:path*"],
};
