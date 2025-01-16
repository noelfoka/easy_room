// Api permettant d'enregistrer un nouvel utilisateur dans la base de données

import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

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

    // Vérifier si l'utilisateur existe déjà dans la base de données
    let user = await prisma.user.findUnique({
      where: {email}
    });

    // si l'utilisateur n'existe pas
    if (!user) {

      // Créer un nouvel utilisateur
      user = await prisma.user.create({
        data: {
          email,
          familyName,
          givenName
        }
      });

    } else {
      // Si l'utilisateur existe déjà, Vérifier si les informations sont à jour
      if (user.familyName == null || user.givenName == null) {

        // Mettre à jour les informations de l'utilisateur
        user = await prisma.user.update({
          where: {email},
          data: {
            familyName: user.familyName ?? familyName,
            givenName: user.givenName ?? givenName
          }
        });
      }
    }


    // Vérifier si l'utilisateur est associé à une entreprise
    const company = await prisma.company.findFirst({
      where: {employees: {
        some: {
          id: user.id
        }
      }}
    })

  } catch (error) {
    console.error('Erreur api users', error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de l'enregistrement de l'utilisateur" },
      { status: 500 }
    )
  }

}