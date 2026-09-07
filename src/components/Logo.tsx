import Image from "next/image";

const NATURAL_WIDTH = 520;
const NATURAL_HEIGHT = 280;

export function Logo({ height = 32 }: { height?: number }) {
  const width = Math.round(height * (NATURAL_WIDTH / NATURAL_HEIGHT));

  return (
    <span className="inline-flex shrink-0 grow-0" style={{ width, height, minWidth: width }}>
      <Image
        src="/logo-v3.png"
        alt="Kycks Cleaner"
        width={width}
        height={height}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="object-contain"
        unoptimized
        priority
      />
    </span>
  );
}
