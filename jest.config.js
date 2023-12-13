/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1 // Forces tests to run sequentially instead of in parallel. Issue: https://github.com/EdgePi-Cloud/edgepi-rpc-client-js/issues/46
}
