1/** @type {import('next').NextConfig} */
const { ESBuildMinifyPlugin } = require("esbuild-loader");
const Dotenv = require("dotenv-webpack");
const removeImports = require("next-remove-imports")({
  test: /node_modules([\s\S]*?)\.(tsx|ts|js|mjs|jsx)$/,
  matchImports: "\\.(less|css|scss|sass|styl)$"
});
const path = require("path");
require("dotenv").config({ path: path.join(process.cwd(), ".env") })

const IS_LOCAL = Boolean(process.env.IS_LOCAL === "yes");
const SERVER_PORT = Number(process.env.SERVER_PORT) || 5000;
const SERVER_URL = String(process.env.SERVER_URL) || "localhost"
const HOST_URL = IS_LOCAL ? `https://${SERVER_URL}:${SERVER_PORT}` : `https://${SERVER_URL}`;

const eslint = IS_LOCAL ? { dirs: ["./pages", "./src/client"] } : { ignoreDuringBuilds: true };
const typescript = IS_LOCAL ? { } : { ignoreBuildErrors: true };

module.exports = removeImports({
  swcMinify: true,
  reactStrictMode: false,
  // useFileSystemPublicRoutes: false,
  compiler: {
    // ssr: true,
    styledComponents: {
      ssr: true,
      fileName: true,
      displayName: true,
      pure: true
    },
  },
  typescript,
  eslint,
  // distDir: ".next",
  env: {
    HOST_URL: HOST_URL,
  },
  // image: {
  //   minimumCacheTTL: , //In seconds
  // },
  // async rewrites() {
  //   return [{
  //     source: "/api/:path*",
  //     destination: `${HOST_URL}/api/:path*`,
  //   },{
  //     source: "/img/:path*",
  //     destination: `${HOST_URL}/img/:path*`,
      
  //   }, {
  //     source: "/uploads/:path*",
  //     destination: `${HOST_URL}/uploads/:path*`,
  //   }, {
  //     source: "/css/:path*",
  //     destination: `${HOST_URL}/css/:path*`,
  //   }, {
  //     source: "/fonts/:path*",
  //     destination: `${HOST_URL}/fonts/:path*`,
  //   },{
  //     source: "/:path*",
  //     destination: `${HOST_URL}/:path*`,
  //   }];
  // },
  async headers() {
    return [
      {
        source: '/(.*).(jpg|png|jpeg)',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=31536000',
          },
        ],
      }
    ];
  },
  webpack: (config, { webpack, dev }) => {
    // if (!dev) {
      // console.log("@@@@", path.join(process.cwd(), './src/client/components'))
      config.resolve = {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
					'@components': path.join(process.cwd(), './src/client/components'),
					'@utils': path.join(process.cwd(), './src/client/utils'),
					'@context': path.join(process.cwd(), './src/client/context')
				},
      }
      config.plugins.push(
        new webpack.ProvidePlugin({
          React: "react"
        })
      );
      config.plugins.push(new Dotenv({ silent: true }));

      const convertToESBuild = (obj) => {
        if (obj.loader === "next-babel-loader") {
          return {
            loader: "esbuild-loader",
            options: {
              loader: "tsx",
              target: "es2020",
              tsconfigRaw: require("./tsconfig.json")
            }
          };
        }
        return obj;
      };
      config.module.rules.push({
        test: /node_modules\/@uiw([\s\S]*?)\.(tsx|ts|js|mjs|jsx)$/,
        loader: "babel-loader",
        options: {
          plugins: [
            [
              require.resolve('babel-plugin-transform-remove-imports', {
                paths: [process.cwd()]
              }), {
                test: "\\.(less|css|scss|sass|styl)$"
              }
            ]
          ]
        }
      });

      const rules = config.module.rules.reduce((acc, item) => 
        item.use && item.use.loader ? acc.concat(item) : acc
      , []);

      rules.forEach(rule => {
        if (Array.isArray(rule.use)) {
          rule.use = rule.use.map((e) => {
            if (typeof e === "object") {
              return convertToESBuild(e);
            }
            return e;
          });
        } else {
          rule.use = convertToESBuild(rule.use);
        }
      });

      // config.optimization.minimizer.shift();
      // config.optimization.minimizer.unshift(
      //   new ESBuildMinifyPlugin({
      //     target: "es2020",
      //     minify: true
      //   })
      // );
    // }
    return config;
  }
});
