import {  PrintConsumerDto } from "../../../../domain/dtos/consumer-dto";
import { generateArabicDate, getTodayInArabic, toArabicNumerals } from "./arabicText.utils";
import fs from 'fs';
import path from "path";
import { CustomLogger } from "../../../../services/logger";
import ejs from 'ejs';
import puppeteer, { PDFOptions } from 'puppeteer';
import { PDFDocument } from "pdf-lib";
import { numberToArabicText } from "../../../../utils/arabic-text-utils";

const logger = new CustomLogger("back-office", "controller");


const checkIfFileExists = async (filePath: string) => {
    if (!fs.existsSync(filePath))
        throw new Error(`File not found: ${filePath}`);
}

export const generateCustomerActivationDocs = async (customerInfo: PrintConsumerDto) => {
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
            date: generateArabicDate(),
            credit_limit: toArabicNumerals(customerInfo.credit_limit),
            credit_limit_arabic_text: numberToArabicText(customerInfo.credit_limit.toString()),
            national_id: toArabicNumerals(customerInfo.national_id),
            additional_salary: customerInfo.additional_salary > 0 ?toArabicNumerals(customerInfo.additional_salary) :"لايوجد",
            salary: toArabicNumerals(customerInfo.salary),
            city:"",
            day_name: getTodayInArabic()
        }


        const htmlFiles = [
            { path: path.join(__dirname, '../public/files/kyc.ejs'), landscape: true },
            { path: path.join(__dirname, '../public/files/contract.ejs'), landscape: true },
            { path: path.join(__dirname, '../public/files/promissory.ejs'), landscape: false },
        ];

        const pdfBuffers = await Promise.all(htmlFiles.map(async (file) => {
            await checkIfFileExists(file.path);
            const htmlContent = await renderTemplate(file.path, data);
            return await generatePDF(htmlContent, {
                format: 'a4',
                printBackground: true,
                landscape: file.landscape,
            });
        }));

        // Merge PDFs using pdf-lib
        const mergedPdfDoc = await PDFDocument.create();
        for (const pdfBuffer of pdfBuffers) {
            const pdfDoc = await PDFDocument.load(pdfBuffer);
            const pages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
            pages.forEach((page) => mergedPdfDoc.addPage(page));
        }

        const mergedPdfBytes = await mergedPdfDoc.save();
        return Buffer.from(mergedPdfBytes)

    } catch (err) {
        logger.error(`Failed to generate customer activation docs pdf Error: ${err}`);
        return null
    }
}
const renderTemplate = async (templatePath: string, data: any): Promise<string> => {
    await checkIfFileExists(templatePath);
    const template = fs.readFileSync(templatePath, 'utf8');
    return ejs.render(template, data);
}

// Function to generate a PDF from HTML content
const generatePDF = async (htmlContent: string, options: PDFOptions) => {
    let browser = null
    try {
        browser = await puppeteer.launch({
            headless: true,
            executablePath: '/usr/bin/chromium-browser',
            args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage']
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        const pdf = await page.pdf(options);
        await browser.close();
        return pdf
    } catch (err) {
        logger.error(`Failed to generate pdf with puppeteer Error: ${err}`);
        throw err
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}