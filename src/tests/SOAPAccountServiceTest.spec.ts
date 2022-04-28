import AccountServiceSteps from "@soapSteps/AccountServiceSteps";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";
import StringUtil from "@utils/StringUtil";

const SHEET = "SOAPAccountServiceTest";
let account: AccountServiceSteps;
test.beforeEach(async ({ page }) => {
    account = new AccountServiceSteps(page);
});

const createData = ExcelUtil.getTestData(SHEET, "TC01_AccountCreateRequest");
test(`${createData.TestID} - ${createData.Description}`, async ({ gData }) => {
    Allure.attachDetails(createData.Description, createData.Issue);
    const userName = StringUtil.randomAlphabeticString(5);
    const password = `${StringUtil.randomUppercaseString(1)}${StringUtil.randomLowercaseString(4)}${StringUtil.randomNumberString(3)}`;
    const phoneNumber = StringUtil.randomNumberString(10);
    const email = `${userName}@email.com`;
    const requestData = {
        userName: userName,
        password: password,
        email: email,
        phoneNumber: phoneNumber,
    };
    const response = await account.request(createData.EndPoint, createData.RequestBody,
        requestData, createData.Operation);
    await account.verifyResponse(response, createData.Xpath, createData.Result, createData.Operation);
    gData.set("userName", userName);
    gData.set("password", password);
    gData.set("email", email);
});

const loginData = ExcelUtil.getTestData(SHEET, "TC02_AccountLoginRequest");
test(`${loginData.TestID} - ${loginData.Description}`, async ({ gData }) => {
    Allure.attachDetails(loginData.Description, loginData.Issue);
    const requestData = {
        userName: gData.get("userName"),
        password: gData.get("password"),
        email: gData.get("email"),
    };
    const response = await account.request(loginData.EndPoint, loginData.RequestBody,
        requestData, loginData.Operation);
    await account.verifyResponse(response, loginData.Xpath, loginData.Result, loginData.Operation);
    gData.set("token", await account.getResponseContent(response, "//*[local-name()='token']", loginData.Operation));
    gData.set("userId", await account.getResponseContent(response, "//*[local-name()='userId']", loginData.Operation));
});

const logoutData = ExcelUtil.getTestData(SHEET, "TC03_AccountLogoutRequest");
test(`${logoutData.TestID} - ${logoutData.Description}`, async ({ gData }) => {
    Allure.attachDetails(logoutData.Description, logoutData.Issue);
    const requestData = {
        token: gData.get("token"),
        userId: gData.get("userId"),
    };
    const response = await account.request(logoutData.EndPoint, logoutData.RequestBody,
        requestData, logoutData.Operation);
    await account.verifyResponse(response, logoutData.Xpath, logoutData.Result, logoutData.Operation);
});

const searchData = ExcelUtil.getTestData(SHEET, "TC04_CountrySearchRequest");
test(`${searchData.TestID} - ${searchData.Description}`, async ({ }) => {
    Allure.attachDetails(searchData.Description, searchData.Issue);
    const response = await account.request(searchData.EndPoint, searchData.RequestBody,
        { countryStartingWith: searchData.Result }, searchData.Operation);
    await account.verifyResponseContains(response, searchData.Xpath, searchData.Result, searchData.Operation);
});
