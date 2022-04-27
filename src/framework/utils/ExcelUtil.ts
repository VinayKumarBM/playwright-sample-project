import excelToJson from "convert-excel-to-json";
import ExcelConstants from "../constants/ExcelConstants";

export default class ExcelUtil {
    public static getTestDataArray(sheet: string) {
        const result = excelToJson({
            sourceFile: ExcelConstants.TEST_PATH,
            columnToKey: {
                '*': '{{columnHeader}}',
            },
            sheetStubs: true,
            header: { rows: 1 },
            sheets: [sheet],
        });
        return result[sheet];
    }

    public static getSuiteTests(sheet: string) {
        const result = excelToJson({
            sourceFile: ExcelConstants.SUITE_PATH,
            columnToKey: {
                '*': '{{columnHeader}}',
            },
            sheetStubs: true,
            header: { rows: 1 },
            sheets: [sheet],
        });
        const testList: any[] = [];
        process.stdout.write("Creating Suite 0% ");
        // eslint-disable-next-line no-restricted-syntax
        for (const test of result[sheet]) {
            if (test.Run !== null && test.Run !== undefined && test.Run.toUpperCase() === ExcelConstants.YES) {
                testList.push({ TestName: test.TestName, Mode: test.Mode });
            }
            process.stdout.write("|");
        }
        if (testList.length === 0) {
            throw new Error(`${sheet} sheet does not have any test to run`);
        }
        process.stdout.write(" 100%");
        return testList;
    }

    public static getTestData(sheet: string, testID: string) {
        const testData = this.getTestDataArray(sheet);
        let found = false;
        let data;
        for (let i = 0; i < testData.length; i++) {
            if (testData[i].TestID === testID) {
                data = testData[i];
                found = true;
            }
        }
        if (!found) {
            throw new Error(`Test '${testID}' was not found on '${sheet}' sheet`);
        }
        return data;
    }
}
