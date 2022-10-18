import { test, Page, APIResponse } from '@playwright/test';
import fs from 'fs';
import fetchToCurl from 'fetch-to-curl';
import CommonConstants from '../../constants/CommonConstants';
import StringUtil from '../../utils/StringUtil';
import RESTResponse from "./RESTResponse";

export default class RESTRequest {
    constructor(private page: Page) { }
    /**
     * Creates request body from JSON file by replacing the input parameters
     * @param jsonFileName 
     * @param data 
     * @returns 
     */
    public async createRequestBody(jsonFileName: string, data: any): Promise<string> {
        let json = fs.readFileSync(CommonConstants.REST_JSON_REQUEST_PATH + jsonFileName, 'utf-8');
        json = StringUtil.formatStringValue(json, data);
        return json;
    }
    /**
     * Make POST request and return response
     * @param endPoint 
     * @param requestHeader 
     * @param jsonAsString
     * @param description 
     * @returns 
     */
    public async post(endPoint: string, requestHeader: any, jsonAsString: string,
        description: string): Promise<RESTResponse> {
        const headersAsJson = JSON.parse(JSON.stringify(requestHeader));
        let restResponse: RESTResponse;
        await test.step(`Making POST request for ${description}`, async () => {
            this.printRequest(endPoint, headersAsJson, jsonAsString, 'post');
            const response = await this.page.request.post(endPoint,
                { headers: headersAsJson, data: JSON.parse(jsonAsString) });
            restResponse = await this.setRestResponse(response, description);
        });
        return restResponse;
    }
    /**
     * Sets the API Response into RestResponse object
     * @param response 
     * @param description 
     * @returns RestResponse object
     */
    private async setRestResponse(response: APIResponse, description: string): Promise<RESTResponse> {
        const body = await response.text();
        const headers = response.headers();
        const statusCode = response.status();
        const restResponse: RESTResponse = new RESTResponse(headers, body, statusCode, description);
        console.log(`Response body: ${JSON.stringify(JSON.parse(body), undefined, 2)}`);
        return restResponse;
    }
    /**
     * Make Get request and return response
     * @param endPoint 
     * @param requestHeader 
     * @param description 
     * @returns 
     */
    public async get(endPoint: string, requestHeader: any, description: string): Promise<RESTResponse> {
        const headersAsJson = JSON.parse(JSON.stringify(requestHeader));
        let restResponse: RESTResponse;
        await test.step(`Making GET request for ${description}`, async () => {
            this.printRequest(endPoint, headersAsJson, null, 'get');
            const response = await this.page.request.get(endPoint, { headers: headersAsJson });
            restResponse = await this.setRestResponse(response, description);
        });
        return restResponse;
    }
    /**
     * Make Put request and return response
     * @param endPoint 
     * @param requestHeader 
     * @param jsonAsString 
     * @param description 
     * @returns 
     */
    public async put(endPoint: string, requestHeader: any, jsonAsString: any,
        description: string): Promise<RESTResponse> {
        const headersAsJson = JSON.parse(JSON.stringify(requestHeader));
        let restResponse: RESTResponse;
        await test.step(`Making PUT request for ${description}`, async () => {
            this.printRequest(endPoint, headersAsJson, jsonAsString, 'put');
            const response = await this.page.request.put(endPoint,
                { headers: headersAsJson, data: JSON.parse(jsonAsString) });
            restResponse = await this.setRestResponse(response, description);
        });
        return restResponse;
    }
    /**
     * Make Patch request and return response
     * @param endPoint 
     * @param requestHeader 
     * @param jsonAsString 
     * @param description 
     * @returns 
     */
    public async patch(endPoint: string, requestHeader: any, jsonAsString: any,
        description: string): Promise<RESTResponse> {
        const headersAsJson = JSON.parse(JSON.stringify(requestHeader));
        let restResponse: RESTResponse;
        await test.step(`Making PATCH request for ${description}`, async () => {
            this.printRequest(endPoint, headersAsJson, jsonAsString, 'patch');
            const response = await this.page.request.patch(endPoint,
                { headers: headersAsJson, data: JSON.parse(jsonAsString) });
            restResponse = await this.setRestResponse(response, description);
        });
        return restResponse;
    }
    /**
     * Make Delete request and return response
     * @param endPoint 
     * @param requestHeader 
     * @param description 
     * @returns 
     */
    public async delete(endPoint: string, requestHeader: any, description: string): Promise<RESTResponse> {
        const headersAsJson = JSON.parse(JSON.stringify(requestHeader));
        let restResponse: RESTResponse;
        await test.step(`Making DELETE request for ${description}`, async () => {
            this.printRequest(endPoint, headersAsJson, null, 'delete');
            const response = await this.page.request.delete(endPoint, { headers: headersAsJson });
            restResponse = await this.setRestResponse(response, description);
        });
        return restResponse;
    }
    /**
     * Prints the API request on console in curl format
     * @param endPoint 
     * @param requestHeader 
     * @param jsonRequestBody 
     * @param method 
     */
    private printRequest(endPoint: string, requestHeader: any, jsonRequestBody: string, method: string) {
        let requestBody = jsonRequestBody;
        if (jsonRequestBody !== null) {
            requestBody = JSON.stringify(JSON.parse(jsonRequestBody), undefined, 2);
        }
        console.log("Request: ", fetchToCurl({
            url: endPoint,
            headers: requestHeader,
            body: requestBody,
            method: method,
        }));
    }
}
