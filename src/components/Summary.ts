import { html } from "lit-html";
import { Result } from "../types";

export function Summary({ aggregates: { total } }: Result) {
  return html`
    <div class="content">
      <table>
        <tr>
          <td class="has-text-weight-semibold">Adjusted Gains/Losses</td>
          <td>${total.adjustedGainLossEuro.toFixed(2)}€</td>
        </tr>
        <tr>
          <td class="has-text-weight-semibold">Total Gains</td>
          <td>${total.gainsEuro.toFixed(2)}€</td>
        </tr>
        <tr>
          <td class="has-text-weight-semibold">Total Losses</td>
          <td>${total.lossesEuro.toFixed(2)}€</td>
        </tr>
      </table>
    </div>
  `;
}
