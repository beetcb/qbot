// https://github.com/dqn/deepljs

import https from 'https'

export type Language = 'auto' | 'JA' | 'EN' | 'DE' | 'FR' | 'ES' | 'PT' | 'IT' | 'NL' | 'PL' | 'RU' | 'ZH'

type Beam = {
  postprocessed_sentence: string
  num_symbols: number
  score: number
  totalLogProb: number
}

type Translation = {
  beams: Beam[]
  quality: string
}

type Result = {
  translations: Translation[]
  target_lang: string
  source_lang: string
  source_lang_is_confident: boolean
  timestamp: number
  date: string
}

type Error = {
  code: number
  message: string
}

type DeepLResponse = { jsonrpc: string } & ({ id: number; result: Result } | { error: Error })

export function translate(source: Language, target: Language, sentence: string): Promise<string[]> {
  const options = {
    method: 'POST',
    host: 'www2.deepl.com',
    path: '/jsonrpc',
  }

  const body = {
    jsonrpc: '2.0',
    method: 'LMT_handle_jobs',
    params: {
      jobs: [
        {
          kind: 'default',
          raw_en_sentence: sentence,
          raw_en_context_before: [],
          raw_en_context_after: [],
          preferred_num_beams: 4,
          quality: 'fast',
        },
      ],
      lang: {
        user_preferred_langs: ['ZH', 'EN'],
        source_lang_user_selected: source,
        target_lang: target,
      },
      priority: -1,
      commonJobParams: {},
      timestamp: Date.now(),
    },
    id: 29510025,
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.on('data', (data: Buffer) => {
        const deepLResponse: DeepLResponse = JSON.parse(data.toString())

        if ('error' in deepLResponse) {
          const { code, message } = deepLResponse.error
          reject(`${code}: ${message}`)
          return
        }

        resolve(deepLResponse.result.translations[0].beams.map((beam) => beam.postprocessed_sentence))
      })
    })

    req.write(JSON.stringify(body))
    req.end()
  })
}
