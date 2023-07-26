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
      height:{
        "screen-1/16": "6.25vh",
        "screen-2/16": "12.5vh",
        "screen-3/16": "18.75vh",
        "screen-4/16": "25vh",
        "screen-5/16": "31.25vh",
        "screen-6/16": "37.5vh",
        "screen-7/16": "43.75vh",
        "screen-8/16": "50vh",
        "screen-9/16": "56.25vh",
        "screen-10/16": "62.5vh",
        "screen-11/16": "68.75vh",
        "screen-12/16": "75vh",
        "screen-13/16": "81.25vh",
        "screen-14/16": "87.5vh",
        "screen-15/16": "93.75vh",
      }
    },
  },
  plugins: [],
}

