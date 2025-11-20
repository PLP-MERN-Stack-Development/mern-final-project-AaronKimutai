/** @type {import('jest').Config} */
const config = {
    testMatch: ['<rootDir>/tests/*.test.js'],



    testEnvironment: 'node',

    modulePathIgnorePatterns: ['<rootDir>/node_modules'],

    bail: true,
};

module.exports = config;
