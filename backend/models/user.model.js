import mongoose from 'mongoose'

const userShema=new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    createdAt:{
        type:Date,default:Date.now()
    }

})

const User= mongoose.model("User",userShema)

export default User;
