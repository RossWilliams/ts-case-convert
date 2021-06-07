const {
  TypeScriptProject,
  NodePackageManager,
  ProjectType,
} = require('projen');

const project = new TypeScriptProject({
  defaultReleaseBranch: 'main',
  jsiiFqn: 'projen.TypeScriptProject',
  name: 'ts-case-convert',
  authorEmail: 'ross@UniversalConstructor.co.uk',
  authorName: 'Ross Williams',
  authorOrganization: 'Universal Constructor',
  description:
    'Typescript type-preserving conversion of objects between camelCase and snake_case',
  entrypoint: 'lib/index.js',
  keywords: [
    'typescript',
    'conversion',
    'camelCase',
    'camel-case',
    'snake_case',
    'snake-case',
    'PascalCase',
    'pascal-case',
  ],
  packageManager: NodePackageManager.YARN,
  repository: 'https://github.com/RossWilliams/ts-case-convert.git',
  codeCov: true /* Define a GitHub workflow step for sending code coverage metrics to https://codecov.io/ Uses codecov/codecov-action@v1 A secret is required for private repos. Configured with @codeCovTokenSecret. */,
  codeCovTokenSecret: 'CODECOV_TOKEN',
  releaseToNpm: true,
  license: 'Apache-2.0',
  projectType: ProjectType.LIBRARY,
  tsconfig: {
    compilerOptions: {
      noUnusedLocals: false,
    },
  },
  jestOptions: {
    typescriptConfig: {
      compilerOptions: {
        noUnusedLocals: false,
      },
    },
  },
});

project.eslint.addRules({
  '@typescript-eslint/indent': 'off',
  'comma-dangle': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      vars: 'all',
      varsIgnorePattern: '^_',
      args: 'after-used',
      argsIgnorePattern: '^_',
    },
  ],
});

project.synth();
