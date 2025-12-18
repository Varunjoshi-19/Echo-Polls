import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { loginSchema } from "@/schema/loginSchema";
const secert = new TextEncoder().encode(process.env.JWT_SECRET!);
const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_KEY!);

const dummyUser = {
    email: "test@example.com",
    password: "password123",
}

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    if (email != dummyUser.email || password != dummyUser.password) {
        return NextResponse.json(
            { error: "Invalid email or password" },
            { status: 401 }
        );
    }

    const accessToken = await new SignJWT({ email })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("10m")
        .sign(secert);


    const refreshToken = await new SignJWT({ email })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(refreshSecret);

    const res = NextResponse.json({ ok: true });
    res.cookies.set("access-token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 600
    });

    const maxAge = 60 * 60 * 24 * 7;
    res.cookies.set("refresh-token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: maxAge
    });

    return res;
}