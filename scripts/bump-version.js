const { execFileSync, execSync } = require('child_process');
const { mkdirSync, readFileSync, writeFileSync } = require('fs');

function exec(command) {
  return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
}

const packageJsonPath = 'package.json';
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const latestTag = exec('git tag -l "v[0-9]*" --sort=-version:refname | head -n 1');
const latestVersion = latestTag.replace(/^v/, '') || packageJson.version;

mkdirSync('dist', { recursive: true });
packageJson.version = latestVersion;
writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

execFileSync(
  'pnpm',
  [
    'exec',
    'standard-version',
    '--skip.tag',
    '--skip.commit',
    '--infile',
    'dist/changelog.md',
    '--header',
    '',
    '--packageFiles',
    packageJsonPath,
    '--bumpFiles',
    packageJsonPath,
  ],
  { stdio: 'inherit' },
);

const nextVersion = JSON.parse(readFileSync(packageJsonPath, 'utf8')).version;
writeFileSync('dist/version.txt', `${nextVersion}\n`);
writeFileSync('dist/releasetag.txt', `v${nextVersion}\n`);
