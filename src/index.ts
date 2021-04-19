import { App } from 'koishi'
import { talkBot } from './plugin/talk'
import { transPinyin } from './plugin/transPinyin'

require('koishi-adapter-onebot')

const config = {
  type: 'onebot:ws',
  server: 'ws://localhost:6700',
}

const app = new App(config as any)

app.plugin(transPinyin).plugin(talkBot)

app.start()
