import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#6D1533",
          color: "#FCF4EF",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 64, letterSpacing: 12, fontWeight: 600 }}>
          MARVEL&apos;S
        </div>
        <div style={{ fontSize: 22, letterSpacing: 16, marginTop: 8, color: "#E7C3BC" }}>
          ONLINE CLOTHINGS
        </div>
        <div style={{ fontSize: 30, marginTop: 40, color: "#F3DDD7" }}>
          Timeless style. Made for you.
        </div>
      </div>
    ),
    size,
  );
}
