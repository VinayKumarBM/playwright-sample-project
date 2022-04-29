export default class CommonConstants {
    static readonly SEMICOLON = ';';
    static readonly BLANK = '';
    static readonly ZERO = 0;
    static readonly ONE = 1;
    static readonly TWO = 2;
    static readonly THREE = 3;
    static readonly HALF = 0.5;
    static readonly ONE_THOUSAND = 1000;
    static readonly DOWNLOAD_PATH = "./test-results/downloads/";
    static readonly SOAP_XML_REQUEST_PATH = "src/resources/API/SOAP/";
    static readonly REST_JSON_REQUEST_PATH = "src/resources/API/REST/";
    static readonly TEST_FOLDER_PATH = "../../tests/";
    static readonly TEST_SUITE_FILE_FORMAT = ".test.ts";
    static readonly PARALLEL_MODE = "parallel";
    static readonly SERIAL_MODE = "serial";
    static readonly REPORT_TITLE = "Test Execution Report";
    static readonly RESULTS_PATH = "./test-results/results";
    static readonly JUNIT_RESULTS_PATH = `${CommonConstants.RESULTS_PATH}/results.xml`;
}
