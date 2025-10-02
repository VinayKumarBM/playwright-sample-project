import Allure from "@allure";
import { test } from "@base-test";
import UIActions from "@uiActions/UIActions";

    test(`Capture the Screenshot and compare with the baseline image`, async ({ page }) => {
        Allure.attachDetails(`Capture the Screenshot and compare with the baseline image`, null);
        const ui = new UIActions(page);
        // All the baseline images are captured and stored in src/resources/baselineImages from below URL
        await ui.goto("https://demo.applitools.com/", "Applitools Demo");
        await ui.element('.auth-wrapper', "Login Section").compareAndValidateElementScreenshot("Login_Section.png");
        await ui.element('.auth-wrapper', "Login Section masked").compareAndValidateElementScreenshot("Login_Section_masked.png", [".logo-w", ".buttons-w"]);
        // All the tests are run against the below URL
        await ui.goto("https://demo.applitools.com/index_v2.html", "Applitools Demo v2");
        // We are masking the dynamic elements before capturing the screenshot. So that the comparison will be done excluding those elements
        await ui.element('.auth-wrapper', "Login Section masked v2").compareAndValidateElementScreenshot("Login_Section_masked.png", [".logo-w", ".buttons-w"]);
        // Here we are using a tolerance of 0.26 to so theme mismatch is accepted
        await ui.element('.auth-wrapper', "Login Section v2 with Tolerance of 0.70").compareAndValidateElementScreenshot("Login_Section.png", [], 0.70);
        // Here we are using a tolerance of 0.00 to so exact match is accepted. This will fail if there is any minor change in the UI
        await ui.element('.auth-wrapper', "Login Section v2").compareAndValidateElementScreenshot("Login_Section.png");
    });
