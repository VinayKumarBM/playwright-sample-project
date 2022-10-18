import { test, Locator, Page } from "@playwright/test";

export default class UIElementActions {
  protected locator: Locator;
  protected description: string;
  protected selector: string;

  constructor(private page: Page) { }

  /**
   * Returns the first locator
   * @returns
   */
  public getLocator(): Locator {
    return this.locator.first();
  }

  /**
   * Returns the all the locators
   * @returns
   */
  public getLocators(): Locator {
    return this.locator;
  }

  /**
   * Sets the locator using the selector * 
   * @param selector 
   * @param description
   * @returns
   */
  public setElement(selector: string, description: string): UIElementActions {
    this.selector = selector;
    this.locator = this.page.locator(this.selector);
    this.description = description;
    return this;
  }

  /**
   * Sets the locator with description
   * @param locator
   * @param description
   * @returns
   */
  public setLocator(locator: Locator, description: string): UIElementActions {
    this.locator = locator;
    this.description = description;
    return this;
  }

  /**
   * Click on element
   * @returns
   */
  public async click() {
    await test.step(`Clicking on ${this.description}`, async () => {
      await this.getLocator().click();
    });
    return this;
  }

  /**
   * Double click on element
   * @returns
   */
  public async doubleClick() {
    await test.step(`Double Clicking ${this.description}`, async () => {
      await this.getLocator().dblclick();
    });
    return this;
  }

  /**
   * scroll element into view, unless it is completely visible
   * @returns
   */
  public async scrollIntoView() {
    await test.step(`Scroll to element ${this.description}`, async () => {
      await this.getLocator().scrollIntoViewIfNeeded();
    });
    return this;
  }

  /**
   * Wait for element to be invisible
   * @returns
   */
  public async waitTillInvisible() {
    await test.step(`Waiting for ${this.description} to be invisible`, async () => {
        await this.getLocator().waitFor({ state: "hidden" });
      });
    return this;
  }

  /**
   * wait for element not to be present in DOM
   * @returns
   */
  public async waitTillDetached() {
    await test.step(`Wait for ${this.description} to be detached from DOM`, async () => {
        await this.getLocator().waitFor({ state: "detached" });
      });
    return this;
  }

  /**
   * wait for element to be visible
   * @param wait time for element is visible
   * @returns
   */
  public async waitTillVisible(sec: number) {
    await test.step(`Wait for ${this.description} to be visible in DOM`, async () => {
        await this.getLocator().waitFor({ state: "visible", timeout: sec * 1000 });
      });
    return this;
  }

  /**
   * wait for element to be attached to DOM
   * @returns
   */
  public async waitForPresent() {
    await test.step(`Wait for ${this.description} to attach to DOM`, async () => {
        await this.getLocator().waitFor({ state: "attached" });
      });
    return this;
  }

  /**
   * This method hovers over the element
   */
  public async hover() {
    await test.step(`Hovering on ${this.description}`, async () => {
      await this.getLocator().hover();
    });
    return this;
  }

  /**
   * Returns input.value for <input> or <textarea> or <select> element.
   * @returns
   */
  public async getInputValue(): Promise<string> {
    let value: string;
    await test.step(`Getting input value of ${this.description}`, async () => {
      const element = this.getLocator();
      await element.waitFor();
      value = await element.inputValue();
    });
    return value;
  }

  /**
   * Gets the text content
   * @returns
   */
  public async getTextContent(): Promise<string> {
    let content: string;
    await test.step(`Getting text content of ${this.description}`, async () => {
      const element = this.getLocator();
      await element.waitFor();
      content = (await element.textContent()).trim();
    });
    return content;
  }

  /**
   * Get Attribute value
   * @param attributeName
   * @returns
   */
  public async getAttribute(attributeName: string): Promise<string> {
    let value: string;
    await test.step(`Getting attribute value of ${this.description}`, async () => {
        const element = this.getLocator();
        await element.waitFor();
        value = (await element.getAttribute(attributeName)).trim();
      });
    return value;
  }

  /**
   * Get innerHTML
   * @returns
   */
  public async getInnerHTML(): Promise<string> {
    let text: string;
    await test.step(`Get innerHTML of ${this.description}`, async () => {
      const element = this.getLocator();
      await element.waitFor();
      text = (await element.innerHTML()).trim();
    });
    return text;
  }

  /**
   * Get inner text
   * @returns
   */
  public async getInnerText(): Promise<string> {
    let text: string;
    await test.step(`Get inner text of ${this.description}`, async () => {
      const element = this.getLocator();
      await element.waitFor();
      text = (await element.innerText()).trim();
    });
    return text;
  }

  /**
   * checks if element is editable
   * @returns Promise<boolean>
   */
  public async isEditable(): Promise<boolean> {
    let status: boolean;
    await test.step(`Checking if ${this.description} is editable`, async () => {
      const element = this.getLocator();
      await element.waitFor();
      status = await element.isEditable();
    });
    return status;
  }

  /**
   * checks if element is enabled
   * @returns Promise<boolean>
   */
  public async isEnabled(): Promise<boolean> {
    let status: boolean;
    await test.step(`Checking if ${this.description} is enabled`, async () => {
      const element = this.getLocator();
      await element.waitFor();
      status = await element.isEnabled();
    });
    return status;
  }

  /**
   * checks if element is visible
   * @param wait time for element to be visible
   * @returns Promise<boolean>
   */
  public async isVisible(sec: number): Promise<boolean> {
    let visibility: boolean;
    await test.step(`Checking if ${this.description} is visible`, async () => {
      try {
        visibility = await this.getLocator().isVisible({ timeout: sec * 1000 });
      } catch (error) {
        visibility = false;
      }
    });
    return visibility;
  }

  /**
   * Press a key on web element
   * @param key
   */
  public async keyPress(key: string) {
    await test.step(`Pressing ${this.description}`, async () => {
      await this.getLocator().press(key);
    });
  }

  /**
   * Get all the text Content
   * @returns
   */
  public async getAllTextContent(): Promise<string[]> {
    let content: string[];
    await test.step(`Getting all the text content of ${this.description}`, async () => {
        const element = this.getLocators();
        await element.first().waitFor();
        content = await element.allTextContents();
      });
    return content;
  }

  /**
   * Get the count of
   * @returns
   */
  public async getCount(): Promise<number> {
    let count: number;
    await test.step(`Getting the count of ${this.description}`, async () => {
      count = await this.getLocators().count();
    });
    return count;
  }
  /**
   * Performs mouse click action on the element
   * @returns 
   */
  public async mouseClick() {
    await test.step(`Clicking on ${this.description}`, async () => {
      await this.getLocator().scrollIntoViewIfNeeded();
      const box = await this.getLocator().boundingBox();
      await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    });
    return this;
  }
  /**
   * Click on element using js
   * @returns
   */
  public async jsClick() {
    await test.step(`Clicking on ${this.description}`, async () => {
      const ele = this.getLocator();
      await ele.waitFor();
      await ele.evaluate((node: HTMLElement) => { node.click(); });
    });
    return this;
  }
}
