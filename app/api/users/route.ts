// Api permettant d'enregistrer un nouvel utilisateur dans la base de données

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {

  try {
    // Récupération des données de l'utilisateur
    const { email, familyName, givenName } = await request.json();

    // Vérifier si les champs requis sont présents
    if (!email || !familyName || !givenName) {
      return NextResponse.json(
        { message: "Les champs 'email', 'familyName' et 'givenName' sont requis" },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Erreur api users', error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de l'enregistrement de l'utilisateur" },
      { status: 500 }
    )
  }

}