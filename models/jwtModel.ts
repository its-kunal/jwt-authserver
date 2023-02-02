import mongoose, { model, Schema } from "mongoose"

export const jwtSchema = new Schema({
    token: {
        type: String, requried: true
    },
    timestamp: {
        type: Date
    },
    username: { type: String, unique: true, required: true }
})

jwtSchema.pre('save', function (next) {
    this.timestamp = new Date(Date.now())
    next()
})

export default model('Jwt', jwtSchema)