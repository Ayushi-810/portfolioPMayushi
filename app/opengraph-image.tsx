import { ImageResponse } from "next/og";
import { meta } from "@/content/portfolio";

export const alt = meta.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FAFAF7",
          color: "#0E1116",
          padding: 72,
          justifyContent: "space-between",
          alignItems: "center",
          backgroundImage:
            "linear-gradient(rgba(31,79,209,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(31,79,209,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: "#565C68" }}>
            Ayushi Singh · Product Manager
          </div>
          <div style={{ fontSize: 68, lineHeight: 1.05, marginTop: 28, letterSpacing: -2 }}>
            Every loan starts with a property that needs work.
          </div>
          <div style={{ fontSize: 26, marginTop: 28, color: "#1F4FD1" }}>Lending & Fintech</div>
        </div>
        <svg width="380" height="300" viewBox="120 110 360 310">
          <path d="M140 394h320v16H140z" fill="#CBC6BC" stroke="#0E1116" strokeWidth="1.5" />
          <path d="M150 236H450V394H150Z" fill="#B5553A" stroke="#0E1116" strokeWidth="1.5" />
          <path d="M130 239L300 125L470 239Z" fill="#3E4553" stroke="#0E1116" strokeWidth="1.5" />
          <rect x="180" y="262" width="60" height="58" fill="#F6D98F" stroke="#0E1116" strokeWidth="1.5" />
          <rect x="360" y="262" width="60" height="58" fill="#F6D98F" stroke="#0E1116" strokeWidth="1.5" />
          <rect x="276" y="306" width="48" height="88" fill="#2E5E6E" stroke="#0E1116" strokeWidth="1.5" />
          <path d="M120 410H480" stroke="#0E1116" strokeWidth="2" />
        </svg>
      </div>
    ),
    size,
  );
}
