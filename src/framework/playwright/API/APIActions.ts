import { Page } from "@playwright/test";
import RequestHeader from "./RequestHeader";
import RESTRequest from "./RESTRequest";
import SOAPRequest from "./SOAPRequest";

export default class APIActions {
    constructor(private page: Page) { }
    /**
     * Returns REST Request instance
     * @returns 
     */
    public get rest(): RESTRequest {
        return new RESTRequest(this.page);
    }

    /**
     * Returns SOAP Request instance
     * @returns 
     */
    public get soap(): SOAPRequest {
        return new SOAPRequest();
    }

     /**
     * Returns Request header instance
     * @returns 
     */
      public get header(): RequestHeader {
        return new RequestHeader();
    }
}
