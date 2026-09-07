import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0d",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "70%",
            height: "140%",
            top: "-20%",
            left: "15%",
            background: "radial-gradient(circle, rgba(124,58,237,0.5) 0%, rgba(0,0,0,0) 65%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 9999,
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
              display: "flex",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 96, fontWeight: 900, color: "white", letterSpacing: -2 }}>
              KYCKS <span style={{ color: "#a855f7", marginLeft: 20 }}>CLEANER</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 34, color: "rgba(255,255,255,0.7)" }}>
          Nettoyage automobile à domicile — Granville et environs
        </div>
      </div>
    ),
    { ...size }
  );
}
