import fetch from 'node-fetch'

export async function sweetNothing() {
  const res = await fetch('https://api.lovelive.tools/api/SweetNothings/Serialization/Json/1')
  if (res.ok) {
    const data = await res.json()
    return data.returnObj[0]
  }
}
