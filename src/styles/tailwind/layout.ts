
export const container = {
  center: true,
  padding: '1.5rem',
  screens: {
    '2xl': '1400px'
  }
};

export const borderRadius = {
  lg: 'var(--radius)',
  md: 'calc(var(--radius) - 2px)',
  sm: 'calc(var(--radius) - 4px)'
};

export const boxShadow = {
  glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
  subtle: '0 2px 10px rgba(0, 0, 0, 0.05)',
  elevation: '0 10px 30px rgba(0, 0, 0, 0.08)',
};

export const backgroundImage = {
  'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  'gradient-subtle': 'linear-gradient(to right, var(--tw-gradient-stops))',
};
