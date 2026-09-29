import js from "@eslint/js";

const eslintConfig = [
  js.configs.recommended,
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
      "**/*.d.ts",
    ],
  },
  {
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
    },
  },
];

export default eslintConfig;
