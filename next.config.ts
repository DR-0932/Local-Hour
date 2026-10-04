import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["bcrypt", "pg"],
  images: {
  remotePatterns: [
    { protocol: "https", hostname: "res.cloudinary.com" },
  ],
},
};

export default nextConfig;
