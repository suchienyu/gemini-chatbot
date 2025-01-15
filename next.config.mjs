/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        crypto: false,
      };
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['nodemailer'],
    serverActions: true,
  },
  eslint: {
    // 暫時忽略某些 ESLint 警告
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 暫時忽略 TypeScript 錯誤
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [],
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
};

export default nextConfig;
