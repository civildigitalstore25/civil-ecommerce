#!/usr/bin/env bash
set -o errexit

# Force install devDependencies too
npm install --include=dev
npm run build
