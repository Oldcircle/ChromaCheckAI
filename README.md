# ChromaCheck AI 🎨

**[English](#english) | [简体中文](#chinese)**

---

<div id="english"></div>

# ChromaCheck AI (English)

ChromaCheck AI is an intelligent color palette generator and code inspector built with React and Tailwind CSS. It leverages the power of Large Language Models (LLMs) to turn natural language descriptions into professional, cohesive color themes.

It supports multiple AI providers, allowing you to switch between **Google Gemini**, **OpenAI (GPT)**, and **DeepSeek**.

## ✨ Key Features

*   **Multi-Model Support**: Seamlessly switch between Gemini, GPT-4, DeepSeek, or other OpenAI-compatible APIs.
*   **Smart Generation**: Generate palettes from abstract concepts (e.g., "Cyberpunk Neon", "Rainy Forest").
*   **Advanced Inspector**:
    *   View Hex, RGB, HSL, and CMYK codes.
    *   Automatically generate 12-step tints and shades for every color.
    *   One-click copy.
*   **Customization**: Adjust the number of colors generated (2-12).
*   **Modern UI**: Fully responsive design with dark/light mode support (via system) and smooth animations.

## 🛠 Tech Stack

*   **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React
*   **AI Integration**: @google/genai SDK, Standard Fetch API

## 🚀 Quick Start

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/chromacheck-ai.git
    cd chromacheck-ai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure API (See below)**
    Create a `.env` file in the root directory.

4.  **Run the application**
    ```bash
    npm start
    ```

## ⚙️ Configuration (AI Models)

You can switch AI providers by modifying the `.env` file.

### 1. Using Google Gemini (Default)
Recommended for speed and free tier availability.

```env
API_PROVIDER=gemini
API_KEY=your_gemini_api_key_here
# Optional: gemini-2.5-flash (default), gemini-1.5-pro, etc.
API_MODEL=gemini-2.5-flash
```

### 2. Using DeepSeek
DeepSeek offers great performance at a lower cost and is fully compatible with OpenAI structure.

```env
API_PROVIDER=deepseek
API_KEY=your_deepseek_api_key_here
API_BASE_URL=https://api.deepseek.com
API_MODEL=deepseek-chat
```

### 3. Using OpenAI
Standard setup for GPT-4o or GPT-3.5.

```env
API_PROVIDER=openai
API_KEY=your_openai_api_key_here
API_MODEL=gpt-4o
```

### 4. Using Custom / Local LLM
If you are running a local model (like Ollama or LM Studio) compatible with OpenAI API:

```env
API_PROVIDER=custom
API_KEY=any_string
API_BASE_URL=http://localhost:1234/v1
API_MODEL=llama-3-local
```

---

<div id="chinese"></div>

# ChromaCheck AI (简体中文)

ChromaCheck AI 是一个基于 React 和 Tailwind CSS 构建的智能调色盘生成与色彩检视工具。它利用大语言模型（LLM）的能力，将你的自然语言描述瞬间转化为专业的配色方案。

本项目不仅支持 **Google Gemini**，还全面支持 **OpenAI (GPT)** 和 **DeepSeek** 等模型。

## ✨ 主要功能

*   **多模型支持**：自由切换 Gemini, GPT-4, DeepSeek 或其他兼容 OpenAI 接口的模型。
*   **智能生成**：通过描述生成配色（例如：“赛博朋克霓虹”、“雨后森林”、“极简主义咖啡馆”）。
*   **专业色彩检视**：
    *   查看并复制 HEX, RGB, HSL, CMYK 格式代码。
    *   自动生成当前颜色的 12 级明暗色阶（Tints & Shades）。
    *   一键复制色值。
*   **高度定制**：支持自定义生成颜色的数量（2-12 种）。
*   **现代化 UI**：基于 Tailwind CSS 构建的响应式界面，拥有流畅的动画效果。

## 🛠 技术栈

*   **前端框架**: React 19, TypeScript
*   **样式库**: Tailwind CSS, Lucide React (图标)
*   **AI 集成**: @google/genai SDK, Fetch API

## 🚀 快速开始

1.  **克隆项目**
    ```bash
    git clone https://github.com/your-username/chromacheck-ai.git
    cd chromacheck-ai
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **配置 API (见下文)**
    在项目根目录下创建一个 `.env` 文件。

4.  **启动项目**
    ```bash
    npm start
    ```

## ⚙️ 模型与 API 配置

通过修改 `.env` 文件中的环境变量，你可以轻松切换 AI 服务商。

### 1. 使用 Google Gemini (默认推荐)
Gemini 2.5 Flash 速度快且通常有免费额度。

```env
API_PROVIDER=gemini
API_KEY=你的_GEMINI_API_KEY
# 可选模型: gemini-2.5-flash (默认), gemini-1.5-pro
API_MODEL=gemini-2.5-flash
```

### 2. 使用 DeepSeek (深度求索)
DeepSeek 性价比极高，且完全兼容 OpenAI 接口格式。

```env
API_PROVIDER=deepseek
API_KEY=你的_DEEPSEEK_API_KEY
API_BASE_URL=https://api.deepseek.com
API_MODEL=deepseek-chat
```

### 3. 使用 OpenAI (GPT 系列)
使用官方 GPT-4o 或 GPT-3.5 Turbo。

```env
API_PROVIDER=openai
API_KEY=你的_OPENAI_API_KEY
API_MODEL=gpt-4o
```

### 4. 使用自定义 / 本地模型
如果你使用 LM Studio、Ollama 等本地部署的模型，或者其他中转 API：

```env
API_PROVIDER=custom
API_KEY=任意字符串
API_BASE_URL=http://localhost:1234/v1
API_MODEL=llama-3-local
```

## 📄 License

MIT License
