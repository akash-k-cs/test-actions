import { test as base } from '@playwright/test';

export type CustomOption = {
  configFileName: string;
}

export const ctest = base.extend<CustomOption>({
  configFileName: [process.env.CONFIG_FILENAME || 'default.config.json', { option: true }],
});