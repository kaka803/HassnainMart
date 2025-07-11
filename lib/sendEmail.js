import nodemailer from "nodemailer";


export async function sendEmail(otp, email) {
    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,   
      pass: process.env.EMAIL_PASS,   
    },
  });

    const mailOptions = {
        from: `"OTP Verification" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP Code",
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; font-size: 16px; line-height: 1.6;">
            <h2 style="color: #6C63FF;">🔐 OTP Verification</h2>
            <p>Your OTP code is <strong style="font-size: 24px; color: #6C63FF;">${otp}</strong>.</p>
            <p>This code is valid for 60 seconds.</p>
        </div>
        `,
    };
    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }

}