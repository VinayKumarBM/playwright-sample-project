import HomeSteps from "../advantage/steps/HomeSteps";
import { test } from "../framework/config/base-test";
import Allure from "../framework/reporter/Allure";
import ExcelUtil from "../framework/utils/ExcelUtil";

const testData = ExcelUtil.getTestDataArray("ContactUsTest");
// eslint-disable-next-line no-restricted-syntax
for (const data of testData) {
    test(`${data.TestID} - ${data.Description}`, async ({ page }) => {
        Allure.attachDetails(data.Description, data.Issue);
        const home = new HomeSteps(page);
        await home.launchApplication();
        await home.enterContactUsDetails(data.Category, data.Product, data.Email, data.Subject);
        await home.sendMessage();
        await home.verifySuccessMessage(data.Message);
    });
}
