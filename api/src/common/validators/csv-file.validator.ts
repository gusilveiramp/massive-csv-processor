import { FileValidator } from '@nestjs/common';

interface CsvValidationOptions {} // mesmo que vazio, serve pro tipo ser compatível

export class CsvFileValidator extends FileValidator<CsvValidationOptions> {
  constructor() {
    super({});
  }

  isValid(file?: Express.Multer.File): boolean {
    if (!file) return false;

    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (ext !== 'csv' || file.mimetype !== 'text/csv') return false;

    const content = file.buffer.toString('utf-8', 0, 1024);
    const firstLine = content.split(/\r?\n/)[0] || '';

    const looksLikeCsv =
      /[,;\t]/.test(firstLine) &&
      !firstLine.startsWith('{') &&
      !firstLine.startsWith('<') &&
      firstLine.length > 1;

    return looksLikeCsv;
  }

  buildErrorMessage(): string {
    return 'Invalid CSV format.';
  }
}
