import fetch from 'node-fetch'
import { Context } from 'koishi'
import { cqCreator, CQType } from '../cqcode'

export function sePic(ctx: Context) {
  ctx.command('色图 <level>').action(async (_, level) => {
    const reply = await grabPhoto(level)
    console.log(reply)
    if (reply) {
      return reply
    }
  })
}

async function grabPhoto(level: string | number) {
  const { se_api_key, se_api_endpoint } = process.env
  console.log(typeof level)
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