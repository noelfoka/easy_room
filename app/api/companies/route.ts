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

    // si l'utilisateur n'existe pas
    if(!user) {
      return NextResponse.json(
        { message: "L'utilisateur n'existe pas" },
        { status: 404 }
      )
    }

    // Vérifier si la company existe déjà dans la base de données
    const existingCompany = await prisma.company.findUnique({
      where: {name: companyName}
    });

  } catch (error) {
    console.error('Erreur api companies', error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la création de la company" },
      { status: 500 }
    )
  }
}