import config from "config";
import { compileResume } from "@services/resume.service";
import { createResumeDir } from "@helpers/fs.helpers";
import {
  mockJobApplication,
  mockJobApplications,
} from "@assets/mock-job-application";
import { generateTailoredResume } from "@services/tailor.service";
import { evaluateResume } from "@services/evaluation.service";
// app.listen(config.PORT, () => {
//   log.info(`Server running on port ${config.PORT}`, "server");
// });

// evaluateResume(mockJobApplication, config.RESUME)
//   .then((res) => {
//     console.log("Evaluation done!");
//     console.log(res.response.text());
//   })
//   .catch(console.error);

const main = async () => {
  const out_dir = createResumeDir(mockJobApplications[2]);
  const resume = await generateTailoredResume(
    mockJobApplication,
    config.RESUME,
    config.controls,
    out_dir
  );
  const html = compileResume(resume.adjustedResume, config.TEMPLATE, out_dir);
  // generatePDF(html, out_dir);
  evaluateResume(mockJobApplication, config.RESUME);
  evaluateResume(mockJobApplication, resume.adjustedResume);
};

main();
