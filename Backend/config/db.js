import mongoose from 'mongoose';

export const connectDataBase = async()=>{
    try{
        await mongoose.connect(process.env.DB_URI)
        console.log("Conectado a la base de datos")
    }catch(e){
        console.log("No conectado "+ e)
    }
}

