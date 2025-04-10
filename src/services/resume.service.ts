import { launch } from "puppeteer";
import Handlebars from "handlebars";
import { ResumeSchema } from "@/schemas/resume.schema";
import AppError from "@utils/AppError";
import config from "config";
import { log } from "@utils/logger";
import { readFileSync, writeFileSync, copyFileSync } from "fs";
import path from "path";

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

export const compileResume = (
  resume: object,
  template: string,
  output_dir: string
) => {
  const templatePath = path.join(
    process.cwd(),
    "templates",
    template,
  );
  const templateContent = readFileSync(`${templatePath}/html.hbs`, "utf-8");
  const cssContent = readFileSync(`${templatePath}/styles.css`, "utf-8");
  log.debug(`Compiling resume into html...`);


  // Compile template with CSS embedded
  const compiled = Handlebars.compile(templateContent);
  const context = {
    style: "classic",
    color: "blue",
    ...resume,
  };
  const htmlContent = compiled(context);

  // Inject CSS into HTML
  const htmlOutput = `<!DOCTYPE html>
<html>
<head>
<style>
${cssContent}
</style>
</head>
<body>
${htmlContent}
</body>
</html>`;

  writeFileSync(`${output_dir}/${config.RESUME_OUTPUT_NAME}.html`, htmlOutput);
  log.info("Resume compiled successfully!");
  return htmlOutput;
};

export const generatePDF = async (resume_html: string, output_dir: string) => {
  log.debug(`Generating pdf...`);
  const browser = await launch();
  const page = await browser.newPage();

  await page.setContent(resume_html, {
    waitUntil: "networkidle0",
  });

  // PDF options

  await page.pdf({
    path: `${output_dir}/${config.RESUME_OUTPUT_NAME}.pdf`,
    format: "A4",
    printBackground: true,
  });
  log.info("PDF generated successfully!");
  await browser.close();
};
