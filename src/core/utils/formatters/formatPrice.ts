interface FormatPriceOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export const formatPrice = (value: number, options?: FormatPriceOptions) => {
  const formatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    ...options,
  });
  return formatter.format(value);
};
