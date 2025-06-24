import { sanitizeExpiration } from '../sanitize-product-expiration';

describe('sanitizeExpiration', () => {
  it('should return null for empty input', () => {
    expect(sanitizeExpiration('')).toBeNull();
    expect(sanitizeExpiration(null)).toBeNull();
  });

  it('should return a valid Date for a proper MM/DD/YYYY input', () => {
    const result = sanitizeExpiration('12/31/2025');
    expect(result).toBeInstanceOf(Date);
    expect(result?.getFullYear()).toBe(2025);
    expect(result?.getMonth()).toBe(11); // 0-indexed
    expect(result?.getDate()).toBe(31);
  });

  it('should return null for invalid date format', () => {
    expect(sanitizeExpiration('invalid-date')).toBeNull();
  });
});
