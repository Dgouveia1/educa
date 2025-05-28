/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/educar-v1' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/educar-v1/' : '',
}

export default nextConfig
