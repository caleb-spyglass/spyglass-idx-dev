import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.repliers.io',
        pathname: '/**',
      },
    ],
  },

  async redirects() {
    return [
      // ─── Legacy .php URLs → non-.php equivalents ───────────────
      {
        source: '/austin-the-linden.php',
        destination: '/austin-the-linden',
        permanent: true,
      },
      {
        source: '/austin-residences-at-6g.php',
        destination: '/austin-residences-at-6g',
        permanent: true,
      },
      {
        source: '/pflugerville-sorento-homes-for-sale.php',
        destination: '/pflugerville-sorento-homes-for-sale',
        permanent: true,
      },
      {
        source: '/austin-homes-under-500k.php',
        destination: '/austin-homes-under-500k',
        permanent: true,
      },
      {
        source: '/austin-new-homes-under-500k.php',
        destination: '/austin-new-homes-under-500k',
        permanent: true,
      },
      {
        source: '/austin-apartments.php',
        destination: '/austin-apartments',
        permanent: true,
      },
      {
        source: '/thank-you-the-linden.php',
        destination: '/thank-you-the-linden',
        permanent: true,
      },
      {
        source: '/thank-you-residences-at-6g.php',
        destination: '/thank-you-residences-at-6g',
        permanent: true,
      },
      {
        source: '/houston-team.php',
        destination: '/houston-team',
        permanent: true,
      },

      // ─── /communities/[slug] → /[slug] (301) ─────────────────
      // Redirect old community paths to flat URL structure.
      // Static /communities index page still works (it's a different route).
      {
        source: '/communities/:slug',
        destination: '/:slug',
        permanent: true,
      },

      // ─── /p/[slug] → /[slug] (301) ───────────────────────────
      // Redirect Mission Control landing page paths to flat URL structure.
      {
        source: '/p/:slug',
        destination: '/:slug',
        permanent: true,
      },

      // ─── /zip-codes/[zipcode] → /[zipcode]-homes-for-sale (301) ───
      // Redirect old zip code paths to the live site URL format.
      // These specific mappings cover all zip codes with their exact live slugs.
      { source: '/zip-codes/78613', destination: '/78613-homes-for-sale', permanent: true },
      { source: '/zip-codes/78617', destination: '/78617-property', permanent: true },
      { source: '/zip-codes/78620', destination: '/78620-homes-for-sale', permanent: true },
      { source: '/zip-codes/78628', destination: '/78628-houses-for-sale', permanent: true },
      { source: '/zip-codes/78641', destination: '/78641-property', permanent: true },
      { source: '/zip-codes/78645', destination: '/78645-homes-for-sale', permanent: true },
      { source: '/zip-codes/78652', destination: '/78652-homes-for-sale', permanent: true },
      { source: '/zip-codes/78701', destination: '/78701-homes-for-sale', permanent: true },
      { source: '/zip-codes/78702', destination: '/78702-homes-for-sale', permanent: true },
      { source: '/zip-codes/78703', destination: '/78703-homes-and-condos', permanent: true },
      { source: '/zip-codes/78704', destination: '/78704-homes-and-condos', permanent: true },
      { source: '/zip-codes/78705', destination: '/78705-homes-for-sale', permanent: true },
      { source: '/zip-codes/78717', destination: '/78717-houses-for-sale', permanent: true },
      { source: '/zip-codes/78721', destination: '/78721-homes-for-sale', permanent: true },
      { source: '/zip-codes/78722', destination: '/78722-house-for-sale', permanent: true },
      { source: '/zip-codes/78723', destination: '/78723-homes', permanent: true },
      { source: '/zip-codes/78724', destination: '/78724-house', permanent: true },
      { source: '/zip-codes/78726', destination: '/78726-homes-for-sale', permanent: true },
      { source: '/zip-codes/78727', destination: '/78727-houses-for-sale', permanent: true },
      { source: '/zip-codes/78728', destination: '/78728-homes-for-sale', permanent: true },
      { source: '/zip-codes/78731', destination: '/78731-homes-for-sale', permanent: true },
      { source: '/zip-codes/78732', destination: '/78732-homes-for-sale', permanent: true },
      { source: '/zip-codes/78733', destination: '/78733-homes-for-sale', permanent: true },
      { source: '/zip-codes/78734', destination: '/78734-homes-for-sale', permanent: true },
      { source: '/zip-codes/78735', destination: '/78735-homes-for-sale', permanent: true },
      { source: '/zip-codes/78737', destination: '/78737-homes', permanent: true },
      { source: '/zip-codes/78738', destination: '/78738-houses-for-sale', permanent: true },
      { source: '/zip-codes/78739', destination: '/78739-homes', permanent: true },
      { source: '/zip-codes/78741', destination: '/78741-house', permanent: true },
      { source: '/zip-codes/78744', destination: '/78744-homes-for-sale', permanent: true },
      { source: '/zip-codes/78745', destination: '/78745-homes-for-sale', permanent: true },
      { source: '/zip-codes/78746', destination: '/78746-homes-for-sale', permanent: true },
      { source: '/zip-codes/78748', destination: '/78748-homes-for-sale', permanent: true },
      { source: '/zip-codes/78749', destination: '/78749-homes-for-sale', permanent: true },
      { source: '/zip-codes/78750', destination: '/78750-homes-for-sale', permanent: true },
      { source: '/zip-codes/78751', destination: '/78751-homes-for-sale', permanent: true },
      { source: '/zip-codes/78752', destination: '/78752-homes-for-sale', permanent: true },
      { source: '/zip-codes/78753', destination: '/78753-homes-for-sale', permanent: true },
      { source: '/zip-codes/78754', destination: '/78754-homes-for-sale', permanent: true },
      { source: '/zip-codes/78756', destination: '/78756-homes-for-sale', permanent: true },
      { source: '/zip-codes/78757', destination: '/78757-houses-for-sale', permanent: true },
      { source: '/zip-codes/78758', destination: '/78758-homes-for-sale', permanent: true },
      { source: '/zip-codes/78759', destination: '/78759-houses-and-condos-for-sale', permanent: true },
      { source: '/zip-codes/78957', destination: '/78957-homes-for-sale', permanent: true },

      // ─── Catch-all for any other zip-codes ────────────────────
      // Fallback for zip codes not explicitly listed above.
      {
        source: '/zip-codes/:zipcode',
        destination: '/:zipcode-homes-for-sale',
        permanent: true,
      },

      // ─── Generic .php catch-all ────────────────────────────────
      // Any other .php URL redirects to its non-.php equivalent.
      {
        source: '/:path*.php',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
