export function createProductDetailGetPrice(isActiveDeal: boolean) {
  return (
    regularINR: number,
    regularUSD: number,
    dealINR?: number,
    dealUSD?: number,
  ) => {
    if (isActiveDeal && dealINR && dealINR > 0) {
      return {
        priceINR: dealINR,
        priceUSD: dealUSD || dealINR / 83,
        originalPriceINR: regularINR,
        originalPriceUSD: regularUSD,
        isDeal: true,
      };
    }
    return {
      priceINR: regularINR,
      priceUSD: regularUSD,
      isDeal: false,
    };
  };
}
