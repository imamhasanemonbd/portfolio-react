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

    // 4. Dispatch Email to Portfolio Owner
    await transporter.sendMail(mailOptions);

    // 5. Dispatch Auto-Reply Email to the Visitor (Matching visual design of the website)
    const autoReplyOptions = {
      from: process.env.SMTP_FROM || "hi@imamhasan.dev",
      to: email, // The user's input email
      subject: `Thank you for reaching out! — Imam Hasan`,
      text: `Hi ${name},

Thank you for getting in touch! I have successfully received your message and will review it shortly. I will get back to you as soon as possible.

Best regards,
Imam Hasan
Creative Web & App Developer
hi@imamhasan.dev
https://imamhasan.dev
`,
      html: `
        <div style="background-color: #070708; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; border: 1px solid #333333; border-radius: 12px; padding: 40px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <div align="center" style="margin-bottom: 30px;">
            <h1 style="font-size: 2.2rem; font-weight: 300; letter-spacing: 2px; margin: 0; color: #ffffff;">
              <span style="border: 2px solid #ffffff; padding: 5px 15px; display: inline-block;">Imam Hasan</span>
            </h1>
            <p style="color: #777777; font-size: 0.9rem; margin-top: 10px; text-transform: uppercase; letter-spacing: 3px;">Creative Web & App Developer</p>
          </div>
          
          <div style="border-top: 1px solid #222222; border-bottom: 1px solid #222222; padding: 30px 0; margin-bottom: 30px;">
            <p style="font-size: 1.1rem; line-height: 1.8; font-weight: 300; margin-top: 0; color: #dddddd;">Hi ${name},</p>
            <p style="font-size: 1.1rem; line-height: 1.8; font-weight: 300; color: #bbbbbb;">
              Thank you for reaching out! I have successfully received your message and will review it shortly.
            </p>
            <p style="font-size: 1.1rem; line-height: 1.8; font-weight: 300; color: #bbbbbb; margin-bottom: 0;">
              By blending modern technology with a devotion to absolute visual aesthetics, I aim to craft premium digital experiences. I will get back to you personally as soon as possible to discuss how we can bring your ideas to life.
            </p>
          </div>
          
          <div align="center">
            <a href="https://imamhasan.dev" style="background-color: #ffffff; color: #000000; text-decoration: none; padding: 12px 30px; font-weight: 600; font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase; border-radius: 4px; display: inline-block;">
              Visit Website
            </a>
          </div>
          
          <div style="margin-top: 40px; text-align: center; font-size: 0.8rem; color: #555555; border-top: 1px solid #111111; padding-top: 20px;">
            <p style="margin: 0 0 5px 0;">Copyright &copy; 2026 Imam Hasan Emon | All Rights Reserved</p>
            <p style="margin: 0;">You received this automated email because you submitted a contact form on <a href="https://imamhasan.dev" style="color: #ffffff; text-decoration: underline;">imamhasan.dev</a>.</p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(autoReplyOptions);
    } catch (autoReplyError) {
      // Log auto-reply error but don't fail the contact submission
      console.error("Auto-Reply Mailer Error:", autoReplyError);
    }

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
