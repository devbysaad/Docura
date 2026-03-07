const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

/**
 * Split a single line into multiple lines that fit within maxWidth.
 */
function wrapLine(text, font, fontSize, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Create a PDF document from plain text with proper pagination and line wrapping.
 * @param {string} text - The user-supplied text.
 * @returns {Promise<Uint8Array>} PDF bytes.
 */
async function createPdf(text) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const fontSize = 12;
  const lineHeight = fontSize * 1.4;
  const margin = 50;
  const pageWidth = 595.28; // A4
  const pageHeight = 841.89;
  const maxTextWidth = pageWidth - margin * 2;
  const usableHeight = pageHeight - margin * 2;

  // Split input into paragraphs, then wrap each paragraph
  const paragraphs = text.split("\n");
  const allLines = [];
  for (const para of paragraphs) {
    if (para.trim() === "") {
      allLines.push(""); // preserve blank lines
    } else {
      allLines.push(...wrapLine(para, font, fontSize, maxTextWidth));
    }
  }

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  for (const line of allLines) {
    if (y - lineHeight < margin) {
      // Start a new page
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }

    if (line !== "") {
      page.drawText(line, {
        x: margin,
        y: y - fontSize,
        size: fontSize,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
    }

    y -= lineHeight;
  }

  return pdfDoc.save();
}

module.exports = { createPdf };
