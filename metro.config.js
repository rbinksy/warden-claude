const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, {
  // Enable CSS support
  isCSSEnabled: true,
});

// Add support for SVG files
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

// Enable support for SVG as React components
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// Configure for NativeWind
module.exports = withNativeWind(config, { input: './src/global.css' });