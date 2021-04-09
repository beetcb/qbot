import fetch from 'node-fetch'
import { Context } from 'koishi'
import { translate } from '../utils/deepl'

const targetUsers: Array<string> = ['2293213908', '2384571336']

export function talkBot(ctx: Context) {
  ctx.middleware(async (session, next) => {
    if (targetUsers.includes(session.userId!)) {
      const reply = await charBot(session.content!)
      reply && session.send(reply)
    }
    return next()
  })
}

async function charBot(content: string): Promise<string | undefined> {
  const res = await translate('ZH', 'EN', content)
  return res[0]
}
