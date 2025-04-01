import { read, utils } from "xlsx";
import { EnrichedSale, Result, Row } from "../types";
import exchangeRates from "../data/exchange_rates_2024.json";

export async function parseXlsx(file: File): Promise<Result> {
  try {
    const aBuffer = await file.arrayBuffer();
    const workbook = read(aBuffer, { type: "buffer" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = utils.sheet_to_json<Row>(firstSheet);
    console.info("Total rows parsed", rows.length);

    const sales = rows.filter((row) => row["Record Type"] === "Sell");
    console.info("Sale rows parsed", sales.length);

    const result: Result = sales.reduce<Result>(
      (res, currSale) => {
        const exchangeRate = (exchangeRates as Record<string, number>)[
          currSale["Date Sold"]
        ];
        if (!exchangeRate) {
          alert(`Could not find an exchange rate for ${currSale["Date Sold"]}`);
          throw new Error(
            `Could not find an exchange rate for ${currSale["Date Sold"]}`
          );
        }
        // Enrich the sale with exchange rate
        const enrichedSale: EnrichedSale = {
          ...currSale,
          "Exchange Rate": exchangeRate,
          "Adjusted Gain/Loss (EUR)":
            currSale["Adjusted Gain/Loss"] / exchangeRate,
        };
        res.sales.push(enrichedSale);

        // Update the aggregates
        res.aggregates.total = {
          adjustedGainLossDollar:
            res.aggregates.total.adjustedGainLossDollar +
            currSale["Adjusted Gain/Loss"],
          adjustedGainLossEuro:
            res.aggregates.total.adjustedGainLossEuro +
            enrichedSale["Adjusted Gain/Loss (EUR)"],
          gainsEuro:
            enrichedSale["Adjusted Gain/Loss (EUR)"] > 0
              ? res.aggregates.total.gainsEuro +
                enrichedSale["Adjusted Gain/Loss (EUR)"]
              : res.aggregates.total.gainsEuro,
          lossesEuro:
            enrichedSale["Adjusted Gain/Loss (EUR)"] < 0
              ? res.aggregates.total.lossesEuro +
                enrichedSale["Adjusted Gain/Loss (EUR)"]
              : res.aggregates.total.lossesEuro,
        };
        return res;
      },
      {
        sales: [],
        aggregates: {
          total: {
            adjustedGainLossDollar: 0,
            adjustedGainLossEuro: 0,
            gainsEuro: 0,
            lossesEuro: 0,
          },
        },
      }
    );
    console.info("Parsed result", result);
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
