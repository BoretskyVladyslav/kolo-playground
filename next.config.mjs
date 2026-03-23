import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  sassOptions: {
    loadPaths: [path.join(process.cwd(), 'src/styles')],
  }, 
};

export default nextConfig;