import type { Meta, StoryObj } from '@storybook/react';
import SelectOrganizationPage from './select-organization';
import { MockDecorator } from '../../utils/MockDecorator';
import { generateMockOrganization } from '../../utils/mock-data';

const meta: Meta<typeof SelectOrganizationPage> = {
  title: 'Pages/Select Organization',
  component: SelectOrganizationPage,
};

export default meta;
type Story = StoryObj<typeof SelectOrganizationPage>;

export const Default: Story = {
  decorators: [MockDecorator()],
};

export const ManyOrganizations: Story = {
  decorators: [MockDecorator({
    organizations: Array.from({ length: 15 }).map(() => generateMockOrganization())
  })],
};

export const NoValidSubscription: Story = {
  decorators: [MockDecorator({
    organizations: [{ ...generateMockOrganization(), hasValidSubscription: false, name: "Expired Org Ltd." }]
  })]
};
