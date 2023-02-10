import jwtModel from "../models/jwtModel"
export async function logoutUser(tok: string) {
    await jwtModel.deleteOne({ token: tok }).catch(err => {
        throw new Error("Can't delete token")
    })
}