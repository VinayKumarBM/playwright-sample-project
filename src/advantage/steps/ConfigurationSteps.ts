import test, { Page } from "@playwright/test";
import ConfigurationPage from "@pages/ConfigurationPage";
import Assert from "@asserts/Assert";
import UIActions from "@uiActions/UIActions";
import PDFUtil from "@utils/PDFUtil";
import CommonConstants from "@uiConstants/CommonConstants";
import ConfigurationConstants from "@uiConstants/ConfigurationConstants";

export default class ConfigurationSteps {
    private ui: UIActions;

    constructor(private page: Page) {
        this.ui = new UIActions(page);
    }

    public async downloadAOSBackendPDF() {
        let fileName: string;
        await test.step(`Downloading the AOS backend PDF file`, async () => {
            fileName = await this.ui.downloadFile(ConfigurationPage.AOS_BACK_END_LINK,
                ConfigurationConstants.AOS_BACKEND);
        });
        return fileName;
    }

    public async verifyPDFDetails(fileName: string, pages: number, content: string) {
        const pdf = await PDFUtil.getPdfTextDetails(CommonConstants.DOWNLOADS_PATH, fileName);
        await this.verifyPDFFilePageCount(fileName, pages, pdf.pageCount);
        await this.verifyPDFFileText(fileName, content, pdf.content);
    }

    private async verifyPDFFilePageCount(fileName: string, pages: number , actual: number) {
        await test.step(`Verify that ${fileName} file has ${pages} pages`, async () => {
            await Assert.assertEquals(actual, pages, fileName);
        });
    }

    private async verifyPDFFileText(fileName: string, content: string, actual: string) {
        await test.step(`Verify that ${fileName} has content ${content}`, async () => {
            await Assert.assertContains(actual, content, fileName);
        });
    }

    public async verifyPdfByComparing(actualFileName: string, baselineFileName: string, pages: string , maskText: string) {
        await test.step(`Verify that ${actualFileName} matches with baseline file ${baselineFileName}`, async () => {
            const isMatched = await PDFUtil.maskAndComparePdf(CommonConstants.PDF_RESOURCE_PATH, baselineFileName,
                CommonConstants.DOWNLOADS_PATH, actualFileName, pages, maskText);
            await Assert.assertTrue(isMatched, `${actualFileName} matches with baseline file ${baselineFileName}`);
        });
    }
}
