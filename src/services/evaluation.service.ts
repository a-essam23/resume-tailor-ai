import { IJobApplication } from "@schemas/job-application.schema";
import { IResume } from "@schemas/resume.schema";
import AppError from "@utils/AppError";
import { log } from "@utils/logger";
import { generateContent } from "./generate.service";
import { evalPrompts } from "@prompts/evaluation.prompts";

interface IEvaluationResponse {
  score: number;
  keySkillAlignmentScore: number;
  experienceRelevanceScore: number;
  educationCertificationsScore: number;
  achievementAttunementScore: number;
  recommendations: string[];
}

export const evaluateResume = async (
  jobDescription: IJobApplication,
  resume: IResume
) => {
  log.info("Evaluating resume...", "ai");
  const prompt = evalPrompts[1]
    .replace("{{resume}}", JSON.stringify(resume))
    .replace("{{job}}", JSON.stringify(jobDescription));
  let response: string | IEvaluationResponse = (
    await generateContent(prompt, "")
  ).response.text();
  try {
    response = JSON.parse(
      response.replace("```json", "").replace("```", "")
    ) as IEvaluationResponse;
  } catch (e) {
    throw new AppError("Evaluation response is not valid JSON", {
      details: response,
    });
  }
  log.info("Evaluation done!", "ai");
  log.verbose(JSON.stringify(response), "ai");
  return response;
};
