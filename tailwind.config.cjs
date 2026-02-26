/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			'virgins-purple': {
  				DEFAULT: 'hsl(270 100% 25%)',
  				light: 'hsl(270 60% 35%)',
  				dark: 'hsl(270 100% 10%)',
  				50: 'hsl(270 100% 97%)',
  				100: 'hsl(270 60% 92%)',
  				200: 'hsl(270 60% 82%)',
  				900: 'hsl(270 100% 10%)',
  			},
  			'virgins-gold': {
  				DEFAULT: 'hsl(42 55% 55%)',
  				light: 'hsl(42 70% 70%)',
  				dark: 'hsl(42 55% 40%)',
  				50: 'hsl(42 80% 97%)',
  				100: 'hsl(42 70% 90%)',
  			},
  			'virgins-cream': {
  				DEFAULT: 'hsl(36 30% 97%)',
  				dark: 'hsl(36 20% 90%)',
  			},
  			'virgins-dark': 'hsl(270 100% 10%)',
  			'navy': {
  				50: '#f0f0ff',
  				800: '#1e0050',
  				900: '#1A0033',
  			},
  			'gold': {
  				50: '#fffbeb',
  				100: '#fef3c7',
  				200: '#fde68a',
  				400: '#d4a84b',
  				500: '#C9A84C',
  				600: '#b8960a',
  				700: '#a37c05',
  			},
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-sans)',
  				'Inter',
  				'sans-serif'
  			],
  			serif: [
  				'var(--font-serif)',
  				'Playfair Display',
  				'serif'
  			],
  			body: [
  				'var(--font-body)',
  				'Cormorant Garamond',
  				'serif'
  			]
  		},
  		animation: {
  			'fade-in': 'fade-in 0.5s ease-out',
  			'slide-up': 'slide-up 0.5s ease-out',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'elegant-fade': 'elegantFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
  			'float': 'gentleFloat 3s ease-in-out infinite',
  			'gold-pulse': 'goldPulse 2s ease-in-out infinite',
  			'shimmer': 'shimmer 2.5s linear infinite',
  			'spin-slow': 'spin 3s linear infinite',
  		},
  		keyframes: {
  			'fade-in': {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			'slide-up': {
  				'0%': {
  					transform: 'translateY(10px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'elegantFadeIn': {
  				from: { opacity: '0', transform: 'translateY(16px) scale(0.98)' },
  				to: { opacity: '1', transform: 'translateY(0) scale(1)' }
  			},
  			'gentleFloat': {
  				'0%, 100%': { transform: 'translateY(0px)' },
  				'50%': { transform: 'translateY(-8px)' }
  			},
  			'goldPulse': {
  				'0%, 100%': { boxShadow: '0 0 0 0 hsl(42 55% 55% / 0.4)' },
  				'50%': { boxShadow: '0 0 0 12px hsl(42 55% 55% / 0)' }
  			},
  			'shimmer': {
  				'0%': { backgroundPosition: '-200% center' },
  				'100%': { backgroundPosition: '200% center' }
  			},
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} 