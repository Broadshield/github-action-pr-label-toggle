#!/usr/bin/env bash
git pull
git fetch --tags
git push --tags
git push

bump="${1:-patch}"
yarn version -i "${bump}"
yarntag="$(jq -r '.version' package.json)"
newtag="v${yarntag}"

yarn build
git add package.json yarn.lock .yarn
git commit -m "chore(release): bump version to ${newtag}" --no-verify

stub_major="${newtag%%\.*}"
stub_major_minor="${newtag%\.*}"
git tag -d "${stub_major}" 2>/dev/null || true
git tag -d "${stub_major_minor}" 2>/dev/null || true
git tag -a "${stub_major}" -m "Release ${newtag}"
git tag -a "${stub_major_minor}" -m "Release ${newtag}"
git tag -a "${newtag}" -m "Release ${newtag}"
yarn postversion

