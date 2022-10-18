import test, { Page } from "@playwright/test";
import APIActions from "@apiActions/APIActions";
import RESTResponse from "@apiActions/RESTResponse";
import Assert from "@asserts/Assert";
import RESTConstants from "@restConstants/RESTConstants";

export default class UserSteps {
    private api: APIActions;
    private BASE_URL = process.env.REST_API_BASE_URL;
    constructor(private page: Page) {
        this.api = new APIActions(this.page);
    }
    private get header() {
        return this.api.header.set(RESTConstants.CONTENT_TYPE, RESTConstants.CONTENT_JSON)
            .set(RESTConstants.ACCEPT, RESTConstants.CONTENT_JSON).get();
    }

    public async get(endPoint: string, operation: string): Promise<RESTResponse> {
        let response: RESTResponse;
        await test.step(`Making call to GET ${operation}`, async () => {
            response = await this.api.rest.get(this.BASE_URL + endPoint, this.header, operation);
        });        
        return response;
    }

    public async post(endPoint: string, requestBodyFile: string, requestData: any,
        operation: string): Promise<RESTResponse> {
        let response: RESTResponse;
        await test.step(`Making POST call to ${operation}`, async () => {
            const requestJSON = await this.api.rest.createRequestBody(requestBodyFile, requestData);
            response = await this.api.rest.post(this.BASE_URL + endPoint, this.header, requestJSON, operation);
        });
        return response;
    }

    public async put(endPoint: string, requestBodyFile: string, requestData: any,
        operation: string): Promise<RESTResponse> {
        let response: RESTResponse;
        await test.step(`Making PUT call to ${operation}`, async () => {
            const requestJSON = await this.api.rest.createRequestBody(requestBodyFile, requestData);
            response = await this.api.rest.put(this.BASE_URL + endPoint, this.header, requestJSON, operation);
        });
        return response;
    }

    public async delete(endPoint: string, operation: string): Promise<RESTResponse> {
        let response: RESTResponse;
        await test.step(`Making DELETE call to ${operation}`, async () => {
            response = await this.api.rest.delete(this.BASE_URL + endPoint, this.header, operation);
        });
        return response;
    }

    public async verifyStatusCode(response: RESTResponse, statusCode: string) {
        await test.step(`Verifying that status code is ${statusCode}`, async () => {
            await Assert.assertEquals(await response.getStatusCode(), statusCode, RESTConstants.STATUS_CODE);
        });
    }

    public async extractResponseValue(response: RESTResponse, jsonPath: string, operation: string) {
        let value: string;
        await test.step(`Extract value from ${operation} response`, async () => {
            value = await response.getTagContentByJsonPath(jsonPath, operation);
        });
        return value;
    }

    public async verifyContent(response: RESTResponse, jsonPath: string, expectedValue: string, description: string) {
        await test.step(`Verifying that ${description} has value ${expectedValue}`, async () => {
            const value = await response.getTagContentByJsonPath(jsonPath, description);
            await Assert.assertEquals(value, expectedValue, description);
        });
    }

    public async verifyContentIsNotNull(response: RESTResponse, jsonPath: string, description: string) {
        await test.step(`Verifying that ${description} content is NOT NULL`, async () => {
            const value = await response.getTagContentByJsonPath(jsonPath, description);
            await Assert.assertNotNull(value, description);
        });
    }
}
