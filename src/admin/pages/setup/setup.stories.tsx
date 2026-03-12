import type { Meta, StoryObj } from '@storybook/react';
import SetupWizard from './setup';
import { MockDecorator } from '../../utils/MockDecorator';

const meta: Meta<typeof SetupWizard> = {
  title: 'Pages/Setup Wizard',
  component: SetupWizard,
};

export default meta;
type Story = StoryObj<typeof SetupWizard>;

export const DefaultStart: Story = {
  decorators: [MockDecorator({
    connector: { organizationId: null, targetId: null }
  })]
};

export const OrganizationPreselected: Story = {
  decorators: [MockDecorator({
    connector: { organizationId: "test-org", targetId: null },
    targets: [] // Empties targets so it skips straight to "Create Target"
  })]
};

export const TargetSelectionAvailable: Story = {
  decorators: [MockDecorator({
    connector: { organizationId: "test-org", targetId: null },
    // will show standard target list fetched by mock provider
  })]
};
