import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

function FacebookIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M13.5 21v-7.6h2.55l.38-2.96H13.5V8.55c0-.86.24-1.45 1.47-1.45h1.57V4.45c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.81 1.38-3.81 3.91v2.2H7.9v2.96h2.55V21h3.05Z" />
    </svg>
  );
}

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z" />
    </svg>
  );
}

function YouTubeIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M21.58 7.19a2.75 2.75 0 0 0-1.94-1.95C17.93 4.78 12 4.78 12 4.78s-5.93 0-7.64.46A2.75 2.75 0 0 0 2.42 7.2 28.7 28.7 0 0 0 2 12c0 1.63.14 3.25.42 4.81a2.75 2.75 0 0 0 1.94 1.95c1.71.46 7.64.46 7.64.46s5.93 0 7.64-.46a2.75 2.75 0 0 0 1.94-1.95c.28-1.56.42-3.18.42-4.81s-.14-3.25-.42-4.81ZM10 15.11V8.89L15.4 12 10 15.11Z" />
    </svg>
  );
}

const ICONS = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
  YouTube: YouTubeIcon,
};

export function SocialLinks({ light = false, className }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {SITE.socials.map((social) => {
        const Icon = ICONS[social.name] ?? InstagramIcon;
        return (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow ${SITE.shortName} on ${social.name}`}
            title={`${social.name} (${social.handle})`}
            className={cn(
              "flex size-10 items-center justify-center rounded-xl transition-all duration-300 hover:-translate-y-1",
              light
                ? "border border-white/20 bg-white/10 text-white shadow-[0_6px_16px_-6px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-gold-300/60 hover:bg-brand-700 hover:text-gold-300"
                : "border border-brand-200 bg-brand-50 text-brand-700 shadow-soft hover:border-brand-600 hover:bg-brand-700 hover:text-white",
            )}
          >
            <Icon className="size-4.5" />
          </a>
        );
      })}
    </div>
  );
}
