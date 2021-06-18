import { App, AppOptions } from 'koishi'
import { trans } from './cmd/trans'
import { pic } from './cmd/pic'
import { sePic } from './cmd/se'
import { talkBot } from './plugin/talk'
import { transPinyin } from './cmd/transPinyin'

require('koishi-adapter-onebot')

const configInit: AppOptions & { server: string } = {
  type: 'onebot:ws',
  selfId: '2293213908',
  server: 'ws://localhost:6700',
}

const app = new App(configInit)

app.plugin(trans).plugin(transPinyin).plugin(sePic).plugin(talkBot).plugin(pic)

app.start()
