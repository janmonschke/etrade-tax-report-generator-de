import { assign, fromPromise, setup } from "xstate";
import { Result, Sale } from "./types";
import { parseXlsx } from "./actions/parseXlsx";

const parseSalesFromFile = fromPromise<Result, File>(async function ({
  input,
}) {
  return parseXlsx(input);
});

export const etradeAppStateMachine = setup({
  actors: {
    parseSalesFromFile,
  },
}).createMachine({
  types: {
    context: {} as { result: Result; error: string },
    events: {} as
      | { type: "file.selected"; file: File }
      | { type: "file.parsed"; sales: Sale[] }
      | { type: "state.reset" },
  },
  initial: "initial",
  context: {
    sales: [],
  },
  states: {
    initial: {
      on: {
        "file.selected": {
          target: "parsing",
        },
      },
    },
    parsing: {
      invoke: {
        id: "parsing",
        src: "parseSalesFromFile",
        input: (s) => s.event.file,
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
        "state.reset": "initial",
      },
    },
  },
});
