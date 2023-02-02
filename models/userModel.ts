import mongoose, { Schema } from "mongoose"
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