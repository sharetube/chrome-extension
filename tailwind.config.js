module.exports = {
  content: ['./content-script/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'background-primary': 'var(--st-background-primary)',
        'background-secondary': 'var(--st-background-secondary)',
        'background-active': 'var(--st-background-active)',
        'text-primary': 'var(--st-text-primary)',
        'text-secondary': 'var(--st-text-secondary)',
        'spec-outline': 'var(--st-spec-outline)',
        'spec-badge-chip-background': 'var(--st-spec-badge-chip-background)',
        'icon-shape-color': 'var(--st-icon-shape-color)',
        'spec-wordmark-text': 'var(--st-spec-wordmark-text)',
        'spec-button-chip-background-hover': 'var(--st-spec-button-chip-background-hover)',
        'spec-base-background': 'var(--st-spec-base-background)',
        'spec-menu-background': 'var(--st-spec-menu-background)',
      },
      fontFamily: {
        primary: 'var(--st-font-primary)',
        secondary: 'var(--st-font-secondary)',
      },
    },
  },
  plugins: [],
};
