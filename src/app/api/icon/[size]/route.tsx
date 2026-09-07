import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const dimension = Math.min(Math.max(parseInt(size, 10) || 512, 32), 1024);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0b3d91 0%, #0ea5e9 100%)",
        }}
      >
        {/* car body */}
        <div
          style={{
            position: "absolute",
            width: "62%",
            height: "26%",
            background: "#f8fafc",
            borderRadius: "999px",
            display: "flex",
          }}
        />
        {/* car cabin */}
        <div
          style={{
            position: "absolute",
            width: "34%",
            height: "20%",
            background: "#f8fafc",
            borderRadius: "40px 40px 0 0",
            top: "34%",
            display: "flex",
          }}
        />
        {/* wheels */}
        <div
          style={{
            position: "absolute",
            width: "12%",
            height: "12%",
            background: "#0f172a",
            borderRadius: "999px",
            left: "26%",
            top: "58%",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "12%",
            height: "12%",
            background: "#0f172a",
            borderRadius: "999px",
            right: "26%",
            top: "58%",
            display: "flex",
          }}
        />
        {/* water droplet */}
        <div
          style={{
            position: "absolute",
            width: "14%",
            height: "14%",
            background: "#ffffff",
            borderRadius: "0 999px 999px 999px",
            transform: "rotate(45deg)",
            top: "14%",
            right: "20%",
            opacity: 0.9,
            display: "flex",
          }}
        />
      </div>
    ),
    { width: dimension, height: dimension }
  );
}
