const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            { protocol: "https", hostname: "res.cloudinary.com" },
            { protocol: "https", hostname: "images.unsplash.com" },
        ],
    },
    experimental: {
        optimizePackageImports: ["lucide-react", "recharts"],
    },
};
export default nextConfig;
