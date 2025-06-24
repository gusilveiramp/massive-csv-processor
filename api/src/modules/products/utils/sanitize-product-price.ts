export function sanitizeProductPrice(price: string | null): number | null {
  if (!price || price.trim() === '') {
    return null; // Se o preço estiver vazio ou inválido, retorna 0
  }

  // Tenta remover o símbolo de $ e verificar o formato
  const sanitizedPrice = price.replace('$', '').trim();
  const parsedPrice = parseFloat(sanitizedPrice);

  // Verifica se o preço é um número válido
  return isNaN(parsedPrice) || parsedPrice < 0 ? null : parsedPrice;
}
