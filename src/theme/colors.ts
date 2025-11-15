export const colors = {
  primary: '#FF6B35', // Hot orange/red - represents "hot" in HotPotato
  primaryDark: '#E55525',
  primaryLight: '#FF8555',

  secondary: '#004E89', // Deep blue for contrast
  secondaryDark: '#003A66',
  secondaryLight: '#1A6BA8',

  success: '#06D6A0',
  warning: '#FFB627',
  error: '#EF476F',
  info: '#118AB2',

  background: '#FFFFFF',
  surface: '#F8F9FA',
  card: '#FFFFFF',

  text: {
    primary: '#1A1A1A',
    secondary: '#6C757D',
    disabled: '#ADB5BD',
    inverse: '#FFFFFF',
  },

  border: {
    light: '#E9ECEF',
    medium: '#DEE2E6',
    dark: '#CED4DA',
  },

  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export type Colors = typeof colors;
