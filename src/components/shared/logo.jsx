import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

/**
 * Premium BERA FASHION 3D-faceted monogram + wordmark logo.
 * Use `light` on dark/maroon backgrounds, default on light backgrounds.
 */
export function Logo({ href = "/", compact = false, light = false, className }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "relative flex size-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3",
          light
            ? "bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 ring-1 ring-gold-300/45 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)]"
            : "bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 ring-1 ring-brand-800/30 shadow-[0_10px_22px_-8px_rgba(122,31,61,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]",
        )}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          aria-hidden="true"
          className="size-6 drop-shadow-sm"
        >
          {/* Outer faceted diamond crest */}
          <path
            d="M18 3L31 12.5L26 31H10L5 12.5L18 3Z"
            stroke="#e6ce7a"
            strokeWidth="1.6"
            strokeLinejoin="round"
            fill="url(#beraCrestGrad)"
            fillOpacity="0.22"
          />
          {/* Inner 3D facet highlight */}
          <path
            d="M18 3L24 12.5L18 31L12 12.5L18 3Z"
            stroke="#fbf4dd"
            strokeOpacity="0.4"
            strokeWidth="1"
          />
          {/* Monogram B */}
          <path
            d="M14.2 11.5H19.2C21.1 11.5 22.3 12.5 22.3 14.1C22.3 15.3 21.6 16.2 20.5 16.6C21.9 17 22.8 18 22.8 19.5C22.8 21.4 21.4 22.6 19.2 22.6H14.2V11.5ZM16.3 15.9H18.8C19.7 15.9 20.3 15.4 20.3 14.6C20.3 13.8 19.7 13.3 18.8 13.3H16.3V15.9ZM16.3 20.8H19C20.1 20.8 20.7 20.2 20.7 19.3C20.7 18.4 20.1 17.8 19 17.8H16.3V20.8Z"
            fill="#ffffff"
          />
          <defs>
            <linearGradient id="beraCrestGrad" x1="5" y1="3" x2="31" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="#e6ce7a" />
              <stop offset="1" stopColor="#7a1f3d" />
            </linearGradient>
          </defs>
        </svg>
      </span>

      {!compact && (
        <span className="leading-none">
          <span
            className={cn(
              "block font-display text-xl font-bold tracking-tight transition-colors",
              light ? "text-white" : "text-brand-800 group-hover:text-brand-700",
            )}
          >
            {SITE.shortName}
          </span>
          <span
            className={cn(
              "mt-0.5 block text-[8px] font-bold uppercase tracking-[0.36em]",
              light ? "text-gold-300/90" : "text-gold-700",
            )}
          >
            Fashion
          </span>
        </span>
      )}
    </Link>
  );
}
