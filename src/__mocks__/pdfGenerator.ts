/**
 * Mock implementation of PDF generator for testing
 */
export const generateResumePDF = jest.fn().mockResolvedValue(undefined);

export const generateResumePDFFromHTML = jest.fn().mockRejectedValue(new Error('HTML to PDF conversion not implemented yet'));