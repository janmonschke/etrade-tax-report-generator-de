import { html } from "lit-html";

export type Props = {
  onFileSelected: (file: File) => void;
};

export function UploadForm({ onFileSelected }: Props) {
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
      <h1 class="title is-size-3">E*Trade → Anlage KAP (tax year 2024)</h1>
      <article class="message is-info" id="disclaimer" style="max-width: 500px">
        <div class="message-body">
          I am not a tax advisor and this is not tax advise. Always make sure to
          check if these numbers make sense in your case.
        </div>
      </article>
      <ol>
        <li class="is-size-6 ml-4 mb-2">
          Sign in to
          <a href="https://us.etrade.com/e/t/user/login" target="_blank"
            >E*Trade</a
          >
        </li>
        <li class="is-size-6 ml-4 mb-2">My Account</li>
        <li class="is-size-6 ml-4 mb-2">Gains & Losses</li>
        <li class="is-size-6 ml-4 mb-2">Tax Year 2024</li>
        <li class="is-size-6 ml-4 mb-2">Download Expanded</li>
      </ol>

      <form>
        <label class="button is-link is-outlined mt-2">
          <input
            type="file"
            accept=".xlsx"
            @change=${(event: Event) => onFileChange(event)}
            style="display: none;"
          />
          Upload the .xlsx file
        </label>
      </form>
    </div>
  `;
}
