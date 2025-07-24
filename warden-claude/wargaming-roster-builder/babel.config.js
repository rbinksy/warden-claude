module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo'
    ],
    plugins: [
      // Required for React Native Reanimated
      'react-native-reanimated/plugin',
      
      // NativeWind
      'nativewind/babel',
      
      // Expo Router
      require.resolve('expo-router/babel'),
      
      // React Native SVG
      [
        'react-native-svg-transformer',
        {
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    inlineStyles: {
                      onlyMatchedOnce: false,
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    ],
  };
};