import { html } from "lit-html";

export function ErrorView({
  error,
  onReset,
}: {
  error: string;
  onReset: () => void;
}) {
  return html`
    <div>
      <article
        class="message is-danger"
        id="disclaimer"
        style="max-width: 600px"
      >
        <div class="message-body">${error}</div>
      </article>
      <button class="button" @click=${onReset}>Reset</button>
    </div>
  `;
}
