const { readFileSync, writeFileSync } = require('fs');

const packageJsonPath = 'package.json';
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
packageJson.version = '0.0.0';
writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
