import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";



export const sendEmail = async({email, emailType, userId}: any) => {
  try {
    // create hash token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10)


      if (emailType === "VERIFY") { 
        await User.findByIdAndUpdate(userId, {
          verifyToken: hashedToken,
          verifyTokenExpires: Date.now() + 3600000
        }) 
      } else if (emailType === "RESET") {
        await User.findByIdAndUpdate(userId, {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpires: Date.now() + 3600000
        })
      }
      

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "8b79861f2a5bf0",
        pass: "5a6a0925980864"
      }
    })

    const mailOptions = {
      from: "HgYp0@example.com",
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${process.env.domain}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"} or paste this link into your browser. <br /> ${process.env.domain}/verifyemail?token=${hashedToken}</p>`
    }

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;



  } catch (error:any) {
    throw new Error(error.message);
  }
}