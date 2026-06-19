"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { C, FONT } from "@/app/_components/portfolio/tokens";

/** Markdown post body styled to match the portfolio dark theme. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="kp-md" style={{ color: C.textMuted, fontFamily: FONT.grotesk }}>
      <style>{`
        .kp-md { font-size: clamp(15px, 1.6vw, 17px); line-height: 1.75; overflow-wrap: anywhere; }
        .kp-md h1, .kp-md h2, .kp-md h3, .kp-md h4 {
          font-family: ${FONT.grotesk}; color: ${C.text};
          line-height: 1.2; margin: 1.8em 0 .6em; font-weight: 700;
        }
        .kp-md h1 { font-size: 1.9em; }
        .kp-md h2 { font-size: 1.5em; }
        .kp-md h3 { font-size: 1.25em; }
        .kp-md p { margin: 0 0 1.1em; }
        .kp-md a { color: ${C.accent}; text-decoration: underline; text-underline-offset: 3px; }
        .kp-md ul, .kp-md ol { margin: 0 0 1.1em; padding-left: 1.4em; }
        .kp-md li { margin: .3em 0; }
        .kp-md blockquote {
          margin: 1.2em 0; padding: .2em 1.1em; color: ${C.textMuted2};
          border-left: 3px solid ${C.accent}; background: rgba(139,92,246,.06);
        }
        .kp-md code {
          font-family: ${FONT.mono}; font-size: .88em;
          background: rgba(255,255,255,.06); padding: .15em .4em; border-radius: 4px;
        }
        .kp-md pre {
          background: #161616; border: 1px solid ${C.border2};
          border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 1.3em 0;
        }
        .kp-md pre code { background: transparent; padding: 0; font-size: .85em; }
        .kp-md img { max-width: 100%; border-radius: 10px; margin: 1.3em 0; }
        .kp-md hr { border: none; border-top: 1px solid ${C.border2}; margin: 2em 0; }
        .kp-md table {
          display: block; width: 100%; max-width: 100%; overflow-x: auto;
          border-collapse: collapse; margin: 1.3em 0; -webkit-overflow-scrolling: touch;
        }
        .kp-md th, .kp-md td { border: 1px solid ${C.border2}; padding: 8px 12px; text-align: left; }
      `}</style>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
