import type { Meta, StoryObj } from '@storybook/react';
import DashboardPage from './index';
import { MockDecorator } from '../../utils/MockDecorator';
import { generateMockTarget, generateMockScans } from '../../utils/mock-data';

const meta: Meta<typeof DashboardPage> = {
  title: 'Pages/Dashboard',
  component: DashboardPage,
};

export default meta;
type Story = StoryObj<typeof DashboardPage>;

export const Default: Story = {
  decorators: [MockDecorator()]
};

export const HighlyVulnerableTarget: Story = {
  decorators: [MockDecorator({
    target: generateMockTarget({
        severity: { critical: 16, high: 45, medium: 120, low: 205, noise: 50 }
    })
  })]
};

export const TargetWithActiveScans: Story = {
  decorators: [MockDecorator({
    activeScans: generateMockScans(3, true)
  })]
};

export const FullyCleanTarget: Story = {
  decorators: [MockDecorator({
    target: generateMockTarget({
        severity: { critical: 0, high: 0, medium: 0, low: 0, noise: 0 }
    }),
    vulnerabilities: [],
    activeScans: [],
    ports: [],
    certificates: []
  })]
};
