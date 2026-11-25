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
    // Table of contents on the right of every docs page, from its section headings.
    docs: { toc: { headingSelector: 'h2, h3' } },
    options: {
      storySort: {
        order: [
          'Getting started',
          ['Welcome'],
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
          // Components are grouped by purpose (D22). Groups in this order, components A to Z.
          // The build level (Atom L0, Atom L1, Molecule, Organism) is a story tag instead.
          'Components',
          [
            'Actions',
            ['Bulk action bar', 'Button', 'Button dock', 'Notification button', 'Segmented button'],
            'Forms and inputs',
            [
              'Calendar',
              'Checkbox',
              'Checkbox list item',
              'Date field',
              'File upload',
              'Helper text',
              'Label',
              'Multi select',
              'Password field',
              'Radio',
              'Radio list item',
              'Search field',
              'Select',
              'Slider',
              'Switch',
              'Switch list item',
              'Text area',
              'Text field',
            ],
            'Chips and labels',
            ['Assist chip', 'Badge', 'Count badge', 'Filter chip', 'Input chip', 'Status dot'],
            'Images and icons',
            ['Avatar', 'Icon', 'Icon container'],
            'Navigation',
            ['Nav item', 'Pagination', 'Rows per page', 'Side nav', 'Side nav user'],
            'Messaging',
            ['Banner', 'Empty state', 'Snackbar'],
            'Overlays',
            ['Dialog', 'Menu', 'Overlay', 'Side sheet', 'Tooltip'],
            'Loading',
            ['Progress bar', 'Skeleton', 'Spinner'],
            'Data display',
            ['List item', 'Stat card', 'Table', 'Table cell', 'Table column filter', 'Table header cell', 'Text block'],
            'Layout',
            ['App shell', 'Divider', 'Page header'],
            'Charts',
          ],
          'Pages',
          'Internal',
        ],
      },
    },
  },
};

export default preview;
