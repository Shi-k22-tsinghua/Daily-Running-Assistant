// jest.config.js
module.exports = {
  // Your existing settings
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.js'],
  testTimeout: 30000,
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
  
  // Coverage settings
  collectCoverage: true,
  coverageReporters: [
    ["text", { skipFull: false }],
    "html",
    "lcov",
    "text-summary"
  ],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "controllers/**/*.js",
    "routes/**/*.js",
    "models/**/*.js",
    "!**/node_modules/**",
    "!**/vendor/**"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};