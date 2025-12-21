import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { loginSchema } from "@/schema/auth";
import { User } from "@/schema/user";
import bcrypt from "bcryptjs";
import { connectDB } from "@/db/mongo";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_KEY!);

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { email, password } = loginSchema.parse(body);

        if (!email.trim() || !password.trim()) {
            return NextResponse.json({ error: "Email or password is missing !!" }, { status: 401 });
        }

        const user = await User.findOne({ email });
      
        const userInfo = { username : user.username , email : user.email , id : user._id  }

        if (!user) return NextResponse.json({ error: "User not found !" }, { status: 401 });

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return NextResponse.json({ error: "Incorrect passcode" }, { status: 401 });
        }


        const accessToken = await new SignJWT({ email })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("10m")
            .sign(secret);

        const refreshToken = await new SignJWT({ email })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("7d")
            .sign(refreshSecret);

        const res = NextResponse.json({ ok: true , user : userInfo });


        res.cookies.set("access-token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 600
        });

        res.cookies.set("refresh-token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7
        });

        return res;

    }
    catch (error: any) {
        return NextResponse.json({ error: `Server Errror! ${error.message}` }, { status: 401 });
    }
}
