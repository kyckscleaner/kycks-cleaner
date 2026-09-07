export function Logo({ size = "text-2xl" }: { size?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-1.5 ${size}`}>
      <span className="font-[family-name:var(--font-brand-bold)] uppercase tracking-wide text-white">
        Kycks
      </span>
      <span className="font-[family-name:var(--font-brand-script)] text-[1.15em] text-[#a855f7]">
        Cleaner
      </span>
    </span>
  );
}
