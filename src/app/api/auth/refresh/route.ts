import { jwtVerify, SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: NextRequest) {

    const refreshToken = req.cookies.get("refresh-token")?.value;
    if (!refreshToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { payload } = await jwtVerify(refreshToken, secret);
        const newAccessToken = await new SignJWT({ email: payload.email })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("10m")
            .sign(secret);

        const res = NextResponse.json({ ok: true });

        res.cookies.set("access-token", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 600
        });

        return res;
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}