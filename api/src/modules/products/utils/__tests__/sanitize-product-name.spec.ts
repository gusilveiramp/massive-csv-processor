import { sanitizeProductName } from '../sanitize-product-name';

describe('sanitizeProductName', () => {
  it('should extract product name and code correctly', () => {
    const result = sanitizeProductName('Smartphone X 1234567890');
    expect(result.productCode).toBe('1234567890');
    expect(result.productName).toContain('Smartphone X');
  });

  it('should sanitize special characters and whitespace', () => {
    const result = sanitizeProductName('Notebook 💻 Z   #123 (Promo)');
    expect(result.productName).not.toContain('💻');
    expect(result.productName).not.toContain('Promo');
    expect(result.productName).not.toContain('#');
    expect(result.productName).not.toContain('  ');
  });

  it('should return nulls for empty input', () => {
    const result = sanitizeProductName('');
    expect(result.productName).toBeNull();
    expect(result.productCode).toBeNull();
  });
});
