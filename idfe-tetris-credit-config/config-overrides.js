const {
  override,
  addWebpackAlias,
  addDecoratorsLegacy,
  addLessLoader,
  fixBabelImports
} = require('customize-cra');
const path = require('path')

module.exports = override(
  addWebpackAlias({
    "@": path.resolve(__dirname, 'src'),
    "@components": path.resolve(__dirname, 'src/components'),
    "@api": path.resolve(__dirname, 'src/api'),
    "@images": path.resolve(__dirname, 'src/images'),
    "@utils": path.resolve(__dirname, 'src/utils')
  }),
  addDecoratorsLegacy(),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  addLessLoader()
);
