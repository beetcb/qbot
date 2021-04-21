import fetch from 'node-fetch'
import { delay } from '../utils/delay'
import { sweetNothing } from './sweet'
import { Bot, Context } from 'koishi'
import { cqParser, CQType } from '../utils/cqcode'
import { ReqParamsObject, tReqSign, randomString } from '../utils/tReqSign'

interface BotReqParamsObject extends ReqParamsObject {
  question: string
  session: string
}

const { app_id, app_key, api_endpoint } = process.env

export function talkBot(ctx: Context) {
  ctx.middleware(async (session, next) => {
    // delay 0-5 seconds
    await delay(5)
    const { content, userId } = session
    if (session.subtype! === 'private') {
      const reply = await charBot(content!, userId!)
      reply && session.send(reply)
    } else {
      const parse = cqParser(content!)
      if (parse) {
        const { cqType, queryObject, message } = parse
        if (cqType === CQType.At && (queryObject as any).id === '2293213908') {
          const reply = await charBot(message, userId!)
          reply && session.send(reply)
        }
      }
    }
    return next()
  })
}

async function charBot(content: string, session: string): Promise<string | undefined> {
  if (app_id) {
    const reqParams: BotReqParamsObject = {
      app_id: Number(app_id),
      time_stamp: Math.floor(Date.now() / 1000),
      nonce_str: randomString(),
      question: content,
      session: session,
    }

    reqParams.sign = tReqSign<BotReqParamsObject>(reqParams, app_key)
    if (api_endpoint) {
      const res = await fetch(`${api_endpoint}?${new URLSearchParams(reqParams as any).toString()}`)
      if (res.ok) {
        const data = await res.json()
        let answer = data.data.answer
        if (!answer) {
          answer = await sweetNothing()
        }
        return answer
      }
    }
  } else {
    throw new Error('environment variable not found: app_id')
  }
}
