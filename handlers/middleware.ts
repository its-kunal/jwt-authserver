import jwtModel from "../models/jwtModel"

export async function middleWare(token: string, cb: Function) {
    // verify token from DB
    //   Check if this token is present in mongo db
    if (token != "") {
        const v = await jwtModel.find({ token: token })
        .catch((err)=>{throw new Error('Not in DB')}) 
        // call cb
        if (v[0]?.token)
            cb()
        else
            throw new Error('Error, JWT not found')
    }
    else throw new Error('Error Occured')
}
