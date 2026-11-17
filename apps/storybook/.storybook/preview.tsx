import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/storybook.css';

/** Sets the brand and theme from the toolbar on the preview's <html>, the only place they are set (CLAUDE.md). */
const withBrandAndTheme: Decorator = (Story, context) => {
  const { brand = 'northline', theme = 'light' } = context.globals as { brand?: string; theme?: string };
  const root = document.documentElement;
  root.dataset.brand = brand;
  root.dataset.theme = theme;
  return <Story />;
};

const preview: Preview = {
  decorators: [withBrandAndTheme],
  globalTypes: {
    brand: {
      description: 'Brand',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: 'northline', title: 'Northline' },
          { value: 'garnet', title: 'Garnet' },
          { value: 'voltic', title: 'Voltic' },
        ],
      },
    },
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        dynamicTitle: true,
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
      },
    },
  },
  initialGlobals: { brand: 'northline', theme: 'light' },
  parameters: {
    backgrounds: { disable: true }, // the background comes from the theme (bg-primary)
    controls: { expanded: true },
    options: {
      storySort: {
        order: [
          'Foundations',
          [
            'Token pipeline',
            'Colours',
            'Typography',
            'Spacing and sizes',
            'Radius',
            'Shadows',
            'Layers',
            'Motion',
            'Icons',
          ],
          'Components',
          'Internal',
          'Pages',
        ],
      },
    },
  },
};

export default preview;
