import mongoose from "mongoose";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide username'],
        unique: true
    },
    email: {
        type: String,
        required:  [true, 'Please provide username'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
    profilePicture: {
        type: String,
        default: "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

userSchema.pre('save', function(next){
    this.password = bcryptjs.hashSync(this.password, 10)
    next()
})

userSchema.methods.createJwt = function(){
    return jwt.sign({userId: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET)
}

userSchema.methods.comparePassword = async function(password){
    const isMatch = await bcryptjs.compare(password, this.password)
    return isMatch
}

const User = mongoose.model("User", userSchema)
export default User