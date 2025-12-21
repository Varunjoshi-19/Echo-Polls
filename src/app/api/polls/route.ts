import { connectDB } from "@/db/mongo";
import { Poll } from "@/schema/poll";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        await connectDB();
        const { question, options, createdBy } = await req.json();
        const poll = await Poll.create({
            question,
            options: options.map((text: any) => {
                return { text: text }
            }),
            createdBy
        });

        return NextResponse.json({ poll }, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create poll" },
            { status: 500 }
        )
    }

}

export async function GET() {
    await connectDB();
    const polls = await Poll.find({}).sort({ createdAt: -1 });

    return NextResponse.json(polls);
}