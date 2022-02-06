import {createTheme} from '@mui/material';
import React from 'react';

declare module '@mui/material/styles' {
	interface TypographyVariants {
		primary: React.CSSProperties;
		secondary: React.CSSProperties;
		semibold: React.CSSProperties;
		itemTitle: React.CSSProperties;
		itemDescription: React.CSSProperties;
	}

	// Allow configuration using `createTheme`
	interface TypographyVariantsOptions {
		primary?: React.CSSProperties;
		secondary?: React.CSSProperties;
		semibold: React.CSSProperties;
		itemTitle: React.CSSProperties;
		itemDescription: React.CSSProperties;
	}
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
	interface TypographyPropsVariantOverrides {
		primary: true;
		secondary: true;
		semibold: true;
		itemTitle: true;
		itemDescription: true;
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
		htmlFontSize: 12.7,
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
		semibold: {
			display: 'block',
			fontFamily: '\'Nunito\', sans-serif',
			fontSize: 18,
			fontWeight: 600,
		},
		primary: {
			display: 'block',
			fontFamily: '\'Nunito\', sans-serif',
			fontSize: 18,
		},
		itemTitle: {
			display: 'block',
			fontFamily: '\'Nunito\', sans-serif',
			fontSize: 16,
			fontWeight: 600,
		},
		itemDescription: {
			display: 'block',
			fontFamily: '\'Nunito\', sans-serif',
			fontSize: 14,
		},
	},
	components: {
		MuiButtonBase: {
			styleOverrides: {
				root: {
					boxShadow: 'none',
					textTransform: 'none',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					boxShadow: 'none',
					textTransform: 'none',
					fontSize: 14,
					fontWeight: 600,
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
