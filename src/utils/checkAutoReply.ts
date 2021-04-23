export function checkAutoReply(content: string | undefined) {
  return content ? /\[自动回复\]/.test(content) : false
}
