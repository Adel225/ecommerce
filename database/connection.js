import mongoose from "mongoose"

const connectDB = async () => {
    return mongoose.connect(process.env.URI).then(
        console.log("database connected successfully !")
    ).catch(e => {
        console.log(`Error connecting database` , e)
    })
}
export default connectDB