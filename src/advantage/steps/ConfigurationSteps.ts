import test, { Page } from "@playwright/test";
import UIActions from "../../framework/playwright/actions/UIActions";
import Assert from "../../framework/playwright/asserts/Assert";
import PDFUtil from "../../framework/utils/PDFUtil";
import CommonConstants from "../constants/CommonConstants";
import ConfigurationConstants from "../constants/ConfigurationConstants";
import ConfigurationPage from "../pages/ConfigurationPage";

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

    public async verifyPDFFilePageCount(fileName: string, pages: number) {
        await test.step(`Verify that ${fileName} file has ${pages} pages`, async () => {
            await Assert.assertEquals(await PDFUtil.getNumberOfPages(CommonConstants.DOWNLOADS_PATH + fileName),
                pages, fileName);
        });
    }

    public async verifyPDFFileText(fileName: string, content: string) {
        await test.step(`Verify that ${fileName} has content ${content}`, async () => {
            await Assert.assertContains(await PDFUtil.getText(CommonConstants.DOWNLOADS_PATH + fileName),
                content, fileName);
        });
    }
}
