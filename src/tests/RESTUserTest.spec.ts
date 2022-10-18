import UserSteps from "@restSteps/UserSteps";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";
import StringUtil from "@utils/StringUtil";

const SHEET = "RESTUserTest";
let user: UserSteps;
test.beforeEach(async ({ page }) => {
    user = new UserSteps(page);
});

const allUserData = ExcelUtil.getTestData(SHEET, "TC01_GetAllUserTest");
test(`${allUserData.TestID} - ${allUserData.Description}`, async ({ gData }) => {
    Allure.attachDetails(allUserData.Description, allUserData.Issue);
    const response = await user.get(allUserData.EndPoint, allUserData.Operation);
    await user.verifyStatusCode(response, allUserData.Status);
    await user.verifyContentIsNotNull(response, allUserData.JSONPath, allUserData.Operation);
    const id = await user.extractResponseValue(response, allUserData.JSONPath, allUserData.Operation);
    gData.set("id", id);
});

const singleUserData = ExcelUtil.getTestData(SHEET, "TC02_GetSingleUser");
test(`${singleUserData.TestID} - ${singleUserData.Description}`, async ({ gData }) => {
    Allure.attachDetails(singleUserData.Description, singleUserData.Issue);
    const endPoint = StringUtil.formatStringValue(singleUserData.EndPoint, { ID: gData.get("id") });
    const response = await user.get(endPoint, singleUserData.Operation);
    await user.verifyStatusCode(response, singleUserData.Status);
    await user.verifyContent(response, singleUserData.JSONPath, gData.get("id"), singleUserData.Operation);
});

const addUserData = ExcelUtil.getTestData(SHEET, "TC03_AddUser");
test(`${addUserData.TestID} - ${addUserData.Description}`, async ({ gData }) => {
    Allure.attachDetails(addUserData.Description, addUserData.Issue);
    const userName = StringUtil.randomAlphabeticString(5);
    const password = StringUtil.randomAlphanumericString(5);
    const phoneNumber = StringUtil.randomNumberString(10);
    const requestData = {
        userName: userName,
        password: password,
        phoneNumber: phoneNumber,
    };
    const response = await user.post(addUserData.EndPoint, addUserData.RequestBody, requestData, addUserData.Operation);
    await user.verifyStatusCode(response, addUserData.Status);
    const id = await user.extractResponseValue(response, "$.id", addUserData.Operation);
    gData.set("id", id);
    gData.set("password", password);
    gData.set("userName", userName);
});

const updateUserData = ExcelUtil.getTestData(SHEET, "TC04_UpdateUser");
test(`${updateUserData.TestID} - ${updateUserData.Description}`, async ({ gData }) => {
    Allure.attachDetails(updateUserData.Description, updateUserData.Issue);
    const endPoint = StringUtil.formatStringValue(updateUserData.EndPoint, { ID: gData.get("id") });
    const phoneNumber = StringUtil.randomNumberString(10);
    const requestData = {
        userName: gData.get("userName"),
        password: gData.get("password"),
        phoneNumber: phoneNumber,
    };
    const response = await user.put(endPoint, updateUserData.RequestBody, requestData,
        updateUserData.Operation);
    await user.verifyStatusCode(response, updateUserData.Status);
    await user.verifyContent(response, "$.password", gData.get("password"), "Password");
    await user.verifyContent(response, "$.username", gData.get("userName"), "User Name");
    await user.verifyContent(response, updateUserData.JSONPath, phoneNumber, "Phone Number");
});

const loginData = ExcelUtil.getTestData(SHEET, "TC05_StoreLogin");
test(`${loginData.TestID} - ${loginData.Description}`, async ({ gData }) => {
    Allure.attachDetails(loginData.Description, loginData.Issue);
    const requestData = {
        userName: gData.get("userName"),
        password: gData.get("password"),
    };
    const response = await user.post(loginData.EndPoint, loginData.RequestBody, requestData, loginData.Operation);
    await user.verifyStatusCode(response, loginData.Status);
    await user.verifyContentIsNotNull(response, loginData.JSONPath, "Token");
});

const deleteData = ExcelUtil.getTestData(SHEET, "TC06_DeleteUser");
test(`${deleteData.TestID} - ${deleteData.Description}`, async ({ gData }) => {
    Allure.attachDetails(deleteData.Description, deleteData.Issue);
    const endPoint = StringUtil.formatStringValue(deleteData.EndPoint, { ID: gData.get("id") });
    const response = await user.delete(endPoint, deleteData.Operation);
    await user.verifyStatusCode(response, deleteData.Status);
});
