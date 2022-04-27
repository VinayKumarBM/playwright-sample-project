/* eslint-disable no-tabs */
/* eslint-disable no-restricted-syntax */
import fs from "fs";
import path from 'path';
import CommonConstants from "../constants/CommonConstants";
import SuiteTemplate from "../template/SuiteTemplate";
import CLIUtil from "../utils/CLIUtil";
import ExcelUtil from "../utils/ExcelUtil";

export default class SuiteManager {
    public static createSuite() {
        const sheet = CLIUtil.getValueOf("SHEET");
        this.deleteFiles(CommonConstants.TEST_FOLDER_PATH);
        let testList = CommonConstants.BLANK;
        for (const { TestName, Mode } of ExcelUtil.getSuiteTests(sheet)) {            
            let modeOfRun = CommonConstants.BLANK;
            if (Mode !== undefined && Mode !== null && Mode !== CommonConstants.BLANK) {
                modeOfRun = `\n\ttest.describe.configure({ mode: '${Mode.toLowerCase()}' });`;
            }
            testList += `\ntest.describe("${TestName}", () => {${modeOfRun}
	require("./${TestName}.spec.ts");
});`;
        }        
        fs.writeFileSync(`${CommonConstants.TEST_FOLDER_PATH}${sheet}${CommonConstants.TEST_SUITE_FILE_FORMAT}`,
            SuiteTemplate.getTemplate(sheet, testList));
        console.log(" Completed!! ");
    }

    private static deleteFiles(directory: string) {
        const files = fs.readdirSync(directory);
        for (const file of files) {
            if (file.includes(CommonConstants.TEST_SUITE_FILE_FORMAT)) { fs.unlinkSync(path.join(directory, file)); }
        }
    }
}

SuiteManager.createSuite();
