import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Baseline security headers on every response. Deliberately no full
   * Content-Security-Policy: the pages load Stream manifests, R2 media, blob:
   * URLs from hls.js and Next's inline bootstrap scripts, and a CSP strict
   * enough to matter needs per-request nonces. `frame-ancestors` stops other
   * sites framing these pages (clickjacking) without touching what they load.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'" },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
        ],
      },
    ];
  },
  images: {
    /**
     * Photos live in the R2 bucket alongside the video (see lib/site.ts), and
     * the originals are full-resolution camera JPEGs — several megabytes at
     * 4160px wide. Allowing the CDN host here lets next/image resize and
     * re-encode them per breakpoint instead of shipping the master to a tile.
     */
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.paracausal.world' }],
    /**
     * The gallery photos are high-ISO shots of a dark room. At the default
     * quality of 75 the grain breaks into blocks and the shadow gradients band
     * visibly — the artefacts land exactly where this kind of image lives. Next
     * rejects any quality not listed here, so 90 has to be declared before a
     * component may ask for it. 75 stays for everything else.
     */
    qualities: [75, 90],
  },
};

export default nextConfig;
