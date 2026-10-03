/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({ test: /\.wgsl$/, loader: "@vgpu/wgsl/loader-webpack" })
    return config
  },
  turbopack: {
    rules: {
      "*.wgsl": { loaders: ["@vgpu/wgsl/loader-webpack"], as: "*.js" },
    },
  },
  async redirects() {
    return [
      { source: "/", destination: "/fr", permanent: true },
      { source: "/legacy", destination: "/fr", permanent: true },
      { source: "/index.html", destination: "/fr", permanent: true },
    ]
  },
}

export default nextConfig
