import puppeteer from "puppeteer";
import { existsSync } from "fs";
import { join } from "path";
import { log } from "./logger";
import AppError from "./AppError";

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
    const browser = await puppeteer.launch({
      headless: true,
    });
    result.details.browserLaunchable = true;
    await browser.close();

    // If all checks pass, setup is correct
    result.isSetupCorrect = Object.values(result.details).every(
      (value) => value === true
    );
    if (result.isSetupCorrect) {
      log.debug("Puppeteer setup verified", "verify");
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
