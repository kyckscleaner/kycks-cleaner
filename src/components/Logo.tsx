import Image from "next/image";

export function Logo({ height = 32 }: { height?: number }) {
  return (
    <Image
      src="/logo-v3.png"
      alt="Kycks Cleaner"
      width={height * (520 / 280)}
      height={height}
      style={{ height: `${height}px`, width: "auto" }}
      unoptimized
      priority
    />
  );
}
