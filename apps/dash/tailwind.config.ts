module.exports = {
  ...require("@repo/config/tailwind.config"),
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/packages/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/odinkit/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lime: {
          250: "#b3d654",
        },
      },
      screens: {
        xs: "450px",
        xxl: "1440px",
        "2xl": "1536px",
        "3xl": "1920px",
      },
      maxWidth: {
        "8xl": "90rem",
      },
      transitionDuration: {
        "2000": "2000ms",
      },
    },
  },
};
