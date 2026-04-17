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
    connector: { organizationId: "test-org", targetId: null, siteHostname: "matched-site.com" },
    targets: [
      { id: "target-456", hostname: "other.com", preferredDisplayName: "Some Other Site" }
    ]
    // will show standard target list fetched by mock provider
  })]
};

export const SingleTargetMatchAvailable: Story = {
  decorators: [MockDecorator({
    connector: { organizationId: "test-org", targetId: null, siteHostname: "matched-site.com" },
    targets: [
      { id: "target-123", hostname: "matched-site.com", preferredDisplayName: "The Correct Site" },
      { id: "target-456", hostname: "other.com", preferredDisplayName: "Some Other Site" }
    ]
  })]
};

export const ManyTargetsAvailable: Story = {
  decorators: [MockDecorator({
    connector: { organizationId: "test-org", targetId: null, siteHostname: "unique-site.com" },
    targets: Array.from({ length: 50 }).map((_, i) => ({
      id: `target-${i}`,
      hostname: `target-${i}.com`,
      preferredDisplayName: `Existing Target ${i + 1}`
    }))
  })]
};

export const CreateNewTarget: Story = {
  decorators: [MockDecorator({
    connector: { organizationId: "test-org", targetId: null, siteHostname: "fresh-install.com" },
    targets: []
  })]
};
