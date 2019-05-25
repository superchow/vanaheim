module.exports = {
  extends: [
    "@diamondyuan/react-typescript",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react"
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error"
  },
  settings: {
    react: {
      version: require("./packages/vanaheim-website/package.json").dependencies
        .react
    }
  }
};
