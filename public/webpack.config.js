const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  entry: {
    app: "./public/index.js",
  },
  output: {
    path: __dirname + "/public/dist",
    filename: "[name].bundle.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
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
  plugins: [
    new WebpackPwaManifest({
      name: "Budget app",
      short_name: "Budget",
      description:
        "An application that allows you to work with travel budgets.",
      background_color: "#01579b",
      theme_color: "#ffffff",
      "theme-color": "#ffffff",
      start_url: "/",
      icons: [
        {
          src: path.resolve(
            "/icons/icon-192x192.png",
            "/icons/icon-512x512.png"
          ),
          sizes: [96, 128, 192, 256, 384, 512],
          destination: path.join("icons"),
        },
      ],
      fingerprints: false,
      inject: false,
    }),
  ],
};

module.exports = config;
