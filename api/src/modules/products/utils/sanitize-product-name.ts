export function sanitizeProductName(productName: string | null): {
  productName: string | null;
  productCode: string | null;
} {
  if (!productName || productName.trim() === '') {
    return { productName: null, productCode: null };
  }

  // Tenta extrair o código do produto primeiro
  const match = productName.match(/(\d{10,})/); // Tentativa de encontrar código numérico longo
  const productCode = match ? match[1] : null;

  // Sanitize the product name (removendo caracteres especiais, espaços extras e parênteses vazios ou com conteúdo)
  let sanitizedName = productName
    .replace(/[#<>&"'\/]/g, '') // Remove alguns caracteres especiais
    .replace(/[^\x00-\x7F]/g, '') // Remove caracteres não-ASCII (ex.: emoticons)
    .replace(/\s+/g, ' ') // Remove múltiplos espaços
    .replace(/\(.*\)/g, '') // Remove tudo que estiver dentro de parênteses
    .trim();

  // Se um código foi encontrado, remove do nome do produto
  if (productCode) {
    sanitizedName = sanitizedName.replace(productCode, '').trim();
  }

  // Retorna o nome sanitizado e o código encontrado
  return { productName: sanitizedName, productCode };
}
