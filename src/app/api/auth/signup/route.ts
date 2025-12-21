import { signupSchema } from "@/schema/auth";
import { User } from "@/schema/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/db/mongo";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const { username, email, password } = signupSchema.parse(body);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "Email already in use" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (err: any) {
        console.error("Signup error:", err);

        if (err.name === "ZodError") {
            return NextResponse.json(
                { error: err.errors.map((e: any) => e.message).join(", ") },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
