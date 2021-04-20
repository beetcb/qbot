import { App } from 'koishi'
import { sePic } from './plugin/se'
import { talkBot } from './plugin/talk'
import { transPinyin } from './plugin/transPinyin'

require('koishi-adapter-onebot')

const config = {
  type: 'onebot:ws',
  selfId: '2293213908',
  server: 'ws://localhost:6700',
}

const app = new App(config as any)

app.plugin(transPinyin).plugin(sePic).plugin(talkBot)

app.start()
