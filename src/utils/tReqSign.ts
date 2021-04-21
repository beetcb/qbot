import crypto from 'crypto'

export interface ReqParamsObject {
  app_id: number
  time_stamp: number
  nonce_str: string
  sign?: string
}

type ParamsKeys = keyof ReqParamsObject

export function tReqSign<T>(reqParams: ReqParamsObject & T, app_key: string | undefined): string {
  type SignParamsObject = { [P in keyof ReqParamsObject]?: number | string } & { app_key?: string }
  const result: SignParamsObject = {}

  // Step 1 & 2
  ;(Object.keys(reqParams) as ParamsKeys[])
    .sort((a, b) => (a > b ? 1 : -1))
    .forEach((key: ParamsKeys) => {
      result[key] = reqParams[key]
    })

  // Step 3
  if (app_key) {
    result.app_key = app_key
  } else {
    throw new Error('environment variable not found: app_key')
  }

  // Step 4
  return crypto
    .createHash('md5')
    .update(new URLSearchParams(result as any).toString(), 'utf8')
    .digest('hex')
    .toUpperCase()
}

export function randomString(): string {
  const str = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  return Array(16)
    .fill(null)
    .reduce((s = '') => (s += str.charAt(Math.floor(Math.random() * 48))), '')
}
