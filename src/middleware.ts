import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("access-token")?.value;

  if (pathname === "/sign-in") {
    if (token) {
      try {
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL("/", req.url));
      } catch {
        return NextResponse.next();
      }
    }

    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)"
  ]
}
