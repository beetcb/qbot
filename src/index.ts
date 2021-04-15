import { App } from 'koishi'
import { talkBot } from './plugin/talk'
import { transPinyin } from './plugin/transPinyin'

require('koishi-adapter-onebot')

const config = {
  type: 'onebot:http',
  port: '5701',
  server: 'http://localhost:5700',
}

const app = new App(config as any)

// 注册插件，作用相当于上面配置文件中的 plugins 部分
app.plugin(transPinyin).plugin(talkBot)

// 启动应用
app.start()
