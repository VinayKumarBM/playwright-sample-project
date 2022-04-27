import { test, Locator } from "@playwright/test";

export default class CheckBoxActions {
  private locator: Locator;
  private description: string;

  /**
   * Sets the locator with description
   * @param locator
   * @param description
   * @returns
   */
  public setLocator(locator: Locator, description: string): CheckBoxActions {
    this.locator = locator;
    this.description = description;
    return this;
  }

  /**
   * check checkbox or radio button
   */
  public async check() {
    await test.step(`Check ${this.description}`, async () => {
      await this.locator.check();
    });
    return this;
  }

  /**
   * uncheck checkbox or radio button
   */
  public async uncheck() {
    await await test.step(`Uncheck ${this.description}`, async () => {
      await this.locator.uncheck();
    });
    return this;
  }

  /**
   * Returns the status of the checkbox
   * @returns
   */
  public async isChecked(): Promise<boolean> {
    let status: boolean;
    await test.step(`Checking status of checkbox ${this.description}`, async () => {
        const element = this.locator;
        await element.waitFor();
        status = await element.isChecked();
      },
    );
    return status;
  }
}
