import jwtModel from "../models/jwtModel"
import userModel, { User } from "../models/userModel"

export async function deleteUser(payload: User) {
    // delete all jwts available with that credentials
    await jwtModel.deleteMany({ username: payload.username })
        .catch((err) => {
            throw new Error('Cannot Delete tokens')
        })
    // delete that user from db 
    await userModel.deleteOne({ username: payload.username })
        .catch((er) => {
            throw new Error('Cannot Delete Users')
        })
}