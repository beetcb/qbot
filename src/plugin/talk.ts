import fetch from 'node-fetch'
import { Context } from 'koishi'

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
  const res = await fetch(
    `http://api.qingyunke.com/api.php?${new URLSearchParams({
      key: 'free',
      msg: content,
    }).toString()}`
  )

  if (res.ok) {
    const reply = await res.json()
    return reply.content
  } else {
    const text = await res.text()
    console.log(text)
  }
}
