import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      
      if (!req.body?.title || !req.body?.description) return res.writeHead(400).end(JSON.stringify({
        message: 'Campos title e description obrigatórios!'
      }))
        
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description
      }
      
      database.insert('tasks', task)
      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      if (!req.body?.title && !req.body?.description) return res.writeHead(400).end(JSON.stringify({
        message: 'Você deve enviar pelo menos title ou description.'
      }))

      const updated = database.update('tasks', id, req.body)

      if (updated) return res.writeHead(204).end()
      return res.writeHead(404).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const deleted = database.delete('tasks', id)

      if (deleted) return res.writeHead(204).end()
      return res.writeHead(404).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const currentTasks = database.select('tasks')
      console.log(currentTasks)
      const currentTask = currentTasks.find(task => task.id === id)

      if (currentTask) {
        const updated = database.update('tasks', id, {
          completed_at: currentTask.completed_at === 'true' ? 'false' : 'true'
        })
        if (updated) return res.writeHead(204).end()
      }

      return res.writeHead(404).end()
    }
  }
]