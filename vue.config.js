const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            transpileOnly: true
          },
          exclude: /node_modules/
            }
          ],
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/yourdays/'
    : '/',
  outputDir: 'dist'  // 确保输出目录设置正确
})