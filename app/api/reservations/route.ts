// Api route pour les reservations
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface ReservationRequest {
  email: string;
  roomId: string;
  reservationDate: string;
  timeSlots: string [];
}

export async function POST(request: NextRequest) {
  try {

    // recuperation des données de la requête
    const body = await request.text();
    const { email, roomId, reservationDate, timeSlots }: ReservationRequest = JSON.parse(body);

    // Vérifier si les champs requis sont présents
    if (!email || !roomId || !reservationDate || !timeSlots || !Array.isArray(timeSlots)) {
      return NextResponse.json(
        { message: "Les informations sont incomplètes et timeSlots doit être un tableau" },
        { status: 400 }
      );
    }

    // Recherche de l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Si l'utilisateur n'est pas trouvé
    if (!user) {
      return NextResponse.json(
        { message: "L'utilisateur n'est pas trouvé" },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error("Erreur api reservations", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la création de la reservation" },
      { status: 500 }
    );
  }
}