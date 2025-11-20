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
            
            
            "indent": "off",          
            
            "no-console": "off",          
            "no-unused-vars": ["error", { "argsIgnorePattern": "next" }], 
            "semi": ["error", "always"] 
        }
    }
];