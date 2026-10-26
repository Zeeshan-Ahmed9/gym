import type { NextConfig } from "next";

// Ensure application runtime timezone is set to Pakistan Standard Time (PKT, UTC+5)
process.env.TZ = process.env.TZ || "Asia/Karachi";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
