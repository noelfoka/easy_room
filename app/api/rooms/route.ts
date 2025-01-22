// Api de creation de salles

import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function POST(request: Request) {
  try {

    // extraction des données de la requête
    const {action, name, capacity, description, imgUrl, companyId} = await request.json();

    // définir l'action
    if (action === "SAVE_DATA") {

      // Vérification de certaines informations
      if (!name || !capacity || !companyId) {
        return NextResponse.json(
          { message: "Les informations sont incomplètes" },
          { status: 400 }
        );
      }
      
    } else if (action === "SAVE_IMAGE") {}

  } catch (error) {
    console.error("Erreur api rooms", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la création de la salle" },
      { status: 500 }
    );
  }
}