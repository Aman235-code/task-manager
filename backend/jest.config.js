/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/src/tests/**/*.test.ts", "**/src/modules/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
