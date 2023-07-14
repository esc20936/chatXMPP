/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx,ts,jsx}"],
  theme: {
    extend: {
      colors: {
        darkColor: "#131313",
        mainColor: "#202329",
        focusMainColor:"#2e333d",
        accentColor: "#6b8afd",
        lightColor: "#ffffff",
        textWhiteColor : "#e5e5e6",
        hoverAccentColor: "#5c7cfa",
        discordPurple: "#404EED"
      },
    },
  },
  plugins: [],
}

