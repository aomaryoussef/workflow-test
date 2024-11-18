module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 30000, // Adjust as needed
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>/tests'],
  testRegex: '.*\\.spec\\.ts$',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};
