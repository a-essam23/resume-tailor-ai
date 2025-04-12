import { IAdjustmentControls } from "@schemas/controls.schema";
import { IJobApplication } from "@schemas/job-application.schema";
import {
  IResume,
  ResumeSchema,
  resumeSchemaString,
} from "@schemas/resume.schema";
import { log } from "@utils/logger";
import { validateResume } from "./resume.service";
import AppError from "@utils/AppError";
import { writeFileSync } from "fs";
import { generateContent } from "./generate.service";
import config from "@config";
import { createNewDir } from "@helpers/fs.helpers";
import { evaluateResume } from "./evaluation.service";
import {
  IGenerateResumePrompt,
  IGenerateResumeResponse,
  tailorPrompts,
} from "@prompts/tailor.prompts";

export const generateTailoredResume = async (
  jobApplication: IJobApplication,
  resume: IResume
): Promise<IGenerateResumeResponse> => {
  const out_dir = createNewDir(
    `${config.OUTPUT_DIR}/temp/${jobApplication.company
      .toLowerCase()
      .replace(" ", "-")}_${jobApplication.title
      .toLowerCase()
      .replaceAll(" ", "-")}-${Date.now()}`
  );
  const tResume = await requestTailoredResume(
    tailorPrompts[0],
    jobApplication,
    resume
  );
  writeFileSync(`${out_dir}/_resume.json`, JSON.stringify(tResume, null, 2));
  writeFileSync(
    `${out_dir}/_job.json`,
    JSON.stringify(jobApplication, null, 2)
  );
  log.info(
    `Resume compatability improved from ${tResume.compatatibilityScoreBefore} to ${tResume.compatatibilityScoreAfter}`,
    "ai"
  );
  if (tResume.changeLog.modifications.length > 0)
    log.verbose(
      [
        "Modifications:",
        ...tResume.changeLog.modifications.map((mod) => `  • ${mod}`),
      ].join("\n"),
      "ai"
    );
  if (tResume.changeLog.warnings.length > 0)
    log.warn(
      `Resume warnings:\n ${tResume.changeLog.warnings
        .map((s) => `• ${s}`)
        .join("\n ")}`,
      "ai"
    );
  return tResume;
};

const requestTailoredResume = async (
  prompt: IGenerateResumePrompt,
  job: IJobApplication,
  resume: IResume
): Promise<IGenerateResumeResponse> => {
  // assign resume and job application to prompt
  prompt.message = prompt.message
    .replace("{{resume}}", JSON.stringify(resume, null, 2))
    .replace("{{job}}", JSON.stringify(job, null, 2));
  log.debug(`Tailoring resume for ${job.title} at ${job.company}`, "ai");
  let tailoredResume: string | IGenerateResumeResponse = (
    await generateContent(prompt.message, prompt.system)
  ).response
    .text()
    .replace("```json", "")
    .replace("```", "");

  try {
    tailoredResume = JSON.parse(tailoredResume) as IGenerateResumeResponse;
    validateResume(tailoredResume.adjustedResume);
  } catch (e: any) {
    throw new AppError(e.message, { cause: e });
  }
  log.info("✅ Resume tailored successfully!", "ai");
  return tailoredResume;
};

export const compareResumePrompts = async (
  prompts: IGenerateResumePrompt[],
  job: IJobApplication,
  resume: IResume
) => {
  let res = `# Comparing ${prompts.length} different prompts\n`;
  const out_dir = createNewDir(`${config.OUTPUT_DIR}/evaluations`);
  log.info(`Comparing ${prompts.length} prompts...`, "ai");

  const resumes = await Promise.all(
    prompts.map(async (p, _) => {
      try {
        const result = await requestTailoredResume(p, job, resume);
        log.debug(`Prompt ${_} complete`);
        return result;
      } catch (e: any) {
        log.error(`Prompt ${_} failed: ${e?.message}`);
        return e as Error;
      }
    })
  );

  log.info("Evaluating resumes...", "ai");
  const evaluations = await Promise.all(
    resumes.map(async (r) => {
      if (r instanceof Error) return "";
      return await evaluateResume(job, r.adjustedResume);
    })
  );
  for (let i = 0; i < resumes.length; i++) {
    const result = resumes[i];
    const evaluation = evaluations[i];
    const _t = `## Prompt ${i}
\`\`\`json
${JSON.stringify(prompts[i], null, 2)}
\`\`\`

### Result:
\`\`\`json
${
  result instanceof Error
    ? result.message
    : JSON.stringify(result.changeLog, null, 2)
}
\`\`\`

### Evaluation:
\`\`\`json
${
  typeof evaluation === "string"
    ? evaluation
    : JSON.stringify(evaluation, null, 2)
}
\`\`\`
***`;
    res += _t;
  }

  writeFileSync(
    `${out_dir}/${job.title.toLowerCase().replaceAll(" ", "_")}-evaluation.md`,
    res
  );
};
