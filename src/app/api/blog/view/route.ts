import { NextResponse } from "next/server";

import { recordView } from "@/server/blog";

export async function POST(req: Request) {
  try {
    const { postId, sessionId } = (await req.json()) as {
      postId?: string;
      sessionId?: string;
    };
    if (!postId || !sessionId) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await recordView(postId, sessionId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
