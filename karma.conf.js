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
            'sanitizer.js': ['coverage']
        },
        reporters: ['progress', 'coverage'],
        coverageReporter : {
            dir: 'coverage',
            reporters: [

                // reporters not supporting the `file` property
                { type: 'html', subdir: 'report-html' },
                { type: 'lcov', subdir: 'report-lcov' },
                // reporters supporting the `file` property, use `subdir` to directly
                // output them in the `dir` directory
                 { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
                { type: 'text', subdir: '.', file: 'text.txt' },
                { type: 'text-summary', subdir: '.', file: 'text-summary.txt' }
            ]
        }
    });
};