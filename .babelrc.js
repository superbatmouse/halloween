module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          "targets": ">0.25%"
        },
        useBuiltIns: "entry"
      }
    ]
  ],
  plugins: [
    "@babel/transform-async-to-generator",
    "@babel/transform-arrow-functions",
    "@babel/transform-modules-commonjs"
  ],
  env: {
    development: {},
    test: {},
    production: {}
  }
};
