"use client";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
const slides = [
    { label: "Delivery", text: "Complimentary delivery on orders over ৳5,000" },
    { label: "Offer", text: "Save 20% with code SAVE20 on your first order" },
    { label: "New in", text: "The new season edit — in store now" },
    { label: "Returns", text: "Easy 14-day returns on every order" },
];
const SLIDE_MS = 4200;
export function AnnouncementBar() {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    useEffect(() => {
        if (paused)
            return;
        const timer = window.setInterval(() => {
            setActive((current) => (current + 1) % slides.length);
        }, SLIDE_MS);
        return () => window.clearInterval(timer);
    }, [paused]);
    const slide = slides[active];
    return (<div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-brand-950 via-brand-900 to-brand-950 text-white" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} aria-roledescription="carousel" aria-label="Store announcements">
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-300/60 to-transparent"/>

      <div className="container-x relative flex min-h-10 items-center justify-center gap-3 py-2 text-center">
        <Sparkles aria-hidden className="hidden size-3.5 shrink-0 text-gold-300 sm:block"/>

        <div key={active} className="flex animate-banner-in items-center justify-center gap-2.5 motion-reduce:animate-none">
          <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300 sm:inline">
            {slide.label}
          </span>
          <span aria-hidden className="hidden size-1 rounded-full bg-gold-300/70 sm:inline-block"/>
          <span className="whitespace-nowrap text-xs font-medium leading-5 text-white sm:text-[13px]">
            {slide.text}
          </span>
        </div>

        <div className="absolute right-4 hidden items-center gap-1.5 md:flex">
          {slides.map((item, index) => (<button key={item.label} type="button" onClick={() => setActive(index)} aria-label={`Show announcement ${index + 1}: ${item.text}`} aria-current={active === index} className={cn("h-1.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300", active === index ? "w-5 bg-gold-300" : "w-1.5 bg-white/35 hover:bg-white/60")}/>))}
        </div>

        <span aria-live="polite" className="sr-only">
          {slide.text}
        </span>
      </div>

      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-white/10">
        <span key={active} className="block h-full origin-left animate-banner-progress bg-gold-300/70 motion-reduce:animate-none"/>
      </span>
    </div>);
}
