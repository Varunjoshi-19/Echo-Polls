import { connectDB } from "@/db/mongo";
import { User } from "@/schema/user";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();
    const polls = await User.countDocuments();
    return NextResponse.json(polls);
}