export default async function (cb: Function) {
    try {
        return await cb()
    }
    catch (err) {
       console.log("T and C")
    }
}