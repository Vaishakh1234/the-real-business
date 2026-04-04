import { ImageResponse } from "next/og";

export const alt = "The Real Business — Palakkad real estate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a2b4b 0%, #0f172a 100%)",
        padding: 72,
      }}
    >
      <div
        style={{
          fontSize: 52,
          fontWeight: 700,
          color: "#c9a227",
          lineHeight: 1.1,
          maxWidth: 920,
          letterSpacing: -0.02,
        }}
      >
        The Real Business
      </div>
      <div
        style={{
          marginTop: 20,
          fontSize: 26,
          color: "rgba(255,255,255,0.9)",
          maxWidth: 820,
          lineHeight: 1.4,
        }}
      >
        Real estate marketing · Property consultancy · Buying and selling
        support in Palakkad, Kerala
      </div>
    </div>,
    { ...size },
  );
}
