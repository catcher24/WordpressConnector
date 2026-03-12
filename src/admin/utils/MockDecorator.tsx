import { setupStorybookMocks } from "./mock-fetch";

export const MockDecorator = (customMocks: any = {}) => (Story: any) => {
  // Run synchronously before the component returns
  setupStorybookMocks(customMocks);
  return <Story />;
};
