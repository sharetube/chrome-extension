import pluginReact from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["**/*.{ts,tsx}"],
  },
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    ignores: ["dist/*", "node_modules/*", ".yarn/*"],
  },
];
