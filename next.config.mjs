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
      { source: "/legacy", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
    ]
  },
}

export default nextConfig
