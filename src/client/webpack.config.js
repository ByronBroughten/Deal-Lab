const HtmlWebpackPlugin = require("html-webpack-plugin"); //installed via npm
const webpack = require("webpack"); //to access built-in plugins
const path = require("path");
const ConfigWebpackPlugin = require("config-webpack");

module.exports = {
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
    new ConfigWebpackPlugin(),
    // new HtmlWebpackPlugin({ template: "./src/index.html" }),
    // new webpack.DefinePlugin({ CONFIG: JSON.stringify(require("config")) }),
  ],
};
