import flowbitePlugin from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			screens: {
				'3xl': '1920px',
				xs: '380px'
			},
			colors: {
				landingPrimary: '#C3C8B0',
				landingSecondary: '#CBD852',
				darkPrimary: '#C3C8B0',
				secondary: '#a9d800',
				tertiary: '#d3f45a',
				lightGray: '#F6F6F6',
				mediumGray: '#C6C6C6',
				darkGray: '#878787',
				buttonBackground: '#6d794f',
				mp: '#019DE1',
				primary: {
					50: '#f9fce9',
					100: '#f2f8c7',
					200: '#e6f199',
					300: '#d6e658',
					400: '#c3d71d',
					500: '#a9d800',
					600: '#92bd00',
					700: '#749600',
					800: '#5b7500',
					900: '#495c00'
				},
				brand: {
					primary: '#C5E644',
					secondary: '#689B0F',
					dark: '#070904',
					gray: '#151810',
					muted: '#888888'
				}
			},
			fontFamily: {
				robotoRegular: ['RobotoRegular', 'serif'],
				robotoMedium: ['RobotoMedium', 'serif'],
				robotoLight: ['RobotoLight', 'serif'],
				bebas: ['BebasKai', 'serif'],
				gothamMedium: ['GothamMedium', 'serif'],
				gothamBlack: ['GothamBlack', 'serif'],
				pop: ['PoppinsRegular', 'serif'],
				popLight: ['PoppinsLight', 'serif'],
				popMedium: ['PoppinsMedium', 'serif'],
				popThinItalic: ['PoppinsThinItalic', 'serif'],
				popThinItalicsemiBold: ['PoppinsSemiBoldItalic', 'serif'],
				PoppinsExtraBold: ['PoppinsExtraBold', 'serif'],
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				display: ['Space Grotesk', 'sans-serif']
			}
		}
	},
	plugins: [flowbitePlugin]
};
