import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1,
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  forceExit: false,
  detectOpenHandles: true,
  testMatch: ['**/*.test.js', '**/*.test.cjs', '**/*.test.mjs', '**/*.test.ts'],
  transform: {
    '^.+\\.(ts|tsx|js|mjs)$': 'ts-jest',
    '^.+\\.(cjs)?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'cjs', 'mjs'],
  collectCoverageFrom: ['src/**/*.ts', '!tests', '!src/clone.ts'],
};

export default config;
