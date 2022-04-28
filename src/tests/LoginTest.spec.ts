import HomeSteps from "@uiSteps/HomeSteps";
import RegistrationSteps from "@uiSteps/RegistrationSteps";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "LoginTest";
let home: HomeSteps;
test.beforeEach(async ({ page }) => {
    home = new HomeSteps(page);
});

const data1 = ExcelUtil.getTestData(SHEET, "TC01_ValidLogin");
test(`${data1.TestID} - ${data1.Description}`, async () => {
    Allure.attachDetails(data1.Description, data1.Issue);
    await home.launchApplication();
    await home.login(data1.UserName, data1.Password);
    await home.validateLogin(data1.UserName);
    await home.logout();
});

const data2 = ExcelUtil.getTestData(SHEET, "TC02_InValidLogin");
test(`${data2.TestID} - ${data2.Description}`, async () => {
    Allure.attachDetails(data2.Description, data2.Issue);
    await home.launchApplication();
    await home.login(data2.UserName, data2.Password);
    await home.validateInvalidLogin(data2.ErrorMessage);
});

const data3 = ExcelUtil.getTestData(SHEET, "TC03_LoginCreateAccount");
test(`${data3.TestID} - ${data3.Description}`, async ({ page }) => {
    Allure.attachDetails(data3.Description, data3.Issue);
    await home.launchApplication();
    await home.navigateToCreateAccount();
    const register = new RegistrationSteps(page);
    await register.alreadyHaveAccount();
    await home.enterLoginDetails(data3.UserName, data3.Password);
    await home.validateLogin(data3.UserName);
    await home.logout();
});
