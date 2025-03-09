
const keyframes = {
  'accordion-down': {
    from: { height: '0' },
    to: { height: 'var(--radix-accordion-content-height)' },
  },
  'accordion-up': {
    from: { height: 'var(--radix-accordion-content-height)' },
    to: { height: '0' },
  },
  'fade-in': {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },
  'fade-out': {
    from: { opacity: '1' },
    to: { opacity: '0' },
  },
  'slide-up': {
    from: { transform: 'translateY(20px)', opacity: '0' },
    to: { transform: 'translateY(0)', opacity: '1' },
  },
  'slide-down': {
    from: { transform: 'translateY(-20px)', opacity: '0' },
    to: { transform: 'translateY(0)', opacity: '1' },
  },
  'slide-in-right': {
    from: { transform: 'translateX(20px)', opacity: '0' },
    to: { transform: 'translateX(0)', opacity: '1' },
  },
  'slide-in-left': {
    from: { transform: 'translateX(-20px)', opacity: '0' },
    to: { transform: 'translateX(0)', opacity: '1' },
  },
  'scale-in': {
    from: { transform: 'scale(0.95)', opacity: '0' },
    to: { transform: 'scale(1)', opacity: '1' },
  },
  'floating': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },
  pulse: {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.5' },
  },
};

const animation = {
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out',
  'fade-in': 'fade-in 0.3s ease-out',
  'fade-out': 'fade-out 0.3s ease-out',
  'slide-up': 'slide-up 0.4s ease-out',
  'slide-down': 'slide-down 0.4s ease-out',
  'slide-in-right': 'slide-in-right 0.4s ease-out',
  'slide-in-left': 'slide-in-left 0.4s ease-out',
  'scale-in': 'scale-in 0.3s ease-out',
  'floating': 'floating 3s ease-in-out infinite',
  'pulse': 'pulse 2s ease-in-out infinite',
};

export default {
  keyframes,
  animation
};
