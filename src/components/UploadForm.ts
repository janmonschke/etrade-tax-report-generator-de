import { html } from "lit-html";
import { TaxYear } from "../types";

export type Props = {
  onFileSelected: (file: File) => void;
  onTaxYearSelected: (taxYear: TaxYear) => void;
  taxYear: TaxYear;
};

export function UploadForm({
  onFileSelected,
  onTaxYearSelected,
  taxYear,
}: Props) {
  function onFileChange(event: Event) {
    event.preventDefault();
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) {
      alert("No file was selected");
    } else {
      onFileSelected(file);
    }
  }

  return html`
    <div>
      <h1 class="title is-size-3">E*Trade → Anlage KAP</h1>
      <article class="message is-info" id="disclaimer" style="max-width: 500px">
        <div class="message-body">
          I am not a tax advisor and this is not tax advice. Always make sure to
          check if these numbers make sense in your case.
        </div>
      </article>
      <div class="is-flex is-align-items-center mb-2">
        <label for="tax-year" class="mr-2">Tax year:</label>
        <div class="select">
          <select
            id="tax-year"
            @change=${(event: Event) =>
              onTaxYearSelected(
                (event.target as HTMLSelectElement).value as TaxYear
              )}
          >
            <option>2024</option>
            <option>2023</option>
            <option>2022</option>
            <option>2021</option>
            <option>2020</option>
            <option>2019</option>
          </select>
        </div>
      </div>
      <ol>
        <li class="is-size-6 ml-4 mb-2">
          Sign in to
          <a href="https://us.etrade.com/e/t/user/login" target="_blank"
            >E*Trade</a
          >
        </li>
        <li class="is-size-6 ml-4 mb-2">At Work</li>
        <li class="is-size-6 ml-4 mb-2">My Account</li>
        <li class="is-size-6 ml-4 mb-2">Gains & Losses</li>
        <li class="is-size-6 ml-4 mb-2">Tax Year ${taxYear}</li>
        <li class="is-size-6 ml-4 mb-2">Download Expanded</li>
      </ol>

      <div class="mt-2">
        <label class="button is-link is-outlined">
          <input
            type="file"
            accept=".xlsx"
            @change=${(event: Event) => onFileChange(event)}
            style="display: none;"
          />
          Select the .xlsx file
        </label>
      </div>
    </div>
  `;
}
