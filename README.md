### Qbot 简介

Qbot 是我基于 [go-cqhttp](https://github.com/Mrs4s/go-cqhttp) 和 [koishi](https://github.com/koishijs/koishi) 两个优秀工具写的**娱乐 QQ 机器人**

### 特色

- 聊天（使用腾讯 [AI](https://ai.qq.com/) 接口）
- 机器翻译，同时支持图片翻译（使用腾讯 [AI](https://ai.qq.com/) 接口）
- 发送悦目的图片（涩图）
- 帮你翻译听不懂的拼音简写

help：
```bash
当前可用的指令有：
    help  显示帮助信息
    涩图  发送悦目的图片
    翻译  语言机器翻译，同时支持图片翻译
    说人话  帮你翻译看不懂的拼音简写
输入“帮助 指令名”查看特定指令的语法和使用示例。
```

### 食用

1. 初始化项目
    ```bash
    git clone https://github.com/beetcb/qbot.git
    cd qbot
    npm i
    ```
   下载对应操作系统的 go-cqhttp [binary](https://github.com/Mrs4s/go-cqhttp/releases/tag/v1.0.0-beta3) 为 `build/go-cqhttp`
   
   在 `build/config.yml` 和 `src/index.ts` 里配置好机器人 QQ 号
  


2. 配置环境变量
    
    在 qbot 根目录创建 `.env` 文件：
    
    ```bash
    app_id = 腾讯AI应用ID
    app_key = 腾云AI应用KEY
    api_endpoint = https://api.ai.qq.com/fcgi-bin/nlp/nlp_textchat
    trans_api_endpoint = https://api.ai.qq.com/fcgi-bin/nlp/nlp_texttranslate
    trans_img_api_endpoint = https://api.ai.qq.com/fcgi-bin/nlp/nlp_imagetranslate
    se_api_key = 涩图API KEY
    se_api_endpoint = https://api.lolicon.app/setu/
    ```
3. 登录运行机器人
    ```bash
    npm run build
    npm run bot
    ```
