import { createActor } from "xstate";
import { etradeAppStateMachine } from "./state";
import { render } from "lit-html";
import { UploadForm } from "./components/UploadForm";
import { ResultView } from "./components/Result";
import { ErrorView } from "./components/Error";

const appContainer =
  document.getElementById("app") || document.createElement("div");
// reset any pre-existing markup
appContainer.innerHTML = "";

if (!appContainer) {
  alert("Cannot find element with id `#app`");
}

const actor = createActor(etradeAppStateMachine);

actor.subscribe((state) => {
  switch (state.value) {
    case "initial":
      return render(
        UploadForm({ onFileSelected: sendFileSelected }),
        appContainer
      );
    case "parsing":
      return render("parsing...", appContainer);

    case "result":
      return render(ResultView(state.context.result), appContainer);

    case "error":
      return render(
        ErrorView({ error: state.context.error, onReset: sendReset }),
        appContainer
      );
  }
});

actor.start();

function sendFileSelected(file: File) {
  actor.send({ type: "file.selected", file });
}

function sendReset() {
  actor.send({ type: "state.reset" });
}
