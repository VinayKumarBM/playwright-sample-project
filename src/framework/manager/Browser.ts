import BrowserConstants from "../constants/BrowserConstants";

export default class Browser {
    public static type(browser: string) {
        let browserType;
        if (browser === BrowserConstants.FIREFOX) {
            browserType = BrowserConstants.FIREFOX;
        } else if (browser === BrowserConstants.WEBKIT) {
            browserType = BrowserConstants.WEBKIT;
        } else {
            browserType = BrowserConstants.CHROMIUM;
        }
        return browserType;
    }

    public static channel(browser: string) {
        let browserChannel;
        if (browser === BrowserConstants.CHROME) {
            browserChannel = BrowserConstants.CHROME;
        } else if (browser === BrowserConstants.EDGE) {
            browserChannel = BrowserConstants.MSEDGE;
        } else {
            browserChannel = BrowserConstants.BLANK;
        }
        return browserChannel;
    }
}
