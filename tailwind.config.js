/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        softgreen: "#E8F5E9",     // hijau soft background
        greenmain: "#2E7D32",     // hijau utama (tombol penting)
        greenhover: "#256628",    // hover hijau
        navblue: "#F4F8FF",       // putih kebiruan navbar
        bordersoft: "#D9E2EC",    // border soft
      },
    },
  },
  plugins: [],
};
