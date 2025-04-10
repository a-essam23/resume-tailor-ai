import config from "@config";
import { jobApplicationSchema } from "@schemas/job-application.schema";
import { compileResume, generatePDF } from "@services/resume.service";
import { generateTailoredResume } from "@services/tailor.service";
import AppError from "@utils/AppError";
import catchAsync from "@utils/catchAsync";

export const processJob = catchAsync(async (req, res, next) => {
  if (!req.body) throw new AppError("No description provided", 400);
  const parsed = jobApplicationSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(
      parsed.error.errors.map((e) => e.message).join("\n"),
      400
    );
  }
  const resume = (await generateTailoredResume(parsed.data, config.RESUME))
    .adjustedResume;

  const compiledResume = compileResume(
    resume,
    config.TEMPLATE,
    config.OUTPUT_DIR
  );

  generatePDF(compiledResume, config.OUTPUT_DIR);

  res.status(200).json({
    status: "success",
  });
});
