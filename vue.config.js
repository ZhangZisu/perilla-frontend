const MonocoEditorPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  outputDir: undefined,
  baseUrl: '',
  assetsDir: 'assets',
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: false,
  css: {
    extract: false
  },

  configureWebpack: {
    plugins: [new MonocoEditorPlugin({
      output: 'assets'
    })],
    module: {
      rules: [
        {
          test: /\.w\.js$/,
          use: {
            loader: 'worker-loader'
          }
        }
      ]
    }
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },

  lintOnSave: undefined,

  pwa: {
    name: 'Perilla',
    themeColor: '#4A4A4A',
    msTileColor: '#4A90E2',
    workboxOptions: {
      runtimeCaching: [
        {
          urlPattern: /\/api\//,
          handler: 'networkFirst'
        }
      ]
    }
  }
}
