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
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, "node_modules/tinymce/skins"),
            to: path.join(__dirname, "public/assets/libs/tinymce/skins"),
          },
          {
            from: path.join(__dirname, "node_modules/tinymce/themes"),
            to: path.join(__dirname, "public/assets/libs/tinymce/themes"),
          },
          {
            from: path.join(__dirname, "node_modules/tinymce/icons"),
            to: path.join(__dirname, "public/assets/libs/tinymce/icons"),
          },
        ],
      })
    );
    return config;
  },
};

module.exports = nextConfig;
