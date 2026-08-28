import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Capability-card photography (free Unsplash License).
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  turbopack: {
    // The home directory above this project is itself a repo with its own
    // lockfile, so Next infers the wrong workspace root. Pin it to this app.
    root: path.join(__dirname),
  },
};

export default nextConfig;
