const { defineConfig } = require('@vue/cli-service');
const path = require('path');

const isProduction = process.env?.NODE_ENV === 'production';
/** New babel loader path */
const newBabelLoaderPath = path.resolve(__dirname, 'node_modules/babel-loader/lib/index.js');
/** Vue style chain config items */
const VUE_STYLE_ONE_OF = ['vue-modules', 'vue', 'normal-modules', 'normal'];
/** Default title of the project */
const DEFAULT_TITLE = 'Vue Project';

/** Get sass loader options */
function getSassLoaderOptions(conf = {}) {
    const { sourceMap = !isProduction, api = 'legacy' } = conf;

    let outputStyle = 'expanded';
    if (isProduction) {
        outputStyle = 'compressed';
    }

    const result = {
        ...conf,
        sourceMap,
        api,
        sassOptions: {
            outputStyle,
        },
    };
    return result;
}

/** Add global style-resource for scss file */
function addStyleResource(rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                // global fonts, mixins and scss functions
                path.resolve(__dirname, 'src/assets/_global.scss'),
            ],
        });
}

module.exports = defineConfig(() => {
    return {
        transpileDependencies: isProduction,
        lintOnSave: 'error',
        devServer: {
            port: 1024,
            client: {
                overlay: {
                    warnings: false,
                },
            },
        },
        css: {
            loaderOptions: {
                sass: getSassLoaderOptions({ api: 'modern' }),
            },
        },
        chainWebpack(config) {
            // add resolve-url-loader for scss
            VUE_STYLE_ONE_OF.forEach(rule => {
                config.module
                    .rule('scss')
                    .oneOf(rule)
                    .use('resolve-url-loader')
                    .loader('resolve-url-loader')
                    .before('sass-loader')
                    .end()
                    .use('sass-loader')
                    .tap(opts => ({
                        ...opts,
                        sourceMap: true,
                    }));
            });

            VUE_STYLE_ONE_OF.forEach(type => {
                addStyleResource(config.module.rule('scss').oneOf(type));
            });

            // Configure the default title of the project.
            config
                .plugin('html')
                .tap(args => {
                    const [htmlPluginDefaultConfiguration, ...rest] = args;
                    return [
                        {
                            ...htmlPluginDefaultConfiguration,
                            title: DEFAULT_TITLE,
                        },
                    ].concat(rest);
                })
                .end()
                .module.rule('js')
                .use('babel-loader')
                .loader(newBabelLoaderPath)
                .end()
                .end()
                .rule('ts')
                .use('babel-loader')
                .loader(newBabelLoaderPath)
                .end()
                .end()
                .rule('tsx')
                .use('babel-loader')
                .loader(newBabelLoaderPath)
                .end()
                .end()
                .end();
        },
    };
});
