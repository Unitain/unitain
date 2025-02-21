import type { Meta, StoryObj } from '@storybook/react';
import { MaterialCard } from './MaterialCard';

const meta: Meta<typeof MaterialCard> = {
  title: 'Components/MaterialCard',
  component: MaterialCard,
  tags: ['autodocs'],
  argTypes: {
    elevation: {
      control: { type: 'range', min: 1, max: 24 },
      description: 'Shadow elevation level (1-24)',
    },
    outlined: {
      control: 'boolean',
      description: 'Whether to show an outline instead of elevation',
    },
    hover: {
      control: 'boolean',
      description: 'Whether to show hover elevation effect',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the card is in a loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the card is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MaterialCard>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">Card Title</h2>
        <p>This is a basic Material Design card component.</p>
      </div>
    ),
    elevation: 1,
    hover: true,
  },
};

export const Outlined: Story = {
  args: {
    children: (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">Outlined Card</h2>
        <p>This card uses an outline instead of elevation.</p>
      </div>
    ),
    outlined: true,
  },
};

export const Loading: Story = {
  args: {
    children: (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">Loading Card</h2>
        <p>This card is in a loading state.</p>
      </div>
    ),
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">Disabled Card</h2>
        <p>This card is disabled and cannot be interacted with.</p>
      </div>
    ),
    disabled: true,
  },
};