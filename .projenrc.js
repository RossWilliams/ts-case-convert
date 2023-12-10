const { javascript, typescript, ProjectType } = require('projen');

const project = new typescript.TypeScriptProject({
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
  packageManager: javascript.NodePackageManager.YARN_CLASSIC,
  repository: 'https://github.com/RossWilliams/ts-case-convert.git',
  codeCov: true,
  codeCovTokenSecret: 'CODECOV_TOKEN',
  releaseToNpm: true,
  license: 'Apache-2.0',
  projectType: ProjectType.LIBRARY,
  tsconfig: {
    compilerOptions: {
      noUnusedLocals: false,
      types: [],
    },
  },
  tsconfigDev: {
    compilerOptions: {
      noUnusedLocals: false,
      types: ['jest', 'node'],
    },
  },
  jestOptions: {
    configFilePath: 'jest.config.json',
  },
  gitignore: ['.cache_ggshield'],
});

project.eslint.addRules({
  '@typescript-eslint/ban-types': 'off',
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
