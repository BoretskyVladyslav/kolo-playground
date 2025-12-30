/** @type {import('next').NextConfig} */
const nextConfig = {
  // Вимикаємо перевірку типів під час збірки на сервері
  typescript: {
    ignoreBuildErrors: true,
  },
  // Вимикаємо перевірку лінтера
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;