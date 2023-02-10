import userModel, { User } from "../models/userModel"
import bcrypt from "bcrypt"
import jwtModel from "../models/jwtModel"
import jwt, { verify, sign } from "jsonwebtoken"

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
        if (res == false)
            throw new Error('Entered credentials are wrong, try again.')

    })
    // Check if there is any available token for that in jwt DB
    let token = await jwtModel.findOne({ username: payload.username }).then(v => {
        if (v)
            return v.token
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

