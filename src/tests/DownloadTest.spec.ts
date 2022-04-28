import ConfigurationSteps from "@uiSteps/ConfigurationSteps";
import HomeSteps from "@uiSteps/HomeSteps";
import { test } from "@base-test";
import Allure from "@allure";

test(`DownloadTest - To download pdf file from application`, async ({ page }) => {
    Allure.attachDetails("To download pdf file from application", null);
    const home = new HomeSteps(page);
    await home.launchApplication();
    const newPage = await home.navigateToManagementConsole();
    await page.close();
    const configStep = new ConfigurationSteps(newPage);
    const fileName = await configStep.downloadAOSBackendPDF();
    await configStep.verifyPDFFilePageCount(fileName, 4);
    await configStep.verifyPDFFileText(fileName, "Advantage Online Shopping (AOS)");
});
