import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { STUDIO_ENABLED } from "@/lib/config";

// Until login ships in v2, the SaaS studio routes redirect to the
// invitation-only wall. The page code stays in the repo, just unreachable.
export function middleware(req: NextRequest) {
  if (STUDIO_ENABLED) return NextResponse.next();
  return NextResponse.redirect(new URL("/signin", req.url));
}

export const config = {
  matcher: ["/create/:path*", "/orders/:path*", "/quiz/:path*"],
};
