import { test, Page, APIResponse } from '@playwright/test';
import fs from 'fs';
import CommonConstants from '../../constants/CommonConstants';
import StringUtil from '../../utils/StringUtil';
import RESTResponse from "./RESTResponse";

export default class RESTRequest {
    constructor(private page: Page) {}

    /**
     * Creates request body by replacing the input parameters
     * @param jsonFilePath 
     * @param data 
     * @returns 
     */
    private async createRequestBody(jsonFilePath: string, data: any): Promise<string> {
        let json = fs.readFileSync(CommonConstants.REST_JSON_REQUEST_PATH + jsonFilePath, 'utf-8');
        json = StringUtil.formatStringValue(json, data);
        console.log(`Request body : ${json}`);
        return json;
    }
 
    /**
     * Make POST request and return response
     * @param endPoint 
     * @param requestHeader 
     * @param fileName 
     * @param requestData
     * @param description 
     * @returns 
     */
    public async post(endPoint: string, requestHeader: any, fileName: string, 
       requestData: any, description: string): Promise<RESTResponse> {
        const headersAsJson = JSON.parse(JSON.stringify(requestHeader));
        let restResponse: RESTResponse;
        await test.step(`Making POST request for ${description}`, async () => {
            const url = process.env.REST_API_BASE_URL + endPoint;
            console.log(`URL: ${url}`);
            const json = await this.createRequestBody(fileName, requestData);
            const response = await this.page.request.post(url, { headers: headersAsJson, data: JSON.parse(json) });
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
        try {
            console.log(`Response body: ${JSON.stringify(JSON.parse(body), undefined, 2)}`);
        } catch (error) {
            console.log(`Error while parsing response ${error.message}`, body);
            throw new Error(error);
        }        
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
            const url = process.env.REST_API_BASE_URL + endPoint;
            console.log(`URL: ${url}`);
            const response = await this.page.request.get(url, { headers: headersAsJson });
            restResponse = await this.setRestResponse(response, description);
        });
        return restResponse;
    }

    /**
     * Make Put request and return response
     * @param endPoint 
     * @param requestHeader 
     * @param fileName 
     * @param requestData
     * @param description 
     * @returns 
     */
    public async put(endPoint: string, requestHeader: any, fileName: any, 
        requestData: any, description: string): Promise<RESTResponse> {
        const headersAsJson = JSON.parse(JSON.stringify(requestHeader));
        let restResponse: RESTResponse;
        await test.step(`Making PUT request for ${description}`, async () => {            
            const url = process.env.REST_API_BASE_URL + endPoint;
            console.log(`URL: ${url}`);
            const json = await this.createRequestBody(fileName, requestData);
            const response = await this.page.request.put(url, { headers: headersAsJson, data: JSON.parse(json) });
            restResponse = await this.setRestResponse(response, description);
        });
        return restResponse;
    }

    /**
     * Make Patch request and return response
     * @param endPoint 
     * @param requestHeader 
     * @param fileName 
     * @param requestData
     * @param description 
     * @returns 
     */
    public async patch(endPoint: string, requestHeader: any, fileName: any, 
        requestData: any, description: string): Promise<RESTResponse> {
        const headersAsJson = JSON.parse(JSON.stringify(requestHeader));
        let restResponse: RESTResponse;
        await test.step(`Making PATCH request for ${description}`, async () => {            
            const url = process.env.REST_API_BASE_URL + endPoint;
            console.log(`URL: ${url}`);
            const json = await this.createRequestBody(fileName, requestData);
            const response = await this.page.request.patch(url, { headers: headersAsJson, data: JSON.parse(json) });
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
        let restResponse: RESTResponse;
        await test.step(`Making DELETE request for ${description}`, async () => {
            const url = process.env.REST_API_BASE_URL + endPoint;
            console.log(`URL: ${url}`);
            const response = await this.page.request.delete(url, { headers: requestHeader });
            restResponse = await this.setRestResponse(response, description);
        });
        return restResponse;
    }
}
