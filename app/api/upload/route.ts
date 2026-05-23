import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: "File tidak ditemukan",
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // PDF parser (dynamic import biar aman di Next.js)
    const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
    const pdfData = await pdfParse(buffer);

    const text = pdfData.text;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
    });

    const result = await model.generateContent(
      `Buat ringkasan dari dokumen ini:\n\n${text}`
    );

    const response = await result.response;

    return NextResponse.json({
      success: true,
      text,
      summary: response.text(),
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}