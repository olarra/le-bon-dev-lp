/** @type {import("next").NextConfig} */
const nextConfig = {
  // unframer recommends disabling strict mode: double-mounting breaks Framer animations.
  reactStrictMode: false,
  async rewrites() {
    return {
      beforeFiles: [
        // The original Framer export, kept byte for byte for visual comparison
        // while sections are migrated to React one by one.
        { source: "/legacy", destination: "/index.html" },
      ],
    }
  },
}

export default nextConfig
