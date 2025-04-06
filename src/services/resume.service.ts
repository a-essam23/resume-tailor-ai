import { launch } from "puppeteer";
import Handlebars from "handlebars";
import { ResumeSchema } from "@/schemas/resume.schema";
import AppError from "@utils/AppError";
import { existsSync, readFile, readFileSync, writeFileSync } from "fs";
import config from "config";
import { log } from "@utils/logger";

export const validateResume = (resume: object) => {
  const validatedResume = ResumeSchema.safeParse(resume);

  if (!validatedResume.success)
    throw new AppError("Resume validation failed", {
      cause: validatedResume.error,
      statusCode: 400,
      code: "RESUME_VALIDATION_FAILED",
      details: validatedResume.error.issues,
    });
  log.debug("Resume is correct!");
  return validatedResume.data;
};

export const compileResume = (resume: object, template: any) => {
  const compiled = Handlebars.compile(template);
  const context = {
    style: "classic",
    color: "blue",
    ...resume,
  };
  const htmlOutput = compiled(context);
  writeFileSync(`${config.OUTPUT_DIR}/resume.html`, htmlOutput);
  return htmlOutput;
};

export const generatePDF = async (resume_html: string) => {
  // Add comprehensive print CSS
  const printCSS = `
<style>
  @media print {
    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      font-size: 11pt !important;
      line-height: 1.4 !important;
    }

    .container {
      box-shadow: none !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    .section {
      page-break-inside: avoid !important;
      margin-bottom: 15pt !important;
    }

    h1 { font-size: 24pt !important; }
    h2 { font-size: 18pt !important; }
    h3 { font-size: 14pt !important; }

    a::after {
      content: "" !important;
    }

    /* Fix for flex/grid layouts in PDF */
    .work-header, .education-header {
      display: block !important;
    }
    
    .date {
      float: right;
    }
  }

  /* Universal box sizing */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  /* Prevent overflow */
  .container {
    max-width: 100% !important;
  }
</style>
`;

  const browser = await launch();
  const page = await browser.newPage();

  await page.setContent(`${printCSS}${resume_html}`, {
    waitUntil: "networkidle0",
  });

  // PDF options

  await page.pdf({
    path: `${config.OUTPUT_DIR}/resume.pdf`,
    format: "A4",
    printBackground: true,
    margin: {
      top: "15mm",
      right: "15mm",
      bottom: "15mm",
      left: "15mm",
    },
    scale: 0.8, // Reduce scaling for better fit
  });

  await browser.close();
};
