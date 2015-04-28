// karma.conf.js
module.exports = function (config) {

    config.set({
        frameworks: ['mocha','chai'],
        browsers: ['PhantomJS'],
        files: [
            'test/**.js',
            '*.js'
        ],
        preprocessors : {
            '*.js': 'coverage'
        },
        reporters: ['progress', 'coverage'],
        coverageReporter : {
            type : 'lcov',
            dir : 'coverage'
        }
    });
};