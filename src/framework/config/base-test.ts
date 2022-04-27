/* eslint-disable @typescript-eslint/no-unused-vars */
import { test as base } from '@playwright/test';

export const test = base.extend<{ MyFixtures }, { gData: Map<string, any> }>({
  gData: [async ({ }, use) => {
    const data = new Map<string, any>();
    data.set("SPACE", " ");
    data.set("HYPHEN", "-");
    data.set("UNDERSCORE", "_");
    await use(data);
  }, { scope: 'worker' }],

  page: async ({ page, gData }, use) => {
    await use(page);
  },
});
export { expect } from '@playwright/test';
