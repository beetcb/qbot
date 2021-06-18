import fs from 'fs'
import fetch from 'node-fetch'

export async function download(url: string, filename: string): Promise<string> {
  const stream = fs.createWriteStream(filename)
  const res = await fetch(url)
  const result = await new Promise((resolve, reject) => {
    res.body.pipe(stream)
    res.body.on('error', reject)
    stream.on('close', () => resolve(`Downloaded tess data as ${filename}`))
  })
  return result as string
}
