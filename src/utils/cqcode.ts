// type CQType = 'face' | 'at' | 'image'
export enum CQType {
  At = 'at',
  Face = 'face',
  Image = 'image',
  // Incompleted
}

export function cqParser(content: string) {
  const parser = /\[CQ:(.+)\]\s?(.+)?/.exec(content)
  if (parser) {
    const [cqType, ...query] = parser[1].split(',')
    const message = parser[2] || ''
    // construct query object
    let queryObject = {}
    if (query.length) {
      queryObject = query.reduce((obj: any, v) => {
        const [key, value] = v.split('=')
        obj[key] = value
        return obj
      }, {})
    }
    return { cqType, queryObject, message }
  }
}

export function cqCreator(cqType: CQType, queryOjbect: object, message?: string) {
  const query = Object.keys(queryOjbect).reduce((str, v) => {
    return `${str},${v}=${(queryOjbect as any)[v]}`
  }, '')
  return `[CQ:${cqType}${query}]${message ? ' ' + message : ''}`
}
