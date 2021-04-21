import fetch from 'node-fetch'
import { Context } from 'koishi'
import { cqParser, CQType } from '../utils/cqcode'
import { ReqParamsObject, tReqSign, randomString } from '../utils/tReqSign'

interface TransReqParamsObject extends ReqParamsObject {
  text: string
  source: string
  target: string
}

type TransImgReqParamsObject = Omit<TransReqParamsObject, 'text'> & {
  image: string
  session_id: string
  scene: 'doc' | 'word'
}

const { app_id, app_key, trans_api_endpoint, trans_img_api_endpoint } = process.env

export function trans(ctx: Context) {
  ctx
    .command('翻译 <message:text>', '语言机器翻译，同时支持图片翻译')
    .option('in', '-i <source> 源语言')
    .option('out', '-o <target> 翻译目标语言')
    .action(async ({ options }, message) => {
      const parse = cqParser(message)
      if (parse) {
        const { cqType, queryObject, message } = parse
        const reply =
          cqType === CQType.Image
            ? await translateImg((queryObject as any).url, options?.in, options?.out)
            : await translate(message, options?.in, options?.out)

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
        return data.data.target_text
      }
    }
  } else {
    throw new Error('environment variable not found: app_id')
  }
}

async function translateImg(url: string, source: string | undefined = 'en', target: string | undefined = 'zh') {
  if (app_id) {
    const imageToBase64 = require('image-to-base64')
    const reqParams: TransImgReqParamsObject = {
      app_id: Number(app_id),
      time_stamp: Math.floor(Date.now() / 1000),
      nonce_str: randomString(),
      image: await imageToBase64(url),
      session_id: randomString(),
      scene: 'doc',
      source,
      target,
    }

    reqParams.sign = tReqSign<TransImgReqParamsObject>(reqParams, app_key)

    if (trans_img_api_endpoint) {
      // base64 encode is huge, using POST instead
      const res = await fetch(trans_img_api_endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(reqParams as any).toString(),
      })
      if (res.ok) {
        const data = await res.json()
        const source = data.data.image_records.reduce(
          (str: string, v: { source_text: string; target_text: string }) => `${str}${v.source_text}`,
          ''
        )
        const target = data.data.image_records.reduce(
          (str: string, v: { source_text: string; target_text: string }) => `${str}${v.target_text}`,
          ''
        )
        return `原文：${source}\n\n翻译：${target}`
      }
    }
  } else {
    throw new Error('environment variable not found: app_id')
  }
}
