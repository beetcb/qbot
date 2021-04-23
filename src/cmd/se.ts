import fetch from 'node-fetch'
import { Context } from 'koishi'
import { cqCreator, CQType } from '../utils/cqcode'

export function sePic(ctx: Context) {
  ctx
    .command('涩图 <level>', '发送悦目的图片', {
      minInterval: 5000,
    })
    .action(async (_, level) => {
      const reply = await grabPhoto(level)
      console.log(reply)
      if (reply) {
        return reply
      }
    })
}

async function grabPhoto(level: string | number) {
  const { se_api_key, se_api_endpoint } = process.env
  if (se_api_endpoint) {
    const res = await fetch(
      `${se_api_endpoint}?${new URLSearchParams({
        apikey: se_api_key || '',
        r18: level >= 18 ? 1 : 0,
        size1200: typeof level === 'string' && level.includes('原图') ? false : true,
      } as any).toString()}`
    )

    const data = await res.json()
    if (data.data) {
      const url = data.data[0].url
      return cqCreator(CQType.Image, {
        file: new URL(url).pathname.slice(1),
        url,
      })
    }
  }
}
