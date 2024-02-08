import mongoose from 'mongoose'

const roomSchema=new mongoose.Schema({
  room_id: { type: Number, required: true },
  createdBy:{
    type:Schema.Types.ObjectId,
  ref:'User',
  required:true


  }
})

const Room = mongoose.models.rooms || mongoose.model("rooms", userSchema);