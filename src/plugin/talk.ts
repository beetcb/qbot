import fetch from 'node-fetch'
import crypto from 'crypto'
import { config } from 'dotenv'
import { resolve } from 'path'
import { Context } from 'koishi'

config({ path: resolve(__dirname, '../../.env') })

const { app_id, app_key, api_endpoint } = process.env

interface ReqParamsObject {
  app_id: number
  time_stamp: number
  nonce_str: string
  session: string
  question: string
  sign?: string
}

type ParamsKeys = keyof ReqParamsObject

const targetUsers: Array<string> = ['2293213908', '2384571336']

export function talkBot(ctx: Context) {
  ctx.middleware(async (session, next) => {
    if (targetUsers.includes(session.userId!)) {
      const reply = await charBot(session.content!, session.userId!)
      reply && session.send(reply)
    }
    return next()
  })
}

async function charBot(content: string, session: string): Promise<string | undefined> {
  if (app_id) {
    const reqParams: ReqParamsObject = {
      app_id: Number(app_id),
      time_stamp: Math.floor(Date.now() / 1000),
      nonce_str: randomString(),
      question: content,
      session: session,
    }

    reqParams.sign = tRepSign(reqParams)
    if (api_endpoint) {
      const res = await fetch(`${api_endpoint}?${new URLSearchParams(reqParams as any).toString()}`)
      if (res.ok) {
        const data = await res.json()
        console.log(data)
        return data.data.answer
      }
    }
  } else {
    throw new Error('environment variable not found: app_id')
  }
}

function randomString(): string {
  const str = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  return Array(16)
    .fill(null)
    .reduce((s = '') => (s += str.charAt(Math.floor(Math.random() * 48))), '')
}

function tRepSign(reqParams: ReqParamsObject): string {
  type SignParamsObject = { [P in keyof ReqParamsObject]?: number | string } & { app_key?: string }
  const result: SignParamsObject = {}

  // Step 1 & 2
  ;(Object.keys(reqParams) as ParamsKeys[])
    .sort((a, b) => (a > b ? 1 : -1))
    .forEach((key: ParamsKeys) => {
      result[key] = reqParams[key]
    })

  // Step 3
  if (app_key) {
    result.app_key = app_key
  } else {
    throw new Error('environment variable not found: app_key')
  }

  console.log(new URLSearchParams(result as any).toString())

  // Step 4
  return crypto
    .createHash('md5')
    .update(new URLSearchParams(result as any).toString(), 'utf8')
    .digest('hex')
    .toUpperCase()
}
