# 草莓先森的博客

Hexo 7 + Tessera，正文使用霞鹜文楷，代码使用 Monaco。

网站：https://math-dut.github.io/Blogs-For-My-Future/

## 本地预览

```sh
npm ci
npm run clean
npm run server
```

访问 `http://localhost:4000/Blogs-For-My-Future/`。左下角「Aa 字号」可以分别调节正文和代码字号，并自动保存在当前浏览器中。

## 发布文章

在 `source/_posts/` 中新增或编辑 Markdown，提交并推送到 `main`。GitHub Actions 会构建并发布到 GitHub Pages，进度可在仓库的 Actions 中查看。

主题文件以普通文件收录在 `themes/tessera/` 中，因此部署不依赖外部主题仓库的分支状态。

## 绑定自有域名

1. 注册域名后，在 GitHub 仓库 Settings → Pages → Custom domain 中保存域名。
2. 若使用 `blog.example.com`，添加 CNAME：`blog` → `math-dut.github.io`（不带仓库路径）。
3. 若使用根域名，按照 GitHub Pages 官方文档配置 A/AAAA 或 ALIAS 记录。
4. 等待 DNS 生效后启用 Enforce HTTPS，并重新运行本仓库的 Pages 工作流。

工作流根据 GitHub Pages 返回的地址生成发布配置，可自动适配仓库路径和自有域名。更换域名后，如需本地预览和手动构建也使用新地址，请同步修改 `_config.yml` 的 `url` 和 `root`。

GitHub 官方说明：https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
