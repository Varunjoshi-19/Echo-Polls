import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete("access-token");
    res.cookies.delete("refresh-token");

    return res;
}