import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { name: "gemini-3.5-flash", displayName: "Gemini 3.5 Flash" },
    { name: "gemini-2.0-flash", displayName: "Gemini 2.0 Flash" },
  ]);
}