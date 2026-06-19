"use client";

import { useEffect } from "react";

/**
 * Records one view per browser per post. A stable per-browser session id is
 * kept in localStorage and POSTed to /api/blog/view, which dedupes server-side
 * via the post_views unique (postId, sessionId) constraint.
 */
export function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    let sessionId = localStorage.getItem("kp_blog_sid");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("kp_blog_sid", sessionId);
    }
    void fetch("/api/blog/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, sessionId }),
      keepalive: true,
    }).catch(() => {
      /* best-effort */
    });
  }, [postId]);

  return null;
}
