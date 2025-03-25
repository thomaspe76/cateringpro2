import { extendTheme, ThemeConfig } from '@chakra-ui/react';

// Farbpalette
const colors = {
  brand: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Primärfarbe
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  accent: {
    500: '#f97316', // Akzentfarbe (Orange)
  }
};

// Chakra UI Konfiguration
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

// Komponenten-Stile
const components = {
  Button: {
    // Basisstil für alle Buttons
    baseStyle: {
      fontWeight: "semibold",
      borderRadius: "md",
    },
    // Vordefinierte Varianten
    variants: {
      primary: {
        bg: "brand.500",
        color: "white",
        _hover: { bg: "brand.600" },
      },
      secondary: {
        bg: "gray.200",
        color: "gray.800",
        _hover: { bg: "gray.300" },
      },
      accent: {
        bg: "accent.500",
        color: "white",
        _hover: { opacity: 0.9 },
      },
    },
  },
  // Card-Komponente für einheitliche Karten
  Card: {
    baseStyle: {
      p: "6",
      bg: "white",
      rounded: "lg",
      boxShadow: "sm",
    },
  },
};

// Typografie
const fonts = {
  heading: `'Inter', sans-serif`,
  body: `'Inter', sans-serif`,
};

// Theme zusammenstellen
const theme = extendTheme({
  colors,
  fonts,
  components,
  config,
});

export default theme; 