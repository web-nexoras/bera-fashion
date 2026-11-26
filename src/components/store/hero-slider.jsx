"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { unsplashPhoto } from "@/lib/images";
const slides = [
    {
        image: unsplashPhoto("photo-1594938298603-c8148c4b4c8a", 1800),
        eyebrow: "The new season edit",
        title: <>Elegance, <em className="text-gold-300">worn</em> every day.</>,
        copy: "Considered silhouettes, premium fabrics and quiet details. Discover pieces crafted for the modern woman — from slow mornings to special occasions.",
        href: "/products",
        cta: "Shop the collection",
    },
    {
        image: unsplashPhoto("photo-1469334031218-e382a71b716b", 1800),
        eyebrow: "New arrivals · 2026",
        title: <>Flow into your <em className="text-gold-300">own</em> story.</>,
        copy: "Palazzo drapes, full-sleeve elegance and effortless layers — meet the pieces that move beautifully with you, every single day.",
        href: "/products?isNewArrival=true",
        cta: "Explore new arrivals",
    },
    {
        image: unsplashPhoto("photo-1515372039744-b8f02a3ae446", 1800),
        eyebrow: "The BERA standard",
        title: <>Quality that moves <em className="text-gold-300">with you.</em></>,
        copy: "Small details make a lasting difference. Carefully selected fabrics and versatile feminine designs, made to become part of your story.",
        href: "/about",
        cta: "Discover our story",
    },
];
const ROTATE_MS = 6500;
export function HeroSlider() {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    useEffect(() => {
        if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return;
        const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), ROTATE_MS);
        return () => window.clearInterval(timer);
    }, [paused]);
    const step = (direction) => setActive((index) => (index + direction + slides.length) % slides.length);
    return (<section className="group/hero relative isolate min-h-[620px] overflow-hidden bg-brand-950 text-white sm:min-h-[680px] lg:min-h-[min(760px,calc(100svh-108px))]" aria-roledescription="carousel" aria-label="Featured collections" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
                setPaused(false);
        }}>
      {slides.map((slide, index) => (<div key={slide.eyebrow} className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${index === active ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={index !== active}>
          <Image src={slide.image} alt="" fill priority={index === 0} sizes="100vw" className="object-cover object-center"/>
        </div>))}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-brand-950/85 via-brand-950/50 to-brand-950/15"/>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand-950/65 via-transparent to-brand-950/15"/>

      <div className="container-x relative flex min-h-[620px] items-center py-20 sm:min-h-[680px] lg:min-h-[min(760px,calc(100svh-108px))]">
        <div className="max-w-3xl rounded-3xl border border-white/20 bg-brand-950/50 p-6 shadow-2xl backdrop-blur-sm sm:p-10 lg:p-12">
          <div key={active} className="animate-fade-up motion-reduce:animate-none" aria-live="polite" aria-atomic="true">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-brand-950/45 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-300 shadow-sm">
              <Sparkles aria-hidden className="size-3.5"/> {slides[active].eyebrow}
            </div>
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
              {slides[active].title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white drop-shadow sm:text-lg">
              {slides[active].copy}
            </p>
            <Link href={slides[active].href} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-gold-300 px-5 py-3 text-sm font-bold text-brand-950 shadow-lg transition hover:bg-gold-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              {slides[active].cta}<ArrowRight aria-hidden className="size-4"/>
            </Link>
          </div>
        </div>
      </div>

      <div className="container-x absolute inset-x-0 bottom-6 flex items-center justify-between">
        <div className="flex items-center gap-2" aria-label="Choose a featured collection">
          {slides.map((slide, index) => (<button key={slide.eyebrow} type="button" onClick={() => setActive(index)} aria-label={`Show slide ${index + 1}: ${slide.eyebrow}`} aria-current={active === index} className={`h-2 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${active === index ? "w-9 bg-gold-300" : "w-2 bg-white/65 hover:bg-white"}`}/>))}
          <span className="sr-only" aria-live="polite">Slide {active + 1} of {slides.length}: {slides[active].eyebrow}</span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => step(-1)} aria-label="Previous slide" className="flex size-11 items-center justify-center rounded-full border border-white/40 bg-brand-950/40 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><ArrowLeft aria-hidden className="size-4"/></button>
          <button type="button" onClick={() => step(1)} aria-label="Next slide" className="flex size-11 items-center justify-center rounded-full border border-white/40 bg-brand-950/40 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><ArrowRight aria-hidden className="size-4"/></button>
        </div>
      </div>
    </section>);
}
