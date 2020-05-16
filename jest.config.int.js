module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.plugin.json',
    },
  },
  preset: 'ts-jest',
  resetMocks: true,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
};
