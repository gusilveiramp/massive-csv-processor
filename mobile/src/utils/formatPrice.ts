export function formatPrice(price: number | null, currency = "USD"): string {
  if (price === null) return "No price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

export function formatPriceInput(value: string): string {
  // Remove tudo que não for dígito
  const numericOnly = value.replace(/[^\d]/g, "");

  // Converte para número e divide por 100 para simular casas decimais
  const floatValue = parseFloat(numericOnly) / 100;

  // Se não for número válido, retorna vazio
  if (isNaN(floatValue)) return "";

  // Formata com 2 casas decimais, separador decimal americano
  return floatValue.toFixed(2);
}
