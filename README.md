# MineCraft Bot Assistant

一个基于 mineflayer + AI 的 Minecraft 机器人通用框架，提供 Web 控制面板。

## 功能特性

- **机器人控制**: 通过 Web UI 连接和控制 Minecraft 机器人
- **AI 对话**: 集成 OpenAI API，支持智能对话
- **指令系统**: 支持 `!help`, `!come`, `!follow`, `!stop`, `!pos`, `!ask` 等指令
- **模式切换**: AI 视角、巡逻模式、自动喊话
- **定时器**: 支持定时重启
- **实时日志**: WebSocket 实时推送日志

## 快速开始 (Docker)

### 前置要求

- Docker
- Docker Compose

### 启动

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**或手动执行:**
```bash
docker compose up -d --build
```

### 访问

打开浏览器访问: http://localhost:3000

## 配置

### 环境变量

复制 `.env.example` 为 `.env` 并配置:

```env
# OpenAI API 配置 (可选，也可以在 Web UI 中设置)
OPENAI_API_KEY=sk-your-api-key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo

# 服务器端口
PORT=3000
```

### Web UI 配置

在控制面板中可以配置:

1. **服务器连接**: Minecraft 服务器地址、端口、用户名
2. **AI 配置**: API Key、Base URL、模型、系统提示词
3. **模式控制**: AI 视角、巡逻、自动喊话
4. **定时器**: 定时重启

## 游戏内指令

在 Minecraft 游戏中对机器人发送消息:

| 指令 | 说明 |
|------|------|
| `!help` | 显示帮助信息 |
| `!come` | 让机器人走向你 |
| `!follow` | 让机器人跟随你 |
| `!stop` | 停止移动 |
| `!pos` | 显示机器人位置 |
| `!ask [问题]` | 向 AI 提问 |

## 本地开发

### 前端开发

```bash
npm install
npm run dev
```

### 后端开发

```bash
cd server
npm install
npm run dev
```

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- TanStack Query

### 后端
- Node.js
- Express
- WebSocket
- mineflayer
- OpenAI API

## 项目结构

```
minebot-assistant/
├── src/                    # 前端源码
│   ├── components/         # React 组件
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具函数和 API
│   └── pages/              # 页面组件
├── server/                 # 后端源码
│   ├── bot/                # 机器人逻辑
│   ├── services/           # 服务层
│   └── data/               # 配置数据
├── Dockerfile              # Docker 构建文件
├── docker-compose.yml      # Docker Compose 配置
└── start.sh / start.bat    # 启动脚本
```

## License

MIT
