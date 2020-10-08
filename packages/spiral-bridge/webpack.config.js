const baseConfig = require('../../webpack/config');

const config = {
    ...baseConfig,

    entry: {
        'writeaway-spiral': ['./src/index.ts'],
    },

    output: {
        ...baseConfig.output,
        libraryExport: 'default',
        library: {
            amd: '@writeaway/spiral',
            commonjs: '@writeaway/spiral',
            root: 'WriteAwaySpiral',
        },
    },

    resolve: {
        ...baseConfig.resolve,
        modules: ['node_modules', 'src'],
    }
};

module.exports = config;
