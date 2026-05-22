# Release

## Pre-release

fetch latest:

```sh
git fetch --tags
git tag --list 'v*' --sort=-version:refname | head -n 5
```

checks:

```sh
pnpm install
pnpm run check
```

## Commit

```sh
git commit -m "chore: x"
git commit -m "docs: x"
git commit -m "fix: x"
git commit -m "feat: x"
git commit -m "feat: x" -m "BREAKING CHANGE: x."
```

## Build

```sh
pnpm run release
```

Verify version:

```sh
cat dist/version.txt
cat dist/releasetag.txt
ls dist/js
```

verify tarball:

```sh
dist/js/ts-case-convert-$(cat dist/version.txt).tgz
```

## Publish

```sh
pnpm run publish --otp 123_456
```

## Confirm

```sh
npm view ts-case-convert version
```

## Tag and Push

```sh
pnpm run tag
```

```sh
git push origin main --follow-tags
```

## GitHub Release

```sh
pnpm run github-release
```

## Useful Commands

```sh
pnpm run compile
pnpm run lint
pnpm run test
pnpm run check
pnpm run build
pnpm run release
pnpm run publish --otp 123_456
pnpm run tag
pnpm run github-release
pnpm run upgrade
```
