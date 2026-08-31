require('dotenv').config({ path: '.env.local' })

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!@react-pdf/renderer)'],
  testMatch: ['**/__tests__/**/*.test.ts'],
}
