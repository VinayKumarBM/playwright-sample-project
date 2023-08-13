import { allure } from "allure-playwright";
import os from "os";

export default class Allure {
    public static attachDetails(description: string, issue: string) {
        allure.description(description);
        allure.owner(os.userInfo().username);
        if (issue !== undefined && issue !== null && issue !== '') {
            allure.link(`${process.env.LINK}${issue}`, `ISSUE-${issue}`);
        }
    }
}
