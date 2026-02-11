/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,

    // Environment variables
    env: {
        NEXT_PUBLIC_APP_NAME: 'SpinWisely AI',
    },

    // Webpack configuration for Node.js modules in browser
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            }
        }
        return config
    },
}

module.exports = nextConfig
