# Open JLPT

Open JLPT 是一个开源的日语能力测试（JLPT）学习和练习平台。该项目旨在帮助学习者准备 JLPT 考试，提供全面的学习资源和练习工具。

## 功能特点

- 多种练习模式：词汇、语法、阅读理解和听力
- 从 N5 到 N1 级别的全面内容覆盖
- 个性化学习计划和进度跟踪
- 响应式界面设计，支持多种设备

## 项目结构

该项目使用 monorepo 架构，由以下主要部分组成：

- `client`: 基于 Vue 3 和 Vite 的前端应用
- `server`: 使用 Elysia + Bun.js 构建的后端服务
- `models`: 共享数据模型
- `shared`: 客户端和服务器端共享的实用工具和功能

## 开始使用

### 前提条件

- Node.js (v18 或更高版本)
- PNPM (推荐使用 v8 或更高版本)

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/open-jlpt.git
cd open-jlpt

# 安装依赖
pnpm install
```

### 开发

```bash
# 启动开发服务器
pnpm -F @root/client dev

# 启动后端服务
pnpm -F @root/server dev
```

### 构建和部署

```bash
# 构建前端应用
pnpm -F @root/client build

# 构建后端应用
pnpm -F @root/server build
```

## 贡献指南

欢迎贡献！请通过提交 issue 或 pull request 来参与项目开发。

## 许可证

该项目采用 ISC 许可证。
