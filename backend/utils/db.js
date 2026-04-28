import mongoose from "mongoose";

const connectDb=async()=>{
    try {
        const con=await mongoose.connect(process.env.MONGO_URI);

        if(con)
        {
            console.log("mongodb is connected");
        }
    } catch (error) {
        console.log(error);
    }
}

export default connectDb