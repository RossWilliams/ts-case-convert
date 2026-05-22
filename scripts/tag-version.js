const { execFileSync } = require('child_process');
const { readFileSync } = require('fs');

const releaseTag = readFileSync('dist/releasetag.txt', 'utf8').trim();

if (!releaseTag) {
  throw new Error('dist/releasetag.txt is empty');
}

execFileSync('git', ['tag', releaseTag, '-a', '-F', 'dist/changelog.md'], {
  stdio: 'inherit',
});
