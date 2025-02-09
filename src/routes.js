import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';
import { dateNow } from './utils/date-now.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null);

      return res.end(JSON.stringify(tasks));
    }
  },

  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (title && description) {
        const date = dateNow();
  
        const task = {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: date,
          updated_at: date
        }
  
        database.insert('tasks', task);
  
        return res.writeHead(201).end();
      } else {
        return res.writeHead(400).end(JSON.stringify({message: 'It is necessary to provide the title and description.'}));
      }
    } 
  },

  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const hasTask = database.selectById('tasks', id);

      if (hasTask === 0) {
        return res.writeHead(400).end(JSON.stringify({message: 'Task not found'}));
      }

      const date = dateNow();

      if (title && !description) {
        database.update('tasks', id, {
          title,
          updated_at: date
        });

        return res.writeHead(204).end();
      } else if (!title && description) {
        database.update('tasks', id, {
          description,
          updated_at: date
        });

        return res.writeHead(204).end();
      } else if(title && description) {
        database.update('tasks', id, {
          title,
          description,
          updated_at: date
        });

        return res.writeHead(204).end();
      } else {
        return res.writeHead(400).end(JSON.stringify({message: 'It is necessary to provide the title and description.'}));
      }
    }
  },

  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      const hasTask = database.selectById('tasks', id);

      if (hasTask === 0) {
        return res.writeHead(400).end(JSON.stringify({message: 'Task not found'}));
      }

      database.delete('tasks', id);

      return res.writeHead(204).end();
    }
  }
];