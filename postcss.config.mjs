
export default {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {}, // This is the correct way to include tailwindcss
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production'
      ? {
          cssnano: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
        }
      : {}),
  },
};
