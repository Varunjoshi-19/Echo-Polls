import { connectDB } from "@/db/mongo";
import { Poll } from "@/schema/poll";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { userId, pollId, optionIdx } = await req.json();

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return NextResponse.json(
                { error: "Poll not found" },
                { status: 404 }
            );
        }

        if (!poll.votesBy) {
            poll.votesBy = new Map();
        }

        if (poll.votesBy.has(userId)) {
            return NextResponse.json(
                { error: "You have already voted. Vote is final." },
                { status: 403 }
            );
        }

        poll.options[optionIdx].votes += 1;
        poll.votesBy.set(userId, optionIdx);

        poll.markModified("votesBy");
        poll.markModified("options");

        await poll.save();

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to add vote" },
            { status: 500 }
        );
    }
}
