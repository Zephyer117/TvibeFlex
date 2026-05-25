/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/payment/success",
        destination: "/order/success",
        permanent: false,
      },
      {
        source: "/payment/cancel",
        destination: "/checkout",
        permanent: false,
      },
      { source: "/orders", destination: "/account/orders", permanent: false },
    ];
  },
};

module.exports = nextConfig;
