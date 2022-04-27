import test from "@playwright/test";
import soapRequest from "easy-soap-request";
import format from "xml-formatter";
import fs from 'fs';
import SOAPResponse from "./SOAPResponse";
import StringUtil from "../../utils/StringUtil";
import CommonConstants from "../../constants/CommonConstants";

export default class SOAPRequest {
    /**
     * Creates request body by replacing the input parameters
     * @param xmlFileName 
     * @param data 
     * @returns 
     */
    private async createRequestBody(xmlFileName: string, data: any): Promise<string> {
        let xml = fs.readFileSync(CommonConstants.SOAP_XML_REQUEST_PATH + xmlFileName, 'utf-8');
        xml = StringUtil.formatStringValue(xml, data);
        console.log(`SOAP request : \n${format(xml, { collapseContent: true })}`);
        return xml;
    }

    /**
     * Make POST request and return response
     * @param endPoint 
     * @param requestHeader 
     * @param fileName 
     * @param gData 
     * @param data 
     * @param description 
     * @returns 
     */
    public async post(endPoint: string, requestHeader: any, fileName: string, 
        requestData : any, description: string): Promise<SOAPResponse> {
        let soapResponse: SOAPResponse;
        await test.step(`Making post request for ${description}`, async () => {
            const url = process.env.SOAP_API_BASE_URL + endPoint;
            console.log(`URL: ${url}`);
            const xml = await this.createRequestBody(fileName, requestData);
            const { response } = await soapRequest({ url: url, headers: requestHeader, xml: xml });
            const { headers, body, statusCode } = response;
            soapResponse = new SOAPResponse(headers, body, statusCode, description);
            console.log(`SOAP Response: \n${format(body, { collapseContent: true })}`);
        });
        return soapResponse;
    }
}
