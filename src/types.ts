export type TaxYear = "2023" | "2024";

export type Sale = {
  "Record Type": "Sell";
  "Order Type": "Sell Restricted Stock" | "RS STC";
  /**
   * Format: 06/20/2024
   */
  "Date Sold": string;
  "Adjusted Gain/Loss": number;
  "Qty.": number;
};
export type Summary = {
  "Record Type": "Summary";
};
export type Row = Sale | Summary;

export type EnrichedSale = Sale & {
  "Adjusted Gain/Loss (EUR)": number;
  "Exchange Rate": number;
};

export type Result = {
  sales: EnrichedSale[];
  aggregates: {
    total: SalesAggregate;
    rsuSales?: SalesAggregate;
    sellToCover?: SalesAggregate;
    espp?: SalesAggregate;
  };
};

type SalesAggregate = {
  adjustedGainLossDollar: number;
  adjustedGainLossEuro: number;
  gainsEuro: number;
  lossesEuro: number;
};
