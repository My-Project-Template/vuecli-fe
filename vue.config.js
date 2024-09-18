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

const VUE_STYLE_USAGES = ['vue-modules', 'vue', 'normal-modules', 'normal'];

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
            // add resolve-url-loader
            VUE_STYLE_USAGES.forEach(rule => {
                config.module
                    .rule('scss')
                    .oneOf(rule)
                    .use('resolve-url-loader')
                    .loader('resolve-url-loader')
                    .before('sass-loader')
                    .end();
            });

            VUE_STYLE_USAGES.forEach(type => {
                addStyleResource(config.module.rule('scss').oneOf(type));
            });
        },
        devServer: {
            port: 1024,
        },
    };
});
