/* eslint-disable @typescript-eslint/no-var-requires */
const xpath = require('xpath');
const Dom = require('xmldom').DOMParser;

export default class XMLParserUtil {
    /**
     * Get content of tag in XML using xpath
     * @param xPathExpression xpath for the tag
     * @param xml as string
     */
    public static getTagContentByXpath(xml: string, xPathExpression: string): string {        
        const doc = new Dom().parseFromString(xml);
        const text = xpath.select(`string(${xPathExpression})`, doc);
        return text;
    }

    /**
     * Get value of attribute in XML using xpath
     * @param xPathExpression xpath for the attribute
     * @param xml as string
     */
    public static getAttributeValueByXpath(xml: string, xPathExpression: string): string {
        const doc = new Dom().parseFromString(xml);
        const text = xpath.select1(xPathExpression, doc).value;
        return text;
    }
}
