import { html } from "lit-html";
import { Result } from "../types";
import { Summary } from "./Summary";
import { SalesTable } from "./SalesTable";

export function ResultView(result: Result) {
  return html`<h1 class="title is-size-">Anlage KAP summary</h1>
    ${html`${Summary(result)}`} ${html`${SalesTable(result)}`}
  </h1> `;
}
