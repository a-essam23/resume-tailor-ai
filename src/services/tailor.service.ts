import { GoogleGenerativeAI } from "@google/generative-ai";
import { IAdjustmentControls } from "@schemas/controls.schema";
import { IJobApplication } from "@schemas/job-application.schema";
import { IResume } from "@schemas/resume.schema";
import { log } from "@utils/logger";
import config from "config";
import { validateResume } from "./resume.service";
import AppError from "@utils/AppError";
import { writeFileSync } from "fs";

const genAI = new GoogleGenerativeAI(config.API_KEY);
const model = genAI.getGenerativeModel({ model: config.MODEL });

interface IGeneratedResumeResponse {
  adjustedResume: IResume;
  changeLog: {
    experienceModifications: string[];
    skillAdditions: string[];
    warnings: string[];
  };
}
export const generateTailoredResume = async (
  jobApplication: IJobApplication,
  resume: IResume,
  controls: IAdjustmentControls,
  out_dir: string
): Promise<IGeneratedResumeResponse> => {
  log.info("Generating tailored resume...", "ai");
  const prompt = `
          Given this job description:
          ${jobApplication}
        
          And this base resume (JSON):
          ${JSON.stringify(resume)}
        
          ADJUSTMENT RULES:
          1. Experience years can increase by max ${
            controls.experience.maxYearsIncrease * 100
          }%
          2. ${
            controls.skills.maxNewSkills
          } new skills allowed from job description
          3. Must maintain ${
            controls.skills.requiredMatchThreshold * 100
          }% truthfulness
        
          OUTPUT FORMAT:
          {
           "changeLog": {
              "experienceModifications": string[],
              "skillAdditions": string[],
              "warnings": string[]
            },
            "adjustedResume": Resume
          }
          `;

  let tailoredResume: string | IGeneratedResumeResponse = (
    await model.generateContent(prompt)
  ).response
    .text()
    .replace("```json", "")
    .replace("```", "");
  try {
    tailoredResume = JSON.parse(tailoredResume) as IGeneratedResumeResponse;
    validateResume(tailoredResume.adjustedResume);
  } catch (e) {
    throw new AppError("Tailored resume is not valid JSON");
  }
  // save adjusted resume
  log.info("Tailored resume generated!", "ai");
  log.info("Saving tailored resume...", "ai");
  writeFileSync(
    `${out_dir}/_resume.json`,
    JSON.stringify(tailoredResume, null, 2)
  );

  return tailoredResume;
};

/**
 * Create multiple prompting schemas
 * Evaluate each version and save it
 * Comapre them and assess the best output
 */
