import test, { Page } from "@playwright/test";
import APIActions from "@apiActions/APIActions";
import SOAPResponse from "@apiActions/SOAPResponse";
import Assert from "@asserts/Assert";
import SOAPConstants from "@soapConstants/SOAPConstants";

export default class AccountServiceSteps {
    private api: APIActions;

    constructor(private page: Page) {
        this.api = new APIActions(this.page);
    }

    public async request(endPoint: string, requestBody: string, requestData: any,
        operation: string): Promise<SOAPResponse> {
        let response: SOAPResponse;
        await test.step(`SOAP request to ${operation}`, async () => {
            const requestHeaders = this.api.header.set(SOAPConstants.CONTENT_TYPE, SOAPConstants.CONTENT_TEXT).get();
            response = await this.api.soap.post(endPoint, requestHeaders, requestBody, requestData, operation);
        });        
        return response;
    }

    public async verifyResponse(response: SOAPResponse, xpath: string, result: string, operation: string) {
        await test.step(`Verifying that result of ${operation} is ${result}`, async () => {
            const actualResult = await response.getTagContentByXpath(xpath, operation);
            await Assert.assertEquals(actualResult, result.toString(), operation);
        });
    }

    public async verifyResponseContains(response: SOAPResponse, xpath: string, result: string, operation: string) {
        await test.step(`Verifying that result of ${operation} contains ${result}`, async () => {
            const actualResult = await response.getTagContentByXpath(xpath, operation);
            await Assert.assertContains(actualResult, result, operation);
        });
    }

    public async getResponseContent(response: SOAPResponse, xpath: string, operation: string) {
        let content: string;
        await test.step(`Getting content from response of ${operation}`, async () => {
            content = await response.getTagContentByXpath(xpath, operation);
        });
        return content;
    }
}
