import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // Express's documented pattern for augmenting Request requires `declare global { namespace Express {} }`
      "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true }],
      // Express only treats a 4-arg function as error-handling middleware; unused params are prefixed with `_`
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
]);
