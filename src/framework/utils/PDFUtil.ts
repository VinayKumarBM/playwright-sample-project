import fs from "fs";
import pdfParse from "pdf-parse";

export default class PDFUtil {
    /**
     * Gets the text content of the pdf file
     * @param filePath File path
     * @returns PDF as text
     */
    public static async getText(filePath: string): Promise<string> {
        const buffer = fs.readFileSync(filePath);
        try {
            const data = await pdfParse(buffer);
            return data.text;
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Gets number of pages in pdf file
     * @param filePath File path
     * @returns Number of pages
     */
    public static async getNumberOfPages(filePath: string): Promise<number> {
        const buffer = fs.readFileSync(filePath);
        try {
            const data = await pdfParse(buffer);
            return data.numpages;
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Gets the information about the pdf file
     * @param filePath File path
     * @returns PDF document info
     */
    public static async getInfo(filePath: string): Promise<any> {
        const buffer = fs.readFileSync(filePath);
        try {
            const data = await pdfParse(buffer);
            return data.info;
        } catch (err) {
            throw new Error(err);
        }
    }
}
