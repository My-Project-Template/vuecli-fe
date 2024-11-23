const { defineConfig } = require('@vue/cli-service');
const path = require('path');

/** Add global style-resource for scss file */
const addStyleResource = rule => {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                // global fonts, mixins and scss functions
                path.resolve(__dirname, 'src/assets/styles/less/global.less'),
            ],
        });
};

const VUE_STYLE_USAGES = ['vue-modules', 'vue', 'normal-modules', 'normal'];

module.exports = defineConfig(() => {
    return {
        transpileDependencies: true,
        lintOnSave: 'error',
        devServer: {
            port: 1024,
            client: {
                overlay: {
                    warnings: false,
                },
            },
        },
        chainWebpack(config) {
            VUE_STYLE_USAGES.forEach(type => {
                addStyleResource(config.module.rule('less').oneOf(type));
            });
        },
    };
});
