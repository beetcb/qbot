import { Context } from 'koishi'
import { download } from '../utils/download'
import { cqCreator, CQType } from '../utils/cqcode'
import { getCompletedImgUrl, addTextToImg } from '../utils/yParty'

export function pic(ctx: Context) {
  ctx
    .command('大学习 <文字>', '获得青年大学习截图，附上专属文字', {
      minInterval: 5000,
    })
    .action(async (_, text) => {
      const imgUrl = await getCompletedImgUrl()
      let reply = null
      if (imgUrl) {
        await download(imgUrl, 'file.png')
        await addTextToImg('file.png', text)
        reply = cqCreator(CQType.Image, {
          file: 'file.png',
          url: 'file.png',
        })
      }
      
      if (reply) {
        return reply
      }
    })
}
