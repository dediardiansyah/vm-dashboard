import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // serverActions: {
    //   allowedOrigins: ['localhost:3000', 'hmns-parfumes.vercel.app']
    // },
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react']
  },
  serverExternalPackages: ['@prisma/client', 'bcryptjs']
};

export default nextConfig;
