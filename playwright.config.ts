import { PlaywrightTestConfig } from "@playwright/test";
import dotenv from 'dotenv';
import Browser from "./src/framework/manager/Browser";

dotenv.config();

const timeInMin: number = 60 * 1000;
const config: PlaywrightTestConfig = {
  use: {
    browserName: Browser.type(process.env.BROWSER.toLowerCase()),
    headless: false,
    channel: Browser.channel(process.env.BROWSER.toLowerCase()),
    launchOptions: {
      args: ["--start-maximized", "--disable-extensions", "--disable-plugins"],
      headless: false,
      timeout: Number.parseInt(process.env.BROWSER_LAUNCH_TIMEOUT, 10),
      slowMo: 100,
      downloadsPath: "./test-results/downloads",
    },
    viewport: null,
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    actionTimeout: Number.parseInt(process.env.ACTION_TIMEOUT, 10) * timeInMin,
    navigationTimeout: Number.parseInt(process.env.NAVIGATION_TIMEOUT, 10) * timeInMin,
    screenshot: { 
      mode: "only-on-failure",
      fullPage: true,
    },
    video: "retain-on-failure",
  },
  testDir: "./src/tests",
  outputDir: "./test-results/failure",
  retries: Number.parseInt(process.env.RETRIES, 10),
  preserveOutput: "failures-only",
  reportSlowTests: null,
  timeout: Number.parseInt(process.env.TEST_TIMEOUT, 10) * timeInMin,
  workers: Number.parseInt(process.env.PARALLEL_THREAD, 10),
  reporter: [
    ["dot"],
    ["allure-playwright", {
      detail: false,
      suiteTitle: false,
      environmentInfo: {
        OS: process.platform.toUpperCase(),
        BROWSER: process.env.BROWSER.toUpperCase(),
        BASE_URL: process.env.BASE_URL,
      },
    }],
    ['html', { open: 'never', outputFolder: "./test-results/report" }],
    ["junit", { outputFile: "./test-results/results/results.xml" }],
    ["json", { outputFile: "./test-results/results/results.json" }],
    ["./src/framework/logger/TestListener.ts"],
    ['monocart-reporter', {
      name: "Automation Report",
      outputFile: './test-results/report/execution.html',
    }],
  ],
  projects: [  
    {
      name: "local",
      testMatch: `*${process.env.TEST_NAME.trim()}*`,
    },
    {
      name: "suite",
      testMatch: "*.test.ts",
    },
  ],
};
export default config;
