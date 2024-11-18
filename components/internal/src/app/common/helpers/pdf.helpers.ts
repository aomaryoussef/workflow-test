import ejs from "ejs";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import puppeteer, { PDFOptions } from "puppeteer";

import { IConsumerDto } from "@/app/[locale]/back-office/private/consumers/activate/dto/consumer.dto";
import { CustomLogger } from "@/logger.ts";

import { getTodayInArabic, numberToArabicText, toArabicNumerals } from "./arabic-text.helpers";

const logger = new CustomLogger({ service: "backoffice", context: "pdf-utils" });

const checkIfFileExists = async (filePath: string) => {
  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
};

export const generateCustomerActivationDocs = async (customerInfo: IConsumerDto) => {
  try {
    const data = {
      full_name: customerInfo.full_name,
      company_address: customerInfo.company_address,
      home_phone_number: customerInfo.home_phone_number,
      work_phone_number: customerInfo.work_phone_number,
      phone_number: customerInfo.phone_number,
      address: customerInfo.address,
      national_id_address: customerInfo.national_id_address,
      company_name: customerInfo.company,
      job_name: customerInfo.job_name,
      branch_name: customerInfo.branch_name,
      additional_salary_source: customerInfo.additional_salary > 0 ? customerInfo.additional_salary_source : "لايوجد",
      date: "",
      credit_limit: toArabicNumerals(customerInfo.credit_limit),
      credit_limit_arabic_text: numberToArabicText(customerInfo.credit_limit.toString()),
      national_id: toArabicNumerals(customerInfo.national_id),
      additional_salary:
        customerInfo.additional_salary > 0 ? toArabicNumerals(customerInfo.additional_salary) : "لايوجد",
      salary: toArabicNumerals(customerInfo.salary),
      city: "",
      day_name: getTodayInArabic(),
    };

    const basePath =
      process.env.NODE_ENV === "development"
        ? path.join(process.cwd(), "src", "app", "templates") // Development path
        : path.join(process.cwd(), ".next", "server", "app", "templates"); // Production build path

    const htmlFiles = [
      { path: path.join(basePath, "kyc.ejs"), landscape: true },
      { path: path.join(basePath, "contract.ejs"), landscape: true },
      { path: path.join(basePath, "promissory.ejs"), landscape: false },
    ];

    const pdfBuffers = await Promise.all(
      htmlFiles.map(async (file) => {
        await checkIfFileExists(file.path);
        const htmlContent = await renderTemplate(file.path, data);
        const pdfBuffer = await generatePDF(htmlContent, {
          format: "a4",
          printBackground: true,
          landscape: file.landscape,
        });
        return pdfBuffer;
      })
    );

    // Merge PDFs using pdf-lib
    const mergedPdfDoc = await PDFDocument.create();
    for (const pdfBuffer of pdfBuffers) {
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach((page) => mergedPdfDoc.addPage(page));
    }

    const mergedPdfBytes = await mergedPdfDoc.save();
    return Buffer.from(mergedPdfBytes);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

const renderTemplate = async (templatePath: string, data: any): Promise<string> => {
  await checkIfFileExists(templatePath);
  const template = fs.readFileSync(templatePath, "utf8");
  return ejs.render(template, data);
};

/** Function to generate a PDF from HTML content */
const generatePDF = async (htmlContent: string, options: PDFOptions) => {
  if (!process.env.OL_BFF_CHROME_EXECUTABLE_PATH) throw new Error("Chrome executable path is not defined");

  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.OL_BFF_CHROME_EXECUTABLE_PATH,
      args: ["--no-sandbox", "--headless", "--disable-gpu", "--disable-dev-shm-usage", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdf = await page.pdf(options);
    await page.close(); // Sometimes it's not closed automatically
    await browser.close();
    return pdf;
  } catch (err) {
    logger.error("Failed to generate pdf with puppeteer Error", err);
    throw err;
  } finally {
    if (browser) await browser.close();
  }
};
