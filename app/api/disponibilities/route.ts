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
    
  } catch (error) {
    console.error("Erreur api disponibilities", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la récupération des salles disponibles" },
      { status: 500 }
    );
  }
}