import type { NextConfig } from "next";
import { shopSlugList } from "./src/lib/shops";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/medved", destination: "/manybrands-1", permanent: true },
      {
        source: "/medved/search",
        destination: "/manybrands-1/search",
        permanent: true,
      },
      {
        source: "/medved/c/:id",
        destination: "/manybrands-1/c/:id",
        permanent: true,
      },
      { source: "/mishka", destination: "/manybrands-2", permanent: true },
      {
        source: "/mishka/search",
        destination: "/manybrands-2/search",
        permanent: true,
      },
      {
        source: "/mishka/c/:id",
        destination: "/manybrands-2/c/:id",
        permanent: true,
      },
      { source: "/sirius", destination: "/manybrands-1", permanent: true },
      {
        source: "/sirius/search",
        destination: "/manybrands-1/search",
        permanent: true,
      },
      {
        source: "/sirius/c/:id",
        destination: "/manybrands-1/c/:id",
        permanent: true,
      },
      { source: "/husky", destination: "/manybrands-2", permanent: true },
      {
        source: "/husky/search",
        destination: "/manybrands-2/search",
        permanent: true,
      },
      {
        source: "/husky/c/:id",
        destination: "/manybrands-2/c/:id",
        permanent: true,
      },
      { source: "/c/:id", destination: "/manybrands-1/c/:id", permanent: true },
      { source: "/master", destination: "/master/manybrands-1", permanent: true },
      ...shopSlugList.map((shop) => ({
        source: `/${shop}/item/:id`,
        destination: `/item/${shop}/:id`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
