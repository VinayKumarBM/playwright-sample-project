import * as allure from "allure-js-commons";
import { ContentType } from "allure-js-commons";
import os from "os";

export default class Allure {
    public static attachDetails(description: string, issue: string) {
        allure.description(description);
        allure.owner(os.userInfo().username);
        if (issue !== undefined && issue !== null && issue !== '') {
            allure.link(`${process.env.LINK}${issue}`, `ISSUE-${issue}`);
        }
    }

    public static async attachPNG(name: string, path: string) {
        await allure.attachmentPath(name, path, {
            contentType: ContentType.PNG,
            fileExtension: "png"
        });
    }

    public static async attachPDF(name: string, path: string) {
        await allure.attachmentPath(name, path, {
            contentType: 'application/pdf',
            fileExtension: "pdf"
        });
    }
}
