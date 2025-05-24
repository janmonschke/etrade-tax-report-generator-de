import {
  assign,
  fromPromise,
  setup,
  AnyEventObject,
  MachineContext,
  ActionArgs,
} from "xstate";
import { Result, Sale, TaxYear } from "./types";
import { parseXlsx } from "./actions/parseXlsx";

const parseSalesFromFile = fromPromise<
  Result,
  { file: File; taxYear: TaxYear }
>(async function ({ input }) {
  return parseXlsx(input);
});

let machineActor: ActionArgs<
  MachineContext,
  AnyEventObject,
  AnyEventObject
> | null = null;

const initialContext = {
  taxYear: "2024",
};
export const etradeAppStateMachine = setup({
  actors: {
    parseSalesFromFile,
  },
}).createMachine({
  types: {
    context: {} as { result: Result; error: string; taxYear: TaxYear },
    events: {} as
      | { type: "year.selected"; taxYear: TaxYear }
      | { type: "file.selected"; file: File }
      | { type: "file.dropped"; file: File }
      | { type: "file.parsed"; sales: Sale[] }
      | { type: "state.reset" },
  },
  initial: "initial",
  context: initialContext,
  states: {
    initial: {
      entry: function (actor) {
        machineActor = actor;
        document.body.addEventListener("dragover", onDragOver);
        document.body.addEventListener("dragleave", onDragLeave);
        document.body.addEventListener("drop", onDrop);
      },
      exit: () => {
        document.body.removeEventListener("dragover", onDragOver);
        document.body.removeEventListener("dragleave", onDragLeave);
        document.body.addEventListener("drop", onDrop);
        console.log("exit");
      },
      on: {
        "file.dropped": {
          target: "parsing",
        },
        "file.selected": {
          target: "parsing",
        },
        "year.selected": {
          actions: assign({
            taxYear: ({ event }) => event.taxYear,
          }),
        },
      },
    },
    parsing: {
      invoke: {
        id: "parsing",
        src: "parseSalesFromFile",
        input: (s) => ({ file: s.event.file, taxYear: s.context.taxYear }),
        onDone: {
          target: "result",
          actions: assign({
            result: ({ event }) => event.output,
          }),
        },
        onError: {
          target: "error",
          actions: assign({
            error: ({ event }) => (event.error as Error).toString(),
          }),
        },
      },
    },
    result: {
      type: "final",
    },
    error: {
      on: {
        "state.reset": {
          target: "initial",
          actions: assign(initialContext),
        },
      },
    },
  },
});

function onDragOver(event: Event) {
  document.body.classList.add("has-background-info-light");
  // disable the browser's drag/drop default behaviour
  event?.preventDefault();
}

function onDragLeave() {
  document.body.classList.remove("has-background-info-light");
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer?.items) {
    const file = event.dataTransfer.items[0]?.getAsFile();
    console.log("file:", file?.name);
    if (file && file.name.includes("xlsx")) {
      document.body.classList.remove("has-background-info-light");
      machineActor?.self.send({ type: "file.dropped", file });
    } else {
      alert("no file or wrong file");
    }
  } else {
    alert("browser not supported");
  }

  return false;
}
