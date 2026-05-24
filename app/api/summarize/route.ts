import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

function validateFile(file: File): string | null {
  const MAX_SIZE_MB = 10;
  if (file.type !== "application/pdf") return "Hanya file PDF yang diizinkan";
  if (file.size > MAX_SIZE_MB * 1024 * 1024) return `Ukuran file maksimal ${MAX_SIZE_MB}MB`;
  return null;
}

function jsonResponse(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return jsonResponse({ success: false, error: "File tidak ditemukan" }, 400);
    }

    const validationError = validateFile(file);
    if (validationError) {
      return jsonResponse({ success: false, error: validationError }, 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64,
        },
      },
      {
        text: `Buat ringkasan terstruktur dari dokumen ini dalam Bahasa Indonesia.

Jangan gunakan simbol markdown seperti **, ##, atau * dalam jawabanmu. Tulis dalam bentuk teks biasa yang mudah dibaca.

Format output:
Ringkasan Singkat
(1-2 kalimat gambaran umum dokumen)

Poin-Poin Utama
(3-5 poin penting, tulis dengan angka seperti 1. 2. 3.)

Kesimpulan
(1 paragraf kesimpulan akhir)`,
      },
    ]);

    const summary = result.response.text();

    // Buat chat baru dan simpan summary
    const chat = await prisma.chat.create({
      data: {
        userId: session.user.id,
        title: file.name,
        summary,
      },
    });

    return jsonResponse({ success: true, summary, chatId: chat.id });
  } catch (err: unknown) {
    console.error("[PDF Summary API Error]", err);
    const message = err instanceof Error ? err.message : "Terjadi kesalahan tidak diketahui";
    return jsonResponse({ success: false, error: message }, 500);
  }
}