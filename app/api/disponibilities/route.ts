// Api pour afficher les salles disponibles

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {

    // recuperation des données de la requête
    const { roomId, reservationDate } = await request.json();

    // Vérifier si les champs requis sont présents
    if (!roomId || !reservationDate) {
      return NextResponse.json(
        { message: "Les informations sont incomplètes" },
        { status: 400 }
      );
    }

    // Validation du format de la date
    const datePart = reservationDate.split("/");

    if (datePart.length !== 3 || datePart[2].length !== 4) {
      return NextResponse.json(
        { message: "La date de réservation est incorrecte" },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error("Erreur api disponibilities", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la récupération des salles disponibles" },
      { status: 500 }
    );
  }
}