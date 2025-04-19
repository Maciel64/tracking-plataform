import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Inicializa o Firebase Admin uma única vez
let app: App;

if (!getApps().length) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, // Certifique-se de que esta variável está correta
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Substitui corretamente as quebras de linha
    }),
  });
} else {
  app = getApps()[0];
}

// Exporta a instância de auth
export const auth = getAuth(app);
