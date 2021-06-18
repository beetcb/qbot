import fetch from 'node-fetch'
import Jimp from 'jimp'

async function getLatestData() {
  const latestData = await (
    await fetch('https://dxxoss.wwwtop.top/dxx_data.js')
  ).text()
  const [_, ji, qi] = latestData.match(/"ji":(\d+),"qi":(\d+)/)!
  return { ji, qi }
}

export async function getCompletedImgUrl(): Promise<string | null> {
  const { ji, qi } = await getLatestData()
  const htmlDoc = await (
    await fetch(`https://dxx.wwwtop.top/dxx_finish?a=${ji}&b=${qi}&d=0`)
  ).text()
  const imgEle = htmlDoc.match(/img.+/)

  return imgEle
    ? (imgEle[0].match(
        /src="(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))"/
      )![1] as string)
    : null
}

export async function addTextToImg(localImgUrl: string, text: string) {
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)
  const image = await Jimp.read(localImgUrl)
  image.print(font, 424, 672, text).write(localImgUrl)
}
