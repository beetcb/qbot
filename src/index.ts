import { App } from 'koishi'
import { trans } from './cmd/trans'
import { sePic } from './cmd/se'
import { talkBot } from './plugin/talk'
import { transPinyin } from './cmd/transPinyin'

require('koishi-adapter-onebot')

const configInit = {
  type: 'onebot:ws',
  selfId: '2293213908',
  server: 'ws://localhost:6700',
}

const app = new App(configInit as any)

app.plugin(trans).plugin(transPinyin).plugin(sePic).plugin(talkBot)

app.start()
