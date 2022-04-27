import { Page } from "@playwright/test";

export default class AlertActions {
  constructor(private page: Page) {}

  /**
   * Accept alert and return alert message
   * @param promptText A text to enter in prompt. It is optional for alerts.
   * @returns alert message
   */
  public async accept(promptText?: string): Promise<string> {
    return this.page.waitForEvent("dialog").then(async (dialog) => {
      if (dialog.type() === "prompt") {
        await dialog.accept(promptText);
      } else {
        await dialog.accept();
      }
      return dialog.message().trim();
    });
  }

  /**
   * Dismiss alert and return alert message
   * @returns alert message
   */
  public async dismiss(): Promise<string> {
    return this.page.waitForEvent("dialog").then(async (d) => {
      await d.dismiss();
      return d.message().trim();
    });
  }
}
