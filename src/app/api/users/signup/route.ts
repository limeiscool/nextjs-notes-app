import {connect} from "@/db/config";
import User from "@/models/userModel.js"
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";



export async function POST(request:NextRequest) {
  await connect();
  try {
    const reqBody = await request.json();
    const {username, email, password} = reqBody;

    // user check
    const user = await User.findOne({email})
    if (user) {
      return NextResponse.json({
        error: "An account already exists with this email"
      }, {status: 400})
    }

    // password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    })
    const savedUser = await newUser.save();
    if (savedUser) {
      console.log("😎 A new user has signed up.")
    }

    // send verification email

    await sendEmail({
      email, emailType: "VERIFY", userId: savedUser._id
    })


    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser
    });
    
  } catch (error:any) {
    return NextResponse.json({
      error: error.message
    }, {status: 500});
  } 
}