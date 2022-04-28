import test, { Page } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import Assert from "@asserts/Assert";
import CommonConstants from "@uiConstants/CommonConstants";
import HomePageConstants from "@uiConstants/HomePageConstants";
import HomePage from "@pages/HomePage";

export default class HomeSteps {    
    private ui: UIActions;

    constructor(private page: Page) {
        this.ui = new UIActions(page);
    }
    /**
     * Launch the Application
     */
    public async launchApplication() {
        await test.step(`Launching the application`, async () => {
            await this.ui.goto(process.env.BASE_URL, HomePageConstants.HOME_PAGE);
        });
    }
    /**
     * Log into the application
     * @param userName 
     * @param password 
     */
    public async login(userName: string, password: string) {
        await test.step(`Login to application credentials as ${userName} & ${password}`, async () => {
            await this.ui.element(HomePage.USER_ICON, HomePageConstants.USER_ICON).click();
            await this.enterLoginDetails(userName, password);
        });        
    }
    /**
     * Enter login details
     * @param userName 
     * @param password 
     */
    public async enterLoginDetails(userName: string, password: string) {
        await test.step(`Enter login credentials as ${userName} & ${password}`, async () => {
            await this.ui.editBox(HomePage.USER_NAME_TEXTBOX, HomePageConstants.USER_NAME).fill(userName);
            await this.ui.editBox(HomePage.PASSWORD_TEXTBOX, HomePageConstants.PASSWORD).fill(password);
            await this.ui.checkbox(HomePage.REMEMBER_ME_CHECKBOX, HomePageConstants.REMEMBER_ME_CHECKBOX).check();
            await this.ui.element(HomePage.SIGN_IN_BUTTON, HomePageConstants.SIGN_IN_BUTTON).click();
        });
    }
    /**
     * Validate logged in user
     * @param userName 
     */
    public async validateLogin(userName: string) {
        await test.step(`Verify that user is successfully logged in as ${userName}`, async () => {
            const user = await this.ui.element(HomePage.LOGGED_IN_USER, HomePageConstants.USER_NAME).getTextContent();
            await Assert.assertEquals(user, userName, HomePageConstants.USER_NAME);
        });        
    }
    /**
     * Validate invalid login
     * @param errorMessage 
     */
    public async validateInvalidLogin(errorMessage: string) {
        await test.step(`Verify that error message ${errorMessage}`, async () => {
            const user = await this.ui.element(HomePage.SIGN_IN_ERROR_MESSAGE, HomePageConstants.SIGN_IN_ERROR_MESSAGE)
                .getTextContent();
            await Assert.assertEquals(user, errorMessage, HomePageConstants.SIGN_IN_ERROR_MESSAGE);
        });
    }
    /**
     * Log out of the application
     */
    public async logout() {
        await test.step(`Logged out of application`, async () => {
            await this.ui.element(HomePage.LOGGED_IN_USER, HomePageConstants.USER_NAME).click();
            await this.ui.element(HomePage.SIGN_OUT_LINK, HomePageConstants.SIGN_OUT_LINK).click();
            await this.ui.pauseInSecs(CommonConstants.TWO);
        });
    }
    /**
     * Navigate to Create Account page
     */
    public async navigateToCreateAccount() {
        await test.step(`Navigate to Create Account page`, async () => {
            await this.ui.element(HomePage.USER_ICON, HomePageConstants.USER_ICON).click();
            await this.ui.element(HomePage.CREATE_NEW_ACCOUNT_LINK, HomePageConstants.CREATE_NEW_ACCOUNT_LINK).click();
        });
    }
    /**
     * Enters details into Contact Us
     * @param category 
     * @param product 
     * @param email 
     * @param subject 
     */
    public async enterContactUsDetails(category: string, product: string, email: string, subject: string) {
        await test.step(`Entering Contact Us details`, async () => {
            await this.ui.dropdown(HomePage.CATEGORY_DROPDOWN, HomePageConstants.CATEGORY_DROPDOWN)
                .selectByVisibleText(category);
            await this.ui.dropdown(HomePage.PRODUCT_DROPDOWN, HomePageConstants.PRODUCT_DROPDOWN)
                .selectByVisibleText(product);
            await this.ui.editBox(HomePage.EMAIL_TEXTBOX, HomePageConstants.EMAIL_TEXTBOX).fill(email);
            await this.ui.editBox(HomePage.SUBJECT_TEXTAREA, HomePageConstants.SUBJECT_TEXTAREA).fill(subject);
        });
    }
    /**
     * Click on Send button of Contact Us
     */
    public async sendMessage() {
        await test.step(`Click on Send button of Contact Us`, async () => {
            await this.ui.element(HomePage.SEND_BUTTON, HomePageConstants.SEND_BUTTON).click();
        });
    }
    /**
     * Verify the success message of Contact Us
     * @param message 
     */
    public async verifySuccessMessage(message: string) {
        await test.step(`Verifying Success Message of Contact Us`, async () => {
            const actualMessage = await this.ui.element(HomePage.CONTACT_US_MESSAGE,
                HomePageConstants.CONTACT_US_MESSAGE).getTextContent();
            await Assert.assertEquals(actualMessage, message, HomePageConstants.CONTACT_US_MESSAGE);
        });
    }
    /**
     * Search for Product
     * @param product 
     */
    public async searchProduct(product: string) {
        await test.step(`Searching for product '${product}'`, async () => {
            await this.ui.element(HomePage.SEARCH_ICON, HomePageConstants.SEARCH_ICON).click();
            await (await this.ui.editBox(HomePage.SEARCH_TEXTBOX, HomePageConstants.SEARCH_TEXTBOX).type(product))
                .keyPress(HomePageConstants.ENTER_KEY);
            await this.ui.element(HomePage.SEARCH_CLOSE_IMAGE, HomePageConstants.SEARCH_CLOSE_IMAGE).click();
        });
    }
    /**
     * Navigate to Management Console screen
     */
    public async navigateToManagementConsole() {
        let newPage: Page;
        await test.step(`Navigate to Management Console screen`, async () => {
            await this.ui.waitForLoadingImage();
            await this.ui.element(HomePage.HELP_ICON, HomePageConstants.HELP_ICON).click();
            newPage = await this.ui.switchToNewWindow(HomePage.MANAGEMENT_CONSOLE_LINK,
                HomePageConstants.MANAGEMENT_CONSOLE_LINK);
        });
        return newPage;
    }
}
