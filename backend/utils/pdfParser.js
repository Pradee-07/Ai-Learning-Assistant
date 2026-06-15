import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

/**
 * Extract text from a PDF file path or uploaded PDF buffer.
 * @param {string|Buffer|Uint8Array} pdfInput - Path to PDF file or PDF bytes
 * @returns {Promise<{text: string, numPages: number}>}
 */
export const extractTextFromPDF = async (pdfInput) => {
  let parser;

  try {
    const dataBuffer =
      typeof pdfInput === "string" ? await fs.readFile(pdfInput) : pdfInput;
    
    parser = new PDFParse({ data: new Uint8Array(dataBuffer) });
    const data = await parser.getText();

    return {
      text: data.text,
      numPages: data.total,
      info: data.info,
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
};
