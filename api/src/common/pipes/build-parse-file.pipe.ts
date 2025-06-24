import {
  ParseFilePipe,
  MaxFileSizeValidator,
  FileValidator,
} from '@nestjs/common';
import { CsvFileValidator } from '../validators/csv-file.validator';

interface BuildPipeOptions {
  type: 'csv'; // future: 'image' | 'pdf', etc.
  maxSizeMB?: number;
}

export function buildParseFilePipe(options: BuildPipeOptions): ParseFilePipe {
  const maxSize = (options.maxSizeMB ?? 10) * 1024 * 1024;

  const validators: FileValidator[] = [new MaxFileSizeValidator({ maxSize })];

  switch (options.type) {
    case 'csv':
      validators.push(new CsvFileValidator());
      break;
    // we can add more types here in future...
    default:
      throw new Error(`Unsupported file type: ${options.type}`);
  }

  return new ParseFilePipe({
    validators,
  });
}
