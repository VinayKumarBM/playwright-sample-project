import HomeSteps from "@uiSteps/HomeSteps";
import RegistrationSteps from "@uiSteps/RegistrationSteps";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const sheet = "CreateAccountTest";
const testData = ExcelUtil.getTestDataArray(sheet);
// eslint-disable-next-line no-restricted-syntax
for (const data of testData) {
    test(`${data.TestID} - ${data.Description}`, async ({ page }) => {
        Allure.attachDetails(data.Description, data.Issue);
        const home = new HomeSteps(page);
        await home.launchApplication();
        await home.navigateToCreateAccount();
        const register = new RegistrationSteps(page);
        const userName = await register.createAccount(data.Email, data.Password,
            data.ConfirmPassword, data.FirstName, data.LastName, data.PhoneNumber, data.Country,
            data.City, data.Address, data.State, data.PostalCode, data.AllowOffersPromotion);
        await register.saveRegistration();
        await home.validateLogin(userName);
        await home.logout();
    });
}
