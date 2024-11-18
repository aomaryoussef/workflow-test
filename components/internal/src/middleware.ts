import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { locales } from "./navigation";

const nextIntlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: "ar",
  localePrefix: "always",
});

export const config = {
  // Match only internationalized pathnames
  // matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
  matcher: [
    // Match all pathnames except for
    "/",
    "/(ar|en)/:path*",
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};

export default function middleware(req: NextRequest): NextResponse {
  return nextIntlMiddleware(req);
}
