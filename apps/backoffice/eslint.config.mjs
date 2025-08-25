import { nextJsConfig } from '@soybelumont/eslint-config/nextjs';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    rules: {
      'turbo/no-undeclared-env-vars': 'off',
    },
  },
];
