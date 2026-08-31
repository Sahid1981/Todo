import { pool } from '../helper/db.js' 
import { Router } from 'express'  

const router = Router()  

router.get('/', (req, res, next) => {   
    pool.query('SELECT * FROM task', (err, result) => {     
        if (err) {       
            return next (err)           
        }     
        res.status(200).json(result.rows || [])   
    }) 
})
router.post('/', (req, res, next) => {
    const { task } = req.body
    if (!task) {
        return res.status(400).json({error: 'Tastk is reguired'})
    }
    pool.query('insert into task (description) values ($1) returning *',
[task.description],
        (err, result) => {
        if (err) return next(err)
        res.status(201).json({id: result.rows[0].id, description: task.description})
    }) 
})
router.delete('/:id', (req, res, next) => {
    const { id } = req.params
    pool.query('DELETE FROM task WHERE id = $1',
        [id], 
        (err, result) => {
        if (err) {
            return next(err)
        }
        if (result.rowCount === 0) {
            const error = new Error('Task not foun')
            error.status = 404
            return next(error)
        }
        res.status(200).json({id: id})
    })
})
export default router