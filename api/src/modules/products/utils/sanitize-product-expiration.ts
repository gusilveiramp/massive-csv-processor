export function sanitizeExpiration(expiration: string | null): Date | null {
  if (!expiration || expiration.trim() === '') {
    return null; // Se a data estiver vazia ou inválida, retorna null
  }

  const [month, day, year] = expiration
    .split('/')
    .map((part) => parseInt(part.trim(), 10));

  if (isNaN(month) || isNaN(day) || isNaN(year)) {
    return null; // Se a data não puder ser convertida para um formato válido, retorna null
  }

  return new Date(year, month - 1, day); // Cria um objeto Date a partir da data válida
}
