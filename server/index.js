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
app.post('/tasks', (reg, res) => {
    const pool = openDb()
    const { task } = reg.body
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

app.get('/tasks', (reg, res) => {
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
