import { App } from 'koishi'
import { talkBot } from './plugin/talk'
import { transPinyin } from './plugin/transPinyin'

require('koishi-adapter-onebot')

const config = {
  type: 'onebot:ws',
  selfId: '1764237497',
  server: 'ws://localhost:6700',
}

const app = new App(config)

// 注册插件，作用相当于上面配置文件中的 plugins 部分
app.plugin(transPinyin).plugin(talkBot)

// 启动应用
app.start()
