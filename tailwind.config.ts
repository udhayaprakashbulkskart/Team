import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tp: {
          navy: '#101536',
          navy2: '#1A2150',
          purple: '#6D4DF2',
          purpleDark: '#5635D6',
          lilac: '#EFEBFF',
          canvas: '#F5F4FB',
          ink: '#1C1B3A',
          muted: '#7B7D98',
          line: '#E8E6F4',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
