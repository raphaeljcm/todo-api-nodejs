import fs from 'node:fs/promises'

const DATABASE_PATH = new URL('../db.json', import.meta.url)

/**
  - `id` - A unique identifier for each task
  - `title` - Title of the task
  - `description` - Description of the task
  - `completed_at` - Date when the task was done. Initial value will be set to null
  - `created_at` - Date when the task was created
  - `updated_at` - Must always be updated when the task is updated
 */

export class Database {
  #database = {}

  constructor() {
    fs.readFile(DATABASE_PATH, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push({
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
        completed_at: null
      })
    } else {
      this.#database[table] = [{
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
        completed_at: null
      }]
    }

    this.#persist()
    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      let currentData = this.#database[table][rowIndex]
      this.#database[table][rowIndex] = { ...currentData, ...data, updated_at: new Date() }
      
      this.#persist()
      return true
    }

    return false
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
      return true
    }

    return false
  }

  #persist() {
    fs.writeFile(DATABASE_PATH, JSON.stringify(this.#database))
  }
}