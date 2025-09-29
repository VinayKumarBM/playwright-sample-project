import fs from 'fs';
import { PDFExtract } from 'pdf.js-extract';
import { PDFDocument, rgb } from 'pdf-lib';
import { ComparePdf } from "compare-pdf-plus";
import Allure from '@allure';

export default class PDFUtil {
    private static readonly MASKED_PDF_DIR_BASELINE = './test-results/pdf/masked/baseline';
    private static readonly MASKED_PDF_DIR_ACTUAL = './test-results/pdf/masked/actual';
    private static readonly PNG_DIR_BASELINE = './test-results/pdf/png/baseline';
    private static readonly PNG_DIR_ACTUAL = './test-results/pdf/png/actual';
    private static readonly PNG_DIR_DIFF = './test-results/pdf/png/diff';
    /**
     * Gets the text, number of pages and info from a PDF file
     * @param pathToFileDirectory path to file directory
     * @param fileName name of the PDF file
     * @returns 
     */
    public static async getPdfTextDetails(pathToFileDirectory: string, fileName: string) {
        const filePath = `${pathToFileDirectory}/${fileName}`;
        const pdfExtract = new PDFExtract();
        const data = await pdfExtract.extract(filePath, {});
        const fullText = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');
        return {
            pageCount: data.pages.length,
            content: fullText,
            info: data.meta.info
        };
    }
    /**
     * Extracts text positions from a specific page in a PDF file
     * @param pdfPath path to the PDF file
     * @param page page number (0-indexed)
     * @returns 
     */
    private static async extractTextPositions(pdfPath: string, page: number): Promise<any[]> {
        const pdfExtract = new PDFExtract();
        const data = await pdfExtract.extract(pdfPath, {});
        return data.pages[page].content.map(item => ({ text: item.str, x: item.x, y: item.y, width: item.width, height: item.height }));
    }
    /**
     * Finds text items that match any of the dynamic texts to be masked
     * @param textItems 
     * @param dynamicTexts 
     * @returns 
     */
    private static findDynamicMatches(textItems: any[], dynamicTexts: string[]) {
        const matches = [];
        for (const dynamicText of dynamicTexts) {
            for (const item of textItems) {
                if (item.text.includes(dynamicText)) {
                    matches.push(item);
                }
            }
        }
        return matches;
    }
    /**
     * Adjusts coordinates based on page rotation
     * @param x masked rectangle x coordinate
     * @param y masked rectangle y coordinate
     * @param w masked rectangle width
     * @param h masked rectangle height
     * @param pageWidth width of the PDF file 
     * @param pageHeight height of the PDF file
     * @param rotation PDF page rotation
     * @returns 
     */
    private static transformCoordinates(x: number, y: number, w: number, h: number, pageWidth: number, pageHeight: number, rotation: number) {
        switch (rotation) {
            case 0:
                return { x, y: pageHeight - y, width: w, height: h };
            case 90:
                return { x: y, y: x - h, width: h, height: w };
            case 180:
                return { x: pageWidth - x - w, y: y - h, width: w, height: h };
            case 270:
                return { x: pageHeight - y - h, y: pageWidth - x - w, width: h, height: w };
            default:
                return { x, y, width: w, height: h };
        }
    }
    /**
     * Masks the dynamic text in the specified pages of the baseline and actual PDF files, saves the masked files, and compares them
     * @param baselineDirPath path to the baseline PDF file directory
     * @param baselineFileName baseline PDF file name
     * @param actualDirPath path to the actual PDF file directory
     * @param actualFileName actual PDF file name
     * @param pageNumbers array of pages to be compared (0-indexed)
     * @param dynamicTexts array of text from baseline PDF file to be masked
     */
    private static async maskPdf(baselineDirPath: string, baselineFileName: string, actualDirPath: string, actualFileName: string, pageNumbers: number[], dynamicTexts: string[]) {
        const baselinePath = `${baselineDirPath}/${baselineFileName}`;
        const actualPath = `${actualDirPath}/${actualFileName}`;
        const baselinePdfDoc = await PDFDocument.load(fs.readFileSync(baselinePath));
        const actualPdfDoc = await PDFDocument.load(fs.readFileSync(actualPath));
        for (const pageNum of pageNumbers) {
            const textItems = await this.extractTextPositions(baselinePath, pageNum);
            const matchedItems = this.findDynamicMatches(textItems, dynamicTexts);
            const baselinePage = baselinePdfDoc.getPage(pageNum);
            const actualPage = actualPdfDoc.getPage(pageNum);
            const { width, height } = baselinePage.getSize();
            const rotation = baselinePage.getRotation().angle;
            for (const item of matchedItems) {
                const rect = this.transformCoordinates(item.x, item.y, item.width, item.height, width, height, rotation);
                const pdfRectOptions = {
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height,
                    color: rgb(0, 0, 0),
                    borderColor: rgb(0, 0, 0),
                    borderWidth: 8,
                    opacity: 1,
                }
                baselinePage.drawRectangle(pdfRectOptions);
                actualPage.drawRectangle(pdfRectOptions);
            }
        }
        const outputDirPathBaseline = this.MASKED_PDF_DIR_BASELINE;
        if (!fs.existsSync(outputDirPathBaseline)) {
            fs.mkdirSync(outputDirPathBaseline, { recursive: true });
        }
        const outputDirPathActual = this.MASKED_PDF_DIR_ACTUAL;
        if (!fs.existsSync(outputDirPathActual)) {
            fs.mkdirSync(outputDirPathActual, { recursive: true });
        }
        const timeStamp = new Date().valueOf();
        const outputBytesBaseline = await baselinePdfDoc.save();
        const maskedBaselineFileName = baselineFileName.replace('.pdf', `_${timeStamp}.pdf`);
        const maskedActualFileName = actualFileName.replace('.pdf', `_${timeStamp}.pdf`);
        fs.writeFileSync(`${outputDirPathBaseline}/${maskedBaselineFileName}`, outputBytesBaseline);
        const outputBytesActual = await actualPdfDoc.save();
        fs.writeFileSync(`${outputDirPathActual}/${maskedActualFileName}`, outputBytesActual);
        return { maskedBaselineDir: outputDirPathBaseline, maskedBaselineFileName, maskedActualDir: outputDirPathActual, maskedActualFileName };
    }
    /**
     * Compares the specified pages of the actual and baseline PDF files and returns the comparison results
     * @param actualPdfDir Path to the actual PDF file directory 
     * @param actualPdfFileName Actual PDF file name 
     * @param baselinePdfDir Path to the baseline PDF file directory
     * @param baselinePdfFileName Baseline PDF file name     
     * @param pages Array of pages to be compared (0-indexed)
     * @param tolerance Pixel difference tolerance 
     * @param threshold Similarity threshold (range is 0.00 to 1.00) 
     * @returns 
     */
    private static async comparePdf(actualPdfDir: string, actualPdfFileName: string, baselinePdfDir: string, baselinePdfFileName: string, pages: number[], tolerance: number, threshold: number) {
        const comparer = new ComparePdf({
            paths: {
                actualPdfRootFolder: actualPdfDir,
                actualPngRootFolder: this.PNG_DIR_ACTUAL,
                baselinePdfRootFolder: baselinePdfDir,
                baselinePngRootFolder: this.PNG_DIR_BASELINE,
                diffPngRootFolder: this.PNG_DIR_DIFF,
            },
            settings: {
                imageEngine: 'native',
                density: 150,
                quality: 80,
                tolerance: tolerance,
                threshold: threshold,
                cleanPngPaths: false,
                matchPageCount: true,
                disableFontFace: true,
            },
        });
        const results = await comparer
            .actualPdfFile(actualPdfFileName)
            .baselinePdfFile(baselinePdfFileName)
            .onlyPageIndexes(pages)
            .compare();
        return results;
    }
    /**
     * Masks the dynamic text in the specified pages of the baseline and actual PDF files and compares them. If differences are found, attaches the actual, baseline, and diff files to the test report.
     * @param baselineDirPath Path to the baseline PDF file directory
     * @param baselineFileName Baseline PDF file name
     * @param actualDirPath Path to the actual PDF file directory 
     * @param actualFileName Actual PDF file name
     * @param pageNumber Pages to be compared (1-indexed, comma-separated. E.g., "1,2,3")
     * @param maskTexts text from baseline PDF file to be masked (pipe-separated. E.g., "text1|text2")
     * @param tolerance Pixel difference tolerance (default is 0). Use 0 for strict comparison and higher values for more lenient comparison 
     * @param threshold Similarity threshold (default is 0.00, range is 0.00 to 1.00). Use 0.00 for strict comparison and higher values for more lenient comparison
     */
    public static async maskAndComparePdf(baselineDirPath: string, baselineFileName: string, actualDirPath: string, actualFileName: string, pageNumber: string, maskTexts: string, tolerance: number = 0, threshold: number = 0.00) {
            const pageNumbers = pageNumber.split(',').map(num => parseInt(num.trim(), 10) - 1);
            const dynamicText = maskTexts ? maskTexts.split('|').map(text => text.trim()) : []
            if (dynamicText.length > 0) {
                const maskDetails = await this.maskPdf(baselineDirPath, baselineFileName, actualDirPath, actualFileName, pageNumbers, dynamicText);
                baselineDirPath = maskDetails.maskedBaselineDir;
                baselineFileName = maskDetails.maskedBaselineFileName;
                actualDirPath = maskDetails.maskedActualDir;
                actualFileName = maskDetails.maskedActualFileName;
            }
            const result = await this.comparePdf(actualDirPath, actualFileName, baselineDirPath, baselineFileName, pageNumbers, tolerance, threshold);
            if (result.status !== 'passed') {
                await Allure.attachPDF('Actual PDF', `${actualDirPath}/${actualFileName}`);
                await Allure.attachPDF('Baseline PDF', `${baselineDirPath}/${baselineFileName}`);
                for (let i = 0; i < result.details.length; i++) {
                    await Allure.attachPNG(`PDF Diff${i + 1}`, result.details[i].diffPng);
                }
                console.log(`PDF comparison failed.\n ${JSON.stringify(result.details, null, 2)}`);                
            }
            return result.status === 'passed';            
    }
}
