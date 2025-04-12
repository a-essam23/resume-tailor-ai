import { IResume, resumeSchemaString } from "@schemas/resume.schema";

export interface IGenerateResumePrompt {
  message: string;
  system?: string;
}

export interface IGenerateResumeResponse {
  changeLog: {
    modifications: string[];
    warnings: string[];
  };
  compatatibilityScoreBefore: number;
  compatatibilityScoreAfter: number;
  adjustedResume: IResume;
}

const prompt_1: IGenerateResumePrompt = {
  system: `You are an expert resume tailor. Your task is to revise the provided resume to be highly relevant to the job description. Focus on strategically incorporating keywords, rephrasing job responsibilities and achievements to align with the job requirements, and prioritizing the most relevant information while maintaining accuracy. Ensure the output is a valid JSON object representing the tailored resume adhering to the schema.`,
  message: `Resume Schema:
${resumeSchemaString}

Here is the resume (JSON):
\`\`\`json
{{resume}}
\`\`\`

Here is the job application (JSON):
\`\`\`json
{{job}}
\`\`\`


Instructions:

1.  **Extract Keywords:** Identify and extract the most important keywords and phrases from the job description that relate to skills, experience, and required qualifications.
2.  **Rewrite Job/Project Highlights:** For each job and project highlight, rewrite the descriptions to emphasize the skills and experiences that align with the "required expertise" and the extracted keywords from the job description. Use strong action verbs and quantify achievements where possible. Ensure the rewritten highlights remain truthful and contextually relevant to the original experience.
3.  **Adjust Skills:** Compare the skills listed in the resume with the skills required in the job description. Add any crucial missing skills (if they are demonstrably supported by the experience described in the resume) and reorder the skills section to highlight those most relevant to the job.
4.  **Maintain Job Titles:** Do NOT change the job titles listed in the original resume. Do NOT change the job title listed in the summary.
5.  **Enhance Summary:** Rewrite the "summary" section to incorporate relevant keywords extracted from the job description while preserving the original essence and flow of the summary. Avoid overstuffing with keywords.
6.  **Consider Other Sections:** If relevant keywords or requirements appear in sections like "Awards and Recognition" or "Education" in the job description, tailor these sections to highlight those connections.
7.  **Maintain Coherence:** Ensure that rewritten highlights are relevant to the scope of the project or work field.

**Your output MUST be a valid JSON object. Do not include any introductory or concluding text, explanations, or any other additional information. Do not add unnecessary text formatting to the text such as "\n". Keep the strings clean and adhere to the schema detailed above.
/*
Modifications array should contain a list of all the modifications made to the resume.
Warnings array should contain a list of all the warnings that were raised during the process.
compatatibilityScoreBefore represent how compatible the resume is with the job description before the modifications. 0-100.
compatatibilityScoreAfter represent how compatible the resume is with the job description after the modifications. 0-100.
adjustedResume is the resume after the modifications following the resume schema.
*/

OUTPUT FORMAT:
{
  "changeLog": {
    "modifications": string[],
    "warnings": string[]
  },
  "compatatibilityScoreBefore": number,
  "compatatibilityScoreAfter": number,
  "confidenceScore": number, // Add a confidence score
  "adjustedResume": Resume
}
`,
};

export const tailorPrompts = [prompt_1];
