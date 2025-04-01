import { html } from "lit-html";
import { Result } from "../types";

export function Summary({ aggregates: { total } }: Result) {
  return html`
    <div class="content">
      <dl>
        <dt class="has-text-weight-semibold">Adjusted Gains/Losses</dt>
        <dd>${total.adjustedGainLossEuro.toFixed(2)}€</dd>
        <dt class="has-text-weight-semibold">Total Gains</dt>
        <dd>${total.gainsEuro.toFixed(2)}€</dd>
        <dt class="has-text-weight-semibold">Total Losses</dt>
        <dd>${total.lossesEuro.toFixed(2)}€</dd>
      </dl>
    </div>
  `;
}
