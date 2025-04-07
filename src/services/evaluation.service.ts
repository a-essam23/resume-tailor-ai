import { IJobApplication } from "@schemas/job-application.schema";
import { IResume } from "@schemas/resume.schema";
import AppError from "@utils/AppError";
import { log } from "@utils/logger";
import { generateContent } from "./generate.service";

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
  {{job}}
  
  OUTPUT FORMAT:
      {
          "score": number,
          "keySkillAlignmentScore": number,
          "experienceRelevanceScore": number,
          "educationCertificationsScore": number,
          "achievementAttunementScore": number,
          "recommendations": string[]
      }`;

const evaluationPrompt_2 = `
You are an expert resume evaluator. Your task is to assess how well a provided resume has been tailored to a given job application and output the evaluation as a JSON object.


**Job Application (JSON):**
\`\`\`json
{{application}}
\`\`\`

**Tailored Resume (JSON):**
\`\`\`json
{{resume}}
\`\`\`

Evaluate the tailored resume based on the following criteria:

1.  **Alignment with Job Requirements:** How well does the tailored resume address the specific requirements (skills, experience, education) mentioned in the job application? Provide 1-2 specific examples within the JSON output.
2.  **Highlighting Relevant Skills:** Does the tailored resume effectively highlight the skills mentioned in the job application? Are these skills presented prominently and supported by relevant experience? (Indicate "Yes" or "No" in the JSON output).
3.  **Matching Responsibilities and Achievements:** Does the tailored resume demonstrate experience in performing the responsibilities outlined in the job application? Are the achievements listed in the resume relevant to the job's needs? Provide a brief summary (1-2 sentences) within the JSON output.
4.  **Use of Keywords:** Does the tailored resume incorporate relevant keywords and phrases from the job application? (Indicate "Yes" or "No" in the JSON output).
5.  **Overall Relevance:** How relevant is the tailored resume to the job application overall? Provide a concise assessment (e.g., "Highly Relevant," "Moderately Relevant," "Slightly Relevant").

Output your evaluation as a JSON object with the following structure:

\`\`\`json
{
  "overallAssessment": "...",
  "strengths": ["...", "..."],
  "areasForImprovement": ["...", "..."],
  "skillHighlighting": "Yes" | "No",
  "responsibilityMatchingSummary": "...",
  "keywordUsage": "Yes" | "No",
  "overallRelevance": "...",
  "score": (Optional) Number between 1 and 10
}
\`\`\`

**Ensure that the output is a valid JSON object and nothing else.** Do not include any introductory or concluding text outside of the JSON structure.`;

export const evaluateResume = async (
  jobDescription: IJobApplication,
  resume: IResume
) => {
  log.info("Evaluating resume...", "ai");
  const prompt = evaluationPrompt_2
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
