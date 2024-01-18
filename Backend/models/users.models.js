import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    password:{
        type: String,
        required: true

    },
    
    email: {
        type: String,
        unique: true,
        required: true
    },

    token: {
        type: String,
        unique: true,
        required: false,
    }

})

userSchema.index({ email: 1 }, { unique: true });

export const usersModel = mongoose.model('users', userSchema)