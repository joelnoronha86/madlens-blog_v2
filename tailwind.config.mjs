/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        parchment: {
          light: '#FAF7F2',
          base: '#F4EFE6',
          deep: '#ECE5D8',
          border: '#DCD3C1',
          ruled: '#DDD4C4',
        },
        indigo: {
          deep: '#2C4251',
          dark: '#1F303C',
          light: '#4A6B82',
          soft: '#E7EFF4',
        },
        madder: {
          red: '#943D36',
          dark: '#7A2E28',
          light: '#BA564E',
          soft: '#F8ECEB',
        },
        weld: {
          ochre: '#C98E3A',
          gold: '#DB9C42',
          light: '#E8B868',
          soft: '#FAF3E7',
        },
        sage: {
          botanical: '#5B7065',
          deep: '#475850',
          light: '#799084',
          soft: '#EDF3F0',
        },
        ink: {
          charcoal: '#1E252B',
          muted: '#525D65',
          faint: '#7B8891',
        },
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Lora"', 'Georgia', 'serif'],
        mono: ['"Courier Prime"', '"Courier New"', 'monospace'],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            color: '#2C4251',
            fontFamily: '"Lora", Georgia, serif',
            lineHeight: '1.65',
            fontSize: '1.1rem',
            'h1, h2, h3, h4': {
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              color: '#2C4251',
              fontWeight: '600',
              letterSpacing: '0.02em',
            },
            h1: { fontSize: '2.5rem', lineHeight: '1.15' },
            h2: { fontSize: '1.875rem', lineHeight: '1.25', marginTop: '2em' },
            h3: { fontSize: '1.45rem', lineHeight: '1.3', marginTop: '1.6em' },
            a: {
              color: '#943D36',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              '&:hover': {
                color: '#7A2E28',
              },
            },
            blockquote: {
              fontStyle: 'italic',
              borderLeftColor: '#C98E3A',
              color: '#1E252B',
              backgroundColor: '#ECE5D8',
              padding: '1rem 1.25rem',
              borderRadius: '0.25rem',
            },
            code: {
              fontFamily: '"Courier Prime", monospace',
              backgroundColor: '#ECE5D8',
              padding: '0.15rem 0.35rem',
              borderRadius: '0.2rem',
              fontSize: '0.9em',
            },
            hr: {
              borderColor: '#DCD3C1',
              marginTop: '2.5rem',
              marginBottom: '2.5rem',
            },
            figcaption: {
              fontFamily: '"Courier Prime", monospace',
              fontSize: '0.825rem',
              color: '#5B7065',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
