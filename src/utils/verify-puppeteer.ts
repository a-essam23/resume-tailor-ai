import puppeteer, { Browser } from "puppeteer";
import { log } from "./logger";
import AppError from "./AppError";

export let browserInstance: Browser;

interface PuppeteerVerificationResult {
  isSetupCorrect: boolean;
  details: {
    puppeteerInstalled: boolean;
    browserLaunchable: boolean;
  };
  error?: string;
}

export async function verifyPuppeteerSetup(): Promise<PuppeteerVerificationResult> {
  const result: PuppeteerVerificationResult = {
    isSetupCorrect: false,
    details: {
      puppeteerInstalled: false,
      browserLaunchable: false,
    },
  };

  try {
    // Check if puppeteer is installed
    result.details.puppeteerInstalled = true;

    // Try launching browser
    browserInstance = await puppeteer.launch({
      headless: true,
    });
    result.details.browserLaunchable = true;

    // If all checks pass, setup is correct
    result.isSetupCorrect = Object.values(result.details).every(
      (value) => value === true
    );
    if (result.isSetupCorrect) {
      log.debug("Puppeteer setup verified", "preloading");
    } else {
      throw new AppError("Puppeteer setup is incorrect", {
        details: result.details,
      });
    }
  } catch (error) {
    throw error;
  }
  return result;
}
