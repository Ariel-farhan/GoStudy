import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ reply: "Unauthorized" }, { status: 401 });
    }

    const { message, summary, chatId, title } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ reply: "Pesan tidak boleh kosong." }, { status: 400 });
    }

    // Ambil atau buat chat baru
    let chat;
    if (chatId) {
      chat = await prisma.chat.findUnique({ where: { id: chatId } });
    }

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          userId: session.user.id,
          title: title || message.slice(0, 50),
          summary: summary || null,
        },
      });
    }

    // Simpan pesan user dulu
    await prisma.message.create({
      data: {
        chatId: chat.id,
        role: "user",
        text: message,
      },
    });

    // Generate AI reply
    let reply: string;
    try {
      const prompt = summary
        ? `Kamu adalah asisten AI yang membantu pengguna memahami dokumen PDF.

Berikut adalah ringkasan dokumen yang sudah diupload pengguna:
${summary}

Jawab pertanyaan pengguna berdasarkan dokumen tersebut. Jika pertanyaan di luar konteks dokumen, tetap jawab dengan helpful.

Gunakan bahasa yang natural dan mudah dipahami. Jangan gunakan simbol markdown seperti **, ##, atau * dalam jawabanmu. Tulis dalam bentuk paragraf atau poin sederhana tanpa formatting khusus.

Pertanyaan: ${message}`
        : `Jawab pertanyaan berikut dengan bahasa yang natural. Jangan gunakan simbol markdown seperti **, ##, atau * dalam jawabanmu.

Pertanyaan: ${message}`;

      const result = await model.generateContent(prompt);
      reply = result.response.text();
    } catch (aiError: any) {
      // Kalau Gemini error, simpan pesan error sebagai reply AI
      const isQuotaError = aiError?.status === 429;
      reply = isQuotaError
        ? "Maaf, AI sedang tidak tersedia karena quota habis. Coba lagi beberapa saat."
        : "Maaf, terjadi kesalahan saat menghubungi AI. Coba lagi.";
    }

    // Simpan reply AI (selalu tersimpan, bahkan kalau error)
    await prisma.message.create({
      data: {
        chatId: chat.id,
        role: "ai",
        text: reply,
      },
    });

    // Update updatedAt chat
    await prisma.chat.update({
      where: { id: chat.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ reply, chatId: chat.id });
  } catch (err: unknown) {
    console.error("[Chat API Error]", err);
    const message = err instanceof Error ? err.message : "Terjadi kesalahan tidak diketahui";
    return NextResponse.json({ reply: "Error: " + message }, { status: 500 });
  }
}