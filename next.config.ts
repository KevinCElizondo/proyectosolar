import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cabeceras de seguridad para el visor 3D embebible
  async headers() {
    return [
      {
        // Permitir que el embed sea incrustado en iframes de cualquier origen
        source: "/embed/:path*",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
        ],
      },
      {
        // Proteger todas las demás rutas de embebido en iframes externos
        source: "/((?!embed).*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
