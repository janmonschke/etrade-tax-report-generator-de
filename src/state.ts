import { assign, fromPromise, setup } from "xstate";
import { Result, Sale, TaxYear } from "./types";
import { parseXlsx } from "./actions/parseXlsx";

const parseSalesFromFile = fromPromise<
  Result,
  { file: File; taxYear: TaxYear }
>(async function ({ input }) {
  return parseXlsx(input);
});

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
      | { type: "file.parsed"; sales: Sale[] }
      | { type: "state.reset" },
  },
  initial: "initial",
  context: initialContext,
  states: {
    initial: {
      on: {
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
