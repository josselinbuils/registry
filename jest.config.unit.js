module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.client.json',
    },
  },
  preset: 'ts-jest',
  resetMocks: true,
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.ts'],
};
