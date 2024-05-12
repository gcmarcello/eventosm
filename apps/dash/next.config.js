/** @type {import('next').NextConfig} */
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const nextConfig = {
  transpilePackages: ["odinkit"],
  images: {
    remotePatterns: [
      {
        hostname: "eventosmb.s3.us-east-005.backblazeb2.com",
        protocol: "https",
      },
      {
        hostname: "eventosmpreview.s3.us-east-005.backblazeb2.com",
        protocol: "https",
      },
      {
        hostname: "i.imgur.com",
        protocol: "https",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

module.exports = nextConfig;
