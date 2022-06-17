const HtmlWebpackPlugin = require("html-webpack-plugin"); //installed via npm
const webpack = require("webpack"); //to access built-in plugins
const path = require("path");
const ConfigWebpackPlugin = require("config-webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CaseSensitivePathsWebpackPlugin = require("case-sensitive-paths-webpack-plugin");

module.exports = {
  // stats: { modules: false },
  // resolve: {
  //   extensions: ['.js', '.jsx', '.ts', '.tsx', '.css']
  // },
  entry: "./src/index.js",
  output: {
    filename: "webpack.bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
      },
    ],
  },
  plugins: [
    new CaseSensitivePathsWebpackPlugin(),
    new ConfigWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        memoryLimit: 4096,
      },
    }),
    // new HtmlWebpackPlugin({ template: "./src/index.html" }),
    // new webpack.DefinePlugin({ CONFIG: JSON.stringify(require("config")) }),
  ],
};
