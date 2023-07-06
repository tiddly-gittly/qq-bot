# 太微 QQ 群答疑机器人

QQ 群：946052860

使用了 [zhinjs](https://github.com/zhinjs/zhin) 这个可以用 TS 写机器人能力插件的框架。

详见[在手机上部署QQ机器人-林一二的wiki](https://onetwo.ren/wiki/#%E5%9C%A8%E6%89%8B%E6%9C%BA%E4%B8%8A%E9%83%A8%E7%BD%B2QQ%E6%9C%BA%E5%99%A8%E4%BA%BA)

## 添加新的 wiki

1. 将wiki拉取到本地后，用太记启动 wiki（当然你也可以自己想办法启动一个 nodejs wiki）
1. 为 wiki 安装搜索所需的插件 [$:/plugins/EvidentlyCube/ExtraOperators](https://evidentlycube.github.io/TW5-PluginShowcase/#Extra%20Operators)，可以从这个网站上直接拖动安装，对插件的使用详见 [plugins/tw-qa/src/filter.ts](./plugins/tw-qa/src/filter.ts)
1. 创建标题为 `$:/config/Server/AllowAllExternalFilters` 且内容为 `yes` 的条目（对于面向公众的服务器，一般不应进行此操作。但我们的wiki运行在内网里，只通过机器人对外暴露有限的访问方式，所以可以这样）
1. 建议在太记里，右键工作区图标，在工作区设置里打开只读模式（请提前装好插件，因为开了之后就没法在太记里装插件了）

## 注册签名服务

http://localhost:8080/register?uin=&android_id=&guid=1&qimei36=&key=114514