# DSH 天空窗

[简体中文](./README.md) · [English](./README.en.md)

给长时间对着屏幕工作的人，一扇会流动的天空。

这是一个运行在真实 DeepSeek Harness（DSH）工作区里的换肤插件：太阳按当地时间沿半圆轨迹移动，天空从晨光、晴空、暮光过渡到月色与星光，云朵和 DeepSeek 标志云彩会缓慢漂浮。

![晨光、晴空、暮光与夜色四宫格](./dsh-sky-window/docs/images/00-day-in-four-scenes.png)

![从早到晚的天空窗演示](./dsh-sky-window/docs/media/sky-from-morning-to-night.gif)

## 快速开始（Windows Web）

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

此启动方式使用项目内 `.runtime/dsh-home` 作为独立配置目录，首次需在 DSH 原生设置中配置模型。点击侧栏「工作区」旁的添加按钮，可浏览目录、新建文件夹并加入工作区。端口冲突时可运行 `.\start-dsh-sky.ps1 -Port 3085`；在终端按 Ctrl+C 停止服务。

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
