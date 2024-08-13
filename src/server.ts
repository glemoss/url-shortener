import fastify from 'fastify'
import { z } from 'zod'
import { pg } from './lib/postgres'
import postgres from 'postgres'

const app = fastify()

app.get('/:code', async (request, reply) => {
  const getLinkSchema = z.object({
    code: z.string().min(3),
  })

  const { code } = getLinkSchema.parse(request.params)

  const result = await pg/* sql */ `
    SELECT id, original_url
    FROM short_links
    WHERE short_links.code = ${code} 
  `

  return result
})

app.get('/api/links', async (request, reply) => {
  const result = await pg/* sql */ `
    SELECT *
    FROM short_links
    ORDER BY created_at DESC
  `

  return result
})

app.post('/api/links', async (request, reply) => {
  const createLinkSchema = z.object({
    code: z.string().min(3),
    url: z.string().url(),
  })

  const { code, url } = createLinkSchema.parse(request.body)
  try {
    const result = await pg/* sql */ `
    INSERT INTO short_links (code, original_url)
    VALUES (${code}, ${url})
    RETURNING id
  `

    const link = result[0]

    return reply.status(201).send({ shortLinkId: link })
  } catch (err) {
    if (err instanceof postgres.PostgresError) {
      return reply.status(400).send({ message: 'Duplicated code!' })
    }

    console.error()

    return reply.status(500).send({ message: 'Internal error' })
  }
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server is running')
  })
