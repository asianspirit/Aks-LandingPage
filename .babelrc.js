
  module.exports = {
    presets: [
        require("@babel/preset-env")
    ],
    plugins: [
      ["@babel/plugin-transform-modules-commonjs", {
        "allowTopLevelThis": true
      }]
    ]
};