const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration optimized for Hermes
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    // Hermes bytecode optimization
    hermesCommand: 'hermesc',
    minifierPath: 'metro-minify-terser',
    minifierConfig: {
      // Optimize for Hermes engine
      ecma: 8,
      keep_classnames: false,
      keep_fnames: false,
      module: true,
      mangle: {
        module: true,
        toplevel: false,
      },
      compress: {
        // Optimizations compatible with Hermes
        comparisons: true,
        inline: 2,
        reduce_funcs: false,
        ecma: 2015,
        passes: 2,
      },
      output: {
        comments: false,
        ascii_only: true,
      },
    },
  },
  serializer: {
    // Enable bytecode generation for better startup performance
    customSerializer: null,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
