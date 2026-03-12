import type { Meta, StoryObj } from '@storybook/react';
import { SettingsForm } from './settings';
import { MockDecorator } from '../../utils/MockDecorator';
import { generateMockOrganization, generateMockTarget } from '../../utils/mock-data';

const meta: Meta<typeof SettingsForm> = {
  title: 'Pages/Settings',
  component: SettingsForm,
};

export default meta;
type Story = StoryObj<typeof SettingsForm>;

export const Default: Story = {
  decorators: [MockDecorator()],
};

export const OneOrganizationAndTarget: Story = {
  decorators: [MockDecorator({
    organizations: [generateMockOrganization("single-org")],
    targets: [generateMockTarget({ id: "single-target" })]
  })],
};
