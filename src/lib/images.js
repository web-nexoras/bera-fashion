export function unsplashPhoto(imageId, width) {
    const params = new URLSearchParams({ auto: "format", fit: "crop", w: String(width), q: "85" });
    return `https://images.unsplash.com/${imageId}?${params.toString()}`;
}
