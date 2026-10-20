# DSH 天空窗

[简体中文](./README.md) · [English](./README.en.md)

给长时间对着屏幕工作的人，一扇会流动的天空。

这是一个运行在真实 DeepSeek Harness（DSH）工作区里的换肤插件：太阳按当地时间沿半圆轨迹移动，天空从晨光、晴空、暮光过渡到月色与星光，云朵和 DeepSeek 标志云彩会缓慢漂浮。

**工作时，天空留在身后。** 原生工作区、对话和输入框照常使用。

[![天空窗在真实 DSH 工作区中的效果](./dsh-sky-window/docs/images/02-workspace-skin.png)](./dsh-sky-window/docs/images/02-workspace-skin.png)

**把天空调成喜欢的样子。** 选择城市、预览日出日落、调整天空浓度与云朵动效。

[![天空设置与时间预览](./dsh-sky-window/docs/images/03-sky-settings.png)](./dsh-sky-window/docs/images/03-sky-settings.png)

两张截图均直接引用 PNG 原图，点击可查看原始尺寸。

![晨光、晴空、暮光与夜色四宫格](./dsh-sky-window/docs/images/00-day-in-four-scenes.png)

![从早到晚的天空窗演示](./dsh-sky-window/docs/media/sky-from-morning-to-night.gif)

## 已有 DSH：安装插件

推荐从 [npm](https://www.npmjs.com/package/dsh-sky-window) 按包名安装，无需下载源码或自行构建：

```powershell
dsh plugin --profile web add dsh-sky-window
```

npm `0.1.1` 已通过独立 Profile 的官方安装与实际加载检查；运行文件及 DSH 加载声明与此前完整验收的 `0.1.0` 一致，可复用其功能验收结果。

也可以从 [v0.1.0 发布页](https://github.com/nickfast2025/dsh-sky-window/releases/tag/v0.1.0)下载 `dsh-sky-window-0.1.0.tgz`，在下载目录打开 PowerShell：

```powershell
dsh plugin --profile web add .\dsh-sky-window-0.1.0.tgz
```

`web` 是示例 Profile 名称。安装后按原来的启动命令重启该 DSH，在 DSH 设置中启用天空窗。继续使用原有模型配置、聊天记录、地址和端口。详细步骤及卸载方法见[插件说明](./dsh-sky-window/README.md#安装到已有-profile)。

## 独立体验（Windows Web）

安装 Node.js 22 或更高版本，从 GitHub 的 **Code → Download ZIP** 下载并解压本仓库，在包含本 README 的目录打开 PowerShell。

首次使用 DSH 时安装推荐版本；已有 DSH 的用户可跳过安装命令，先检查版本：

```powershell
node --version
npm install --global @deepseek-ai/dsh@0.2.1-rc.2
dsh --version
```

启动天空窗：

```powershell
.\start-dsh-sky.ps1
```

浏览器通常会自动打开。若需手动打开，请使用终端中 **DSH 打印的完整认证链接**；只输入 `http://127.0.0.1:3081` 可能会显示需要认证。该链接含临时登录令牌，请勿公开。

脚本会在解压后的项目文件夹内自动创建 `.runtime/dsh-home`，保存这套环境的设置和聊天记录。首次在 DSH 网页设置中填写自己的 API Key 并选择模型，保存后下次启动会继续使用。已有 DSH 的用户也可以选择上面的插件安装方式，沿用现有配置。

点击侧栏「工作区」旁的添加按钮，可浏览目录、新建文件夹并加入工作区。端口冲突时可运行 `.\start-dsh-sky.ps1 -Port 3085`；在终端按 Ctrl+C 停止服务。

插件的完整说明、截图和 MP4 演示在 [dsh-sky-window/README.md](./dsh-sky-window/README.md)。

已有 DSH、只想安装插件时，按[打包安装步骤](./dsh-sky-window/README.md#安装到已有-profile)操作。安装后继续使用原来的 DSH 启动命令、地址和端口；天空窗插件不会另开一个服务，也不要求使用 `3081`。

## 验证

```powershell
cd .\dsh-sky-window
npm test
npm pack --dry-run
```

插件源码只使用 Node 内置模块，不需要额外运行 `npm install`。GitHub Actions 配置覆盖 Node 22 / 24 的构建、测试与打包检查；真实 DSH 界面兼容结果见下表。

## 兼容性

**推荐版本：**新安装优先选择 DSH `0.2.1-rc.2`；已有 `0.1.1-rc.2` 环境的用户可以继续使用。天空窗不绑定单一 DSH 版本，其余五个 RC 版本也已有天空界面的运行记录。部分版本在测试中需要处理依赖或 Profile 配置，详见下表。

表中的「调整后」是测试时确实做过的处理；各版本的原样安装状态以对应记录为准。

| DSH 版本 | 天空窗与对话 | 安装或配置记录 |
| --- | --- | --- |
| `0.1.1-rc.1` | 调整后天空界面运行；隔离模型对话收到回复 | DSH 默认安装曾因 Cordis 混版而无法启动；固定配套依赖后运行。测试插件副本曾调整版本声明 |
| `0.1.1-rc.2` | 现用开发基线；天空窗持续运行 | 本轮尚未把去锁后的发布包放进全新 Profile 做完整验收 |
| `0.1.2-rc.1` | 调整后天空界面运行；本轮隔离模型对话待测 | 测试插件副本的版本声明与 Profile 配置曾调整 |
| `0.1.5-rc.3` | 隔离天空界面运行；隔离模型对话收到回复 | 直接运行沙箱 CLI，未完成官方插件安装命令的原样验收 |
| `0.1.7-rc.2` | 补依赖后天空界面运行；隔离模型对话收到回复 | 沙箱补装缺失的 Windows 原生依赖；测试插件副本曾调整版本声明 |
| `0.2.0-rc.2` | 调整后天空界面运行；隔离模型对话收到回复 | 测试插件副本的版本声明与 Profile 配置曾调整；去锁发布包的原样安装待测 |
| `0.2.1-rc.2` | 正式 0.1.0 包独立安装后，预览、一天播放、暂停壁纸、恢复实时、设置保存、停用恢复主题及真实模型对话通过 | 官方插件安装、卸载均通过，无需版本豁免；新版对话阅读背景适配已包含。另已验证干净副本的 Windows 启动器及新建工作区 |

上述结果来自 Windows Web 环境。去掉版本锁后，DSH 不再因为写死的版本号拒绝天空窗；某版本是否能顺利安装并完整使用，仍以该版本的实测结果为准。

## 来源与反馈

这是社区项目。DeepSeek 标志来源记录在[素材说明](./dsh-sky-window/src/deepseek-mark.source.md)，标志相关权利归其所有者。项目代码采用 [MIT](./LICENSE) 许可证。

问题反馈请附 DSH 版本、系统、安装方式和复现步骤；功能变更见 [CHANGELOG](./CHANGELOG.md)。
