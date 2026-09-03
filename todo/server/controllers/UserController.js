import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { insertAccount, findAccountByEmail } from '../models/User.js'
import { ApiError } from '../helper/apiError.js'

const { sign } = jwt

const signup = async (req, res, next) => {
    try {
        const email = req.body.user?.email?.trim().toLowerCase()
        const password = req.body.user?.password
        if (!email || !password) {
            return next(new ApiError('Email and password are required', 400))
        }
        const hashedPassword = await hash(password, 10)
        const result = await insertAccount(email, hashedPassword)
        return res.status(201).json(result.rows[0])
    } catch (error) {
        return next(error)
    }
}

const signin = async (req, res, next) => {
    try {
        const email = req.body.user?.email?.trim().toLowerCase()
        const password = req.body.user?.password
        if (!email || !password) {
            return next(new ApiError('Email and password are required', 400))
        }
        const result = await findAccountByEmail(email)
        const dbUser = result.rows[0]
        if (!dbUser || !(await compare(password, dbUser.password))) {
            return next(new ApiError('Invalid email or password', 401))
        }
        const token = sign(
            { userId: dbUser.id, email: dbUser.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' },
        )
        return res.status(200).json({ id: dbUser.id, email: dbUser.email, token })
    } catch (error) {
        return next(error)
    }
}

export { signup, signin }