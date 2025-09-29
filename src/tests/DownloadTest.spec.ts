import ConfigurationSteps from "@uiSteps/ConfigurationSteps";
import HomeSteps from "@uiSteps/HomeSteps";
import { test } from "@base-test";
import Allure from "@allure";
import PDFUtil from "@utils/PDFUtil";

test(`DownloadTest - To download pdf file from application and verify the PDF details`, async ({ page }) => {
    Allure.attachDetails("To download pdf file from application and verify the PDF details", null);
    const home = new HomeSteps(page);
    await home.launchApplication();
    const newPage = await home.navigateToManagementConsole();
    await page.close();
    const configStep = new ConfigurationSteps(newPage);
    const fileName = await configStep.downloadAOSBackendPDF();
    await configStep.verifyPDFDetails(fileName, 4, "Advantage Online Shopping (AOS)");
    const maskText = '5134647|The Lawn, 22-30 Old Bath Road, Berkshire, RG14 1Q| Java 11';
    await configStep.verifyPdfByComparing(fileName, 'baseline.pdf', '1,2,3,4', maskText);
});
