import Image from "next/image";

export function Logo({ height = 32 }: { height?: number }) {
  return (
    <Image
      src="/logo-v2.png"
      alt="Kycks Cleaner"
      width={height * (500 / 215)}
      height={height}
      style={{ height: `${height}px`, width: "auto" }}
      unoptimized
      priority
    />
  );
}
