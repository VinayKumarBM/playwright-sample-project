import { test, expect } from "@playwright/test";

export default class Assert {
    /**
     * To verify that condition passed as input is true
     * @param condition - boolean condition
     * @param description - description of element that is being validated
     * @param softAssert - for soft asserts this has to be set to true, else this can be ignored
     */
    public static async assertTrue(condition: boolean, description: string, softAssert = false) {
        await test.step(`Verifying that ${description} is true`, async () => {
            if (softAssert) {
                expect.soft(condition, `Expected is 'True' & Actual is '${condition}'`).toBeTruthy();
            } else {
                expect(condition, `Expected is 'True' & Actual is '${condition}'`).toBeTruthy();
            }
        });
    }
    /**
     * To verify that value1 contains value2
     * @param value1 - string input
     * @param value2 - should be present in value1
     * @param description - description of element that is being validated
     * @param softAssert - for soft asserts this has to be set to true, else this can be ignored
     */
    public static async assertContains(value1: string, value2: string, description: string, softAssert = false) {
        await test.step(`Verifying that ${description} contains text '${value2}'`, async () => {
            if (softAssert) {
                expect.soft(value1, `'${value1}' is expected to CONTAIN '${value2}'`).toContain(value2);
            } else {
                expect(value1, `'${value1}' is expected to CONTAIN '${value2}'`).toContain(value2);
            }
        });
    }

    /**
    * To verify that value1 contains value1 ignoring case
    * @param value1 - string input
    * @param value2 - should be present in value1
    * @param description - description of element that is being validated
    * @param softAssert - for soft asserts this has to be set to true, else this can be ignored
    */
    public static async assertContainsIgnoreCase(value1: string, value2: string, description: string,
        softAssert = false) {
        await test.step(`Verifying that ${description} contains text '${value2}'`, async () => {
            if (softAssert) {
                expect.soft(value1.toLowerCase(), `'${value1}' is expected to CONTAIN '${value2}'`).toContain(value2.toLowerCase());
            } else {
                expect(value1.toLowerCase(), `'${value1}' is expected to CONTAIN '${value2}'`).toContain(value2.toLowerCase());
            }
        });
    }

    /**
   * To verify that actual contains expected ignoring case
   * @param actual - string input
   * @param expected - string input
   * @param description - description of element that is being validated
   * @param softAssert - for soft asserts this has to be set to true, else this can be ignored
   */
    public static async assertEqualsIgnoreCase(actual: string, expected: string, description: string,
        softAssert = false) {
        await test.step(`Verifying that ${description} has text ${expected}`, async () => {
            if (softAssert) {
                expect.soft(actual.toLowerCase(), `Expected '${expected}' should be EQUAL to Actual '${actual}'`)
                    .toEqual(expected.toLowerCase());
            } else {
                expect(actual.toLowerCase(), `Expected '${expected}' should be EQUAL to Actual '${actual}'`)
                    .toEqual(expected.toLowerCase());
            }
        });
    }

    /**
     * To verify actual equals expected
     * @param value1 any object
     * @param value2 any object to compare
     * @param description object description
     * @param softAssert for soft asserts this has to be set to true, else this can be ignored
     */
    public static async assertEquals(actual: any, expected: any, description: string, softAssert = false) {
        await test.step(`Verifying that ${description} has text ${expected}`, async () => {
            if (softAssert) {
                expect.soft(actual, `Expected '${expected}' should be EQUAL to Actual '${actual}'`).toEqual(expected);
            } else {
                expect(actual, `Expected '${expected}' should be EQUAL to Actual '${actual}'`).toEqual(expected);
            }
        });
    }

    /**
     * To verify that actual passed as input is false
     * @param condition boolean
     * @param description description of element that is being validated
     * @param softAssert for soft asserts this has to be set to true, else this can be ignored
     */
    public static async assertFalse(condition: boolean, description: string, softAssert = false) {
        await test.step(`Verifying that ${description} is false`, async () => {
            if (softAssert) {
                expect.soft(condition, `Expected is 'false' & Acutal is '${condition}'`).toBeFalsy();
            } else {
                expect(condition, `Expected is 'false' & Acutal is '${condition}'`).toBeFalsy();
            }
        });
    }

    /**
    * To verify that element not contains expected
    * @param actual any value 
    * @param expected any value
    * @param description description of element that is being validated
    * @param softAssert for soft asserts this has to be set to true, else this can be ignored
    */
    public static async assertNotContains(actual: any, expected: any, description: string, softAssert = false) {
        await test.step(`Verifying that ${description} does not contain '${expected}'`, async () => {
            if (softAssert) {
                expect.soft(actual, `'${actual}' should NOT CONTAIN '${expected}'`).not.toContain(expected);
            } else {
                expect(actual, `'${actual}' should NOT CONTAIN '${expected}'`).not.toContain(expected);
            }
        });
    }

    /**
     * To verify actual not equals to expected
     * @param actual any object
     * @param expected any object to compare
     * @param description object description
     * @param softAssert for soft asserts this has to be set to true, else this can be ignored
     */
    public static async assertNotEquals(actual: any, expected: any, description: string, softAssert = false) {
        await test.step(`Verifying that ${description} is not equals to ${expected}`, async () => {
            if (softAssert) {
                expect.soft(actual, `Expected '${expected}' should NOT be EQUAL to Actual '${actual}'`).not.toEqual(expected);
            } else {
                expect(actual, `Expected '${expected}' should NOT be EQUAL to Actual '${actual}'`).not.toEqual(expected);
            }
        });
    }

    /**
     * To verify value not equals to null
     * @param value any value
     * @param description description of the value
     * @param softAssert for soft asserts this has to be set to true, else this can be ignored
     */
    public static async assertNotNull(value: any, description: string, softAssert = false) {
        await test.step(`Verifying that ${description} is not null`, async () => {
            if (softAssert) {
                expect.soft(value, `Expected is 'NOT null' & Actual is '${value}'`).not.toEqual(null);
            } else {
                expect(value, `Expected is 'NOT null' & Actual is '${value}'`).not.toEqual(null);
            }
        });
    }

    /**
     * To validate that value is not null
     * @param value any value
     * @param description description of the element
     * @param softAssert for soft asserts this has to be set to true, else this can be ignored
     */
    public static async assertNull(value: any, description: string, softAssert = false) {
        await test.step(`Verifying that ${description} is equals to null`, async () => {
            if (softAssert) {
                expect.soft(value, `Expected is 'null' & Actual is '${value}'`).toEqual(null);
            } else {
                expect(value, `Expected is 'null' & Actual is '${value}'`).toEqual(null);
            }
        });
    }

    /**
    * To validate that value is Undefined
    * @param value any value
    * @param description description of the element
    * @param softAssert for soft asserts this has to be set to true, else this can be ignored
    */
    public static async assertUndefined(value: any, description: string, softAssert = false) {
        await test.step(`Verifying that ${description} is undefined`, async () => {
            if (softAssert) {
                expect.soft(value, `Expected is 'Undefined' & Actual is '${value}'`).toEqual(typeof undefined);
            } else {
                expect(value, `Expected is 'Undefined' & Actual is '${value}'`).toEqual(typeof undefined);
            }
        });
    }

    /**
     * To validate that element is empty
     * @param value any element
     * @param description description of the element
     * @param softAssert for soft asserts this has to be set to true, else this can be ignored
     */
    public static async assertToBeEmpty(value: any, description: string, softAssert = false) {
        await test.step(`Verifying that ${description} is empty`, async () => {
            if (softAssert) {
                await expect.soft(value, `Expected is 'Empty' & Actual is '${value}'`).toBeEmpty();
            } else {
                await expect(value, `Expected is 'Empty' & Actual is '${value}'`).toBeEmpty();
            }
        });
    }
}
