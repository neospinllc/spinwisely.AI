/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,

    // For Cloudflare Pages deployment
    output: 'export',
    images: {
        unoptimized: true,
    },

    // Webpack configuration for Node.js modules in browser
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
                crypto: false,
            };
        }
        return config;
    },

    // Environment variables
    env: {
        NEXT_PUBLIC_APP_NAME: 'SpinWisely AI',
    },
}

module.exports = nextConfig
