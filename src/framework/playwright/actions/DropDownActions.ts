import { test, Locator } from "@playwright/test";
import HTMLConstants from "../../constants/HTMLConstants";

export default class DropDownActions {
  private locator: Locator;
  private description: string;

  /**
   * Sets the locator with description
   * @param locator
   * @param description
   * @returns
   */
  public setLocator(locator: Locator, description: string): DropDownActions {
    this.locator = locator;
    this.description = description;
    return this;
  }

  /**
   * Select the dropdown by value
   * @param value
   * @returns
   */
  public async selectByValue(value: string) {
    await test.step(`Selecting value ${value} from ${this.description}`, async () => {
      await this.locator.selectOption({ value });
    });
    return this;
  }

  /**
   * Select the dropdown by Label
   * @param text
   * @returns
   */
  public async selectByVisibleText(text: string) {
    await test.step(`Selecting text ${text} from ${this.description}`, async () => {
      await this.locator.selectOption({ label: text });
    });
    return this;
  }

  /**
   * Select the dropdown by index
   * @param index
   * @returns
   */
  public async selectByIndex(index: number) {
    await test.step(`Selecting index ${index} of ${this.description}`, async () => {
      await this.locator.selectOption({ index });
    });
    return this;
  }

  /**
   * Gets all the options in dropdown
   * @param index
   * @returns
   */
  public async getAllOptions(): Promise<string[]> {
    let selectOptions: string[];
    await test.step(
      `Getting all the options of ${this.description}`,
      async () => {
        selectOptions = await this.locator.locator(HTMLConstants.OPTION).allTextContents();
      },
    );
    return selectOptions;
  }

  /**
   * Gets all the selected options in dropdown
   * @param index
   * @returns
   */
  public async getAllSelectedOptions(): Promise<string[]> {
    let selectOptions: string[];
    await test.step(
      `Getting all the selected options of ${this.description}`,
      async () => {
        selectOptions = await this.locator
          .locator(HTMLConstants.SELECTED_OPTION)
          .allTextContents();
      },
    );
    return selectOptions;
  }
}
