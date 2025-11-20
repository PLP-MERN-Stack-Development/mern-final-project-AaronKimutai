import globals from "globals";
import js from "@eslint/js";

export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,  
            },
            sourceType: "module",
            ecmaVersion: 2022,
        },
        rules: {
            ...js.configs.recommended.rules,

            "indent": "off",
            "no-irregular-whitespace": "off",
            "eol-last": "off",
            "comma-spacing": "off",
            "key-spacing": "off",

            "no-console": "off",
            "no-unused-vars": ["warn", { "argsIgnorePattern": "next" }],
            "semi": ["error", "always"]
        }
    }
];
