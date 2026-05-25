import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // 1. Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // 2. Transporter Setup
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      console.error("SMTP Configuration Error: Missing SMTP_USER or SMTP_PASS environment variables.");
      return NextResponse.json(
        { 
          error: "SMTP environment variables are not configured in your production hosting panel (e.g. Vercel, cPanel, or VPS environment). Please add SMTP_USER and SMTP_PASS to your host's environment settings." 
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.zoho.com",
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true, // use SSL/TLS
      auth: {
        user,
        pass,
      },
      // Timeout settings to fail fast if port is blocked
      connectionTimeout: 10000, 
      greetingTimeout: 10000,
    });

    // 3. Email Package
    const mailOptions = {
      from: process.env.SMTP_FROM || "hi@imamhasan.dev",
      to: "hi@imamhasan.dev",
      replyTo: email, // Directly reply to the user's input email
      subject: `New Portfolio Contact Message from ${name}`,
      text: `You have received a new contact message from your portfolio site.

Name: ${name}
Email: ${email}

Message:
${message}
`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
          <h2 style="color: #000; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 0;">New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p style="margin-bottom: 0;"><strong>Message:</strong></p>
          <div style="background-color: #f9f9f9; border-left: 4px solid #000; padding: 15px; margin-top: 5px; font-style: italic;">
            ${message.replace(/\n/g, "<br />")}
          </div>
          <footer style="margin-top: 20px; font-size: 0.8rem; color: #777; border-top: 1px solid #eee; padding-top: 10px;">
            Sent securely via Zoho SMTP from imamhasan.dev portfolio.
          </footer>
        </div>
      `,
    };

    // 4. Dispatch Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent successfully." });
  } catch (error: any) {
    console.error("SMTP Mailer Error:", error);
    
    // Check for common authentication failure codes
    if (error.code === "EAUTH" || error.message?.includes("Authentication Failed")) {
      return NextResponse.json(
        { 
          error: "Zoho SMTP Authentication Failed. If Two-Factor Authentication (2FA) is enabled on your Zoho account, you MUST generate and use an App-Specific Password instead of your regular password." 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: `SMTP server error: ${error.message || "Failed to send email."}` },
      { status: 500 }
    );
  }
}
