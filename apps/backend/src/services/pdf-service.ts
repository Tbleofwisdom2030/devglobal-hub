// Invoice PDF generation
// TODO: Add PDF service
import PDFDocument from 'pdfkit';
import { logger } from '../config/logger';

export class PDFService {
  public static async generateInvoice(data: {
    invoiceNumber: string;
    date: Date;
    customerName: string;
    customerEmail: string;
    productName: string;
    amount: number;
    currency: string;
    licenseKey?: string;
  }): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Header
        doc.fontSize(24).font('Helvetica-Bold').text('INVOICE', { align: 'right' });
        doc.moveDown();
        
        // Company info
        doc.fontSize(10).font('Helvetica');
        doc.text('DevGlobal Hub', { align: 'left' });
        doc.text('support@devglobalhub.com');
        doc.text('Invoice #: ' + data.invoiceNumber);
        doc.text('Date: ' + data.date.toISOString().split('T')[0]);
        doc.moveDown();

        // Customer info
        doc.font('Helvetica-Bold').text('Bill To:');
        doc.font('Helvetica');
        doc.text(data.customerName);
        doc.text(data.customerEmail);
        doc.moveDown();

        // Line items table
        const tableTop = doc.y;
        const tableHeaders = ['Description', 'Quantity', 'Unit Price', 'Total'];
        const columnWidths = [250, 80, 100, 80];

        // Table header
        doc.font('Helvetica-Bold');
        let xPos = 50;
        tableHeaders.forEach((header, i) => {
          doc.text(header, xPos, tableTop, { width: columnWidths[i], align: i > 1 ? 'right' : 'left' });
          xPos += columnWidths[i];
        });

        // Table row
        doc.moveDown();
        doc.font('Helvetica');
        const rowTop = doc.y;
        xPos = 50;
        const rowData = [
          data.productName,
          '1',
          `${(data.amount / 100).toFixed(2)} ${data.currency}`,
          `${(data.amount / 100).toFixed(2)} ${data.currency}`,
        ];
        rowData.forEach((text, i) => {
          doc.text(text, xPos, rowTop, { width: columnWidths[i], align: i > 1 ? 'right' : 'left' });
          xPos += columnWidths[i];
        });

        // Draw line
        doc.moveDown();
        const lineY = doc.y;
        doc.moveTo(50, lineY).lineTo(545, lineY).stroke();
        doc.moveDown();

        // Total
        doc.font('Helvetica-Bold');
        doc.text(
          `Total: ${(data.amount / 100).toFixed(2)} ${data.currency}`,
          { align: 'right' }
        );

        // License key
        if (data.licenseKey) {
          doc.moveDown(2);
          doc.font('Helvetica');
          doc.text('License Key: ' + data.licenseKey);
        }

        // Footer
        doc.moveDown(3);
        doc.fontSize(8).font('Helvetica');
        doc.text('Thank you for your purchase!', { align: 'center' });
        doc.text('DevGlobal Hub - Empowering Developers Worldwide', { align: 'center' });

        doc.end();
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        logger.error('PDF generation failed: %s', err.stack ?? err.message);
        reject(err);
      }
    });
  }
}