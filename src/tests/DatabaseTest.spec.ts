import DatabaseStep from "../database/steps/DatabaseStep";
import { test } from "../framework/config/base-test";
import Allure from "../framework/reporter/Allure";
import ExcelUtil from "../framework/utils/ExcelUtil";

const testData = ExcelUtil.getTestDataArray("DatabaseTest");
// eslint-disable-next-line no-restricted-syntax
for (const data of testData) {
    test(`${data.TestID} - ${data.Description}`, async ({ }) => {
        Allure.attachDetails(data.Description, data.Issue);
        const db = new DatabaseStep();
        const result = await db.executeMSSQLQuery(data.Query);
        await db.verifyExecutionSuccess(result.rowsAffected[0]);
    });
}
