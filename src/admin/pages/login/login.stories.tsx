import type { Meta, StoryObj } from '@storybook/react';
import LoginPage from './login';
import { MockDecorator } from '../../utils/MockDecorator';

const meta: Meta<typeof LoginPage> = {
  title: 'Pages/Login',
  component: LoginPage,
  decorators: [MockDecorator()],
};

export default meta;
type Story = StoryObj<typeof LoginPage>;

export const Default: Story = {};
