import mongoose from "mongoose";


const db = async () => {
    try {
        await mongoose.connect(process.env.DB);
        console.log('Db Connected Successfully')
    } catch (error) {
        console.log(error)
    }
};

export default db;