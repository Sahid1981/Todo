import express from 'express'
import cors from 'cors'
import pg from 'pg'

const port = 3001
const { Pool } = pg
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
const openDb = () => {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'todo',
        password: 'root',
        port: 5432
    })
    return pool
}
app.post('/tasks', (req, res) => {
    const pool = openDb()
    const { task } = req.body
    if (!task) {
        return res.status(400).json({error: 'Tastk is reguired'})
    }
    pool.query('insert into task (description) values ($1) returning *',
[task.description],
        (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' })
        }
        res.status(201).json({id: result.rows[0].id, description: task.description})
    }) 
}) 

app.delete('/tasks/:id', (req, res) => {
    const pool = openDb()
    const { id } = req.params
    console.log('Deleting task whit id: ${id}')
    pool.query('DELETE FROM task WHERE id = $1',
        [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' })
        }
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' })
        }
        res.status(200).json({id: id})
    })
})

app.get('/tasks', (req, res) => {
    const pool = openDb()
    pool.query('SELECT * FROM task', (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error'})
        }
        res.status(200).json(result.rows)
    })
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
