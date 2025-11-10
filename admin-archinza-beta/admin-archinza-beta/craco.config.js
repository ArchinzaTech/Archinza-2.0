const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // modifyVars: {
            //   "@primary-color": "#ee2c3c",
            //   "@error-color": "#ee2c3c",
            // },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  devServer: {
    port: 3001
  }

};
