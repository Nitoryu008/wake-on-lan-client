export default {
  extends: ["stylelint-config-standard", "stylelint-config-recess-order"],
  plugins: ["stylelint-declaration-block-no-ignored-properties"],
  rules: {
    "plugin/declaration-block-no-ignored-properties": true,
  },
};
