import express from "express"
import dotenv from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import { createUser, deleteUser, loginUser, logoutUser, middleWare } from "./handlers/auth"
import { User } from "./models/userModel"
import mongooseError from "./handlers/mongooseError"
import trycatch from "./trycatch"

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
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
    return res.setHeader('Authorization', `Bearer ${token}`)
        .status(200).send("Successfully created user")
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

app.get("/verify", async (req, res) => {
    let token = String(req.headers.authorization?.split(' ')[1])
    let resi = await middleWare(token, () => { })
        .catch(async (err) => {
            return err
        })
    if (resi instanceof Error)
        return res.status(300).send(resi.message)
    return res.send("Verified")
})

app.get("/logout", async (req, res) => {
    await logoutUser(String(req.headers.authorization?.split(' ')[1]))
        .catch(err =>
            console.log(err)
        )
    res.removeHeader('Authorization')
    return res.send('Logged out sucessfullyy')
})

app.get("/delete", async (req, res) => {
    const v = async () => { await deleteUser(req.body as User); }
    let resi = await trycatch(v).catch((err) => { return err })
    if (resi instanceof Error)
        return res.status(300).send('Error Occured')
    return res.send('Deleted User Sucessfully')
})


function calc(a: number = 12, b: number = 2332) {
    // throw new Error('fdss')
    return a + b;
}

app.get("/tre", async (req, res) => {
    let a = await trycatch(calc).catch((err) => { return err })
    console.log(a)
    if (a instanceof Error)
        return res.send("Error")
    else
        return res.send("tre")
})

// DB connection
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.MONGO_DB_PATH}`)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log("Couldn't Connect to DB", err))
mongoose.connection.on('error', mongooseError)
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