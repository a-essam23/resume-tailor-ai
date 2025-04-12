import { browserInstance } from "@utils/verify-puppeteer";

export const getPage = async () => (await browserInstance.pages())[0];
