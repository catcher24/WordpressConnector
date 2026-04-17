import type { Meta, StoryObj } from '@storybook/react';
import DashboardPage from './index';
import { MockDecorator } from '../../utils/MockDecorator';
import { generateMockTarget, generateMockScans, generateMockOrganization } from '../../utils/mock-data';
import { AllowedApiSchemas, AllowedAuthenticationMethods, AllowedCollectionInputMethods, AllowedCollectionMethods, AllowedScheduleIntervals, TargetType } from '../../enums';

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
      severity: { critical: 16, high: 45, medium: 120, low: 205, noise: 50, total: 436 }
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
      severity: { critical: 0, high: 0, medium: 0, low: 0, noise: 0, total: 0 }
    }),
    vulnerabilities: [],
    activeScans: [],
    ports: [],
    certificates: [],
    rootDomains: []
  })]
};

export const EmptyDashboard: Story = {
  decorators: [MockDecorator({
    vulnerabilities: [],
    activeScans: [],
    ports: [],
    certificates: [],
    rootDomains: []
  })]
};

export const UpsellDashboard: Story = {
  decorators: [MockDecorator({
    vulnerabilities: [],
    activeScans: [],
    ports: [],
    certificates: [],
    rootDomains: [],
    organization: {
      ...generateMockOrganization(),
      capabilities: {
        targetCapabilities: {
          [TargetType.WebApplication]: {
            allowedCollectionInputMethods: AllowedCollectionInputMethods.All,
            allowedCollectionMethods: AllowedCollectionMethods.All,
            allowedAuthenticationMethods: AllowedAuthenticationMethods.All,
            allowedApiSchemas: AllowedApiSchemas.All,
            allowedScheduleIntervals: AllowedScheduleIntervals.All,
            allowedCollectorGroupIds: [],
            excludedCollectorIds: [
              "38A8DF2C-0993-425F-AC80-90C0C6FF4EE9", // DNS
              "3BE982B9-D0CA-4D0E-96D2-FBD012B4CA10", // Certificates
            ]
          }
        }
      }
    }
  })]
};
