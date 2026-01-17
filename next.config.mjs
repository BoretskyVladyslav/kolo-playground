/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Додаємо ігнорування помилок Sass (якщо версія дозволяє)
  sassOptions: {
    quietDeps: true,
    silenceDeprecations: ['color-functions', 'import'],
  },
};

export default nextConfig;