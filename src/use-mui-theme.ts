import {createTheme} from '@mui/material';

declare module '@mui/material/styles' {
	interface TypographyVariants {
		primary: React.CSSProperties;
		secondary: React.CSSProperties;
	}

	// Allow configuration using `createTheme`
	interface TypographyVariantsOptions {
		primary?: React.CSSProperties;
		secondary?: React.CSSProperties;
	}
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
	interface TypographyPropsVariantOverrides {
		primary: true;
		secondary: true;
	}
}

const theme = createTheme({
	palette: {
		primary: {
			main: '#1871E8',
			light: '#4D81B7',
		},
		secondary: {
			main: '#FFFFFF',
			contrastText: '#2A323C',
		},
		info: {
			main: '#FFFFFF',
			dark: '#9CA8B4',
			contrastText: '#9CA8B4',
		},
	},
	typography: {
		htmlFontSize: 12,
		fontFamily: '\'Nunito\', sans-serif',
		fontSize: 16,
		h1: {
			display: 'block',
			fontFamily: '\'Dosis\', sans-serif',
			fontSize: 18,
			fontWeight: 600,
			letterSpacing: '0.025rem',
			textTransform: 'uppercase',
		},
		secondary: {
			display: 'block',
			fontFamily: '\'Nunito\', sans-serif',
			fontSize: 16,
		},
		primary: {
			display: 'block',
			fontFamily: '\'Nunito\', sans-serif',
			fontSize: 18,
		},
	},
	components: {
		MuiButtonBase: {
			styleOverrides: {
				root: {
					boxShadow: 'none',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					boxShadow: 'none',
				},
			},
			defaultProps: {
				variant: 'contained',
			},
		},
	},
	spacing: 12,
});

export function useMuiTheme() {
	return theme;
}

export default useMuiTheme;
