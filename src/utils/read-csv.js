import fs from 'node:fs'
import { parse } from 'csv-parse'

const TODO_CSV_FILE = new URL('../..', import.meta.url).pathname

const processFile = async () => {
  const parser = fs
    .createReadStream(`${TODO_CSV_FILE}tasks-todo.csv`)
    .pipe(parse({ from_line: 2, skip_empty_lines: true })) // to avoid the first line

  for await (const record of parser) {
    try {
      const [title, description] = record[0].split(',')
      await fetch('http://localhost:3333/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
        duplex: 'half'
      })
    } catch {
      console.error(`Error sending record: ${record}`)
    }
  }
}

(async () => {
  await processFile()
})()