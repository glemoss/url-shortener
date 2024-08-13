import { pg } from './lib/postgres'

async function setup() {
  await pg/* sql */ `
    CREATE TABLE IF NOT EXISTS short_links (
        id SERIAL PRIMARY KEY,
        code TEXT UNIQUE,
        original_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  await pg.end()

  console.log('Setup concluído!')
}

setup()
