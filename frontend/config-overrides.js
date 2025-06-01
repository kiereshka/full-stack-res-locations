module.exports = function override(config) {
    // Modify Webpack configuration to ignore source maps for react-zoom-pan-pinch
    config.module.rules = config.module.rules.map(rule => {
        if (rule.loader && rule.loader.includes('source-map-loader')) {
            return {
                ...rule,
                exclude: [/node_modules\/react-zoom-pan-pinch/]
            };
        }
        return rule;
    });

    return config;
};