import { IJobApplication } from "@schemas/job-application.schema";
import config from "config";
import { existsSync, mkdirSync } from "fs";

// generate directory
export const createNewDir = (dir: string) =>
  existsSync(dir) || mkdirSync(dir, { recursive: true });

export const createResumeDir = (application: IJobApplication) => {
  // create a directory under output
  // use "company_name" + "job_title" + "current iso time"
  const dir = `${config.OUTPUT_DIR.toLocaleLowerCase().replaceAll(
    " ",
    "-"
  )}/${application.company.toLocaleLowerCase().replaceAll(" ", "-")}_${
    application.title
  }_${Date.now()}`;
  createNewDir(dir);
  return dir;
};
