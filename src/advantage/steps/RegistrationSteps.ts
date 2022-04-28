import test, { Page } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import Assert from "@asserts/Assert";
import StringUtil from "@utils/StringUtil";
import CommonConstants from "@uiConstants/CommonConstants";
import RegistrationPageConstants from "@uiConstants/RegistrationPageConstants";
import RegistrationPage from "@pages/RegistrationPage";

export default class RegistrationSteps {
    private ui: UIActions;

    constructor(private page: Page) {
        this.ui = new UIActions(page);
    }
    /**
     * Creating a new Account
     * @param email 
     * @param password 
     * @param confirmPassword 
     * @param firstName 
     * @param lastName 
     * @param phoneNumber 
     * @param country 
     * @param city 
     * @param address 
     * @param state 
     * @param postalCode 
     * @param allowOffersPromotion 
     * @returns 
     */
    public async createAccount(email: string, password: string, confirmPassword: string, firstName: string,
        lastName: string, phoneNumber: string, country: string, city: string, address: string, state: string,
        postalCode: string, allowOffersPromotion: string) {
        let userName: string;
        await test.step(`Create New Account`, async () => {
            userName = StringUtil.randomAlphabeticString(CommonConstants.TEN);
            await this.ui.editBox(RegistrationPage.USER_NAME_TEXTBOX,
                RegistrationPageConstants.USER_NAME).fill(userName);
            await this.ui.editBox(RegistrationPage.EMAIL_TEXTBOX, RegistrationPageConstants.EMAIL).fill(email);
            await this.ui.editBox(RegistrationPage.PASSWORD_TEXTBOX, RegistrationPageConstants.PASSWORD).fill(password);
            await this.ui.editBox(RegistrationPage.PASSWORD_CONFIRM_TEXTBOX, RegistrationPageConstants.CONFIRM_PASSWORD)
                .fill(confirmPassword);
            await this.ui.editBox(RegistrationPage.FIRST_NAME_TEXTBOX, RegistrationPageConstants.FIRST_NAME)
                .fill(firstName);
            await this.ui.editBox(RegistrationPage.LAST_NAME_TEXTBOX, RegistrationPageConstants.LAST_NAME)
                .fill(lastName);
            await this.ui.editBox(RegistrationPage.PHONE_NUMBER_TEXTBOX, RegistrationPageConstants.PHONE_NUMBER)
                .fill(phoneNumber);
            await this.ui.dropdown(RegistrationPage.COUNTRY_DROPDOWN, RegistrationPageConstants.COUNTRY)
                .selectByVisibleText(country);
            await this.ui.editBox(RegistrationPage.CITY_TEXTBOX, RegistrationPageConstants.CITY).fill(city);
            await this.ui.editBox(RegistrationPage.ADDRESS_TEXTBOX, RegistrationPageConstants.ADDRESS).fill(address);
            await this.ui.editBox(RegistrationPage.STATE_TEXTBOX, RegistrationPageConstants.STATE).fill(state);
            await this.ui.editBox(RegistrationPage.POSTAL_CODE_TEXTBOX, RegistrationPageConstants.POSTAL_CODE)
                .fill(postalCode);
            await Assert.assertTrue(await this.ui.checkbox(RegistrationPage.PROMOTION_CHECKBOX,
                RegistrationPageConstants.PROMOTION).isChecked(), RegistrationPageConstants.PROMOTION);            
            if (allowOffersPromotion.toLowerCase() === CommonConstants.FALSE) {
                await this.ui.checkbox(RegistrationPage.PROMOTION_CHECKBOX, RegistrationPageConstants.PROMOTION)
                    .uncheck();
            }
            await this.ui.checkbox(RegistrationPage.PRIVACY_POLICY_CHECKBOX,
                RegistrationPageConstants.TERMS_AND_CONDITIONS).check();
        });
        return userName;
    }
    /**
     * Saves the registration details
     */
    public async saveRegistration() {
        await test.step(`Save registration details`, async () => {
            await this.ui.element(RegistrationPage.REGISTER_BUTTON, RegistrationPageConstants.REGISTER_BUTTON).click();
        });
    }
    /**
     * Click on link Already having Account
     */
    public async alreadyHaveAccount() {
        await test.step(`Click on Already have an account link`, async () => {
            await this.ui.element(RegistrationPage.ALREADY_HAVE_AN_ACCOUNT_LINK,
                RegistrationPageConstants.ALREADY_HAVE_AN_ACCOUNT_LINK).click();
        });
    }
}
