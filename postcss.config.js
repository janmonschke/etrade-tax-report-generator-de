import { purgeCSSPlugin } from "@fullhuman/postcss-purgecss";

const isDev = process.env["NODE_ENV"] !== "production";

export default {
  plugins: isDev
    ? []
    : [
        // Setting up purgeCSS for the external CSS framework
        purgeCSSPlugin({
          content: ["./src/**/*.ts"],
          css: ["./src/style.css"],
          variables: true,
        }),
      ],
};
