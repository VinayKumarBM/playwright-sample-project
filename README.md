# playwright-sample-project

## **Overview:**

This is a sample Playwright project using Typescript as scripting language and uses playwright-testrunner to execute test cases. This is a Data Driven framework focused on separating the test scripts logic and the test data from each other. This allows us to create test automation scripts by passing different sets of test data. The test data set is kept in an external Excel Sheet. The test scripts connect to the external Excel sheet to get the test data. This framework significantly reduces the number of test scripts compared to a modular based framework when we need to test for multiple sets of data for same functionality.

For Demo purpose UI test cases are created on [advantageonlineshopping.com](http://advantageonlineshopping.com/) site and API test cases are created on these [SOAP API](https://www.advantageonlineshopping.com/accountservice/ws/accountservice.wsdl) & [REST API](https://fakestoreapi.com) endpoints.

## Features

- This framework has built in library to operate on UI, API (both SOAP & REST API) and DB (MSSQL, DB2 & Oracle).
- Supports execution of tests in different browsers.
- Test data is stored in an Excel sheet and from this Excel sheet user can control the test cases that needs to be run.
- User also has full control to run test in different modes from the Excel sheet.
- Allows transfer of data between test cases.
- Has utility built in for file download, Read PDF files etc.
- Generates Playwright's HTML Report, Allure Report & JUnit Report in HTML format for each exaction. 
- Allure & Playwright report including snapshots and video in case of test failure.
- Test execution logs are captured in the log file.
- All the playwright related config is controlled by playwright config file.
- Environment variables can be modified at runtime and its controlled by .env file.
- Easy and simple integration to CI/CD tools like Jenkins.

#### Supported Browsers
1. Chrome - default browser
2. Firefox
3. MS Edge
4. WebKit - web browser engine used by Safari

#### Run Mode Details
| Mode | Execl Value |Description |
| ------ | ------ | ------ |
|Normal|Blank| 	Runs the tests sequentially|
|Serial|serial| 	Runs the tests sequentially. On test failure, all subsequent tests are skipped|
|Parallel|parallel| 	Runs the tests parallelly, this is ideal when tests in the scenario are independent of one another|

#### Steps to use
##### 1. Installation

Playwright framework requires [Node.js](https://nodejs.org/) v14+ to run.

Code from github need to be [download](https://github.com/VinayKumarBM/playwright-sample-project/archive/refs/heads/master.zip) OR [cloned](https://github.com/VinayKumarBM/playwright-sample-project.git) using git command.

Installing the dependencies.
```sh
npm ci
```
##### 2. Test creation
- Create Test file with extenstion .spec.ts. Eg LoginTest.spec.ts
- In the testData excel create a sheet with name of test. Eg. LoginTest
- Create a execution sheet and make an entry of new test case. Eg. in the Regression sheet add a row for new test LoginTest and update other columns like run, mode etc.

##### 3. Execution
To run test suite use below command.
```sh
npm run create:suite SHEET=<SheetName> && npm test
```
**Note:** SheetName needs to be updated.

To run individual test locally use below command.
```sh
set TEST_NAME=<TestFileName> && npm run local:test
```
**Note:** Using set command we are setting the local TestFileName.

To change any environment configuration in .env file at run time use set command.
Eg: To change browser to MS Edge use below command
```sh
set BROWSER=edge
```
Similar command can be used to update other environment configuration

To generate Allure report use below command
```sh
npm run report
```

##### 4. Report & Logs
Playwright HTML report will be present inside
```sh
test-results/results/index.html
```
Execution log will be present in the log file.
```sh
test-results/logs/execution.log
```
