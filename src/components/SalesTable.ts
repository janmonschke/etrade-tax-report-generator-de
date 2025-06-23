import { html } from "lit-html";
import { Result } from "../types";

export function SalesTable({ sales }: Result) {
  return html`
    <table class="table">
      <thead>
        <tr>
          <th>Date Sold</th>
          <th>Quantity</th>
          <th>Adjusted Gain/Loss per Share ($)</th>
          <th>Adjusted Gain/Loss ($)</th>
          <th>Adjusted Gain/Loss (€)</th>
          <th>Exchange Rate</th>
          <th>Order Type</th>
        </tr>
      </thead>
      ${sales.map(
        (sale) => html`
          <tr>
            <td>${sale["Date Sold"]}</td>
            <td>${sale["Quantity"]}</td>
            <td>$ ${sale["Adjusted Gain (Loss) Per Share"].toFixed(2)}</td>
            <td>$ ${sale["Adjusted Gain/Loss"].toFixed(2)}</td>
            <td>${sale["Adjusted Gain/Loss (EUR)"].toFixed(2)}€</td>
            <td>${sale["Exchange Rate"]}</td>
            <td>${sale["Order Type"]}</td>
          </tr>
        `
      )}
    </div>
  `;
}
