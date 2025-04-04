module.exports = {
  ...require("@repo/config/tailwind.config"),
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/packages/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/odinkit/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "450px",
        xxl: "1440px",
        "2xl": "1536px",
        "3xl": "1920px",
      },
      transitionDuration: {
        "2000": "2000ms",
      },
    },
  },
};
