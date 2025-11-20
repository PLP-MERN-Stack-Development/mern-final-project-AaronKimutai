import globals from "globals";
import js from "@eslint/js";

export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                ...globals.node,
            },
            sourceType: "module",
            ecmaVersion: 2022, 
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-console": "off",
            "no-unused-vars": ["error", { "argsIgnorePattern": "next" }], 
            "indent": ["error", 4, { "SwitchCase": 1 }], 
            "semi": ["error", "always"]
        }
    }
];
