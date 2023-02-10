import mongoose, { Schema } from "mongoose"

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

const userSchema = new Schema({
    name: {
        type: String, required: true
    },
    username: {
        type: String, unique: true, required: true
    },
    password: {
        type: String, required: true
    },
    mailid: {
        type: String,
        required: true,
        unique: true
    }
})

export default mongoose.model('User', userSchema)