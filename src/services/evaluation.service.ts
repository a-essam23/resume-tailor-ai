import { GoogleGenerativeAI } from "@google/generative-ai";
import { IJobApplication } from "@schemas/job-application.schema";
import { IResume } from "@schemas/resume.schema";
import AppError from "@utils/AppError";
import { log } from "@utils/logger";
import config from "config";

const genAI = new GoogleGenerativeAI(config.API_KEY);
const model = genAI.getGenerativeModel({ model: config.MODEL });

interface IEvaluationResponse {
  score: number;
  keySkillAlignmentScore: number;
  experienceRelevanceScore: number;
  educationCertificationsScore: number;
  achievementAttunementScore: number;
  recommendations: string[];
}

const evluationPrompt = `
  Analyze the following resume and determine its suitability for the job described below and provide scores for:
  Key Skill Alignment
  Experience Relevance Score
  Education & Certifications Score
  Achievement Attunement
  Overall score
  
  
  Recommendations for improvement: Suggest specific changes the candidate could make to their resume to increase its chances of passing through an Applicant Tracking System (ATS) and landing an interview. Limit the scope to the resume itself.
  
  
  Resume:
  {{resume}}
  
  
  Job Description:
  {{job_description}}
  
  OUTPUT FORMAT:
      {
          "score": number,
          "keySkillAlignmentScore": number,
          "experienceRelevanceScore": number,
          "educationCertificationsScore": number,
          "achievementAttunementScore": number,
          "recommendations": string[]
      }`;

export const evaluateResume = async (
  jobDescription: IJobApplication,
  resume: IResume
) => {
  log.info("Evaluating resume...", "ai");
  const prompt = evluationPrompt
    .replace("{{resume}}", JSON.stringify(resume))
    .replace("{{job_description}}", JSON.stringify(jobDescription));
  let response: string | IEvaluationResponse = (
    await model.generateContent(prompt)
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
