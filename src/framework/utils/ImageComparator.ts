import Allure from "@allure";
import CommonConstants from "framework/constants/CommonConstants";
import * as fs from "fs";

export default class ImageComparator {
    /**
     * Compare two images and return if they are same or not along with mismatch percentage. 
     * If a baseline image does not exist, one is automatically created in baseline image directory and the test is considered passed. This ensures that the first run always establishes a baseline for future comparisons.
     * If differences are detected, a diff image highlighting the changes is generated and stored in ./test-results/image/diffs.
     * @param baselineImagedDir Path to the baseline image directory 
     * @param baselineImageName baseline image name 
     * @param actualImageDir Path to the actual image directory 
     * @param actualImageName actual image name
     * @param misMatchTolerance tolerance level for image comparison in percentage (0.00 for exact match, 0.25 for 0.25% mismatch allowed etc., default is 0.00)
     * @returns 
     */
    public static async compareImages(baselineImagedDir: string, baselineImageName: string, actualImageDir: string, actualImageName: string, misMatchTolerance = 0.00): Promise<{ isSame: boolean; misMatchPercentage: number }> {
        const baselinePath = `${baselineImagedDir}/${baselineImageName}`;
        const actualPath = `${actualImageDir}/${actualImageName}`;
        // Ensure folder exists
        if (!fs.existsSync(baselineImagedDir)) {
            fs.mkdirSync(baselineImagedDir, { recursive: true });
        }
        // If no baseline exists, save current screenshot as baseline
        if (!fs.existsSync(baselinePath)) {
            fs.renameSync(actualPath, baselinePath);
            return { isSame: true, misMatchPercentage: 0 };
        }
        const compareImages = require("resemblejs/compareImages");
        // Compare baseline with actual using Resemble.js
        const options = {
            output: {
              errorColor: { red: 255, green: 0, blue: 255 },
              errorType: "movement",
              transparency: 0.3,
              largeImageThreshold: 1200,
              useCrossOrigin: false,
              outputDiff: true,
            },
            scaleToSameSize: true,  // auto resize images
            ignore: "antialiasing", // ignore rendering noise
          };
        
          const data = await compareImages(
            fs.readFileSync(baselinePath),
            fs.readFileSync(actualPath),
            options
          );
          const misMatch = parseFloat(data.misMatchPercentage);
          const isSame = misMatch <= misMatchTolerance; 
          if (!isSame) {
            if (!fs.existsSync(CommonConstants.IMAGE_DIFF_PATH)) {
                fs.mkdirSync(CommonConstants.IMAGE_DIFF_PATH, { recursive: true });
            }
            fs.writeFileSync(`${CommonConstants.IMAGE_DIFF_PATH}/Diff_${actualImageName}`, data.getBuffer(true));
            await Allure.attachPNG(`Diff_${actualImageName}`, `${CommonConstants.IMAGE_DIFF_PATH}/Diff_${actualImageName}`);
          }
          return {
            isSame: isSame,
            misMatchPercentage: misMatch,
          };
       }
}