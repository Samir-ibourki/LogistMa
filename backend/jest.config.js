// jest.config.js
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    // Bach Jest y9ra imports li fihom ".js" f ts files
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  globals: {},
};
