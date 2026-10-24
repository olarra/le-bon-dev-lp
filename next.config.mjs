/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{
      source: "/fonts/:path*",
      headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
    }]
  },
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
      { source: "/estimation", destination: "/fr/estimation", permanent: true },
      { source: "/mentions-legales", destination: "/fr/mentions-legales", permanent: true },
      { source: "/politique-de-confidentialite", destination: "/fr/politique-de-confidentialite", permanent: true },
      { source: "/confidentialite", destination: "/fr/politique-de-confidentialite", permanent: true },
      { source: "/:lang(fr|en|es)/confidentialite", destination: "/:lang/politique-de-confidentialite", permanent: true },
      { source: "/legacy", destination: "/fr", permanent: true },
      { source: "/index.html", destination: "/fr", permanent: true },
    ]
  },
}

export default nextConfig
