"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, ChevronDown, Heart, RotateCcw, ShieldCheck, Star, Truck, } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/features/cart/context/CartContext.jsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity";
import { addToWishlist, removeFromWishlist } from "@/api/wishlist.js";
import { cn, discountPercent, formatBDT, mainImage, productPrice } from "@/lib/utils";
export function ProductDetail({ product }) {
    const { addItem } = useCart();
    const images = product.images?.length
        ? product.images
        : [{ url: mainImage(product.images), alt: product.name, isMain: true }];
    const colorOptions = Array.from(product.variants
        .reduce((map, variant) => {
        const name = variant.color ?? "Default";
        if (!map.has(name))
            map.set(name, { name, code: variant.colorCode ?? "#7a1f3d" });
        return map;
    }, new Map())
        .values());
    const [activeImage, setActiveImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(colorOptions[0]?.name ?? "Default");
    const selectedColorCode = colorOptions.find((color) => color.name === selectedColor)?.code ?? "#7a1f3d";
    const colorWashOpacity = selectedColor.toLowerCase() === "ivory" ? 0.22 : 0.3;
    const availableVariants = product.variants.filter((variant) => (variant.color ?? "Default") === selectedColor && variant.isActive);
    const sizeOptions = Array.from(new Set(availableVariants.map((variant) => variant.size ?? "One Size")));
    const [selectedSize, setSelectedSize] = useState(sizeOptions[0] ?? "");
    const [quantity, setQuantity] = useState(1);
    const [busy, setBusy] = useState(false);
    const [favorite, setFavorite] = useState(false);
    const [openSection, setOpenSection] = useState("description");
    const selectedVariant = availableVariants.find((variant) => (variant.size ?? "One Size") === selectedSize) ??
        availableVariants[0];
    const price = selectedVariant?.price ?? productPrice(product);
    const regularPrice = selectedVariant?.regularPrice ?? product.compareAtPrice;
    const discount = discountPercent(price, regularPrice);
    const stock = selectedVariant?.stock ?? 0;
    const stockTone = stock === 0 ? "danger" : stock <= 5 ? "warning" : "success";
    const stockLabel = stock === 0 ? "Sold out" : stock <= 5 ? `Only ${stock} left` : "In stock";
    const categoryName = typeof product.category === "object" ? product.category.name : "Collection";
    const brandName = typeof product.brand === "object" ? product.brand?.name : undefined;
    const changeColor = (name) => {
        const variants = product.variants.filter((variant) => (variant.color ?? "Default") === name && variant.isActive);
        const colorIndex = colorOptions.findIndex((color) => color.name === name);
        setSelectedColor(name);
        if (colorIndex >= 0 && images.length > 1)
            setActiveImage(colorIndex % images.length);
        setSelectedSize(variants[0]?.size ?? "");
        setQuantity(1);
    };
    const toggleFavorite = async () => {
        setFavorite((value) => !value);
        const envelope = favorite ? await removeFromWishlist(product._id) : await addToWishlist(product._id);
        if (envelope.success)
            toast.success(favorite ? "Removed from wishlist" : "Saved to wishlist");
    };
    const handleAdd = async () => {
        if (!selectedVariant || stock === 0)
            return;
        setBusy(true);
        await addItem(product._id, selectedVariant._id, quantity);
        setBusy(false);
    };
    const sections = [
        {
            id: "description",
            label: "Description",
            content: (<div className="space-y-3 text-sm leading-relaxed text-ink-600">
          <p>{product.description}</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {[
                    "Thoughtfully tailored for an effortless silhouette",
                    "Breathable, premium-grade fabric with a soft hand-feel",
                    "Designed to transition from day to evening",
                    "Finished with considered, durable detailing",
                ].map((point) => (<li key={point} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-brand-700"/>
                <span>{point}</span>
              </li>))}
          </ul>
        </div>),
        },
        {
            id: "fabric",
            label: "Fabric & care",
            content: (<div className="space-y-2 text-sm leading-relaxed text-ink-600">
          <p>
            Crafted from a carefully selected cotton-rich blend for comfort, structure and lasting
            wear. colour may vary slightly due to screen settings.
          </p>
          <p>Machine wash cold with like colours. Do not bleach. Tumble dry low or hang to dry. Warm iron if needed.</p>
        </div>),
        },
        {
            id: "delivery",
            label: "Delivery & returns",
            content: (<div className="space-y-3 text-sm leading-relaxed text-ink-600">
          <p>Complimentary delivery on orders over ৳5,000. Inside Dhaka 1–2 working days; outside Dhaka 3–5 working days.</p>
          <p>Easy 7-day returns on unworn items with tags attached. Cash on delivery and secure online payment available.</p>
        </div>),
        },
    ];
    return (<div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      {/* Gallery */}
      <div className="animate-fade-up">
        <div className="surface relative aspect-4/5 overflow-hidden p-0">
          <Image src={images[activeImage]?.url ?? mainImage(product.images)} alt={`${product.name} in ${selectedColor}${images[activeImage]?.alt ? ` — ${images[activeImage].alt}` : ""}`} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover"/>
          <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-color" style={{ backgroundColor: selectedColorCode, opacity: colorWashOpacity }}/>
          <div className="absolute left-4 top-4 flex flex-col gap-1.5">
            {discount > 0 && <Badge tone="danger">-{discount}%</Badge>}
            {product.isNewArrival && <Badge tone="brand">New</Badge>}
            {product.isBestSeller && <Badge tone="gold">Bestseller</Badge>}
          </div>
        </div>
        {images.length > 1 && (<div className="mt-4 flex gap-3">
            {images.map((image, index) => (<button key={`${image.url}-${index}`} type="button" onClick={() => setActiveImage(index)} aria-label={`View image ${index + 1}`} className={cn("relative size-20 overflow-hidden rounded-xl border-2 transition-all sm:size-24", activeImage === index
                    ? "border-brand-700 shadow-soft"
                    : "border-transparent opacity-70 hover:opacity-100")}>
                <Image src={image.url} alt={image.alt ?? product.name} fill sizes="96px" className="object-cover"/>
              </button>))}
          </div>)}
      </div>

      {/* Details */}
      <div className="animate-fade-up">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/categories" className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-600 hover:text-brand-800">
            {categoryName}
          </Link>
          {brandName && (<>
              <span className="text-ink-300">/</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-400">{brandName}</span>
            </>)}
        </div>

        <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-ink-900 sm:text-4xl">
          {product.name}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, index) => (<Star key={index} className={cn("size-4", index < Math.round(product.averageRating)
                ? "fill-gold-500 text-gold-500"
                : "text-ink-200")}/>))}
            <span className="ml-1.5 text-sm font-bold text-ink-800">{product.averageRating.toFixed(1)}</span>
            <span className="text-xs text-ink-400">({product.reviewCount ?? 0} reviews)</span>
          </div>
          <span className="h-4 w-px bg-ink-200"/>
          <span className="text-xs text-ink-500">{product.totalSold} sold</span>
        </div>

        <div className="mt-6 flex flex-wrap items-baseline gap-3">
          <span className="font-display text-3xl font-bold text-brand-700">{formatBDT(price)}</span>
          {regularPrice && regularPrice > price && (<>
              <span className="text-base text-ink-400 line-through">{formatBDT(regularPrice)}</span>
              <Badge tone="danger">Save {formatBDT(regularPrice - price)}</Badge>
            </>)}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Badge tone={stockTone} dot>
            {stockLabel}
          </Badge>
          <span className="text-xs text-ink-400">SKU: {selectedVariant?.sku ?? product.sku}</span>
        </div>

        {/* Colour selection */}
        {colorOptions.length > 0 && (<div className="mt-7">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-ink-700">
              Colour: <span className="text-brand-700">{selectedColor}</span>
            </p>
            <div className="flex flex-wrap gap-2.5">
              {colorOptions.map((color) => (<button key={color.name} type="button" onClick={() => changeColor(color.name)} title={color.name} aria-label={`Select ${color.name}`} aria-pressed={selectedColor === color.name} className={cn("flex size-9 items-center justify-center rounded-full border-2 transition-transform hover:scale-110", selectedColor === color.name ? "border-brand-700" : "border-transparent")}>
                  <span className="size-7 rounded-full border border-ink-200 shadow-sm" style={{ backgroundColor: color.code }}/>
                </button>))}
            </div>
          </div>)}

        {/* Size selection */}
        {sizeOptions.length > 0 && (<div className="mt-6">
            <div className="mb-2.5 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-700">
                Size: <span className="text-brand-700">{selectedSize}</span>
              </p>
              <span className="text-[11px] text-ink-400">Size guide</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => {
                const variant = availableVariants.find((item) => (item.size ?? "One Size") === size);
                const disabled = !variant || variant.stock === 0;
                return (<button key={size} type="button" disabled={disabled} aria-pressed={selectedSize === size} onClick={() => {
                        setSelectedSize(size);
                        setQuantity(1);
                    }} className={cn("min-w-12 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-colors", selectedSize === size
                        ? "border-brand-700 bg-brand-700 text-white"
                        : "border-ink-200 bg-white text-ink-700 hover:border-brand-400 hover:text-brand-700", disabled && "cursor-not-allowed opacity-35 line-through")}>
                    {size}
                  </button>);
            })}
            </div>
          </div>)}

        {/* Purchase actions */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={Math.max(1, stock)}/>
          <Button size="lg" onClick={handleAdd} loading={busy} disabled={stock === 0} className="min-w-48">
            {stock === 0 ? "Sold out" : "Add to bag"}
          </Button>
          <Button variant="outline" size="icon" onClick={toggleFavorite} aria-label="Toggle wishlist" className="rounded-xl">
            <Heart className={cn("size-4", favorite && "fill-brand-700 text-brand-700")}/>
          </Button>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 rounded-2xl bg-brand-50/70 p-4 sm:grid-cols-3">
          {[
            { icon: Truck, title: "Fast delivery", text: "Islandwide shipping" },
            { icon: ShieldCheck, title: "Secure checkout", text: "COD or card" },
            { icon: RotateCcw, title: "Easy returns", text: "7-day window" },
        ].map(({ icon: Icon, title, text }) => (<div key={title} className="flex items-center gap-2.5">
              <Icon className="size-5 shrink-0 text-brand-700"/>
              <div>
                <p className="text-xs font-bold text-ink-800">{title}</p>
                <p className="text-[11px] text-ink-500">{text}</p>
              </div>
            </div>))}
        </div>

        {/* Accordion */}
        <div className="mt-8 divide-y divide-ink-100 border-y border-ink-100">
          {sections.map((section) => {
            const open = openSection === section.id;
            return (<div key={section.id}>
                <button type="button" onClick={() => setOpenSection(open ? "" : section.id)} className="flex w-full items-center justify-between py-4 text-left text-sm font-bold text-ink-800 transition-colors hover:text-brand-700" aria-expanded={open}>
                  {section.label}
                  <ChevronDown className={cn("size-4 text-ink-400 transition-transform", open && "rotate-180")}/>
                </button>
                {open && <div className="pb-5">{section.content}</div>}
              </div>);
        })}
        </div>
      </div>
    </div>);
}
