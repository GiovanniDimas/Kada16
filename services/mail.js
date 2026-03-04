import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "giovannidimas32@gmail.com",
    pass: "sggkgrvzcrvozwwf",
  },
});

export async function sendEmail(to, subject, text) {
  try {
    const info = await transport.sendMail({
      from: '"Login Account" <giovannidimas32@gmail.com>',
      to,
      subject,
      text,
    });

    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Email error:", err);
    throw err;
  }
}