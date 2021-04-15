import { Context } from 'koishi'
import { translate } from '../utils/deepl'

export function trans(ctx: Context) {
  ctx.command('翻译 <text>').action(async (_, message) => {
    const reply: any = await translate('ZH', 'EN', message)
    return reply
  })
}
