import { genSaltSync, hashSync } from "bcrypt"
import userModel, { User } from "../models/userModel"
import jwt, { verify, sign } from "jsonwebtoken"
import jwtModel from "../models/jwtModel"

export async function createUser(payload: User) {
    // hash the payload password
    const salt = genSaltSync(Number(process.env.BCRYPT_ROUNDS))
    const hashedPasswd = hashSync(payload.password, salt)
    payload.password = hashedPasswd
    // create a class of user
    // save that user object on DB 
    await userModel.create(payload)
        .catch(err => {
            console.log(err)
            throw new Error("Can't create user")
        })

    // create jwt for that
    const { username, name, mailid } = payload
    const token = jwt.sign({ username, name, mailid }, String(process.env.ACCESS_TOKEN))

    // save that jwt in DB
    await jwtModel.create({ token, username })
        .catch(err => {
            console.log(err)
            throw new Error("Couldn't create token")
        })
    // return jwt for that
    return token
}
