const intlInstances = new Map();
export function getFormattedRate(rate, fiat) {
  let localIntl;
  if (intlInstances.has(fiat)) {
    localIntl = intlInstances.get(fiat);
  } else {
    let instance = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: fiat,
      maximumFractionDigits: 5,
      minimumSignificantDigits: 5,
      maximumSignificantDigits: 5
    });
    intlInstances.set(fiat, instance);
    localIntl = instance;
  }
  return typeof rate === "number" ? localIntl.format(rate) : rate;
}
