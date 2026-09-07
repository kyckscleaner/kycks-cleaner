const SOCIAL_HANDLE = "kycks_cleaner";

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a
        href={`https://instagram.com/${SOCIAL_HANDLE}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram Kycks Cleaner"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-[#a855f7] hover:text-[#a855f7]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
        </svg>
      </a>
      <a
        href={`https://tiktok.com/@${SOCIAL_HANDLE}`}
        target="_blank"
        rel="noreferrer"
        aria-label="TikTok Kycks Cleaner"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-[#a855f7] hover:text-[#a855f7]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M16.5 3c.3 1.9 1.6 3.4 3.5 3.7v2.6c-1.3 0-2.5-.4-3.5-1.1v6.6c0 3-2.4 5.2-5.2 5.2S6 17.7 6 14.8s2.4-5.2 5.2-5.2c.3 0 .6 0 .9.1v2.7a2.6 2.6 0 1 0 1.8 2.5V3h2.6z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}
