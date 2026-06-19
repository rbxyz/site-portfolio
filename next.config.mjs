/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Pin the workspace root so Turbopack doesn't infer it from a parent
    // lockfile (there's a package-lock.json one level up in /home/rbxyz/dev).
    turbopack: {
        root: import.meta.dirname,
    },

    // Configurações de imagem
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.screenshotone.com',
                port: '',
                pathname: '/take/**',
            },
        ],
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        // Permitir imagens base64 (data URIs)
        unoptimized: false,
    },

    // Headers para otimização
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                ],
            },
        ];
    },

    // Note: Next.js 16 uses Turbopack by default for `next dev` and `next build`.
    // The previous custom `webpack` splitChunks config was removed — Turbopack
    // does its own vendor chunking, and a `webpack` key would otherwise force the
    // build back to Webpack (or fail the Turbopack build).
};

export default nextConfig;
