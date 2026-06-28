import type { Config } from 'tailwindcss';

/**
 * Shared Tailwind preset encoding the SalesForce AI design system
 * (see DESIGN.md). Apps extend this so tokens stay consistent.
 */
const preset: Omit<Config, 'content'> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Material-3 derived tokens (light scheme)
        background: '#f8f9ff',
        'on-background': '#0b1c30',
        surface: '#f8f9ff',
        'surface-dim': '#cbdbf5',
        'surface-bright': '#f8f9ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#eff4ff',
        'surface-container': '#e5eeff',
        'surface-container-high': '#dce9ff',
        'surface-container-highest': '#d3e4fe',
        'on-surface': '#0b1c30',
        'on-surface-variant': '#464554',
        'inverse-surface': '#213145',
        'inverse-on-surface': '#eaf1ff',
        outline: '#767586',
        'outline-variant': '#c7c4d7',
        'surface-tint': '#494bd6',
        primary: '#4648d4',
        'on-primary': '#ffffff',
        'primary-container': '#6063ee',
        'on-primary-container': '#fffbff',
        'inverse-primary': '#c0c1ff',
        secondary: '#6b38d4',
        'on-secondary': '#ffffff',
        'secondary-container': '#8455ef',
        'on-secondary-container': '#fffbff',
        tertiary: '#00628d',
        'on-tertiary': '#ffffff',
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        success: '#1b7d4f',
        'success-container': '#a8f5c8',
        'on-success-container': '#00210f',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-geist)', 'Geist', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'headline-xl': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-lg': ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '1.3', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '1', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '1', fontWeight: '600' }],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm: '0.25rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      spacing: {
        base: '4px',
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        gutter: '20px',
        'margin-page': '40px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11, 28, 48, 0.04), 0 0 0 1px rgba(199, 196, 215, 0.4)',
        elevated:
          '0 8px 16px rgba(11, 28, 48, 0.08), 0 2px 4px rgba(11, 28, 48, 0.04), 0 0 0 1px rgba(199, 196, 215, 0.4)',
        'focus-ring': '0 0 0 3px rgba(70, 72, 212, 0.18)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)',
      },
    },
  },
};

export default preset;
