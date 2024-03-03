import {connect} from "@/dbConfig/dbConfig";
import Room from "@/models/roomModels";
import { NextRequest, NextResponse } from "next/server";

connect();
export async function POST(request: NextRequest){
try {
  
  const reqBody = await request.json();
  const {user,roomId}=reqBody;
  const room1=await Room.findOne({roomId});
  console.log(room1,roomId,user);
  if( room1==null) 
  {return NextResponse.json({error:"User or RoomId is not present"},
{
  status:400
})}

console.log(" room exists");

await Room.updateOne(
  { roomId },
  { $set: { joinedBy: user } } 
);

return NextResponse.json({ message: "Room updated successfully" }, { status: 200 });

  
} catch (error:any) {
  
  return NextResponse.json({error: error.message}, {status: 500})

}


}