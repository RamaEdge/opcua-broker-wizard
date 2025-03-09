
const typographyConfig = {
  DEFAULT: {
    css: {
      maxWidth: '65ch',
      color: 'hsl(var(--foreground))',
      a: {
        color: 'hsl(var(--primary))',
        textDecoration: 'underline',
        fontWeight: '500',
        '&:hover': {
          color: 'hsl(var(--primary))',
          opacity: '0.8',
        },
      },
      strong: {
        color: 'hsl(var(--foreground))',
      },
      hr: {
        borderColor: 'hsl(var(--border))',
        borderTopWidth: '1px',
      },
      blockquote: {
        borderLeftColor: 'hsl(var(--border))',
        color: 'hsl(var(--muted-foreground))',
      },
      h1: {
        color: 'hsl(var(--foreground))',
      },
      h2: {
        color: 'hsl(var(--foreground))',
      },
      h3: {
        color: 'hsl(var(--foreground))',
      },
      h4: {
        color: 'hsl(var(--foreground))',
      },
      code: {
        color: 'hsl(var(--foreground))',
        backgroundColor: 'hsl(var(--muted))',
        borderRadius: '0.25rem',
        paddingLeft: '0.25rem',
        paddingRight: '0.25rem',
        paddingTop: '0.125rem',
        paddingBottom: '0.125rem',
      },
      pre: {
        backgroundColor: 'hsl(var(--muted))',
        borderRadius: 'var(--radius)',
        padding: '1rem',
      },
      thead: {
        borderBottomColor: 'hsl(var(--border))',
      },
      'tbody tr': {
        borderBottomColor: 'hsl(var(--border))',
      },
    },
  },
};

export default {
  config: typographyConfig
};
