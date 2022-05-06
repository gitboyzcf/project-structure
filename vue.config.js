const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);
/*=============================================
=          基础路径 注意发布之前要先修改这里       =
=============================================*/
const publicPath = process.env.VUE_APP_PUBLIC_PATH || "";

module.exports = {
  publicPath,
  lintOnSave: true,
  outputDir: "emergency-command",
  chainWebpack: (config) => {
    // ====================================================== //
    // ===================== 重新设置 alias ===================== //
    // ====================================================== //
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@api", resolve("src/api"))
      .set("@components", resolve("src/components"))
      .set("@common", resolve("src/common"))
      .set("@plugin", resolve("src/plugin"))
      .set("@views", resolve("src/views"));

  }
};
