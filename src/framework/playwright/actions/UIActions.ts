import { test, Page } from "@playwright/test";
import CommonConstants from "../../constants/CommonConstants";
import HTMLConstants from "../../constants/HTMLConstants";
import AlertActions from "./AlertActions";
import CheckBoxActions from "./CheckBoxActions";
import DropDownActions from "./DropDownActions";
import EditBoxActions from "./EditBoxActions";
import UIElementActions from "./UIElementActions";

export default class UIActions {
  private elementAction: UIElementActions;
  private editBoxAction: EditBoxActions;
  private checkboxAction: CheckBoxActions;
  private dropdownAction: DropDownActions;
  private alertAction: AlertActions;

  constructor(private page: Page) {
    this.elementAction = new UIElementActions(page);
    this.editBoxAction = new EditBoxActions(page);
    this.checkboxAction = new CheckBoxActions();
    this.dropdownAction = new DropDownActions();
    this.alertAction = new AlertActions(this.page);
  }

  /**
   * Returns page object
   * @returns
   */
  public getPage(): Page {
    return this.page;
  }

  /**
   * Sets the page
   * @param page
   */
  public setPage(page: Page) {
    this.page = page;
    this.elementAction = new UIElementActions(page);
    this.editBoxAction = new EditBoxActions(page);
    this.alertAction = new AlertActions(this.page);
  }

  /**
   * Close page 
   * @returns 
   */
  public closePage() {
    this.page.close();
  }

  /**
   * Returns the instance of Alert
   * @returns
   */
  public alert() {
    return this.alertAction;
  }

  /**
   * Returns the instance of editbox actions
   * @param selector
   * @param description
   * @returns
   */
  public editBox(selector: string, description: string) {
    return this.editBoxAction.setEditBox(selector, description);
  }

  /**
   * Returns the instance of UIElements actions
   * @param selector
   * @param description
   * @returns
   */
  public element(selector: string, description: string) {
    return this.elementAction.setElement(selector, description);
  }

  /**
   * Returns the instance of Dropdown actions
   * @param selector
   * @param description
   * @returns
   */
  public dropdown(selector: string, description: string) {
    return this.dropdownAction.setLocator(
      this.elementAction.setElement(selector, description).getLocator(),
      description,
    );
  }

  /**
   * Returns the instance of CheckBox actions
   * @param selector
   * @param description
   * @returns
   */
  public checkbox(selector: string, description: string) {
    return this.checkboxAction.setLocator(
      this.elementAction.setElement(selector, description).getLocator(),
      description,
    );
  }

  /**
   * Navigate to specified URL
   * @param URL
   * @param description
   */
  public async goto(URL: string, description: string) {
    await test.step(`Navigate to ${description}`, async () => {
      await this.page.goto(URL);
    });
  }

  /**
   * Navigate to previous URL
   * @param description
   */
  public async goBack(description: string) {
    await test.step(`Go to the previous ${description}`, async () => {
      await this.page.goBack();
    });
  }

  /**
   * Navigate to next URL
   * @param description
   */
  public async goForward(description: string) {
    await test.step(`Go to the next ${description}`, async () => {
      await this.page.goForward();
    });
  }

  /**
   * Page Refresh
   */
  public async pageRefresh() {
    await test.step(`Page Refresh`, async () => {
      await this.page.reload();
    });
  }

  /**
   * Press a key on web page
   * @param key
   * @param description
   */
  public async keyPress(key: string, description: string) {
    await test.step(`Pressing ${description}`, async () => {
      await this.page.keyboard.press(key);
    });
  }

  /**
   * Waits for the main frame navigation and returns the main resource response.
   */
  public async waitForNavigation() {
    await test.step(`Waiting for navigation`, async () => {
      await this.page.waitForNavigation();
    });
  }

  /**
   * Returns when the required load state has been reached.
   */
  public async waitForLoadState() {
    await test.step(`Waiting for load event`, async () => {
      await this.page.waitForLoadState();
    });
  }

  /**
   * Returns when the required dom content is in loaded state.
   */
  public async waitForDomContentLoaded() {
    await test.step(`Waiting for load event`, async () => {
      await this.page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    });
  }

  /**
   * Gets the handle of the new window
   * @param selector
   * @param description
   */
  public async switchToNewWindow(
    selector: string,
    description: string,
  ): Promise<Page> {
    let [newPage] = [this.page];
    await test.step(`Opening  ${description} Window`, async () => {
      [newPage] = await Promise.all([
        this.page.context().waitForEvent("page"),
        await this.elementAction.setElement(selector, description).click(),
      ]);
      await newPage.waitForLoadState("domcontentloaded");
    });
    return newPage;
  }

  /**
   * Clicks the an element, accepts the alert and returns the alert message
   * @param selector  selector of the element
   * @param description description of element
   * @returns alert message
   */
  public async acceptAlertOnElementClick(
    selector: string,
    description: string,
  ): Promise<string> {
    const message = this.alert().accept();
    return this.handleAlert(selector, description, message);
  }

  /**
   * Clicks the an element, dismisses the alert and returns the alert message
   * @param selector  selector of the element
   * @param description description of element
   * @returns alert message
   */
  public async dismissAlertOnElementClick(
    selector: string,
    description: string,
  ): Promise<string> {
    const message = this.alert().dismiss();
    return this.handleAlert(selector, description, message);
  }

  /**
   * Clicks the an element, accepts the alert prompt and returns the alert message
   * @param selector  selector of the element
   * @param description description of element
   * @param promptText A text to enter in prompt.
   * @returns alert message
   */
  public async acceptPromptOnElementClick(
    selector: string,
    description: string,
    promptText: string,
  ): Promise<string> {
    const message = this.alert().accept(promptText);
    return this.handleAlert(selector, description, message);
  }

  private async handleAlert(
    selector: string,
    description: string,
    message: Promise<string>,
  ) {
    await this.elementAction.setElement(selector, description).click();
    return message;
  }

  /**
   * Gets the page Title
   * @returns
   */
  public async getPageTitle(): Promise<string> {
    let title: string;
    await test.step(`Getting Page Title`, async () => {
      title = await this.page.title();
    });
    return title;
  }

  /**
   * Downloads the file and returns the downloaded file name
   * @param selector element that results in file download
   * @param description description of the element
   * @returns downloaded file name
   */
  public async downloadFile(selector: string, description: string): Promise<string> {
    let fileName: string;
    await test.step(`Downloading ${description} file`, async () => {
      const [download] = await Promise.all([
        this.page.waitForEvent('download'),
        await this.page.locator(selector).click({ modifiers: ["Alt"] }),
      ]);
      fileName = download.suggestedFilename();
      const filePath = `${CommonConstants.DOWNLOAD_PATH}${fileName}`;
      await download.saveAs(filePath);
      await download.delete();
    });
    return fileName;
  }
  /**
   * Pause the execution in seconds
   * @param sec
   */
  public async pauseInSecs(sec: number) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, sec * CommonConstants.ONE_THOUSAND));
  }

  /**
   * Wait For Page loading image to disappear
   * @param page
   */
  public async waitForLoadingImage() {
    await test.step("Waiting for Loading Image to disappear", async () => {
      try {
        await this.page.locator(HTMLConstants.LOADING_IMAGE).waitFor({
          state: "visible",
          timeout: CommonConstants.ONE_THOUSAND * CommonConstants.THREE,
        });
      } catch (error) {
        // console.log("Loading Image was not displayed");
      }
      await this.page.locator(HTMLConstants.LOADING_IMAGE).waitFor({ state: "hidden" });
      await this.pauseInSecs(CommonConstants.HALF);
    });
  }
}
