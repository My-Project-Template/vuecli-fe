const { defineConfig } = require('@vue/cli-service');
const path = require('path');

/** Add global style-resource for scss file */
const addStyleResource = rule => {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                // global fonts, mixins and scss functions
                path.resolve(__dirname, 'src/assets/styles/scss/_global.scss'),
            ],
        });
};

module.exports = defineConfig(() => {
    return {
        transpileDependencies: true,
        lintOnSave: 'error',
        css: {
            loaderOptions: {
                scss: { sourceMap: true },
            },
        },
        chainWebpack(config) {
            ['vue-modules', 'vue', 'normal-modules', 'normal'].forEach(type => {
                addStyleResource(config.module.rule('scss').oneOf(type));
            });

            // add resolve-url-loader
            ['vue-modules', 'vue', 'normal-modules', 'normal'].forEach(rule => {
                config.module
                    .rule('scss')
                    .oneOf(rule)
                    .use('resolve-url-loader')
                    .loader('resolve-url-loader')
                    .before('sass-loader')
                    .end();
            });
        },
        devServer: {
            port: 1024,
        },
    };
});
