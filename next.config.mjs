import dotenv from "dotenv";

dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add serverExternalPackages for WebAssembly support
  experimental: {
    serverComponentsExternalPackages: ["@xmtp/user-preferences-bindings-wasm"],
  },

  // Add Buffer polyfill to the webpack configuration
  webpack(config) {
    // Include @xmtp/user-preferences-bindings-wasm in WebAssembly configuration
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    // Return updated config
    return config;
  },
};

export default nextConfig;
