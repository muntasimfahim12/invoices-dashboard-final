import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#4177BC",    // আপনার দেওয়া নীল
          orange: "#EB9C2C",  // আপনার দেওয়া কমলা
          white: "#FFFFFF",   // সাদা
        },
        // ড্যাশবোর্ডের বর্ডার ও ব্যাকগ্রাউন্ডের জন্য কিছু ক্লিন গ্রে কালার
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
        }
      },
    },
  },
  plugins: [],
};

export default config;