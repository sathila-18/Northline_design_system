import type { Meta, StoryObj } from '@storybook/react-vite';
import { nlIconNames } from '../../icons';
import { NlAvatar, type NlAvatarProps } from './NlAvatar';

const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge', 'xxxlarge'] as const;

/** Abstract placeholder artwork served by Storybook (apps/storybook/public). Not a person. */
const placeholder = './avatar-placeholder.svg';

const meta = {
  title: 'Components/Atoms L1/Avatar',
  component: NlAvatar,
  args: { size: 'medium', online: false, onlineLabel: 'Online' },
  argTypes: {
    size: { control: 'select', options: sizes },
    src: { control: 'text' },
    alt: { control: 'text' },
    initials: { control: 'text' },
    icon: { control: 'select', options: nlIconNames },
    online: { control: 'boolean' },
    onlineLabel: { control: 'text' },
  },
} satisfies Meta<typeof NlAvatar>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Every size in one row. */
function Row(args: NlAvatarProps) {
  return (
    <div className="nl:flex nl:items-end nl:gap-l">
      {sizes.map((size) => (
        <NlAvatar key={size} {...args} size={size} />
      ))}
    </div>
  );
}

/** One avatar with every option as a control. With no photo or initials it shows the icon. */
export const Default: Story = {};

/** The seven sizes, icon type. */
export const Sizes: Story = { render: (args) => <Row {...args} /> };

/** A photo covering the circle, at every size. Named by alt. */
export const Image: Story = { args: { src: placeholder, alt: 'Member 0042' }, render: (args) => <Row {...args} /> };

/** Initials (up to 2, uppercase) in text-secondary on bg-icons, at every size. */
export const Initials: Story = { args: { initials: 'mx' }, render: (args) => <Row {...args} /> };

/** The default person icon in fg-secondary on bg-icons, at every size. */
export const Icon: Story = { render: (args) => <Row {...args} /> };

/** The online dot at every size, on each type. */
export const Online: Story = {
  args: { online: true },
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-l">
      <Row {...args} src={placeholder} alt="Member 0042" />
      <Row {...args} initials="MX" alt="Member 0042" />
      <Row {...args} alt="Member 0042" />
    </div>
  ),
};

/** A photo that fails to load falls back to the initials, then to the icon. */
export const ImageFallback: Story = {
  name: 'Image fallback',
  render: (args) => (
    <div className="nl:flex nl:items-end nl:gap-l">
      <NlAvatar {...args} src="./missing-avatar.png" initials="MX" alt="Member 0042" />
      <NlAvatar {...args} src="./missing-avatar.png" alt="Member 0042" />
    </div>
  ),
};

/** Next to a visible name, the avatar is decorative (alt=""), and the dot still announces presence. */
export const WithName: Story = {
  name: 'With a name',
  args: { src: placeholder, alt: '', online: true },
  render: (args) => (
    <span className="nl:inline-flex nl:items-center nl:gap-s nl:text-body-m nl:text-primary">
      <NlAvatar {...args} />
      Member 0042
    </span>
  ),
};
