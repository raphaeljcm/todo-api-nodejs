export const json = async (req, res) => {
  const chunks = []

  for await (const chunk of req) {
    chunks.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(chunks))
  } catch {
    req.body = null
  }

  res.setHeader('Content-Type', 'application/json')
}