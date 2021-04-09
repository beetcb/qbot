import fetch from 'node-fetch'
import { Context } from 'koishi'

export function transPinyin(ctx: Context) {
  ctx.command('说人话 <pinyin>').action(async ({ options, session }, message) => {
    const reply = await trans(message)
    if (reply) {
      return reply.trans.join('\n')
    }
  })
}

async function trans(content: string): Promise<any> {
  const res = await fetch(`https://lab.magiconch.com/api/nbnhhsh/guess`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `text=${content}`,
  })

  if (res.ok) {
    const reply = await res.json()
    return reply[0]
  } else {
    const text = await res.text()
    console.log(text)
  }
}
