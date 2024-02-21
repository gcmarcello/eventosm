module.exports = {
  ...require("@repo/config/tailwind.config"),
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/packages/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/odinkit/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist:
    process.env.NODE_ENV === "production"
      ? [
          {
            pattern:
              /(bg|text|border|ring)-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(100|200|300|400|500|600|700|800|900)/,
            variants: ["hover"],
          },
        ]
      : [],
  theme: {
    extend: {
      screens: {
        xs: "450px",
        xxl: "1440px",
      },
      transitionDuration: {
        "2000": "2000ms",
      },
    },
  },
};
