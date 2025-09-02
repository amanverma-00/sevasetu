// styles/theme.ts
export const lightTheme = {
  colors: {
    background: '#f8f9fa',
    text: '#212529',
    primary: '#667eea',
    secondary: '#764ba2',
    cardBackground: '#ffffff',
    inputBackground: '#ffffff',
    border: '#dee2e6',
  },
};

export const darkTheme = {
  colors: {
    background: '#121212',
    text: '#e0e0e0',
    primary: '#bb86fc',
    secondary: '#03dac6',
    cardBackground: '#1e1e1e',
    inputBackground: '#2d2d2d',
    border: '#444',
  },
};

export type ThemeType = typeof lightTheme | typeof darkTheme;