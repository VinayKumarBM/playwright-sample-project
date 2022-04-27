export default class SuiteTemplate {
    public static getTemplate(sheet: string, testList: string) {
        const suiteTemplate = `/* eslint-disable no-tabs */
/* eslint-disable import/extensions */
/* eslint-disable global-require */
import test from "@playwright/test";
${testList}
`;
        return suiteTemplate;
    }
}
