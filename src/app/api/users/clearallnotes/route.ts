import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/config";





export async function POST(request: NextRequest) {
  await connect();
  try {
    const reqBody = await request.json();
    const {id} = reqBody;
    const user = await User.findOne({_id: id}).select("-password");
    if (!user) {
      return NextResponse.json({
        error: "User not found"
      }, {status: 400})
    }
    user.notes = [];
    await user.save();
    return NextResponse.json({
      message: "Notes cleared successfully"
    })
  } catch (error:any) {
    return NextResponse.json({
      error: error.message
    }, {status: 500})
  }
}