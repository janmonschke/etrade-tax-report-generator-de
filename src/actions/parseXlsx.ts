import { read, utils } from "xlsx";
import { EnrichedSale, Result, Row, TaxYear } from "../types";
import exchangeRates2024 from "../data/exchange_rates_2024.json";
import exchangeRates2023 from "../data/exchange_rates_2023.json";
import exchangeRates2022 from "../data/exchange_rates_2022.json";
import exchangeRates2021 from "../data/exchange_rates_2021.json";
import exchangeRates2020 from "../data/exchange_rates_2020.json";
import exchangeRates2019 from "../data/exchange_rates_2019.json";

const exchangeRates: Record<TaxYear, Record<string, number>> = {
  "2019": exchangeRates2019,
  "2020": exchangeRates2020,
  "2021": exchangeRates2021,
  "2022": exchangeRates2022,
  "2023": exchangeRates2023,
  "2024": exchangeRates2024,
};

export async function parseXlsx({
  file,
  taxYear,
}: {
  file: File;
  taxYear: TaxYear;
}): Promise<Result> {
  try {
    const aBuffer = await file.arrayBuffer();
    const workbook = read(aBuffer, { type: "buffer" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = utils.sheet_to_json<Row>(firstSheet);
    console.info("Total rows parsed", rows.length);

    const sales = rows.filter((row) => row["Record Type"] === "Sell");
    console.info("Sale rows parsed", sales.length);

    const selectedRates = exchangeRates[taxYear];
    console.info("Selected exchange rates", selectedRates);

    const result: Result = sales.reduce<Result>(
      (res, currSale) => {
        const exchangeRate = selectedRates[currSale["Date Sold"]];
        if (!exchangeRate) {
          throw new Error(
            `Could not find an exchange rate for ${currSale["Date Sold"]}.
            Did you select the correct tax year?`
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
