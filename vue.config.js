const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/yourdays/'
    : '/',
  outputDir: 'dist'  // 确保输出目录设置正确
}