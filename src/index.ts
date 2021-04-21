import { App } from 'koishi'
import { trans } from './plugin/trans'
import { sePic } from './plugin/se'
import { talkBot } from './plugin/talk'

import { transPinyin } from './plugin/transPinyin'

require('koishi-adapter-onebot')

const configInit = {
  type: 'onebot:ws',
  selfId: '2293213908',
  server: 'ws://localhost:6700',
}

const app = new App(configInit as any)

app.plugin(trans).plugin(transPinyin).plugin(sePic).plugin(talkBot)

app.start()
