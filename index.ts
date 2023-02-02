import express from "express"
import dotenv from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import { createUser, loginUser, User, logoutUser } from "./handlers/auth"

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
    res.setHeader('bearer', 'value haha')
    return res.send("Hello from auth server!!")
})

app.get("/create", async (req, res) => {
    const u: User = req.body as User
    const token = await createUser(u)
        .catch((err) => {
            console.log(err)
            return err
        })
    if (token instanceof Error)
        return res.status(500).send(token.message)
    return res.setHeader('Authorization', `Bearer ${token}`).status(200).send("Successfully created user")
})

app.get('/login', async (req, res) => {
    let token = await loginUser(req.body as User).catch(err => {
        return err
    })
    if (token instanceof Error) {
        return res.status(500).send(token.message)
    }
    return res.setHeader('Authorization', `Bearer ${token}`).status(200).send("Successfully Login user")
})

app.get("/logout", async (req, res) => {
    await logoutUser(String(req.headers.authorization?.split(' ')[1]))
        .catch(err =>
            console.log(err)
        )
    res.removeHeader('Authorization')
    return res.send('Logged out sucessfullyy')
})

// DB connection
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.MONGO_DB_PATH}`)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log("Couldn't Connect to DB", err))
// express server connection
app.listen(process.env.PORT)

/*
create user
POST /create with payload and in return cookie.token is set
verify user (login)

POST /login with payload and same is done.
logout user

GET /logout

GET /verifyagain

delete user
DELETE /user/id with payload.
*/