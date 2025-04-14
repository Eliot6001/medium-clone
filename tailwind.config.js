/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'custom-bg': '#e9c46a', 
        'custom-contrast': '#292930', 
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        roll: {
          '0%': { transform: 'translate(0, 0) rotate(0)' },
          '25%': { transform: 'translateX(-20px)' }, 
          '50%': { transform: 'rotate(90deg) translateY(20px)' },
          '75%': { transform: 'rotate(180deg) translateY(20px)' }, 
          '100%': { transform: 'rotate(180deg) translate(20px, 20px)' }, 
        },
        moveBefore: {
          '0%': { left: 'calc(50% - 10px)' }, 
          '25%, 50%, 75%': { left: '0' },
          '100%': { left: '-30px' }, 
        },
        moveAfter: {
          '0%, 25%': { left: '100%' },
          '50%, 75%': { left: 'calc(100% - 20px)' }, 
          '100%': { left: 'calc(50% - 10px)' }, 
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        roll: 'roll 2000ms ease infinite',
        moveBefore: 'moveBefore 2000ms ease infinite',
        moveAfter: 'moveAfter 2000ms ease infinite',
      },

      spacing: {
        
        'square': '5rem', // Tailwind uses 1 = 0.25rem = 4px, so 20px is '5'
      },
      scale: {
         // Add the scale value used in the media query
        '130': '1.3',
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
  ],
}
