module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/config/*.js',
        '!src/models/index.js'
    ],
    coveragePathIgnorePatterns: ['/node_modules/'],
    testTimeout: 10000,
    verbose: true
};
