import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }
    
    // Validações
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Arquivo muito grande (máx 5MB)" },
        { status: 400 }
      );
    }
    
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato não permitido. Use JPG, PNG ou WEBP." },
        { status: 400 }
      );
    }
    
    // Upload para Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });
    
    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload" },
      { status: 500 }
    );
  }
}
