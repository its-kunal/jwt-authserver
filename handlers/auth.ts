import jwt, { verify, sign } from "jsonwebtoken"
import bcrypt, { genSaltSync, hash, hashSync } from "bcrypt"
import dotenv from "dotenv"
import mongoose, { MongooseError, Schema, } from "mongoose"
import userModel from "../models/userModel"
import jwtModel from "../models/jwtModel"
export class User {
    name: string
    username: string
    mailid: string
    password: string
    constructor(name: string, username: string, mailid: string, password: string) {
        this.mailid = mailid
        this.username = username
        this.name = name
        this.password = password
    }
}

export async function createUser(payload: User) {
    // hash the payload password
    const salt = genSaltSync(Number(process.env.BCRYPT_ROUNDS))
    const hashedPasswd = hashSync(payload.password, salt)
    payload.password = hashedPasswd
    // create a class of user
    // save that user object on DB
    let a = await userModel.create(payload)
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

export async function loginUser(payload: User) {
    // get particular user from db
    let pswd = await userModel.findOne({ username: payload.username }).then((v) => {
        if (v) {
            return v.password
        } else {
            throw new Error("Couldn't find user with these credentials.")
        }
    })
    // verify credentials 
    bcrypt.compare(payload.password, pswd, (err, res) => {
        if (res == false) {
            throw new Error('Entered credentials are wrong, try again.')
        }
    })
    // Check if there is any available token for that in jwt DB
    let token = await jwtModel.findOne({ username: payload.username }).then(v => {
        if (v) {
            return v.token
        }
    })
    if (token)
        return token

    // create jwt for that
    const { username, name, mailid } = payload
    token = jwt.sign({ username, name, mailid }, String(process.env.ACCESS_TOKEN))
    // save that jwt in DB
    await jwtModel.create({ token, username })
        .catch(err => {
            console.log(err)
            throw new Error("Couldn't create token")
        })
    // return jwt 
    return token;
}

export async function logoutUser(tok: string) {
    await jwtModel.deleteOne({ token: tok }).catch(err => {
        throw new Error("Can't delete token")
    })
}

export function middleWare(token: string, cb: Function) {
    // verify token from DB

    // call cb
    cb()
}

export function deleteUser(payload: User) {

}

