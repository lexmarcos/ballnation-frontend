/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    return config;
  },
  rewrites: async () => [
    {
      source: "/room/:room",
      destination: "/game/index.html",
      
    },
  ],
};

module.exports = nextConfig;
