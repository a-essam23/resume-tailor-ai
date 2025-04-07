import { resumeSchemaString } from "@schemas/resume.schema";

export interface IPrompt {
  message: string;
  system?: string;
}

export const prompt_1: IPrompt = {
  system: `You are an expert resume tailor. Your task is to revise the provided resume to be highly relevant to the job description. Focus on highlighting skills and experiences mentioned in the job description, rephrasing job responsibilities and achievements to align with the job requirements, and prioritizing the most relevant information. Ensure the output is a valid JSON object representing the tailored resume adhereing to the schema.`,
  message: `Resume Schema:
${resumeSchemaString}
  
Here is the resume (JSON):
\`\`\`json
{{resume}}
\`\`\`

Here is the job application:
\`\`\`json
{{job}}
\`\`\`

**Your output MUST be a valid JSON object. Do not include any introductory or concluding text, explanations, or any other additional information. Do not add unnecessary text formatting to the text such as "\n". Keep the strings clean and adhere to the schema detailed above.
OUTPUT FORMAT:
  {
    "changeLog": {
      "modifications": string[],
      "warnings": string[]
    },
    "adjustedResume": Resume
  }
`,
};
