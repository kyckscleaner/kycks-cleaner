import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const dimension = Math.min(Math.max(parseInt(size, 10) || 512, 32), 1024);

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0d",
        }}
      >
        {/* crown */}
        <div style={{ position: "absolute", width: "9%", height: "9%", top: "22%", left: "35%", background: "#a855f7", borderRadius: "999px", display: "flex" }} />
        <div style={{ position: "absolute", width: "9%", height: "14%", top: "16%", left: "45.5%", background: "#a855f7", borderRadius: "999px", display: "flex" }} />
        <div style={{ position: "absolute", width: "9%", height: "9%", top: "22%", left: "56%", background: "#a855f7", borderRadius: "999px", display: "flex" }} />
        {/* car body */}
        <div
          style={{
            position: "absolute",
            width: "62%",
            height: "24%",
            background: "linear-gradient(90deg, #7c3aed 0%, #a855f7 100%)",
            borderRadius: "999px",
            top: "56%",
            display: "flex",
          }}
        />
        {/* car cabin */}
        <div
          style={{
            position: "absolute",
            width: "34%",
            height: "18%",
            background: "#a855f7",
            borderRadius: "40px 40px 0 0",
            top: "42%",
            display: "flex",
          }}
        />
        {/* wheels */}
        <div
          style={{
            position: "absolute",
            width: "12%",
            height: "12%",
            background: "#f5f3ff",
            borderRadius: "999px",
            left: "26%",
            top: "64%",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "12%",
            height: "12%",
            background: "#f5f3ff",
            borderRadius: "999px",
            right: "26%",
            top: "64%",
            display: "flex",
          }}
        />
      </div>
    ),
    { width: dimension, height: dimension }
  );
}
