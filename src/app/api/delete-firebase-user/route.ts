import { NextResponse } from "next/server";
import { auth as adminAuth } from "@/lib/firebase-admin"; // Verifique se a importação está correta

export async function POST(req: Request) {
  try {
    const { uid } = await req.json();
    console.log("UID recebido:", uid);  // Verifica se o UID está sendo enviado corretamente

    if (!uid) {
      console.error("UID não fornecido");
      return NextResponse.json({ error: "UID não fornecido" }, { status: 400 });
    }

    // Tenta deletar o usuário do Firebase Auth
    await adminAuth.deleteUser(uid);
    console.log("Usuário deletado com sucesso");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao deletar usuário do Firebase Auth:", error);
    return NextResponse.json(
      { error: "Erro ao deletar do Firebase Authentication" },
      { status: 500 }
    );
  }
}
