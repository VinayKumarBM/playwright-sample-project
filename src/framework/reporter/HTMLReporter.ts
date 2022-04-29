import HTMLReport from "jasmine-xml2html-converter";
import dotenv from 'dotenv';
import CommonConstants from "../constants/CommonConstants";

dotenv.config();

export default class HTMLReporter {
    public static generate() {
        const testConfig = {
            reportTitle: CommonConstants.REPORT_TITLE,
            outputPath: CommonConstants.RESULTS_PATH,
            BASE_URL: process.env.BASE_URL,
            SOAP_API_BASE_URL: process.env.SOAP_API_BASE_URL,
            REST_API_BASE_URL: process.env.REST_API_BASE_URL,
            DB_CONFIG: process.env.DB_CONFIG,
            BROWSER: process.env.BROWSER,
        };
        new HTMLReport().from(CommonConstants.JUNIT_RESULTS_PATH, testConfig);
        console.log("Completed creating HTML Report");        
    }
}

HTMLReporter.generate();
