import fetch from 'node-fetch'
import { Context } from 'koishi'
import { ReqParamsObject, tReqSign, randomString } from '../utils/tReqSign'

interface TransReqParamsObject extends ReqParamsObject {
  text: string
  source: string
  target: string
}

const { app_id, app_key, trans_api_endpoint } = process.env

export function trans(ctx: Context) {
  ctx
    .command('翻译 <message:text>')
    .option('in', '-i <source>')
    .option('out', '-o <target>')
    .action(async ({ options }, message) => {
      if (message) {
        const reply = await translate(message, options?.in, options?.out)
        return reply
      }
    })
}

async function translate(message: string, source: string | undefined = 'en', target: string | undefined = 'zh') {
  if (app_id) {
    const reqParams: TransReqParamsObject = {
      app_id: Number(app_id),
      time_stamp: Math.floor(Date.now() / 1000),
      nonce_str: randomString(),
      text: message,
      source,
      target,
    }

    reqParams.sign = tReqSign<TransReqParamsObject>(reqParams, app_key)
    if (trans_api_endpoint) {
      const res = await fetch(`${trans_api_endpoint}?${new URLSearchParams(reqParams as any).toString()}`)
      if (res.ok) {
        const data = await res.json()
        console.log(data)
        return data.data.target_text
      }
    }
  } else {
    throw new Error('environment variable not found: app_id')
  }
}
