const path = require("path");
const nodeExternals = require("webpack-node-externals");
const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CompressionPlugin = require("compression-webpack-plugin"); //

module.exports = {
  // Production Mode: Set Webpack mode to 'production' to enable built-in optimizations for production builds.
  mode: "production", // Set mode to 'development'
  entry: "./app.js", // Entry point of your Node.js application
  target: "node", // Bundle for Node.js environment
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    // Cache Busting: Use content hashing in your output filenames to ensure that browsers cache-bust when files change.
    // filename: '[name].[contenthash].js',
    filename: "[name].[contenthash].js", // Output file name
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply babel-loader for JavaScript files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  stats: {
    errorDetails: true, // Enable detailed error reporting
  },
  externals: [nodeExternals()],
  optimization: {
    // Minification: Use a minification plugin like terser-webpack-plugin to minify your JavaScript code and reduce its size.
    minimize: true,
    minimizer: [new TerserPlugin()],

    // Code Splitting: Split your code into smaller chunks to improve loading times, especially for large applications. You can use Webpack's SplitChunksPlugin to automatically split code into separate bundles based on certain criteria.
    splitChunks: {
      chunks: "all",
    },

    // Tree Shaking: Enable tree shaking to eliminate unused code from your bundle. This can significantly reduce the size of your bundle.
    usedExports: true,

    // Module Concatenation: Enable module concatenation to concatenate modules into a single module in scope hoisting mode, which can reduce bundle size and improve performance.
    concatenateModules: true,
  },

  // Bundle Analysis: Analyze your bundle to identify opportunities for further optimization. Tools like webpack-bundle-analyzer can help visualize your bundle and understand its composition.
  plugins: [
    new CompressionPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
};








// Your Webpack configuration looks comprehensive and includes several optimizations to improve the performance and build size of your Node.js application bundle. Here are a few observations and suggestions:

// 1. **Production Mode**: Setting the mode to "production" enables built-in optimizations provided by Webpack for production builds, which is good practice.

// 2. **Entry Point**: Ensure that the entry point (`app.js` in this case) is correctly pointing to the main file of your Node.js application.

// 3. **Output Configuration**: The output configuration looks fine, and enabling content hashing for cache busting is a good practice to ensure that browsers fetch updated files when they change.

// 4. **Module Rules**: The module rule for JavaScript files looks good, using Babel to transpile ES6+ syntax to ensure compatibility with older versions of Node.js.

// 5. **External Dependencies**: Using `webpack-node-externals` to exclude Node.js built-in modules and `node_modules` dependencies from being bundled is recommended for server-side applications.

// 6. **Optimization**: The optimization configuration includes several optimizations like minimization, code splitting, tree shaking, and module concatenation, which are all beneficial for reducing bundle size and improving performance.

// 7. **Bundle Analysis**: Including `webpack-bundle-analyzer` as a plugin allows you to analyze the bundle size and composition, which can help identify opportunities for further optimization.

// Overall, your Webpack configuration appears to be well-structured and optimized for production builds. Make sure to test the bundled application thoroughly to ensure that it functions correctly and efficiently. If you encounter any specific performance issues or further optimization opportunities, you can fine-tune your configuration accordingly.