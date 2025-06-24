import { sanitizeProductPrice } from '../sanitize-product-price';

describe('sanitizeProductPrice', () => {
  it('should convert valid price strings to number', () => {
    expect(sanitizeProductPrice('$49.99')).toBe(49.99);
    expect(sanitizeProductPrice('100')).toBe(100);
  });

  it('should return null for invalid or negative prices', () => {
    expect(sanitizeProductPrice('-10')).toBeNull();
    expect(sanitizeProductPrice('abc')).toBeNull();
    expect(sanitizeProductPrice(null)).toBeNull();
  });

  it('should trim and sanitize properly', () => {
    expect(sanitizeProductPrice('  $200.50 ')).toBe(200.5);
  });
});
