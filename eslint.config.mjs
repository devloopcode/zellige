import typescriptEslint from "@typescript-eslint/eslint-plugin";
import node from "eslint-plugin-node";
import prettier from "eslint-plugin-prettier";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import { fixupConfigRules } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["src/types/global.d.ts"],
}, ...fixupConfigRules(
    compat.extends(
        "eslint:recommended",
        "plugin:node/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended",
    )), {
    plugins: {
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            tsconfigRootDir: "/home/aitmiloud/Music/Packages",
            project: ["./tsconfig.json"],
        },
    },

    rules: {
        "prettier/prettier": "warn",
        "node/no-missing-import": "off",
        "node/no-empty-function": "off",
        "node/no-unsupported-features/es-syntax": "off",
        "node/no-missing-require": "off",
        "node/shebang": "off",
        "@typescript-eslint/no-use-before-define": "off",

        quotes: ["warn", "single", {
            avoidEscape: true,
        }],

        "node/no-unpublished-import": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
}];