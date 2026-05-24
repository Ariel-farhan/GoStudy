import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email diperlukan" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Selalu return success meski email tidak ditemukan (security)
    if (!user) {
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 jam

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"StudyAI" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Reset Password StudyAI",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <div style="margin-bottom: 24px;">
            <h2 style="margin: 0; font-size: 24px;">Reset Password</h2>
          </div>
          <p style="color: #555; line-height: 1.6;">
            Kamu meminta reset password untuk akun StudyAI kamu.
            Klik tombol di bawah untuk membuat password baru.
            Link ini berlaku selama <strong>1 jam</strong>.
          </p>
          <a href="${resetUrl}"
            style="display:inline-block;margin:24px 0;padding:12px 28px;background:linear-gradient(to right,#7c3aed,#2563eb);color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
            Reset Password
          </a>
          <p style="color: #888; font-size: 13px;">
            Jika kamu tidak meminta reset password, abaikan email ini.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Forgot Password Error]", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}