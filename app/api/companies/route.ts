// Api de création de companies

import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function POST(request: Request) {
  try {
    // extraction des données de la requête
    const { email, companyName } = await request.json();

    // Vérifier si les champs requis sont présents
    if (!email || !companyName) {
      return NextResponse.json(
        { message: "Les champs 'email' et 'companyName' sont requis" },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe déjà dans la base de données
    const user = await prisma.user.findUnique({
      where: {email}
    });

  } catch (error) {
    console.error('Erreur api companies', error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la création de la company" },
      { status: 500 }
    )
  }
}