const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
// const OfflinePlugin = require("offline-plugin");
// const WorkboxPlugin = require('workbox-webpack-plugin');
const Dotenv = require("dotenv-webpack");
const CopyPlugin = require("copy-webpack-plugin");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(process.cwd(), ".env") });
const devMode = process.env.NODE_ENV !== "production";

module.exports = [
  {
    mode: devMode ? "development" : "production",
    entry: "./src/client/index.tsx",
    output: {
      path: path.resolve(__dirname, "build/client"),
      filename: "index.js",
      chunkFilename: (pathData) => {
        const name = pathData.chunk.id;
        if (devMode) {
          if (`${name}` === "main") return "[name].js";
          else if (`${name}`.indexOf("src_client") !== -1) {
            if (`${name}`.indexOf("_components_") !== -1) return "components/[chunkhash].js";
            else if (`${name}`.indexOf("_pages_") !== -1) return "pages/[chunkhash].js";
          } else if (`${name}`.indexOf("vendors") !== -1) return "vendors/[chunkhash].js";
          return "etc/[chunkhash].js";
        } else {
          return "[chunkhash].js";
        }
      }
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "@components": path.resolve(__dirname, "./src/client/components"),
        "@utils": path.resolve(__dirname, "./src/client/utils"),
        "@context": path.resolve(__dirname, "./src/client/context")
      },
      fallback: {
        buffer: require.resolve("buffer")
      }
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"],
                plugins: ["@babel/plugin-transform-runtime"],
                cacheDirectory: true
              }
            },
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
          // exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"]
          // exclude: /node_modules/
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: "file-loader"
            }
          ]
        },
        {
          test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
          use: [
            {
              loader: "url-loader?limit=30000&name=[name]-[hash].[ext]"
            }
          ]
        }
      ]
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "public/index.html"
      }),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "css/[name].css",
        chunkFilename: "css/[chunkhash].css"
      }),
      new Dotenv(),
      new CopyPlugin({
        patterns: [
          { from: "public/css", to: "css" },
          { from: "public/fonts", to: "fonts" }
        ]
      }),
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"]
      }),
      new webpack.ProvidePlugin({
        process: "process/browser"
      })
    ],
    devtool: "inline-source-map",
    // devServer: {
    //   static: path.join(__dirname, "./build/client"),
    //   host: "localhost",
    //   port: parseInt(process.env.SERVER_PORT) + 1 || 5001,
    //   open: true,
    //   historyApiFallback: true,
    //   proxy: {
    //     "/api": `http://192.168.0.166:${process.env.SERVER_PORT}`,
    //     "/img": `http://192.168.0.166:${process.env.SERVER_PORT}`,
    //     "/uploads": `http://192.168.0.166:${process.env.SERVER_PORT}`
    //   }
    // }
  }
];
