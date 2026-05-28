import type { Decorator, Preview } from '@storybook/react';
import React, { useEffect } from 'react';

import '../src/styles.css';

/** Toggle the `dark` class on the story root (and html for CSS-variable coverage). */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals['theme'] as string;
  const isDark = theme === 'dark';

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div
      className={isDark ? 'dark' : ''}
      style={{
        backgroundColor: isDark ? '#111110' : '#fafafa',
        minHeight: '100%',
        padding: '24px',
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color scheme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
  parameters: {
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
