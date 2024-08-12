import postgres from 'postgres'

export const pg = postgres(
  'postgresql://docker:docker@localhost:5432/url-shortener-db',
)
